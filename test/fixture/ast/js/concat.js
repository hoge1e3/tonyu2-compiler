Tonyu.klass.define({
  fullName: 'user.Main',
  shortName: 'Main',
  namespace: 'user',
  includes: [],
  methods: function (__superClass) {
    return {
      main :function _trc_Main_main() {
        "use strict";
        var _this=this;
        
        "field strict";
        _this.idseq = 1;
        
        _this.types = {};
        
        _this.map = new Map();
        
        _this.res = {};
        
        _this.r = Tonyu.globals.$builder.serializeAnnotatedNodes();
        
        console.log(_this.r);
      },
      fiber$main :function* _trc_Main_f_main(_thread) {
        "use strict";
        var _this=this;
        //var _arguments=Tonyu.A(arguments);
        
        "field strict";
        _this.idseq = 1;
        
        _this.types = {};
        
        _this.map = new Map();
        
        _this.res = {};
        
        _this.r = Tonyu.globals.$builder.serializeAnnotatedNodes();
        
        console.log(_this.r);
        
      },
      proc :function _trc_Main_proc() {
        "use strict";
        var _this=this;
        
        let cl = Tonyu.classMetas["user.Main"];
        
        let root = _this.traverse({node: cl.node,annotation: cl.annotation},{path: ["root"]});
        
        if (root.REF!==1) {
          throw new Error(root.REF);
          
          
        }
        console.log(_this.types);
        console.log(JSON.stringify(_this.res));
        console.log(JSON.stringify(_this.res["1"]));
      },
      fiber$proc :function* _trc_Main_f_proc(_thread) {
        "use strict";
        var _this=this;
        //var _arguments=Tonyu.A(arguments);
        
        let cl = Tonyu.classMetas["user.Main"];
        
        let root=yield* _this.fiber$traverse(_thread, {node: cl.node,annotation: cl.annotation}, {path: ["root"]});
        
        if (root.REF!==1) {
          throw new Error(root.REF);
          
          
        }
        console.log(_this.types);
        console.log(JSON.stringify(_this.res));
        console.log(JSON.stringify(_this.res["1"]));
        
      },
      refobj :function _trc_Main_refobj(id) {
        "use strict";
        var _this=this;
        
        return {REF: id};
      },
      fiber$refobj :function* _trc_Main_f_refobj(_thread,id) {
        "use strict";
        var _this=this;
        //var _arguments=Tonyu.A(arguments);
        
        return {REF: id};
        
      },
      builtin :function _trc_Main_builtin(name) {
        "use strict";
        var _this=this;
        
        return {BUILTIN: name};
      },
      fiber$builtin :function* _trc_Main_f_builtin(_thread,name) {
        "use strict";
        var _this=this;
        //var _arguments=Tonyu.A(arguments);
        
        return {BUILTIN: name};
        
      },
      packAnnotations :function _trc_Main_packAnnotations(ans) {
        "use strict";
        var _this=this;
        
        let res = {};
        
        for (let [k] of Tonyu.iterator2(Object.keys(ans),1)) {
          if (_this.isEmptyAnnotation(ans[k])) {
            continue;
            
          }
          res[k]=ans[k];
          
        }
        return res;
      },
      fiber$packAnnotations :function* _trc_Main_f_packAnnotations(_thread,ans) {
        "use strict";
        var _this=this;
        //var _arguments=Tonyu.A(arguments);
        
        let res = {};
        
        for (let [k] of Tonyu.iterator2(Object.keys(ans),1)) {
          if (_this.isEmptyAnnotation(ans[k])) {
            continue;
            
          }
          res[k]=ans[k];
          
        }
        return res;
        
      },
      isEmptyAnnotation :function _trc_Main_isEmptyAnnotation(a) {
        "use strict";
        var _this=this;
        
        return a&&typeof  a==="object"&&Object.keys(a).length===1&&Object.keys(a)[0]==="node";
      },
      fiber$isEmptyAnnotation :function* _trc_Main_f_isEmptyAnnotation(_thread,a) {
        "use strict";
        var _this=this;
        //var _arguments=Tonyu.A(arguments);
        
        return a&&typeof  a==="object"&&Object.keys(a).length===1&&Object.keys(a)[0]==="node";
        
      },
      isArray :function _trc_Main_isArray(a) {
        "use strict";
        var _this=this;
        
        return a&&typeof  a.slice==="function"&&typeof  a.map==="function"&&typeof  a.length==="number";
      },
      fiber$isArray :function* _trc_Main_f_isArray(_thread,a) {
        "use strict";
        var _this=this;
        //var _arguments=Tonyu.A(arguments);
        
        return a&&typeof  a.slice==="function"&&typeof  a.map==="function"&&typeof  a.length==="number";
        
      },
      pushPath :function _trc_Main_pushPath(ctx,k) {
        "use strict";
        var _this=this;
        
        let nc = {path: ctx.path.slice()};
        
        if (_this.looksLikeNum(k)) {
          k="[]";
        }
        nc.path.push(k);
        return nc;
      },
      fiber$pushPath :function* _trc_Main_f_pushPath(_thread,ctx,k) {
        "use strict";
        var _this=this;
        //var _arguments=Tonyu.A(arguments);
        
        let nc = {path: ctx.path.slice()};
        
        if (_this.looksLikeNum(k)) {
          k="[]";
        }
        nc.path.push(k);
        return nc;
        
      },
      isNativeSI :function _trc_Main_isNativeSI(a) {
        "use strict";
        var _this=this;
        
        return a.type==="native"&&a.value;
      },
      fiber$isNativeSI :function* _trc_Main_f_isNativeSI(_thread,a) {
        "use strict";
        var _this=this;
        //var _arguments=Tonyu.A(arguments);
        
        return a.type==="native"&&a.value;
        
      },
      isSFile :function _trc_Main_isSFile(path) {
        "use strict";
        var _this=this;
        
        return path&&typeof  (path.isSFile)=="function"&&path.isSFile();
      },
      fiber$isSFile :function* _trc_Main_f_isSFile(_thread,path) {
        "use strict";
        var _this=this;
        //var _arguments=Tonyu.A(arguments);
        
        return path&&typeof  (path.isSFile)=="function"&&path.isSFile();
        
      },
      traverse :function _trc_Main_traverse(a,ctx) {
        "use strict";
        var _this=this;
        
        if (a&&typeof  a==="object") {
          if (_this.map.has(a)) {
            return _this.refobj(_this.map.get(a));
            
          }
          let id = _this.idseq++;
          
          _this.map.set(a,id);
          let res;
          if (_this.isSFile(a)) {
            res={isSFile: true,path: a.path()};
            
          } else {
            if (_this.isArray(a)) {
              res=a.map((function anonymous_1982(e) {
                
                return _this.traverse(e,_this.pushPath(ctx,"[]"));
              }));
              
            } else {
              _this.keys(a,ctx);
              res={};
              let nsi = _this.isNativeSI(a);
              
              for (let [k] of Tonyu.iterator2(Object.keys(a),1)) {
                if (nsi&&k==="value") {
                  continue;
                  
                }
                if (k==="toString") {
                  continue;
                  
                }
                let nc = _this.pushPath(ctx,k);
                
                res[k]=_this.traverse(a[k],nc);
                
              }
              
            }
          }
          _this.res[id]=res;
          return _this.refobj(id);
          
        } else {
          if (typeof  a==="function") {
            return "<function>";
            
          } else {
            return a;
            
          }
        }
      },
      fiber$traverse :function* _trc_Main_f_traverse(_thread,a,ctx) {
        "use strict";
        var _this=this;
        //var _arguments=Tonyu.A(arguments);
        
        if (a&&typeof  a==="object") {
          if (_this.map.has(a)) {
            return yield* _this.fiber$refobj(_thread, _this.map.get(a));
            
            
          }
          let id = _this.idseq++;
          
          _this.map.set(a,id);
          let res;
          if (_this.isSFile(a)) {
            res={isSFile: true,path: a.path()};
            
          } else {
            if (_this.isArray(a)) {
              res=a.map((function anonymous_1982(e) {
                
                return _this.traverse(e,_this.pushPath(ctx,"[]"));
              }));
              
            } else {
              (yield* _this.fiber$keys(_thread, a, ctx));
              res={};
              let nsi=yield* _this.fiber$isNativeSI(_thread, a);
              
              for (let [k] of Tonyu.iterator2(Object.keys(a),1)) {
                if (nsi&&k==="value") {
                  continue;
                  
                }
                if (k==="toString") {
                  continue;
                  
                }
                let nc=yield* _this.fiber$pushPath(_thread, ctx, k);
                
                res[k]=(yield* _this.fiber$traverse(_thread, a[k], nc));
                
              }
              
            }
          }
          _this.res[id]=res;
          return yield* _this.fiber$refobj(_thread, id);
          
          
        } else {
          if (typeof  a==="function") {
            return "<function>";
            
          } else {
            return a;
            
          }
        }
        
      },
      keys :function _trc_Main_keys(obj,ctx) {
        "use strict";
        var _this=this;
        
        let k = Object.keys(obj).sort().join(",");
        
        _this.types[k]=_this.types[k]||{first: ctx.path.join(".")};
        let pathTail = ctx.path[ctx.path.length-1];
        
        if (pathTail==="[]") {
          pathTail=ctx.path[ctx.path.length-2]+pathTail;
          
        }
        _this.types[k][pathTail]=_this.types[k][pathTail]||0;
        _this.types[k][pathTail]++;
      },
      fiber$keys :function* _trc_Main_f_keys(_thread,obj,ctx) {
        "use strict";
        var _this=this;
        //var _arguments=Tonyu.A(arguments);
        
        let k = Object.keys(obj).sort().join(",");
        
        _this.types[k]=_this.types[k]||{first: ctx.path.join(".")};
        let pathTail = ctx.path[ctx.path.length-1];
        
        if (pathTail==="[]") {
          pathTail=ctx.path[ctx.path.length-2]+pathTail;
          
        }
        _this.types[k][pathTail]=_this.types[k][pathTail]||0;
        _this.types[k][pathTail]++;
        
      },
      looksLikeNum :function _trc_Main_looksLikeNum(k) {
        "use strict";
        var _this=this;
        
        return k.match(/^\d+$/);
      },
      fiber$looksLikeNum :function* _trc_Main_f_looksLikeNum(_thread,k) {
        "use strict";
        var _this=this;
        //var _arguments=Tonyu.A(arguments);
        
        return k.match(/^\d+$/);
        
      },
      mul :function _trc_Main_mul(s,n) {
        "use strict";
        var _this=this;
        
        let r = "";
        
        while (-- n>0) {
          Tonyu.checkLoop();
          r+=s;
        }
        return r;
      },
      fiber$mul :function* _trc_Main_f_mul(_thread,s,n) {
        "use strict";
        var _this=this;
        //var _arguments=Tonyu.A(arguments);
        
        let r = "";
        
        while (-- n>0) {
          yield null;
          r+=s;
        }
        return r;
        
      },
      __dummy: false
    };
  },
  decls: {"methods":{"main":{"nowait":false,"isMain":true,"vtype":{"params":[],"returnValue":null}},"proc":{"nowait":false,"isMain":false,"vtype":{"params":[],"returnValue":null}},"refobj":{"nowait":false,"isMain":false,"vtype":{"params":[null],"returnValue":null}},"builtin":{"nowait":false,"isMain":false,"vtype":{"params":[null],"returnValue":null}},"packAnnotations":{"nowait":false,"isMain":false,"vtype":{"params":[null],"returnValue":null}},"isEmptyAnnotation":{"nowait":false,"isMain":false,"vtype":{"params":[null],"returnValue":null}},"isArray":{"nowait":false,"isMain":false,"vtype":{"params":[null],"returnValue":null}},"pushPath":{"nowait":false,"isMain":false,"vtype":{"params":[null,null],"returnValue":null}},"isNativeSI":{"nowait":false,"isMain":false,"vtype":{"params":[null],"returnValue":null}},"isSFile":{"nowait":false,"isMain":false,"vtype":{"params":[null],"returnValue":null}},"traverse":{"nowait":false,"isMain":false,"vtype":{"params":[null,null],"returnValue":null}},"keys":{"nowait":false,"isMain":false,"vtype":{"params":[null,null],"returnValue":null}},"looksLikeNum":{"nowait":false,"isMain":false,"vtype":{"params":[null],"returnValue":null}},"mul":{"nowait":false,"isMain":false,"vtype":{"params":[null,null],"returnValue":null}}},"fields":{"idseq":{},"types":{},"map":{},"res":{},"r":{}}}
});

//# sourceMappingURL=concat.js.map