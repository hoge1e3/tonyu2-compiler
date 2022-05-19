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
exports.checkExpr = exports.checkTypeDecl = void 0;
const cu = __importStar(require("./compiler"));
const context_1 = require("./context");
//import Grammar from "./Grammar";
const parser_1 = require("./parser");
const Visitor_1 = require("./Visitor");
const CompilerTypes_1 = require("./CompilerTypes");
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
        varDecl: function (node) {
            //console.log("TCV","varDecl",node);
            if (node.value)
                this.visit(node.value);
            if (node.name && node.typeDecl) {
                var va = annotation(node.typeDecl.vtype);
                //console.log("var typeis",node.name+"", node.typeDecl.vtype, va.resolvedType);
                const rt = va.resolvedType;
                if (rt) {
                    const a = annotation(node);
                    const si = a.scopeInfo; // for local
                    const info = a.fieldInfo; // for field
                    if (si) {
                        //console.log("set var type",node.name+"", va.resolvedType );
                        si.resolvedType = va.resolvedType;
                    }
                    else if (info) {
                        //console.log("set fld type",node.name+"", va.resolvedType );
                        info.resolvedType = va.resolvedType;
                    }
                }
                /*} else if (a.declaringClass) {
                    //console.log("set fld type",a.declaringClass,a.declaringClass.decls.fields[node.name+""],node.name+"", node.typeDecl.vtype+"");
                    a.declaringClass.decls.fields[node.name+""].vtype=node.typeDecl.vtype;
                }*/
            }
        },
        paramDecl: function (node) {
            if (node.name && node.typeDecl) {
                console.log("param typeis", node.name + "", node.typeDecl.vtype + "");
                var va = annotation(node.typeDecl.vtype);
                var a = annotation(node);
                var si = a.scopeInfo;
                if (si && va.resolvedType) {
                    console.log("set param type", node.name + "", node.typeDecl.vtype + "");
                    si.resolvedType = va.resolvedType;
                }
            }
        },
        funcDecl: function (node) {
            //console.log("Visit funcDecl",node);
            var head = node.head;
            var finfo = annotation(node).funcInfo;
            if (head.rtype) {
                console.log("ret typeis", head.name + "", head.rtype.vtype + "");
                const tanon = annotation(head.rtype);
                finfo.returnType = tanon.resolvedType; // head.rtype.vtype;
            }
            this.visit(head);
            this.visit(node.body);
        },
    });
    typeDeclVisitor.def = visitSub; //S
    typeDeclVisitor.visit(klass.node);
}
exports.checkTypeDecl = checkTypeDecl;
function checkExpr(klass, env) {
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
            var a = annotation(node);
            if (a.memberAccess) {
                var m = a.memberAccess;
                var vtype = visitExpr(m.target);
                if (vtype && (0, CompilerTypes_1.isMeta)(vtype)) {
                    const f = cu.getField(vtype, m.name);
                    //console.log("GETF",vtype,m.name,f);
                    // fail if f is not set when strict check
                    if (f && f.resolvedType) {
                        annotation(node, { resolvedType: f.resolvedType });
                    }
                    else {
                        const method = cu.getMethod(vtype, m.name);
                        // fail if m is not set when strict check
                        //console.log("GETM",vtype,m.name,f);
                        if (method) {
                            annotation(node, { resolvedType: { method } });
                        }
                    }
                }
            }
            else {
                this.visit(node.left);
                this.visit(node.op);
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
                        console.log("TC Warning: fld not found", klass, node.name + "");
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
                o.fiberCallRequired_lazy();
            }
            else {
                annotation(node, { otherFiberCall: null });
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
