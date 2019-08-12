const Compiler=require("./src/lang/projectCompiler2");
const FS=require("./src/lib/FS");
const root=require("./src/lib/root");
const SourceFiles=require("./src/lang/SourceFiles");
const prjPath=process.argv[2];
const run=process.argv.indexOf("-r")>=0;
const daemon=process.argv.indexOf("-d")>=0;
require('source-map-support').install();
let prj;
if (FS.PathUtil.isAbsolute(prjPath)) {
    prj=FS.get(prjPath);
} else {
    prj=FS.get(process.cwd()).rel(prjPath);
}
//prj.recursive(f=>console.log(f.relPath(prj)));

const compiler=Compiler(prj);
let opt={destinations:{file:true,memory:true}};
if (daemon) opt={destinations:{memory:true}};
compiler.fullCompile(opt).then(async function (s) {
    if (run) {
        const script=compiler.getOutputFile();
        require(script.path());
    }
    if (daemon) {
        const tmpdir=compiler.getOutputFile().up();
        await s.exec();//{tmpdir});
        prj.watch(e=>console.log(e));
    }
    if (run||daemon) {
        let Tonyu=root.Tonyu;
        Tonyu.onRuntimeError=e=>console.error(e);
        let th=Tonyu.thread();
        let mainObj=new Tonyu.classes[compiler.getNamespace()].Main();
        th.apply(mainObj,"main");
        th.steps();
        /*th.then(r=>console.log("Done",r),e=>{
            //SourceFiles.decodeTrace(e);
            console.error(e);
        });*/
    }
},function (e) {
    console.error(e+"");
    console.error(e.stack);
});
