const root=require("../lib/root");
const Worker=root.Worker;
const WS=require("../lib/WorkerServiceB");
const SourceFiles=require("../lang/SourceFiles");
const FileMap=require("../lib/FileMap");
const NS2DepSpec=require("../project/NS2DepSpec");
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
    exportWithDependingFiles() {
        const ns2depspec=new NS2DepSpec(this.config.worker.ns2depspec);
        const exported=this.exportFiles();
        const deps=this.prj.getDependingProjects();//TODO recursive
        const outputDir=this.prj.getOutputFile().up();
        const newDep=[];
        for (let dep of deps) {
            const ns=dep.getNamespace();
            if (ns2depspec.has(ns)) {
                newDep.push({namespace:ns});
                continue;
            }
            const out=dep.getOutputFile();
            const dstOut=outputDir.rel(`${ns}.js`);
            const relOfOut=dstOut.relPath(this.prj.getDir());
            newDep.push({namespace:ns, outputFile: relOfOut});
            exported.data[relOfOut]=out.text();
        }
        const opt=JSON.parse(exported.data["options.json"]);
        opt.compiler.dependingProjects=newDep;
        exported.data["options.json"]=JSON.stringify(opt);
        console.log("opt changed", opt);
        return exported;
    }
    async init() {
        if (this.inited) return;
        const fileMap=this.fileMap;
        const localPrjDir=this.getDir();
        const ns2depspec=this.config.worker.ns2depspec;
        const files=this.exportWithDependingFiles();
        const {prjDir:remotePrjDir}=await this.w.run("compiler/init",{
            namespace:this.prj.getNamespace(),
            files, ns2depspec, locale: this.config.locale
        });
        fileMap.add({local:localPrjDir, remote: remotePrjDir});
        const deps=this.prj.getDependingProjects();//TODO recursive
        this.inited=true;
    }
    resetFiles() {
        if (!this.inited) return this.init();
        const files=this.exportWithDependingFiles();
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
    async partialCompile(f, {content, noexec}={}) {
        if (!this.partialCompilable) {
            return await this.clean();
        }
        try {
            if (typeof content!=="string") {
                content=f.text();
                if (noexec==null) noexec=false;
            } else {
                if (noexec==null) noexec=true;
            }
            const files={};files[f.relPath(this.getDir())]=content;
            await this.init();
            const compres=await this.w.run("compiler/postChange",{files});
            console.log(compres);
            if (!noexec) await this.exec(compres);
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
            try {
                e.src=FS.get(this.convertFromWorkerPath(e.src));
            } catch(ee) {
                console.log(ee);
            }
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
BuilderClient.NS2DepSpec=NS2DepSpec;
//root.TonyuBuilderClient=BuilderClient;
module.exports=BuilderClient;
