"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.create = exports.requireMod = exports.requireUrl = exports.createFromString = exports.urlFromString = exports.createFromFunction = exports.extractSrcFromFunction = void 0;
function extractSrcFromFunction(f, startMark, endMark) {
    startMark = startMark || /(.|\s)*WORKER[_]SRC[_]BEGIN\*\//;
    endMark = endMark || /\/\*WORKER[_]SRC[_]END(.|\s)*/;
    var src = ("" + f).replace(startMark, "").replace(endMark, "");
    return src;
}
exports.extractSrcFromFunction = extractSrcFromFunction;
function createFromFunction(f, startMark, endMark) {
    var src = this.extractSrcFromFunction(f, startMark, endMark);
    return this.createFromString(src);
}
exports.createFromFunction = createFromFunction;
function urlFromString(src) {
    return URL.createObjectURL(new Blob([src], { type: "text/javascript" }));
}
exports.urlFromString = urlFromString;
function createFromString(src) {
    var url = this.urlFromString(src);
    return new Worker(url);
}
exports.createFromString = createFromString;
function requireUrl(name) {
    return "worker.js?main=" + name;
}
exports.requireUrl = requireUrl;
function requireMod(name) {
    return new Worker(this.requireUrl(name));
}
exports.requireMod = requireMod;
function create(src) {
    if (typeof src === "string") {
        return this.require(src);
    }
    else if (typeof src === "function") {
        return this.createFromFunction(src);
    }
    throw new Error("Invaluid src type " + src);
}
exports.create = create;
