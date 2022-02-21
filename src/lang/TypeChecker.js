"use strict";
/*if (typeof define!=="function") {
    define=require("requirejs").define;
}
define(["Visitor","Tonyu.Compiler","context"],function (Visitor,cu,context) {*/
/*const Visitor=require("./Visitor");
const Grammar=require("./Grammar");
const cu=require("./compiler");
const context=require("./context");
*/
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
const cu = __importStar(require("./compiler"));
const context_1 = __importDefault(require("./context"));
const Grammar_1 = __importDefault(require("./Grammar"));
const Visitor_1 = __importDefault(require("./Visitor"));
//var ex={"[SUBELEMENTS]":1,pos:1,len:1};
var ScopeTypes = cu.ScopeTypes;
var genSt = cu.newScopeType;
var stype = cu.getScopeType;
var newScope = cu.newScope;
//var nc=cu.nullCheck;
var genSym = cu.genSym;
var annotation3 = cu.annotation;
var getMethod2 = cu.getMethod;
var getDependingClasses = cu.getDependingClasses;
var getParams = cu.getParams;
var JSNATIVES = { Array: 1, String: 1, Boolean: 1, Number: 1, Void: 1, Object: 1, RegExp: 1, Error: 1 };
var TypeChecker = {};
function visitSub(node) {
    var t = this;
    if (!node || typeof node != "object")
        return;
    //console.log("TCV",node.type,node);
    var es;
    if (node instanceof Array)
        es = node;
    else
        es = node[Grammar_1.default.SUBELEMENTS];
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
TypeChecker.checkTypeDecl = function (klass, env) {
    function annotation(node, aobj) {
        return annotation3(klass.annotation, node, aobj);
    }
    var typeDeclVisitor = Visitor_1.default({
        varDecl: function (node) {
            //console.log("TCV","varDecl",node);
            if (node.value)
                this.visit(node.value);
            if (node.name && node.typeDecl) {
                var va = annotation(node.typeDecl.vtype);
                console.log("var typeis", node.name + "", node.typeDecl.vtype, va.resolvedType);
                var a = annotation(node);
                var si = a.scopeInfo; // for local
                var info = a.info; // for field
                if (si) {
                    console.log("set var type", node.name + "", va.resolvedType);
                    si.vtype = va.resolvedType;
                }
                else if (info) {
                    console.log("set fld type", node.name + "", va.resolvedType);
                    info.vtype = va.resolvedType;
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
                    si.vtype = va.resolvedType;
                }
            }
        },
        funcDecl: function (node) {
            //console.log("Visit funcDecl",node);
            var head = node.head;
            var finfo = annotation(node).info;
            if (head.rtype) {
                console.log("ret typeis", head.name + "", head.rtype.vtype + "");
                finfo.rtype = head.rtype.vtype;
            }
            this.visit(head);
            this.visit(node.body);
        }
    });
    typeDeclVisitor.def = visitSub; //S
    typeDeclVisitor.visit(klass.node);
};
TypeChecker.checkExpr = function (klass, env) {
    function annotation(node, aobj) {
        return annotation3(klass.annotation, node, aobj);
    }
    var typeAnnotationVisitor = Visitor_1.default({
        number: function (node) {
            annotation(node, { vtype: Number });
        },
        literal: function (node) {
            annotation(node, { vtype: String });
        },
        postfix: function (node) {
            var a = annotation(node);
            if (a.memberAccess) {
                var m = a.memberAccess;
                var vtype = visitExpr(m.target);
                if (vtype) {
                    var f = cu.getField(vtype, m.name);
                    console.log("GETF", vtype, m.name, f);
                    if (f && f.vtype) {
                        annotation(node, { vtype: f.vtype });
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
                if (si.vtype) {
                    console.log("VA typeof", node.name + ":", si.vtype);
                    annotation(node, { vtype: si.vtype });
                }
                else if (si.type === ScopeTypes.FIELD) {
                    var fld;
                    fld = klass.decls.fields[node.name + ""];
                    if (!fld) {
                        // because parent field does not contain...
                        console.log("TC Warning: fld not found", klass, node.name + "");
                        return;
                    }
                    var vtype = fld.vtype;
                    if (!vtype) {
                        console.log("VA vtype not found", node.name + ":", fld);
                    }
                    else {
                        annotation(node, { vtype: vtype });
                        console.log("VA typeof", node.name + ":", vtype);
                    }
                }
                else if (si.type === ScopeTypes.PROP) {
                    //TODO
                }
            }
        }
    });
    var ctx = context_1.default();
    typeAnnotationVisitor.def = visitSub;
    typeAnnotationVisitor.visit(klass.node);
    function visitExpr(node) {
        typeAnnotationVisitor.visit(node);
        var va = annotation(node);
        return va.vtype;
    }
};
module.exports = TypeChecker;
