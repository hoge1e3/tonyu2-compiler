import { Constructor, FieldInfo, Meta, MetaMap, MethodInfo } from "../runtime/RuntimeTypes";
import { ScopeInfo } from "./compiler";
import { Catch, Forin, FuncDecl, FuncDeclHead, ParamDecl, Program, Stmt, TNode, VarDecl } from "./NodeTypes";
import { Token } from "./parser";

export type C_MetaMap={[key: string]:C_Meta};

// Difference of ctx and env:  env is of THIS project. ctx is of cross-project
export type BuilderContext={
	visited: {},
	classes: MetaMap,
	options: CompileOptions,
};
export function isBuilderContext(c):c is BuilderContext {
	return c && c.visited;
}
export type Aliases={[key:string]:string};
export type BuilderEnv={
	options: ProjectOptions,
	classes: C_MetaMap,
	aliases: Aliases,
	amdPaths: string[],
};
export type ProjectOptions={
	compiler: CompileOptions,
};
export type CompileOptions={
	typeCheck?: boolean,
	defaultSuperClass?: string,
	destinations?: Destinations,
	field_strict?: boolean,
	diagnose?: boolean,
	genAMD?: boolean,
	noLoopCheck?: boolean,
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
export type Methods={[key: string]: C_MethodInfo};
export type Locals={
	varDecls: {[key: string]:VarDecl},
	subFuncDecls: {[key: string]:FuncDecl},
};
export type C_FieldInfo=FieldInfo & {
	node?:TNode,
	pos?:number,
	vtype?: AnnotatedType,
};
export type C_Decls={
	methods: {[key:string]: C_MethodInfo},
	fields:  {[key:string]: C_FieldInfo},
	natives?: object,
	amds?: object,
	softRefClasses?: object
}
export type C_Meta=Meta & {
	decls: C_Decls,
	superclass: C_Meta,
	includes: C_Meta[],
	src?: {tonyu?:any, js?:any, map?: string},
    hasSemanticError: boolean,
    jsNotUpToDate: boolean,
    directives: {field_strict?:boolean},
    node: Program, nodeTimestamp:number,
	annotation?: object,
};
export type C_MethodInfo=MethodInfo&{
	stmts:Stmt[],pos:number,
	ftype?:string,//"function"|"fiber"|"constructor"|"\\",
	klass:string,
	head?:FuncDeclHead,
	node?:FuncDecl,
	locals?: Locals,
	params?: ParamDecl[],
	useArgs?:boolean,
};
export type ScopeMap={[key:string]: ScopeInfo};
export type FuncInfo={
	name: string,
	isMain?: boolean,
	stmts: Stmt[],
	locals?: Locals,
	params?: ParamDecl[],
	useArgs?:boolean,
	useTry?:boolean,
	fiberCallRequired?:boolean,
	scope?: ScopeMap,
	returnType?: AnnotatedType,
	//vtype?: AnnotatedType,
};
export type NativeClass={class: Constructor};
export type AnnotatedType=NativeClass|C_Meta;
export function isMeta(klass: AnnotatedType): klass is C_Meta {
	return (klass as any).decls;
}
export type Annotation={
	scopeInfo?: ScopeInfo,
	info?: C_FieldInfo|FuncInfo,
	declaringFunc?: FuncInfo,
	resolvedType?: AnnotatedType,
	fiberCall?: {N:TNode, A:TNode},
	myMethodCall?: {name:Token, args:TNode[], scopeInfo: ScopeInfo},
	othersMethodCall?: {target:TNode, name:Token, args:TNode[]},
	memberAccess?: {target:TNode, name:Token},
	iterName?: string,
	varInMain?: boolean,
	declaringClass?: C_Meta,
	noBind?: boolean,
	fiberCallRequired?: boolean,
	hasJump?: boolean,
	hasReturn?: boolean,
};
