"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isTonyuClass = void 0;
function isTonyuClass(v) {
    return typeof v === "function" && v.meta;
}
exports.isTonyuClass = isTonyuClass;
