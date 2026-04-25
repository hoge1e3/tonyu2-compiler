import { SFile } from "@hoge1e3/sfile";
import { C_Meta } from "../lang/CompilerTypes.js";

function isCMeta(src:any): src is C_Meta{
	return src?.src;
}
export type TError=Error&{
	isTError:boolean,
	src:{
		path():string,
		name():string,
		text():string,
	},
	pos:number, row:number, col:number, len:number,
	klass?: C_Meta,
	raise():void,
}
export default function TError(message:string, src: SFile|string|C_Meta, pos:number, len=0):TError {
	let rc;
	let klass:C_Meta|null=null;
	let srcFile:TError["src"];
	//const extend=(dst,src)=>{for (var k in src) dst[k]=src[k];return dst;};
	if (typeof src=="string") {
		rc=TError.calcRowCol(src,pos);
		message+=" at "+(rc.row)+":"+(rc.col);
		return Object.assign(new Error(message),{
			isTError:true,
			src:{
				path:function () {return "/";},
				name:function () { return "unknown";},
				text:function () { return src;}
			},
			pos,row:rc.row, col:rc.col,len,
			raise: function () {
				throw this;
			}
		});
	} else if (isCMeta(src)) {
		klass=src;
		if (klass?.src?.tonyu) srcFile=klass.src.tonyu;
		else srcFile={
			path() {return "/";},
			name() { return "unknown name";},
			text() { return "unknown src";}
		};
	} else if (SFile.is(src)) {
		srcFile=src;
	} else {
		throw new Error("src="+src+" should be file object");
	}
	const s=srcFile.text();
	rc=TError.calcRowCol(s,pos);
	message+=" at "+srcFile.name()+":"+rc.row+":"+rc.col;
	return Object.assign(new Error(message),{
		isTError:true,
		src:srcFile,
		pos,row:rc.row, col:rc.col, len, klass:klass??undefined,
		raise: function () {
			throw this;
		}
	});
};
TError.calcRowCol=function (text:string ,pos:number) {// returns 1 origin row,col
	const lines=text.split("\n");
	let pp=0,row:number ,col:number;
	/*
aaa\n
bb\n
cc!cc
pp = 4  7   11
row=2  pp=11  pos=9
lines[row].length=4
	*/
	col=0;
	for (row=0;row<lines.length ; row++) {
		const ppp=pp;
		pp+=lines[row].length+1;
		if (pp>pos) {
			col=pos-ppp;
			break;
		}
	}
	return {row:row+1,col:col+1};
};
//module.exports=TError;
