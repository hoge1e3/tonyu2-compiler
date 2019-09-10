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
const handlers={runtimeError:[]};
Tonyu.onRuntimeError=async e=>{
    console.error(e);
    const stack=await StackDecoder.decode(e);
    const evt={error:e, message:e.message,stack};
    handlers.runtimeError.forEach(f=>f(evt));
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
    init: async function (prj) {
        Tonyu.globals.$currentProject=prj;
        Tonyu.currentProject=prj;
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
            Tonyu.onRuntimeError(e);
            //console.error(e);
            //StackDecoder.decode(e);
        }
    },
    on: function (type,...args) {
        handlers[type]=handlers[type]||[];
        const f=args.pop();
        handlers[type].push(f);
    }
};
if (root.parent && root.parent.onTonyuDebuggerReady) {
    root.parent.onTonyuDebuggerReady(root.Debugger);
}
