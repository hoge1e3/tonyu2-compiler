import { Program, TNode } from "./NodeTypes";

export type TonyuMethod=Function & {fiber?: TonyuMethod, methodInfo?:{name:string}};
type Constructor = new (...args: any[]) => any;
export type TonyuClass= Constructor & {meta:Meta};
export function isTonyuClass(v:any):v is TonyuClass {
	return typeof v==="function" && v.meta;
}
export type MethodInfo={
    name:string,stmts:TNode[],pos:number, isMain:boolean, nowait:boolean,
};
export type FieldInfo={
    node:TNode,
    klass:string,
    name:string,
    pos:number,
};
export type Meta={
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
};
