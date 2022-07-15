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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkExpr = exports.checkTypeDecl = void 0;
const cu = __importStar(require("./compiler"));
const R_1 = __importDefault(require("../lib/R"));
const context_1 = require("./context");
const NodeTypes_1 = require("./NodeTypes");
//import Grammar from "./Grammar";
const parser_1 = require("./parser");
const Visitor_1 = require("./Visitor");
const CompilerTypes_1 = require("./CompilerTypes");
const TError_1 = __importDefault(require("../runtime/TError"));
//var ex={"[SUBELEMENTS]":1,pos:1,len:1};
const ScopeTypes = cu.ScopeTypes;
//var genSt=cu.newScopeType;
const stype = cu.getScopeType;
const newScope = cu.newScope;
//var nc=cu.nullCheck;
const genSym = cu.genSym;
const annotation3 = cu.annotation;
const getMethod2 = cu.getMethod;
const getDependingClasses = cu.getDependingClasses;
const getParams = cu.getParams;
//const JSNATIVES={Array:1, String:1, Boolean:1, Number:1, Void:1, Object:1,RegExp:1,Error:1};
//var TypeChecker:any={};
function visitSub(node) {
    var t = this;
    if (!node || typeof node != "object")
        return;
    //console.log("TCV",node.type,node);
    var es;
    if (node instanceof Array)
        es = node;
    else
        es = node[parser_1.SUBELEMENTS];
    if (!es) {
        es = [];
        for (var i in node) {
            es.push(node[i]);
        }
    }
    es.forEach(function (e) {
        t.visit(e);
    });
}
function checkTypeDecl(klass, env) {
    function annotation(node, aobj = undefined) {
        return annotation3(klass.annotation, node, aobj);
    }
    var typeDeclVisitor = new Visitor_1.Visitor({
        forin(node) {
            this.visit(node.set);
            const a = annotation(node.set);
            if (a.resolvedType && (0, CompilerTypes_1.isArrayType)(a.resolvedType) &&
                node.isVar && node.isVar.text !== "var") {
                if (node.vars.length == 1) {
                    const sa = annotation(node.vars[0]);
                    sa.scopeInfo.resolvedType = a.resolvedType.element;
                }
                else if (node.vars.length == 2) {
                    const sa = annotation(node.vars[1]);
                    sa.scopeInfo.resolvedType = a.resolvedType.element;
                    const si = annotation(node.vars[0]);
                    si.scopeInfo.resolvedType = { class: Number };
                }
            }
            else {
                this.visit(node.vars);
            }
        },
        varDecl(node) {
            //console.log("TCV","varDecl",node);
            if (node.value)
                this.visit(node.value);
            let rt;
            if (node.value) {
                const a = annotation(node.value);
                if (a.resolvedType) {
                    rt = a.resolvedType;
                    //console.log("Inferred",rt);
                }
            }
            if (node.name && node.typeDecl) {
                const va = annotation(node.typeDecl.vtype);
                rt = va.resolvedType;
            }
            if (rt) {
                const a = annotation(node);
                const si = a.scopeInfo;
                if (si) {
                    si.resolvedType = rt;
                    if (si.type === cu.ScopeTypes.FIELD) {
                        si.info.resolvedType = rt;
                    }
                }
            }
            else {
                env.unresolvedVars++;
            }
        },
        paramDecl(node) {
            if (node.name && node.typeDecl) {
                //console.log("param typeis",node.name+"", node.typeDecl.vtype+"");
                var va = annotation(node.typeDecl.vtype);
                var a = annotation(node);
                var si = a.scopeInfo;
                if (si && va.resolvedType) {
                    //console.log("set param type",node.name+"", node.typeDecl.vtype+"");
                    si.resolvedType = va.resolvedType;
                }
            }
        },
        funcDecl(node) {
            //console.log("Visit funcDecl",node);
            var head = node.head;
            /*const finfo=annotation(node).funcInfo;
            if (finfo && head.rtype) {
                const tanon=annotation(head.rtype);
                console.log("ret type of ",head.name+": ", head.rtype.vtype.name+"", tanon);
                finfo.returnType=tanon.resolvedType;// head.rtype.vtype;
            }*/
            this.visit(head);
            this.visit(node.body);
        },
    });
    typeDeclVisitor.def = visitSub; //S
    typeDeclVisitor.visit(klass.node);
}
exports.checkTypeDecl = checkTypeDecl;
function checkExpr(klass, env) {
    const srcFile = klass.src.tonyu; //file object  //S
    function annotation(node, aobj) {
        return annotation3(klass.annotation, node, aobj);
    }
    var typeAnnotationVisitor = new Visitor_1.Visitor({
        number: function (node) {
            annotation(node, { resolvedType: { class: Number } });
        },
        literal: function (node) {
            annotation(node, { resolvedType: { class: String } });
        },
        postfix: function (node) {
            //var a=annotation(node);
            this.visit(node.left);
            this.visit(node.op);
            if ((0, NodeTypes_1.isMember)(node.op)) {
                //var m=a.memberAccess;
                const a = annotation(node.left);
                var vtype = a.resolvedType; // visitExpr(m.target);
                const name = node.op.name.text;
                if (vtype && (0, CompilerTypes_1.isMeta)(vtype)) {
                    const field = cu.getField(vtype, name);
                    const method = cu.getMethod(vtype, name);
                    if (!field && !method) {
                        throw (0, TError_1.default)((0, R_1.default)("memberNotFoundInClass", vtype.shortName, name), srcFile, node.op.name.pos);
                    }
                    //console.log("GETF",vtype,m.name,f);
                    // fail if f is not set when strict check
                    if (field && field.resolvedType) {
                        annotation(node, { resolvedType: field.resolvedType });
                    }
                    else if (method) {
                        annotation(node, { resolvedType: { method } });
                    }
                }
                if (vtype && (0, CompilerTypes_1.isNativeClass)(vtype)) {
                    if (vtype.class.prototype[name]) {
                        //OK (as any)
                    }
                    else {
                        throw (0, TError_1.default)((0, R_1.default)("memberNotFoundInClass", vtype.class.name, name), srcFile, node.op.name.pos);
                    }
                }
            }
            else if ((0, NodeTypes_1.isCall)(node.op)) {
                const leftA = annotation(node.left);
                //console.log("OPCALL1", leftA);
                if (leftA && leftA.resolvedType) {
                    const leftT = leftA.resolvedType;
                    if (!(0, CompilerTypes_1.isMethodType)(leftT)) {
                        throw (0, TError_1.default)((0, R_1.default)("cannotCallNonFunctionType"), srcFile, node.op.pos);
                    }
                    //console.log("OPCALL", leftT);
                    annotation(node, { resolvedType: leftT.method.returnType });
                }
            }
            else if ((0, NodeTypes_1.isArrayElem)(node.op)) {
                const leftA = annotation(node.left);
                if (leftA && leftA.resolvedType && (0, CompilerTypes_1.isArrayType)(leftA.resolvedType)) {
                    const rt = leftA.resolvedType.element;
                    annotation(node, { resolvedType: rt });
                }
            }
        },
        newExpr: function (node) {
            const a = annotation(node.klass);
            if (a.scopeInfo && a.scopeInfo.type === cu.ScopeTypes.CLASS) {
                const rt = a.scopeInfo.info;
                annotation(node, { resolvedType: rt });
            }
        },
        varAccess: function (node) {
            var a = annotation(node);
            var si = a.scopeInfo;
            if (si) {
                if (si.resolvedType) {
                    //console.log("VA typeof",node.name+":",si.resolvedType);
                    annotation(node, { resolvedType: si.resolvedType });
                }
                else if (si.type === ScopeTypes.FIELD) {
                    const fld = klass.decls.fields[node.name + ""];
                    if (!fld) {
                        // because parent field does not contain...
                        //console.log("TC Warning: fld not found",klass,node.name+"");
                        return;
                    }
                    var rtype = fld.resolvedType;
                    if (!rtype) {
                        //console.log("VA resolvedType not found",node.name+":",fld);
                    }
                    else {
                        annotation(node, { resolvedType: rtype });
                        //console.log("VA typeof",node.name+":",rtype);
                    }
                }
                else if (si.type === ScopeTypes.METHOD) {
                    annotation(node, { resolvedType: { method: si.info } });
                }
                else if (si.type === ScopeTypes.PROP) {
                    //TODO
                }
            }
        },
        exprstmt(node) {
            this.visit(node.expr);
            handleOtherFiberCall(node);
        },
        varDecl(node) {
            this.visit(node.name);
            this.visit(node.typeDecl);
            this.visit(node.value);
            handleOtherFiberCall(node);
        },
    });
    function handleOtherFiberCall(node) {
        const a = annotation(node);
        if (a.otherFiberCall) {
            const o = a.otherFiberCall;
            const ta = annotation(o.T);
            if (ta.resolvedType && (0, CompilerTypes_1.isMethodType)(ta.resolvedType) && !ta.resolvedType.method.nowait) {
                //o.fiberCallRequired_lazy();
                o.fiberType = ta.resolvedType;
            }
        }
    }
    const ctx = (0, context_1.context)();
    typeAnnotationVisitor.def = visitSub;
    typeAnnotationVisitor.visit(klass.node);
    function visitExpr(node) {
        typeAnnotationVisitor.visit(node);
        var va = annotation(node);
        return va.resolvedType;
    }
}
exports.checkExpr = checkExpr;
;
