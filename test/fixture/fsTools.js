// This is kowareta! because r.js does not generate module name:
//   define("FSLib",[], function () { ...
//(function (global) {
//var useGlobal=(typeof global.define!="function");
//var define=(useGlobal ? define=function(_,f){f();} : global.define);
define([],function () {
    var define,requirejs;
	var R={};
	var REQJS="REQJS_";
	var reqjsSeq=0;
	R.def=function (name, reqs,func) {
		var m=R.getModuleInfo(name);
		if (typeof reqs=="function") {
		    func=reqs;
		    reqs=R.reqsFromFunc(func);
    		R.setReqs( m, reqs);
    		m.func=function () {
    		    var module={exports:{}};
    			var res=func(R.doLoad,module,module.exports);
    			return res || module.exports;
    		};
		} else {
    		R.setReqs( m, reqs);
    		m.func=function () {
    			return func.apply(this, R.getObjs(reqs));
    		};
		}
		R.loadIfAvailable(m);
	};
	define=function (name,reqs,func) {
		R.def(name, reqs,func);
	};
	define.amd={};
	requirejs=function (reqs,func) {
		R.def(REQJS+(reqjsSeq++),reqs,func);
	};
	R.setReqs=function (m, reqs) {
		reqs.forEach(function (req) {
			var reqm=R.getModuleInfo(req);
			if (!reqm.loaded) {
				m.reqs[req]=reqm;
				reqm.revReqs[m.name]=m;
			}
		});
	};
	R.getModuleInfo=function (name) {
		var ms=R.modules;
		return ms[name]=ms[name]||{name:name,reqs:{},revReqs:{}};
	};
	R.doLoad=function (name) {
		var m=R.getModuleInfo(name);
		if (m.loaded) return m.obj;
		m.loaded=true;
		var res=m.func();
	    if ( res==null && !name.match(/^REQJS_/)) console.log("Warning: No obj for "+name);
		m.obj=res;
		for (var i in m.revReqs) {
			R.notifyLoaded(m.revReqs[i], m.name);
		}
		return res;
	};
	R.notifyLoaded=function (dependingMod, loadedModuleName) {
	    // depengindMod depends on loadedModule
		delete dependingMod.reqs[loadedModuleName];
		R.loadIfAvailable(dependingMod);
	};
	R.loadIfAvailable=function (m) {
		for (var i in m.reqs) {
			return;
		}
		R.doLoad(m.name);
	};
	R.getObjs=function (ary) {
		var res=[];
		ary.forEach(function (n) {
			var cur=R.doLoad(n);
			res.push(cur);
		});
		return res;
	};
	R.reqsFromFunc=function (f) {
	    var str=f+"";
	    var res=[];
	    str.replace(/require\s*\(\s*["']([^"']+)["']\s*\)/g,function (m,a) {
	       res.push(a);
	    });
	    return res;
	};
	R.modules={};
	//requireSimulator=R;
//----------
/*global window,self,global*/
define('root',[],function (){
    if (typeof window!=="undefined") return window;
    if (typeof self!=="undefined") return self;
    if (typeof global!=="undefined") return global;
    return (function (){return this;})();
});

/*global define*/
define('FSFromRoot',["root"],function (root) {
    return root.FS;
});

define('assert',[],function () {
    var Assertion=function(failMesg) {
        this.failMesg=flatten(failMesg || "Assertion failed: ");
    };
    var $a;
    Assertion.prototype={
        _regedType:{},
        registerType: function (name,t) {
            this._regedType[name]=t;
        },
        MODE_STRICT:"strict",
        MODE_DEFENSIVE:"defensive",
        MODE_BOOL:"bool",
        fail:function () {
            var a=$a(arguments);
            var value=a.shift();
            a=flatten(a);
            a=this.failMesg.concat(value).concat(a);//.concat(["(mode:",this._mode,")"]);
            console.log.apply(console,a);
            if (this.isDefensive()) return value;
            if (this.isBool()) return false;
            throw new Error(a.join(" "));
        },
        subAssertion: function () {
            var a=$a(arguments);
            a=flatten(a);
            return new Assertion(this.failMesg.concat(a));
        },
        assert: function (t,failMesg) {
            if (!t) return this.fail(t,failMesg);
            return t;
        },
        eq: function (a,b) {
            if (a!==b) return this.fail(a,"!==",b);
            return this.isBool()?true:a;
        },
        ne: function (a,b) {
            if (a===b) return this.fail(a,"===",b);
            return this.isBool()?true:a;
        },
        isset: function (a, n) {
            if (a==null) return this.fail(a, (n||"")+" is null/undef");
            return this.isBool()?true:a;
        },
        is: function (value,type) {
            var t=type,v=value;
            if (t==null) {
                return this.fail(value, "assert.is: type must be set");
                // return t; Why!!!!???? because is(args,[String,Number])
            }
            if (t._assert_func) {
                t._assert_func.apply(this,[v]);
                return this.isBool()?true:value;
            }
            this.assert(value!=null,[value, "should be ",t]);
            if (t instanceof Array || (typeof global=="object" && typeof global.Array=="function" && t instanceof global.Array) ) {
                if (!value || typeof value.length!="number") {
                    return this.fail(value, "should be array:");
                }
                var self=this;
                for (var i=0 ;i<t.length; i++) {
                    var na=self.subAssertion("failed at ",value,"[",i,"]: ");
                    if (t[i]==null) {
                        console.log("WOW!7", v[i],t[i]);
                    }
                    na.is(v[i],t[i]);
                }
                return this.isBool()?true:value;
            }
            if (t===String || t=="string") {
                this.assert(typeof(v)=="string",[v,"should be a string "]);
                return this.isBool()?true:value;
            }
            if (t===Number || t=="number") {
                this.assert(typeof(v)=="number",[v,"should be a number"]);
                return this.isBool()?true:value;
            }
            if (t===Boolean || t=="boolean") {
                this.assert(typeof(v)=="boolean",[v,"should be a boolean"]);
                return this.isBool()?true:value;
            }
            if (t instanceof RegExp || (typeof global=="object" && typeof global.RegExp=="function" && t instanceof global.RegExp)) {
                this.is(v,String);
                this.assert(t.exec(v),[v,"does not match to",t]);
                return this.isBool()?true:value;
            }
            if (t===Function) {
                this.assert(typeof v=="function",[v,"should be a function"]);
                return this.isBool()?true:value;
            }
            if (typeof t=="function") {
                this.assert((v instanceof t),[v, "should be ",t]);
                return this.isBool()?true:value;
            }
            if (t && typeof t=="object") {
                for (var k in t) {
                    var na=this.subAssertion("failed at ",value,".",k,":");
                    na.is(value[k],t[k]);
                }
                return this.isBool()?true:value;
            }
            if (typeof t=="string") {
                var ty=this._regedType[t];
                if (ty) return this.is(value,ty);
                //console.log("assertion Warning:","unregistered type:", t, "value:",value);
                return this.isBool()?true:value;
            }
            return this.fail(value, "Invaild type: ",t);
        },
        ensureError: function (action, err) {
            try {
                action();
            } catch(e) {
                if(typeof err=="string") {
                    assert(e+""===err,action+" thrown an error "+e+" but expected:"+err);
                }
                console.log("Error thrown successfully: ",e.message);
                return;
            }
            this.fail(action,"should throw an error",err);
        },
        setMode:function (mode) {
            this._mode=mode;
        },
        isDefensive:function () {
            return this._mode===this.MODE_DEFENSIVE;
        },
        isBool:function () {
            return this._mode===this.MODE_BOOL;
        },
        isStrict:function () {
            return !this.isDefensive() && !this.isBool();
        }
    };
    $a=function (args) {
        var a=[];
        for (var i=0; i<args.length ;i++) a.push(args[i]);
        return a;
    };
    var top=new Assertion();
    var assert=function () {
        try {
            return top.assert.apply(top,arguments);
        } catch(e) {
            throw new Error(e.stack);
        }
    };
    ["setMode","isDefensive","is","isset","ne","eq","ensureError"].forEach(function (m) {
        assert[m]=function () {
            try {
                return top[m].apply(top,arguments);
            } catch(e) {
                console.log(e.stack);
                //if (top.isDefensive()) return arguments[0];
                //if (top.isBool()) return false;
                throw new Error(e.message);
            }
        };
    });
    assert.fail=top.fail.bind(top);
    assert.MODE_STRICT=top.MODE_STRICT;
    assert.MODE_DEFENSIVE=top.MODE_DEFENSIVE;
    assert.MODE_BOOL=top.MODE_BOOL;
    assert.f=function (f) {
        return {
            _assert_func: f
        };
    };
    assert.opt=function (t) {
        return assert.f(function (v) {
            return v==null || v instanceof t;
        });
    };
    assert.and=function () {
        var types=$a(arguments);
        assert(types instanceof Array);
        return assert.f(function (value) {
            var t=this;
            for (var i=0; i<types.length; i++) {
                t.is(value,types[i]);
            }
        });
    };
    function flatten(a) {
        if (a instanceof Array) {
            var res=[];
            a.forEach(function (e) {
                res=res.concat(flatten(e));
            });
            return res;
        }
        return [a];
    }
    function isArg(a) {
        return "length" in a && "caller" in a && "callee" in a;
    };
    return assert;
});

/*global process, require*/
define('Shell',["FSFromRoot","assert","root"],
        function (FS,assert,root) {
    var Shell={};
    var sh;
    var PathUtil=assert(FS.PathUtil);
    Shell.newCommand=function (name,func) {
        this[name]=func;
    };
    Shell.cd=function (dir) {
        Shell.cwd=resolve(dir,true);
        return Shell.pwd();
    };
    Shell.vars=Object.create(FS.getEnv());
    Shell.mount=function (options, path) {
        //var r=resolve(path);
        if (!options || !options.t) {
            var fst=[];
            for (var k in FS.getRootFS().availFSTypes()) {
                fst.push(k);
            }
            sh.err("-t=("+fst.join("|")+") should be specified.");
            return;
        }
        FS.mount(path,options.t, options);
    };
    Shell.unmount=function (path) {
        FS.unmount(path);
    };
    Shell.fstab=function () {
        var rfs=FS.getRootFS();
        var t=rfs.fstab();
        var sh=this;
        //sh.echo(rfs.fstype()+"\t"+"<Root>");
        t.forEach(function (fs) {
            sh.echo(fs.fstype()+"\t"+(fs.mountPoint||"<Default>"));
        });
    };
    Shell.resolve=resolve;
    function resolve(v, mustExist) {
        var r=resolve2(v);
        if (!FS.SFile.is(r)) {console.log(r," is not file");}
        if (mustExist && !r.exists()) throw new Error(r+": no such file or directory");
        return r;
    }
    function resolve2(v) {
        if (typeof v!="string") return v;
        var c=Shell.cwd;
        if (PathUtil.isAbsolutePath(v)) return FS.resolve(v,c);
        return c.rel(v);
    }
    Shell.pwd=function () {
        return Shell.cwd+"";
    };
    Shell.ls=function (dir){
    	if (!dir) dir=Shell.cwd;
    	else dir=resolve(dir, true);
        return dir.ls();
    };
    Shell.cp=function (from ,to ,options) {
        if (!options) options={};
        if (options.v) {
            Shell.echo("cp", from ,to);
            options.echo=Shell.echo.bind(Shell);
        }
        var f=resolve(from, true);
        var t=resolve(to);
        return f.copyTo(t,options);
    };
    Shell.ln=function (to , from ,options) {
        var f=resolve(from);
        var t=resolve(to, true);
        if (f.isDir() && f.exists()) {
            f=f.rel(t.name());
        }
        if (f.exists()) {
            throw new Error(f+" exists");
        }
        return f.link(t,options);
    };
    Shell.rm=function (file, options) {
        if (!options) options={};
        if (options.notrash) {
            file=resolve(file, false);
            file.removeWithoutTrash();
            return 1;
        }
        file=resolve(file, true);
        if (file.isDir() && options.r) {
            var dir=file;
            var sum=0;
            dir.each(function (f) {
                if (f.exists()) {
                    sum+=Shell.rm(f, options);
                }
            });
            dir.rm();
            return sum+1;
        } else {
            file.rm();
            return 1;
        }
    };
    Shell.mkdir=function (file/*,options*/) {
        file=resolve(file, false);
        if (file.exists()) throw new Error(file+" : exists");
        return file.mkdir();

    };
    Shell.cat=function (file/*,options*/) {
        file=resolve(file, true);
        return Shell.echo(file.getContent(function (c) {
            if (file.isText()) {
                return c.toPlainText();
            } else {
                return c.toURL();
            }
        }));
    };
    Shell.resolve=function (file) {
        if (!file) file=".";
        file=resolve(file);
        return file;
    };
    Shell.grep=function (pattern, file, options) {
        file=resolve(file, true);
        if (!options) options={};
        if (!options.res) options.res=[];
        if (file.isDir()) {
            file.each(function (e) {
                Shell.grep(pattern, e, options);
            });
        } else {
            if (typeof pattern=="string") {
                file.lines().forEach(function (line, i) {
                    if (line.indexOf(pattern)>=0) {
                        report(file, i+1, line);
                    }
                });
            }
        }
        return options.res;
        function report(file, lineNo, line) {
            if (options.res) {
                options.res.push({file:file, lineNo:lineNo,line:line});
            }
            Shell.echo(file+"("+lineNo+"): "+line);

        }
    };
    Shell.touch=function (f) {
    	f=resolve(f);
    	f.text(f.exists() ? f.text() : "");
    	return 1;
    };
    Shell.setout=function (ui) {
        Shell.outUI=ui;
    };
    Shell.echo=function () {
        return $.when.apply($,arguments).then(function () {
            console.log.apply(console,arguments);
            if (Shell.outUI && Shell.outUI.log) Shell.outUI.log.apply(Shell.outUI,arguments);
        });
    };
    Shell.err=function (e) {
        console.log.apply(console,arguments);
        if (e && e.stack) console.log(e.stack);
        if (Shell.outUI && Shell.outUI.err) Shell.outUI.err.apply(Shell.outUI,arguments);
    };
    Shell.clone= function () {
        var r=Object.create(this);
        r.vars=Object.create(this.vars);
        return r;
    };
    Shell.getvar=function (k) {
        return this.vars[k] || (process && process.env[k]);
    };
    Shell.get=Shell.getvar;
    Shell.set=function (k,v) {
        this.vars[k]=v;
        return v;
    };
    Shell.strcat=function () {
        if (arguments.length==1) return arguments[0];
        var s="";
        for (var i=0;i<arguments.length;i++) s+=arguments[i];
        return s;
    };
    Shell.exists=function (f) {
        f=this.resolve(f);
        return f.exists();
    };
    Shell.dl=function (f) {
        f=this.resolve(f||".");
        return f.download();
    };
    Shell.zip=function () {
        var t=this;
        var a=Array.prototype.slice.call(arguments).map(function (e) {
            if (typeof e==="string") return t.resolve(e);
            return e;
        });
        return FS.zip.zip.apply(FS.zip,a);
    };
    Shell.unzip=function () {
        var t=this;
        var a=Array.prototype.slice.call(arguments).map(function (e) {
            if (typeof e==="string") return t.resolve(e);
            return e;
        });
        return FS.zip.unzip.apply(FS.zip,a);
    };

    Shell.prompt=function () {};
    Shell.ASYNC={r:"SH_ASYNC"};
    Shell.help=function () {
        for (var k in Shell) {
            var c=Shell[k];
            if (typeof c=="function") {
                Shell.echo(k+(c.description?" - "+c.description:""));
            }
        }
    };
    if (!root.sh) root.sh=Shell;
    sh=Shell;
    if (typeof process=="object") {
        sh.devtool=function () { require('nw.gui').Window.get().showDevTools();};
        sh.cd(process.cwd().replace(/\\/g,"/"));
    } else {
        sh.cd("/");
    }
    return Shell;
});

define('Util',[],function () {
function getQueryString(key, default_)
{
   if (default_==null) default_="";
   key = key.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");
   var regex = new RegExp("[\\?&]"+key+"=([^&#]*)");
   var qs = regex.exec(window.location.href);
   if(qs == null)
    return default_;
   else
    return decodeURLComponentEx(qs[1]);
}
function decodeURLComponentEx(s){
    return decodeURIComponent(s.replace(/\+/g, '%20'));
}
function endsWith(str,postfix) {
    return str.substring(str.length-postfix.length)===postfix;
}
function startsWith(str,prefix) {
    return str.substring(0, prefix.length)===prefix;
}
function privatize(o){
    if (o.__privatized) return o;
    var res={__privatized:true};
    for (var n in o) {
        (function (n) {
            var m=o[n];
            if (n.match(/^_/)) return;
            if (typeof m!="function") return;
            res[n]=function () {
                var r=m.apply(o,arguments);
                return r;
            };
        })(n);
    }
    return res;
}
function extend(d,s) {
    for (var i in (s||{})) {d[i]=s[i];}
    return d;
}
return {
    getQueryString:getQueryString,
    endsWith: endsWith, startsWith: startsWith,
    privatize: privatize,extend:extend
};
});

define('UI',["Util"/*,"exceptionCatcher"*/],function (Util/*, EC*/) {
    var UI={};
    var F=function (f){return f;};//EC.f;
    UI=function () {
        var expr=[];
        for (var i=0 ; i<arguments.length ; i++) {
            expr[i]=arguments[i];
        }
        var listeners=[];
        var $vars={};
        var $edits=[];
        var res=parse(expr);
        res.$edits=$edits;
        res.$vars=$vars;
        $edits.load=function (model) {
            $edits.model=model;
            $edits.forEach(function (edit) {
                $edits.writeToJq(edit.params.$edit, edit.jq);
            });
        };
        $edits.writeToJq=function ($edit, jq) {
        	var m=$edits.model;
            if (!m) return;
            var name = $edit.name;
            var a=name.split(".");
            for (var i=0 ; i<a.length ;i++) {
                m=m[a[i]];
            }
            m=$edit.type.toVal(m);
            if (jq.attr("type")=="checkbox") {
                jq.prop("checked",!!m);
            } else {
                jq.val(m);
            }
        };
        $edits.validator={
       		errors:{},
       		show: function () {
       			if ($vars.validationMessage) {
       				$vars.validationMessage.empty();
       				for (var name in this.errors) {
       					$vars.validationMessage.append(UI("div", this.errors[name].mesg));
       				}
       			}
       			if ($vars.OKButton) {
       				var ok=true;
       				for (var name in this.errors) {
       					ok=false;
       				}
       				$vars.OKButton.attr("disabled", !ok);
       			}
       		},
       		on: {
       			validate: function () {}
       		},
       		addError: function (name, mesg, jq) {
       			this.errors[name]={mesg:mesg, jq:jq};
       			this.show();
       		},
       		removeError: function (name) {
       			delete this.errors[name];
       			this.show();
       		},
       		allOK: function () {
       			for (var i in this.errors) {
       				delete this.errors[i];
       			}
       			this.show();
       		},
       		isValid: function () {
       		    var res=true;
       		    for (var i in this.errors) res=false;
       		    return res;
       		}
        };
        $edits.writeToModel=function ($edit, val ,jq) {
            var m=$edits.model;
        	//console.log($edit, m);
            if (!m) return;
            var name = $edit.name;
            try {
                val=$edit.type.fromVal(val);
            } catch (e) {
            	$edits.validator.addError(name, e, jq);
            	//$edits.validator.errors[name]={mesg:e, jq:jq};
                //$edits.validator.change(name, e, jq);
                return;
            }
            $edits.validator.removeError(name);
            /*
            if ($edits.validator.errors[name]) {
                delete $edits.validator.errors[name];
                $edits.validator.change(name, null, jq);
            }*/
            var a=name.split(".");
            for (var i=0 ; i<a.length ;i++) {
                if (i==a.length-1) {
                    if ($edits.on.writeToModel(name,val)) {

                    } else {
                        m[a[i]]=val;
                    }
                } else {
                    m=m[a[i]];
                }
            }
            $edits.validator.on.validate.call($edits.validator, $edits.model);
        };
        $edits.on={};
        $edits.on.writeToModel= function (name, val) {};

        if (listeners.length>0) {
            setTimeout(F(l),10);
        }
        function l() {
            listeners.forEach(function (li) {
                li();
            });
            setTimeout(F(l),10);
        }
        return res;
        function parse(expr) {
            if (expr instanceof Array) return parseArray(expr);
            else if (typeof expr=="string") return parseString(expr);
            else return expr;
        }
        function parseArray(a) {
            var tag=a[0];
            var i=1;
            var res=$("<"+tag+">");
            if (typeof a[i]=="object" && !(a[i] instanceof Array) && !(a[i] instanceof $) ) {
                parseAttr(res, a[i],tag);
                i++;
            }
            while (i<a.length) {
                res.append(parse(a[i]));
                i++;
            }
            return res;
        }
        function parseAttr(jq, o, tag) {
            if (o.$var) {
                $vars[o.$var]=jq;
            }
            if (o.$edit) {
                if (typeof o.$edit=="string") {
                    o.$edit={name: o.$edit, type: UI.types.String};
                }
                if (!o.on) o.on={};
                o.on.realtimechange=F(function (val) {
                    $edits.writeToModel(o.$edit, val, jq);
                });
                if (!$vars[o.$edit.name]) $vars[o.$edit.name]=jq;
                $edits.push({jq:jq,params:o});
            }
            for (var k in o) {
                if (k=="on") {
                    for (var e in o.on) on(e, o.on[e]);
                } else if (k=="css") {
                    jq.css(o[k]);
                } else if (!Util.startsWith(k,"$")){
                    jq.attr(k,o[k]);
                }
            }
            function on(eType, li) {
                if (eType=="enterkey") {
                    jq.on("keypress",F(function (ev) {
                        if (ev.which==13) li.apply(jq,arguments);
                    }));
                } else if (eType=="realtimechange") {
                    var first=true, prev;
                    listeners.push(function () {
                        var cur;
                        if (o.type=="checkbox") {
                            cur=!!jq.prop("checked");
                        } else {
                            cur=jq.val();
                        }
                        if (first || prev!=cur) {
                            li.apply(jq,[cur,prev]);
                            prev=cur;
                        }
                        first=false;
                    });
                } else {
                    jq.on(eType, F(li));
                }
            }
        }
        function parseString(str) {
            return $("<span>").text(str);
        }
    };
    UI.types={
       String: {
           toVal: function (val) {
               return val;
           },
           fromVal: function (val) {
               return val;
           }
       },
       Number: {
           toVal: function (val) {
               return val+"";
           },
           fromVal: function (val) {
               return parseFloat(val);
           }
       }
   };
    return UI;
});

define('DragDrop',["FSFromRoot","root"],function (FS,root) {
    var DU=FS.DeferredUtil;
    var SFile=FS.SFile;
    var DragDrop={};
    root.DragDrop=DragDrop;
    DragDrop.readFile=function (file) {
        return DU.promise(function (succ) {
            var reader = new FileReader();
            reader.onload = function() {
                //var fileContent = reader.result;
                //console.log("SUCC",reader);
                succ(reader);
            };
            reader.readAsArrayBuffer(file);
        });
    };
    DragDrop.accept=function (dom, fdst,options) {
        options=options||{};
        options.draggingClass=options.draggingClass||"dragging";
        dom.on("dragover",over);
        dom.on("dragenter",enter);
        dom.on("dragleave",leave);
        dom.on("drop",dropAdd);
        if (!options.onCheckFile) {
            options.onCheckFile=function (f) {
                if (options.overwrite) {
                    return f;
                } else {
                    if (f.exists()) return false;
                    return f;
                }
            };
        }
        if (!options.onError) {
            options.onError=function (e) {
                console.error(e);
            };
        }
        function dropAdd(e) {
            var dst=fdst;
            if (typeof dst==="function") dst=dst();
            dom.removeClass(options.draggingClass);
            var status={};
            var eo=e.originalEvent;
            e.stopPropagation();
            e.preventDefault();
            var files = Array.prototype.slice.call(eo.dataTransfer.files);
            //var added=[],cnt=files.length;
            DU.each(files,function (file) {
                var itemName=file.name;
                var itemFile=dst.rel(itemName),actFile;
                return DU.resolve(
                    options.onCheckFile(itemFile,file)
                ).then(function (cr) {
                    if (cr===false) {
                        status[itemFile.path()]={
                            file:itemFile,
                            status:"cancelled"
                        };
                        return;
                    }
                    if (SFile.is(cr)) actFile=cr;
                    else actFile=itemFile;
                    return DragDrop.readFile(file).then(function (reader) {
                        var fileContent=reader.result;
                        actFile.setBytes(fileContent);
                        status[itemFile.path()]={
                            file:itemFile,
                            status:"uploaded"
                        };
                        if (actFile.path()!==itemFile.path()) {
                            status[itemFile.path()].redirectedTo=actFile;
                        }
                    });
                });
            }).then(function () {
                if (options.onComplete) options.onComplete(status);
            }).fail(function (e) {
                //console.log(e);
                options.onError(e);
            });
            return false;
        }
        function over(e) {
            //console.log("over",e);
            e.stopPropagation();
            e.preventDefault();
        }
        var entc=0;
        function enter(e) {
            var eo=e.originalEvent;
            console.log("enter",eo.target.innerHTML,e);
            entc++;
            /*if (dom[0]===eo.relatedTarget) {
                dom.addClass(options.draggingClass);
            }*/
            //if (eo.target===dom[0]) {
            dom.addClass(options.draggingClass);
            //}
                //$(eo.target).addClass(options.draggingClass);
            //e.stopPropagation();
            //e.preventDefault();
        }
        function leave(e) {
            var eo=e.originalEvent;
            //dom.removeClass(options.draggingClass);
            console.log("leave",eo.target.innerHTML,e);
            entc--;
            /*if (dom[0]===eo.relatedTarget) {
                dom.removeClass(options.draggingClass);
            }*/
            //if (eo.target===dom[0]) {
            if (entc<=0) dom.removeClass(options.draggingClass);
            //}
            //$(eo.target).removeClass(options.draggingClass);
            //e.stopPropagation();
            //e.preventDefault();
        }
    };
    return DragDrop;
});

define('ShellParser',["Shell","FSFromRoot"],function (sh,FS) {
    var DU=FS.DeferredUtil;
    var envMulti=/\$\{([^\}]*)\}/;
    //var envSingle=/^\$\{([^\}]*)\}$/;
    var F=DU.throwF;
    sh.enterCommand=function (s) {
        if (!this._history) this._history=[];
        this._history.push(s);
        var args=this.parseCommand(s);
        if (this._skipto) {
            if (args[0]=="label") {
                this.label(args[1]);
            } else {
                this.echo("Skipping command: "+s);
            }
        } else {
            return this.evalCommand(args);
        }
    };
    sh.label=function (n) {
        this._labels=this._labels||{};
        this._labels[n]=this._history.length;
        if (this._skipto==n) delete this._skipto;
    };
    sh["goto"]=function (n,cond) {
        if (arguments.length==1) cond=true;
        var t=this;
        return $.when(cond).then(function (c) {
            if (!c) return;
            t._labels=t._labels||{};
            var pc=t._labels[n];
            if (pc) {
                if (!t._pc) {
                    t._pc=pc;
                    return t.gotoLoop();
                } else {
                    t._pc=pc;
                }
            } else {
                t._skipto=n;
            }
        });
    };
    sh.gotoLoop=function () {
        var t=this;
        var cnt=0;
        return DU.loop(F(function () {
            if (cnt++>100) {
                delete t._pc;
                throw new Error("Are infinite loops scary?");
            }
            if (t._skipto || !t._pc || t._pc>=t._history.length) {
                delete t._pc;
                return DU.brk();
            }
            var s=t._history[t._pc++];
            var args=t.parseCommand(s);
            return t.evalCommand(args);
        }));
    };
    sh.sleep=function (t) {
        var d=new $.Deferred;
        t=parseFloat(t);
        setTimeout(function () {d.resolve();},t*1000);
        return d.promise();
    };
    sh.include=function (f) {
        f=this.resolve(f,true);
        var t=this;
        var ln=f.lines();
        return DU.each(ln,F(function (l) {
            return t.enterCommand(l);
        }));
    };
    /*
    set a 1
    label loop
    echo ${a}
    calc add ${a} 1
    set a ${_}
    goto loop ( calc lt ${a} 10 )
    */
    sh.parseCommand=function (s) {
        var space=/^\s*/;
        var nospace=/^([^\s]*(\\.)*)*/;
        var dq=/^"([^"]*(\\.)*)*"/;
        var sq=/^'([^']*(\\.)*)*'/;
        var lpar=/^\(/;
        var rpar=/^\)/;
        function parse() {
            var a=[];
            while(s.length) {
                s=s.replace(space,"");
                var r;
                if (r=dq.exec(s)) {
                    a.push(expand( unesc(r[1]) ));
                    s=s.substring(r[0].length);
                } else if (r=sq.exec(s)) {
                    a.push(unesc(r[1]));
                    s=s.substring(r[0].length);
                } else if (r=lpar.exec(s)) {
                    s=s.substring(r[0].length);
                    a.push( parse() );
                } else if (r=rpar.exec(s)) {
                    s=s.substring(r[0].length);
                    break;
                } else if (r=nospace.exec(s)) {
                    a.push(expand(unesc(r[0])));
                    s=s.substring(r[0].length);
                } else {
                    break;
                }
            }
            var options,args=[];
            a.forEach(function (ce) {
                var opt=/^-([A-Za-z_0-9]+)(=(.*))?/.exec(ce);
                if (opt) {
                    if (!options) options={};
                    options[opt[1]]=opt[3]!=null ? opt[3] : true;
                } else {
                    if (options) args.push(options);
                    options=null;
                    args.push(ce);
                }
            });
            if (options) args.push(options);
            return args;
        }
        var args=parse();
        return args;
        /*console.log("parsed:",JSON.stringify(args));
        var res=this.evalCommand(args);
        return res;*/
        function expand(s) {
            var r;
            /*if (r=envSingle.exec(s)) {
                return ["get",r[1]];
            }
            if (!(r=envMulti.exec(s))) return s;*/
            var ex=["strcat"];
            while(s.length) {
                r=envMulti.exec(s);
                if (!r) {
                    ex.push(s);
                    break;
                }
                if (r.index>0) {
                    ex.push(s.substring(0,r.index));
                }
                ex.push(["get",r[1]]);
                s=s.substring(r.index+r[0].length);
            }
            if (ex.length==2) return ex[1];
            return ex;
        }
        function unesc(s) {
            return s.replace(/\\(.)/g,function (_,b){
                return b;
            });
        }
    };
    sh.evalCommand=function (expr) {
        var t=this;
        if (expr instanceof Array) {
            if (expr.length==0) return;
            var c=expr.shift();
            var f=this[c];
            if (typeof f!="function") throw new Error(c+": Command not found");
            var a=[];
            while(expr.length) {
                var e=expr.shift();
                a.push( this.evalCommand(e) );
            }
            return $.when.apply($,a).then(F(function () {
                return f.apply(t,arguments);
            }));
        } else {
            return expr;
        }
    };
    sh.calc=function (op) {
        var i=1;
        var r=parseFloat(arguments[i]);
        for(i=2;i<arguments.length;i++) {
            var b=arguments[i];
            switch(op) {
                case "add":r+=parseFloat(b);break;
                case "sub":r-=parseFloat(b);break;
                case "mul":r*=parseFloat(b);break;
                case "div":r/=parseFloat(b);break;
                case "lt":r=(r<b);break;
            }
        }
        this.set("_",r);
        return r;
    };
    sh.history=function () {
        var t=this;
        this._history.forEach(function (e) {
            t.echo(e);
        });
    };
});

define('ShellUI',["Shell","UI","FSFromRoot","Util","DragDrop","ShellParser","root"],
function (shParent,UI,FS,Util,DragDrop,shp,root) {
    var DU=FS.DeferredUtil;
    var res={};
    var sh=shParent.clone();
    res.show=function (dir) {
        var d=res.embed(dir);
        d.dialog({width:600,height:500});
    };
    res.embed=function (/*dir*/) {
        if (!res.d) {
            res.d=UI("div",{title:"Shell"},["div",{$var:"inner"},"Type 'help' to show commands.",["br"]]);
            res.inner=res.d.$vars.inner;
            sh.prompt();
        }
        var d=res.d;
        return d;
    };
    res.sh=sh;
    sh.cls=function () {
        res.d.$vars.inner.empty();
    };
    function hitBottom() {
        res.inner.closest(".ui-dialog-content").scrollTop(res.inner.height());
    }

    sh.prompt=function () {
        var t=this;
        var line=UI("div",
            ["input",{$var:"cmd",size:40,on:{keydown: kd}}],
            ["pre",{$var:"out","class":"shell out"},["div",{$var:"cand","class":"shell cand"}]]
        );
        var cmd=line.$vars.cmd;
        var out=line.$vars.out;
        var cand=line.$vars.cand;
        line.appendTo(res.inner);
        hitBottom();
        cmd.focus();
        //var d=new $.Deferred;
        t.setout({log:function () {
           // return $.when.apply($,arguments).then(function () {
                var a=[];
                for (var i=0; i<arguments.length; i++) {
                    a.push(arguments[i]);
                }
                if (a[0] instanceof $) {
                    out.append(a[0]);
                } else {
                    out.append(UI("span",a.join(" ")+"\n"));
                }
            //});
        },err:function (e) {
            out.append(UI("div",{"class": "shell error"},e,["br"],["pre",e.stack]));
        }});
        return;// d.promise();
        function kd(e) {
            if (e.which==9) {
                e.stopPropagation();
                e.preventDefault();
                comp();
                return false;
            }
            if (e.which==13) {
                cand.empty();
                exec(cmd.val());
            }
        }
        function exec() {
            try {
                var sres=t.enterCommand(cmd.val());
                cmd.blur();
                return $.when(sres).then(function (sres) {
                    if (typeof sres=="object") {
                        if (sres instanceof Array) {
                            var table=UI("table");
                            var tr=null;
                            var cnt=0;
                            sres.forEach(function (r) {
                                if (typeof r!="string") return;
                                if (!tr) tr=UI("tr").appendTo(table);
                                tr.append(UI("td",r));
                                cnt++;if(cnt%3==0) tr=null;
                            });
                            table.appendTo(out);
                        } else {
                            var jso;
                            try {
                                jso=JSON.stringify(sres);
                            } catch(e) {jso="[Object]";}
                            out.append(jso);
                        }
                    } else {
                        out.append(sres);
                    }
                    t.prompt();
                }).fail(function (e) {
                    t.err(e);
                    t.prompt();
                });
            } catch(e) {
                t.err(e);
                //out.append(UI("div",{"class": "shell error"},e,["br"],["pre",e.stack]));
                t.prompt();
            }
        }
        function comp(){
            var c=cmd.val();
            var cs=c.split(" ");
            var fn=cs.pop();
            var canda=[];
            if (cs.length==0) {
                for (var k in sh) {
                    if (typeof sh[k]=="function" && Util.startsWith(k, fn)) {
                        canda.push(k);
                    }
                }
            } else {
                var f=sh.resolve(fn,false);
                //console.log(fn,f);
                if (!f) return;
                var d=(f.isDir() ? f : f.up());
                d.each(function (e) {
                    if ( Util.startsWith(e.path(), f.path()) ) {
                        canda.push(e.name());
                    }
                });
            }
            if (canda.length==1) {
                var fns=fn.split("/");
                fns.pop();
                fns.push(canda[0]);
                cs.push(fns.join("/"));
                cmd.val(cs.join(" "));
                cand.empty();
            } else {
                cand.text(canda.join(", "));
            }
            hitBottom();
            //console.log(canda);
            //cmd.val(cmd.val()+"hokan");
        }
    };
    sh.edit=function (f) {
        f=this.resolve(f);
        var u=UI("div",
            ["div",["textarea",{rows:10,cols:60,$var:"prog"}]],
            ["div",["button",{on:{click:save}},"Save"]]
        );
        if (f.exists()) u.$vars.prog.val(f.text());
        return this.echo(u);
        function save() {
            f.text( u.$vars.prog.val() );
        }
    };
    sh.window=shParent.window=function () {
        res.show(sh.cwd);
    };
    sh.atest=function (a,b,options) {
        console.log(a,b,options);
    };
    var oldcat=sh.cat;
    sh.cat=function (file) {
        file=sh.resolve(file, true);
        if (file.contentType().match(/^image\//)) {
            return file.getContent(function (c) {
                sh.echo(UI("img",{src:c.toURL()}));
            });
        } else {
            return oldcat.apply(sh,arguments);
        }
    };
    sh.dragdrop=function () {
        var cwd=this.cwd;
        var ui=UI("div",{
            style:"padding: 10px;"
        },"Drag here to add files to ",cwd.path());
        DragDrop.accept(ui,cwd,{
            onComplete: function (status) {
                for (var i in status) {
                   ui.append(UI("div",i," ",status[i].status,
                   status[i].redirectedTo? "Redirected to "+
                   status[i].redirectedTo.name() : "") );
                }
            }
        });
        this.echo(ui);
    };
    sh.requirejs=function () {
        var t=this;
        var a=Array.prototype.slice.call(arguments);
        var options={};
        if (a.length>0 && typeof a[a.length-1]=="object") {
            options=a.pop();
            if (options.f) {
                a=a.map(function(e) {
                    return t.resolve(e).getURL()+
                    (options.r? "?"+Math.floor(Math.random()*1000):"");
                });
                //console.log(a);
                //return;
            }
        }
        return DU.callbackToPromise(function (succ,err) {
            //console.log("reqjs",a);
            try {
                return root.requirejs(a,succ);
            }catch(e){
                err(e);
            }
        });
    };
    res.UI=UI;

    return res;
});

//-----------
	var resMod;
	requirejs(["ShellUI"], function (r) {
	  resMod=r;
	});
	if (typeof window!=="undefined" && window.shui===undefined) window.shui=resMod;
	if (typeof window!=="undefined" && window.sh===undefined) window.sh=resMod.sh;
	if (typeof module!=="undefined") module=resMod;
	return resMod;
});
//})(window);
