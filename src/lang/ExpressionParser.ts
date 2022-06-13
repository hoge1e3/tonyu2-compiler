// parser.js の補助ライブラリ．式の解析を担当する

import { Parser, ParserContext, setRange, State } from "./parser";

export type OpType="infixl"|"infixr"|"infix"|"prefix"|"postfix"|"trifixr"|"element";
//import Parser from "./parser";
const OPTYPE=Symbol("OPTYPE"), TF2=Symbol("TF2");
const ELEMENTPRIO=-1;
export function ExpressionParser (context: ParserContext, name="Expression") {
	//  first 10     *  +  <>  &&  ||  =     0  later
	type OpDesc={
		eq(o:OpDesc):boolean,
		type(t?:OpType):OpType|boolean,
		prio:number,
		toString():string,
		reg(type:OpType, p:Parser):void,
	};
	const opDescs:OpDesc[]=[];
	function err(p:never) {throw new Error();}
	function opDesc(type:OpType, prio:number):OpDesc {
		if (opDescs[prio]) return opDescs[prio];
		const res={
			eq(o:OpDesc) {return type==o.type() && prio==o.prio; },
			type(t:OpType) { if (!t) return type; else return t==type;},
			prio,
			toString() {return "["+type+":"+prio+"]"; },
			reg(type:OpType ,p:Parser) {
				p=p.assign({[OPTYPE]:res});
				if (type==="infixl"|| type==="infixr" || type==="infix"
				|| type==="postfix" || type==="trifixr" ) {
					postfixOrInfix.reg(prio, p);
				} else if (type==="element") {
					element.add(p);
					prefixOrElement.add(p);
				} else if (type==="prefix") {
					prefixOrElement.add(p);
				} else {
					throw err(type);
				}
			}
		};
		opDescs[prio]=res;
		return res;
	}
	type Composite={
		add(a:Parser):void,
		get():Parser,
	};
	function composite(a?:Parser):Composite {
		let e=a;
		return {
			add(a:Parser) {
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
	function compositeWithPrio() {
		const prioParsers:{p:Parser, prio:number}[]=[];
		function get(minPrio:number) {
			const r=prioParsers.filter((pp)=>pp.prio>=minPrio||pp.prio===ELEMENTPRIO).map((pp)=>pp.p);
			let res=r[0];
			for (let i=1;i<r.length;i++) {
				res=res.or(r[i]);
			}
			return res;
		};
		return {
			reg(prio:number, p:Parser) {
				prioParsers.push({p,prio})
			},
			get,
			build() {
				const res:Parser[]=[];
				for (let i=0;i<prioParsers.length;i++) {
					res[i]=get(i);
				}
				return res;
			}
		};
	}
	/*function typeComposite() {
		const built=composite();
		return {
			reg(type:OpType, prio:number, a:Parser) {
				const opt=opDesc(type, prio);
				built.add(context.create((r:State)=>{
					const r2=a.parse(r);
					(r2 as any).opType=opt;
					return r2;
				}).setName("(opType "+opt+" "+a.name+")").copyFirst(a) );
			},
			get() {return built.get();},
			parse(st:State) {
				return this.get().parse(st);
			}
		};
	}*/

	const prefixOrElement=composite(), postfixOrInfix=compositeWithPrio();
	const element=composite();
	//const trifixes=new WeakMap<Parser, Parser>();//[] as Parser[];
	type MkInfix=(left:any, op:any, right:any)=>any;
	type MkPrefix=(op:any, right:any)=>any;
	type MkPostfix=(left:any, op:any)=>any;
	type MkTrifix=(left:any, op:any, mid:any, op2:any, right:any)=>any;
	function reg(type:OpType, prio:number, p:Parser) {
		const opt=opDesc(type, prio);
		opt.reg(type, p);
	}
	function toStrF(...attrs:string[]) {
		return function () {
			let buf="(";
			for (let a of attrs) {
				buf+=this[a];
			}
			return buf+")";
		};
	}
	let prefixOrElement_built:Parser, postfixOrInfix_built:Parser[];
	const $={
		element(e:Parser) {
			reg("element", ELEMENTPRIO, e);
			element.add(e);
		},
		getElement() {return element.get();},
		prefix(prio:number, pre:Parser) {
			reg("prefix", prio, pre);
		},
		postfix(prio:number, post:Parser) {
			reg("postfix", prio, post);
		},
		infixl(prio:number, inf:Parser) {
			reg("infixl", prio, inf);
		},
		infixr(prio:number, inf:Parser) {
			reg("infixr", prio, inf);
		},
		infix(prio:number, inf:Parser) {
			reg("infix", prio, inf);
		},
		trifixr (prio:number, tf1:Parser, tf2:Parser) {
			reg("trifixr", prio, tf1.assign({[TF2]:tf2}));
			//postfixOrInfix.reg("trifixr2", prio, tf2);
			//trifixes.set(tf1,tf2);
		},
		mkInfix(f:MkInfix) {
			$.mkInfix_def=f;
		},
		mkInfixl(f:MkInfix) {
			$.mkInfixl_def=f;
		},
		mkInfixr(f:MkInfix) {
			$.mkInfixr_def=f;
		},
		mkPrefix(f:MkPrefix) {
			$.mkPrefix_def=f;
		},
		mkPostfix(f:MkPostfix) {
			$.mkPostfix_def=f;
		},
		mkTrifixr(f:MkTrifix) {
			$.mkTrifixr_def=f;
		},
		built: null,
		build() {
			//postfixOrInfix.build();
			//prefixOrElement.build();
			//console.log("BUILT fst ");
			//prefixOrElement.get().dispTbl();
			prefixOrElement_built=prefixOrElement.get();
			postfixOrInfix_built=postfixOrInfix.build();
			let built=context.create(
				(st:State)=>parse(0,st)
			).setName(name).copyFirst(prefixOrElement_built);
			//const fst=prefixOrElement.get()._first;
			//built.dispTbl();
			/*if (fst && !fst[ALL] && context.space==="TOKEN") {
				built=built.firstTokens(Object.keys(fst));
			}*/
			$.built=built;
			return built;
		},
		mkInfix_def(left:any, op:any,right:any) {
			return setRange({type:"infix", op, left, right, toString:toStrF("left","op","right") });
		},
		mkInfixl_def(left:any, op:any , right:any) {
			return setRange({type:"infixl",op ,left, right, toString:toStrF("left","op","right") });
		},
		mkInfixr_def(left:any, op:any , right:any) {
			return setRange({type:"infixr",op ,left, right, toString:toStrF("left","op","right")});
		},
		mkPrefix_def (op:any , right:any) {
			return setRange({type:"prefix", op, right, toString:toStrF("op","right")});
		},
		mkPostfix_def (left:any, op:any) {
			return setRange({type:"postfix", left, op, toString:toStrF("left","op")});
		},
		mkTrifixr_def(left:any, op1:any, mid:any, op2:any, right:any) {
			return setRange({type:"trifixr", left, op1, mid, op2, right, toString:toStrF("left","op1","mid","op2","right")});
		},
		lazy() {
			return context.create(
				(st:State)=>$.built.parse(st)
			).setName(name,{type:"lazy",name});
		},
	};
	function dump(st:State, lbl:string) {
		/*var s=st.src.str;
		console.log("["+lbl+"] "+s.substring(0,st.pos)+"^"+s.substring(st.pos)+
				" opType="+ st.opType+"  Succ = "+st.isSuccess()+" res="+st.result[0]);*/
		//console.log(lbl,st+"");
		return st;
	}
	function parse(minPrio:number, st:State) {
		dump(st,"start minPrio="+minPrio);
		function parsePrefixOrElement(st:State):State {
			const svst=st;
			st=prefixOrElement_built.parse(st);
			dump(st,"prefixorelem minPrio="+minPrio);
			if (!st.success) return svst.withError(st.error);
			let res:State;// res.success is always true
			const pre=st.result[0];
			const opt:OpDesc=pre[OPTYPE];
			if (opt.type("prefix") ) {
				// st = -^elem
				//const pre=st.result[0];
				st=parse(opt.prio, st);
				if (!st.success) return svst.withError(st.error);
				// st: Expr    st.pos = -elem^
				const pex=$.mkPrefix_def(pre, st.result[0]);
				res=st.clone();
				res.result=[pex]; // res:prefixExpr  res.pos= -elem^
			} else { //elem
				res=st;
			}
			return res;
		}
		const svst=st;
		st=parsePrefixOrElement(st);
		if (!st.success) return svst.withError(st.error);
		let res=st;// res.success is always true
		// assert st:postfixOrInfix  res:Expr
		if (!postfixOrInfix_built[minPrio]) return dump(res, "noprio");
		while (true) {
			dump(st,"st:pi");
			dump(res,"res:pi");
			st=postfixOrInfix_built[minPrio].parse(st);
			if (!st.success) return dump(res, "noop"+(st===res));
			const left=res.result[0];
			const op=st.result[0];
			const opt:OpDesc=op[OPTYPE];
			dump(res,"res:ex newprio="+opt.prio);
			// assert st:postfixOrInfix  res:Expr
			if (opt.type("postfix")) {
				// st:postfix
				const pex=$.mkPostfix_def(left, op);
				res=st.clone();
				res.result=[pex]; // res.pos= expr++^
			} else if (opt.type("infixl")){  //x+y+z
				// st: infixl
				st=parse(opt.prio+1, st);
				if (!st.success) return dump(res, "noinf");
				const right=st.result[0];
				// st: expr   st.pos=  expr+expr^
				const pex=$.mkInfixl_def(left, op , right);
				res=st.clone();
				res.result=[pex]; //res:infixlExpr
			} else if (opt.type("infixr")) { //a=^b=c
				// st: infixr
				st=parse(opt.prio ,st);
				if (!st.success) return dump(res, "noinf");
				// st: expr   st.pos=  a=b=c^
				const right=st.result[0];
				const pex=$.mkInfixr_def(left, op, right);
				res=st.clone();
				res.result=[pex]; //res:infixrExpr
			} else if (opt.type("trifixr")) { //left?^mid:right
				// st: trifixr
				const inf1=op;  // inf1 =  ?
				st=parse(opt.prio+1 ,st);
				if (!st.success) return dump(res, "notrif1");
				// st= expr   st.pos=  left?mid^:right
				const mid=st.result[0];
				const inf2p=op[TF2];
				st=inf2p.parse(st);
				// st= :      st.pos= left?mid:^right;
				if (!st.success) return dump(res, "notrif_mid");
				const inf2 = st.result[0];
				st=parse(opt.prio ,st);
				if (!st.success) return dump(res, "notrif2");
				const right=st.result[0];
				// st=right      st.pos= left?mid:right^;
				const pex=$.mkTrifixr_def(left, inf1 , mid, inf2, right);
				res=st.clone();
				res.result=[pex]; //res:infixrExpr
			} else { // infix
				// st: infixl
				const inf=st.result[0];
				st=parse(opt.prio+1 ,st);
				if (!st.success) return dump(res, "noinf");
				// st: expr   st.pos=  expr+expr^
				const pex=$.mkInfix_def(res.result[0], inf , st.result[0]);
				res=st.clone();
				res.result=[pex]; //res:infixExpr
			}
			// assert st:postfixOrInfix  res:Expr
		}
	}

	return $;
};
