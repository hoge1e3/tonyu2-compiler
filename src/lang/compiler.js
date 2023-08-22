"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getParams = exports.getDependingClasses = exports.getProperty = exports.getMethod = exports.getField = exports.typeDigest2ResolvedType = exports.digestDecls = exports.resolvedType2Digest = exports.getSource = exports.packAnnotation = exports.annotation = exports.genSym = exports.nullCheck = exports.newScope = exports.getScopeType = exports.ScopeInfos = exports.ScopeTypes = exports.isNonBlockScopeDeclprefix = exports.isBlockScopeDeclprefix = void 0;
const TonyuRuntime_1 = __importDefault(require("../runtime/TonyuRuntime"));
const root_1 = __importDefault(require("../lib/root"));
const CompilerTypes_1 = require("./CompilerTypes");
const RuntimeTypes_1 = require("../runtime/RuntimeTypes");
const NONBLOCKSCOPE_DECLPREFIX = "var";
function isBlockScopeDeclprefix(t) {
    return t && t.text !== NONBLOCKSCOPE_DECLPREFIX;
}
exports.isBlockScopeDeclprefix = isBlockScopeDeclprefix;
function isNonBlockScopeDeclprefix(t) {
    return t && t.text === NONBLOCKSCOPE_DECLPREFIX;
}
exports.isNonBlockScopeDeclprefix = isNonBlockScopeDeclprefix;
exports.ScopeTypes = {
    FIELD: "field", METHOD: "method", NATIVE: "native",
    LOCAL: "local", THVAR: "threadvar", PROP: "property",
    PARAM: "param", GLOBAL: "global",
    CLASS: "class", MODULE: "module"
};
var ScopeInfos;
(function (ScopeInfos) {
    class LOCAL {
        constructor(declaringFunc, isBlockScope) {
            this.declaringFunc = declaringFunc;
            this.isBlockScope = isBlockScope;
            this.type = exports.ScopeTypes.LOCAL;
        }
    }
    ScopeInfos.LOCAL = LOCAL;
    class PARAM {
        constructor(declaringFunc) {
            this.declaringFunc = declaringFunc;
            this.type = exports.ScopeTypes.PARAM;
        }
    }
    ScopeInfos.PARAM = PARAM;
    class FIELD {
        constructor(klass, name, info) {
            this.klass = klass;
            this.name = name;
            this.info = info;
            this.type = exports.ScopeTypes.FIELD;
        }
    }
    ScopeInfos.FIELD = FIELD;
    class PROP {
        constructor(klass, name) {
            this.klass = klass;
            this.name = name;
            this.type = exports.ScopeTypes.PROP;
        }
    }
    ScopeInfos.PROP = PROP;
    class METHOD {
        constructor(klass, name, info) {
            this.klass = klass;
            this.name = name;
            this.info = info;
            this.type = exports.ScopeTypes.METHOD;
        }
    }
    ScopeInfos.METHOD = METHOD;
    class THVAR {
        constructor() {
            this.type = exports.ScopeTypes.THVAR;
        }
    }
    ScopeInfos.THVAR = THVAR;
    class NATIVE {
        constructor(name, value) {
            this.name = name;
            this.value = value;
            this.type = exports.ScopeTypes.NATIVE;
        }
    }
    ScopeInfos.NATIVE = NATIVE;
    class CLASS {
        constructor(name, fullName, info) {
            this.name = name;
            this.fullName = fullName;
            this.info = info;
            this.type = exports.ScopeTypes.CLASS;
        }
    }
    ScopeInfos.CLASS = CLASS;
    class GLOBAL {
        constructor(name) {
            this.name = name;
            this.type = exports.ScopeTypes.GLOBAL;
        }
    }
    ScopeInfos.GLOBAL = GLOBAL;
    class MODULE {
        constructor(name) {
            this.name = name;
            this.type = exports.ScopeTypes.MODULE;
        }
    }
    ScopeInfos.MODULE = MODULE;
})(ScopeInfos = exports.ScopeInfos || (exports.ScopeInfos = {}));
;
let nodeIdSeq = 1;
let symSeq = 1; //B
//cu.newScopeType=genSt;
function getScopeType(st) {
    return st ? st.type : null;
}
exports.getScopeType = getScopeType;
//cu.getScopeType=stype;
function newScope(s) {
    const f = function () { };
    f.prototype = s;
    return new f();
}
exports.newScope = newScope;
//cu.newScope=newScope;
function nullCheck(o, mesg) {
    if (!o)
        throw mesg + " is null";
    return o;
}
exports.nullCheck = nullCheck;
//cu.nullCheck=nc;
function genSym(prefix) {
    return prefix + ((symSeq++) + "").replace(/\./g, "");
}
exports.genSym = genSym;
//cu.genSym=genSym;
function annotation(aobjs, node, aobj = undefined) {
    if (!node._id) {
        //if (!aobjs._idseq) aobjs._idseq=0;
        node._id = ++nodeIdSeq;
    }
    let res = aobjs[node._id];
    if (!res)
        res = aobjs[node._id] = { node: node };
    if (res.node !== node) {
        console.log("NOMATCH", res.node, node);
        throw new Error("annotation node not match!");
    }
    if (aobj) {
        for (let i in aobj)
            res[i] = aobj[i];
    }
    return res;
}
exports.annotation = annotation;
function packAnnotation(aobjs) {
    if (!aobjs)
        return;
    function isEmptyAnnotation(a) {
        return a && typeof a === "object" && Object.keys(a).length === 1 && Object.keys(a)[0] === "node";
    }
    for (let k of Object.keys(aobjs)) {
        if (isEmptyAnnotation(aobjs[k]))
            delete aobjs[k];
    }
}
exports.packAnnotation = packAnnotation;
//cu.extend=extend;
/*function extend(res,aobj) {
    for (let i in aobj) res[i]=aobj[i];
    return res;
};*/
//cu.annotation=annotation3;
function getSource(srcCont, node) {
    return srcCont.substring(node.pos, node.pos + node.len);
}
exports.getSource = getSource;
//cu.getSource=getSource;
//cu.getField=getField;
/*export function klass2name(t: AnnotatedType) {
    if (isMethodType(t)) {
        return `${t.method.klass.fullName}.${t.method.name}()`;
    } else if (isMeta(t)) {
        return t.fullName;
    } else if (isNativeClass(t)) {
        return t.class.name;
    } else {
        return `${klass2name(t.element)}[]`;
    }
}*/
function resolvedType2Digest(t) {
    if ((0, CompilerTypes_1.isMethodType)(t)) {
        return `${t.method.klass.fullName}.${t.method.name}()`;
    }
    else if ((0, CompilerTypes_1.isMeta)(t)) {
        return t.fullName;
    }
    else if ((0, CompilerTypes_1.isNativeClass)(t)) {
        return t.class.name;
    }
    else if ((0, CompilerTypes_1.isUnionType)(t)) {
        return { candidates: t.candidates.map(resolvedType2Digest) };
    }
    else {
        return { element: resolvedType2Digest(t.element) };
    }
}
exports.resolvedType2Digest = resolvedType2Digest;
function digestDecls(klass) {
    //console.log("DIGEST", klass.decls.methods);
    var res = { methods: {}, fields: {} };
    for (let i in klass.decls.methods) {
        const mi = klass.decls.methods[i];
        res.methods[i] = {
            nowait: !!mi.nowait,
            isMain: !!mi.isMain,
        };
        if (mi.paramTypes || mi.returnType) {
            res.methods[i].vtype = {
                params: mi.paramTypes ? mi.paramTypes.map((t) => t ? resolvedType2Digest(t) : null) : null,
                returnValue: mi.returnType ? resolvedType2Digest(mi.returnType) : null,
            };
        }
    }
    for (let i in klass.decls.fields) {
        const src = klass.decls.fields[i];
        const dst = {
            vtype: src.resolvedType ? resolvedType2Digest(src.resolvedType) : src.vtype
        };
        res.fields[i] = dst;
    }
    return res;
}
exports.digestDecls = digestDecls;
function typeDigest2ResolvedType(d) {
    if (typeof d === "string") {
        if (TonyuRuntime_1.default.classMetas[d]) {
            return TonyuRuntime_1.default.classMetas[d];
        }
        else if (root_1.default[d]) {
            return { class: root_1.default[d] };
        }
    }
    else if ((0, RuntimeTypes_1.isArrayTypeDigest)(d)) {
        return { element: typeDigest2ResolvedType(d.element) };
    }
    else {
        return { candidates: d.candidates.map(typeDigest2ResolvedType) };
    }
}
exports.typeDigest2ResolvedType = typeDigest2ResolvedType;
function getField(klass, name) {
    if (klass instanceof Function)
        return null;
    let res = null;
    for (let k of getDependingClasses(klass)) {
        //console.log("getField", k, name);
        if (res)
            break;
        res = k.decls.fields[name];
    }
    if (res && res.vtype && !res.resolvedType) {
        res.resolvedType = typeDigest2ResolvedType(res.vtype);
    }
    return res;
}
exports.getField = getField;
function getMethod(klass, name) {
    let res = null;
    for (let k of getDependingClasses(klass)) {
        if (res)
            break;
        res = k.decls.methods[name];
    }
    return res;
}
exports.getMethod = getMethod;
function getProperty(klass, name) {
    const getter = getMethod(klass, TonyuRuntime_1.default.klass.property.methodFor("get", name));
    const setter = getMethod(klass, TonyuRuntime_1.default.klass.property.methodFor("set", name));
    if (!getter && !setter)
        return null;
    return { getter, setter };
}
exports.getProperty = getProperty;
//cu.getMethod=getMethod2;
// includes klass itself
function getDependingClasses(klass) {
    const visited = {};
    const res = [];
    function loop(k) {
        if (k.isShim) {
            console.log(klass, "contains shim ", k);
            throw new Error("Contains shim");
        }
        if (visited[k.fullName])
            return;
        visited[k.fullName] = true;
        res.push(k);
        if (k.superclass)
            loop(k.superclass);
        if (k.includes)
            k.includes.forEach(loop);
    }
    loop(klass);
    return res;
}
exports.getDependingClasses = getDependingClasses;
//cu.getDependingClasses=getDependingClasses;
function getParams(method) {
    let res = [];
    if (!method.head)
        return res;
    if (method.head.setter)
        res.push(method.head.setter.value);
    const ps = method.head.params ? method.head.params.params : null;
    if (ps && !ps.forEach)
        throw new Error(method + " is not array ");
    if (ps)
        res = res.concat(ps);
    return res;
}
exports.getParams = getParams;
//cu.getParams=getParams;
//export= cu;
