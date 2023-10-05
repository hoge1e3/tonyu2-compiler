"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isUnionType = exports.isMethodType = exports.isMeta = exports.isNativeClass = exports.isArrayType = exports.isArrowFuncInfo = exports.isNonArrowFuncInfo = exports.isMemoryDest = exports.isFileDest = void 0;
function isFileDest(d) {
    return d.file;
}
exports.isFileDest = isFileDest;
function isMemoryDest(d) {
    return d.memory;
}
exports.isMemoryDest = isMemoryDest;
function isNonArrowFuncInfo(f) {
    return f.stmts;
}
exports.isNonArrowFuncInfo = isNonArrowFuncInfo;
function isArrowFuncInfo(f) {
    return f.retVal;
}
exports.isArrowFuncInfo = isArrowFuncInfo;
function isArrayType(klass) {
    return klass.element;
}
exports.isArrayType = isArrayType;
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
function isUnionType(klass) {
    return klass.candidates;
}
exports.isUnionType = isUnionType;
