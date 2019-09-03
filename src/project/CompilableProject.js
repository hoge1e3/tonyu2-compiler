const mod=require("../lang/CompilerMod");
const F=require("./ProjectFactory");

F.addType("compilable",function (params) {
    const res=F.createDirBasedCore(params);
    res.include(mod);
    return res;
});
exports.create=params=>F.create("compilable",params);
