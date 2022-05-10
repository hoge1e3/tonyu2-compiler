import Tonyu from "../runtime/TonyuRuntime";
import TError from "../runtime/TError";
import R from "../lib/R";
import { isTonyu1 } from "./tonyu1";
import JSGenerator = require("./JSGenerator");
import IndentBuffer from "./IndentBuffer";
import * as Semantics from "./Semantics";
import SourceFiles from "./SourceFiles";
import { checkExpr, checkTypeDecl } from "./TypeChecker";
import { Meta, MetaMap } from "../runtime/RuntimeTypes";
import { BuilderContext, CompileOptions, C_Meta, C_MetaMap, Destinations, isBuilderContext, isFileDest, isMemoryDest } from "./CompilerTypes";

//type ClassMap={[key: string]:Meta};
//const langMod=require("./langMod");
function orderByInheritance(classes:MetaMap) {/*ENVC*/
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
    function detectLoop(c) {
        var path=[];
        var visited={};
        function pushPath(c) {
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
        function loop(c) {
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

/*interface BuilderContext{
    visited:{[key:string]: boolean}, classes:{[key:string]: },options:ctx
}*/
// includes langMod, dirBase
export = class Builder {
    prj: any;
    env: any;
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
    getOutputFile(...f) {return this.prj.getOutputFile(...f);}
    getNamespace():string {return this.prj.getNamespace();}
    getDir(){return this.prj.getDir();}
    getEXT(){return this.prj.getEXT();}
    sourceFiles(ns?:string){return this.prj.sourceFiles();}
    loadDependingClasses(ctx:BuilderContext){return this.prj.loadDependingClasses(ctx);}
    getEnv() {
        this.env=this.env||{};
        this.env.options=this.env.options||this.getOptions();
        this.env.aliases=this.env.aliases||{};
        return this.env;
    }
	requestRebuild () {
		var env=this.getEnv();
        env.options=this.getOptions();
		for (let k of this.getMyClasses()) {
			delete env.classes[k];
		}
	}
	getMyClasses() {
		var env=this.getEnv();
		var ns=this.getNamespace();
		const res=[];
		for (var kn in env.classes) {
			var k=env.classes[kn];
			if (k.namespace==ns) {
				res.push(k);
			}
		}
		return res;
	}
	// Difference of ctx and env:  env is of THIS project. ctx is of cross-project
	initCtx(ctx:BuilderContext|CompileOptions={}):BuilderContext {
		//どうしてclassMetasとclassesをわけるのか？
		// metaはFunctionより先に作られるから
		var env=this.getEnv();
		//if (!ctx) ctx={};
		if (isBuilderContext(ctx)) return ctx;
		return {visited:{}, classes:(env.classes=env.classes||Tonyu.classMetas),options:ctx};
	}
	fileToClass(file) {
		const shortName=this.fileToShortClassName(file);
		const env=this.getEnv();
        const fullName=env.aliases[shortName];
		if (!fullName) return null;
		let res=env.classes[fullName];
		return res;
	}
	postChange (file) {// postChange is for file(s), modify files before call
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
    parse(f) {
        const klass=this.addMetaFromFile(f);
        return Semantics.parse(klass);
    }
    fileToShortClassName(f):string {
        const s=f.truncExt(this.getEXT());
        return this.isTonyu1()?s.toLowerCase():s;
    }
	addMetaFromFile(f) {
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
	fullCompile (ctx?/*or options(For external call)*/) {
        const dir=this.getDir();
        ctx=this.initCtx(ctx);
		const ctxOpt=ctx.options ||{};
		//if (!ctx.options.hot) Tonyu.runMode=false;
		this.showProgress("Compile: "+dir.name());
		console.log("Compile: "+dir.path());
		var myNsp=this.getNamespace();
		let baseClasses,env,myClasses,sf;
		let compilingClasses: C_MetaMap;
		ctxOpt.destinations=ctxOpt.destinations || {
			memory: true,
			file: true
		};
		return this.loadDependingClasses(ctx).then(()=>{
			baseClasses=ctx.classes;
			env=this.getEnv();
			env.aliases={};
            Tonyu.klass.removeMetaAll(myNsp);// for removed files
			//env.parsedNode=env.parsedNode||{};
			env.classes=baseClasses;
			//console.log("env.classes===Tonyu.classMetas",env.classes===Tonyu.classMetas);
			for (var n in baseClasses) {
				var cl=baseClasses[n];
				// Q.1: Override same name in different namespace??
				// A.1: See below
				env.aliases[ cl.shortName] = cl.fullName;
			}
			return this.showProgress("scan sources");
		}).then(()=>{
			myClasses={};
			//fileAddedOrRemoved=!!ctxOpt.noIncremental;
			sf=this.sourceFiles(myNsp);
			console.log("Sourcefiles",sf);
			for (var shortCn in sf) {
				var f=sf[shortCn];
				const m=this.addMetaFromFile(f);
				myClasses[m.fullName]=baseClasses[m.fullName]=m;
			}
			return this.showProgress("update check");
		}).then(()=>{
			compilingClasses=myClasses;
			console.log("compilingClasses",compilingClasses);
			return this.partialCompile(compilingClasses,ctxOpt);
			//return TPR.showProgress("initClassDecl");
		});
	}
	partialCompile(compilingClasses:C_MetaMap ,ctxOpt:CompileOptions={}) {// partialCompile is for class(es)
		let env=this.getEnv(),ord,buf;
		//ctxOpt=ctxOpt||{};
		const destinations:Destinations=ctxOpt.destinations || {
			memory: true
		};
		return Promise.resolve().then(()=>{
			for (var n in compilingClasses) {
				console.log("initClassDecl: "+n);
                // does parsing in Semantics
				Semantics.initClassDecls(compilingClasses[n], env);/*ENVC*/
			}
			return this.showProgress("order");
		}).then(()=>{
			ord=orderByInheritance(compilingClasses);/*ENVC*/
			console.log("ORD",ord.map(c=>c.fullName));
			ord.forEach(c=>{
				if (compilingClasses[c.fullName]) {
					console.log("annotate :"+c.fullName);
					Semantics.annotate(c, env);
				}
			});
			if (ctxOpt.typeCheck) {
                console.log("Type check");
				for (let n in compilingClasses) {
					checkTypeDecl(compilingClasses[n],env);
				}
				for (let n in compilingClasses) {
					checkExpr(compilingClasses[n],env);
				}
			}
			return this.showProgress("genJS");
		}).then(()=>{
			//throw "test break";
			buf=IndentBuffer({fixLazyLength:6});
			buf.traceIndex={};
			return this.genJS(ord,{
				codeBuffer: buf,
				traceIndex:buf.traceIndex,
			});
		}).then(()=>{
			const s=SourceFiles.add(buf.close(), buf.srcmap/*, buf.traceIndex */);
			let task:any=Promise.resolve();
			if (isFileDest(destinations)) {
				const outf=this.getOutputFile();
				task=s.saveAs(outf);
			}
			if (isMemoryDest(destinations)) {
				task=task.then(e=>s);
			}
			return task;
			//console.log(buf.close(),buf.srcmap.toString(),traceIndex);
		});
	}
	genJS(ord, genOptions) {
		// 途中でコンパイルエラーを起こすと。。。
        var env=this.getEnv();
		for (let c of ord) {
            console.log("genJS", c.fullName);
			JSGenerator.genJS(c, env, genOptions);
		}
		return Promise.resolve();
	}
    showProgress (m) {
		console.log("Progress:" ,m);
	}
	setAMDPaths(paths) {
		this.getEnv().amdPaths=paths;
	}
    renameClassName (o,n) {// o: key of aliases
        return this.fullCompile().then(()=>{
            const EXT=".tonyu";
            const env=this.getEnv();
            const changed=[];
            let renamingFile;
            var cls=env.classes;/*ENVC*/
            for (var cln in cls) {/*ENVC*/
                var klass=cls[cln];/*ENVC*/
                var f=klass.src ? klass.src.tonyu : null;
                var a=klass.annotation;
                var changes=[];
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
                    for (var id in a) {
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
        });
    }

};
