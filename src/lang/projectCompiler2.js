const Tonyu=require("../runtime/TonyuLib");
const JSGenerator=require("./JSGenerator");
const Semantics=require("./Semantics");
//const ttb=require("./");
const FS=require("../lib/FS");
const A=require("../lib/assert");
//,DU,
const CPR=require("./compiledProject");
const S=require("./source-map");
const TypeChecker=require("./TypeChecker");
const TError=require("../runtime/TError");
const IndentBuffer=require("./IndentBuffer");
const SourceFiles=require("./SourceFiles");

const TPRC=module.exports=function (dir) {
	// Difference from TonyuProject
	//    projectCompiler defines projects of Tonyu 'Language'.
	//    Responsible for transpilation.
	A(FS.isFile(dir) && dir.isDir(), "projectCompiler: "+dir+" is not dir obj");
	var TPR={env:{}};
	//var traceTbl=Tonyu.TraceTbl;//();
	//var F=DU.throwF;
	//TPR.env.traceTbl=traceTbl;
	TPR.EXT=".tonyu";
	TPR.getDir=function () {return dir;};
	TPR.getOptionsFile=function () {
		var resFile=dir.rel("options.json");
		return resFile;
	};
	TPR.getOptions=function () {
		var env=TPR.env;
		env.options={};
		var resFile=TPR.getOptionsFile();
		if (resFile.exists()) env.options=resFile.obj();
		TPR.fixOptions(env.options);
		return env.options;
	};
	TPR.fixOptions=function (opt) {
		if (!opt.compiler) opt.compiler={};
	};
	TPR.setOptions=function (opt) {
		TPR.getOptionsFile().obj(opt);
	}; // ADDJSL
	TPR.getEXT=function(){
		var opt=TPR.getOptions();
		if(!opt.language || opt.language=="js") TPR.EXT=".tonyu";
		else TPR.EXT="."+opt.language;
		return TPR.EXT;
	};
	TPR.resolve=function (rdir){
		if (rdir instanceof Array) {
			var res=[];
			rdir.forEach(function (e) {
				res.push(TPR.resolve(e));
			});
			return res;
		}
		if (typeof rdir=="string") {
			return FS.resolve(rdir, dir.path());
		}
		if (!rdir || !rdir.isDir) throw new Error("Cannot TPR.resolve: "+rdir);
		return rdir;
	};
	TPR.getClassName=function (file) {//ADDJSL
		A(FS.isFile(file));
		if (dir.contains(file)) {
			return TPR.getNamespace()+"."+file.truncExt(TPR.EXT);
		}
		var res;
		TPR.getDependingProjects().forEach(function (dp) {
			if (!res) res=dp.getClassName(file);
		});
		return res;
	};
	TPR.getName=function () { return dir.name().replace(/\/$/,""); };
	TPR.getNamespace=function () {
		var opt=TPR.getOptions();
		return A(opt.compiler.namespace,"namespace not specified opt="+JSON.stringify(opt));
	};
	TPR.getOutputFile=function (lang) {
		var opt=TPR.getOptions();
		var outF=TPR.resolve(A(opt.compiler.outputFile,"outputFile should be specified in options"));
		if (outF.isDir()) {
			throw new Error("out: directory style not supported");
		}
		return outF;
	};
	TPR.requestRebuild=function () {
		var env=this.env;
		var ns=this.getNamespace();
		for (var kn in env.classes) {
			var k=env.classes[kn];
			if (k.namespace==ns) {
				console.log("REQRB","remove env.classes.",kn);
				delete env.classes[kn];
			}
		}
	};
	TPR.removeOutputFile=function () {
		this.getOutputFile().rm();
	};
	TPR.loadDependingClasses=function (ctx) {
		var task=Promise.resolve();
		var myNsp=TPR.getNamespace();
		TPR.getDependingProjects().forEach(function (p) {
			if (p.getNamespace()==myNsp) return;
			task=task.then(function () {
				return p.loadClasses(ctx);
			});
		});
		return task;
	};
	// Difference of ctx and env:  env is of THIS project. ctx is of cross-project
	function initCtx(ctx) {
		//どうしてclassMetasとclassesをわけるのか？
		// metaはFunctionより先に作られるから
		var env=TPR.env;
		if (!ctx) ctx={};
		if (!ctx.visited) {
			ctx={visited:{}, classes:(env.classes=env.classes||Tonyu.classMetas),options:ctx};
		}
		return ctx;
	}
	TPR.fullCompile=function (ctx/*or options(For external call)*/) {
		ctx=initCtx(ctx);
		ctxOpt=ctx.options ||{};
		//if (!ctx.options.hot) Tonyu.runMode=false;
		TPR.showProgress("Compile: "+dir.name());
		console.log("Compile: "+dir.path());
		var myNsp=TPR.getNamespace();
		var baseClasses,ctxOpt,env,myClasses,sf,ord;
		var compilingClasses;
		var destinations=ctxOpt.destinations || {
			memory: true,
			file: true
		};

		let buf;
		return TPR.loadDependingClasses(ctx).then(function () {
			baseClasses=ctx.classes;
			env=TPR.env;
			env.aliases={};
			env.parsedNode=env.parsedNode||{};
			env.classes=baseClasses;
			for (var n in baseClasses) {
				var cl=baseClasses[n];
				// Q.1: Override same name in different namespace??
				// A.1: See below
				env.aliases[ cl.shortName] = cl.fullName;
			}
			return TPR.showProgress("scan sources");
		}).then(function () {
			myClasses={};
			//fileAddedOrRemoved=!!ctxOpt.noIncremental;
			sf=TPR.sourceFiles(myNsp);
			console.log("Sourcefiles",sf);
			for (var shortCn in sf) {
				var f=sf[shortCn];
				var fullCn=myNsp+"."+shortCn;
				/*if (!baseClasses[fullCn]) {
					console.log("Class",fullCn,"is added.");
					fileAddedOrRemoved=true;
				}*/
				var m=Tonyu.klass.getMeta(fullCn);
				myClasses[fullCn]=baseClasses[fullCn]=m;
				Tonyu.extend(m,{
					fullName:  fullCn,
					shortName: shortCn,
					namespace: myNsp
				});
				m.src=m.src||{};
				m.src.tonyu=f;
				// Q.1 is resolved here
				env.aliases[shortCn]=fullCn;
			}
			return TPR.showProgress("update check");
		}).then(function () {
			compilingClasses=myClasses;
			console.log("compilingClasses",compilingClasses);
			return TPR.showProgress("initClassDecl");
		}).then(function () {
			for (var n in compilingClasses) {
				console.log("initClassDecl: "+n);
				Semantics.initClassDecls(compilingClasses[n], env);/*ENVC*/
			}
			return TPR.showProgress("order");
		}).then(function () {
			ord=orderByInheritance(myClasses);/*ENVC*/
			console.log("ORD",ord);
			ord.forEach(function (c) {
				if (compilingClasses[c.fullName]) {
					console.log("annotate :"+c.fullName);
					Semantics.annotate(c, env);
				}
			});
			try {
				/*for (var n in compilingClasses) {
					TypeChecker.checkTypeDecl(compilingClasses[n],env);
				}
				for (var n in compilingClasses) {
					TypeChecker.checkExpr(compilingClasses[n],env);
				}*/
			} catch(e) {
				console.log("Error in Typecheck(It doesnt matter because Experimental)",e.stack);
			}
			return TPR.showProgress("genJS");
		}).then(function () {
			//throw "test break";
			buf=IndentBuffer({fixLazyLength:6});
			buf.traceIndex={};
			return TPR.genJS(ord,{
				codeBuffer: buf,
				traceIndex:buf.traceIndex,
			});
		}).then(function () {
			const s=SourceFiles.add(buf.close(), buf.srcmap, buf.traceIndex );
			let task=Promise.resolve();
			if (destinations.file) {
				const outf=TPR.getOutputFile();
				task=s.saveAs(outf);
			}
			if (destinations.memory) {
				task=task.then(e=>s);
			}
			return task;
			//console.log(buf.close(),buf.srcmap.toString(),traceIndex);
		});
	};
	TPR.genJS=function (ord, genOptions) {
		// 途中でコンパイルエラーを起こすと。。。
		var env=TPR.env;
		for (let c of ord) {
			JSGenerator.genJS(c, env, genOptions);
		}
		return Promise.resolve();
	};
	TPR.getDependingProjects=function () {
		var opt=TPR.getOptions();
		var dp=opt.compiler.dependingProjects || [];
		return dp.map(function (dprj) {
			if (typeof dprj=="string") {
				var prjDir=TPR.resolve(dprj);
				return TPRC(prjDir);
			} else if (typeof dprj=="object") {
				if (dprj.compiledURL) {
					return CPR(dprj.namespace, FS.expandPath(dprj.compiledURL) );
				} else {
					return CPR(dprj.namespace, TPR.resolve(dprj.compiledFile) );
				}
			}
		});
	};
	TPR.dir=dir;
	TPR.path=function () {return dir.path();};
	TPR.sourceFiles=function (nsp) {// nsp==null => all
		//nsp=nsp || TPR.getNamespace();//DELJSL
		var dirs=TPR.sourceDirs(nsp);// ADDJSL
		var res={};
		for (var i=dirs.length-1; i>=0 ; i--) {
			dirs[i].recursive(collect);
		}
		function collect(f) {
			if (f.endsWith(TPR.EXT)) {
				var nb=f.truncExt(TPR.EXT);
				res[nb]=f;
				console.log("sourceF",f.path(), f.endsWith(TPR.EXT), TPR.EXT);
			}
		}
		console.log("sourceFRes",res);

		return res;
	};
	TPR.sourceDir=function () {
		return dir;
	};
	TPR.sourceDirs=function (myNsp) {//ADDJSL  myNsp==null => All
		var dp=TPR.getDependingProjects();
		//var myNsp||TPR.getNamespace();//DELJSL
		var dirs=[dir];
		dp.forEach(function (dprj) {
			var nsp=dprj.getNamespace();
			if (!myNsp || nsp==myNsp) {
				var d=dprj.sourceDir();
				if (d) dirs.push(d);
			}
		});
		return dirs;
	};
	function orderByInheritance(classes) {/*ENVC*/
		var added={};
		var res=[];
		var crumbs={};
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
				var loop=[];
				for (let n in classes) {
					if (!added[n]) {
						loop=detectLoop(classes[n]) || [];
						break;
					}
				}
				throw TError( "次のクラス間に循環参照があります: "+loop.join("->"), "不明" ,0);
			}
		}
		function dep1(c) {
			var spc=c.superclass;
			var deps=spc ? [spc]:[] ;
			if (c.includes) deps=deps.concat(c.includes);
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
					throw TError( "次のクラス間に循環参照があります: "+path.join("->"), "不明" ,0);
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
	TPR.decodeTrace=function (desc) { // user.Test:123
		var a=desc.split(":");
		var cl=a[0],pos=parseInt(a[1]);
		var cls=cl.split(".");
		var sn=cls.pop();
		var nsp=cls.join(".");
		if (nsp==TPR.getNamespace()) {
			var sf=TPR.sourceFiles(nsp);
			for (var i in sf) {
				if (sn==i) {
					return TError("Trace info", sf[i], pos);
				}
			}
		}
	};
	TPR.showProgress=function (m) {
		console.log("Progress:" ,m);
	};
	TPR.setAMDPaths=function (paths) {
		TPR.env.amdPaths=paths;
	};
	return TPR;
};
