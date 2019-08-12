const S=require("./source-map");
const StackTrace=require("./stacktrace.min");
const root=require("../lib/root");
const fs=require("fs").promises;
function timeout(t) {
    return new Promise(s=>setTimeout(s,t));
}
let vm;
if (root.process) {
    vm=require("vm");
}
class SourceFile {
    // var text, sourceMap:S.Sourcemap, functions;
    constructor(text, sourceMap, functions) {
        this.text=text;
        this.sourceMap=sourceMap.toString();
        this.functions=functions;
    }
    saveAs(outf) {
        const mapFile=outf.sibling(outf.name()+".map");
        let text=this.text;
        //text+="\n//# traceFunctions="+JSON.stringify(this.functions);
        text+="\n//# sourceMappingURL="+mapFile.name();
        outf.text(text);
        return mapFile.text(this.sourceMap);
        //return Promise.resolve();
    }
    exec(options) {
        return new Promise((resolve, reject)=>{
            if (root.window) {
                const document=root.document;
                const b=new root.Blob([this.text], {type: 'text/plain'});
                const u=root.URL.createObjectURL(b);
                const s=document.createElement("script");
                s.setAttribute("src",u);
                s.addEventListener("load",e=>{
                    resolve(e);
                });
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

            } else {
                const F=Function;
                const f=(vm? vm.compileFunction(this.text) : new F(this.text));
                resolve(f());
            }
        });
    }
    getSourceMapConsumer() {
        if (this.sourceMapConsumer) return this.sourceMapConsumer;
        this.sourceMapConsumer=new S.SourceMapConsumer(JSON.parse(this.sourceMap));
        //console.log(this.sourceMapConsumer);
        return this.sourceMapConsumer;
    }
    originalPositionFor(opt) {
        return this.getSourceMapConsumer().originalPositionFor(opt);
    }
}
class SourceFiles {
    constructor() {
        this.functions={};
    }
    add(text, sourceMap, functions) {
        const sourceFile=new SourceFile(text, sourceMap, functions);
        for (let k in sourceFile.functions) {
            this.functions[k]=sourceFile;
        }
        return sourceFile;
    }
    decodeTrace(e) {
        StackTrace.fromError(e).then(tr=>{
            tr.forEach(t=>{
                if (typeof t.functionName!=="string") return;
                console.log(t.source);
                /*columnNumber: 17,
                lineNumber: 21,*/
                t.functionName.replace(/[\$_a-zA-Z0-9]+/g, s=> {
                    if (this.functions[s]) {
                        console.log("!",s);
                        const sf=this.functions[s];
                        const opt={
							line: t.lineNumber, column:t.columnNumber,
							bias:S.SourceMapConsumer.GREATEST_LOWER_BOUND
						};
                        const pos=sf.originalPositionFor(opt);
                        console.log("pos",opt,pos);
                    }
                });
            });
        });
        //console.log(st);
    }
}
module.exports=new SourceFiles();
