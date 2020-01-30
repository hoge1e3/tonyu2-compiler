const root=require("../lib/root");
const Worker=root.Worker;
const WS=require("../lib/WorkerServiceB");
const SourceFiles=require("../lang/SourceFiles");
const FileMap=require("../lib/FileMap");
//const FS=(root.parent && root.parent.FS) || root.FS;
const FS=root.FS;// TODO

class BuilderClient {
    constructor(prj,config) {// dirBased
        this.prj=prj;
        let url=config.worker.url;
        if (!url.match(/^blob/)) url+="?"+Math.random();
        this.w=new WS.Wrapper(new Worker(url));
        this.config=config||{};
        this.fileMap=new FileMap();
    }
    getOutputFile(...f) {return this.prj.getOutputFile(...f);}
    getDir(){return this.prj.getDir();}
    setDebugger(t) {this.debugger=t;}// t:iframe.contentWindow.Debugger
    exec(srcraw) {
        if (this.debugger) return this.debugger.exec(srcraw);
    }
    convertFromWorkerPath(path) {
        return this.fileMap.convert(path,"remote","local");
    }
    exportFiles() {
        const localPrjDir=this.getDir();
        const n2files=this.prj.sourceFiles();
        const exported={base:localPrjDir.path(),data:{}};
        for (var k in n2files) {
            const f=n2files[k];
            exported.data[f.relPath(localPrjDir)]=f.text();
        }
        const opt=this.prj.getOptionsFile();
        exported.data[opt.relPath(localPrjDir)]=opt.text();
        console.log("exported",exported);
        return exported;
    }
    async init() {
        if (this.inited) return;
        const fileMap=this.fileMap;
        const localPrjDir=this.getDir();
        const files=this.exportFiles();
        const ns2depspec=this.config.worker.ns2depspec;
        const {prjDir:remotePrjDir}=await this.w.run("compiler/init",{
            namespace:this.prj.getNamespace(),
            files, ns2depspec, locale: this.config.locale
        });
        fileMap.add({local:localPrjDir, remote: remotePrjDir});
        const deps=this.prj.getDependingProjects();//TODO recursive
        for (let dep of deps) {
            const ns=dep.getNamespace();
            if (!ns2depspec[ns]) {
                const localPrjDir=dep.getDir();
                const files=localPrjDir.exportAsObject({
                    excludesF: f=>f.ext()!==".tonyu" && f.name()!=="options.json"
                });
                const {prjDir:remotePrjDir}=await this.w.run("compiler/addDependingProject",{
                    namespace:ns, files
                });
                fileMap.add({local:localPrjDir, remote: remotePrjDir});
            }
        }
        this.inited=true;
    }
    resetFiles() {
        if (!this.inited) return this.init();
        const files=this.exportFiles();
        return this.w.run("compiler/resetFiles",{
            //namespace:this.prj.getNamespace(),
            files
        });
    }
    async parse(f,content=false){// use content when check not-yet-saved file
        if (content===false) content=f.text();
        await this.init();
        const filePath=f.relPath(this.getDir());
        const files={};
        files[filePath]=content;
        return await this.w.run("compiler/parse", {files});
    }
    async clean() {// Stands for eclipse "Clean" menu.
        await this.resetFiles();
        return await this.fullCompile();
    }
    async fullCompile() {
        try {
            this.partialCompilable=false;
            await this.init();
            const compres=await this.w.run("compiler/fullCompile");
            console.log(compres);
            const sf=SourceFiles.add(compres);
            await sf.saveAs(this.getOutputFile());
            await this.exec(compres);
            this.partialCompilable=true;
            return compres;
        } catch(e) {
            throw this.convertError(e);
        }
    }
    async partialCompile(f) {
        if (!this.partialCompilable) {
            return await this.clean();
        }
        try {
            const files={};files[f.relPath(this.getDir())]=f.text();
            await this.init();
            const compres=await this.w.run("compiler/postChange",{files});
            console.log(compres);
            await this.exec(compres);
            return compres;
        } catch(e) {
            throw this.convertError(e);
        }
    }
    async renameClassName(from,to) {
        try {
            await this.init();
            let changed=await this.w.run("compiler/renameClassName",{from,to});
            for (let n in changed) {
                let val=changed[n];
                n=this.convertFromWorkerPath(n);
                if (val==null) {
                    FS.get(n).rm();
                } else {
                    FS.get(n).text(val);
                }
            }
            return changed;
        } catch(e) {
            throw this.convertError(e);
        }
    }
    convertError(e) {
        if (e.isTError) {
            e.src=FS.get(this.convertFromWorkerPath(e.src));
        }
        return e;
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
BuilderClient.SourceFiles=SourceFiles;
//root.TonyuBuilderClient=BuilderClient;
module.exports=BuilderClient;
