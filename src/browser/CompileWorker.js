const Compiler=require("../lang/projectCompiler2");
const root=require("../lib/root");
const Worker=root.Worker;
const WS=require("../lib/WorkerServiceW");
const FS=require("../lib/FS");

let compiler;
WS.serv("compiler/init", params=>{
    const files=params.files;
    const ram=FS.get("/prj/");
    compiler=Compiler(ram);
});
WS.serv("compiler/fullCompile", async params=>{
    const res=await compiler.fullCompile({destinations:{memory:1}});
    return res.export();
});
WS.serv("compiler/postChange", async params=>{
    const f=params.files;// "relpath"=>"content"
    let relPath;for(let n in f) {relPath=n;break;}
    compiler.dir.rel(relPath).text(f[relPath]);
    const ns=await compiler.postChange(f);
    return ns.export();
});
