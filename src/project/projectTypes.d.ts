import { SFile } from "@hoge1e3/sfile";
import { ProjectOptions } from "../lang/CompilerTypes";

export type IProject=IProjectCore;
export type DirBasedOptions={dir:SFile};
export interface IProjectCore {
    getPublishedURL(): string;
    getOptions(): ProjectOptions;
    getName(): string;
    getDependingProjects(): IProjectCore[];
    include<T>(mod: T): T & this;
    delegate(obj: any): any;
}
export interface DirBasedMod {
    getDir(): SFile;
    getName(): string;
    resolve(rdir: SFile | string): SFile;
    getOptions(): ProjectOptions;
    getOptionsFile(): SFile;
    setOptions(opt: ProjectOptions): SFile;
    fixOptions(TPR: any, opt: any): void;
    getOutputFile(lang?: string): SFile;
    removeOutputFile(): void;
    path(): string;
    getEXT(): string;
    sourceFiles(): Record<string, SFile>;
}
export type DirBasedCore = IProjectCore & DirBasedMod & {
    dir: SFile;
};
import { ProjectCore } from "../project/ProjectFactory";
export interface LoadContext {

}
export interface LangMod {
    getNamespace(): string;
    loadDependingClasses(ctx?:LoadContext): Promise<void>;
    getEXT(): string;
    loadClasses(): Promise<void>;
}
export type TonyuProject=ProjectCore&LangMod;
export type DirBasedTonyuProject=DirBasedMod&TonyuProject;
export type URLBasedMod={
    getOutputURL():string;
};
export type URLBasedCore = IProjectCore & URLBasedMod
export type URLBasedTonyuProject=URLBasedMod&TonyuProject;