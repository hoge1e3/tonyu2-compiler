"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.genJS = void 0;
const Visitor_1 = require("./Visitor");
const IndentBuffer_1 = require("./IndentBuffer");
const tonyu1_1 = require("./tonyu1");
const OM = __importStar(require("./ObjectMatcher"));
const cu = __importStar(require("./compiler"));
const context_1 = require("./context");
const CompilerTypes_1 = require("./CompilerTypes");
const compiler_1 = require("./compiler");
//export=(cu as any).JSGenerator=(function () {
// TonyuソースファイルをJavascriptに変換する
const TH = "_thread", THIZ = "_this", ARGS = "_arguments", FIBPRE = "fiber$" /*F,RMPC="__pc", LASTPOS="$LASTPOS",CNTV="__cnt",CNTC=100*/; //G
var BINDF = "Tonyu.bindFunc";
var INVOKE_FUNC = "Tonyu.invokeMethod";
var CALL_FUNC = "Tonyu.callFunc";
var CHK_NN = "Tonyu.checkNonNull";
var CLASS_HEAD = "Tonyu.classes.", GLOBAL_HEAD = "Tonyu.globals.";
var GET_THIS = "this"; //"this.isTonyuObject?this:Tonyu.not_a_tonyu_object(this)";
var USE_STRICT = '"use strict";%n';
var ITER2 = "Tonyu.iterator2";
var SUPER = "__superClass";
/*var ScopeTypes={FIELD:"field", METHOD:"method", NATIVE:"native",//B
        LOCAL:"local", THVAR:"threadvar", PARAM:"param", GLOBAL:"global", CLASS:"class"};*/
var ScopeTypes = cu.ScopeTypes;
//var genSt=cu.newScopeType;
var stype = cu.getScopeType;
//var newScope=cu.newScope;
//var nc=cu.nullCheck;
//var genSym=cu.genSym;
var annotation3 = cu.annotation;
var getMethod2 = cu.getMethod;
var getDependingClasses = cu.getDependingClasses;
var getParams = cu.getParams;
//-----------
function genJS(klass, env, genOptions) {
    var srcFile = klass.src.tonyu; //file object  //S
    var srcCont = srcFile.text();
    function getSource(node) {
        return cu.getSource(srcCont, node);
    }
    genOptions = genOptions || {};
    // env.codeBuffer is not recommended(if generate in parallel...?)
    const buf = (genOptions.codeBuffer || env.codeBuffer ||
        new IndentBuffer_1.IndentBuffer({ fixLazyLength: 6, compress: env.options.compiler.compress }));
    var traceIndex = genOptions.traceIndex || {};
    buf.setSrcFile(srcFile);
    var printf = buf.printf;
    var ctx = (0, context_1.context)();
    var debug = false;
    //var traceTbl=env.traceTbl;
    // method := fiber | function
    const decls = klass.decls;
    const methods = decls.methods;
    // ↑ このクラスが持つフィールド，ファイバ，関数，ネイティブ変数の集まり．親クラスの宣言は含まない
    var ST = ScopeTypes;
    var fnSeq = 0;
    var diagnose = env.options.compiler.diagnose;
    var genMod = env.options.compiler.genAMD;
    var doLoopCheck = !env.options.compiler.noLoopCheck;
    function annotation(node, aobj = undefined) {
        return annotation3(klass.annotation, node, aobj);
    }
    function getClassName(klass) {
        if (typeof klass == "string")
            return CLASS_HEAD + (env.aliases[klass] || klass); //CFN  CLASS_HEAD+env.aliases[klass](null check)
        if (klass.builtin)
            return klass.fullName; // CFN klass.fullName
        return CLASS_HEAD + klass.fullName; // CFN  klass.fullName
    }
    function getClassNames(cs) {
        return cs.map(getClassName);
        /*var res=[];
        cs.forEach(function (c) { res.push(getClassName(c)); });
        return res;*/
    }
    function enterV(obj, node) {
        return function (buf) {
            ctx.enter(obj, function () {
                v.visit(node);
            });
        };
    }
    function varAccess(n, si, an) {
        var t = stype(si);
        if (t == ST.THVAR) {
            buf.printf("%s", TH);
        }
        else if (t == ST.FIELD || t == ST.PROP) {
            buf.printf("%s.%s", THIZ, n);
        }
        else if (t == ST.METHOD) {
            if (an && an.noBind) {
                buf.printf("%s.%s", THIZ, n);
            }
            else {
                buf.printf("%s(%s,%s.%s)", BINDF, THIZ, THIZ, n);
            }
        }
        else if (t == ST.CLASS) {
            buf.printf("%s", getClassName(n));
        }
        else if (t == ST.GLOBAL) {
            buf.printf("%s%s", GLOBAL_HEAD, n);
        }
        else if (t == ST.PARAM || t == ST.LOCAL || t == ST.NATIVE || t == ST.MODULE) {
            if ((0, tonyu1_1.isTonyu1)(env.options) && t == ST.NATIVE) {
                buf.printf("%s.%s", THIZ, n);
            }
            else {
                buf.printf("%s", n);
            }
        }
        else {
            console.log("Unknown scope type: ", t);
            throw new Error("Unknown scope type: " + t);
        }
        return si;
    }
    function noSurroundCompoundF(node) {
        return function () {
            noSurroundCompound.apply(this, [node]);
        };
    }
    function noSurroundCompound(node) {
        if (node.type == "compound") {
            buf.printf("%j%n", ["%n", node.stmts]);
        }
        else {
            v.visit(node);
        }
    }
    var THNode = { type: "THNode" }; //G
    function optV(node) {
        if (node)
            return node;
        return { type: "dummy" };
    }
    const v = buf.visitor = new Visitor_1.Visitor({
        THNode: function (node) {
            buf.printf(TH);
        },
        dummy: function (node) {
            buf.printf("");
        },
        literal: function (node) {
            buf.printf("%s", node.text);
        },
        backquoteLiteral(node) {
            buf.printf("[%j].join('')", [",", node.body]);
        },
        backquoteText(node) {
            let s = node.text;
            s = s.replace(/\\(.)/g, (_, r) => {
                switch (r) {
                    case "b": return "\b";
                    case "f": return "\f";
                    case "n": return "\n";
                    case "r": return "\r";
                    case "t": return "\t";
                }
                return r;
            });
            buf.printf("%l", s);
        },
        dotExpr(node) {
            buf.printf("...%v", node.expr);
        },
        paramDecl: function (node) {
            buf.printf("%s%v", node.dot ? "..." : "", node.name);
        },
        paramDecls: function (node) {
            buf.printf("(%j)", [", ", node.params]);
        },
        funcDeclHead: function (node) {
            buf.printf("function %v %v", node.name, node.params);
        },
        funcDecl: function (node) {
        },
        "return": function (node) {
            //if (ctx.inTry) throw TError(R("cannotWriteReturnInTryStatement"),srcFile,node.pos);
            if (!ctx.noWait) {
                if (node.value) {
                    var t = annotation(node.value).fiberCall;
                    if (t) {
                        buf.printf(//VDC
                        "return yield* %s.%s%s(%j);%n", //FIBERCALL
                        THIZ, FIBPRE, t.N, [", ", [THNode].concat(t.A)]);
                    }
                    else {
                        buf.printf("return %v;", node.value);
                    }
                }
                else {
                    buf.printf("return %s;", THIZ);
                }
            }
            else {
                if (node.value) {
                    buf.printf("return %v;", node.value);
                }
                else {
                    buf.printf("return %s;", THIZ);
                }
            }
        },
        /*program: function (node) {
            genClass(node.stmts);
        },*/
        number: function (node) {
            buf.printf("%s", node.value);
        },
        reservedConst: function (node) {
            if (node.text == "this") {
                buf.printf("%s", THIZ);
            }
            else if (node.text == "arguments" && ctx.threadAvail) {
                buf.printf("%s", ARGS);
            }
            else if (node.text == TH) {
                buf.printf("%s", (ctx.threadAvail) ? TH : "null");
            }
            else {
                buf.printf("%s", node.text);
            }
        },
        varDecl(node) {
            console.log(node);
            throw new Error("Abolished. use varDecl(just a function) ");
            /*var a=annotation(node);
            var thisForVIM=a.varInMain? THIZ+"." :"";
            if (node.value) {
                const t=(!ctx.noWait) && annotation(node).fiberCall;
                const to=(!ctx.noWait) && annotation(node).otherFiberCall;
                if (t) {
                    buf.printf(//VDC
                        "%s%v=yield* %s.%s%s(%j);%n" ,//FIBERCALL
                        thisForVIM, node.name, THIZ, FIBPRE, t.N, [", ",[THNode].concat(t.A)],
                    );
                } else if (to && to.fiberType) {
                    buf.printf(//VDC
                        "%s%v=yield* %v.%s%s(%j);%n" ,//FIBERCALL
                        thisForVIM, node.name, to.O, FIBPRE, to.N, [", ",[THNode].concat(to.A)],
                    );
                } else {
                    buf.printf("%s%v = %v;%n", thisForVIM, node.name, node.value);
                }
            } else {
                //buf.printf("%v", node.name);
            }*/
        },
        varsDecl: function (node) {
            if ((0, compiler_1.isNonBlockScopeDeclprefix)(node.declPrefix)) {
                const decls = node.decls.filter((n) => n.value);
                if (decls.length > 0) {
                    for (let decl of decls) {
                        varDecl(decl, node);
                    }
                }
            }
            else {
                for (let decl of node.decls) {
                    varDecl(decl, node);
                }
            }
        },
        jsonElem: function (node) {
            if (node.value) {
                buf.printf("%v: %v", node.key, node.value);
            }
            else {
                buf.printf("%v: %f", node.key, function () {
                    varAccess(node.key.text, annotation(node).scopeInfo, annotation(node));
                });
            }
        },
        objlit: function (node) {
            buf.printf("{%j}", [",", node.elems]);
        },
        arylit: function (node) {
            buf.printf("[%j]", [",", node.elems]);
        },
        nonArrowFuncExpr: function (node) {
            genNonArrowFuncExpr(node);
        },
        arrowFuncExpr: function (node) {
            genArrowFuncExpr(node);
        },
        parenExpr: function (node) {
            buf.printf("(%v)", node.expr);
        },
        varAccess: function (node) {
            buf.addMapping(node);
            var n = node.name.text;
            varAccess(n, annotation(node).scopeInfo, annotation(node));
        },
        exprstmt: function (node) {
            //var t:any={};
            const an = annotation(node);
            if (debug)
                console.log(ctx, an);
            const t = (!ctx.noWait ? an.fiberCall : undefined);
            const to = (!ctx.noWait ? an.otherFiberCall : undefined);
            if (t && t.type == "noRet") {
                buf.printf("(yield* %s.%s%s(%j));", //FIBERCALL
                THIZ, FIBPRE, t.N, [", ", [THNode].concat(t.A)]);
                /*} else if (to && to.fiberType && to.type=="noRetOther") {
                    buf.printf(
                            "(yield* %v.%s%s(%j));" ,//FIBERCALL
                                to.O, FIBPRE, to.N,  [", ",[THNode].concat(to.A)],
                    );*/
            }
            else if (t && t.type == "ret") {
                buf.printf(//VDC
                "%v%v(yield* %s.%s%s(%j));", //FIBERCALL
                t.L, t.O, THIZ, FIBPRE, t.N, [", ", [THNode].concat(t.A)]);
                /*} else if (to && to.fiberType && to.type=="retOther") {
                    buf.printf(//VDC
                            "%v%v(yield* %v.%s%s(%j));", //FIBERCALL
                            to.L, to.P, to.O, FIBPRE, to.N, [", ",[THNode].concat(to.A)],
                    );*/
            }
            else if (t && t.type == "noRetSuper") {
                const p = SUPER; //getClassName(klass.superclass);
                buf.printf("(yield* %s.prototype.%s%s.apply( %s, [%j]));", //FIBERCALL
                p, FIBPRE, t.S.name.text, THIZ, [", ", [THNode].concat(t.A)]);
            }
            else if (t && t.type == "retSuper") {
                const p = SUPER; //getClassName(klass.superclass);
                buf.printf("%v%v(yield* %s.prototype.%s%s.apply( %s, [%j]));", //FIBERCALL
                t.L, t.O, p, FIBPRE, t.S.name.text, THIZ, [", ", [THNode].concat(t.A)]);
            }
            else {
                buf.printf("%v;", node.expr);
            }
        },
        infix: function (node) {
            var opn = node.op.text;
            /*if (opn=="=" || opn=="+=" || opn=="-=" || opn=="*=" ||  opn=="/=" || opn=="%=" ) {
                checkLVal(node.left);
            }*/
            if (diagnose) {
                if (opn == "+" || opn == "-" || opn == "*" || opn == "/" || opn == "%") {
                    buf.printf("%s(%v,%l)%v%s(%v,%l)", CHK_NN, node.left, getSource(node.left), node.op, CHK_NN, node.right, getSource(node.right));
                    return;
                }
                if (opn == "+=" || opn == "-=" || opn == "*=" || opn == "/=" || opn == "%=") {
                    buf.printf("%v%v%s(%v,%l)", node.left, node.op, CHK_NN, node.right, getSource(node.right));
                    return;
                }
            }
            if (node.op.type === "is") {
                buf.printf("Tonyu.is(%v,%v)", node.left, node.right);
            }
            else {
                buf.printf("%v%v%v", node.left, node.op, node.right);
            }
        },
        trifixr: function (node) {
            buf.printf("%v%v%v%v%v", node.left, node.op1, node.mid, node.op2, node.right);
        },
        prefix: function (node) {
            if (node.op.text === "__typeof") {
                const a = annotation(node.right);
                //console.log("__typeof",a);
                typeToLiteral(a.resolvedType);
                /*if (a.resolvedType) {
                    const t=a.resolvedType;
                    if (isMethodType(t)) {
                        buf.printf("Tonyu.classMetas[%l].decls.methods.%s",t.method.klass.fullName, t.method.name);
                    } else if (isMeta(t)) {
                        buf.printf("Tonyu.classMetas[%l]",t.fullName);
                    } else if (isNativeClass(t)) {
                        buf.printf(t.class.name);
                    } else {
                        buf.printf("[%v]",t.element);
                    }
                } else {
                    buf.printf("%l","Any");
                }*/
                return;
            }
            else if (node.op.text === "__await") {
                if (ctx.noWait) {
                    buf.printf("%v", node.right);
                }
                else {
                    buf.printf("(yield* %s.await(%v))", TH, node.right);
                }
                return;
            }
            buf.printf("%v %v", node.op, node.right);
        },
        postfix: function (node) {
            var a = annotation(node);
            if (diagnose) {
                if (a.myMethodCall) {
                    const mc = a.myMethodCall;
                    var si = mc.scopeInfo;
                    var st = stype(si);
                    if (st == ST.FIELD || st == ST.PROP || st == ST.METHOD) {
                        buf.printf("%s(%s, %l, [%j], %l )", INVOKE_FUNC, THIZ, mc.name, [",", mc.args], "this");
                    }
                    else {
                        buf.printf("%s(%v, [%j], %l)", CALL_FUNC, node.left, [",", mc.args], getSource(node.left));
                    }
                    return;
                }
                else if (a.othersMethodCall) {
                    var oc = a.othersMethodCall;
                    buf.printf("%s(%v, %l, [%j], %l )", INVOKE_FUNC, oc.target, oc.name, [",", oc.args], getSource(oc.target));
                    return;
                }
                else if (a.memberAccess) {
                    var ma = a.memberAccess;
                    buf.printf("%s(%v,%l).%s", CHK_NN, ma.target, getSource(ma.target), ma.name);
                    return;
                }
            }
            else if (a.myMethodCall) {
                const mc = a.myMethodCall;
                const si = mc.scopeInfo;
                const st = stype(si);
                if (st == ST.METHOD) {
                    buf.printf("%s.%s(%j)", THIZ, mc.name, [",", mc.args]);
                    return;
                }
            }
            buf.printf("%v%v", node.left, node.op);
        },
        "break": function (node) {
            buf.printf("break;%n");
        },
        "continue": function (node) {
            buf.printf("continue;%n");
        },
        "try": function (node) {
            buf.printf("try {%{%f%n%}} ", noSurroundCompoundF(node.stmt));
            for (let c of node.catches) {
                v.visit(c);
            }
        },
        "catch": function (node) {
            buf.printf("catch (%s) {%{%f%n%}}", node.name.text, noSurroundCompoundF(node.stmt));
        },
        "throw": function (node) {
            buf.printf("throw %v;%n", node.ex);
        },
        "switch": function (node) {
            buf.printf("switch (%v) {%{" +
                "%j" +
                (node.defs ? "%n%v" : "%D") +
                "%n%}}", node.value, ["%n", node.cases], node.defs);
        },
        "case": function (node) {
            buf.printf("%}case %v:%{%j", node.value, ["%n", node.stmts]);
        },
        "default": function (node) {
            buf.printf("%}default:%{%j", ["%n", node.stmts]);
        },
        "while": function (node) {
            buf.printf("while (%v) {%{" +
                checkLoopCode() +
                "%f%n" +
                "%}}", node.cond, noSurroundCompoundF(node.loop));
        },
        "do": function (node) {
            buf.printf("do {%{" +
                checkLoopCode() +
                "%f%n" +
                "%}} while (%v);%n", noSurroundCompoundF(node.loop), node.cond);
        },
        "for": function (node) {
            var an = annotation(node);
            if (node.inFor.type == "forin") {
                const inFor = node.inFor;
                const pre = ((0, compiler_1.isBlockScopeDeclprefix)(inFor.isVar) ? inFor.isVar.text + " " : "");
                buf.printf("for (%s[%f] of %s(%v,%s)) {%{" +
                    "%f%n" +
                    "%}}", pre, loopVarsF(inFor.isVar, inFor.vars), ITER2, inFor.set, inFor.vars.length, noSurroundCompoundF(node.loop));
                /*var itn=annotation(node.inFor).iterName;
                buf.printf(
                    "%s=%s(%v,%s);%n"+
                    "while(%s.next()) {%{" +
                    "%f%n"+
                    "%f%n" +
                    "%}}",
                    itn, ITER, inFor.set, inFor.vars.length,
                    itn,
                    getElemF(itn, inFor.isVar, inFor.vars),
                    noSurroundCompoundF(node.loop)
                );
                */
            }
            else {
                const inFor = node.inFor;
                if ((inFor.init.type == "varsDecl" && inFor.init.decls.length == 1) || inFor.init.type == "exprstmt") {
                    buf.printf(
                    //"%v"+
                    "for (%v %v ; %v) {%{" +
                        checkLoopCode() +
                        "%v%n" +
                        "%}}", 
                    /*enterV({noLastPos:true},*/ inFor.init, optV(inFor.cond), optV(inFor.next), node.loop);
                }
                else {
                    buf.printf("%v%n" +
                        "while(%v) {%{" +
                        checkLoopCode() +
                        "%v%n" +
                        "%v;%n" +
                        "%}}", inFor.init, optV(inFor.cond), node.loop, optV(inFor.next));
                }
            }
            function loopVarsF(isVar, vars) {
                return function () {
                    vars.forEach((v, i) => {
                        var an = annotation(v);
                        if (i > 0)
                            buf.printf(", ");
                        buf.addMapping(v);
                        varAccess(v.text, an.scopeInfo, an);
                    });
                };
            }
            function getElemF(itn, isVar, vars) {
                return function () {
                    vars.forEach(function (v, i) {
                        var an = annotation(v);
                        varAccess(v.text, an.scopeInfo, an);
                        buf.printf("=%s[%s];%n", itn, i);
                        //buf.printf("%s=%s[%s];%n", v.text, itn, i);
                    });
                };
            }
        },
        "if": function (node) {
            //buf.printf("/*FBR=%s*/",!!annotation(node).fiberCallRequired);
            if (node._else) {
                buf.printf("if (%v) {%{%f%n%}} else {%{%f%n%}}", node.cond, noSurroundCompoundF(node.then), noSurroundCompoundF(node._else));
            }
            else {
                buf.printf("if (%v) {%{%f%n%}}", node.cond, noSurroundCompoundF(node.then));
            }
        },
        ifWait: function (node) {
            if (!ctx.noWait) {
                buf.printf("%v", node.then);
            }
            else {
                if (node._else) {
                    buf.printf("%v", node._else);
                }
            }
        },
        empty: function (node) {
            buf.printf(";%n");
        },
        call: function (node) {
            buf.printf("(%j)", [",", node.args]);
        },
        objlitArg: function (node) {
            buf.printf("%v", node.obj);
        },
        argList: function (node) {
            buf.printf("%j", [",", node.args]);
        },
        newExpr: function (node) {
            var p = node.params;
            if (p) {
                buf.printf("new %v%v", node.klass, p);
            }
            else {
                buf.printf("new %v", node.klass);
            }
        },
        scall: function (node) {
            buf.printf("[%j]", [",", node.args]);
        },
        superExpr: function (node) {
            let name;
            //if (!klass.superclass) throw new Error(klass.fullName+"には親クラスがありません");
            if (node.name) {
                name = node.name.text;
                buf.printf("%s.prototype.%s.apply( %s, %v)", SUPER /*getClassName(klass.superclass)*/, name, THIZ, node.params);
            }
            else {
                buf.printf("%s.apply( %s, %v)", SUPER /*getClassName(klass.superclass)*/, THIZ, node.params);
            }
        },
        arrayElem: function (node) {
            buf.printf("[%v]", node.subscript);
        },
        member: function (node) {
            buf.printf(".%s", node.name);
        },
        symbol: function (node) {
            buf.print(node.text);
        },
        "normalFor": function (node) {
            buf.printf("%v; %v; %v", node.init, node.cond, node.next);
        },
        compound: function (node) {
            buf.printf("{%{%j%n%}}", ["%n", node.stmts]);
        },
        "typeof": function (node) {
            buf.printf("typeof ");
        },
        "instanceof": function (node) {
            buf.printf(" instanceof ");
        },
        "is": function (node) {
            buf.printf(" instanceof ");
        },
        regex: function (node) {
            buf.printf("%s", node.text);
        }
    });
    function typeToLiteral(resolvedType) {
        if (resolvedType) {
            const t = resolvedType;
            if ((0, CompilerTypes_1.isMethodType)(t)) {
                buf.printf("Tonyu.classMetas[%l].decls.methods.%s", t.method.klass.fullName, t.method.name);
            }
            else if ((0, CompilerTypes_1.isMeta)(t)) {
                buf.printf("Tonyu.classMetas[%l]", t.fullName);
            }
            else if ((0, CompilerTypes_1.isNativeClass)(t)) {
                buf.printf(t.class.name);
            }
            else if ((0, CompilerTypes_1.isUnionType)(t)) {
                buf.printf("{candidates: [%f]}", () => {
                    for (let c of t.candidates) {
                        typeToLiteral(c);
                        buf.printf(", ");
                    }
                    ;
                });
            }
            else {
                buf.printf("[%f]", () => typeToLiteral(t.element));
            }
        }
        else {
            buf.printf("%l", "Any");
        }
    }
    function varDecl(node, parent) {
        var a = annotation(node);
        var thisForVIM = a.varInMain ? THIZ + "." : "";
        var pa = annotation(parent);
        const pre = ((0, compiler_1.isNonBlockScopeDeclprefix)(parent.declPrefix) || pa.varInMain ? "" : parent.declPrefix + " ");
        if (node.value) {
            const t = (!ctx.noWait) && annotation(node).fiberCall;
            const to = (!ctx.noWait) && annotation(node).otherFiberCall;
            if (t) {
                buf.printf(//VDC
                "%s%s%v=yield* %s.%s%s(%j);%n", //FIBERCALL
                pre, thisForVIM, node.name, THIZ, FIBPRE, t.N, [", ", [THNode].concat(t.A)]);
            }
            else if (to && to.fiberType) {
                buf.printf(//VDC
                "%s%s%v=yield* %v.%s%s(%j);%n", //FIBERCALL
                pre, thisForVIM, node.name, to.O, FIBPRE, to.N, [", ", [THNode].concat(to.A)]);
            }
            else {
                buf.printf("%s%s%v = %v;%n", pre, thisForVIM, node.name, node.value);
            }
        }
        else {
            if (pre) {
                buf.printf("%s%v;", pre, node.name);
            }
        }
    }
    var opTokens = ["++", "--", "!==", "===", "+=", "-=", "*=", "/=",
        "%=", ">=", "<=",
        "!=", "==", ">>>", ">>", "<<", "&&", "||", ">", "<", "+", "?", "=", "*",
        "%", "/", "^", "~", "\\", ":", ";", ",", "!", "&", "|", "-", "delete"];
    opTokens.forEach(function (opt) {
        v.funcs[opt] = function (node) {
            buf.printf("%s", opt);
        };
    });
    //v.debug=debug;
    v.def = function (node) {
        console.log("Err node=");
        console.log(node);
        throw new Error(node.type + " is not defined in visitor:compiler2");
    };
    //v.cnt=0;
    function genSource() {
        ctx.enter({}, function () {
            if (genMod) {
                printf("define(function (require) {%{");
                var reqs = { Tonyu: 1 };
                for (var mod in klass.decls.amds) {
                    reqs[mod] = 1;
                }
                if (klass.superclass) {
                    const mod = klass.superclass.shortName;
                    reqs[mod] = 1;
                }
                (klass.includes || []).forEach(function (klass) {
                    var mod = klass.shortName;
                    reqs[mod] = 1;
                });
                for (let mod in klass.decls.softRefClasses) {
                    reqs[mod] = 1;
                }
                for (let mod in reqs) {
                    printf("var %s=require('%s');%n", mod, mod);
                }
            }
            printf((genMod ? "return " : "") + "Tonyu.klass.define({%{");
            printf("fullName: %l,%n", klass.fullName);
            printf("shortName: %l,%n", klass.shortName);
            printf("namespace: %l,%n", klass.namespace);
            if (klass.superclass)
                printf("superclass: %s,%n", getClassName(klass.superclass));
            printf("includes: [%s],%n", getClassNames(klass.includes).join(","));
            printf("methods: function (%s) {%{", SUPER);
            printf("return {%{");
            const procMethod = (name) => {
                if (debug)
                    console.log("method1", name);
                const method = methods[name];
                if (!method.params) {
                    console.log("MYSTERY2", method.params, methods, klass, env);
                }
                ctx.enter({ noWait: true, threadAvail: false }, function () {
                    genFunc(method);
                });
                if (debug)
                    console.log("method2", name);
                if (!method.nowait) {
                    const naMethod = method;
                    ctx.enter({ noWait: false, threadAvail: true }, function () {
                        genFiber(naMethod);
                    });
                }
                if (debug)
                    console.log("method3", name);
            };
            for (var name in methods)
                procMethod(name);
            printf("__dummy: false%n");
            printf("%}};%n");
            printf("%}},%n");
            printf("decls: %s%n", JSON.stringify(cu.digestDecls(klass)));
            printf("%}});");
            if (genMod)
                printf("%n%}});");
            printf("%n");
            //printf("%}});%n");
        });
        //printf("Tonyu.klass.addMeta(%s,%s);%n",
        //        getClassName(klass),JSON.stringify(digestMeta(klass)));
        //if (env.options.compiler.asModule) {
        //    printf("//%}});");
        //}
    }
    function getNameOfType(t) {
        if (!t.fullName && !t.class) {
            console.log(t);
            throw new Error("Invalid annotatedType" + t);
        }
        return t.fullName || t.class.name;
    }
    function digestMeta(klass) {
        var res = {
            fullName: klass.fullName,
            namespace: klass.namespace,
            shortName: klass.shortName,
            decls: { methods: {} }
        };
        for (var i in klass.decls.methods) {
            res.decls.methods[i] =
                { nowait: !!klass.decls.methods[i].nowait };
        }
        return res;
    }
    function genFiber(fiber) {
        if (isConstructor(fiber))
            return;
        var stmts = fiber.stmts;
        var noWaitStmts = [], curStmts = noWaitStmts;
        var opt = true;
        //waitStmts=stmts;
        printf("%s%s :function* %s(%j) {%{" +
            "var %s=%s;%n", FIBPRE, fiber.name, genFn("f_" + fiber.name), [",", [THNode].concat(fiber.params)], THIZ, GET_THIS);
        if (fiber.useArgs) {
            printf("var %s=%s;%n", ARGS, "Tonyu.A(arguments)");
        }
        printf("%f%n" +
            "%f%n" +
            "%}},%n", genLocalsF(fiber), fbody);
        function fbody() {
            ctx.enter({ method: fiber, noWait: false, threadAvail: true,
                finfo: fiber }, function () {
                stmts.forEach(function (stmt) {
                    printf("%v%n", stmt);
                });
            });
        }
    }
    function genFunc(func) {
        var fname = isConstructor(func) ? "initialize" : func.name;
        if (!func.params) { //TODO
            console.log("MYSTERY", func.params);
        }
        printf("%s :function %s(%j) {%{" +
            //USE_STRICT+
            "var %s=%s;%n" +
            "%f%n" +
            "%f" +
            "%}},%n", fname, genFn(fname), [",", func.params], THIZ, GET_THIS, genLocalsF(func), fbody);
        function fbody() {
            ctx.enter({ method: func, finfo: func,
                /*scope: func.scope*/ 
            }, function () {
                func.stmts.forEach(function (stmt) {
                    printf("%v%n", stmt);
                });
            });
        }
    }
    function genArrowFuncExpr(node) {
        const finfo = annotation(node).funcInfo; // annotateSubFuncExpr(node);
        if (!(0, CompilerTypes_1.isArrowFuncInfo)(finfo)) {
            throw new Error("NonArrow func info!");
        }
        buf.printf("((%j)=>(%f))", [",", finfo.params], fbody);
        function fbody() {
            ctx.enter({ noWait: true, threadAvail: false,
                finfo: finfo, /*scope: finfo.scope*/ }, function () {
                printf("%v", node.retVal);
            });
        }
    }
    function genNonArrowFuncExpr(node) {
        const finfo = annotation(node).funcInfo; // annotateSubFuncExpr(node);
        if (!(0, CompilerTypes_1.isNonArrowFuncInfo)(finfo)) {
            throw new Error("Arrow func info!");
        }
        buf.printf("(function %s(%j) {%{" +
            "%f%n" +
            "%f" +
            "%}})", finfo.name, [",", finfo.params], genLocalsF(finfo), fbody);
        function fbody() {
            ctx.enter({ noWait: true, threadAvail: false,
                finfo: finfo, /*scope: finfo.scope*/ }, function () {
                node.body.stmts.forEach(function (stmt) {
                    printf("%v%n", stmt);
                });
            });
        }
    }
    function checkLoopCode() {
        if (!doLoopCheck)
            return "";
        if (ctx.noWait) {
            return "Tonyu.checkLoop();%n";
        }
        else {
            return "yield null;%n";
        }
    }
    function genFn(/*pos:number ,*/ name) {
        if (!name)
            name = (fnSeq++) + "";
        let n = ("_trc_" + klass.shortName + "_" + name);
        traceIndex[n] = 1;
        return n;
        //        return ("_trc_func_"+traceTbl.add(klass,pos )+"_"+(fnSeq++));//  Math.random()).replace(/\./g,"");
    }
    function genSubFunc(node) {
        var finfo = annotation(node).funcInfo; // annotateSubFuncExpr(node);
        if (!(0, CompilerTypes_1.isNonArrowFuncInfo)(finfo)) {
            throw new Error("Arrow func info!");
        }
        buf.printf("function %s(%j) {%{" +
            "%f%n" +
            "%f" +
            "%}}", finfo.name, [",", finfo.params], genLocalsF(finfo), fbody);
        function fbody() {
            ctx.enter({ noWait: true, threadAvail: false,
                finfo: finfo, /*scope: finfo.scope*/ }, function () {
                node.body.stmts.forEach(function (stmt) {
                    printf("%v%n", stmt);
                });
            });
        }
    }
    function genLocalsF(finfo) {
        return f;
        function f() {
            ctx.enter({ /*scope:finfo.scope*/}, function () {
                for (let i in finfo.locals.varDecls) {
                    buf.printf("var %s;%n", i);
                }
                for (let i in finfo.locals.subFuncDecls) {
                    genSubFunc(finfo.locals.subFuncDecls[i]);
                }
            });
        }
    }
    function isConstructor(f) {
        return OM.match(f, { ftype: "constructor" }) || OM.match(f, { name: "new" });
    }
    genSource(); //G
    if (genMod) {
        klass.src.js = klass.src.tonyu.up().rel(klass.src.tonyu.truncExt() + ".js");
        klass.src.js.text(buf.buf);
    }
    else {
        klass.src.js = buf.buf; //G
    }
    delete klass.jsNotUpToDate;
    cu.packAnnotation(klass.annotation);
    if (debug) {
        console.log("method4", buf.buf);
        //throw "ERR";
    }
    //var bufres=buf.close();
    klass.src.map = buf.mapStr;
    return buf; //res;
} //B
exports.genJS = genJS;
//return {genJS:genJS};
//})();
