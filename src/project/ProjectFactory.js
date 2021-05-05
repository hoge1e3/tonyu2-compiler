//define(function (require,exports,module) {
    // This factory will be widely used, even BitArrow.


    let Compiler, SourceFiles,sysMod,run2Mod;
    const  resolvers=[],types={};
    exports.addDependencyResolver=(f)=>{
        //f: (prj, spec) => prj
        resolvers.push(f);
    };
    exports.addType=(n,f)=>{
        types[n]=f;
    };
    exports.fromDependencySpec=function (prj,spec) {
        for (let f of resolvers) {
            const res=f(prj,spec);
            if (res) return res;
        }
        console.error("Invalid dep spec", spec);
        throw new Error("Invalid dep spec", spec);
        /* else if (typeof dprj=="object") {
            return this.create("compiled", {
                namespace:dprj.namespace,
                url: FS.expandPath(dprj.compiledURL)
            });
        }*/
    };
    exports.create=function (type,params) {
        if (!types[type]) throw new Error(`Invalid type ${type}`);
        return types[type](params);
    };
    class ProjectCore {
        getPublishedURL(){}//override in BAProject
        getOptions(opt) {return {};}//stub
        getName() {
            return this.dir.name().replace(/\/$/,"");
        }
        getDependingProjects() {
            var opt=this.getOptions();
            var dp=(opt.compiler && opt.compiler.dependingProjects) || [];
            return dp.map(dprj=>
                ProjectCore.factory.fromDependencySpec(this,dprj)
            );
        }
        include(mod) {
            for (let k of Object.getOwnPropertyNames(mod)) {
                if (typeof mod[k]==="function") this[k]=mod[k];
            }
            return this;
        }
        delegate(obj) {
            if (obj.constructor.prototype) {
                const add=k=>{
                    if (typeof obj[k]==="function") this[k]=(...args)=>obj[k](...args);
                };
                for (let k of Object.getOwnPropertyNames(obj.constructor.prototype)) add(k);
            }
            return this;
        }
    }
    ProjectCore.factory=exports;
    exports.createCore=()=>new ProjectCore();
    const dirBasedMod={
        getDir() {return this.dir;},
        resolve(rdir){// not in compiledProject
            if (rdir instanceof Array) {
                var res=[];
                rdir.forEach(function (e) {
                    res.push(this.resolve(e));
                });
                return res;
            }
            if (typeof rdir=="string") {
                /*global FS*/ //TODO
                if (typeof FS!=="undefined") {
                    return FS.resolve(rdir, this.getDir().path());
                } else {
                    return this.getDir().rel(rdir);
                }
            }
            if (!rdir || !rdir.isDir) throw new Error("Cannot TPR.resolve: "+rdir);
            return rdir;
        },
        getOptions(opt) {
            return this.getOptionsFile().obj();
        },
        getOptionsFile() {// not in compiledProject
            var resFile=this.dir.rel("options.json");
            return resFile;
        },
        setOptions(opt) {// not in compiledProject
            return this.getOptionsFile().obj(opt);
        },
        fixOptions(TPR,opt) {// required in BAProject
            if (!opt.compiler) opt.compiler={};
        },
        getOutputFile(lang) {// not in compiledProject
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
        path(){return this.dir.path();},// not in compiledProject
        getEXT() {throw new Error("getEXT must be overriden.");},//stub
        sourceFiles() {
            const res={};
            const ext=this.getEXT();
    		this.dir.recursive(collect);
    		function collect(f) {
    			if (f.endsWith(ext)) {
    				var nb=f.truncExt(ext);
    				res[nb]=f;
    			}
    		}
    		return res;
        }
    };
    exports.createDirBasedCore=function (params) {
        const res=this.createCore();
        res.dir=params.dir;
        if (!res.dir.exists()) throw new Error(res.dir.path()+" Does not exist.");
        return res.include(dirBasedMod);
    };
//});/*--end of define--*/
