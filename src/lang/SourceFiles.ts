import { SFile } from "@hoge1e3/sfile";

type SourceFileParam=FileBasedSourceFileParam|URLBasedSourceFileParam;
type FileBasedSourceFileParam={
    file?: SFile,
    text?: string,
    sourceMap?:string, 
};
type URLBasedSourceFileParam={url:string};
function isURLBasedSourceFileParam(p:SourceFileParam):p is URLBasedSourceFileParam {
    return (p as any).url;
}
export class SourceFile {
    url?: string;
    text?: string;
    file?: SFile;
    sourceMap?: string;
    functions: any;
    parent?: SourceFiles;
    // var text, sourceMap:S.Sourcemap;
    constructor(text:string, sourceMap:string);
    constructor(params:SourceFileParam);
    constructor(...args:any[]) {
        if (typeof args[0]==="object") {
            const params=args[0] as SourceFileParam;
            if (isURLBasedSourceFileParam(params)) {
                this.url=params.url;
            } else {
                this.sourceMap=params.sourceMap;
                //functions=params.functions;
                if (params.file) {
                    this.file=params.file;
                    this.text=this.file.text();
                } else if (params.text) {
                    this.text=params.text;
                } else {
                    throw new Error("Either file or text should be specified");
                }
            }
        } else {
            this.text=args[0] as string;
            this.sourceMap=args[1] ??  args[1].toString();

        }
        //this.functions=functions;
    }
    async saveAs(outf:SFile) {
        const mapFile=outf.sibling(outf.name()+".map");
        let text=this.text;
        if (!text) throw new Error("Cannot save: this source file is URL based");
        //text+="\n//# traceFunctions="+JSON.stringify(this.functions);
        if (this.sourceMap) {
            await mapFile.text(this.sourceMap);
            text+="\n//# sourceMappingURL="+mapFile.name();
        }
        await outf.text(text);
        //return Promise.resolve();
    }
    async exec() {        
        let u;
        const g=(globalThis as any);
        if (g.pNode && this.file) {// petit-node
            const p=g.pNode;
            return await p.importModule(this.file);
        }
        if (g.process && this.file) {// REAL node
            return await import("file://"+this.file.path());
        }
        // Partial execution?
        if (this.url) {
            u=this.url;
        } else {
            const b=new Blob([this.text!], {type: 'text/plain'});
            u=URL.createObjectURL(b);
        }
        if (this.parent) this.parent.url2SourceFile[u]=this;
        return await import(u);
    }
    export() {
        return {text:this.text, sourceMap:this.sourceMap, functions:this.functions};
    }
}
export class SourceFiles {
    url2SourceFile= {} as Record<string, SourceFile>;
    constructor() {
        this.url2SourceFile={};
    }
    add(text:string, sourceMap:string):SourceFile;
    add(params:SourceFileParam):SourceFile;
    add(text:string|SourceFileParam, sourceMap?:string):SourceFile {
        const sourceFile=typeof text==="string"?
            new SourceFile(text, sourceMap!):
            new SourceFile(text);
        sourceFile.parent=this;
        return sourceFile;
    }

}
export const sourceFiles= new SourceFiles();
//});/*--end of define--*/
