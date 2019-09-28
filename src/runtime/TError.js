var TError=function (message, src, pos) {
	let rc;
	if (typeof src=="string") {
		rc=TError.calcRowCol(src,pos);
		message+=" at "+(rc.row)+":"+(rc.col);
		return extend(new Error(message),{
			isTError:true,
			//message:message,
			src:{
				path:function () {return "/";},
				name:function () { return "unknown";},
				text:function () { return src;}
			},
			pos:pos,row:rc.row, col:rc.col,
			raise: function () {
				throw this;
			}
		});
	}
	var klass=null;
	if (src && src.src) {
		klass=src;
		src=klass.src.tonyu;
	}
	if (typeof src.name!=="function" || typeof src.text!=="function") {
		throw new Error("src="+src+" should be file object");
	}
	const s=src.text();
	rc=TError.calcRowCol(s,pos);
	function extend(dst,src) {for (var k in src) dst[k]=src[k];return dst;}
	message+=" at "+src.name()+":"+rc.row+":"+rc.col;
	return extend(new Error(message),{
		isTError:true,
		//message:message,
		src:src,pos:pos,row:rc.row, col:rc.col, klass:klass,
		raise: function () {
			throw this;
		}
	});
};
TError.calcRowCol=function (text,pos) {// returns 1 origin row,col
	var lines=text.split("\n");
	var pp=0,row,col;
	for (row=0;row<lines.length ; row++) {
		pp+=lines[row].length+1;
		if (pp>pos) {
			col=pos-(pp-lines[row].length);
			break;
		}
	}
	return {row:row+1,col:col+1};
};
module.exports=TError;
