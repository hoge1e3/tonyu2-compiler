const Builder=require("./src/lang/Builder");//require("./src/lang/projectCompiler2");
const F=require("./src/project/ProjectFactory");
const langMod=require("./src/lang/langMod");
const FS=require("./src/lib/FS");
const root=require("./src/lib/root");
const {sourceFiles}=require("./src/lang/SourceFiles");
const compiledProject=require("./src/project/CompiledProject");
const prjPath=process.argv[2];
const run=process.argv.indexOf("-r")>=0;
const daemon=process.argv.indexOf("-d")>=0;
const rename={idx:process.argv.indexOf("-ren")};
const R=require("./src/lib/R");
//R.setLocale("ja");
if (rename.idx>=0) {
    rename.from=process.argv[rename.idx+1];
    rename.to=process.argv[rename.idx+2];
    rename.do=rename.from&&rename.to;
}
require('source-map-support').install();
const prjDir=(()=>{
    if (FS.PathUtil.isAbsolute(prjPath)) {
        return FS.get(prjPath);
    } else {
        return FS.get(process.cwd()).rel(prjPath);
    }
})();
F.addType("compilable",({dir})=>{
    return F.createDirBasedCore({dir}).include(langMod);
});
const prj=F.create("compilable",{dir:prjDir});  //F.createDirBasedCore({dir:prjDir}).include(langMod);
const builder=new Builder(prj);
if (rename.do) {
    console.log(rename);
    builder.renameClassName(rename.from, rename.to).then(
        r=>{
            console.log("Renamed", r.map(e=>e.path()));
            process.exit();
        },
        e=>{console.error(e);process.exit();},
    );
}
let opt={destinations:{file:true,memory:true}};
if (daemon) opt={destinations:{memory:true}};
builder.fullCompile(opt).then(async function (s) {
    if (run) {
        const script=prj.getOutputFile();
        require(script.path());
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
            if (root.Tonyu.globals.$restart) root.Tonyu.globals.$restart();

        });
    }
    if (run||daemon) {
        let Tonyu=root.Tonyu;
        Tonyu.onRuntimeError=e=>console.error(e);
        Tonyu.globals.$builder=builder;
        Tonyu.globals.$currentProject=prj;
        let th=Tonyu.thread();
        const popt=prj.getOptions();
        let MainClass;
        if (popt && popt.run && popt.run.bootClass) {
            MainClass=Tonyu.getClass(popt.run.bootClass);
        } else {
            MainClass=Tonyu.getClass(`${prj.getNamespace()}.Main`);
        }
        let mainObj=new MainClass();
        th.apply(mainObj,"main");
        function stepsLoop() {
            th.steps();
            if (th.preempted) {
                console.log("PREEMPTED");
                setTimeout(stepsLoop,0);
            }    
        }
        stepsLoop();
        /*th.then(r=>console.log("Done",r),e=>{
            //sourceFiles.decodeTrace(e);
            console.error(e);
        });*/
    }
},function (e) {
    console.error(e+"");
    console.error(e.stack);
});
