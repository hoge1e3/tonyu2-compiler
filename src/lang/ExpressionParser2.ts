// parser.js の補助ライブラリ．式の解析を担当する

import { Parser, ParserContext, setRange } from "./parser";

//import Parser from "./parser";
export= function ExpressionParser (context: ParserContext, name="Expression") {
	//var $:any={};
	//  first 10     *  +  <>  &&  ||  =     0  later
	function opType(type, prio) {
		return {
			eq(o) {return type==o.type() && prio==o.prio(); },
			type(t) { if (!t) return type; else return t==type;},
			prio() {return prio;},
			toString() {return "["+type+":"+prio+"]"; },
		};
	}
	function composite(a?) {
		var e=a;
		return {
			add(a) {
				if (!e) {
					e=a;
				} else {
					e=e.or(a);
				}
			},
			get() {
				return e;
			}
		};
	}
	function typeComposite() {
		var built=composite();
		//var lastOP , isBuilt;
		return {
			reg(type, prio, a) {
				var opt=opType(type, prio);
				built.add(a.ret(context.create(function (r) {
					(r as any).opType=opt;
					return r;
				})).setName("(opType "+opt+" "+a.name+")") );
			},
			get() {return built.get();},
			parse(st) {
				return this.get().parse(st);
			}
		};
	}
	var prefixOrElement=typeComposite(), postfixOrInfix=typeComposite();
	var element=composite();
	var trifixes=[];
	const $={
	element(e) {
		prefixOrElement.reg("element", -1, e);
		element.add(e);
	},
	getElement() {return element.get();},
	prefix(prio, pre) {
		prefixOrElement.reg("prefix", prio, pre);
	},
	postfix(prio, post) {
		postfixOrInfix.reg("postfix", prio, post);
	},
	infixl(prio, inf) {
		postfixOrInfix.reg("infixl", prio, inf);
	},
	infixr(prio, inf) {
		postfixOrInfix.reg("infixr", prio, inf);
	},
	infix(prio, inf) {
		postfixOrInfix.reg("infix", prio, inf);
	},
	trifixr (prio, tf1, tf2) {
		postfixOrInfix.reg("trifixr", prio, tf1);
		//postfixOrInfix.reg("trifixr2", prio, tf2);
		trifixes[prio]=tf2;
	},
	custom (prio, func) {
		// func :: Elem(of next higher) -> Parser
	},
	mkInfix(f) {
		$.mkInfix_def=f;
	},
	mkInfixl(f) {
		$.mkInfixl_def=f;
	},
	mkInfixr(f) {
		$.mkInfixr_def=f;
	},
	mkPrefix(f) {
		$.mkPrefix_def=f;
	},
	mkPostfix(f) {
		$.mkPostfix_def=f;
	},
	mkTrifixr(f) {
		$.mkTrifixr_def=f;
	},
	built: null,
	build() {
		//postfixOrInfix.build();
		//prefixOrElement.build();
		$.built= context.create(function (st) {
			return parse(0,st);
		}).setName(name);
		return $.built;
	},
	mkInfix_def(left,op,right) {
		return setRange({type:"infix", op:op, left: left, right: right});
	},
	mkInfixl_def(left, op , right) {
		return setRange({type:"infixl",op:op ,left:left, right:right});
	},
	mkInfixr_def(left, op , right) {
		return setRange({type:"infixr",op:op ,left:left, right:right});
	},
	mkPrefix_def (op , right) {
		return setRange({type:"prefix", op:op, right:right});
	},
	mkPostfix_def (left, op) {
		return setRange({type:"postfix", left:left, op:op});
	},
	mkTrifixr_def(left, op1, mid, op2, right) {
		return setRange({type:"trifixr", left:left, op1:op1, mid:mid, op2:op2, right:right});
	},
	lazy() {
		return context.create(function (st) {
			return $.built.parse(st);
		}).setName(name,{type:"lazy",name});
	},
	};
	function dump(st, lbl) {
		/*var s=st.src.str;
		console.log("["+lbl+"] "+s.substring(0,st.pos)+"^"+s.substring(st.pos)+
				" opType="+ st.opType+"  Succ = "+st.isSuccess()+" res="+st.result[0]);*/
	}
	function parse(minPrio, st) {
		var stat=0, res=st ,  opt;
		dump(st," start minprio= "+minPrio);
		st=prefixOrElement.parse(st);
		dump(st," prefixorelem "+minPrio);
		if (!st.isSuccess()) {
			return st;
		}
		//p2=st.result[0];
		opt=st.opType;
		if (opt.type("prefix") ) {
			// st = -^elem
			var pre=st.result[0];
			st=parse(opt.prio(), st);
			if (!st.isSuccess()) {
				return st;
			}
				// st: Expr    st.pos = -elem^
			var pex=$.mkPrefix_def(pre, st.result[0]);
			res=st.clone();  //  res:Expr
			res.result=[pex]; // res:prefixExpr  res.pos= -elem^
			if (!st.nextPostfixOrInfix) {
				return res;
			}
			// st.next =  -elem+^elem
			st=st.nextPostfixOrInfix;  // st: postfixOrInfix
		} else { //elem
			//p=p2;
			res=st.clone(); // res:elemExpr   res =  elem^
			st=postfixOrInfix.parse(st);
			if (!st.isSuccess()) {
				return res;
			}
		}
		// assert st:postfixOrInfix  res:Expr
		while (true) {
			dump(st,"st:pi"); dump(res,"res:ex");
			opt=st.opType;
			if (opt.prio()<minPrio) {
				res.nextPostfixOrInfix=st;
				return res;
			}
			// assert st:postfixOrInfix  res:Expr
			if (opt.type("postfix")) {
				// st:postfix
				const pex=$.mkPostfix_def(res.result[0],st.result[0]);
				res=st.clone();
				res.result=[pex]; // res.pos= expr++^
				dump(st, "185");
				st=postfixOrInfix.parse(st); // st. pos= expr++--^
				if (!st.isSuccess()) {
					return res;
				}
			} else if (opt.type("infixl")){  //x+y+z
				// st: infixl
				var inf=st.result[0];
				st=parse(opt.prio()+1, st);
				if (!st.isSuccess()) {
					return res;
				}
				// st: expr   st.pos=  expr+expr^
				const pex=$.mkInfixl_def(res.result[0], inf , st.result[0]);
				res=st.clone();
				res.result=[pex]; //res:infixlExpr
				if (!st.nextPostfixOrInfix) {
					return res;
				}
				st=st.nextPostfixOrInfix;
			} else if (opt.type("infixr")) { //a=^b=c
				// st: infixr
				const inf=st.result[0];
				st=parse(opt.prio() ,st);
				if (!st.isSuccess()) {
					return res;
				}
				// st: expr   st.pos=  a=b=c^
				const pex=$.mkInfixr_def(res.result[0], inf , st.result[0]);
				res=st.clone();
				res.result=[pex]; //res:infixrExpr
				if (!st.nextPostfixOrInfix) {
					return res;
				}
				st=st.nextPostfixOrInfix;
			} else if (opt.type("trifixr")) { //left?^mid:right
				// st: trifixr
				var left=res.result[0];
				var inf1=st.result[0];  // inf1 =  ?
				st=parse(opt.prio()+1 ,st);
				if (!st.isSuccess()) {
					return res;
				}
				// st= expr   st.pos=  left?mid^:right
				var mid=st.result[0];
				st=trifixes[opt.prio()].parse(st);
				// st= :      st.pos= left?mid:^right;
				if (!st.isSuccess()) {
					return res;
				}
				var inf2= st.result[0];
				st=parse(opt.prio() ,st);
				if (!st.isSuccess()) {
					return res;
				}
				var right=st.result[0];
				// st=right      st.pos= left?mid:right^;
				const pex=$.mkTrifixr_def(left, inf1 , mid, inf2, right);
				res=st.clone();
				res.result=[pex]; //res:infixrExpr
				if (!st.nextPostfixOrInfix) {
					return res;
				}
				st=st.nextPostfixOrInfix;
			} else { // infix
				// st: infixl
				const inf=st.result[0];
				st=parse(opt.prio()+1 ,st);
				if (!st.isSuccess()) {
					return res;
				}
				// st: expr   st.pos=  expr+expr^
				const pex=$.mkInfix_def(res.result[0], inf , st.result[0]);
				res=st.clone();
				res.result=[pex]; //res:infixExpr
				if (!st.nextPostfixOrInfix) {
					return res;
				}
				st=st.nextPostfixOrInfix;
				if (opt.prio()==st.opType.prio()) {
					res.success=false;
					return res;
				}
			}
			// assert st:postfixOrInfix  res:Expr
		}
	}

	return $;
};
