
export type SFile={
	text(s?:string|Function):string,
	rel(p:string):SFile,
	relPath(s:SFile):string,
	up():SFile,
	path():string,
	truncExt(ext?:string):string,
	moveTo(s:SFile):void,
	sibling(n:string):SFile,
	exists():boolean,
	isReadOnly():boolean,
};
