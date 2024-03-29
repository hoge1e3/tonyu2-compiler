"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const source_map_1 = __importDefault(require("./source-map"));
const SourceFiles_1 = require("./SourceFiles");
const stacktrace_1 = __importDefault(require("./stacktrace"));
module.exports = {
    async decode(e) {
        try {
            const tr = await stacktrace_1.default.fromError(e, { offline: true });
            tr.forEach(t => {
                try {
                    const sf = SourceFiles_1.sourceFiles.url2SourceFile[t.fileName];
                    //console.log("sf", t.fileName, sf, SourceFiles.url2SourceFile);
                    if (sf) {
                        const opt = {
                            line: t.lineNumber, column: t.columnNumber,
                            bias: source_map_1.default.SourceMapConsumer.GREATEST_LOWER_BOUND
                        };
                        const pos = this.originalPositionFor(sf, opt);
                        console.log("pos", opt, pos);
                        if (pos.source)
                            t.fileName = pos.source;
                        if (pos.line)
                            t.lineNumber = pos.line;
                        if (pos.column)
                            t.columnNumber = pos.column;
                    }
                }
                catch (ex) {
                    console.log("Sourcemap error", ex);
                }
            });
            console.log("Converted: ", tr);
            return tr;
        }
        catch (ex) {
            console.log("StackTrace error", ex);
            if (!e || !e.stack) {
                console.log("HennaError", e);
                return [];
            }
            return e.stack.split("\n");
        }
    },
    originalPositionFor(sf, opt) {
        const s = this.getSourceMapConsumer(sf);
        if (!s)
            return opt;
        return s.originalPositionFor(opt);
    },
    getSourceMapConsumer(sf) {
        if (sf.sourceMapConsumer)
            return sf.sourceMapConsumer;
        sf.sourceMapConsumer = new source_map_1.default.SourceMapConsumer(JSON.parse(sf.sourceMap));
        //console.log(this.sourceMapConsumer);
        return sf.sourceMapConsumer;
    }
};
