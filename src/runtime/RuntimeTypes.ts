export type MetaMap={[key: string]:Meta};
export type ClassTree={[key:string]:ClassTree}|TonyuClass; // Tonyu.classes.user.Hoge  Tonyu.classes.kernel.Actor etc
export type TonyuMethod=Function & {fiber?: TonyuMethod, methodInfo?:{name:string}};
export type Constructor = new (...args: any[]) => any;
export type Extender=(parent:TonyuShimClass, ctx:ClassDefinitionContext)=>TonyuShimClass;
export type TonyuClass= Constructor & {meta:Meta, extendFrom:Extender};
export type TonyuShimClass= Constructor & {meta:ShimMeta, extendFrom:Extender};
export function isTonyuClass(v:any):v is TonyuClass {
	return typeof v==="function" && v.meta && !v.meta.isShim;
}
export type MethodInfo={
	name:string, isMain?:boolean, nowait:boolean,
	// compile time?
	/*
	stmts:TNode[],pos:number,
    ftype?:string,//"function"|"fiber"|"constructor"|"\\",
	klass:string,
	head?:FuncDeclHead,
	node?:FuncDecl,*/
};
export type ShimMeta=Meta | {isShim: true, extenderFullName:string, func: TonyuShimClass};
export type FuncMap={[key:string]: Function};
export type FuncMapFactory=(superclass:TonyuShimClass)=>FuncMap;
export type ClassDefinition={
	superclass:TonyuClass|null,
	includes:TonyuClass[],
	fullName:string, shortName:string, namespace:string,
	methods: FuncMapFactory|FuncMap,
	decls:{
		methods: {[key:string]: MethodInfo},
		fields:  {[key:string]: FieldInfo},
	}
};
export type ClassDefinitionContext={
	//isShim: boolean,
	//path: ShimMeta[],
	init: boolean,
	includesRec: {[key:string]:boolean},
	//initFullName: string,
	nonShimParent?: TonyuClass,

};

export type Decls={
	methods: {[key:string]: MethodInfo},
	fields:  {[key:string]: FieldInfo},
	/*natives?: object,
	amds?: object,
	softRefClasses?: object*/
};
export type FieldInfo={
	klass:Meta,// is not written in *.js, add at klass definition
    name:string,// is not written in *.js, add at klass definition
	vtype?: string, // "String" , "Number", "user.A"
	// --- compile time?
    /*node?:TNode,
	pos?:number,
	vtype?: any,*/
};
export type Meta={
	func: TonyuShimClass,
	fullName:string, shortName:string, namespace:string,
    decls: Decls,
    superclass:Meta|null,
    includesRec:{[key:string]:boolean},
    includes:Meta[],
    builtin?: boolean,
    //---- only with builders:
    /*src?: {tonyu?:any, js?:any},
    hasSemanticError: boolean,
    jsNotUpToDate: boolean,
    directives: {field_strict?:boolean},
    node: Program, nodeTimestamp:number,
	annotation?: object,*/
};
