const Tonyu=require("../runtime/TonyuLib");
const SourceFiles=require("../lang/SourceFiles");
const StackDecoder=require("../lang/StackDecoder");
const root=require("../lib/root");
const FS=require("../lib/FS");
//const F=require("../project/ProjectFactory");
const prjDir=FS.get(getQueryString("prj"));
//const prj=F.createDirBasedCore
Tonyu.onRuntimeError=e=>{
    StackDecoder.decode(e);
};
const outJS=prjDir.rel("js/concat.js");
SourceFiles.add({
    text:outJS.text(),
    sourceMap:outJS.sibling(outJS.name()+".map").text(),
}).exec();
root.Project={
    exec: async function (srcraw) {
        await SourceFiles.add(srcraw).exec();
    },
    create: function (className) {
        try {
            const klass=Tonyu.getClass(className);
            new klass();
        }catch(e) {
            console.error(e);
            StackDecoder.decode(e);
        }
    }
};
const boot=getQueryString("boot");
if (boot) root.Project.create(boot);
function getQueryString(key, default_)
{
   if (default_==null) default_="";
   key = key.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");
   var regex = new RegExp("[\\?&]"+key+"=([^&#]*)");
   var qs = regex.exec(root.location.href);
   if(qs == null)
    return default_;
   else
    return decodeURLComponentEx(qs[1]);
}
function decodeURLComponentEx(s){
    return decodeURIComponent(s.replace(/\+/g, '%20'));
}
