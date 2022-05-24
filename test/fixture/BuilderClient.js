(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.TonyuBuilderClient = f()}})(function(){var define,module,exports;return (function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
const root=require("../lib/root");
const Worker=root.Worker;
const WS=require("../lib/WorkerServiceB");
const {sourceFiles}=require("../lang/SourceFiles");
const FileMap=require("../lib/FileMap");
const NS2DepSpec=require("../project/NS2DepSpec");
//const FS=(root.parent && root.parent.FS) || root.FS;
const FS=root.FS;// TODO

class BuilderClient {
    constructor(prj,config) {// dirBased
        this.prj=prj;
        let url=config.worker.url;
        if (!url.match(/^blob/)) url+="?"+Math.random();
        this.w=new WS.Wrapper(new Worker(url));
        this.config=config||{};
        this.fileMap=new FileMap();
    }
    getOutputFile(...f) {return this.prj.getOutputFile(...f);}
    getDir(){return this.prj.getDir();}
    setDebugger(t) {this.debugger=t;}// t:iframe.contentWindow.Debugger
    exec(srcraw) {
        if (this.debugger) return this.debugger.exec(srcraw);
    }
    convertFromWorkerPath(path) {
        return this.fileMap.convert(path,"remote","local");
    }
    exportFiles() {
        const localPrjDir=this.getDir();
        const n2files=this.prj.sourceFiles();
        const exported={base:localPrjDir.path(),data:{}};
        for (var k in n2files) {
            const f=n2files[k];
            exported.data[f.relPath(localPrjDir)]=f.text();
        }
        const opt=this.prj.getOptionsFile();
        exported.data[opt.relPath(localPrjDir)]=opt.text();
        console.log("exported",exported);
        return exported;
    }
    exportWithDependingFiles() {
        const ns2depspec=new NS2DepSpec(this.config.worker.ns2depspec);
        const exported=this.exportFiles();
        const deps=this.prj.getDependingProjects();//TODO recursive
        const outputDir=this.prj.getOutputFile().up();
        const newDep=[];
        for (let dep of deps) {
            const ns=dep.getNamespace();
            if (ns2depspec.has(ns)) {
                newDep.push({namespace:ns});
                continue;
            }
            const out=dep.getOutputFile();
            const dstOut=outputDir.rel(`${ns}.js`);
            const relOfOut=dstOut.relPath(this.prj.getDir());
            newDep.push({namespace:ns, outputFile: relOfOut});
            exported.data[relOfOut]=out.text();
        }
        const opt=JSON.parse(exported.data["options.json"]);
        opt.compiler.dependingProjects=newDep;
        exported.data["options.json"]=JSON.stringify(opt);
        console.log("opt changed", opt);
        return exported;
    }
    async init() {
        if (this.inited) return;
        const fileMap=this.fileMap;
        const localPrjDir=this.getDir();
        const ns2depspec=this.config.worker.ns2depspec;
        const files=this.exportWithDependingFiles();
        const {prjDir:remotePrjDir}=await this.w.run("compiler/init",{
            namespace:this.prj.getNamespace(),
            files, ns2depspec, locale: this.config.locale
        });
        fileMap.add({local:localPrjDir, remote: remotePrjDir});
        const deps=this.prj.getDependingProjects();//TODO recursive
        this.inited=true;
    }
    resetFiles() {
        if (!this.inited) return this.init();
        const files=this.exportWithDependingFiles();
        return this.w.run("compiler/resetFiles",{
            //namespace:this.prj.getNamespace(),
            files
        });
    }
    async parse(f,content=false){// use content when check not-yet-saved file
        if (content===false) content=f.text();
        await this.init();
        const filePath=f.relPath(this.getDir());
        const files={};
        files[filePath]=content;
        return await this.w.run("compiler/parse", {files});
    }
    async clean() {// Stands for eclipse "Clean" menu.
        await this.resetFiles();
        return await this.fullCompile();
    }
    async fullCompile() {
        try {
            this.partialCompilable=false;
            await this.init();
            const compres=await this.w.run("compiler/fullCompile");
            //console.log(compres);
            const sf=sourceFiles.add(compres);
            await sf.saveAs(this.getOutputFile());
            await this.exec(compres);
            this.partialCompilable=true;
            return compres;
        } catch(e) {
            throw this.convertError(e);
        }
    }
    async partialCompile(f, {content, noexec}={}) {
        if (!this.partialCompilable) {
            if (typeof content!=="string") {
                content=f.text();
            }
            const files={};files[f.relPath(this.getDir())]=content;
            await this.w.run("compiler/uploadFiles",{files});
            return await this.fullCompile();
        }
        try {
            if (typeof content!=="string") {
                content=f.text();
                if (noexec==null) noexec=false;
            } else {
                if (noexec==null) noexec=true;
            }
            const files={};files[f.relPath(this.getDir())]=content;
            await this.init();
            const compres=await this.w.run("compiler/postChange",{files});
            //console.log(compres);
            if (!noexec) await this.exec(compres);
            return compres;
        } catch(e) {
            throw this.convertError(e);
        }
    }
    async renameClassName(from,to) {
        try {
            await this.init();
            let changed=await this.w.run("compiler/renameClassName",{from,to});
            for (let n in changed) {
                let val=changed[n];
                n=this.convertFromWorkerPath(n);
                if (val==null) {
                    FS.get(n).rm();
                } else {
                    FS.get(n).text(val);
                }
            }
            return changed;
        } catch(e) {
            throw this.convertError(e);
        }
    }
    convertError(e) {
        if (e.isTError) {
            try {
                e.src=FS.get(this.convertFromWorkerPath(e.src));
            } catch(ee) {
                console.log(ee);
            }
        }
        return e;
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
BuilderClient.sourceFiles=sourceFiles;
BuilderClient.SourceFiles=sourceFiles;// deprecated
BuilderClient.NS2DepSpec=NS2DepSpec;
//root.TonyuBuilderClient=BuilderClient;
module.exports=BuilderClient;

},{"../lang/SourceFiles":2,"../lib/FileMap":3,"../lib/WorkerServiceB":4,"../lib/root":5,"../project/NS2DepSpec":6}],2:[function(require,module,exports){
"use strict";
//define(function (require,exports,module) {
/*const root=require("root");*/
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sourceFiles = exports.SourceFiles = exports.SourceFile = void 0;
const root_1 = __importDefault(require("../lib/root"));
function timeout(t) {
    return new Promise(s => setTimeout(s, t));
}
let vm;
/*global global*/
if (typeof global !== "undefined" && global.require && global.require.name !== "requirejs") {
    vm = global.require("vm");
}
class SourceFile {
    // var text, sourceMap:S.Sourcemap;
    constructor(text, sourceMap) {
        if (typeof text === "object") {
            const params = text;
            sourceMap = params.sourceMap;
            //functions=params.functions;
            text = params.text;
            if (params.url) {
                this.url = params.url;
            }
        }
        this.text = text;
        this.sourceMap = sourceMap && sourceMap.toString();
        //this.functions=functions;
    }
    async saveAs(outf) {
        const mapFile = outf.sibling(outf.name() + ".map");
        let text = this.text;
        //text+="\n//# traceFunctions="+JSON.stringify(this.functions);
        if (this.sourceMap) {
            await mapFile.text(this.sourceMap);
            text += "\n//# sourceMappingURL=" + mapFile.name();
        }
        await outf.text(text);
        //return Promise.resolve();
    }
    exec(options) {
        return new Promise((resolve, reject) => {
            if (root_1.default.window) {
                const document = root_1.default.document;
                let u;
                if (this.url) {
                    u = this.url;
                }
                else {
                    const b = new root_1.default.Blob([this.text], { type: 'text/plain' });
                    u = root_1.default.URL.createObjectURL(b);
                }
                const s = document.createElement("script");
                console.log("load script", u);
                s.setAttribute("src", u);
                s.addEventListener("load", e => {
                    resolve(e);
                });
                this.parent.url2SourceFile[u] = this;
                document.body.appendChild(s);
            }
            else if (options && options.tmpdir) {
                const tmpdir = options.tmpdir;
                const uniqFile = tmpdir.rel(Math.random() + ".js");
                const mapFile = uniqFile.sibling(uniqFile.name() + ".map");
                let text = this.text;
                text += "\n//# sourceMappingURL=" + mapFile.name();
                uniqFile.text(text);
                mapFile.text(this.sourceMap);
                //console.log("EX",uniqFile.exists());
                require(uniqFile.path());
                uniqFile.rm();
                mapFile.rm();
                resolve(void (0));
            }
            else if (root_1.default.importScripts && this.url) {
                root_1.default.importScripts(this.url);
                resolve(void (0));
            }
            else {
                const F = Function;
                const f = (vm ? vm.compileFunction(this.text) : new F(this.text));
                resolve(f());
            }
        });
    }
    export() {
        return { text: this.text, sourceMap: this.sourceMap, functions: this.functions };
    }
}
exports.SourceFile = SourceFile;
class SourceFiles {
    constructor() {
        this.url2SourceFile = {};
    }
    add(text, sourceMap) {
        const sourceFile = new SourceFile(text, sourceMap);
        /*if (sourceFile.functions) for (let k in sourceFile.functions) {
            this.functions[k]=sourceFile;
        }*/
        sourceFile.parent = this;
        return sourceFile;
    }
}
exports.SourceFiles = SourceFiles;
exports.sourceFiles = new SourceFiles();
//});/*--end of define--*/

},{"../lib/root":5}],3:[function(require,module,exports){
"use strict";
module.exports = class FileMap {
    constructor() { this.sidesList = []; }
    add(sides) {
        this.sidesList.push(sides);
    }
    convert(path, fromSide, toSide) {
        for (let sides of this.sidesList) {
            if (path.startsWith(sides[fromSide])) {
                return sides[toSide] + path.substring(sides[fromSide].length);
            }
        }
        return path;
    }
};

},{}],4:[function(require,module,exports){
"use strict";
/*global Worker*/
// Browser Side
let idseq = 0;
class Wrapper {
    constructor(worker) {
        this.isReady = false;
        const t = this;
        t.idseq = 1;
        t.queue = {};
        t.worker = worker;
        t.readyQueue = [];
        worker.addEventListener("message", function (e) {
            var d = e.data;
            if (d.reverse) {
                t.procReverse(e);
            }
            else if (d.ready) {
                t.ready();
            }
            else if (d.id) {
                t.queue[d.id](d);
                delete t.queue[d.id];
            }
        });
        t.run("WorkerService/isReady").then(function (r) {
            if (r)
                t.ready();
        });
    }
    procReverse(e) {
        const t = this;
        var d = e.data;
        var id = d.id;
        var path = d.path;
        var params = d.params;
        try {
            Promise.resolve(paths[path](params)).then(function (r) {
                t.worker.postMessage({
                    reverse: true,
                    status: "ok",
                    id: id,
                    result: r
                });
            }, sendError);
        }
        catch (err) {
            sendError(err);
        }
        function sendError(e) {
            e = Object.assign({ name: e.name, message: e.message, stack: e.stack }, e || {});
            try {
                const j = JSON.stringify(e);
                e = JSON.parse(j);
            }
            catch (je) {
                e = e ? e.message || e + "" : "unknown";
                console.log("WorkerServiceW", je, e);
            }
            t.worker.postMessage({
                reverse: true,
                id: id, error: e, status: "error"
            });
        }
    }
    ready() {
        const t = this;
        if (t.isReady)
            return;
        t.isReady = true;
        console.log("Worker is ready!");
        t.readyQueue.forEach(function (f) { f(); });
    }
    readyPromise() {
        const t = this;
        return new Promise(function (succ) {
            if (t.isReady)
                return succ(undefined);
            t.readyQueue.push(succ);
        });
    }
    run(path, params = {}) {
        const t = this;
        return t.readyPromise().then(function () {
            return new Promise(function (succ, err) {
                var id = t.idseq++;
                t.queue[id] = function (e) {
                    //console.log("Status",e);
                    if (e.status == "ok") {
                        succ(e.result);
                    }
                    else {
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
        const t = this;
        t.worker.terminate();
    }
}
var paths = {};
const WorkerService = {
    Wrapper: Wrapper,
    load: function (src) {
        var w = new Worker(src);
        return new Wrapper(w);
    },
    install: function (path, func) {
        paths[path] = func;
    },
    serv: function (path, func) {
        this.install(path, func);
    }
};
WorkerService.serv("console/log", function (params) {
    console.log.apply(console, params);
});
module.exports = WorkerService;

},{}],5:[function(require,module,exports){
"use strict";
const root = (function () {
    if (typeof window !== "undefined")
        return window;
    if (typeof self !== "undefined")
        return self;
    if (typeof global !== "undefined")
        return global;
    return (function () { return this; })();
})();
module.exports = root;

},{}],6:[function(require,module,exports){

class NS2DepSpec {
    constructor(hashOrArray) {
        if (isArray(hashOrArray)) {
            this.array=hashOrArray;
        } else {
            this.array=Object.keys(hashOrArray).map(n=>hashOrArray[n]);
        }
    }
    has(ns) {
        return this.array.filter(e=>e.namespace===ns)[0];
    }
    specs() {
        return this.array;
    }
    [Symbol.iterator]() {
        return this.array[Symbol.iterator]();
    }
}
function isArray(o) {
    return (o && typeof o.slice==="function");
}
module.exports=NS2DepSpec;

},{}]},{},[1])(1)
});
