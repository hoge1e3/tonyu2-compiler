const root=require("../lib/root");
const Worker=root.Worker;
const WS=require("../lib/WorkerServiceB");
//const FS=(root.parent && root.parent.FS) || root.FS;

class Compiler {
    constructor(dir) {
        this.dir=dir;
        this.w=new WS.Wrapper(new Worker(root.WebSite.compilerWorkerURL+"?"+Math.random()));
    }
    async init() {
        if (this.inited) return;
        await this.w.run("compiler/init",{
            files: this.dir.exportAsObject({
                excludesF: f=>f.ext()!==".tonyu" && f.name()!=="options.json"
            })
        });
        this.inited=true;
    }
    async fullCompile() {
        await this.init();
        const compres=await this.w.run("compiler/fullCompile");
        console.log(compres);
    }
    async partialCompile(f) {
        const files={};files[f.relPath(this.dir)]=f.text();
        await this.init();
        const compres=await this.w.run("compiler/postChange",{files});
        console.log(compres);
    }
    async run() {
        await this.init();
        await this.fullCompile();
        this.dir.watch(async (e,f)=>{
            console.log(e,f.path());
            const ns=await this.partialCompile(f);
            /*console.log(ns);
            await ns.exec();
            if (root.Tonyu.globals.$restart) root.Tonyu.globals.$restart();*/
        });
    }
}
root.TonyuCompiler=Compiler;
module.exports=Compiler;
