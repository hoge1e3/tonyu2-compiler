const Tonyu=require("../runtime/TonyuRuntime");
const Builder=require("../lang/Builder");//require("../lang/projectCompiler2");
const root=require("../lib/root");
const Worker=root.Worker;
const WS=require("../lib/WorkerServiceW");
const FS=require("../lib/FS");
root.FS=FS;
const F=require("../project/ProjectFactory");
const CompiledProject=require("../project/CompiledProject");
const langMod=require("../lang/langMod");


let prj,builder;
const ns2depspec={};
const ram=FS.get("/prj/");
F.addDependencyResolver(function (prj, spec) {
    console.log("RESOLV",spec,ns2depspec);
    if (spec.namespace && ns2depspec[spec.namespace]) {
        return F.fromDependencySpec(prj,ns2depspec[spec.namespace]);
    }
});
WS.serv("compiler/init", params=>{
    Object.assign(ns2depspec,params.ns2depspec||{});
    const files=params.files;
    const prjDir=ram.rel((params.namespace||"user")+"/");
    prjDir.importFromObject(files);
    //console.log(ram.rel("options.json").text());
    prj=CompiledProject.create({dir:prjDir});
    builder=new Builder(prj);
});
WS.serv("compiler/addDependingProject", params=>{
    // params: namespace, files
    const files=params.files;
    const prjDir=ram.rel((params.namespace)+"/");
    prjDir.importFromObject(files);
    const dprj=CompiledProject.create({dir:prjDir});
    ns2depspec[params.namespace]={
        dir: prjDir.path()
    };
});
WS.serv("compiler/fullCompile", async params=>{
    const res=await builder.fullCompile({destinations:{memory:1}});
    return res.export();
});
WS.serv("compiler/postChange", async params=>{
    const fs=params.files;// "relpath"=>"content"
    let relPath;for(let n in fs) {relPath=n;break;}
    const f=prj.getDir().rel(relPath);
    f.text(fs[relPath]);
    const ns=await builder.postChange(f);
    return ns.export();
});
WS.ready();
