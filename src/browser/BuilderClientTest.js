const root=require("../lib/root");
const BuilderClient=require("./BuilderClient");
const SourceFiles=require("../lang/SourceFiles");
const F=require("../project/ProjectFactory");
const CP=require("../project/CompiledProject");
/*F.addType("compiled",params=>{
    const res=F.createDirBasedCore({dir:params.dir});
    res.include(F.langMod);
    res.loadClasses=async function () {
        await this.loadDependingClasses();
        await SourceFiles.add({text:this.getOutputFile().text()}).exec();
    };
    return res;
});
F.addDependencyResolver((prj, spec)=> {
    if (spec.dir && prj.resolve) {
        return F.create("compiled",{dir:prj.resolve(spec.dir)});
    }
});*/
/*global window*/
window.initCmd=function (shui) {
    const UI=shui.UI;
    const sh=shui.sh;
    let iframe;
    sh.run=async bootClass=>{
        const prjDir=sh.cwd;//();//resolve(prjPath);
        const prj=CP.create({dir:prjDir});
        const config={
            worker:{
                url: "../BuilderWorker.js",
                ns2depspec: {kernel: {namespace:"kernel",url:"fsui/kernel.js"}}
            }
        };
        F.addDependencyResolver((prj,spec)=>{
            if (spec.namespace==="kernel") {
                return CP.create({namespace:"kernel",url:"kernel.js"});
            }
        });
        const builder=new BuilderClient(prj,config);
        await builder.fullCompile();

        iframe=UI(
            "iframe",{src:`debug.html?prj=${prjDir.path()}&boot=${bootClass}`,width:400,height:200}
        );
        root.onTonyuDebuggerReady=(d=>builder.setDebugger(d));
        sh.echo(iframe);

        prjDir.watch(async (e,f)=>{
            console.log(e,f.path());
            if (f.ext()===".tonyu") {
                const nsraw=await builder.partialCompile(f);

                const Remotonyu=iframe[0].contentWindow.Tonyu;
                if (Remotonyu.globals.$restart) Remotonyu.globals.$restart();
            }
        });
        console.log("run DONE");
    };
};
