const S=require("./source-map");
const StackTrace=require("./stacktrace");
const SourceFiles=require("./SourceFiles");
module.exports={
    decode(e) {
        return StackTrace.fromError(e,{offline:true}).then(tr=>{
            tr.forEach(t=>{
                const sf=SourceFiles.url2SourceFile[t.fileName];
                //console.log("sf", t.fileName, sf, SourceFiles.url2SourceFile);
                if (sf) {
                    const opt={
                        line: t.lineNumber, column:t.columnNumber,
                        bias:S.SourceMapConsumer.GREATEST_LOWER_BOUND
                    };
                    const pos=this.originalPositionFor(sf,opt);
                    //console.log("pos",opt,pos);
                    if (pos.source) t.fileName=pos.source;
                    if (pos.line) t.lineNumber=pos.line;
                    if (pos.column) t.columnNumber=pos.column;
                }
            });
            //console.log("Converted: ",tr);
            return tr;
        });
    },
    originalPositionFor(sf,opt) {
        const s=this.getSourceMapConsumer(sf);
        if (!s) return opt;
        return s.originalPositionFor(opt);
    },
    getSourceMapConsumer(sf) {
        if (sf.sourceMapConsumer) return sf.sourceMapConsumer;
        sf.sourceMapConsumer=new S.SourceMapConsumer(JSON.parse(sf.sourceMap));
        //console.log(this.sourceMapConsumer);
        return sf.sourceMapConsumer;
    }
};
