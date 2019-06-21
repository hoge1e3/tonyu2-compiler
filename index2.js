const Compiler=require("./src/lang/projectCompiler2");
const FS=require("./src/lib/FS");
const root=require("./src/lib/root");
const prjPath=process.argv[2];
const run=process.argv.indexOf("-r")>=0;
let prj;
if (FS.PathUtil.isAbsolute(prjPath)) {
    prj=FS.get(prjPath);
} else {
    prj=FS.get(process.cwd()).rel(prjPath);
}
//prj.recursive(f=>console.log(f.relPath(prj)));

const compiler=Compiler(prj);
compiler.fullCompile().then(function () {
    if (run) {
        const script=compiler.getOutputFile();
        require(script.path());
        let Tonyu=root.Tonyu;
        let th=Tonyu.thread();
        let mainObj=new Tonyu.classes[compiler.getNamespace()].Main();
        th.apply(mainObj,"main");
        th.steps();
    }
},function (e) {
    console.error(e+"");
    console.error(e.stack);
});
