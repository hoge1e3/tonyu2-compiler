import { TNode } from "./NodeTypes";

export type MethodInfo={
    name:string,stmts:TNode[],pos:number, isMain:boolean, nowait:boolean,
}
export type Meta={
    fullName:string, shortName:string, namespace:string,
    decls:{
        methods: {[key:string]: MethodInfo},
        fields: object,
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
    node: Node,
};
