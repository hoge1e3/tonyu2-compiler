"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isUnionTypeDigest = exports.isArrayTypeDigest = exports.isTonyuClass = void 0;
function isTonyuClass(v) {
    return typeof v === "function" && v.meta && !v.meta.isShim;
}
exports.isTonyuClass = isTonyuClass;
function isArrayTypeDigest(d) {
    return d.element;
}
exports.isArrayTypeDigest = isArrayTypeDigest;
function isUnionTypeDigest(d) {
    return d.union;
}
exports.isUnionTypeDigest = isUnionTypeDigest;
