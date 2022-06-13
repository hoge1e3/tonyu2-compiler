"use strict";
// parser.js の補助ライブラリ．式の解析を担当する
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExpressionParser = void 0;
const parser_1 = require("./parser");
//import Parser from "./parser";
const OPTYPE = Symbol("OPTYPE"), TF2 = Symbol("TF2");
const ELEMENTPRIO = -1;
function ExpressionParser(context, name = "Expression") {
    const opDescs = [];
    function err(p) { throw new Error(); }
    function opDesc(type, prio) {
        if (opDescs[prio])
            return opDescs[prio];
        const res = {
            eq(o) { return type == o.type() && prio == o.prio; },
            type(t) { if (!t)
                return type;
            else
                return t == type; },
            prio,
            toString() { return "[" + type + ":" + prio + "]"; },
            reg(type, p) {
                p = p.assign({ [OPTYPE]: res });
                if (type === "infixl" || type === "infixr" || type === "infix"
                    || type === "postfix" || type === "trifixr") {
                    postfixOrInfix.reg(prio, p);
                }
                else if (type === "element") {
                    element.add(p);
                    prefixOrElement.add(p);
                }
                else if (type === "prefix") {
                    prefixOrElement.add(p);
                }
                else {
                    throw err(type);
                }
            }
        };
        opDescs[prio] = res;
        return res;
    }
    function composite(a) {
        let e = a;
        return {
            add(a) {
                if (!e) {
                    e = a;
                }
                else {
                    e = e.or(a);
                }
            },
            get() {
                return e;
            }
        };
    }
    function compositeWithPrio() {
        const prioParsers = [];
        function get(minPrio) {
            const r = prioParsers.filter((pp) => pp.prio >= minPrio || pp.prio === ELEMENTPRIO).map((pp) => pp.p);
            let res = r[0];
            for (let i = 1; i < r.length; i++) {
                res = res.or(r[i]);
            }
            return res;
        }
        ;
        return {
            reg(prio, p) {
                prioParsers.push({ p, prio });
            },
            get,
            build() {
                const res = [];
                for (let i = 0; i < prioParsers.length; i++) {
                    res[i] = get(i);
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
    const prefixOrElement = composite(), postfixOrInfix = compositeWithPrio();
    const element = composite();
    function reg(type, prio, p) {
        const opt = opDesc(type, prio);
        opt.reg(type, p);
    }
    function toStrF(...attrs) {
        return function () {
            let buf = "(";
            for (let a of attrs) {
                buf += this[a];
            }
            return buf + ")";
        };
    }
    let prefixOrElement_built, postfixOrInfix_built;
    const $ = {
        element(e) {
            reg("element", ELEMENTPRIO, e);
            element.add(e);
        },
        getElement() { return element.get(); },
        prefix(prio, pre) {
            reg("prefix", prio, pre);
        },
        postfix(prio, post) {
            reg("postfix", prio, post);
        },
        infixl(prio, inf) {
            reg("infixl", prio, inf);
        },
        infixr(prio, inf) {
            reg("infixr", prio, inf);
        },
        infix(prio, inf) {
            reg("infix", prio, inf);
        },
        trifixr(prio, tf1, tf2) {
            reg("trifixr", prio, tf1.assign({ [TF2]: tf2 }));
            //postfixOrInfix.reg("trifixr2", prio, tf2);
            //trifixes.set(tf1,tf2);
        },
        mkInfix(f) {
            $.mkInfix_def = f;
        },
        mkInfixl(f) {
            $.mkInfixl_def = f;
        },
        mkInfixr(f) {
            $.mkInfixr_def = f;
        },
        mkPrefix(f) {
            $.mkPrefix_def = f;
        },
        mkPostfix(f) {
            $.mkPostfix_def = f;
        },
        mkTrifixr(f) {
            $.mkTrifixr_def = f;
        },
        built: null,
        build() {
            //postfixOrInfix.build();
            //prefixOrElement.build();
            //console.log("BUILT fst ");
            //prefixOrElement.get().dispTbl();
            prefixOrElement_built = prefixOrElement.get();
            postfixOrInfix_built = postfixOrInfix.build();
            let built = context.create((st) => parse(0, st)).setName(name).copyFirst(prefixOrElement_built);
            //const fst=prefixOrElement.get()._first;
            //built.dispTbl();
            /*if (fst && !fst[ALL] && context.space==="TOKEN") {
                built=built.firstTokens(Object.keys(fst));
            }*/
            $.built = built;
            return built;
        },
        mkInfix_def(left, op, right) {
            return (0, parser_1.setRange)({ type: "infix", op, left, right, toString: toStrF("left", "op", "right") });
        },
        mkInfixl_def(left, op, right) {
            return (0, parser_1.setRange)({ type: "infixl", op, left, right, toString: toStrF("left", "op", "right") });
        },
        mkInfixr_def(left, op, right) {
            return (0, parser_1.setRange)({ type: "infixr", op, left, right, toString: toStrF("left", "op", "right") });
        },
        mkPrefix_def(op, right) {
            return (0, parser_1.setRange)({ type: "prefix", op, right, toString: toStrF("op", "right") });
        },
        mkPostfix_def(left, op) {
            return (0, parser_1.setRange)({ type: "postfix", left, op, toString: toStrF("left", "op") });
        },
        mkTrifixr_def(left, op1, mid, op2, right) {
            return (0, parser_1.setRange)({ type: "trifixr", left, op1, mid, op2, right, toString: toStrF("left", "op1", "mid", "op2", "right") });
        },
        lazy() {
            return context.create((st) => $.built.parse(st)).setName(name, { type: "lazy", name });
        },
    };
    function dump(st, lbl) {
        /*var s=st.src.str;
        console.log("["+lbl+"] "+s.substring(0,st.pos)+"^"+s.substring(st.pos)+
                " opType="+ st.opType+"  Succ = "+st.isSuccess()+" res="+st.result[0]);*/
        //console.log(lbl,st+"");
        return st;
    }
    function parse(minPrio, st) {
        dump(st, "start minPrio=" + minPrio);
        function parsePrefixOrElement(st) {
            const svst = st;
            st = prefixOrElement_built.parse(st);
            dump(st, "prefixorelem minPrio=" + minPrio);
            if (!st.success)
                return svst.withError(st.error);
            let res; // res.success is always true
            const pre = st.result[0];
            const opt = pre[OPTYPE];
            if (opt.type("prefix")) {
                // st = -^elem
                //const pre=st.result[0];
                st = parse(opt.prio, st);
                if (!st.success)
                    return svst.withError(st.error);
                // st: Expr    st.pos = -elem^
                const pex = $.mkPrefix_def(pre, st.result[0]);
                res = st.clone();
                res.result = [pex]; // res:prefixExpr  res.pos= -elem^
            }
            else { //elem
                res = st;
            }
            return res;
        }
        const svst = st;
        st = parsePrefixOrElement(st);
        if (!st.success)
            return svst.withError(st.error);
        let res = st; // res.success is always true
        // assert st:postfixOrInfix  res:Expr
        if (!postfixOrInfix_built[minPrio])
            return dump(res, "noprio");
        while (true) {
            dump(st, "st:pi");
            dump(res, "res:pi");
            st = postfixOrInfix_built[minPrio].parse(st);
            if (!st.success)
                return dump(res, "noop" + (st === res));
            const left = res.result[0];
            const op = st.result[0];
            const opt = op[OPTYPE];
            dump(res, "res:ex newprio=" + opt.prio);
            // assert st:postfixOrInfix  res:Expr
            if (opt.type("postfix")) {
                // st:postfix
                const pex = $.mkPostfix_def(left, op);
                res = st.clone();
                res.result = [pex]; // res.pos= expr++^
            }
            else if (opt.type("infixl")) { //x+y+z
                // st: infixl
                st = parse(opt.prio + 1, st);
                if (!st.success)
                    return dump(res, "noinf");
                const right = st.result[0];
                // st: expr   st.pos=  expr+expr^
                const pex = $.mkInfixl_def(left, op, right);
                res = st.clone();
                res.result = [pex]; //res:infixlExpr
            }
            else if (opt.type("infixr")) { //a=^b=c
                // st: infixr
                st = parse(opt.prio, st);
                if (!st.success)
                    return dump(res, "noinf");
                // st: expr   st.pos=  a=b=c^
                const right = st.result[0];
                const pex = $.mkInfixr_def(left, op, right);
                res = st.clone();
                res.result = [pex]; //res:infixrExpr
            }
            else if (opt.type("trifixr")) { //left?^mid:right
                // st: trifixr
                const inf1 = op; // inf1 =  ?
                st = parse(opt.prio + 1, st);
                if (!st.success)
                    return dump(res, "notrif1");
                // st= expr   st.pos=  left?mid^:right
                const mid = st.result[0];
                const inf2p = op[TF2];
                st = inf2p.parse(st);
                // st= :      st.pos= left?mid:^right;
                if (!st.success)
                    return dump(res, "notrif_mid");
                const inf2 = st.result[0];
                st = parse(opt.prio, st);
                if (!st.success)
                    return dump(res, "notrif2");
                const right = st.result[0];
                // st=right      st.pos= left?mid:right^;
                const pex = $.mkTrifixr_def(left, inf1, mid, inf2, right);
                res = st.clone();
                res.result = [pex]; //res:infixrExpr
            }
            else { // infix
                // st: infixl
                const inf = st.result[0];
                st = parse(opt.prio + 1, st);
                if (!st.success)
                    return dump(res, "noinf");
                // st: expr   st.pos=  expr+expr^
                const pex = $.mkInfix_def(res.result[0], inf, st.result[0]);
                res = st.clone();
                res.result = [pex]; //res:infixExpr
            }
            // assert st:postfixOrInfix  res:Expr
        }
    }
    return $;
}
exports.ExpressionParser = ExpressionParser;
;
