//define(function (require,exports,module) {
// This factory will be widely used, even BitArrow.

import { SFile } from "@hoge1e3/sfile";
import { DependencySpec, ProjectOptions } from "../lang/CompilerTypes.js";
import {FS } from "./FS.js";
import * as path from "path";
import { DirBasedCore, DirBasedMod, DirBasedOptions, IProject, IProjectCore } from "./projectTypes.js";

//let Compiler, /*SourceFiles,*/sysMod,run2Mod;
//export type IProject=ProjectCore;
export type DependencyResolver=(prj:IProject, spec:DependencySpec)=>IProject|undefined;
export type ProjectFunc=(params:any)=>IProject;
const resolvers=[] as DependencyResolver[],types={} as Record<string, ProjectFunc>;
export const addDependencyResolver=(f:DependencyResolver)=>{
    //f: (prj, spec) => prj
    resolvers.push(f);
};
export const addType=(n:string,f:ProjectFunc)=>{
    types[n]=f;
};
export const fromDependencySpec=function (prj:IProject,spec: DependencySpec) {
    for (let f of resolvers) {
        const res=f(prj,spec);
        if (res) return res;
    }
    console.error("Invalid dep spec", spec);
    throw new Error("Invalid dep spec"+ spec);
    /* else if (typeof dprj=="object") {
        return this.create("compiled", {
            namespace:dprj.namespace,
            url: FS.expandPath(dprj.compiledURL)
        });
    }*/
};
export const create=function (type:string, params:any) {
    if (!types[type]) throw new Error(`Invalid type ${type}`);
    return types[type](params);
};
export class ProjectCore implements IProjectCore{
    getPublishedURL():string{
        throw new Error("Not implemented");
    }//override in BAProject
    getOptions() {return {} as ProjectOptions;}//stub
    getName():string {
        throw new Error("Not implemented");
    }
    getDependingProjects():IProject[] {
        var opt=this.getOptions();
        var dp=(opt.compiler && opt.compiler.dependingProjects) || [];
        return dp.map(dprj=>
            fromDependencySpec(this,dprj)
        );
    }
    include<T>(mod:T) {
        const res=this as (T & this);
        for (let k of Object.getOwnPropertyNames(mod)) {
            const amod=mod as any;
            if (typeof amod[k]==="function") (res as any)[k]=amod[k];
        }
        return res;
    }
    delegate(obj:any) {
        const res:any=this;
        if (obj.constructor.prototype) {
            const add=(k:string)=>{
                if (typeof obj[k]==="function") res[k]=(...args:any[])=>obj[k](...args);
            };
            for (let k of Object.getOwnPropertyNames(obj.constructor.prototype)) add(k);
        }
        return res;
    }
}
//ProjectCore.factory=exports;
export const createCore=()=>new ProjectCore();
const dirBasedMod:DirBasedMod={
    getDir() {return (this as DirBasedCore).dir;},
    getName() {
        return this.getDir().name().replace(/\/$/,"");
    },
    resolve(rdir:SFile|string){// not in compiledProject
        /*if (rdir instanceof Array) {
            var res=[];
            rdir.forEach(function (e) {
                res.push(this.resolve(e));
            });
            return res;
        }*/
        if (typeof rdir=="string") {
            if (path.isAbsolute(rdir) ) {
                return FS.get(path.join(rdir));
            } else {
                return this.getDir().rel(rdir);
            }
        }
        if (!SFile.is(rdir)) throw new Error("Cannot TPR.resolve: "+rdir);
        return rdir;
    },
    getOptions() {
        return this.getOptionsFile().obj() as ProjectOptions;
    },
    getOptionsFile() {// not in compiledProject
        var resFile=this.getDir().rel("options.json");
        return resFile;
    },
    setOptions(opt:ProjectOptions) {// not in compiledProject
        return this.getOptionsFile().obj(opt);
    },
    fixOptions(TPR:any,opt:any) {// required in BAProject
        if (!opt.compiler) opt.compiler={};
    },
    getOutputFile(lang:string="tonyu") {// not in compiledProject
        var opt=this.getOptions();
        var outF=this.resolve(opt.compiler.outputFile||"js/concat.js");
        if (outF.isDir()) {
            throw new Error("out: directory style not supported");
        }
        return outF;
    },
    removeOutputFile() {// not in compiledProject
        this.getOutputFile().rm();
    },
    path(){return this.getDir().path();},// not in compiledProject
    getEXT() {throw new Error("getEXT must be overriden.");},//stub
    sourceFiles() {
        const res={} as Record<string,SFile>;
        const ext=this.getEXT();
        this.getDir().recursive(collect);
        function collect(f:SFile) {
            if (f.endsWith(ext)) {
                var nb=f.truncExt(ext);
                res[nb]=f;
            }
        }
        return res;
    }
};
export const createDirBasedCore=function (params:DirBasedOptions) {
    const res=createCore() as DirBasedCore;
    res.dir=params.dir;
    if (!res.dir.exists()) throw new Error(res.dir.path()+" Does not exist.");
    return res.include(dirBasedMod) as DirBasedCore; 
};
