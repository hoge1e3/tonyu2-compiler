import R from "../lib/R";
import IT from "./TonyuIterator";
import {TonyuThread} from "./TonyuThread";
import root from "../lib/root";
import assert from "../lib/assert";
import { isTonyuClass, Meta, TonyuClass } from "../lang/RuntimeTypes";


// old browser support
if (!root.performance) {
	root.performance = {};
}
if (!root.performance.now) {
	root.performance.now = function now() {
		return Date.now();
	};
}
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
	assert.is(arguments,[String,Object]);
	return extend(klass.getMeta(fn), m);
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
	getMeta(k:string):Meta {// Class or fullName
		if (typeof k=="function") {
			return (k as any).meta as Meta;
		} else if (typeof k=="string"){
			var mm = classMetas[k];
			if (!mm) classMetas[k]=mm={} as Meta;
			return mm;
		}
	},
	ensureNamespace(top,nsp) {
		var keys=nsp.split(".");
		var o=top;
		var i;
		for (i=0; i<keys.length; i++) {
			var k=keys[i];
			if (!o[k]) o[k]={};
			o=o[k];
		}
		return o;
	},
/*Function.prototype.constructor=function () {
	throw new Error("This method should not be called");
};*/
	propReg,
	property,
	define(params:any) {
		// fullName, shortName,namspace, superclass, includes, methods:{name/fiber$name: func}, decls
		var parent=params.superclass;
		var includes=params.includes;
		var fullName=params.fullName;
		var shortName=params.shortName;
		var namespace=params.namespace;
		var methodsF=params.methods;
		var decls=params.decls;
		var nso=klass.ensureNamespace(Tonyu.classes, namespace);
		var outerRes;
		function chkmeta(m,ctx) {
			ctx=ctx||{};
			if (ctx.isShim) return m;
			ctx.path=ctx.path||[];
			ctx.path.push(m);
			if (m.isShim) {
				console.log("chkmeta::ctx",ctx);
				throw new Error("Shim found "+m.extenderFullName);
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
		function chkclass(c,ctx) {
			if (!c.prototype.hasOwnProperty("getClassInfo")) throw new Error("NO");
			if (!c.meta) {
				console.log("metanotfound",c);
				throw new Error("meta not found");
			}
			chkmeta(c.meta,ctx);
			return c;
		}
		function extender(parent,ctx) {
			var isShim=!ctx.init;
			var includesRec=ctx.includesRec;
			if (includesRec[fullName]) return parent;
			includesRec[fullName]=true;
			//console.log(ctx.initFullName, fullName);//,  includesRec[fullName],JSON.stringify(ctx));
			includes.forEach(function (m) {
				parent=m.extendFrom(parent,extend(ctx,{init:false}));
			});
			var methods=typeof methodsF==="function"? methodsF(parent):methodsF;
			/*if (typeof Profiler!=="undefined") {
				Profiler.profile(methods, fullName);
			}*/
			var init=methods.initialize;
			delete methods.initialize;
			var res;
			res=(init?
				function () {
					if (!(this instanceof res)) useNew(fullName);
					init.apply(this,arguments);
				}:
				(parent? function () {
					if (!(this instanceof res)) useNew(fullName);
					parent.apply(this,arguments);
				}:function (){
					if (!(this instanceof res)) useNew(fullName);
				})
			);
			res.prototype=bless(parent,{constructor:res});
			if (isShim) {
				res.meta={isShim:true,extenderFullName:fullName};
			} else {
				res.meta=addMeta(fullName,{
					fullName:fullName,shortName:shortName,namespace:namespace,decls:decls,
					superclass:ctx.nonShimParent ? ctx.nonShimParent.meta : null,
					includesRec:includesRec,
					includes:includes.map(function(c){return c.meta;})
				});
			}
			res.meta.func=res;
			// methods: res's own methods(no superclass/modules)
			res.methods=methods;
			var prot=res.prototype;
			var props={};
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
				const desc={};
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
			return chkclass(res,{isShim:isShim});
		}
		var res=extender(parent,{
			init:true,
			initFullName:fullName,
			includesRec:(parent?extend({},parent.meta.includesRec):{}),
			nonShimParent:parent
		});
		res.extendFrom=extender;
		//addMeta(fullName, res.meta);
		nso[shortName]=res;
		outerRes=res;
		//console.log("defined", fullName, Tonyu.classes,Tonyu.ID);
		return chkclass(res,{isShim:false});
	},
	isSourceChanged(k) {
		k=k.meta||k;
		if (k.src && k.src.tonyu) {
			if (!k.nodeTimestamp) return true;
			return k.src.tonyu.lastUpdate()> k.nodeTimestamp;
		}
		return false;
	},
	shouldCompile(k) {
		k=k.meta||k;
		if (k.hasSemanticError) return true;
		if (klass.isSourceChanged(k)) return true;
		var dks=klass.getDependingClasses(k);
		for (var i=0 ; i<dks.length ;i++) {
			if (klass.shouldCompile(dks[i])) return true;
		}
	},
	getDependingClasses(k) {
		k=k.meta||k;
		var res=[];
		if (k.superclass) res=[k.superclass];
		if (k.includes) res=res.concat(k.includes);
		return res;
	}
};
function bless( klass, val) {
	if (!klass) return extend({},val);
	return extend( Object.create(klass.prototype) , val);
	//return extend( new klass() , val);
}
function extend (dst, src) {
	if (src && typeof src=="object") {
		for (var i in src) {
			dst[i]=src[i];
		}
	}
	return dst;
}

//alert("init");
const globals:{[key:string]:any}={};

type ClassMap={[key:string]:ClassMap}|TonyuClass;
var classes:ClassMap={};// classes.namespace.classname= function
var classMetas:{[key:string]:Meta}={}; // classes.namespace.classname.meta ( or env.classes / ctx.classes)
function setGlobal(n,v) {
	globals[n]=v;
}
function getGlobal(n) {
	return globals[n];
}
function getClass(n) {
	//CFN: n.split(".")
	var ns=n.split(".");
	var res=classes;
	ns.forEach(function (na) {
		if (!res) return;
		res=res[na];
	});
	if (!res && ns.length==1) {
		var found;
		for (var nn in classes) {
			var nr=classes[nn][n];
			if (nr) {
				if (!res) { res=nr; found=nn+"."+n; }
				else throw new Error(R("ambiguousClassName",nn,n,found));
			}
		}
	}
	return res;
	//if (res instanceof Function) return res;//classes[n];
	//throw new Error(`Not a class: ${n}`);
}
function bindFunc(t,meth) {
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
function invokeMethod(t, name, args, objName) {
	if (!t) throw new Error(R("cannotInvokeMethod",objName,t,name));
	var f=t[name];
	if (typeof f!="function") throw new Error(R("notAMethod", (objName=="this"? "": objName+"."),name,f));
	return f.apply(t,args);
}
function callFunc(f,args, fName) {
	if (typeof f!="function") throw new Error(R("notAFunction",fName));
	return f.apply({},args);
}
function checkNonNull(v, name) {
	if (v!=v || v==null) throw new Error(R("uninitialized",name,v));
	return v;
}
function A(args) {
	var res=[];
	for (var i=1 ; i<args.length; i++) {
		res[i-1]=args[i];
	}
	return res;
}
function useNew(c) {
	throw new Error(R("newIsRequiredOnInstanciate",c));
}
function not_a_tonyu_object(o) {
	console.log("Not a tonyu object: ",o);
	throw new Error(o+" is not a tonyu object");
}
function hasKey(k, obj) {
	return k in obj;
}
function run(bootClassName) {
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
var lastLoopCheck=root.performance.now();
var prevCheckLoopCalled;
function checkLoop() {
	var now=root.performance.now();
	if (now-lastLoopCheck>1000) {
		resetLoopCheck(10000);
		throw new Error(R("infiniteLoopDetected"));
	}
	prevCheckLoopCalled=now;
}
function resetLoopCheck(disableTime: number) {
	lastLoopCheck=root.performance.now()+(disableTime||0);
}
function is(obj:any, klass:any) {
	if (!obj) return false;
	if (!klass) return false;
	if (obj instanceof klass) return true;
	if (typeof obj.getClassInfo==="function" && isTonyuClass(klass)) {
		return obj.getClassInfo().includesRec[klass.meta.fullName];
	}
	return false;
}
//setInterval(resetLoopCheck,16);
const Tonyu={thread, /*threadGroup:threadGroup,*/
		klass, bless, extend,
		globals, classes, classMetas, setGlobal, getGlobal, getClass,
		timeout,
		bindFunc, not_a_tonyu_object, is,
		hasKey, invokeMethod, callFunc, checkNonNull,
		iterator:IT, run, checkLoop, resetLoopCheck,
		currentProject: null,
		currentThread: null as TonyuThread,
		runMode: false,
		onRuntimeError: (e:Error)=>{
			if (root.alert) root.alert("Error: "+e);
			console.log(e.stack);
			throw e;
		},
		VERSION:1560828115159,//EMBED_VERSION
		A, ID:Math.random()};
//const TT=TonyuThreadF(Tonyu);
if (root.Tonyu) {
	console.error("Tonyu called twice!");
	throw new Error("Tonyu called twice!");
}
root.Tonyu=Tonyu;
export= Tonyu;
