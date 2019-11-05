/*global window*/
window.initCmd=function ({shui, BuilderClient}) {
    const root=window;
    const SourceFiles=BuilderClient.SourceFiles;
    const F=BuilderClient.ProjectFactory;
    const CP=BuilderClient.CompiledProject;
    const UI=shui.UI;
    const sh=shui.sh;
    let iframe, builder;
    sh.run=async bootClass=>{
        const prjDir=sh.cwd;//();//resolve(prjPath);
        const prj=CP.create({dir:prjDir});
        const config={
            worker:{
                url: "../BuilderWorker.js",
                ns2depspec: {kernel: {namespace:"kernel",url:"min-ui/kernel.js"}}
            }
        };
        F.addDependencyResolver((prj,spec)=>{
            if (spec.namespace==="kernel") {
                return CP.create({namespace:"kernel",url:"kernel.js"});
            }
        });
        builder=new BuilderClient(prj,config);
        await builder.fullCompile();

        iframe=UI(
            "iframe",{src:`debug.html?prj=${prjDir.path()}&boot=${bootClass}`,width:400,height:200}
        );
        root.onTonyuDebuggerReady=(d=>builder.setDebugger(d));
        UI("div",iframe).dialog();

        let queue=[];
        prjDir.watch((e,f)=>{
            console.log(e,f.path());
            if (f.ext()===".tonyu") {
                queue.push(f);
            }
        });
        setInterval(async ()=>{
            if (queue.length==0) return;
            let partial=true;
            const q=queue;queue=[];
            for (let f of q) {
                if (!f.exists()) partial=false;
            }
            if (!partial) {
                await sh.clean();
            } else {
                for (let f of q) {
                    await builder.partialCompile(f);
                }
            }
            const Remotonyu=iframe[0].contentWindow.Tonyu;
            if (Remotonyu.globals.$restart) Remotonyu.globals.$restart();
        },50);
        console.log("run DONE");
    };
    sh.clean=async ()=>{
        await builder.clean();
        const Remotonyu=iframe[0].contentWindow.Tonyu;
        if (Remotonyu.globals.$restart) Remotonyu.globals.$restart();
    };
    // Main -> Fuga, Base
    // rm Fuga
    // touch Fuga
    // change Main -> koware(Base.decls is null)
};
