	//var OM:any={};
	const VAR=Symbol("$var");//,THIZ="$this";
	//OM.v=v;
	type Variable = Function & {
		vname:string, cond:any
	};
	export function v(name:string, cond={}):Variable {
		const res=function (cond2:any) {
			const cond3=Object.assign({},cond);
			Object.assign(cond3, cond2);
			return v(name, cond3);
		}
		res.vname=name;
		res.cond=cond;
		res[VAR]=true;
		//if (cond) res[THIZ]=cond;
		return res;
	}
	function isVariable(a:any): a is Variable {
		return a[VAR];
	}
	//OM.isVar=isVar;
	export const A=v("A");
	export const B=v("B");
	export const C=v("C");
	export const D=v("D");
	export const E=v("E");
	export const F=v("F");
	export const G=v("G");
	export const H=v("H");
	export const I=v("I");
	export const J=v("J");
	export const K=v("K");
	export const L=v("L");
	export const M=v("M");
	export const N=v("N");
	export const O=v("O");
	export const P=v("P");
	export const Q=v("Q");
	export const R=v("R");
	export const S=v("S");
	export const T=v("T");
	export const U=v("U");
	export const V=v("V");
	export const W=v("W");
	export const X=v("X");
	export const Y=v("Y");
	export const Z=v("Z");
	/*var names="ABCDEFGHIJKLMNOPQRSTUVWXYZ";
	for (var i =0 ; i<names.length ; i++) {
		var c=names.substring(i,i+1);
		OM[c]=v(c);
	}*/
	export function isVar(o) {
		return o && o[VAR];
	}
	export function match(obj, tmpl) {
		var res={};
		if (m(obj,tmpl,res)) return res;
		return null;
	};
	function m(obj, tmpl, res) {
		if (obj===tmpl) return true;
		else if (obj==null) return false;
		else if (isVariable(tmpl)) {
		   if (!m(obj, tmpl.cond, res)) return false;
		   res[tmpl.vname]=obj;
		   return true;
	   } else if (typeof obj=="string" && tmpl instanceof RegExp) {
			return obj.match(tmpl);
		} else if (typeof tmpl=="function") {
			return tmpl(obj,res);
		} else if (typeof tmpl=="object") {
			//if (typeof obj!="object") obj={$this:obj};
			for (var i in tmpl) {
				//if (i==VAR) continue;
				var oe=obj[i];//(i==THIZ? obj :  obj[i] );
				var te=tmpl[i];
				if (!m(oe, te, res)) return false;
			}
			/*if (tmpl[VAR]) {
				res[tmpl[VAR]]=obj;
			}*/
			return true;
		}
		return false;
	}
	//export= OM;
