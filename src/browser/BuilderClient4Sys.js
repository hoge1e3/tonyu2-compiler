// Add extra libraries for Tonyu System IDE
//const root=require("../lib/root");
const BuilderClient=require("./BuilderClient");

const SourceFiles=require("../lang/SourceFiles");
const ProjectFactory=require("../project/ProjectFactory");
const CompiledProject=require("../project/CompiledProject");
const langMod=require("../lang/langMod");
const StackDecoder=require("../lang/StackDecoder");
const SourceMap=require("../lang/source-map");
BuilderClient.SourceFiles=SourceFiles;
BuilderClient.ProjectFactory=ProjectFactory;
BuilderClient.CompiledProject=CompiledProject;
BuilderClient.langMod=langMod;
BuilderClient.StackDecoder=StackDecoder;
BuilderClient.SourceMap=SourceMap;
module.exports=BuilderClient;
//root.TonyuBuilderClient=BuilderClient;
