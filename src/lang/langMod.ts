import { IProject, LangMod, TonyuProject } from "../project/projectTypes.js";

export function hasLangMod(p:IProject):p is TonyuProject {
    const a=p as any;
    return a?.getNamespace && a?.loadClasses;
}
export default {
    getNamespace(this: TonyuProject) {//override
        var opt=this.getOptions();
        if (opt.compiler && opt.compiler.namespace) return opt.compiler.namespace;
        throw new Error("Namespace is not set");
    },
    async loadDependingClasses(this: TonyuProject) {
        const myNsp=this.getNamespace();
        for (let p of this.getDependingProjects()) {
            if (!hasLangMod(p)) continue;
            if (p.getNamespace()===myNsp) continue;
            await p.loadClasses();
        }
    },
    getEXT() {return ".tonyu";},
    loadClasses(): Promise<void> {
        throw new Error("Stub");
    },
} as LangMod;
