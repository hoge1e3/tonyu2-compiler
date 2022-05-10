"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isMeta = exports.isMemoryDest = exports.isFileDest = exports.isBuilderContext = void 0;
function isBuilderContext(c) {
    return c && c.visited;
}
exports.isBuilderContext = isBuilderContext;
function isFileDest(d) {
    return d.file;
}
exports.isFileDest = isFileDest;
function isMemoryDest(d) {
    return d.memory;
}
exports.isMemoryDest = isMemoryDest;
function isMeta(klass) {
    return klass.decls;
}
exports.isMeta = isMeta;
