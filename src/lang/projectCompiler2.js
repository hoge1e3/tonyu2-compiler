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
	/*TPR.loadClasses=function (ctx) {//ctx: ctx or options(For external call)
		Tonyu.runMode=false;
		TPR.showProgress("LoadClasses: "+dir.name());
		console.log("LoadClasses: "+dir.path());
		ctx=initCtx(ctx);
		var visited=ctx.visited||{};
		if (visited[TPR.path()]) return Promise.resolve();
		visited[TPR.path()]=true;
		return TPR.loadDependingClasses(ctx).then(function () {
			return TPR.shouldCompile();
		}).then(sc=>(sc?TPR.compile(ctx): Promise.resolve()).then(()=>{
			var outF=TPR.getOutputFile("js");
			TPR.showProgress("Eval "+outF.name());
			return evalFile(outF);//.then(F(copyToClasses));
		}));
	};*/
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

		let buf,traceIndex;
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
			/*for (var n in baseClasses) {
				if (myClasses[n] && myClasses[n].src && !myClasses[n].src.js) {
					//前回コンパイルエラーだとここにくるかも
					console.log("Class",n,"has no js src");
					fileAddedOrRemoved=true;
				}
				if (!myClasses[n] && baseClasses[n].namespace==myNsp) {
					console.log("Class",n,"is removed");
					Tonyu.klass.removeMeta(n);
					fileAddedOrRemoved=true;
				}
			}
			if (!fileAddedOrRemoved) {
				compilingClasses={};
				for (let n in myClasses) {
					if (Tonyu.klass.shouldCompile(myClasses[n])) {
						compilingClasses[n]=myClasses[n];
					}
				}
			} else {*/
				compilingClasses=myClasses;
			//}
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
			traceIndex={};
			return TPR.genJS(ord,{
				codeBuffer: buf,
				traceIndex,
			});
		}).then(function () {
			if (destinations.file) {
				const outf=TPR.getOutputFile();
				const mapFile=outf.sibling(outf.name()+".map");
				outf.text(buf.close()+"\n//# sourceMappingURL="+mapFile.name());
				mapFile.text(buf.srcmap.toString());
				return Promise.resolve(); //evalFile(outf);

			}
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
		/*return DU.each(ord,function (c) {
			console.log("genJS :"+c.fullName);
			JSGenerator.genJS(c, env);
			return TPR.showProgress("genJS :"+c.fullName);
		});*/
	};
	/*TPR.concatJS=function (ord) {
		//var cbuf="";
		var outf=TPR.getOutputFile();
		TPR.showProgress("generate :"+outf.name());
		console.log("generate :"+outf);
		var mapNode=new S.SourceNode(null,null,outf.path());
		ord.forEach(function (c) {
			var cbuf2,fn=null;
			if (typeof (c.src.js)=="string") {
				cbuf2=c.src.js+"\n";
			} else if (FS.isFile(c.src.js)) {
				fn=c.src.js.path();
				cbuf2=c.src.js.text()+"\n";
			} else {
				throw new Error("Src for "+c.fullName+" not generated ");
			}
			var snd;
			if (c.src.map) {
				snd=S.SourceNode.fromStringWithSourceMap(cbuf2,new S.SourceMapConsumer(c.src.map));
			} else {
				snd=new S.SourceNode(null,null,fn,cbuf2);
			}
			mapNode.add(snd);
		});
		var mapFile=outf.sibling(outf.name()+".map");
		var gc=mapNode.toStringWithSourceMap();
		outf.text(gc.code+"\n//# sourceMappingURL="+mapFile.name());
		mapFile.text(gc.map+"");
		return Promise.resolve(); //evalFile(outf);
	};
	TPR.hotEval=function (ord,compilingClasses) {
		//var cbuf="";
		ord.forEach(function (c) {
			if (!compilingClasses[c.fullName]) return;
			var cbuf2,fn=null;
			if (typeof (c.src.js)=="string") {
				cbuf2=c.src.js+"\n";
			} else if (FS.isFile(c.src.js)) {
				fn=c.src.js.path();
				cbuf2=c.src.js.text()+"\n";
			} else {
				throw new Error("Src for "+c.fullName+" not generated ");
			}
			console.log("hotEval ",c);//, cbuf2);
			const f=Function;
			new f(cbuf2)();
		});
	};
	TPR.hotCompile=function () {
		var options={hot:true};
		TPR.compile(options);
	};*/
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
		function detectLoopOLD(c, prev){
			//  A->B->C->A
			// c[B]=A  c[C]=B   c[A]=C
			console.log("detectloop",c.fullName);
			if (crumbs[c.fullName]) {   // c[A]
				console.log("Detected: ",c.fullName, crumbs, crumbs[c.fullName]);
				var n=c.fullName;
				var loop=[];
				var cnt=0;
				do {
					loop.unshift(n);    // A      C       B
					n=crumbs[n];        // C      B       A
					if (!n || cnt++>100) {
						console.log(n,crumbs, loop);
						throw new Error("detectLoop entered infty loop. Now THAT's scary!");
					}
				} while(n!=c.fullName);
				loop.unshift(c.fullName);
				return loop;
			}
			if (prev) crumbs[c.fullName]=prev.fullName;
			var deps=dep1(c),res;
			deps.forEach(function (d) {
				if (res) return;
				var r=detectLoop(d,c);
				if (r) res=r;
			});
			delete crumbs[c.fullName];
			return res;
		}
		return res;
	}
	/*function evalFile(f) {
		console.log("evalFile: "+f.path());
		const fn=Function;
		var lastEvaled=new fn(f.text());
		traceTbl.addSource(f.path(),lastEvaled+"");
		return Promise.resolve( lastEvaled() );
	}*/
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
