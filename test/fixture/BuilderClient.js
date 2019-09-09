(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
var indexOf = function (xs, item) {
    if (xs.indexOf) return xs.indexOf(item);
    else for (var i = 0; i < xs.length; i++) {
        if (xs[i] === item) return i;
    }
    return -1;
};
var Object_keys = function (obj) {
    if (Object.keys) return Object.keys(obj)
    else {
        var res = [];
        for (var key in obj) res.push(key)
        return res;
    }
};

var forEach = function (xs, fn) {
    if (xs.forEach) return xs.forEach(fn)
    else for (var i = 0; i < xs.length; i++) {
        fn(xs[i], i, xs);
    }
};

var defineProp = (function() {
    try {
        Object.defineProperty({}, '_', {});
        return function(obj, name, value) {
            Object.defineProperty(obj, name, {
                writable: true,
                enumerable: false,
                configurable: true,
                value: value
            })
        };
    } catch(e) {
        return function(obj, name, value) {
            obj[name] = value;
        };
    }
}());

var globals = ['Array', 'Boolean', 'Date', 'Error', 'EvalError', 'Function',
'Infinity', 'JSON', 'Math', 'NaN', 'Number', 'Object', 'RangeError',
'ReferenceError', 'RegExp', 'String', 'SyntaxError', 'TypeError', 'URIError',
'decodeURI', 'decodeURIComponent', 'encodeURI', 'encodeURIComponent', 'escape',
'eval', 'isFinite', 'isNaN', 'parseFloat', 'parseInt', 'undefined', 'unescape'];

function Context() {}
Context.prototype = {};

var Script = exports.Script = function NodeScript (code) {
    if (!(this instanceof Script)) return new Script(code);
    this.code = code;
};

Script.prototype.runInContext = function (context) {
    if (!(context instanceof Context)) {
        throw new TypeError("needs a 'context' argument.");
    }
    
    var iframe = document.createElement('iframe');
    if (!iframe.style) iframe.style = {};
    iframe.style.display = 'none';
    
    document.body.appendChild(iframe);
    
    var win = iframe.contentWindow;
    var wEval = win.eval, wExecScript = win.execScript;

    if (!wEval && wExecScript) {
        // win.eval() magically appears when this is called in IE:
        wExecScript.call(win, 'null');
        wEval = win.eval;
    }
    
    forEach(Object_keys(context), function (key) {
        win[key] = context[key];
    });
    forEach(globals, function (key) {
        if (context[key]) {
            win[key] = context[key];
        }
    });
    
    var winKeys = Object_keys(win);

    var res = wEval.call(win, this.code);
    
    forEach(Object_keys(win), function (key) {
        // Avoid copying circular objects like `top` and `window` by only
        // updating existing context properties or new properties in the `win`
        // that was only introduced after the eval.
        if (key in context || indexOf(winKeys, key) === -1) {
            context[key] = win[key];
        }
    });

    forEach(globals, function (key) {
        if (!(key in context)) {
            defineProp(context, key, win[key]);
        }
    });
    
    document.body.removeChild(iframe);
    
    return res;
};

Script.prototype.runInThisContext = function () {
    return eval(this.code); // maybe...
};

Script.prototype.runInNewContext = function (context) {
    var ctx = Script.createContext(context);
    var res = this.runInContext(ctx);

    if (context) {
        forEach(Object_keys(ctx), function (key) {
            context[key] = ctx[key];
        });
    }

    return res;
};

forEach(Object_keys(Script.prototype), function (name) {
    exports[name] = Script[name] = function (code) {
        var s = Script(code);
        return s[name].apply(s, [].slice.call(arguments, 1));
    };
});

exports.isContext = function (context) {
    return context instanceof Context;
};

exports.createScript = function (code) {
    return exports.Script(code);
};

exports.createContext = Script.createContext = function (context) {
    var copy = new Context();
    if(typeof context === 'object') {
        forEach(Object_keys(context), function (key) {
            copy[key] = context[key];
        });
    }
    return copy;
};

},{}],2:[function(require,module,exports){
const root=require("../lib/root");
const Worker=root.Worker;
const WS=require("../lib/WorkerServiceB");
const SourceFiles=require("../lang/SourceFiles");
//const FS=(root.parent && root.parent.FS) || root.FS;

class BuilderClient {
    constructor(prj,config) {// dirBased
        this.prj=prj;
        this.w=new WS.Wrapper(new Worker(config.worker.url+"?"+Math.random()));
        this.config=config;
    }
    getOutputFile(...f) {return this.prj.getOutputFile(...f);}
    getDir(){return this.prj.getDir();}
    setDebugger(t) {this.debugger=t;}// t:iframe.contentWindow.Debugger
    exec(srcraw) {
        if (this.debugger) return this.debugger.exec(srcraw);
    }
    async init() {
        if (this.inited) return;
        const files=this.getDir().exportAsObject({
            excludesF: f=>f.ext()!==".tonyu" && f.name()!=="options.json"
        });
        const ns2depspec=this.config.worker.ns2depspec;
        await this.w.run("compiler/init",{
            namespace:this.prj.getNamespace(),
            files, ns2depspec
        });
        const deps=this.prj.getDependingProjects();//TODO recursive
        for (let dep of deps) {
            const ns=dep.getNamespace();
            if (!ns2depspec[ns]) {
                const files=dep.getDir().exportAsObject({
                    excludesF: f=>f.ext()!==".tonyu" && f.name()!=="options.json"
                });
                await this.w.run("compiler/addDependingProject",{
                    namespace:ns, files
                });
            }
        }
        this.inited=true;
    }
    async fullCompile() {
        await this.init();
        const compres=await this.w.run("compiler/fullCompile");
        console.log(compres);
        const sf=SourceFiles.add(compres);
        await sf.saveAs(this.getOutputFile());
        await this.exec(compres);
        return compres;
    }
    async partialCompile(f) {
        const files={};files[f.relPath(this.getDir())]=f.text();
        await this.init();
        const compres=await this.w.run("compiler/postChange",{files});
        console.log(compres);
        await this.exec(compres);
        return compres;
    }
    async run() {
        await this.init();
        await this.fullCompile();
        this.getDir().watch(async (e,f)=>{
            console.log(e,f.path());
            if (f.ext()===".tonyu") {
                const nsraw=await this.partialCompile(f);
                if (this.config.onCompiled) this.config.onCompiled(nsraw);

                //if (root.Tonyu.globals.$restart) root.Tonyu.globals.$restart();
            }
        });
    }
}
root.TonyuBuidlerClient=BuilderClient;
module.exports=BuilderClient;

},{"../lang/SourceFiles":3,"../lib/WorkerServiceB":4,"../lib/root":5}],3:[function(require,module,exports){
const root=require("../lib/root");
//const fs=require("fs").promises;
function timeout(t) {
    return new Promise(s=>setTimeout(s,t));
}
let vm;
if (root.process) {
    vm=require("vm");
}
class SourceFile {
    // var text, sourceMap:S.Sourcemap;
    constructor(text, sourceMap) {
        if (typeof text==="object") {
            const params=text;
            sourceMap=params.sourceMap;
            //functions=params.functions;
            text=params.text;
            if (params.url) {
                this.url=params.url;
            }
        }
        this.text=text;
        this.sourceMap=sourceMap && sourceMap.toString();
        //this.functions=functions;
    }
    async saveAs(outf) {
        const mapFile=outf.sibling(outf.name()+".map");
        let text=this.text;
        //text+="\n//# traceFunctions="+JSON.stringify(this.functions);
        if (this.sourceMap) {
            await mapFile.text(this.sourceMap);
            text+="\n//# sourceMappingURL="+mapFile.name();
        }
        await outf.text(text);
        //return Promise.resolve();
    }
    exec(options) {
        return new Promise((resolve, reject)=>{
            if (root.window) {
                const document=root.document;
                let u;
                if (this.url) {
                    u=this.url;
                } else {
                    const b=new root.Blob([this.text], {type: 'text/plain'});
                    u=root.URL.createObjectURL(b);
                }
                const s=document.createElement("script");
                console.log("load script",u);
                s.setAttribute("src",u);
                s.addEventListener("load",e=>{
                    resolve(e);
                });
                this.parent.url2SourceFile[u]=this;
                document.body.appendChild(s);
            } else if (options && options.tmpdir){
                const tmpdir=options.tmpdir;
                const uniqFile=tmpdir.rel(Math.random()+".js");
                const mapFile=uniqFile.sibling(uniqFile.name()+".map");
                let text=this.text;
                text+="\n//# sourceMappingURL="+mapFile.name();
                uniqFile.text(text);
                mapFile.text(this.sourceMap);
                //console.log("EX",uniqFile.exists());
                require(uniqFile.path());
                uniqFile.rm();
                mapFile.rm();
                resolve();
            } else if (root.importScripts && this.url){
                root.importScripts(this.url);
                resolve();
            } else {
                const F=Function;
                const f=(vm? vm.compileFunction(this.text) : new F(this.text));
                resolve(f());
            }
        });
    }
    export() {
        return {text:this.text, sourceMap:this.sourceMap, functions:this.functions};
    }
}
class SourceFiles {
    constructor() {
        this.url2SourceFile={};
    }
    add(text, sourceMap) {
        const sourceFile=new SourceFile(text, sourceMap);
        /*if (sourceFile.functions) for (let k in sourceFile.functions) {
            this.functions[k]=sourceFile;
        }*/
        sourceFile.parent=this;
        return sourceFile;
    }

}
module.exports=new SourceFiles();

},{"../lib/root":5,"vm":1}],4:[function(require,module,exports){
/*global Worker*/
// Browser Side
let idseq=0;
class Wrapper {
    constructor(worker) {
        const t=this;
        t.idseq=1;
        t.queue={};
        t.worker=worker;
        t.readyQueue=[];
        worker.addEventListener("message",function (e) {
            var d=e.data;
            if (d.reverse) {
                t.procReverse(e);
            } else if (d.ready) {
                t.ready();
            } else if (d.id) {
                t.queue[d.id](d);
                delete t.queue[d.id];
            }
        });
        t.run("WorkerService/isReady").then(function (r) {
            if (r) t.ready();
        });
    }
    procReverse(e) {
        const t=this;
        var d=e.data;
        var id=d.id;
        var path=d.path;
        var params=d.params;
        try {
            Promise.resolve(paths[path](params)).then(function (r) {
                t.worker.postMessage({
                    reverse:true,
                    status:"ok",
                    id:id,
                    result: r
                });
            },sendError);
        } catch(err) {
            sendError(err);
        }
        function sendError(e) {
            t.worker.postMessage({
                reverse: true,
                id:id, error:e?(e.stack||e+""):"unknown", status:"error"
            });
        }
    }
    ready() {
        const t=this;
        if (t.isReady) return;
        t.isReady=true;
        console.log("Worker is ready!");
        t.readyQueue.forEach(function (f){ f();});
    }
    readyPromise() {
        const t=this;
        return new Promise(function (succ) {
            if (t.isReady) return succ();
            t.readyQueue.push(succ);
        });
    }
    run(path, params) {
        const t=this;
        return t.readyPromise().then(function() {
            return new Promise(function (succ,err) {
                var id=t.idseq++;
                t.queue[id]=function (e) {
                    //console.log("Status",e);
                    if (e.status=="ok") {
                        succ(e.result);
                    } else {
                        err(e.error);
                    }
                };
                t.worker.postMessage({
                    id: id,
                    path: path,
                    params: params
                });
            });
        });
    }
    terminate() {
        const t=this;
        t.worker.terminate();
    }
}
var paths={};
const WorkerService={
    Wrapper:Wrapper,
    load: function (src) {
        var w=new Worker(src);
        return new Wrapper(w);
    },
    install: function (path, func) {
        paths[path]=func;
    },
    serv: function (path,func) {
        this.install(path,func);
    }
};
WorkerService.serv("console/log", function (params){
    console.log.apply(console,params);
});
module.exports=WorkerService;

},{}],5:[function(require,module,exports){
(function (global){
/*global window,self,global*/
(function (deps, factory) {
    module.exports=factory();
})([],function (){
    if (typeof window!=="undefined") return window;
    if (typeof self!=="undefined") return self;
    if (typeof global!=="undefined") return global;
    return (function (){return this;})();
});

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}]},{},[2]);
