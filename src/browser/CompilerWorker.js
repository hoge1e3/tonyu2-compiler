const Tonyu=require("../runtime/TonyuRuntime");
const Builder=require("../lang/Builder");//require("../lang/projectCompiler2");
const root=require("../lib/root");
const Worker=root.Worker;
const WS=require("../lib/WorkerServiceW");
const FS=require("../lib/FS");
const F=require("../project/ProjectFactory");
const CompiledProject=require("../project/CompiledProject");
const langMod=require("../lang/langMod");

let prj,builder;
WS.serv("compiler/init", params=>{
    const files=params.files;
    const ram=FS.get("/prj/");
    ram.importFromObject(files);
    console.log(ram.rel("options.json").text());
    prj=F.createDirBasedCore({dir:ram}).include(langMod);
    builder=new Builder(prj);
    Tonyu.ns2resource=params.ns2resource;
    F.addDependencyResolver(function (prj, spec) {
        console.log("RESOLV",spec,params.ns2resource);
        if (spec.namespace && params.ns2resource[spec.namespace]) {
            const r=params.ns2resource[spec.namespace];
            if (r.url) {
                return CompiledProject.create({namespace:spec.namespace,url:r.url});
            }
        }
    });
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
