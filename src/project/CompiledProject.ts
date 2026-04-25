
import * as F from "./ProjectFactory.js";
import {sourceFiles} from "../lang/SourceFiles.js";
import langMod from "../lang/langMod.js";
import { DirBasedCore, DirBasedMod, DirBasedOptions, DirBasedTonyuProject, IProject, LangMod, LoadContext, URLBasedTonyuProject } from "./projectTypes.js";
import { SFile } from "@hoge1e3/sfile";
import { DependencySpec } from "../lang/CompilerTypes.js";

F.addType("compiled",(params:any)=> {
    if (params.namespace && params.url) return urlBased(params);
    if (params.namespace && params.outputFile) return outputFileBased(params);
    if (params.dir) return dirBased(params);
    console.error("Invalid compiled project", params);
    throw new Error("Invalid compiled project");
});
function urlBased(params:any):URLBasedTonyuProject {
    const ns=params.namespace;
    const url=params.url;
    const res=F.createCore();
    return res.include(langMod).include({
        getNamespace:function () {return ns;},
        getOutputURL() {
            return url;
        },
        async loadClasses(this:URLBasedTonyuProject,/*ctx*/) {
            console.log("Loading compiled classes ns=",ns,"url=",url);
            await this.loadDependingClasses();
            const s=sourceFiles.add({url});
            await s.exec();
            console.log("Loaded compiled classes ns=",ns,"url=",url);
        },
    });
}
function dirBased(params: DirBasedOptions):DirBasedTonyuProject {
    const res=F.createDirBasedCore(params);
    return res.include(langMod).include({
        loadClasses: async function (this: DirBasedTonyuProject, /*ctx*/) {
            console.log("Loading compiled classes params=",params);
            await this.loadDependingClasses();
            const outJS=this.getOutputFile();
            const map=outJS.sibling(outJS.name()+".map");
            const sf=sourceFiles.add({
                //text:outJS.text(),
                file: outJS,
                sourceMap:map.exists()?map.text():undefined,
            });
            await sf.exec();
            console.log("Loaded compiled classes params=",params);
        }
    });
}
function outputFileBased(params:{
    namespace:string,
    outputFile:SFile,
}) {
    const ns=params.namespace;
    const outputFile=params.outputFile;
    const res=F.createCore();
    return res.include(langMod).include({
        getNamespace:function () {return ns;},
        getOutputFile() {
            return outputFile;
        },
        loadClasses: async function (this:LangMod, ctx:LoadContext) {
            console.log("Loading compiled classes ns=",ns,"outputFile=",outputFile);
            await this.loadDependingClasses();
            const outJS=outputFile;
            const map=outJS.sibling(outJS.name()+".map");
            const sf=sourceFiles.add({
                text:outJS.text(),
                sourceMap:map.exists()? map.text():undefined,
            });
            await sf.exec();
            console.log("Loaded compiled classes ns=",ns,"outputFile=",outputFile);
        },
    });
}
export function isDirBasedProject(prj:IProject):prj is IProject&DirBasedMod{
    return (prj as any).resolve;
} 

export const create=(params:any)=>F.create("compiled",params);
F.addDependencyResolver((prj:IProject, spec:DependencySpec)=> {
    if (spec.dir && isDirBasedProject(prj)) {
        return F.create("compiled",{dir:prj.resolve(spec.dir)});
    }
    if (spec.namespace && spec.url) {
        return F.create("compiled",spec);
    }
    if (spec.namespace && spec.outputFile && isDirBasedProject(prj)) {
        return F.create("compiled",{
            namespace: spec.namespace,
            outputFile: prj.resolve(spec.outputFile)
        });
    }
});
