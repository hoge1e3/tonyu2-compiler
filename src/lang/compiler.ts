import Tonyu from "../runtime/TonyuRuntime";
import root from "../lib/root";

	/*import Tonyu = require("../runtime/TonyuRuntime");
	const ObjectMatcher=require("./ObjectMatcher");
	//const TError=require("TError");
	const root=require("../lib/root");*/
	const ScopeTypes={
			FIELD:"field", METHOD:"method", NATIVE:"native",//B
			LOCAL:"local", THVAR:"threadvar",PROP:"property",
			PARAM:"param", GLOBAL:"global",
			CLASS:"class", MODULE:"module"
	};
	class ST_LOCAL {
		tyoe=ScopeTypes.LOCAL;
		constructor(public declaringFunc){}
	}
	class ST_PARAM {
		type=ScopeTypes.PARAM;
		constructor(public declaringFunc){}
	}
	class ST_FIELD {
		tyoe=ScopeTypes.FIELD;
		constructor(public klass, public name, public info){}
	}
	class ST_PROP {
		type=ScopeTypes.PROP;
		constructor(public klass, public name, public info){}
	}
	class ST_METHOD {
		type=ScopeTypes.METHOD;
		constructor(public klass, public name, public info){}
	}
	class ST_THVAR {
		type=ScopeTypes.THVAR;
	}
	class ST_NATIVE{
		type=ScopeTypes.NATIVE;
		constructor(public name, public value){}
	}
	class ST_CLASS {
		type=ScopeTypes.CLASS;
		constructor(public name, public fullName, public info){}
	}
	class ST_MODULE{
		type=ScopeTypes.MODULE;
		constructor(public name){}
	}
	const cu={ScopeTypes,newScopeType:genSt,getScopeType:stype,newScope,nullCheck:nc,
		genSym,extend,annotation:annotation3,getSource,getField,getMethod:getMethod2,
		getDependingClasses,getParams
	};
	Tonyu.Compiler=cu;

	//cu.ScopeTypes=ScopeTypes;
	let nodeIdSeq=1;
	let symSeq=1;//B
	function genSt(st, options?) {//B
		const res:any={type:st};
		if (options) {
			for (let k in options) res[k]=options[k];
		}
		if (!res.name) res.name=genSym("_"+st+"_");
		return res;
	}
	//cu.newScopeType=genSt;
	function stype(st) {//B
		return st ? st.type : null;
	}
	//cu.getScopeType=stype;
	function newScope(s) {//B
		const f=function (){};
		f.prototype=s;
		return new f();
	}
	//cu.newScope=newScope;
	function nc(o, mesg) {//B
		if (!o) throw mesg+" is null";
		return o;
	}
	//cu.nullCheck=nc;
	function genSym(prefix) {//B
		return prefix+((symSeq++)+"").replace(/\./g,"");
	}
	//cu.genSym=genSym;
	function annotation3(aobjs, node, aobj=undefined) {//B
		if (!node._id) {
			//if (!aobjs._idseq) aobjs._idseq=0;
			node._id=++nodeIdSeq;
		}
		let res=aobjs[node._id];
		if (!res) res=aobjs[node._id]={node:node};
		if (res.node!==node) {
			console.log("NOMATCH",res.node,node);
			throw new Error("annotation node not match!");
		}
		if (aobj) {
			for (let i in aobj) res[i]=aobj[i];
		}
		return res;
	}
	//cu.extend=extend;
	function extend(res,aobj) {
		for (let i in aobj) res[i]=aobj[i];
		return res;
	};
	//cu.annotation=annotation3;
	function getSource(srcCont,node) {//B
		return srcCont.substring(node.pos,node.pos+node.len);
	}
	//cu.getSource=getSource;
	//cu.getField=getField;
	function getField(klass,name){
		if (klass instanceof Function) return null;
		let res=null;
		getDependingClasses(klass).forEach(function (k) {
			if (res) return;
			res=k.decls.fields[name];
		});
		if (typeof (res.vtype)==="string") {
			res.vtype=Tonyu.classMetas[res.vtype] || root[res.vtype];
		}
		return res;
	};
	function getMethod2(klass,name) {//B
		let res=null;
		getDependingClasses(klass).forEach(function (k) {
			if (res) return;
			res=k.decls.methods[name];
		});
		return res;
	}
	//cu.getMethod=getMethod2;
	function getDependingClasses(klass) {//B
		const visited={};
		const res=[];
		function loop(k) {
			if (visited[k.fullName]) return;
			visited[k.fullName]=true;
			if (k.isShim) {
				console.log(klass,"contains shim ",k);
				throw new Error("Contains shim");
			}
			res.push(k);
			if (k.superclass) loop(k.superclass);
			if (k.includes) k.includes.forEach(loop);
		}
		loop(klass);
		return res;
	}
	//cu.getDependingClasses=getDependingClasses;
	function getParams(method) {//B
		let res=[];
		if (!method.head) return res;
		if (method.head.setter) res.push(method.head.setter.value);
		const ps=method.head.params ? method.head.params.params : null;
		if (ps && !ps.forEach) throw new Error(method+" is not array ");
		if (ps) res=res.concat(ps);
		return res;
	}
	//cu.getParams=getParams;
	export= cu;
