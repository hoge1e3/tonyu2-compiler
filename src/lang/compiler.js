"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getParams = exports.getDependingClasses = exports.getMethod = exports.getField = exports.getSource = exports.annotation = exports.genSym = exports.nullCheck = exports.newScope = exports.getScopeType = exports.newScopeType = exports.ScopeTypes = void 0;
const TonyuRuntime_1 = __importDefault(require("../runtime/TonyuRuntime"));
const root_1 = __importDefault(require("../lib/root"));
exports.ScopeTypes = {
    FIELD: "field", METHOD: "method", NATIVE: "native",
    LOCAL: "local", THVAR: "threadvar", PROP: "property",
    PARAM: "param", GLOBAL: "global",
    CLASS: "class", MODULE: "module"
};
class ST_LOCAL {
    constructor(declaringFunc) {
        this.declaringFunc = declaringFunc;
        this.type = exports.ScopeTypes.LOCAL;
    }
}
class ST_PARAM {
    constructor(declaringFunc) {
        this.declaringFunc = declaringFunc;
        this.type = exports.ScopeTypes.PARAM;
    }
}
class ST_FIELD {
    constructor(klass, name, info) {
        this.klass = klass;
        this.name = name;
        this.info = info;
        this.type = exports.ScopeTypes.FIELD;
    }
}
class ST_PROP {
    constructor(klass, name, info) {
        this.klass = klass;
        this.name = name;
        this.info = info;
        this.type = exports.ScopeTypes.PROP;
    }
}
class ST_METHOD {
    constructor(klass, name, info) {
        this.klass = klass;
        this.name = name;
        this.info = info;
        this.type = exports.ScopeTypes.METHOD;
    }
}
class ST_THVAR {
    constructor() {
        this.type = exports.ScopeTypes.THVAR;
    }
}
class ST_NATIVE {
    constructor(name, value) {
        this.name = name;
        this.value = value;
        this.type = exports.ScopeTypes.NATIVE;
    }
}
class ST_CLASS {
    constructor(name, fullName, info) {
        this.name = name;
        this.fullName = fullName;
        this.info = info;
        this.type = exports.ScopeTypes.CLASS;
    }
}
class ST_GLOBAL {
    constructor(name) {
        this.name = name;
        this.type = exports.ScopeTypes.GLOBAL;
    }
}
class ST_MODULE {
    constructor(name) {
        this.name = name;
        this.type = exports.ScopeTypes.MODULE;
    }
}
/*const cu={ScopeTypes,newScopeType:genSt,getScopeType:stype,newScope,nullCheck:nc,
    genSym,extend,annotation:annotation3,getSource,getField,getMethod:getMethod2,
    getDependingClasses,getParams,
};
Tonyu.Compiler=cu;*/
//cu.ScopeTypes=ScopeTypes;
let nodeIdSeq = 1;
let symSeq = 1; //B
function newScopeType(st, options) {
    const res = { type: st };
    if (options) {
        for (let k in options)
            res[k] = options[k];
    }
    if (!res.name)
        res.name = genSym("_" + st + "_");
    return res;
}
exports.newScopeType = newScopeType;
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
function getField(klass, name) {
    if (klass instanceof Function)
        return null;
    let res = null;
    getDependingClasses(klass).forEach(function (k) {
        if (res)
            return;
        res = k.decls.fields[name];
    });
    if (typeof (res.vtype) === "string") {
        res.vtype = TonyuRuntime_1.default.classMetas[res.vtype] || root_1.default[res.vtype];
    }
    return res;
}
exports.getField = getField;
;
function getMethod(klass, name) {
    let res = null;
    getDependingClasses(klass).forEach(function (k) {
        if (res)
            return;
        res = k.decls.methods[name];
    });
    return res;
}
exports.getMethod = getMethod;
//cu.getMethod=getMethod2;
function getDependingClasses(klass) {
    const visited = {};
    const res = [];
    function loop(k) {
        if (visited[k.fullName])
            return;
        visited[k.fullName] = true;
        if (k.isShim) {
            console.log(klass, "contains shim ", k);
            throw new Error("Contains shim");
        }
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
