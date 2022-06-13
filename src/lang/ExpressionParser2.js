"use strict";
// parser.js の補助ライブラリ．式の解析を担当する
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExpressionParser = void 0;
const parser_1 = require("./parser");
//import Parser from "./parser";
const OPTYPE = Symbol("OPTYPE");
function ExpressionParser(context, name = "Expression") {
    function opType(type, prio) {
        return {
            eq(o) { return type == o.type() && prio == o.prio(); },
            type(t) { if (!t)
                return type;
            else
                return t == type; },
            prio() { return prio; },
            toString() { return "[" + type + ":" + prio + "]"; },
        };
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
    function typeComposite() {
        const built = composite();
        return {
            reg(type, prio, a) {
                const opt = opType(type, prio);
                built.add(a.assign({ [OPTYPE]: opt }));
            },
            get() { return built.get(); },
            parse(st) {
                return this.get().parse(st);
            }
        };
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
    const prefixOrElement = typeComposite(), postfixOrInfix = typeComposite();
    const element = composite();
    const trifixes = [];
    const $ = {
        element(e) {
            prefixOrElement.reg("element", -1, e);
            element.add(e);
        },
        getElement() { return element.get(); },
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
        trifixr(prio, tf1, tf2) {
            postfixOrInfix.reg("trifixr", prio, tf1);
            //postfixOrInfix.reg("trifixr2", prio, tf2);
            trifixes[prio] = tf2;
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
            let built = context.create((st) => parse(0, st)).setName(name).copyFirst(prefixOrElement.get());
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
                " opType="+ getOpType(s)+"  Succ = "+st.isSuccess()+" res="+st.result[0]);*/
        //console.log(lbl,st+"");
    }
    function getOpType(s) {
        return s.result[0][OPTYPE];
    }
    function parse(minPrio, st) {
        let res = st, opt;
        dump(st, " start minprio= " + minPrio);
        st = prefixOrElement.parse(st);
        dump(st, " prefixorelem " + minPrio);
        if (!st.isSuccess()) {
            return st;
        }
        //p2=st.result[0];
        opt = getOpType(st);
        if (opt.type("prefix")) {
            // st = -^elem
            const pre = st.result[0];
            st = parse(opt.prio(), st);
            if (!st.isSuccess()) {
                return st;
            }
            // st: Expr    st.pos = -elem^
            const pex = $.mkPrefix_def(pre, st.result[0]);
            res = st.clone(); //  res:Expr
            res.result = [pex]; // res:prefixExpr  res.pos= -elem^
            if (!getNextPostfixOrInfix(st)) {
                return res;
            }
            // st.next =  -elem+^elem
            st = getNextPostfixOrInfix(st); // st: postfixOrInfix
        }
        else { //elem
            //p=p2;
            res = st.clone(); // res:elemExpr   res =  elem^
            st = postfixOrInfix.parse(st);
            if (!st.isSuccess()) {
                return res;
            }
        }
        // assert st:postfixOrInfix  res:Expr
        while (true) {
            dump(st, "st:pi");
            dump(res, "res:ex");
            opt = getOpType(st);
            if (opt.prio() < minPrio) {
                return setNextPostfixOrInfix(res, st);
            }
            // assert st:postfixOrInfix  res:Expr
            if (opt.type("postfix")) {
                // st:postfix
                const pex = $.mkPostfix_def(res.result[0], st.result[0]);
                res = st.clone();
                res.result = [pex]; // res.pos= expr++^
                dump(st, "185");
                st = postfixOrInfix.parse(st); // st. pos= expr++--^
                if (!st.isSuccess()) {
                    return res;
                }
            }
            else if (opt.type("infixl")) { //x+y+z
                // st: infixl
                var inf = st.result[0];
                st = parse(opt.prio() + 1, st);
                if (!st.isSuccess()) {
                    return res;
                }
                // st: expr   st.pos=  expr+expr^
                const pex = $.mkInfixl_def(res.result[0], inf, st.result[0]);
                res = st.clone();
                res.result = [pex]; //res:infixlExpr
                if (!getNextPostfixOrInfix(st)) {
                    return res;
                }
                st = getNextPostfixOrInfix(st);
            }
            else if (opt.type("infixr")) { //a=^b=c
                // st: infixr
                const inf = st.result[0];
                st = parse(opt.prio(), st);
                if (!st.isSuccess()) {
                    return res;
                }
                // st: expr   st.pos=  a=b=c^
                const pex = $.mkInfixr_def(res.result[0], inf, st.result[0]);
                res = st.clone();
                res.result = [pex]; //res:infixrExpr
                if (!getNextPostfixOrInfix(st)) {
                    return res;
                }
                st = getNextPostfixOrInfix(st);
            }
            else if (opt.type("trifixr")) { //left?^mid:right
                // st: trifixr
                var left = res.result[0];
                var inf1 = st.result[0]; // inf1 =  ?
                st = parse(opt.prio() + 1, st);
                if (!st.isSuccess()) {
                    return res;
                }
                // st= expr   st.pos=  left?mid^:right
                var mid = st.result[0];
                st = trifixes[opt.prio()].parse(st);
                // st= :      st.pos= left?mid:^right;
                if (!st.isSuccess()) {
                    return res;
                }
                var inf2 = st.result[0];
                st = parse(opt.prio(), st);
                if (!st.isSuccess()) {
                    return res;
                }
                var right = st.result[0];
                // st=right      st.pos= left?mid:right^;
                const pex = $.mkTrifixr_def(left, inf1, mid, inf2, right);
                res = st.clone();
                res.result = [pex]; //res:infixrExpr
                if (!getNextPostfixOrInfix(st)) {
                    return res;
                }
                st = getNextPostfixOrInfix(st);
            }
            else { // infix
                // st: infixl
                const inf = st.result[0];
                st = parse(opt.prio() + 1, st);
                if (!st.isSuccess()) {
                    return res;
                }
                // st: expr   st.pos=  expr+expr^
                const pex = $.mkInfix_def(res.result[0], inf, st.result[0]);
                res = st.clone();
                res.result = [pex]; //res:infixExpr
                if (!getNextPostfixOrInfix(st)) {
                    return res;
                }
                st = getNextPostfixOrInfix(st);
                if (opt.prio() == getOpType(st).prio()) {
                    res.error = "error"; //success=false;
                    return res;
                }
            }
            // assert st:postfixOrInfix  res:Expr
        }
    }
    const NEXT = Symbol("NEXT");
    function getNextPostfixOrInfix(st) {
        return st.result[0][NEXT];
    }
    function setNextPostfixOrInfix(res, next) {
        res.result[0][NEXT] = next;
        return res;
    }
    return $;
}
exports.ExpressionParser = ExpressionParser;
;
