import { Constructor, FieldInfo, Meta } from "../runtime/RuntimeTypes";
import { ScopeInfo } from "./compiler";
import { IndentBuffer } from "./IndentBuffer";
import { Catch, Expr, Expression, Forin, FuncDecl, FuncDeclHead, ParamDecl, Program, Stmt, SuperExpr, TNode, VarDecl } from "./NodeTypes";
import { Token } from "./parser";

export type C_MetaMap={[key: string]:C_Meta};

// Difference of ctx and env:  env is of THIS project. ctx is of cross-project
export type BuilderContext={
	//visited: C_MetaMap,
	classes: C_MetaMap,
	options: BuilderContextDef,
};
/*export function isBuilderContext(c):c is BuilderContext {
	return c && c.visited;
}*/
export type Aliases={[key:string]:string};//shortName->fullName
export type BuilderEnv={
	unresolvedVars: number,
	options: ProjectOptions,
	classes: C_MetaMap,
	aliases: Aliases,
	//amdPaths: string[],
};
export type ProjectOptions={
	compiler: CompilerOptions,
};
export type BuilderContextDef={
	destinations?: Destinations,
};
export type DependencySppec={
	namespace?: string;
	dir?: string,
	url?: string,
}
export type CompilerOptions={
	namespace: string,
	dependingProjects: DependencySppec[],
	typeCheck?: boolean,
	//typeInference?: boolean,
	defaultSuperClass?: string,
	field_strict?: boolean,
	external_waitable?: boolean,
	diagnose?: boolean,
	genAMD?: boolean,
	noLoopCheck?: boolean,
	compress?: boolean,
};
export type Destinations=FileDest|MemoryDest;
type FileDest={
	file: any,
};
export function isFileDest(d:Destinations):d is FileDest  {
	return (d as any).file;
}
type MemoryDest={
	memory:true,
};


export function isMemoryDest(d:Destinations):d is MemoryDest  {
	return (d as any).memory;
}
export type Methods={[key: string]: NonArrowFuncInfo};
export type Locals={
	varDecls: {[key: string]:VarDecl},
	subFuncDecls: {[key: string]:FuncDecl},
};
export type C_FieldInfo=FieldInfo & {
	node?:TNode,
	//pos?:number,
	resolvedType?: AnnotatedType,
};
export type C_Decls={
	methods: {[key:string]: NonArrowFuncInfo},
	fields:  {[key:string]: C_FieldInfo},
	natives: object,
	amds: object,
	softRefClasses: object
}
export type C_Meta=Meta & {
	decls: C_Decls,
	superclass: C_Meta,
	includes: C_Meta[],
	src?: {tonyu?:any, js?:any, map?: string},
    hasSemanticError?: boolean,
    jsNotUpToDate: boolean,
    directives: {
		field_strict?:boolean,
		external_waitable?: boolean,
	},
    node: Program, nodeTimestamp:number,
	annotation?: object,
};
export type ScopeMap={[key:string]: ScopeInfo};
/*export type C_MethodInfo=MethodInfo&{
	stmts:Stmt[],pos:number,
	ftype?:string,//"function"|"fiber"|"constructor"|"\\",
	klass:string,
	head?:FuncDeclHead,
	node?:FuncDecl,
	locals?: Locals,
	params?: ParamDecl[],
	useArgs?:boolean,
};*/
export type FuncInfoBase={// also includes Method
	klass: C_Meta,
	node?: FuncDecl,
	head?: FuncDeclHead,
	ftype?:string,//"function"|"fiber"|"constructor"|"\\",
	isMain?: boolean,
	//stmts: Stmt[],
	//locals?: Locals,
	params?: ParamDecl[],
	scope?: ScopeMap,
	useArgs?:boolean,
	paramTypes?: AnnotatedType[],
	returnType?: AnnotatedType,
	//nowait: boolean,
};
export type FuncInfo=NonArrowFuncInfo|ArrowFuncInfo;
export type NonArrowFuncInfo=FuncInfoBase & {// also includes Method
	name: string, //pos?:number,
	stmts: Stmt[],
	locals?: Locals,
	nowait: boolean,
};
export function isNonArrowFuncInfo(f:FuncInfo):f is NonArrowFuncInfo {
	return (f as any).stmts;
}
export type ArrowFuncInfo=FuncInfoBase & {
	retVal: Expr,
	nowait: true,
};
export function isArrowFuncInfo(f:FuncInfo):f is ArrowFuncInfo {
	return (f as any).retVal;
}
export type NativeClass={class: Constructor, sampleValue?:any};
export type MethodType={method: NonArrowFuncInfo};
export type ArrayType={element:AnnotatedType};
export type UnionType={candidates:AnnotatedType[]};
export type NamedType=NativeClass|C_Meta;
export type AnnotatedType=NamedType|MethodType|ArrayType|UnionType;
export function isArrayType(klass: AnnotatedType): klass is ArrayType {
	return (klass as any).element;
}
export function isNativeClass(klass: AnnotatedType): klass is NativeClass {
	return (klass as any).class;
}
export function isMeta(klass: AnnotatedType): klass is C_Meta {
	return (klass as any).decls;
}
export function isMethodType(klass: AnnotatedType): klass is MethodType {
	return (klass as any).method;
}
export function isUnionType(klass: AnnotatedType): klass is UnionType {
	return (klass as any).candidates;
}
export type Annotation={
	scopeInfo?: ScopeInfo,
	//fieldInfo?: C_FieldInfo,
	funcInfo?: FuncInfo,
	declaringFunc?: FuncInfo,
	resolvedType?: AnnotatedType,
	fiberCall?: {N:Token, A:Expression[]}&(
		{type:"noRet"}|{type:"varDecl"}|
		{type:"ret", L:TNode, O:Token}|
		{type:"noRetSuper",S:SuperExpr}|
		{type:"retSuper", L:Expression, O:Token,S:SuperExpr}
	),
	// Target Object Name Arguments Leftvalue oPerator
	//  O.N(A)  T=O.N
	otherFiberCall?: {fiberType?:MethodType, T:Expression, O:Expression, N:Token, A:Expression[], /*fiberCallRequired_lazy:()=>void*/}&(
		/*{type:"noRetOther"}*/|{type:"varDecl"}
		/*{type:"retOther",L:Expression, P:Token}*/ //LPO.N(A)  P:(=)(+=)(-=)...
	),// fiberCallRequired_lazy is called when typechecker detects that T is a Tonyu-method
	myMethodCall?: {name:string, args:TNode[], scopeInfo: ScopeInfo},
	othersMethodCall?: {target:TNode, name:string, args:TNode[]},
	memberAccess?: {target:TNode, name:string},
	//iterName?: string,
	varInMain?: boolean,
	declaringClass?: C_Meta,
	noBind?: boolean,
	//fiberCallRequired?: boolean,
	hasJump?: boolean,
	//hasReturn?: boolean,
};
export type TraceIndex={

};
export type GenOptions={
	codeBuffer?: IndentBuffer,
	traceIndex?: TraceIndex
};
