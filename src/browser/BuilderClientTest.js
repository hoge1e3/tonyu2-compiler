const root=require("../lib/root");
const BuilderClient=require("./BuilderClient");
const F=require("../project/ProjectFactory");
/*global window*/
window.initCmd=function (shui) {
    const UI=shui.UI;
    const sh=shui.sh;
    let iframe;
    sh.run=async bootClass=>{
        const prjDir=sh.cwd;//();//resolve(prjPath);
        const prj=F.createDirBasedCore({dir:prjDir});
        const config={
            worker:{
                url: "../CompilerWorker.js",
                ns2resource: {kernel: {url:"fsui/kernel.js"}}
            }
        };
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
