import { Program, TNode } from "../lang/NodeTypes";

export type MetaMap={[key: string]:Meta};
export type ClassTree={[key:string]:ClassTree}|TonyuClass; // Tonyu.classes.user.Hoge  Tonyu.classes.kernel.Actor etc
export type TonyuMethod=Function & {fiber?: TonyuMethod, methodInfo?:{name:string}};
type Constructor = new (...args: any[]) => any;
export type TonyuClass= Constructor & {meta:Meta, extendFrom:Function};
export type TonyuShimClass= Constructor & {meta:ShimMeta, extendFrom:Function};
export function isTonyuClass(v:any):v is TonyuClass {
	return typeof v==="function" && v.meta && !v.meta.isShim;
}
export type MethodInfo={
    name:string,stmts:TNode[],pos:number, isMain:boolean, nowait:boolean,
};
export type FieldInfo={
    node?:TNode,
	pos?:number,
    klass:string,
    name:string,
};
export type ShimMeta=Meta | {isShim: true, extenderFullName:string, func: TonyuShimClass};
export type Meta={
	func: TonyuShimClass,
	fullName:string, shortName:string, namespace:string,
    decls:{
        methods: {[key:string]: MethodInfo},
        fields:  {[key:string]: FieldInfo},
        natives: object,
        amds: object,
        softRefClasses: object
    },
    superclass:Meta|null,
    includesRec:{[key:string]:boolean},
    includes:Meta[],
    builtin?: boolean,
    //---- only with builders:
    src?: {tonyu?:any, js?:any},
    hasSemanticError: boolean,
    jsNotUpToDate: boolean,
    directives: {field_strict?:boolean},
    node: Program, nodeTimestamp:number,
	annotation?: object,
};
