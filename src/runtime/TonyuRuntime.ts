import R from "../lib/R.js";
import {IT,IT2} from "./TonyuIterator.js";
import {TonyuThread} from "./TonyuThread.js";
import { ClassDefinition, ClassDefinitionContext, ClassTree, ClassTreeRoot, isTonyuClass, Meta, TonyuClass, TonyuShimClass } from "./RuntimeTypes.js";
import TError from "./TError.js";
import { ProjectOptions } from "../lang/CompilerTypes.js";

const reservedWords=[
    "abstract",    "arguments",    "await",    "boolean",    "break",    "byte",
    "case",    "catch",    "char",    "class",    "const",    "continue",
    "debugger",    "default",    "delete",    "do",    "double",
    "else",    "enum",    "eval",    "export",    "extends",    "false",
    "final",    "finally",    "float",    "for",    "function",    "goto",
    "if",    "implements",    "import",    "in",    "instanceof",    "int",
    "interface",    "let",    "long",    "native",    "new",    "null",
    "package",    "private",    "protected",    "public",    "return",
    "short",    "static",    "super",    "switch",    "synchronized",
    "this",    "throw",    "throws",    "transient",    "true",    "try",    "typeof",
    "var",    "void",    "volatile",    "while",    "with",    "yield"
];

function thread() {
	var t=new TonyuThread(Tonyu);
	t.handleEx=handleEx;
	return t;
}
function timeout(t:number) {
	return new Promise(function (s) {
		setTimeout(s,t);
	});
}
/*function animationFrame() {
	return new Promise( function (f) {
		requestAnimationFrame(f);
	});
}*/
const propReg=/^__([gs]et)ter__(.*)$/;
const property={
	isPropertyMethod(name:string) {
		return propReg.exec(name);
	},
	methodFor(type:"get"|"set", name:string) {
		return `__${type}ter__${name}`;
	}
};
function handleEx(e:Error) {
	Tonyu.onRuntimeError(e);
}
function addMeta(fn:string,m:Partial<Meta>):Meta {
	// why use addMeta?
	// because when compiled from source, additional info(src file) is contained.
	// k.meta={...} erases these info
	return extend(klass.getMeta(fn), m);
}
function getMeta(klass: Meta|TonyuClass):Meta {
	if (isTonyuClass(klass)) return klass.meta;
	return klass;
}
var klass={
	addMeta,
	removeMeta(n:string) {
		delete classMetas[n];
	},
	removeMetaAll(ns:string) {
		ns+=".";
		for (let n in classMetas) {
			if (n.substring(0,ns.length)===ns) delete classMetas[n];
		}
	},
	getMeta(k:string|Function):Meta {// Class or fullName
		if (typeof k=="function") {
			return (k as any).meta as Meta;
		} else /*if (typeof k=="string")*/{
			var mm = classMetas[k];
			if (!mm) classMetas[k]=mm={} as Meta;
			return mm;
		}
	},
	ensureNamespace(top:ClassTreeRoot,nsp:string) {
		var keys=nsp.split(".");
		var o=top as any;
		var i;
		for (i=0; i<keys.length; i++) {
			var k=keys[i];
			if (!o[k]) o[k]={};
			o=o[k];
		}
		return o;
	},
	hasNamespace(top:ClassTreeRoot,nsp:string) {
		return nsp in top;
	},
/*Function.prototype.constructor=function () {
	throw new Error("This method should not be called");
};*/
	propReg,
	property,
	define(params:ClassDefinition) {
		// fullName, shortName,namspace, superclass, includes, methods:{name/fiber$name: func}, decls
		var parent=params.superclass;
		var includes=params.includes;
		var fullName=params.fullName;
		var shortName=params.shortName;
		var namespace=params.namespace;
		var methodsF=params.methods;
		var decls=params.decls;
		var nso=klass.ensureNamespace(Tonyu.classes, namespace);
		//var outerRes;
		type ClassCheckContext={
			path:Meta[],
		};
		function addKlassAndNameToDecls(klass:ClassDefinition|Meta) {
			for (let name of Object.keys(decls.fields)) {
				Object.assign(klass.decls.fields[name],{name, klass});
			}
			for (let name of Object.keys(decls.methods)) {
				Object.assign(klass.decls.methods[name],{name, klass});
			}
		}

		//type ShimMeta=Meta & {isShim?:boolean, extenderFullName?:string};
		function chkmeta(m:Meta, ctx?:ClassCheckContext) {
			ctx=ctx||{path:[]};
			//if (ctx.isShim) return m;
			//ctx.path=ctx.path||[];
			ctx.path.push(m);
			if ( (m as any).isShim) {
				console.log("chkmeta::ctx",ctx);
				throw new Error("Shim found "+(m as any).extenderFullName);
			}
			if (m.superclass) chkmeta(m.superclass,ctx);
			if (!m.includes) {
				console.log("chkmeta::ctx",ctx);
				throw new Error("includes not found");
			}
			m.includes.forEach(function (mod) {
				chkmeta(mod,ctx);
			});
			ctx.path.pop();
			return m;
		}
		function chkclass(c: TonyuClass, ctx?:ClassCheckContext) {
			if (!c.prototype.hasOwnProperty("getClassInfo")) throw new Error("NO");
			if (!c.meta) {
				console.log("metanotfound",c);
				throw new Error("meta not found");
			}
			chkmeta(c.meta,ctx);
			return c;
		}
		function extender(_parent:TonyuClass|TonyuShimClass|null, ctx:ClassDefinitionContext):TonyuShimClass {
			let parent:TonyuShimClass|null=_parent;
			var isShim=!ctx.init;
			var includesRec=ctx.includesRec;
			if (includesRec[fullName]) {
				if (!parent) throw new Error(R("includesCannotBeUsedWithoutSuperclass"))
				return parent;
			}
			includesRec[fullName]=true;
			//console.log(ctx.initFullName, fullName);//,  includesRec[fullName],JSON.stringify(ctx));
			for (let m of includes) {
				if (!parent) throw new Error(R("includesCannotBeUsedWithoutSuperclass"))
				parent=m.extendFrom(parent,extend(ctx,{init:false}));
			};
			var methods=typeof methodsF==="function"? methodsF(parent):methodsF;
			/*if (typeof Profiler!=="undefined") {
				Profiler.profile(methods, fullName);
			}*/
			var init=methods.initialize;
			delete methods.initialize;
			function exprWithName(name:string, expr:string, bindings:{[key:string]:any}) {
				const bnames=Object.keys(bindings);
				if (reservedWords.includes(name)) name="_"+name;
    			const f=new Function(...bnames, `const ${name}=${expr}; return ${name};`);
    			return f(...bnames.map((k:any)=>bindings[k]));
			}
			const chkT=(obj:object)=>{
				if (!(obj instanceof res))
					useNew(fullName);
			};
			const superInit=(
				init   ? `init.apply(this,arguments);` :
				parent ? `parent.apply(this,arguments);` : "");
			const res=exprWithName(shortName,
				`function() {chkT(this);${superInit}}`,
				{chkT,init,parent}) as unknown as TonyuShimClass;
			res.prototype=bless(parent,{constructor:res});
			if (isShim) {
				res.meta={isShim:true,extenderFullName:fullName, func:res};
			} else {
				res.meta=addMeta(fullName,{
					fullName, shortName, namespace, decls,
					superclass:ctx.nonShimParent ? ctx.nonShimParent.meta : null,
					includesRec,
					includes:includes.map((c:TonyuClass)=>c.meta),
					func: res
				});
			}
			// methods: res's own methods(no superclass/modules)
			//res.methods=methods;
			var prot=res.prototype;
			var props={} as Record<string,1>;
			//var propReg=klass.propReg;//^__([gs]et)ter__(.*)$/;
			//var k;
			for (let k in methods) {
				if (k.match(/^fiber\$/)) continue;
				prot[k]=methods[k];
				var fbk="fiber$"+k;
				if (methods[fbk]) {
					prot[fbk]=methods[fbk];
					prot[fbk].methodInfo=prot[fbk].methodInfo||{name:k,klass:res,fiber:true};
					prot[k].fiber=prot[fbk];
				}
				if (k!=="__dummy" && !prot[k]) {
					console.log("WHY!",prot[k],prot,k);
					throw new Error("WHY!"+k);
				}
				/*if (typeof methods[k]==="boolean") {
					console.log(methods);
					throw new Error(`${k} ${methods[k]}`);
				}*/
				if (k!=="__dummy") {
					prot[k].methodInfo=prot[k].methodInfo||{name:k,klass:res};
				}
				// if profile...
				const r=property.isPropertyMethod(k);
				if (r) {
					props[r[2]]=1;
					// __(r[1]g/setter)__r[2]
					//props[r[2]]=props[r[2]]||{};
					//props[r[2]][r[1]]=prot[k];
				}
			}
			prot.isTonyuObject=true;
			//console.log("Prots1",props);
			for (let k of Object.keys(props)) {
				const desc={} as Record<string,1>;
				for (let type of ["get", "set"] as ("get"|"set")[]) {
					const tter=prot[property.methodFor(type, k)];
					if (tter) {
						desc[type]=tter;
					}
				}
				//console.log("Prots2",k, desc);
				Object.defineProperty(prot, k , desc);
			}
			prot.getClassInfo=function () {
				return res.meta;
			};
			if (isTonyuClass(res)) chkclass(res);
			return res;//chkclass(res,{isShim, init:false, includesRec:{}});
		}
		const res=extender(parent,{
			//isShim: false,
			init:true,
			//initFullName:fullName,
			includesRec:(parent?extend({},parent.meta.includesRec):{}),
			nonShimParent:parent,
		}) as TonyuClass;
		res.toString=()=>{return `[class ${fullName}]`};
		addKlassAndNameToDecls(res.meta);
		res.extendFrom=extender;
		//addMeta(fullName, res.meta);
		nso[shortName]=res;
		//outerRes=res;
		//console.log("defined", fullName, Tonyu.classes,Tonyu.ID);
		return chkclass(res);//,{isShim:false, init:false, includesRec:{}});
	},
	/*isSourceChanged(_k:Meta|TonyuClass) {
		const k:Meta=getMeta(_k);
		if (k.src && k.src.tonyu) {
			if (!k.nodeTimestamp) return true;
			return k.src.tonyu.lastUpdate()> k.nodeTimestamp;
		}
		return false;
	},
	shouldCompile(_k:Meta|TonyuClass) {
		const k:Meta=getMeta(_k);
		if (k.hasSemanticError) return true;
		if (klass.isSourceChanged(k)) return true;
		var dks=klass.getDependingClasses(k);
		for (var i=0 ; i<dks.length ;i++) {
			if (klass.shouldCompile(dks[i])) return true;
		}
	},*/
	getDependingClasses(_k:Meta|TonyuClass) {
		const k:Meta=getMeta(_k);
		var res=[] as Meta[];
		if (k.superclass) res=[k.superclass];
		if (k.includes) res=res.concat(k.includes);
		return res;
	}
};
function bless( klass:TonyuShimClass|null, val:object) {
	if (!klass) return extend({},val);
	return extend( Object.create(klass.prototype) , val);
	//return extend( new klass() , val);
}
function extend (dst:any, src:any) {
	if (src && typeof src=="object") {
		for (var i in src) {
			dst[i]=src[i];
		}
	}
	return dst;
}

//alert("init");
const globals:{[key:string]:any}={};

var classes:ClassTreeRoot={};// classes.namespace.classname= function
var classMetas:{[key:string]:Meta}={}; // classes.namespace.classname.meta ( or env.classes / ctx.classes)
function setGlobal(n:string,v:any) {
	globals[n]=v;
}
function getGlobal(n:string) {
	return globals[n];
}
function getClass(n:string):TonyuClass|undefined {
	//CFN: n.split(".")
	var ns=n.split(".");
	var _res:ClassTree|undefined=classes;
	let na:string;
	while (ns.length) {
		na=ns.shift()!;
		_res=_res[na];
		if (!_res) break;
		if (typeof _res==="function") {
			if (ns.length) {
				_res=undefined;
			}
			break;
		}
	}
	let res=_res;
	if (!res && n.split(".").length==1) {
		let found:string|undefined;
		for (let nn in classes) {
			const e=classes[nn];
			if (typeof e!=="object") continue;
			const nr=e[n];
			if (typeof nr==="function") {
				if (!found) { res=nr; found=nn+"."+n; }
				else throw new Error(R("ambiguousClassName",nn,n,found));
			}
		}
	}
	if (typeof res!=="function")return undefined;
	return res;
	//if (res instanceof Function) return res;//classes[n];
	//throw new Error(`Not a class: ${n}`);
}
function bindFunc(t:object,meth:any) {
	if (typeof meth!="function") return meth;
	var res:any=function () {
		return meth.apply(t,arguments);
	};
	res.methodInfo=Tonyu.extend({thiz:t},meth.methodInfo||{});
	if (meth.fiber) {
		res.fiber=function fiber_func() {
			return meth.fiber.apply(t,arguments);
		};
		res.fiber.methodInfo=Tonyu.extend({thiz:t},meth.fiber.methodInfo||{});
	}
	return res;
}
function invokeMethod(t:object, name:string, args:any[], objName:string) {
	if (!t) throw new Error(R("cannotInvokeMethod",objName,t,name));
	var f=(t as any)[name];
	if (typeof f!="function") throw new Error(R("notAMethod", (objName=="this"? "": objName+"."),name,f));
	return f.apply(t,args);
}
function callFunc(f:Function,args:any[], fName:string) {
	if (typeof f!="function") throw new Error(R("notAFunction",fName));
	return f.apply({},args);
}
function checkNonNull(v:any, name:string) {
	if (v!=v || v==null) throw new Error(R("uninitialized",name,v));
	return v;
}
function A(args:any[]) {
	var res=[];
	for (var i=1 ; i<args.length; i++) {
		res[i-1]=args[i];
	}
	return res;
}
function useNew(c:string) {
	throw new Error(R("newIsRequiredOnInstanciate",c));
}
function not_a_tonyu_object(o:any) {
	console.log("Not a tonyu object: ",o);
	throw new Error(o+" is not a tonyu object");
}
function hasKey(k:any, obj:any) {
	return k in obj;
}
function run(bootClassName:string) {
	var bootClass=getClass(bootClassName);
	if (!isTonyuClass(bootClass)) throw new Error( R("bootClassIsNotFound",bootClassName));
	Tonyu.runMode=true;
	var boot=new bootClass();
	//var th=thread();
	//th.apply(boot,"main");
	var TPR=Tonyu.globals.$currentProject||Tonyu.currentProject;
	if (TPR) {
		//TPR.runningThread=th;
		TPR.runningObj=boot;
	}
	//$LASTPOS=0;
	//th.steps();
}
var lastLoopCheck=performance.now();
var prevCheckLoopCalled;
function checkLoop() {
	var now=performance.now();
	if (now-lastLoopCheck>1000) {
		resetLoopCheck(10000);
		throw new Error(R("infiniteLoopDetected"));
	}
	prevCheckLoopCalled=now;
}
function resetLoopCheck(disableTime: number) {
	lastLoopCheck=performance.now()+(disableTime||0);
}
function is(obj:any, klass:any) {
	if (typeof klass==="string") {
		return typeof obj===klass;
	}
	if (!obj) return false;
	if (!klass) return false;
	if (obj instanceof klass) return true;
	if (typeof obj.getClassInfo==="function" && isTonyuClass(klass)) {
		return obj.getClassInfo().includesRec[klass.meta.fullName];
	}
	return false;
}
function load(options:ProjectOptions, definitions:()=>void) {
	let myns="user";
	if (options.compiler && options.compiler.namespace && options.compiler.dependingProjects) {
		myns=options.compiler.namespace;
		for (let dp of options.compiler.dependingProjects) {
			if (dp.namespace && ! klass.hasNamespace(Tonyu.classes, dp.namespace)) {
				console.warn("Missing dependencies: ", dp.namespace, " is required from ",myns);
				Tonyu.loadEvent({type:"missing", from:myns, to: dp.namespace});
			}
		}
	}
	try {
		definitions();
		Tonyu.loadEvent({type:"success", namespace:myns, options});
	}catch (e) {
		Tonyu.loadEvent({type:"error", namespace:myns, e, options});
		throw e;
	}
}
//setInterval(resetLoopCheck,16);
const Tonyu={
		thread, 
		supports_await:true,
		klass, bless, extend, messages: R, load, loadEvent:(e:any)=>{},
		globals, classes, classMetas, setGlobal, getGlobal, getClass,
		timeout,
		bindFunc, not_a_tonyu_object, is,
		hasKey, invokeMethod, callFunc, checkNonNull,
		iterator:IT, iterator2:IT2, run, checkLoop, resetLoopCheck,
		currentProject: null,
		currentThread: null as TonyuThread|null,
		runMode: false,
		onRuntimeError: ((e:Error)=>{
			if (typeof alert!=="undefined") alert("Error: "+e);
			console.log(e.stack);
			throw e;
		}) as (e:Error)=>void ,TError,
		VERSION:1560828115159,//EMBED_VERSION
		A, ID:Math.random()
};
//const TT=TonyuThreadF(Tonyu);
if ((globalThis as any).Tonyu) {
	console.error("Tonyu called twice!");
	throw new Error("Tonyu called twice!");
}
(globalThis as any).Tonyu=Tonyu;
export default Tonyu;
