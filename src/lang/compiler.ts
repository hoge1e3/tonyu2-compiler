import Tonyu from "../runtime/TonyuRuntime";
import root from "../lib/root";
import { FuncDecl, ParamDecl, TNode, TypeDecl } from "./NodeTypes";
import { AnnotatedType, C_FieldInfo, C_Meta, FuncInfo, NativeClass } from "./CompilerTypes";
import { Meta, ShimMeta } from "../runtime/RuntimeTypes";

	/*import Tonyu = require("../runtime/TonyuRuntime");
	const ObjectMatcher=require("./ObjectMatcher");
	//const TError=require("TError");
	const root=require("../lib/root");*/
	type valueOf<T>=T[keyof T];
	export const ScopeTypes={
			FIELD:"field", METHOD:"method", NATIVE:"native",//B
			LOCAL:"local", THVAR:"threadvar",PROP:"property",
			PARAM:"param", GLOBAL:"global",
			CLASS:"class", MODULE:"module"
	} as const;
	export namespace ScopeInfos{
		export class LOCAL {
			type=ScopeTypes.LOCAL;
			constructor(public declaringFunc:FuncInfo){}
		}
		export class PARAM {
			type=ScopeTypes.PARAM;
			constructor(public declaringFunc:FuncInfo){}
		}
		export class FIELD {
			type=ScopeTypes.FIELD;
			constructor(public klass:C_Meta, public name:string , public info:C_FieldInfo){}
		}
		export class PROP {
			type=ScopeTypes.PROP;
			constructor(public klass:string, public name:string , public info:FuncInfo){}
		}
		export class METHOD{
			type=ScopeTypes.METHOD;
			constructor(public klass:string, public name:string , public info:FuncInfo){}
		}
		export class THVAR {
			type=ScopeTypes.THVAR;
		}
		export class NATIVE{
			type=ScopeTypes.NATIVE;
			constructor(public name:string , public value:NativeClass){}
		}
		export class CLASS{
			type=ScopeTypes.CLASS;
			constructor(public name:string , public fullName:string, public info:C_Meta){}
		}
		export class GLOBAL {
			type=ScopeTypes.GLOBAL;
			constructor(public name:string){}
		}
		export class MODULE {
			type=ScopeTypes.MODULE;
			constructor(public name:string){}
		}
		export type ALL=(FIELD|METHOD|NATIVE|LOCAL|THVAR|PROP|PARAM|GLOBAL|CLASS|MODULE) & {resolvedType?:AnnotatedType};
	};
	export type ScopeInfo=ScopeInfos.ALL;
	export type ScopeType=valueOf<typeof ScopeTypes>;

	let nodeIdSeq=1;
	let symSeq=1;//B
	/*export function newScopeType(st, options?) {//B
		const res:any={type:st};
		if (options) {
			for (let k in options) res[k]=options[k];
		}
		if (!res.name) res.name=genSym("_"+st+"_");
		return res;
	}*/
	//cu.newScopeType=genSt;
	export function getScopeType(st: ScopeInfo ) {//B
		return st ? st.type : null;
	}
	//cu.getScopeType=stype;
	export function newScope(s) {//B
		const f=function (){};
		f.prototype=s;
		return new f();
	}
	//cu.newScope=newScope;
	export function nullCheck(o, mesg) {//B
		if (!o) throw mesg+" is null";
		return o;
	}
	//cu.nullCheck=nc;
	export function genSym(prefix) {//B
		return prefix+((symSeq++)+"").replace(/\./g,"");
	}
	//cu.genSym=genSym;
	export function annotation<T>(aobjs, node, aobj:T|undefined=undefined) {//B
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
	/*function extend(res,aobj) {
		for (let i in aobj) res[i]=aobj[i];
		return res;
	};*/
	//cu.annotation=annotation3;
	export function getSource(srcCont:string,node: TNode) {//B
		return srcCont.substring(node.pos,node.pos+node.len);
	}
	//cu.getSource=getSource;
	//cu.getField=getField;
	export function getField(klass: C_Meta, name: string){
		if (klass instanceof Function) return null;
		let res:C_FieldInfo=null;
		for (let k of getDependingClasses(klass)) {
			//console.log("getField", k, name);
			if (res) break;
			res=k.decls.fields[name];
		}
		if (res && res.vtype && !res.resolvedType) {
			res.resolvedType=className2ResolvedType(res.vtype);
		}
		return res;
	};
	export function className2ResolvedType(name:string):AnnotatedType|undefined {
		if (Tonyu.classMetas[name]) {
			return Tonyu.classMetas[name] as C_Meta;
		} else if (root[name]) {
			return {class: root[name]};
		}
	}
	export function getMethod(klass: C_Meta,name:string) {//B
		let res:FuncInfo=null;
		for (let k of getDependingClasses(klass)) {
			if (res) break;
			res=k.decls.methods[name];
		}
		return res;
	}
	//cu.getMethod=getMethod2;
	export function getDependingClasses(klass:C_Meta) {//B
		const visited={};
		const res=[] as C_Meta[];
		function loop(k:Meta) {
			if ((k as any).isShim) {
				console.log(klass,"contains shim ",k);
				throw new Error("Contains shim");
			}
			if (visited[k.fullName]) return;
			visited[k.fullName]=true;
			res.push(k as C_Meta);
			if (k.superclass) loop(k.superclass);
			if (k.includes) k.includes.forEach(loop);
		}
		loop(klass);
		return res;
	}
	//cu.getDependingClasses=getDependingClasses;
	export function getParams(method: FuncInfo) {//B
		let res=[] as ParamDecl[];
		if (!method.head) return res;
		if (method.head.setter) res.push(method.head.setter.value);
		const ps=method.head.params ? method.head.params.params : null;
		if (ps && !ps.forEach) throw new Error(method+" is not array ");
		if (ps) res=res.concat(ps);
		return res;
	}
	//cu.getParams=getParams;
	//export= cu;
