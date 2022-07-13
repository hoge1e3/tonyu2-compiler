"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isMethodType = exports.isMeta = exports.isNativeClass = exports.isMemoryDest = exports.isFileDest = void 0;
function isFileDest(d) {
    return d.file;
}
exports.isFileDest = isFileDest;
function isMemoryDest(d) {
    return d.memory;
}
exports.isMemoryDest = isMemoryDest;
function isNativeClass(klass) {
    return klass.class;
}
exports.isNativeClass = isNativeClass;
function isMeta(klass) {
    return klass.decls;
}
exports.isMeta = isMeta;
function isMethodType(klass) {
    return klass.method;
}
exports.isMethodType = isMethodType;
