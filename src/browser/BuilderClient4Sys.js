// Add extra libraries for Tonyu System IDE
const root=require("../lib/root");
const BuilderClient=require("./BuilderClient");
const SourceFiles=require("../lang/SourceFiles");
const ProjectFactory=require("../project/ProjectFactory");
const CompiledProject=require("../project/CompiledProject");
BuilderClient.SourceFiles=SourceFiles;
BuilderClient.ProjectFactory=ProjectFactory;
BuilderClient.CompiledProject=CompiledProject;
module.exports=CompiledProject;
root.TonyuBuidlerClient=BuilderClient;
