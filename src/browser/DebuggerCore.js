//define(function (require,exports,module) {
// module.exports:: DI_container -> Debugger
const {sourceFiles}=require("../lang/SourceFiles");
//const ProjectFactory=require("../project/ProjectFactory");
const CompiledProject=require("../project/CompiledProject");
const langMod=require("../lang/langMod");
const StackDecoder=require("../lang/StackDecoder");
const root=require("../lib/root");
module.exports=function ({
    //-- Bundled in BuilderClient4Sys
    /*SourceFiles,
    ProjectFactory:F,
    CompiledProject:CP,
    langMod,
    StackDecoder,*/
    //--
    Tonyu,
}) {//------
if (root.Debugger) return root.Debugger;
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
            if (!evt || !evt.noCatch) Tonyu.onRuntimeError(e);
        }
    },
    on(type,...args) {
        const f=args.pop();
        this.getHandler(type).push(f);
    }
};
root.Debugger={
    setErrorHandler: function () {
        Tonyu.onRuntimeError=async e=>{
            console.error(e);
            const stack=await StackDecoder.decode(e);
            const evt={error:e, message:e.message,stack,noCatch:true};
            Events.fire("runtimeError",evt);
        };
    },
    init: async function (prj) {
        //Tonyu=Tonyu||_Tonyu;
        this.setErrorHandler();
        Tonyu.globals.$currentProject=prj;
        Tonyu.currentProject=prj;
        Tonyu.globals.$debugger=root.Debugger;
        await prj.loadClasses();
        console.log("Loading classes COMPLETE",Tonyu.ID,Tonyu.classes);
    },
    exec: async function (srcraw) {
        await sourceFiles.add(srcraw).exec();
        Events.fire("classChanged");
    },
    create: function (className) {
        try {
            const klass=Tonyu.getClass(className);
            return new klass();
        }catch(e) {
            Tonyu.onRuntimeError(e);
            //console.error(e);
            //StackDecoder.decode(e);
        }
    },
    on:Events.on.bind(Events),
    fire:Events.fire.bind(Events)
};
/*try {
    //if (root.parent && root.parent.onTonyuDebuggerReady) <- fails CORS
    root.parent.onTonyuDebuggerReady(root.Debugger);
} catch(e) {
    console.log(e);
}*/
return root.Debugger;
};//--------
//});//--- end of define
