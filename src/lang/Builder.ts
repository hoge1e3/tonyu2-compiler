import Tonyu from "../runtime/TonyuRuntime";
import TError from "../runtime/TError";
import R from "../lib/R";
import { isTonyu1 } from "./tonyu1";
import JSGenerator = require("./JSGenerator");
import {IndentBuffer} from "./IndentBuffer";
import * as Semantics from "./Semantics";
import { SourceFiles, SourceFile, sourceFiles } from "./SourceFiles";
import { checkExpr, checkTypeDecl } from "./TypeChecker";
import { Meta, MetaMap } from "../runtime/RuntimeTypes";
import { BuilderContext, BuilderContextDef, BuilderEnv, CompilerOptions, C_Meta, C_MetaMap, Destinations, GenOptions, isFileDest, isMemoryDest } from "./CompilerTypes";
import { SFile } from "../lib/SFileType";

//type ClassMap={[key: string]:Meta};
//const langMod=require("./langMod");
function orderByInheritance(classes:C_MetaMap):C_Meta[] {/*ENVC*/
    var added={};
    var res=[];
    //var crumbs={};
    var ccnt=0;
    for (var n in classes) {/*ENVC*/
        added[n]=false;
        ccnt++;
    }
    while (res.length<ccnt) {
        var p=res.length;
        for (let n in classes) {/*ENVC*/
            if (added[n]) continue;
            var c=classes[n];/*ENVC*/
            var deps=dep1(c);
            if (deps.length==0) {
                res.push(c);
                added[n]=true;
            }
        }
        if (res.length==p) {
            //var loop=[];
            for (let n in classes) {
                if (!added[n]) {
                    detectLoop(classes[n]);// || [];
                    break;
                }
            }
            throw TError( R("circularDependencyDetected",""), "Unknown" ,0);
        }
    }
    function dep1(c:Meta) {
        let deps=Tonyu.klass.getDependingClasses(c);
        /*var spc=c.superclass;
        var deps=spc ? [spc]:[] ;
        if (c.includes) deps=deps.concat(c.includes);*/
        deps=deps.filter(function (cl) {
            return cl && classes[cl.fullName] && !cl.builtin && !added[cl.fullName];
        });
        return deps;
    }
    function detectLoop(c:C_Meta) {
        var path=[] as string[];
        var visited={} as {[key:string]:boolean};
        function pushPath(c:C_Meta) {
            path.push(c.fullName);
            if (visited[c.fullName]) {
                throw TError( R("circularDependencyDetected",path.join("->")), "Unknown" ,0);
            }
            visited[c.fullName]=true;
        }
        function popPath() {
            var p=path.pop();
            delete visited[p];
        }
        function loop(c:C_Meta) {
            //console.log("detectLoop2",c.fullName,JSON.stringify(visited));
            pushPath(c);
            var dep=dep1(c);
            dep.forEach(loop);
            popPath();
        }
        loop(c);
    }
    return res;
}

// includes langMod, dirBase
export = class Builder {
    prj: any;
    env: BuilderEnv;
	// Difference from TonyuProject
	//    projectCompiler defines projects of Tonyu 'Language'.
	//    Responsible for transpilation.
	//var traceTbl=Tonyu.TraceTbl;//();
	//var F=DU.throwF;
	//TPR.env.traceTbl=traceTbl;
	/*
	env: {
		options: options.json
		classes: classMeta of all projects(usually ===Tonyu.classMetas)
		aliases: shortName->fullName
		(parsedNode:) NO USE
		(amdPaths:) optional
		(traceTbl:) NO USE
	}
	ctx: {
		(visited:) not used??
		classes: ===env.classes===Tonyu.classMetas
		options: compile option( same as options.json:compiler?? )
	}
	*/
    constructor (prj) {// langMod + dirBase
        this.prj=prj;
    }
    isTonyu1() {
        const options=this.getOptions();
        return isTonyu1(options);
    }
    getOptions() {return this.prj.getOptions();}
    getOutputFile(...f:SFile[]) {return this.prj.getOutputFile(...f);}
    getNamespace():string {return this.prj.getNamespace();}
    getDir(){return this.prj.getDir();}
    getEXT(){return this.prj.getEXT();}
    sourceFiles(ns?:string){return this.prj.sourceFiles();}
    loadDependingClasses(ctx:BuilderContext):Promise<void>{return this.prj.loadDependingClasses(ctx);}
    getEnv() {
        //this.env=this.env||{};
        if (this.env) {
            this.env.options=this.env.options||this.getOptions();
            this.env.aliases=this.env.aliases||{};
        } else {
            this.env={
                options: this.getOptions(),
                aliases:{},
                classes: Tonyu.classMetas as C_MetaMap,
                unresolvedVars: 0,
                //amdPaths:[],
            };
        }
        //this.env.options=this.env.options||this.getOptions();
        //this.env.aliases=this.env.aliases||{};
        return this.env;
    }
    // Difference of ctx and env:  env is of THIS project. ctx is of cross-project
	initCtx(ctx:BuilderContext|BuilderContextDef):BuilderContext {
		//どうしてclassMetasとclassesをわけるのか？
		// metaはFunctionより先に作られるから
		//if (!ctx) ctx={};
        function isBuilderContext(ctx:any):ctx is BuilderContext {
            return ctx && ctx.classes && ctx.options;
        }
		if (isBuilderContext(ctx)) return ctx;
        const env=this.getEnv();
		return {/*visited:{},*/ classes:(env.classes=env.classes||(Tonyu.classMetas as C_MetaMap)),options:ctx||{}};
	}
	requestRebuild () {
		var env=this.getEnv();
        env.options=this.getOptions();
		for (let k of this.getMyClasses()) {
            console.log("RMMeta", k.fullName);
			delete env.classes[k.fullName];
		}
        const myNsp=this.getNamespace();
        Tonyu.klass.removeMetaAll(myNsp);
	}
	getMyClasses() {
		var env=this.getEnv();
		var ns=this.getNamespace();
		const res:C_Meta[]=[];
		for (var kn in env.classes) {
			var k=env.classes[kn];
			if (k.namespace==ns) {
				res.push(k);
			}
		}
		return res;
	}

	fileToClass(file: SFile) {
		const shortName=this.fileToShortClassName(file);
		const env=this.getEnv();
        const fullName=env.aliases[shortName];
		if (!fullName) return null;
		let res=env.classes[fullName];
		return res;
	}
	postChange (file: SFile) {// postChange is for file(s), modify files before call
        // It may fails before call fullCompile
		const classMeta=this.fileToClass(file);
		if (!classMeta) {
			// new file added ( no dependency <- NO! all file should compile again!)
            // Why?  `new Added`  will change from `new _this.Added` to `new Tonyu.classes.user.Added`
			const m=this.addMetaFromFile(file);
			const c={};c[m.fullName]=m;
            // TODO aliases?
			return this.partialCompile(c);
		} else {
			// existing file modified
			console.log("Ex",classMeta.fullName);
			return this.partialCompile(this.reverseDependingClasses(classMeta));
		}
	}
	reverseDependingClasses (klass:Meta) {
		// TODO: cache
		const dep={};
		dep[klass.fullName]=klass;
        let mod=false;
		do {
			mod=false;
        	for(let k of this.getMyClasses()) {
        		if (dep[k.fullName]) continue;
				for (let k2 of Tonyu.klass.getDependingClasses(k)) {
        			if (dep[k2.fullName]) {
						dep[k.fullName]=k;
						mod=true;
						break;
					}
				}
			}
		} while(mod);
		//console.log("revdep",Object.keys(dep));
		return dep;
	}
    parse(f:SFile) {
        const klass=this.addMetaFromFile(f);
        return Semantics.parse(klass);
    }
    fileToShortClassName(f:SFile):string {
        const s=f.truncExt(this.getEXT());
        return this.isTonyu1()?s.toLowerCase():s;
    }
	addMetaFromFile(f:SFile) {
		const env=this.getEnv();
		const shortCn=this.fileToShortClassName(f);
        const myNsp=this.getNamespace();
		const fullCn=myNsp+"."+shortCn;
		const m=Tonyu.klass.addMeta(fullCn,{
			fullName:  fullCn,
			shortName: shortCn,
			namespace: myNsp
		}) as C_Meta;
		m.src=m.src||{};
		m.src.tonyu=f;
		// Q.1 is resolved here
		env.aliases[shortCn]=fullCn;
		return m;
	}
	async fullCompile (_ctx?: BuilderContext| BuilderContextDef/*or options(For external call)*/) {
        const dir=this.getDir();
        const ctx=this.initCtx(_ctx);
		const ctxOpt=ctx.options ||{};
		//if (!ctx.options.hot) Tonyu.runMode=false;
		this.showProgress("Compile: "+dir.name());
		console.log("Compile: "+dir.path(), "ctx:", ctx);
		var myNsp=this.getNamespace();
		let baseClasses: C_MetaMap, env: BuilderEnv, myClasses: C_MetaMap,sf: { [shortName: string]: SFile; };
		let compilingClasses: C_MetaMap;
		ctxOpt.destinations=ctxOpt.destinations || {
			memory: true,
			file: true
		};
        this.requestRebuild();// Alternetes removeMetaAll
		await this.loadDependingClasses(ctx);// *254
        baseClasses = ctx.classes;
        env = this.getEnv();
        env.aliases = {};
        // Q2. Also remove depending classes?? (Already loaded in *254)
        //    NO! argument myNsp filters only this project classes.
        //Tonyu.klass.removeMetaAll(myNsp); // for removed files
        //env.parsedNode=env.parsedNode||{};
        env.classes = baseClasses;
        //console.log("env.classes===Tonyu.classMetas",env.classes===Tonyu.classMetas);
        for (var n in baseClasses) {
            var cl = baseClasses[n];
            // Q.1: Override same name in different namespace??
            // A.1: See definition of addMetaFromFile
            env.aliases[cl.shortName] = cl.fullName;
        }
        this.showProgress("scan sources");
        myClasses = {};
        //fileAddedOrRemoved=!!ctxOpt.noIncremental;
        sf = this.sourceFiles(myNsp);
        console.log("Sourcefiles", sf);
        for (var shortCn in sf) {
            var f = sf[shortCn];
            const m_1 = this.addMetaFromFile(f);
            myClasses[m_1.fullName] = baseClasses[m_1.fullName] = m_1;
        }
        this.showProgress("update check");
        compilingClasses = myClasses;
        console.log("compilingClasses", compilingClasses);
        return await this.partialCompile(compilingClasses, ctxOpt);
	}
	async partialCompile(compilingClasses:C_MetaMap ,ctxOpt?:BuilderContextDef):Promise<SourceFile> {// partialCompile is for class(es)
		let env=this.getEnv();
		ctxOpt=ctxOpt||{};
		const destinations:Destinations=ctxOpt.destinations || {
			memory: true
		};
		await Promise.resolve();
		for (var n in compilingClasses) {
			console.log("initClassDecl: " + n);
			// does parsing in Semantics
			Semantics.initClassDecls(compilingClasses[n], env); /*ENVC*/
		}
		await this.showProgress("order");
		const ord = orderByInheritance(compilingClasses); /*ENVC*/
		console.log("ORD", ord.map(c => c.fullName));
		ord.forEach(c_1 => {
			if (compilingClasses[c_1.fullName]) {
				console.log("annotate :" + c_1.fullName);
				Semantics.annotate(c_1, env);
			}
		});
		if (env.options.compiler.typeCheck) {
			console.log("Type check");
            let prevU:number|null=null;
            while(true) {
                env.unresolvedVars=0;
                for (let n_1 in compilingClasses) {
                    checkTypeDecl(compilingClasses[n_1], env);
                }
                for (let n_2 in compilingClasses) {
                    checkExpr(compilingClasses[n_2], env);
                }
                if (env.unresolvedVars<=0) break;
                if (typeof prevU==="number" && env.unresolvedVars>=prevU) break;    
                prevU=env.unresolvedVars;
            } 
		}
		await this.showProgress("genJS");
		//throw "test break";
		const buf = new IndentBuffer({ fixLazyLength: 6 });
		buf.traceIndex = {};
		await this.genJS(ord, {
			codeBuffer: buf,
			traceIndex: buf.traceIndex,
		});
		const s = sourceFiles.add(buf.close(), buf.srcmap /*, buf.traceIndex */);
		if (isFileDest(destinations)) {
			const outf = this.getOutputFile();
			await s.saveAs(outf);
		}
        return s;
	}
	genJS(ord: C_Meta[], genOptions:GenOptions) {
		// 途中でコンパイルエラーを起こすと。。。
        const env=this.getEnv();
		for (let c of ord) {
            console.log("genJS", c.fullName);
			JSGenerator.genJS(c, env, genOptions);
		}
		return Promise.resolve();
	}
    showProgress (m:string) {
		console.log("Progress:" ,m);
	}
	/*setAMDPaths(paths: string[]) {
		this.getEnv().amdPaths=paths;
	}*/
    async renameClassName (o:string ,n:string) {// o: key of aliases
        await this.fullCompile();
        const EXT=".tonyu";
        const env=this.getEnv();
        const changed:SFile[]=[];
        let renamingFile: SFile;
        const cls=env.classes;/*ENVC*/
        for (let cln in cls) {/*ENVC*/
            const klass=cls[cln];/*ENVC*/
            const f:SFile =klass.src ? klass.src.tonyu : null;
            const a=klass.annotation;
            let changes:{pos:number,len:number}[]=[];
            if (a && f && f.exists()) {
                if (klass.node) {// not exist when loaded from compiledProject
                    if (klass.node.ext) {
                        const spcl=klass.node.ext.superclassName;// {pos, len, text}
                        console.log("SPCl",spcl);
                        if (spcl.text===o) {
                            changes.push({pos:spcl.pos,len:spcl.len});
                        }
                    }
                    if (klass.node.incl) {
                        const incl=klass.node.incl.includeClassNames;// [{pos, len, text}]
                        console.log("incl",incl);
                        for (let e of incl) {
                            if (e.text===o) {
                                changes.push({pos:e.pos,len:e.len});
                            }
                        }
                    }
                }
                //console.log("klass.node",klass.node.ext, klass.node.incl );
                if (f.truncExt(EXT)===o) {
                    renamingFile=f;
                }
                console.log("Check", cln);
                for (let id in a) {
                    try {
                        var an=a[id];
                        var si=an.scopeInfo;
                        if (si && si.type=="class") {
                            //console.log("si.type==class",an,si);
                            if (si.name==o) {
                                var pos=an.node.pos;
                                var len=an.node.len;
                                var sub=f.text().substring(pos,pos+len);
                                if (sub==o) {
                                    changes.push({pos:pos,len:len});
                                    console.log(f.path(), pos, len, f.text().substring(pos-5,pos+len+5) ,"->",n);
                                }
                            }
                        }
                    } catch(e) {
                        console.log(e);
                    }
                }
                changes=changes.sort(function (a,b) {return b.pos-a.pos;});
                console.log(f.path(),changes);
                var src=f.text();
                var ssrc=src;
                for (let ch of changes) {
                    src=src.substring(0,ch.pos)+n+src.substring(ch.pos+ch.len);
                }
                if (ssrc!=src && !f.isReadOnly()) {
                    console.log("Refact:",f.path(),src);
                    f.text(src);
                    changed.push(f);
                }
            } else {
                console.log("No Check", cln);
            }

        }
        if (renamingFile) {
            const renamedFile=renamingFile.sibling(n+EXT);
            renamingFile.moveTo(renamedFile);
            changed.push(renamingFile);
            changed.push(renamedFile);
        }
        return changed;
    }
    serializeAnnotatedNodes() {
        const cls=this.getMyClasses();
        let idseq=1;
        let map=new Map<any,number>();
        let objs:{[key:number]:any}={};
        //let rootSrc={};
        //for (let cl of cls) {rootSrc[cl.fullName]={node:cl.node, annotation:cl.annotation};}
        let root=traverse(cls);
        if (root.REF!==1) {
            throw new Error(root.REF);
        }
        return objs;
        //console.log(JSON.stringify(objs));

        function refobj(id:number) {
            return {REF:id};
        }
        function isArray(a:any) {
            return a && typeof a.slice==="function" && 
            typeof a.map==="function" && typeof a.length==="number" ;
        }
        function isNativeSI(a:any) {
            return a.type==="native" && a.value;
        }
        function isSFile(path:any) {
            return path && typeof (path.isSFile)=="function" && path.isSFile();
        }
        function traverse(a:any) {
            if (a && typeof a==="object") {
                if (map.has(a)) {
                    return refobj(map.get(a));
                }
                let id=idseq++;
                map.set(a, id);
                let res:any;
                if (isSFile(a)) {
                    res={isSFile:true, path:a.path()};
                } else if (isArray(a)) {
                    res=a.map(traverse);
                } else {
                    res={};
                    let nsi=isNativeSI(a);
                    for (let k of Object.keys(a)) {
                        if (nsi && k==="value") continue;
                        if (k==="toString") continue;
                        res[k]=traverse(a[k]);
                    }
                }
                objs[id]=res;
                return refobj(id);
            } else if (typeof a==="function") {
                return {FUNC:a.name};
            } else {
                return a;
            }
        }
    }
};
