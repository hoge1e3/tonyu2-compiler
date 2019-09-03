const root=require("../lib/root");
const BuilderClient=require("./BuilderClient");
const F=require("../project/ProjectFactory");
/*global window*/
window.initCmd=function (shui) {
    const UI=shui.UI;
    const sh=shui.sh;
    let iframe;
    sh.run=async prjPath=>{
        const prjDir=sh.resolve(prjPath);
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
            "iframe",{src:`run.html?prj=${prjDir.path()}`,width:400,height:200}
        );
        sh.echo(iframe);

        prjDir.watch(async (e,f)=>{
            builder.setExecTarget(iframe[0].contentWindow.Project);
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
