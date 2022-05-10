import { MetaMap, MethodInfo } from "../runtime/RuntimeTypes";
import { TNode } from "./NodeTypes";

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
export type ProjectOptions={
	compiler: CompileOptions,
};
export type CompileOptions={
	typeCheck?: boolean,
	defaultSuperClass?: string,
	destinations?: Destinations,
};
export type Methods={[key: string]: MethodInfo};
export type Locals={
	varDecls: object,
	subFuncDecls: object,
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
