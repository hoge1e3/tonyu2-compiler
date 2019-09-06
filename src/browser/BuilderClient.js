const root=require("../lib/root");
const Worker=root.Worker;
const WS=require("../lib/WorkerServiceB");
const SourceFiles=require("../lang/SourceFiles");
//const FS=(root.parent && root.parent.FS) || root.FS;

class BuilderClient {
    constructor(prj,config) {// dirBased
        this.prj=prj;
        this.w=new WS.Wrapper(new Worker(config.worker.url+"?"+Math.random()));
        this.config=config;
        //this.SourceFiles=config.SourceFiles;
    }
    //getOptions() {return this.prj.getOptions();}
    getOutputFile(...f) {return this.prj.getOutputFile(...f);}
    //getNamespace() {return this.prj.getNamespace();}
    getDir(){return this.prj.getDir();}
    //getEXT(){return this.prj.getEXT();}
    //sourceFiles(){return this.prj.sourceFiles();}
    //loadDependingClasses(){return this.prj.loadDependingClasses();}

    setDebugger(t) {this.debugger=t;}// t:iframe.contentWindow.Debugger
    exec(srcraw) {
        if (this.debugger) return this.debugger.exec(srcraw);
    }
    async init() {
        if (this.inited) return;
        const files=this.getDir().exportAsObject({
            excludesF: f=>f.ext()!==".tonyu" && f.name()!=="options.json"
        });
        await this.w.run("compiler/init",{files,ns2resource: this.config.worker.ns2resource});
        this.inited=true;
    }
    async fullCompile() {
        await this.init();
        const compres=await this.w.run("compiler/fullCompile");
        console.log(compres);
        const sf=SourceFiles.add(compres);
        await sf.saveAs(this.getOutputFile());
        await this.exec(compres);
        return compres;
    }
    async partialCompile(f) {
        const files={};files[f.relPath(this.getDir())]=f.text();
        await this.init();
        const compres=await this.w.run("compiler/postChange",{files});
        console.log(compres);
        await this.exec(compres);
        return compres;
    }
    async run() {
        await this.init();
        await this.fullCompile();
        this.getDir().watch(async (e,f)=>{
            console.log(e,f.path());
            if (f.ext()===".tonyu") {
                const nsraw=await this.partialCompile(f);
                if (this.config.onCompiled) this.config.onCompiled(nsraw);

                //if (root.Tonyu.globals.$restart) root.Tonyu.globals.$restart();
            }
        });
    }
}
root.TonyuBuidlerClient=BuilderClient;
module.exports=BuilderClient;
