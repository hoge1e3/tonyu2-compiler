"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const R_1 = __importDefault(require("../lib/R"));
const TonyuIterator_1 = __importDefault(require("./TonyuIterator"));
const TonyuThread_1 = __importDefault(require("./TonyuThread"));
const root_1 = __importDefault(require("../lib/root"));
const assert_1 = __importDefault(require("../lib/assert"));
// old browser support
if (!root_1.default.performance) {
    root_1.default.performance = {};
}
if (!root_1.default.performance.now) {
    root_1.default.performance.now = function now() {
        return Date.now();
    };
}
var preemptionTime = 60;
var Tonyu, TT;
function thread() {
    var t = new TT();
    t.handleEx = handleEx;
    return t;
}
function timeout(t) {
    return new Promise(function (s) {
        setTimeout(s, t);
    });
}
/*function animationFrame() {
    return new Promise( function (f) {
        requestAnimationFrame(f);
    });
}*/
const propReg = /^__([gs]et)ter__(.*)$/;
const property = {
    isPropertyMethod(name) {
        return propReg.exec(name);
    },
    methodFor(type, name) {
        return `__${type}ter__${name}`;
    }
};
function handleEx(e) {
    if (Tonyu.onRuntimeError) {
        Tonyu.onRuntimeError(e);
    }
    else {
        //if (typeof $LASTPOS=="undefined") $LASTPOS=0;
        if (root_1.default.alert)
            root_1.default.alert("Error: " + e);
        console.log(e.stack);
        throw e;
    }
}
function addMeta(fn, m) {
    // why use addMeta?
    // because when compiled from source, additional info(src file) is contained.
    // k.meta={...} erases these info
    assert_1.default.is(arguments, [String, Object]);
    return extend(klass.getMeta(fn), m);
}
var klass = {
    addMeta,
    removeMeta(n) {
        delete classMetas[n];
    },
    removeMetaAll(ns) {
        ns += ".";
        for (let n in classMetas) {
            if (n.substring(0, ns.length) === ns)
                delete classMetas[n];
        }
    },
    getMeta(k) {
        if (typeof k == "function") {
            return k.meta;
        }
        else if (typeof k == "string") {
            var mm = classMetas[k];
            if (!mm)
                classMetas[k] = mm = {};
            return mm;
        }
    },
    ensureNamespace(top, nsp) {
        var keys = nsp.split(".");
        var o = top;
        var i;
        for (i = 0; i < keys.length; i++) {
            var k = keys[i];
            if (!o[k])
                o[k] = {};
            o = o[k];
        }
        return o;
    },
    /*Function.prototype.constructor=function () {
        throw new Error("This method should not be called");
    };*/
    propReg,
    property,
    define(params) {
        // fullName, shortName,namspace, superclass, includes, methods:{name/fiber$name: func}, decls
        var parent = params.superclass;
        var includes = params.includes;
        var fullName = params.fullName;
        var shortName = params.shortName;
        var namespace = params.namespace;
        var methodsF = params.methods;
        var decls = params.decls;
        var nso = klass.ensureNamespace(Tonyu.classes, namespace);
        var outerRes;
        function chkmeta(m, ctx) {
            ctx = ctx || {};
            if (ctx.isShim)
                return m;
            ctx.path = ctx.path || [];
            ctx.path.push(m);
            if (m.isShim) {
                console.log("chkmeta::ctx", ctx);
                throw new Error("Shim found " + m.extenderFullName);
            }
            if (m.superclass)
                chkmeta(m.superclass, ctx);
            if (!m.includes) {
                console.log("chkmeta::ctx", ctx);
                throw new Error("includes not found");
            }
            m.includes.forEach(function (mod) {
                chkmeta(mod, ctx);
            });
            ctx.path.pop();
            return m;
        }
        function chkclass(c, ctx) {
            if (!c.prototype.hasOwnProperty("getClassInfo"))
                throw new Error("NO");
            if (!c.meta) {
                console.log("metanotfound", c);
                throw new Error("meta not found");
            }
            chkmeta(c.meta, ctx);
            return c;
        }
        function extender(parent, ctx) {
            var isShim = !ctx.init;
            var includesRec = ctx.includesRec;
            if (includesRec[fullName])
                return parent;
            includesRec[fullName] = true;
            //console.log(ctx.initFullName, fullName);//,  includesRec[fullName],JSON.stringify(ctx));
            includes.forEach(function (m) {
                parent = m.extendFrom(parent, extend(ctx, { init: false }));
            });
            var methods = typeof methodsF === "function" ? methodsF(parent) : methodsF;
            /*if (typeof Profiler!=="undefined") {
                Profiler.profile(methods, fullName);
            }*/
            var init = methods.initialize;
            delete methods.initialize;
            var res;
            res = (init ?
                function () {
                    if (!(this instanceof res))
                        useNew(fullName);
                    init.apply(this, arguments);
                } :
                (parent ? function () {
                    if (!(this instanceof res))
                        useNew(fullName);
                    parent.apply(this, arguments);
                } : function () {
                    if (!(this instanceof res))
                        useNew(fullName);
                }));
            res.prototype = bless(parent, { constructor: res });
            if (isShim) {
                res.meta = { isShim: true, extenderFullName: fullName };
            }
            else {
                res.meta = addMeta(fullName, {
                    fullName: fullName, shortName: shortName, namespace: namespace, decls: decls,
                    superclass: ctx.nonShimParent ? ctx.nonShimParent.meta : null,
                    includesRec: includesRec,
                    includes: includes.map(function (c) { return c.meta; })
                });
            }
            res.meta.func = res;
            // methods: res's own methods(no superclass/modules)
            res.methods = methods;
            var prot = res.prototype;
            var props = {};
            //var propReg=klass.propReg;//^__([gs]et)ter__(.*)$/;
            //var k;
            for (let k in methods) {
                if (k.match(/^fiber\$/))
                    continue;
                prot[k] = methods[k];
                var fbk = "fiber$" + k;
                if (methods[fbk]) {
                    prot[fbk] = methods[fbk];
                    prot[fbk].methodInfo = prot[fbk].methodInfo || { name: k, klass: res, fiber: true };
                    prot[k].fiber = prot[fbk];
                }
                if (k !== "__dummy" && !prot[k]) {
                    console.log("WHY!", prot[k], prot, k);
                    throw new Error("WHY!" + k);
                }
                /*if (typeof methods[k]==="boolean") {
                    console.log(methods);
                    throw new Error(`${k} ${methods[k]}`);
                }*/
                if (k !== "__dummy") {
                    prot[k].methodInfo = prot[k].methodInfo || { name: k, klass: res };
                }
                // if profile...
                const r = property.isPropertyMethod(k);
                if (r) {
                    props[r[2]] = 1;
                    // __(r[1]g/setter)__r[2]
                    //props[r[2]]=props[r[2]]||{};
                    //props[r[2]][r[1]]=prot[k];
                }
            }
            prot.isTonyuObject = true;
            //console.log("Prots1",props);
            for (let k of Object.keys(props)) {
                const desc = {};
                for (let type of ["get", "set"]) {
                    const tter = prot[property.methodFor(type, k)];
                    if (tter) {
                        desc[type] = tter;
                    }
                }
                //console.log("Prots2",k, desc);
                Object.defineProperty(prot, k, desc);
            }
            prot.getClassInfo = function () {
                return res.meta;
            };
            return chkclass(res, { isShim: isShim });
        }
        var res = extender(parent, {
            init: true,
            initFullName: fullName,
            includesRec: (parent ? extend({}, parent.meta.includesRec) : {}),
            nonShimParent: parent
        });
        res.extendFrom = extender;
        //addMeta(fullName, res.meta);
        nso[shortName] = res;
        outerRes = res;
        //console.log("defined", fullName, Tonyu.classes,Tonyu.ID);
        return chkclass(res, { isShim: false });
    },
    isSourceChanged(k) {
        k = k.meta || k;
        if (k.src && k.src.tonyu) {
            if (!k.nodeTimestamp)
                return true;
            return k.src.tonyu.lastUpdate() > k.nodeTimestamp;
        }
        return false;
    },
    shouldCompile(k) {
        k = k.meta || k;
        if (k.hasSemanticError)
            return true;
        if (klass.isSourceChanged(k))
            return true;
        var dks = klass.getDependingClasses(k);
        for (var i = 0; i < dks.length; i++) {
            if (klass.shouldCompile(dks[i]))
                return true;
        }
    },
    getDependingClasses(k) {
        k = k.meta || k;
        var res = [];
        if (k.superclass)
            res = [k.superclass];
        if (k.includes)
            res = res.concat(k.includes);
        return res;
    }
};
function bless(klass, val) {
    if (!klass)
        return extend({}, val);
    return extend(Object.create(klass.prototype), val);
    //return extend( new klass() , val);
}
function extend(dst, src) {
    if (src && typeof src == "object") {
        for (var i in src) {
            dst[i] = src[i];
        }
    }
    return dst;
}
//alert("init");
var globals = {};
function isConstructor(v) {
    return typeof v === "function";
}
var classes = {}; // classes.namespace.classname= function
var classMetas = {}; // classes.namespace.classname.meta ( or env.classes / ctx.classes)
function setGlobal(n, v) {
    globals[n] = v;
}
function getGlobal(n) {
    return globals[n];
}
function getClass(n) {
    //CFN: n.split(".")
    var ns = n.split(".");
    var res = classes;
    ns.forEach(function (na) {
        if (!res)
            return;
        res = res[na];
    });
    if (!res && ns.length == 1) {
        var found;
        for (var nn in classes) {
            var nr = classes[nn][n];
            if (nr) {
                if (!res) {
                    res = nr;
                    found = nn + "." + n;
                }
                else
                    throw new Error(R_1.default("ambiguousClassName", nn, n, found));
            }
        }
    }
    return res;
    //if (res instanceof Function) return res;//classes[n];
    //throw new Error(`Not a class: ${n}`);
}
function bindFunc(t, meth) {
    if (typeof meth != "function")
        return meth;
    var res = function () {
        return meth.apply(t, arguments);
    };
    res.methodInfo = Tonyu.extend({ thiz: t }, meth.methodInfo || {});
    if (meth.fiber) {
        res.fiber = function fiber_func() {
            return meth.fiber.apply(t, arguments);
        };
        res.fiber.methodInfo = Tonyu.extend({ thiz: t }, meth.fiber.methodInfo || {});
    }
    return res;
}
function invokeMethod(t, name, args, objName) {
    if (!t)
        throw new Error(R_1.default("cannotInvokeMethod", objName, t, name));
    var f = t[name];
    if (typeof f != "function")
        throw new Error(R_1.default("notAMethod", (objName == "this" ? "" : objName + "."), name, f));
    return f.apply(t, args);
}
function callFunc(f, args, fName) {
    if (typeof f != "function")
        throw new Error(R_1.default("notAFunction", fName));
    return f.apply({}, args);
}
function checkNonNull(v, name) {
    if (v != v || v == null)
        throw new Error(R_1.default("uninitialized", name, v));
    return v;
}
function A(args) {
    var res = [];
    for (var i = 1; i < args.length; i++) {
        res[i - 1] = args[i];
    }
    return res;
}
function useNew(c) {
    throw new Error(R_1.default("newIsRequiredOnInstanciate", c));
}
function not_a_tonyu_object(o) {
    console.log("Not a tonyu object: ", o);
    throw new Error(o + " is not a tonyu object");
}
function hasKey(k, obj) {
    return k in obj;
}
function run(bootClassName) {
    var bootClass = getClass(bootClassName);
    if (!isConstructor(bootClass))
        throw new Error(R_1.default("bootClassIsNotFound", bootClassName));
    Tonyu.runMode = true;
    var boot = new bootClass();
    //var th=thread();
    //th.apply(boot,"main");
    var TPR = Tonyu.globals.$currentProject || Tonyu.currentProject;
    if (TPR) {
        //TPR.runningThread=th;
        TPR.runningObj = boot;
    }
    //$LASTPOS=0;
    //th.steps();
}
var lastLoopCheck = root_1.default.performance.now();
var prevCheckLoopCalled;
function checkLoop() {
    var now = root_1.default.performance.now();
    if (now - lastLoopCheck > 1000) {
        resetLoopCheck(10000);
        throw new Error(R_1.default("infiniteLoopDetected"));
    }
    prevCheckLoopCalled = now;
}
function resetLoopCheck(disableTime) {
    lastLoopCheck = root_1.default.performance.now() + (disableTime || 0);
}
function is(obj, klass) {
    if (!obj)
        return false;
    if (obj instanceof klass)
        return true;
    if (typeof obj.getClassInfo === "function" && klass.meta) {
        return obj.getClassInfo().includesRec[klass.meta.fullName];
    }
    return false;
}
//setInterval(resetLoopCheck,16);
Tonyu = { thread: thread,
    klass: klass, bless: bless, extend: extend,
    globals: globals, classes: classes, classMetas: classMetas, setGlobal: setGlobal, getGlobal: getGlobal, getClass: getClass,
    timeout: timeout,
    bindFunc: bindFunc, not_a_tonyu_object: not_a_tonyu_object, is: is,
    hasKey: hasKey, invokeMethod: invokeMethod, callFunc: callFunc, checkNonNull: checkNonNull,
    iterator: TonyuIterator_1.default, run: run, checkLoop: checkLoop, resetLoopCheck: resetLoopCheck,
    VERSION: 1560828115159,
    A: A, ID: Math.random() };
TT = TonyuThread_1.default(Tonyu);
if (root_1.default.Tonyu) {
    console.error("Tonyu called twice!");
    throw new Error("Tonyu called twice!");
}
root_1.default.Tonyu = Tonyu;
module.exports = Tonyu;
