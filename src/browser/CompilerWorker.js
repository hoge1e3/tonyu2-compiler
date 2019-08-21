const Tonyu=require("../runtime/TonyuLib");
const Compiler=require("../lang/projectCompiler2");
const root=require("../lib/root");
const Worker=root.Worker;
const WS=require("../lib/WorkerServiceW");
const FS=require("../lib/FS");

let compiler;
WS.serv("compiler/init", params=>{
    const files=params.files;
    const ram=FS.get("/prj/");
    ram.importFromObject(files);
    console.log(ram.rel("options.json").text());
    compiler=Compiler(ram);
    Tonyu.ns2resource=params.ns2resource;
});
WS.serv("compiler/fullCompile", async params=>{
    const res=await compiler.fullCompile({destinations:{memory:1}});
    return res.export();
});
WS.serv("compiler/postChange", async params=>{
    const fs=params.files;// "relpath"=>"content"
    let relPath;for(let n in fs) {relPath=n;break;}
    const f=compiler.dir.rel(relPath);
    f.text(fs[relPath]);
    const ns=await compiler.postChange(f);
    return ns.export();
});
WS.ready();
