import Tonyu from "../runtime/TonyuRuntime";
import root from "../lib/root";
import { FuncDecl, ParamDecl, TNode, TypeDecl } from "./NodeTypes";
import { AnnotatedType, C_FieldInfo, C_Meta, FuncInfo, isMeta, isMethodType, isNativeClass, isUnionType, NativeClass, NonArrowFuncInfo } from "./CompilerTypes";
import { DeclsInDefinition, Meta, MethodInfo, ShimMeta, TypeDigest, isArrayTypeDigest } from "../runtime/RuntimeTypes";
import { Token } from "./parser";

	/*import Tonyu = require("../runtime/TonyuRuntime");
	const ObjectMatcher=require("./ObjectMatcher");
	//const TError=require("TError");
	const root=require("../lib/root");*/
	type valueOf<T>=T[keyof T];
	const NONBLOCKSCOPE_DECLPREFIX="var";
	export function isBlockScopeDeclprefix(t:Token){
		return t && t.text!==NONBLOCKSCOPE_DECLPREFIX;
	}
	export function isNonBlockScopeDeclprefix(t:Token){
		return t && t.text===NONBLOCKSCOPE_DECLPREFIX;
	}
	export const ScopeTypes={
			FIELD:"field", METHOD:"method", NATIVE:"native",//B
			LOCAL:"local", THVAR:"threadvar",PROP:"property",
			PARAM:"param", GLOBAL:"global",
			CLASS:"class", MODULE:"module"
	} as const;
	export namespace ScopeInfos{
		export class LOCAL {
			type=ScopeTypes.LOCAL;
			constructor(public declaringFunc:FuncInfo, public isBlockScope:boolean){}
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
			public getter?:FuncInfo;
			public setter?:FuncInfo;
			constructor(public klass:string, public name:string){}
		}
		export class METHOD{
			type=ScopeTypes.METHOD;
			constructor(public klass:string, public name:string , public info:NonArrowFuncInfo){}
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
	export function packAnnotation(aobjs) {
		if (!aobjs) return;
		function isEmptyAnnotation(a) {
			return a && typeof a==="object" && Object.keys(a).length===1 && Object.keys(a)[0]==="node";
		}
		for (let k of Object.keys(aobjs)) {
			if (isEmptyAnnotation(aobjs[k])) delete aobjs[k];
		}
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
	/*export function klass2name(t: AnnotatedType) {
		if (isMethodType(t)) {
			return `${t.method.klass.fullName}.${t.method.name}()`;
		} else if (isMeta(t)) {
			return t.fullName;
		} else if (isNativeClass(t)) {
			return t.class.name;
		} else {
			return `${klass2name(t.element)}[]`;
		}
	}*/
	export function resolvedType2Digest(t: AnnotatedType):TypeDigest {
		if (isMethodType(t)) {
			return `${t.method.klass.fullName}.${t.method.name}()`;
		} else if (isMeta(t)) {
			return t.fullName;
		} else if (isNativeClass(t)) {
			return t.class.name;
		} else if (isUnionType(t)) {
			return {candidates: t.candidates.map(resolvedType2Digest)};
		} else {
			return {element: resolvedType2Digest(t.element)};
		}
	}
	export function digestDecls(klass: C_Meta):DeclsInDefinition {
		//console.log("DIGEST", klass.decls.methods);
		var res={methods:{},fields:{}} as DeclsInDefinition;
		for (let i in klass.decls.methods) {
			const mi=klass.decls.methods[i];
			res.methods[i]={
				nowait:!!mi.nowait,
				isMain:!!mi.isMain,
			};
			if(mi.paramTypes || mi.returnType) {
				res.methods[i].vtype={
					params: mi.paramTypes ? mi.paramTypes.map(
						(t)=>t?resolvedType2Digest(t):null): null,
					returnValue: mi.returnType ? resolvedType2Digest(mi.returnType): null,
				};	
			}
		}
		for (let i in klass.decls.fields) {
			const src=klass.decls.fields[i];
			const dst={
				vtype:src.resolvedType ? resolvedType2Digest(src.resolvedType) : src.vtype
			};
			res.fields[i]=dst;
		}
		return res;
	}
	export function typeDigest2ResolvedType(d:TypeDigest):AnnotatedType|undefined {
		if (typeof d==="string") {
			if (Tonyu.classMetas[d]) {
				return Tonyu.classMetas[d] as C_Meta;
			} else if (root[d]) {
				return {class: root[d]};
			}	
		} else if (isArrayTypeDigest(d)) {
			return {element: typeDigest2ResolvedType(d.element)};
		} else {
			return {candidates: d.candidates.map(typeDigest2ResolvedType)};
		}
	}
	export function getField(klass: C_Meta, name: string){
		if (klass instanceof Function) return null;
		let res:C_FieldInfo=null;
		for (let k of getDependingClasses(klass)) {
			//console.log("getField", k, name);
			if (res) break;
			res=k.decls.fields[name];
		}
		if (res && res.vtype && !res.resolvedType) {
			res.resolvedType=typeDigest2ResolvedType(res.vtype);
		}
		return res;
	}
	export function getMethod(klass: C_Meta,name:string):NonArrowFuncInfo {//B
		let res:NonArrowFuncInfo=null;
		for (let k of getDependingClasses(klass)) {
			if (res) break;
			res=k.decls.methods[name];
		}
		return res;
	}
	export function getProperty(klass: C_Meta,name:string):{setter?: FuncInfo, getter?: FuncInfo} {
		const getter=getMethod(klass, Tonyu.klass.property.methodFor("get", name));
		const setter=getMethod(klass, Tonyu.klass.property.methodFor("set", name));
		if (!getter && !setter) return null;
		return {getter,setter};
	}
	//cu.getMethod=getMethod2;
	// includes klass itself
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
