"use strict";
/*
* Tonyu2 の構文解析を行う．
* TonyuLang.parse(src);
*   - srcを解析して構文木を返す．構文エラーがあれば例外を投げる．
*/
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
//import * as Parser from "./parser";
const TError_1 = __importDefault(require("../runtime/TError"));
const R_1 = __importDefault(require("../lib/R"));
const ExpressionParser2_1 = require("./ExpressionParser2");
const Grammar_1 = __importDefault(require("./Grammar"));
const parser_1 = require("./parser");
const tokenizerFactory_1 = require("./tokenizerFactory");
module.exports = function PF({ TT }) {
    //var p:any=Parser;
    var $ = {};
    var g = (0, Grammar_1.default)(parser_1.TokensParser.context);
    var G = g.get;
    var tk = parser_1.TokensParser.token;
    function disp(n) { return JSON.stringify(n); }
    var num = tk("number").ret(function (n) {
        n.type = "number";
        if (typeof n.text != "string")
            throw new Error("No text for " + disp(n));
        n.value = (n.text - 0);
        if (isNaN(n.value))
            throw new Error("No value for " + disp(n));
        return n;
    }).setName("numberLiteral");
    var symbol = tk("symbol");
    var symresv = tk("symbol");
    for (var resvk in TT.reserved) {
        var resvp = tk(resvk);
        //console.log(resvk,resvp, resvp instanceof Parser.Parser);
        if (resvp instanceof parser_1.Parser && resvk !== "constructor") {
            /*if (resvk==="constructor") {
                console.log("c");
            }*/
            symresv = symresv.or(resvp);
        }
    }
    var eqq = tk("===");
    var nee = tk("!==");
    var eq = tk("==");
    var ne = tk("!=");
    var ge = tk(">=");
    var le = tk("<=");
    var gt = tk(">");
    var lt = tk("<");
    var andand = tk("&&");
    var oror = tk("||");
    var bitand = tk("&");
    var bitor = tk("|");
    var bitxor = tk("^");
    var shr = tk(">>");
    var shl = tk("<<");
    var ushr = tk(">>>");
    var minus = tk("-"); //.first(space,"-");
    var plus = tk("+"); //.first(space,"+");
    var mul = tk("*");
    var div = tk("/");
    var mod = tk("%");
    var assign = tk("=");
    var literal = tk("literal");
    var regex = tk("regex");
    /*function retF(n) {
        return function () {
            return arguments[n];
        };
    }*/
    function comLastOpt(p) {
        return p.sep0(tk(",")).and(tk(",").opt()).retN(0).setName(`(comLastOpt ${p.name})`, { type: "rept", elem: p });
    }
    var e = (0, ExpressionParser2_1.ExpressionParser)(parser_1.TokensParser.context);
    var explz = e.lazy(); //.firstTokens(ALL);
    const dottableExpr = explz.or(tk("...").and(explz).ret((_, e) => ({ type: "dotExpr", expr: e })));
    var arrayElem = g("arrayElem").ands(tk("["), explz, tk("]")).ret(null, "subscript");
    var argList = g("argList").ands(tk("("), comLastOpt(dottableExpr), tk(")")).ret(null, "args");
    var member = g("member").ands(tk("."), symresv).ret(null, "name");
    var parenExpr = g("parenExpr").ands(tk("("), explz, tk(")")).ret(null, "expr");
    var varAccess = g("varAccess").ands(symbol).ret("name");
    // _l = _lazy
    var funcExpr_l = G("funcExpr").firstTokens(["function", "\\", "("]);
    var nonArrowFuncExpr_l = G("nonArrowFuncExpr").firstTokens(["function", "\\"]);
    var funcExprArg = g("funcExprArg").ands(nonArrowFuncExpr_l).ret("obj");
    var objlit_l = G("objlit").firstTokens("{");
    var objlitArg = g("objlitArg").ands(objlit_l).ret("obj");
    var objOrFuncArg = g("objOrFuncArg").ors(objlitArg, funcExprArg);
    const backquoteLiteral = g("backquoteLiteral").ands(tk(tokenizerFactory_1.BQH), tk(tokenizerFactory_1.BQX).or(explz).rep0(), tk(tokenizerFactory_1.BQT)).ret(null, "body");
    function genCallBody(argList, oof) {
        var res = [];
        if (argList && !argList.args) {
            throw disp(argList);
        }
        if (argList) {
            var rg = (0, parser_1.getRange)(argList);
            (0, parser_1.addRange)(res, rg);
            argList.args.forEach(function (arg) {
                res.push(arg);
            });
        }
        oof.forEach(function (o) {
            var rg = (0, parser_1.getRange)(o);
            (0, parser_1.addRange)(res, rg);
            res.push(o.obj);
        });
        return res;
    }
    const callBodyWithArgList = argList.and(objOrFuncArg.rep0()).ret(function (a, oof) {
        return genCallBody(a, oof);
    });
    g("callBodyWithArgList").alias(callBodyWithArgList);
    const callBodyWithoutArgList = objOrFuncArg.rep1().ret(function (oof) {
        return genCallBody(null, oof);
    });
    g("callBodyWithoutArgList").alias(callBodyWithoutArgList);
    const callBody = g("callBody").ors(callBodyWithArgList, callBodyWithoutArgList); //or().setName("callBody");
    //var callBodyOld=argList.or(objlitArg);
    var call = g("call").ands(callBody).ret("args");
    var scall = g("scall").ands(callBody).ret("args"); //supercall
    var newExpr = g("newExpr").ands(tk("new"), varAccess, call.opt()).ret(null, "klass", "params");
    var superExpr = g("superExpr").ands(tk("super"), tk(".").and(symbol).retN(1).opt(), scall).ret(null, "name", "params");
    var reservedConst = tk("true").or(tk("false")).
        or(tk("null")).
        or(tk("undefined")).
        or(tk("_thread")).
        or(tk("this")).
        or(tk("arguments")).ret(function (t) {
        t.type = "reservedConst";
        return t;
    }).setName("reservedConst");
    e.element(num);
    e.element(reservedConst);
    e.element(regex);
    e.element(literal);
    e.element(backquoteLiteral);
    e.element(funcExpr_l);
    e.element(parenExpr);
    e.element(newExpr);
    e.element(superExpr);
    e.element(objlit_l);
    e.element(G("arylit").firstTokens("["));
    e.element(varAccess);
    var prio = 0;
    e.infixr(prio, assign);
    e.infixr(prio, tk("+="));
    e.infixr(prio, tk("-="));
    e.infixr(prio, tk("*="));
    e.infixr(prio, tk("/="));
    e.infixr(prio, tk("%="));
    e.infixr(prio, tk("|="));
    e.infixr(prio, tk("&="));
    prio++;
    e.trifixr(prio, tk("?"), tk(":"));
    prio++;
    e.infixl(prio, oror);
    prio++;
    e.infixl(prio, andand);
    prio++;
    e.infixl(prio, bitor);
    prio++;
    e.infixl(prio, bitxor);
    prio++;
    e.infixl(prio, bitand);
    prio++;
    e.infix(prio, tk("instanceof"));
    e.infix(prio, tk("is"));
    //e.infix(prio,tk("in"));
    e.infix(prio, eqq);
    e.infix(prio, nee);
    e.infix(prio, eq);
    e.infix(prio, ne);
    e.infix(prio, ge);
    e.infix(prio, le);
    e.infix(prio, gt);
    e.infix(prio, lt);
    prio++;
    e.infixl(prio, ushr);
    e.infixl(prio, shl);
    e.infixl(prio, shr);
    prio++;
    e.postfix(prio + 3, tk("++"));
    e.postfix(prio + 3, tk("--"));
    e.infixl(prio, minus);
    e.infixl(prio, plus);
    prio++;
    e.infixl(prio, mul);
    e.infixl(prio, div);
    e.infixl(prio, mod);
    prio++;
    e.prefix(prio, tk("typeof"));
    e.prefix(prio, tk("__typeof"));
    e.prefix(prio, tk("__await"));
    e.prefix(prio, tk("delete"));
    e.prefix(prio, tk("++"));
    e.prefix(prio, tk("--"));
    e.prefix(prio, tk("+"));
    e.prefix(prio, tk("-"));
    e.prefix(prio, tk("!"));
    e.prefix(prio, tk("~"));
    prio++;
    //    e.postfix(prio,tk("++"));
    //    e.postfix(prio,tk("--"));
    prio++;
    e.postfix(prio, call);
    e.postfix(prio, member);
    e.postfix(prio, arrayElem);
    function mki(left, op, right) {
        const res = { type: "infix", left, op, right };
        (0, parser_1.setRange)(res);
        res.toString = function () {
            return "(" + left + op + right + ")";
        };
        return res;
    }
    e.mkInfixl(mki);
    e.mkInfixr(mki);
    /*e.mkPostfix(function (p) {
        return {type:"postfix", expr:p};
    });*/
    const expr = e.build(); /*.ret((s:any)=>{
        console.log(s+"");
        return s;
    });*/ //.profile();
    g("elem").alias(e.getElement());
    g("expr").alias(expr);
    //var retF=function (i) { return function (){ return arguments[i];}; };
    const stmt_l = G("stmt"); //.firstTokens(ALL);
    const stmtList = g("stmtList").alias(stmt_l.rep0());
    var exprstmt = g("exprstmt").ands(expr, tk(";")).ret("expr");
    g("compound").ands(tk("{"), stmtList, tk("}")).ret(null, "stmts");
    var elseP = tk("else").and(stmt_l).retN(1);
    var returns = g("return").ands(tk("return"), expr.opt(), tk(";")).ret(null, "value");
    var ifs = g("if").ands(tk("if"), tk("("), expr, tk(")"), stmt_l, elseP.opt()).ret(null, null, "cond", null, "then", "_else");
    /*var trailFor=tk(";").and(expr.opt()).and(tk(";")).and(expr.opt()).ret(function (s, cond, s2, next) {
        return {cond: cond, next:next  };
    });*/
    const declPrefix = tk("var").or(tk("let"));
    var forin = g("forin").ands(declPrefix.opt(), symbol.sep1(tk(","), true), tk("in").or(tk("of")), expr).ret("isVar", "vars", "inof", "set");
    var normalFor = g("normalFor").ands(stmt_l, expr.opt(), tk(";"), expr.opt()).ret("init", "cond", null, "next");
    /*var infor=expr.and(trailFor.opt()).ret(function (a,b) {
        if (b==null) return {type:"forin", expr: a};
        return {type:"normalFor", init:a, cond: b.cond, next:b.next  };
    });*/
    var infor = normalFor.or(forin);
    var fors = g("for").ands(tk("for"), tk("("), infor, tk(")"), "stmt").ret(null, null, "inFor", null, "loop");
    var whiles = g("while").ands(tk("while"), tk("("), expr, tk(")"), "stmt").ret(null, null, "cond", null, "loop");
    var dos = g("do").ands(tk("do"), "stmt", tk("while"), tk("("), expr, tk(")"), tk(";")).ret(null, "loop", null, null, "cond", null, null);
    var cases = g("case").ands(tk("case"), expr, tk(":"), stmtList).ret(null, "value", null, "stmts");
    var defaults = g("default").ands(tk("default"), tk(":"), stmtList).ret(null, null, "stmts");
    var switchs = g("switch").ands(tk("switch"), tk("("), expr, tk(")"), tk("{"), cases.rep1(), defaults.opt(), tk("}")).ret(null, null, "value", null, null, "cases", "defs");
    var breaks = g("break").ands(tk("break"), tk(";")).ret("brk");
    var continues = g("continue").ands(tk("continue"), tk(";")).ret("cont");
    var fins = g("finally").ands(tk("finally"), "stmt").ret(null, "stmt");
    var catchs = g("catch").ands(tk("catch"), tk("("), symbol, tk(")"), "stmt").ret(null, null, "name", null, "stmt");
    var catches = g("catches").ors("catch", "finally");
    var trys = g("try").ands(tk("try"), "stmt", catches.rep1()).ret(null, "stmt", "catches");
    var throwSt = g("throw").ands(tk("throw"), expr, tk(";")).ret(null, "ex");
    const namedTypeExpr = g("namedTypeExpr").ands(symbol).ret("name");
    const tExp = (0, ExpressionParser2_1.ExpressionParser)(parser_1.TokensParser.context);
    tExp.mkPostfix((left, op) => {
        if (op.type === "arrayTypePostfix") {
            //console.log("ARRAYTYPE",left,op);
            return { type: "arrayTypeExpr", element: left };
        }
        if (op.type === "optionalTypePostfix") {
            return left; //TODO
        }
        console.log(left, op);
        throw new Error("Invalid type op type");
    });
    tExp.mkInfixl((left, op, right) => {
        if (op.text === "|") {
            return { type: "unionTypeExpr", left, right };
        }
        throw new Error("Invalid type infix op type");
    });
    const arrayTypePostfix = g("arrayTypePostfix").ands(tk("["), tk("]")).ret();
    const optionalTypePostfix = g("optionalTypePostfix").ands(tk("?")).ret();
    prio = 0;
    tExp.infixl(prio, tk("|"));
    prio++;
    tExp.postfix(prio, arrayTypePostfix);
    tExp.postfix(prio, optionalTypePostfix);
    tExp.element(namedTypeExpr);
    const typeExpr = tExp.build();
    var typeDecl = g("typeDecl").ands(tk(":"), typeExpr).ret(null, "vtype");
    var varDecl = g("varDecl").ands(symbol, typeDecl.opt(), tk("=").and(expr).retN(1).opt()).ret("name", "typeDecl", "value");
    var varsDecl = g("varsDecl").ands(declPrefix, varDecl.sep1(tk(","), true), tk(";")).ret("declPrefix", "decls");
    var paramDecl = g("paramDecl").ands(tk("...").opt(), symbol, typeDecl.opt()).ret("dot", "name", "typeDecl");
    var paramDecls = g("paramDecls").ands(tk("("), comLastOpt(paramDecl), tk(")")).ret(null, "params");
    var setterDecl = g("setterDecl").ands(tk("="), paramDecl).ret(null, "value");
    g("funcDeclHead").ands(tk("nowait").opt(), tk("function").or(tk("fiber")).or(tk("tk_constructor")).or(tk("\\")).opt(), symbol.or(tk("new")), setterDecl.opt(), paramDecls.opt(), typeDecl.opt() // if opt this it is getter
    ).ret("nowait", "ftype", "name", "setter", "params", "rtype");
    var funcDecl = g("funcDecl").ands("funcDeclHead", "compound").ret("head", "body");
    var nativeDecl = g("nativeDecl").ands(tk("native"), symbol, tk(";")).ret(null, "name");
    var ifwait = g("ifWait").ands(tk("ifwait"), "stmt", elseP.opt()).ret(null, "then", "_else");
    //var useThread=g("useThread").ands(tk("usethread"),symbol,"stmt").ret(null, "threadVarName","stmt");
    var empty = g("empty").ands(tk(";")).ret(null);
    const stmt_built = g("stmt").ors("return", "if", "for", "while", "do", "break", "continue", "switch", "ifWait", "try", "throw", "nativeDecl", "funcDecl", "compound", "exprstmt", "varsDecl", "empty");
    // ------- end of stmts
    g("funcExprHead").ands(tk("function").or(tk("\\")), symbol.opt(), paramDecls.opt()).ret(null, "name", "params");
    const nonArrowFuncExpr = g("nonArrowFuncExpr").ands("funcExprHead", "compound").ret("head", "body");
    const arrowFuncExpr = g("arrowFuncExpr").ands(tk("\\").opt(), paramDecls, tk("=>"), expr).ret(null, "params", null, "retVal");
    const funcExpr = g("funcExpr").ors("nonArrowFuncExpr", "arrowFuncExpr");
    var jsonElem = g("jsonElem").ands(symbol.or(literal), tk(":").or(tk("=")).and(expr).retN(1).opt()).ret("key", "value");
    var objlit = g("objlit").ands(tk("{"), comLastOpt(jsonElem), tk("}")).ret(null, "elems");
    var arylit = g("arylit").ands(tk("["), comLastOpt(dottableExpr), tk("]")).ret(null, "elems");
    var ext = g("extends").ands(tk("extends"), symbol.or(tk("null")), tk(";")).
        ret(null, "superclassName");
    var incl = g("includes").ands(tk("includes"), symbol.sep1(tk(","), true), tk(";")).
        ret(null, "includeClassNames");
    var program = g("program").
        ands(ext.opt(), incl.opt(), stmt_built.rep0(), parser_1.TokensParser.eof).
        ret("ext", "incl", "stmts");
    //stmt_built.rep0().dispTbl();
    /*for (var i in g.defs) {
        g.defs[i].profile();
    }*/
    $.parse = function (file) {
        let str;
        if (typeof file == "string") {
            str = file;
        }
        else {
            str = file.text();
        }
        str += "\n"; // For end with // comment with no \n
        var tokenRes = TT.parse(str);
        if (!tokenRes.isSuccess()) {
            //return "ERROR\nToken error at "+tokenRes.src.maxPos+"\n"+
            //	str.substring(0,tokenRes.src.maxPos)+"!!HERE!!"+str.substring(tokenRes.src.maxPos);
            throw (0, TError_1.default)((0, R_1.default)("lexicalError") + ": " + tokenRes.error, file, tokenRes.src.maxErrors.pos);
        }
        var tokens = tokenRes.result[0];
        //console.log("Tokens: "+tokens.join(","));
        const global = { backtrackCount: 0 };
        var res = parser_1.TokensParser.parse(program, tokens, global);
        //console.log("POS="+res.src.maxPos);
        if (res.isSuccess()) {
            var node = res.result[0];
            //console.log("backtrackCount: ", global.backtrackCount+"/"+tokens.length);
            //console.log(disp(node));
            return node;
            //var xmlsrc=$.genXML(str, node);
            //return "<program>"+xmlsrc+"</program>";
        }
        const maxErrors = res.src.maxErrors;
        var lt = tokens[maxErrors.pos];
        var mp = (lt ? lt.pos : str.length);
        const len = (lt ? lt.len : 0);
        throw (0, TError_1.default)((0, R_1.default)("parseError") + `: ${maxErrors.errors.join(", ")}`, file, mp, len);
        /*return "ERROR\nSyntax error at "+mp+"\n"+
        str.substring(0,mp)+"!!HERE!!"+str.substring(mp);*/
    };
    /*$.genXML= function (src, node) {
        var x=XMLBuffer(src) ;
        x(node);
        return x.buf;
    };*/
    $.extension = "tonyu";
    //g.buildTypes();
    //g.checkFirstTbl();
    return $;
};
