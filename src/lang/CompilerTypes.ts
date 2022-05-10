import { FieldInfo, Meta, MetaMap, MethodInfo } from "../runtime/RuntimeTypes";
import { FuncDecl, FuncDeclHead, Program, TNode } from "./NodeTypes";

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
	classes: MetaMap,
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
	varDecls: object,
	subFuncDecls: object,
};
export type C_FieldInfo=FieldInfo & {
	node?:TNode,
	pos?:number,
	vtype?: any,
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
	src?: {tonyu?:any, js?:any},
    hasSemanticError: boolean,
    jsNotUpToDate: boolean,
    directives: {field_strict?:boolean},
    node: Program, nodeTimestamp:number,
	annotation?: object,
};
export type C_MethodInfo=MethodInfo&{
	stmts:TNode[],pos:number,
	ftype?:string,//"function"|"fiber"|"constructor"|"\\",
	klass:string,
	head?:FuncDeclHead,
	node?:FuncDecl,
};
export type FuncInfo={
	name: string,
	isMain?: boolean,
	stmts: TNode[],
	locals?: Locals,
	params?: any[],
	useArgs?:boolean,
	useTry?:boolean,
};
