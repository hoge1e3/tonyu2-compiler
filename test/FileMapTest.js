const FileMap=require("../src/lib/FileMap");
const f=new FileMap();
const A=require("../src/lib/assert");
f.add({local:"c:/hoge/fuga/", remote:"/var/hoge/piyo/"});
f.add({local:"d:/aaa/", remote:"/tmp/bbb/"});
A.eq( f.convert("c:/hoge/fuga/test.txt","local","remote") ,"/var/hoge/piyo/test.txt" );
A.eq( f.convert("/tmp/bbb/ccc/d.png","remote","local") , "d:/aaa/ccc/d.png" );
A.eq( f.convert("c:/hoge/fuga2/test.txt","local","remote") ,"c:/hoge/fuga2/test.txt" );
console.log("All test OK");
