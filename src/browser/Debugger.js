const Tonyu=require("../runtime/TonyuRuntime");
const SourceFiles=require("../lang/SourceFiles");
const StackDecoder=require("../lang/StackDecoder");
const root=require("../lib/root");
const FS=require("../lib/FS");
const F=require("../project/ProjectFactory");
F.langMod=require("../lang/langMod");
const CP=require("../project/CompiledProject");
/*F.addType("debugger",params=>{
    const res=F.createDirBasedCore({dir:params.dir});
    res.include(F.langMod);
    res.loadClasses=async function () {
        await this.loadDependingClasses();
        await root.Debugger.execFile(this.getOutputFile());
    };
    return res;
});
F.addDependencyResolver((prj, spec)=> {
    if (spec.dir && prj.resolve) {
        return F.create("debugger",{dir:prj.resolve(spec.dir)});
    }
});*/
//const prj=F.createDirBasedCore
Tonyu.onRuntimeError=e=>{
    StackDecoder.decode(e);
};
root.Debugger={
    ProjectFactory:F, FS,
    /*execFile: async function (outJS) {
        const map=outJS.sibling(outJS.name()+".map");
        const sf=SourceFiles.add({
            text:outJS.text(),
            sourceMap:map.exists() && map.text(),
        });
        await sf.exec();
    },*/
    init: async function (prjDir) {
        const prj=CP.create({dir:prjDir});
        await prj.loadClasses();
    },
    exec: async function (srcraw) {
        await SourceFiles.add(srcraw).exec();
    },
    create: function (className) {
        try {
            const klass=Tonyu.getClass(className);
            new klass();
        }catch(e) {
            console.error(e);
            StackDecoder.decode(e);
        }
    },
};
if (root.parent && root.parent.onTonyuDebuggerReady) {
    root.parent.onTonyuDebuggerReady(root.Debugger);
}
