
export type SFile={
	text(s?:string|Function):string,
	rel(p:string):SFile,
	relPath(s:SFile):string,
	up():SFile,
	path():string,
};
