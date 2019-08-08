const S=require("./source-map");
class SourceFile {
    // var text, sourceMap:S.Sourcemap, functions;
    constructor(text, sourceMap, functions) {
        this.text=text;
        this.sourceMap=sourceMap;
        this.functions=functions;
    }
    saveAs(outf) {
        const mapFile=outf.sibling(outf.name()+".map");
        outf.text(this.text+"\n//# sourceMappingURL="+mapFile.name());
        return mapFile.text(this.sourceMap.toString());
        //return Promise.resolve();
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

    }
}
module.exports=new SourceFiles();
