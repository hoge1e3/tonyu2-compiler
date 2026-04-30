import Builder from "./lang/Builder.js";
import * as F from "./project/ProjectFactory.js";
import langMod from "./lang/langMod.js";
import * as compiledProject from "./project/CompiledProject.js";
import Tonyu from "./runtime/TonyuRuntime.js";
//import * as FS from "./lib/FS";
//import * as fs from "node:fs";
import * as path from "node:path";
import {FS} from "./project/FS.js";
//import * as SourceFiles from "./lang/SourceFiles";
//import NS2DepSpec from "./project/NS2DepSpec";
import type { DirBasedTonyuProject } from "./project/projectTypes";
//import * as R from "./lib/R";
//const {sourceFiles} = SourceFiles;
const prjPath=process.argv[2];
const run=process.argv.indexOf("-r")>=0;
const daemon=process.argv.indexOf("-d")>=0;
const rename={idx:process.argv.indexOf("-ren")} as {
    idx:number,
    do?:boolean,
    from?:string,
    to?:string,
};
Tonyu.loadEvent=(e)=>{
    console.log("loadEvent",e);
};
//R.setLocale("ja");
if (rename.idx>=0) {
    rename.from=process.argv[rename.idx+1];
    rename.to=process.argv[rename.idx+2];
    rename.do=!!(rename.from&&rename.to);
}
if (typeof require==="function") require('source-map-support').install();
const prjDir=(()=>{
    if (path.isAbsolute(prjPath)) {
        return FS.get(prjPath);
    } else {
        return FS.get(process.cwd()).rel(prjPath);
    }
})();
F.addType("compilable",({dir})=>{
    return F.createDirBasedCore({dir}).include(langMod);
});
/*const ns2depspec=new NS2DepSpec([
    {namespace:"kernel", dir: "test/fixure/Kernel_offscr/"},
]);*/
F.addDependencyResolver((prj,spec)=>{
    if (spec && spec.namespace==="kernel") {
        return compiledProject.create({
            dir:FS.get(process.cwd()).rel("test/fixture/Kernel_offscr/")
        });
    }
    /*const s=(ns2depspec.has(spec.namespace));
    if (s) {
        return F.fromDependencySpec(prj, s);
    }*/
});
const prj=F.create("compilable",{dir:prjDir}) as DirBasedTonyuProject;  //F.createDirBasedCore({dir:prjDir}).include(langMod);
const builder=new Builder(prj);
if (rename.do) {
    console.log(rename);
    builder.renameClassName(rename.from!, rename.to!).then(
        r=>{
            console.log("Renamed", r.map(e=>e.path()));
            process.exit();
        },
        e=>{console.error(e);process.exit();},
    );
}
let opt={destinations:{file:true,memory:true}};
if (daemon) opt={destinations:{file:false,memory:true}};
builder.fullCompile(opt).then(async function (s) {
    if (run) {
        const script=prj.getOutputFile();
        await import("file://"+script.path());
    }
    if (daemon) {
        const tmpdir=prj.getOutputFile().up();
        await s.exec();//{tmpdir});
        let lastRefreshed=new Date().getTime();
        prjDir.watch(async (e,f)=>{
            console.log(e,f.path());
            const now=new Date().getTime();
            if (now-lastRefreshed<500) return;
            lastRefreshed=new Date().getTime();
            const ns=await builder.postChange(f);
            //console.log(ns);
            await ns.exec();
            if ((globalThis as any).Tonyu.globals.$restart) (globalThis as any).Tonyu.globals.$restart();

        });
    }
    if (run||daemon) {
        //let Tonyu=root.Tonyu;
        Tonyu.onRuntimeError=(e)=>console.error(e);
        Tonyu.globals.$builder=builder;
        Tonyu.globals.$currentProject=prj;
        let th=Tonyu.thread();
        const popt=prj.getOptions();
        let MainClass,useBoot=false;
        if (popt && popt.run && popt.run.bootClass) {
            MainClass=Tonyu.getClass(popt.run.bootClass);
            useBoot=true;
        } else {
            MainClass=Tonyu.getClass(`${prj.getNamespace()}.Main`);
        }
        if (!MainClass) throw new Error(`Main Class not found`);
        let mainObj=new MainClass();
        th.apply(mainObj,"main");
        function stepsLoop() {
            th.steps();
            if (th.preempted) {
                console.log("PREEMPTED");
                setTimeout(stepsLoop,0);
            }    
        }
        if (!useBoot) stepsLoop();
        /*th.then(r=>console.log("Done",r),e=>{
            //sourceFiles.decodeTrace(e);
            console.error(e);
        });*/
    }
},function (e) {
    console.error(e+"");
    console.error(e.stack);
});
