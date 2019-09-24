// Tonyu conflicts with TonyuRuntime(loaded by sys-related libs) in debug.html
//const Tonyu=require("../runtime/TonyuRuntime");
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
let Tonyu;
const Events={
    handlers:{},
    getHandler(t) {
        this.handlers[t]=this.handlers[t]||[];
        return this.handlers[t];
    },
    fire(type,evt) {
        try {
            this.getHandler(type).forEach(f=>f(evt));
        } catch(e) {
            if (!evt.noCatch) Tonyu.onRuntimeError(e);
        }
    },
    on(type,...args) {
        const f=args.pop();
        this.getHandler(type).push(f);
    }
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
    setErrorHandler: function () {
        Tonyu.onRuntimeError=async e=>{
            console.error(e);
            const stack=await StackDecoder.decode(e);
            const evt={error:e, message:e.message,stack,noCatch:true};
            Events.fire("runtimeError",evt);
        };
    },
    init: async function (prj,_Tonyu) {
        Tonyu=Tonyu||_Tonyu;
        this.setErrorHandler();
        Tonyu.globals.$currentProject=prj;
        Tonyu.currentProject=prj;
        Tonyu.globals.$debugger=root.Debugger;
        await prj.loadClasses();
        console.log("Loading classes COMPLETE",Tonyu.ID,Tonyu.classes);
    },
    exec: async function (srcraw) {
        await SourceFiles.add(srcraw).exec();
        Events.fire("classChanged");
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
    on:Events.on.bind(Events)
};
if (root.parent && root.parent.onTonyuDebuggerReady) {
    root.parent.onTonyuDebuggerReady(root.Debugger);
}
