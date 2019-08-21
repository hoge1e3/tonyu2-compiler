const root=require("../lib/root");
root.SourceFiles=require("../lang/SourceFiles");
const Tonyu=root.Tonyu;
Tonyu.onRuntimeError=e=>{
    console.error(e);
    root.SourceFiles.decodeTrace(e);

};
