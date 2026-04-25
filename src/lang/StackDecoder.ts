import { NullableMappedPosition, Position, SourceMapConsumer } from "source-map";
import {SourceFile, sourceFiles} from "./SourceFiles.js";
import {fromError} from "stacktrace-js";

const sf2c=new WeakMap<SourceFile,SourceMapConsumer>();
/*const S=require("./source-map");
const StackTrace=require("./stacktrace");
const SourceFiles=require("./SourceFiles");*/
/*export type NullableMappedPositionWithFile=NullableMappedPosition&{
    source?:string
};*/
export default {
    async decode(e:Error) {
        try{
            const tr=await fromError(e,{offline:true});
            for(let t of tr) {
                try {
                    const sf=t.fileName && sourceFiles.url2SourceFile[t.fileName];
                    //console.log("sf", t.fileName, sf, SourceFiles.url2SourceFile);
                    if (sf && 
                        typeof t.lineNumber==="number"&&
                        typeof t.columnNumber==="number"
                    ) {
                        const opt={
                            line: t.lineNumber, column:t.columnNumber,
                            bias:SourceMapConsumer.GREATEST_LOWER_BOUND
                        };
                        const pos=await this.originalPositionFor(sf,opt);
                        console.log("pos",opt,pos);
                        if (pos.source) t.fileName=pos.source;
                        if (pos.line) t.lineNumber=pos.line;
                        if (pos.column) t.columnNumber=pos.column;
                    }
                }catch(ex) {
                    console.log("Sourcemap error",ex);
                }
            }
            console.log("Converted: ",tr);
            return tr;
        } catch(ex) {
            console.log("StackTrace error",ex);
            if (!e || !e.stack) {
                console.log("HennaError",e);
                return [];
            }
            return e.stack.split("\n");
        }
    },
    async originalPositionFor(sf:SourceFile,opt:Position&{bias?:number}):Promise<NullableMappedPosition> {
        const s=await this.getSourceMapConsumer(sf);
        const src={
            source: sf.file?.path() ?? null,
            name: sf.file?.path() ?? null,
        };
        if (!s) return {...opt,...src};
        return Object.assign(s.originalPositionFor(opt),src);
    },
    async getSourceMapConsumer(sf:SourceFile):Promise<SourceMapConsumer> {
        if (sf2c.has(sf)) return sf2c.get(sf)!;
        if (!sf.sourceMap) throw new Error(sf.url+": This sourceFile is URL based");
        const sc=await new SourceMapConsumer(JSON.parse(sf.sourceMap));
        sf2c.set(sf,sc);
        //console.log(this.sourceMapConsumer);
        return sc;
    }
};
