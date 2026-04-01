import { SFile } from "@hoge1e3/sfile";

export class SourceFile {
    url?: string;
    text: string;
    file?: SFile;
    sourceMap: string;
    functions: any;
    parent?: SourceFiles;
    // var text, sourceMap:S.Sourcemap;
    constructor(text:string, sourceMap:string);
    constructor(params:{
        file?: SFile,
        text?: string,
        url?: string,
        sourceMap:string, 
    });
    constructor(...args:any[]) {
        if (typeof args[0]==="object") {
            const params=args[0] as {
                file?: SFile,
                text?: string,
                url?: string,
                sourceMap:string, 
            };
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
            if (params.url) {
                this.url=params.url;
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
        if ((globalThis as any).pNode && this.file) {
            const p=(globalThis as any).pNode;
            return await p.importModule(this.file);
        }
        if (typeof process!=="undefined" && this.file) {
            return await import(this.file.path());
        }
        if (this.url) {
            u=this.url;
        } else {
            const b=new Blob([this.text], {type: 'text/plain'});
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
    add(text:string, sourceMap:string) {
        const sourceFile=new SourceFile(text, sourceMap);
        sourceFile.parent=this;
        return sourceFile;
    }

}
export const sourceFiles= new SourceFiles();
//});/*--end of define--*/
