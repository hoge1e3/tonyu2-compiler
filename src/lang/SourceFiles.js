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
