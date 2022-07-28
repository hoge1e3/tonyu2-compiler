Tonyu.klass.define({
  fullName: 'kernel.ArgParser',
  shortName: 'ArgParser',
  namespace: 'kernel',
  includes: [],
  methods: function (__superClass) {
    return {
      main :function _trc_ArgParser_main() {
        "use strict";
        var _this=this;
        
        
      },
      fiber$main :function* _trc_ArgParser_f_main(_thread) {
        "use strict";
        var _this=this;
        //var _arguments=Tonyu.A(arguments);
        
        
        
      },
      initialize :function _trc_ArgParser_initialize(asrc) {
        "use strict";
        var _this=this;
        var i;
        
        if (! asrc) {
          throw new Error("Use as: new ArgParser(arguments)");
          
        }
        _this.length=0;
        _this.a=_this;
        for (i = 0;
         i<asrc.length ; i++) {
          _this.push(asrc[i]);
        }
      },
      push :function _trc_ArgParser_push(v) {
        "use strict";
        var _this=this;
        
        _this.a[_this.length++]=v;
      },
      fiber$push :function* _trc_ArgParser_f_push(_thread,v) {
        "use strict";
        var _this=this;
        //var _arguments=Tonyu.A(arguments);
        
        _this.a[_this.length++]=v;
        
      },
      trimUndefs :function _trc_ArgParser_trimUndefs() {
        "use strict";
        var _this=this;
        
        while (_this.length>0) {
          if (_this.a[_this.length-1]!==_this._undef) {
            break;
            
          }
          _this.length--;
          delete _this.a[_this.length];
          
        }
      },
      fiber$trimUndefs :function* _trc_ArgParser_f_trimUndefs(_thread) {
        "use strict";
        var _this=this;
        //var _arguments=Tonyu.A(arguments);
        
        while (_this.length>0) {
          if (_this.a[_this.length-1]!==_this._undef) {
            break;
            
          }
          _this.length--;
          delete _this.a[_this.length];
          
        }
        
      },
      peek :function _trc_ArgParser_peek(i) {
        "use strict";
        var _this=this;
        
        return _this.a[i||0];
      },
      fiber$peek :function* _trc_ArgParser_f_peek(_thread,i) {
        "use strict";
        var _this=this;
        //var _arguments=Tonyu.A(arguments);
        
        return _this.a[i||0];
        
      },
      shift :function _trc_ArgParser_shift(type) {
        "use strict";
        var _this=this;
        var res;
        var i;
        
        if (typeof  type=="number") {
          res = [];
          
          for (i = 0;
           i<type ; i++) {
            res.push(_this.shift());
          }
          return res;
          
        } else {
          if (typeof  type=="string") {
            if (_this.a[0]==null) {
              return _this._undef;
            }
            if (typeof  _this.a[0]===type) {
              return _this.shift();
            }
            return _this._undef;
            
          } else {
            if (type) {
              if (Tonyu.is(_this.a[0],type)) {
                return _this.shift();
              }
              return _this._undef;
              
            }
          }
        }
        res = _this.a[0];
        
        for (i = 1;
         i<_this.length ; i++) {
          {
            _this.a[i-1]=_this.a[i];
          }
        }
        _this.length--;
        delete _this.a[_this.length];
        return res;
      },
      fiber$shift :function* _trc_ArgParser_f_shift(_thread,type) {
        "use strict";
        var _this=this;
        //var _arguments=Tonyu.A(arguments);
        var res;
        var i;
        
        if (typeof  type=="number") {
          res = [];
          
          for (i = 0;
           i<type ; i++) {
            res.push(_this.shift());
          }
          return res;
          
        } else {
          if (typeof  type=="string") {
            if (_this.a[0]==null) {
              return _this._undef;
            }
            if (typeof  _this.a[0]===type) {
              return yield* _this.fiber$shift(_thread);
              
            }
            return _this._undef;
            
          } else {
            if (type) {
              if (Tonyu.is(_this.a[0],type)) {
                return yield* _this.fiber$shift(_thread);
                
              }
              return _this._undef;
              
            }
          }
        }
        res = _this.a[0];
        
        for (i = 1;
         i<_this.length ; i++) {
          {
            _this.a[i-1]=_this.a[i];
          }
        }
        _this.length--;
        delete _this.a[_this.length];
        return res;
        
      },
      toArray :function _trc_ArgParser_toArray() {
        "use strict";
        var _this=this;
        var res;
        var i;
        
        res = [];
        
        for (i = 0;
         i<_this.a.length ; i++) {
          res.push(_this.a[i]);
        }
        return res;
      },
      fiber$toArray :function* _trc_ArgParser_f_toArray(_thread) {
        "use strict";
        var _this=this;
        //var _arguments=Tonyu.A(arguments);
        var res;
        var i;
        
        res = [];
        
        for (i = 0;
         i<_this.a.length ; i++) {
          res.push(_this.a[i]);
        }
        return res;
        
      },
      parseOptions :function _trc_ArgParser_parseOptions(spec) {
        "use strict";
        var _this=this;
        var speca;
        var res;
        var name;
        var opt;
        var notOption;
        var k;
        var v;
        
        speca = spec.split(",");
        
        res = {};
        
        if (_this.length>speca.length) {
          throw new Error("# of arguments("+_this.length+") is more than spec("+speca.length+").");
          
          
        }
        while (_this.length>1) {
          name = speca.shift();
          
          res[name]=_this.shift();
          
        }
        opt = _this.shift();
        
        if (typeof  opt!=="object") {
          notOption=true;
          
        } else {
          for ([k, v] of Tonyu.iterator2(opt,2)) {
            if (speca.indexOf(k)<0) {
              notOption=true;
              break;
              
              
            }
            
          }
          
        }
        if (notOption) {
          res[speca.shift()]=opt;
          
        } else {
          for ([k, v] of Tonyu.iterator2(opt,2)) {
            res[k]=v;
            
          }
          
        }
        return res;
      },
      fiber$parseOptions :function* _trc_ArgParser_f_parseOptions(_thread,spec) {
        "use strict";
        var _this=this;
        //var _arguments=Tonyu.A(arguments);
        var speca;
        var res;
        var name;
        var opt;
        var notOption;
        var k;
        var v;
        
        speca = spec.split(",");
        
        res = {};
        
        if (_this.length>speca.length) {
          throw new Error("# of arguments("+_this.length+") is more than spec("+speca.length+").");
          
          
        }
        while (_this.length>1) {
          name = speca.shift();
          
          res[name]=(yield* _this.fiber$shift(_thread));
          
        }
        opt=yield* _this.fiber$shift(_thread);
        
        if (typeof  opt!=="object") {
          notOption=true;
          
        } else {
          for ([k, v] of Tonyu.iterator2(opt,2)) {
            if (speca.indexOf(k)<0) {
              notOption=true;
              break;
              
              
            }
            
          }
          
        }
        if (notOption) {
          res[speca.shift()]=opt;
          
        } else {
          for ([k, v] of Tonyu.iterator2(opt,2)) {
            res[k]=v;
            
          }
          
        }
        return res;
        
      },
      __dummy: false
    };
  },
  decls: {"methods":{"main":{"nowait":false,"isMain":true,"vtype":{"params":[],"returnValue":null}},"new":{"nowait":false,"isMain":false,"vtype":{"params":[null],"returnValue":null}},"push":{"nowait":false,"isMain":false,"vtype":{"params":[null],"returnValue":null}},"trimUndefs":{"nowait":false,"isMain":false,"vtype":{"params":[],"returnValue":null}},"peek":{"nowait":false,"isMain":false,"vtype":{"params":[null],"returnValue":null}},"shift":{"nowait":false,"isMain":false,"vtype":{"params":[null],"returnValue":null}},"toArray":{"nowait":false,"isMain":false,"vtype":{"params":[],"returnValue":null}},"parseOptions":{"nowait":false,"isMain":false,"vtype":{"params":[null],"returnValue":null}}},"fields":{"length":{"vtype":"Number"},"a":{},"_undef":{}}}
});
Tonyu.klass.define({
  fullName: 'kernel.EventHandlerCaller',
  shortName: 'EventHandlerCaller',
  namespace: 'kernel',
  includes: [],
  methods: function (__superClass) {
    return {
      main :function _trc_EventHandlerCaller_main() {
        "use strict";
        var _this=this;
        
        
      },
      fiber$main :function* _trc_EventHandlerCaller_f_main(_thread) {
        "use strict";
        var _this=this;
        //var _arguments=Tonyu.A(arguments);
        
        
        
      },
      callEventHandler :function _trc_EventHandlerCaller_callEventHandler(h,args) {
        "use strict";
        var _this=this;
        var t;
        
        
        if (h["fiber"]) {
          t=Tonyu.thread();
          h["fiber"].apply(_this.target,[t].concat(args));
          t.steps();
          
        } else {
          h.apply(_this.target,args);
          
        }
      },
      fiber$callEventHandler :function* _trc_EventHandlerCaller_f_callEventHandler(_thread,h,args) {
        "use strict";
        var _this=this;
        //var _arguments=Tonyu.A(arguments);
        var t;
        
        
        if (h["fiber"]) {
          t=Tonyu.thread();
          h["fiber"].apply(_this.target,[t].concat(args));
          t.steps();
          
        } else {
          h.apply(_this.target,args);
          
        }
        
      },
      __dummy: false
    };
  },
  decls: {"methods":{"main":{"nowait":false,"isMain":true,"vtype":{"params":[],"returnValue":null}},"callEventHandler":{"nowait":false,"isMain":false,"vtype":{"params":[null,null],"returnValue":null}}},"fields":{"target":{}}}
});
Tonyu.klass.define({
  fullName: 'kernel.EventMod',
  shortName: 'EventMod',
  namespace: 'kernel',
  includes: [],
  methods: function (__superClass) {
    return {
      main :function _trc_EventMod_main() {
        "use strict";
        var _this=this;
        
        "field strict";
        
      },
      fiber$main :function* _trc_EventMod_f_main(_thread) {
        "use strict";
        var _this=this;
        //var _arguments=Tonyu.A(arguments);
        
        "field strict";
        
        
      },
      initEventMod :function _trc_EventMod_initEventMod() {
        "use strict";
        var _this=this;
        
        if (_this._eventHandlers) {
          return _this;
        }
        _this._eventHandlers={};
        _this.on("die",Tonyu.bindFunc(_this,_this.releaseEventMod));
      },
      releaseEventMod :function _trc_EventMod_releaseEventMod() {
        "use strict";
        var _this=this;
        var k;
        var v;
        
        for ([k, v] of Tonyu.iterator2(_this._eventHandlers,2)) {
          v.release();
          
        }
      },
      parseEventArgs :function _trc_EventMod_parseEventArgs(a) {
        "use strict";
        var _this=this;
        var res;
        var i;
        
        res = {type: a[0],args: []};
        
        for (i = 1;
         i<a.length ; i++) {
          {
            res.args.push(a[i]);
          }
        }
        return res;
      },
      findEventHandlerClass :function _trc_EventMod_findEventHandlerClass(type) {
        "use strict";
        var _this=this;
        
        return Tonyu.classes.kernel.EventHandler;
      },
      registerEventHandler :function _trc_EventMod_registerEventHandler(type,obj) {
        "use strict";
        var _this=this;
        var cl;
        
        _this.initEventMod();
        if (typeof  type=="function") {
          obj=obj||new type({target: _this});
          type=obj.getClassInfo().fullName;
          
        } else {
          if (! obj) {
            cl = _this.findEventHandlerClass(type);
            
            obj=new cl({target: _this});
            
          }
          
        }
        return _this._eventHandlers[type]=obj;
      },
      getEventHandler :function _trc_EventMod_getEventHandler(type) {
        "use strict";
        var _this=this;
        var res;
        
        _this.initEventMod();
        if (typeof  type=="function") {
          type=type.meta.fullName;
          
        }
        res = _this._eventHandlers[type];
        
        return res;
      },
      getOrRegisterEventHandler :function _trc_EventMod_getOrRegisterEventHandler(type) {
        "use strict";
        var _this=this;
        var res;
        
        res = _this.getEventHandler(type)||_this.registerEventHandler(type);
        
        return res;
      },
      on :function _trc_EventMod_on() {
        "use strict";
        var _this=this;
        var a;
        var h;
        
        a = _this.parseEventArgs(arguments);
        
        h = _this.getOrRegisterEventHandler(a.type);
        
        return h.addListener.apply(h,a.args);
      },
      fireEvent :function _trc_EventMod_fireEvent(type,arg) {
        "use strict";
        var _this=this;
        var h;
        
        if (! _this._eventHandlers) {
          return _this;
        }
        h = _this.getEventHandler(type);
        
        if (h) {
          h.fire([arg]);
        }
      },
      sendEvent :function _trc_EventMod_sendEvent(type,arg) {
        "use strict";
        var _this=this;
        
        _this.fireEvent(type,arg);
      },
      waitEvent :function _trc_EventMod_waitEvent() {
        "use strict";
        var _this=this;
        var args;
        var act;
        
        if (null) {
          args = new Tonyu.classes.kernel.ArgParser(arguments);
          
          act = args.shift(Tonyu.classes.kernel.EventMod)||_this;
          
          args.trimUndefs();
          null.waitEvent(act,args.toArray());
          
        }
      },
      fiber$waitEvent :function* _trc_EventMod_f_waitEvent(_thread) {
        "use strict";
        var _this=this;
        var _arguments=Tonyu.A(arguments);
        var args;
        var act;
        
        if (_thread) {
          args = new Tonyu.classes.kernel.ArgParser(_arguments);
          
          act = args.shift(Tonyu.classes.kernel.EventMod)||_this;
          
          args.trimUndefs();
          _thread.waitEvent(act,args.toArray());
          
        }
        
      },
      waitFor :function _trc_EventMod_waitFor(f) {
        "use strict";
        var _this=this;
        
        if (null) {
          return f;
          
        }
        return f;
      },
      fiber$waitFor :function* _trc_EventMod_f_waitFor(_thread,f) {
        "use strict";
        var _this=this;
        //var _arguments=Tonyu.A(arguments);
        
        if (_thread) {
          return (yield* _thread.await(f));
          
        }
        return f;
        
      },
      runPromise :function _trc_EventMod_runPromise(f) {
        "use strict";
        var _this=this;
        
        let pr = new Promise(f);
        
        if (! null) {
          return pr;
          
        } else {
          return _this.waitFor(pr);
          
        }
      },
      fiber$runPromise :function* _trc_EventMod_f_runPromise(_thread,f) {
        "use strict";
        var _this=this;
        //var _arguments=Tonyu.A(arguments);
        
        let pr = new Promise(f);
        
        if (! _thread) {
          return pr;
          
        } else {
          return yield* _this.fiber$waitFor(_thread, pr);
          
          
        }
        
      },
      __dummy: false
    };
  },
  decls: {"methods":{"main":{"nowait":false,"isMain":true,"vtype":{"params":[],"returnValue":null}},"initEventMod":{"nowait":true,"isMain":false,"vtype":{"params":[],"returnValue":null}},"releaseEventMod":{"nowait":true,"isMain":false,"vtype":{"params":[],"returnValue":null}},"parseEventArgs":{"nowait":true,"isMain":false,"vtype":{"params":[null],"returnValue":null}},"findEventHandlerClass":{"nowait":true,"isMain":false,"vtype":{"params":[null],"returnValue":null}},"registerEventHandler":{"nowait":true,"isMain":false,"vtype":{"params":[null,null],"returnValue":null}},"getEventHandler":{"nowait":true,"isMain":false,"vtype":{"params":[null],"returnValue":null}},"getOrRegisterEventHandler":{"nowait":true,"isMain":false,"vtype":{"params":[null],"returnValue":null}},"on":{"nowait":true,"isMain":false,"vtype":{"params":[],"returnValue":null}},"fireEvent":{"nowait":true,"isMain":false,"vtype":{"params":[null,null],"returnValue":null}},"sendEvent":{"nowait":true,"isMain":false,"vtype":{"params":[null,null],"returnValue":null}},"waitEvent":{"nowait":false,"isMain":false,"vtype":{"params":[],"returnValue":null}},"waitFor":{"nowait":false,"isMain":false,"vtype":{"params":[null],"returnValue":null}},"runPromise":{"nowait":false,"isMain":false,"vtype":{"params":[null],"returnValue":null}}},"fields":{"_eventHandlers":{}}}
});
Tonyu.klass.define({
  fullName: 'kernel.FileMod',
  shortName: 'FileMod',
  namespace: 'kernel',
  includes: [],
  methods: function (__superClass) {
    return {
      main :function _trc_FileMod_main() {
        "use strict";
        var _this=this;
        
      },
      fiber$main :function* _trc_FileMod_f_main(_thread) {
        "use strict";
        var _this=this;
        //var _arguments=Tonyu.A(arguments);
        
        
      },
      file :function _trc_FileMod_file(path) {
        "use strict";
        var _this=this;
        var d;
        var files;
        
        d = Tonyu.globals.$currentProject.getDir();
        
        if (path.isSFile&&path.isSFile()) {
          return path;
        }
        files = d.rel("files/");
        
        return files.rel(path).setPolicy({topDir: d});
      },
      fiber$file :function* _trc_FileMod_f_file(_thread,path) {
        "use strict";
        var _this=this;
        //var _arguments=Tonyu.A(arguments);
        var d;
        var files;
        
        d = Tonyu.globals.$currentProject.getDir();
        
        if (path.isSFile&&path.isSFile()) {
          return path;
        }
        files = d.rel("files/");
        
        return files.rel(path).setPolicy({topDir: d});
        
      },
      __dummy: false
    };
  },
  decls: {"methods":{"main":{"nowait":false,"isMain":true,"vtype":{"params":[],"returnValue":null}},"file":{"nowait":false,"isMain":false,"vtype":{"params":[null],"returnValue":null}}},"fields":{}}
});
Tonyu.klass.define({
  fullName: 'kernel.MathMod',
  shortName: 'MathMod',
  namespace: 'kernel',
  includes: [],
  methods: function (__superClass) {
    return {
      main :function _trc_MathMod_main() {
        "use strict";
        var _this=this;
        
        "field strict";
      },
      fiber$main :function* _trc_MathMod_f_main(_thread) {
        "use strict";
        var _this=this;
        //var _arguments=Tonyu.A(arguments);
        
        "field strict";
        
      },
      sin :function _trc_MathMod_sin(d) {
        "use strict";
        var _this=this;
        
        if (d%90==0) {
          d=_this.amod(d,360);
          return [0,1,0,- 1][_this.floor(d/90)];
          
        }
        return Math.sin(_this.rad(d));
      },
      cos :function _trc_MathMod_cos(d) {
        "use strict";
        var _this=this;
        
        if (d%90==0) {
          d=_this.amod(d,360);
          return [1,0,- 1,0][_this.floor(d/90)];
          
        }
        return Math.cos(_this.rad(d));
      },
      rad :function _trc_MathMod_rad(d) {
        "use strict";
        var _this=this;
        
        return d/180*Math.PI;
      },
      deg :function _trc_MathMod_deg(d) {
        "use strict";
        var _this=this;
        
        return d/Math.PI*180;
      },
      abs :function _trc_MathMod_abs(v) {
        "use strict";
        var _this=this;
        
        return Math.abs(v);
      },
      sgn :function _trc_MathMod_sgn(v,base) {
        "use strict";
        var _this=this;
        
        base=base||0;
        return (v>base?1:v<- base?- 1:0);
      },
      atan2 :function _trc_MathMod_atan2(y,x) {
        "use strict";
        var _this=this;
        
        return _this.deg(Math.atan2(y,x));
      },
      atanxy :function _trc_MathMod_atanxy(x,y) {
        "use strict";
        var _this=this;
        
        return _this.atan2(y,x);
      },
      floor :function _trc_MathMod_floor(x) {
        "use strict";
        var _this=this;
        
        return Math.floor(x);
      },
      angleDiff :function _trc_MathMod_angleDiff(a,b) {
        "use strict";
        var _this=this;
        var c;
        
        
        a=_this.floor(a);
        b=_this.floor(b);
        if (a>=b) {
          c=(a-b)%360;
          if (c>=180) {
            c-=360;
          }
          
        } else {
          c=- ((b-a)%360);
          if (c<- 180) {
            c+=360;
          }
          
        }
        return c;
      },
      sqrt :function _trc_MathMod_sqrt(t) {
        "use strict";
        var _this=this;
        
        return Math.sqrt(t);
      },
      dist :function _trc_MathMod_dist(dx,dy,dz) {
        "use strict";
        var _this=this;
        
        dz=dz||0;
        return _this.sqrt(dx*dx+dy*dy+dz*dz);
      },
      trunc :function _trc_MathMod_trunc(f) {
        "use strict";
        var _this=this;
        
        if (f>=0) {
          return Math.floor(f);
        } else {
          return Math.ceil(f);
        }
      },
      ceil :function _trc_MathMod_ceil(f) {
        "use strict";
        var _this=this;
        
        return Math.ceil(f);
      },
      rndFloat :function _trc_MathMod_rndFloat(r,m) {
        "use strict";
        var _this=this;
        
        if (typeof  r!=="number") {
          r=0;
        }
        if (typeof  m!=="number") {
          m=1;
        }
        if (r<m) {
          return _this.rnd()*(m-r)+r;
          
        } else {
          return _this.rnd()*(r-m)+m;
          
        }
      },
      rnd :function _trc_MathMod_rnd(r,m) {
        "use strict";
        var _this=this;
        var res;
        
        
        if (Tonyu.is(Tonyu.globals.$random,Tonyu.classes.kernel.Random)) {
          res=Tonyu.globals.$random.next01();
        } else {
          res=Math.random();
        }
        if (typeof  r=="number") {
          if (typeof  m=="number") {
            if (r<m) {
              return Math.floor(res*(m-r)+r);
              
            } else {
              return Math.floor(res*(r-m)+m);
              
            }
            
          } else {
            return Math.floor(res*(r>0?r:0));
            
          }
          
        }
        return res;
      },
      randomize :function _trc_MathMod_randomize(s) {
        "use strict";
        var _this=this;
        
        Tonyu.globals.$random=new Tonyu.classes.kernel.Random(s);
      },
      parseFloat :function _trc_MathMod_parseFloat(s) {
        "use strict";
        var _this=this;
        
        return parseFloat(s);
      },
      clamp :function _trc_MathMod_clamp(v,min,max) {
        "use strict";
        var _this=this;
        
        if (min>max) {
          return _this.clamp(v,max,min);
        }
        return v<min?min:v>max?max:v;
      },
      clamped :function _trc_MathMod_clamped(v,min,max) {
        "use strict";
        var _this=this;
        
        return _this.clamp(v,min,max)-v;
      },
      min :function _trc_MathMod_min() {
        "use strict";
        var _this=this;
        
        return Math.min.apply(Math,arguments);
      },
      max :function _trc_MathMod_max() {
        "use strict";
        var _this=this;
        
        return Math.max.apply(Math,arguments);
      },
      amod :function _trc_MathMod_amod(v,d) {
        "use strict";
        var _this=this;
        
        return (v%d+d)%d;
      },
      __dummy: false
    };
  },
  decls: {"methods":{"main":{"nowait":false,"isMain":true,"vtype":{"params":[],"returnValue":null}},"sin":{"nowait":true,"isMain":false,"vtype":{"params":[null],"returnValue":null}},"cos":{"nowait":true,"isMain":false,"vtype":{"params":[null],"returnValue":null}},"rad":{"nowait":true,"isMain":false,"vtype":{"params":[null],"returnValue":null}},"deg":{"nowait":true,"isMain":false,"vtype":{"params":[null],"returnValue":null}},"abs":{"nowait":true,"isMain":false,"vtype":{"params":[null],"returnValue":null}},"sgn":{"nowait":true,"isMain":false,"vtype":{"params":[null,null],"returnValue":null}},"atan2":{"nowait":true,"isMain":false,"vtype":{"params":[null,null],"returnValue":null}},"atanxy":{"nowait":true,"isMain":false,"vtype":{"params":[null,null],"returnValue":null}},"floor":{"nowait":true,"isMain":false,"vtype":{"params":[null],"returnValue":null}},"angleDiff":{"nowait":true,"isMain":false,"vtype":{"params":[null,null],"returnValue":null}},"sqrt":{"nowait":true,"isMain":false,"vtype":{"params":[null],"returnValue":null}},"dist":{"nowait":true,"isMain":false,"vtype":{"params":[null,null,null],"returnValue":null}},"trunc":{"nowait":true,"isMain":false,"vtype":{"params":[null],"returnValue":null}},"ceil":{"nowait":true,"isMain":false,"vtype":{"params":[null],"returnValue":null}},"rndFloat":{"nowait":true,"isMain":false,"vtype":{"params":[null,null],"returnValue":null}},"rnd":{"nowait":true,"isMain":false,"vtype":{"params":[null,null],"returnValue":null}},"randomize":{"nowait":true,"isMain":false,"vtype":{"params":[null],"returnValue":null}},"parseFloat":{"nowait":true,"isMain":false,"vtype":{"params":[null],"returnValue":null}},"clamp":{"nowait":true,"isMain":false,"vtype":{"params":[null,null,null],"returnValue":null}},"clamped":{"nowait":true,"isMain":false,"vtype":{"params":[null,null,null],"returnValue":null}},"min":{"nowait":true,"isMain":false,"vtype":{"params":[],"returnValue":null}},"max":{"nowait":true,"isMain":false,"vtype":{"params":[],"returnValue":null}},"amod":{"nowait":true,"isMain":false,"vtype":{"params":[null,null],"returnValue":null}}},"fields":{}}
});
Tonyu.klass.define({
  fullName: 'kernel.ParallelMod',
  shortName: 'ParallelMod',
  namespace: 'kernel',
  includes: [],
  methods: function (__superClass) {
    return {
      main :function _trc_ParallelMod_main() {
        "use strict";
        var _this=this;
        
        "field strict";
      },
      fiber$main :function* _trc_ParallelMod_f_main(_thread) {
        "use strict";
        var _this=this;
        //var _arguments=Tonyu.A(arguments);
        
        "field strict";
        
      },
      parallel :function _trc_ParallelMod_parallel() {
        "use strict";
        var _this=this;
        var args;
        var i;
        var name;
        var th;
        
        args = [];
        
        for (i = 1;
         i<arguments.length ; i++) {
          {
            args.push(arguments[i]);
          }
        }
        name = arguments[0];
        
        
        th=Tonyu.globals.$Boot.schedule(_this,name,args);
        return th;
      },
      call :function _trc_ParallelMod_call() {
        "use strict";
        var _this=this;
        var a;
        var t;
        var n;
        var f;
        var ag2;
        
        if (! null) {
          throw new Error("callは待機可能モードで呼び出してください");
          
        }
        a = new Tonyu.classes.kernel.ArgParser(arguments);
        
        t = a.shift();
        
        n = a.shift();
        
        f = t["fiber$"+n];
        
        if (! f) {
          throw new Error("メソッド"+n+"が見つかりません");
          
          
        }
        ag2 = a.toArray();
        
        ag2.unshift(null);
        return f.apply(t,ag2);
      },
      fiber$call :function* _trc_ParallelMod_f_call(_thread) {
        "use strict";
        var _this=this;
        var _arguments=Tonyu.A(arguments);
        var a;
        var t;
        var n;
        var f;
        var ag2;
        
        if (! _thread) {
          throw new Error("callは待機可能モードで呼び出してください");
          
        }
        a = new Tonyu.classes.kernel.ArgParser(_arguments);
        
        t = a.shift();
        
        n = a.shift();
        
        f = t["fiber$"+n];
        
        if (! f) {
          throw new Error("メソッド"+n+"が見つかりません");
          
          
        }
        ag2 = a.toArray();
        
        ag2.unshift(_thread);
        return f.apply(t,ag2);
        
      },
      __dummy: false
    };
  },
  decls: {"methods":{"main":{"nowait":false,"isMain":true,"vtype":{"params":[],"returnValue":null}},"parallel":{"nowait":true,"isMain":false,"vtype":{"params":[],"returnValue":null}},"call":{"nowait":false,"isMain":false,"vtype":{"params":[],"returnValue":null}}},"fields":{}}
});
Tonyu.klass.define({
  fullName: 'kernel.SchedulerMod',
  shortName: 'SchedulerMod',
  namespace: 'kernel',
  includes: [],
  methods: function (__superClass) {
    return {
      main :function _trc_SchedulerMod_main() {
        "use strict";
        var _this=this;
        
        "field strict";
        
      },
      fiber$main :function* _trc_SchedulerMod_f_main(_thread) {
        "use strict";
        var _this=this;
        //var _arguments=Tonyu.A(arguments);
        
        "field strict";
        
        
      },
      initSchedulerMod :function _trc_SchedulerMod_initSchedulerMod() {
        "use strict";
        var _this=this;
        
        _this._scheduler=_this._scheduler||Tonyu.globals.$Scheduler;
        _this._th=Tonyu.globals.$Boot.schedule(_this,"main",[]);
      },
      fiber$initSchedulerMod :function* _trc_SchedulerMod_f_initSchedulerMod(_thread) {
        "use strict";
        var _this=this;
        //var _arguments=Tonyu.A(arguments);
        
        _this._scheduler=_this._scheduler||Tonyu.globals.$Scheduler;
        _this._th=Tonyu.globals.$Boot.schedule(_this,"main",[]);
        
      },
      update :function _trc_SchedulerMod_update() {
        "use strict";
        var _this=this;
        
        _this.onUpdate();
        if (null) {
          if (_this._scheduler) {
            _this._scheduler.addToNext(null);
          }
          null.suspend();
          null;
          
        } else {
          _this._scheduler.checkTimeout();
          
        }
      },
      fiber$update :function* _trc_SchedulerMod_f_update(_thread) {
        "use strict";
        var _this=this;
        //var _arguments=Tonyu.A(arguments);
        
        _this.onUpdate();
        if (_thread) {
          if (_this._scheduler) {
            _this._scheduler.addToNext(_thread);
          }
          _thread.suspend();
          (yield* _thread.await(null));
          
        } else {
          _this._scheduler.checkTimeout();
          
        }
        
      },
      onUpdate :function _trc_SchedulerMod_onUpdate() {
        "use strict";
        var _this=this;
        
      },
      updateEx :function _trc_SchedulerMod_updateEx(updateT) {
        "use strict";
        var _this=this;
        var updateCount;
        
        for (updateCount = 0;
         updateCount<updateT ; updateCount++) {
          {
            _this.update();
          }
        }
      },
      fiber$updateEx :function* _trc_SchedulerMod_f_updateEx(_thread,updateT) {
        "use strict";
        var _this=this;
        //var _arguments=Tonyu.A(arguments);
        var updateCount;
        
        for (updateCount = 0;
         updateCount<updateT ; updateCount++) {
          {
            (yield* _this.fiber$update(_thread));
          }
        }
        
      },
      currentThreadGroup :function _trc_SchedulerMod_currentThreadGroup() {
        "use strict";
        var _this=this;
        
        return _this._scheduler;
      },
      wait :function _trc_SchedulerMod_wait(t) {
        "use strict";
        var _this=this;
        
        if (null) {
          null.suspend();
          if (t) {
            null.waitCount=t;
            if (_this._scheduler) {
              _this._scheduler.addToNext(null);
            }
            
          }
          
        } else {
          if (_this._th) {
            if (t) {
              _this._th.waitCount=t;
              
            } else {
              if (_this._th.scheduled) {
                _this._th.scheduled.unschedule(_this._th);
              }
              
            }
            
          }
        }
      },
      fiber$wait :function* _trc_SchedulerMod_f_wait(_thread,t) {
        "use strict";
        var _this=this;
        //var _arguments=Tonyu.A(arguments);
        
        if (_thread) {
          _thread.suspend();
          if (t) {
            _thread.waitCount=t;
            if (_this._scheduler) {
              _this._scheduler.addToNext(_thread);
            }
            
          }
          
        } else {
          if (_this._th) {
            if (t) {
              _this._th.waitCount=t;
              
            } else {
              if (_this._th.scheduled) {
                _this._th.scheduled.unschedule(_this._th);
              }
              
            }
            
          }
        }
        
      },
      notify :function _trc_SchedulerMod_notify() {
        "use strict";
        var _this=this;
        
        if (_this._th) {
          if (_this._th.scheduled) {
            _this._th.waitCount=0;
            
          } else {
            if (_this._scheduler) {
              _this._scheduler.addToCur(_this._th);
            }
            
          }
          
        }
      },
      timeStop :function _trc_SchedulerMod_timeStop() {
        "use strict";
        var _this=this;
        
        return Tonyu.globals.$Boot.timeStop(_this);
      },
      fiber$timeStop :function* _trc_SchedulerMod_f_timeStop(_thread) {
        "use strict";
        var _this=this;
        //var _arguments=Tonyu.A(arguments);
        
        return Tonyu.globals.$Boot.timeStop(_this);
        
      },
      __dummy: false
    };
  },
  decls: {"methods":{"main":{"nowait":false,"isMain":true,"vtype":{"params":[],"returnValue":null}},"initSchedulerMod":{"nowait":false,"isMain":false,"vtype":{"params":[],"returnValue":null}},"update":{"nowait":false,"isMain":false,"vtype":{"params":[],"returnValue":null}},"onUpdate":{"nowait":true,"isMain":false,"vtype":{"params":[],"returnValue":null}},"updateEx":{"nowait":false,"isMain":false,"vtype":{"params":[null],"returnValue":null}},"currentThreadGroup":{"nowait":true,"isMain":false,"vtype":{"params":[],"returnValue":null}},"wait":{"nowait":false,"isMain":false,"vtype":{"params":[null],"returnValue":null}},"notify":{"nowait":true,"isMain":false,"vtype":{"params":[],"returnValue":null}},"timeStop":{"nowait":false,"isMain":false,"vtype":{"params":[],"returnValue":null}}},"fields":{"_scheduler":{},"_th":{}}}
});
Tonyu.klass.define({
  fullName: 'kernel.ThreadGroupMod',
  shortName: 'ThreadGroupMod',
  namespace: 'kernel',
  includes: [],
  methods: function (__superClass) {
    return {
      main :function _trc_ThreadGroupMod_main() {
        "use strict";
        var _this=this;
        
        
      },
      fiber$main :function* _trc_ThreadGroupMod_f_main(_thread) {
        "use strict";
        var _this=this;
        //var _arguments=Tonyu.A(arguments);
        
        
        
      },
      isDeadThreadGroup :function _trc_ThreadGroupMod_isDeadThreadGroup() {
        "use strict";
        var _this=this;
        
        return _this._isDeadThreadGroup=_this._isDeadThreadGroup||(_this._threadGroup&&(_this._threadGroup.objectPoolAge!=_this.tGrpObjectPoolAge||_this._threadGroup.isDeadThreadGroup()));
      },
      fiber$isDeadThreadGroup :function* _trc_ThreadGroupMod_f_isDeadThreadGroup(_thread) {
        "use strict";
        var _this=this;
        //var _arguments=Tonyu.A(arguments);
        
        return _this._isDeadThreadGroup=_this._isDeadThreadGroup||(_this._threadGroup&&(_this._threadGroup.objectPoolAge!=_this.tGrpObjectPoolAge||_this._threadGroup.isDeadThreadGroup()));
        
      },
      setThreadGroup :function _trc_ThreadGroupMod_setThreadGroup(g) {
        "use strict";
        var _this=this;
        
        _this._threadGroup=g;
        _this.tGrpObjectPoolAge=g.objectPoolAge;
      },
      fiber$setThreadGroup :function* _trc_ThreadGroupMod_f_setThreadGroup(_thread,g) {
        "use strict";
        var _this=this;
        //var _arguments=Tonyu.A(arguments);
        
        _this._threadGroup=g;
        _this.tGrpObjectPoolAge=g.objectPoolAge;
        
      },
      killThreadGroup :function _trc_ThreadGroupMod_killThreadGroup() {
        "use strict";
        var _this=this;
        
        _this._isDeadThreadGroup=true;
      },
      fiber$killThreadGroup :function* _trc_ThreadGroupMod_f_killThreadGroup(_thread) {
        "use strict";
        var _this=this;
        //var _arguments=Tonyu.A(arguments);
        
        _this._isDeadThreadGroup=true;
        
      },
      __dummy: false
    };
  },
  decls: {"methods":{"main":{"nowait":false,"isMain":true,"vtype":{"params":[],"returnValue":null}},"isDeadThreadGroup":{"nowait":false,"isMain":false,"vtype":{"params":[],"returnValue":null}},"setThreadGroup":{"nowait":false,"isMain":false,"vtype":{"params":[null],"returnValue":null}},"killThreadGroup":{"nowait":false,"isMain":false,"vtype":{"params":[],"returnValue":null}}},"fields":{"_isDeadThreadGroup":{},"_threadGroup":{},"tGrpObjectPoolAge":{}}}
});
Tonyu.klass.define({
  fullName: 'kernel.TObject',
  shortName: 'TObject',
  namespace: 'kernel',
  includes: [],
  methods: function (__superClass) {
    return {
      main :function _trc_TObject_main() {
        "use strict";
        var _this=this;
        
      },
      fiber$main :function* _trc_TObject_f_main(_thread) {
        "use strict";
        var _this=this;
        //var _arguments=Tonyu.A(arguments);
        
        
      },
      initialize :function _trc_TObject_initialize(options) {
        "use strict";
        var _this=this;
        
        if (typeof  options=="object") {
          _this.extend(options);
        }
        _this.main();
      },
      extend :function _trc_TObject_extend(obj) {
        "use strict";
        var _this=this;
        
        return Tonyu.extend(_this,obj);
      },
      __dummy: false
    };
  },
  decls: {"methods":{"main":{"nowait":false,"isMain":true,"vtype":{"params":[],"returnValue":null}},"new":{"nowait":false,"isMain":false,"vtype":{"params":[null],"returnValue":null}},"extend":{"nowait":true,"isMain":false,"vtype":{"params":[null],"returnValue":null}}},"fields":{}}
});
Tonyu.klass.define({
  fullName: 'kernel.Actor',
  shortName: 'Actor',
  namespace: 'kernel',
  superclass: Tonyu.classes.kernel.TObject,
  includes: [Tonyu.classes.kernel.SchedulerMod,Tonyu.classes.kernel.EventMod,Tonyu.classes.kernel.MathMod,Tonyu.classes.kernel.FileMod,Tonyu.classes.kernel.ThreadGroupMod],
  methods: function (__superClass) {
    return {
      main :function _trc_Actor_main() {
        "use strict";
        var _this=this;
        
      },
      fiber$main :function* _trc_Actor_f_main(_thread) {
        "use strict";
        var _this=this;
        //var _arguments=Tonyu.A(arguments);
        
        
      },
      initialize :function _trc_Actor_initialize(options) {
        "use strict";
        var _this=this;
        
        _this.initSchedulerMod();
        _this.initEventMod();
        if (typeof  options=="object") {
          _this.extend(options);
        }
      },
      print :function _trc_Actor_print() {
        "use strict";
        var _this=this;
        
        console.log.apply(console,arguments);
      },
      loadPage :function _trc_Actor_loadPage() {
        "use strict";
        var _this=this;
        
        Tonyu.globals.$Boot.loadPage.apply(Tonyu.globals.$Boot,arguments);
        _this.update();
      },
      fiber$loadPage :function* _trc_Actor_f_loadPage(_thread) {
        "use strict";
        var _this=this;
        var _arguments=Tonyu.A(arguments);
        
        Tonyu.globals.$Boot.loadPage.apply(Tonyu.globals.$Boot,_arguments);
        (yield* _this.fiber$update(_thread));
        
      },
      __dummy: false
    };
  },
  decls: {"methods":{"main":{"nowait":false,"isMain":true,"vtype":{"params":[],"returnValue":null}},"new":{"nowait":false,"isMain":false,"vtype":{"params":[null],"returnValue":null}},"print":{"nowait":true,"isMain":false,"vtype":{"params":[],"returnValue":null}},"loadPage":{"nowait":false,"isMain":false,"vtype":{"params":[],"returnValue":null}}},"fields":{}}
});
Tonyu.klass.define({
  fullName: 'kernel.Boot',
  shortName: 'Boot',
  namespace: 'kernel',
  superclass: Tonyu.classes.kernel.Actor,
  includes: [],
  methods: function (__superClass) {
    return {
      main :function _trc_Boot_main() {
        "use strict";
        var _this=this;
        
        if (typeof  performance==="undefined") {
          window.performance={};
          
        }
        if (! performance.now) {
          performance.now=(function now() {
            
            return Date.now();
          });
          
        }
        Tonyu.resetLoopCheck(10000);
        Tonyu.globals.$Boot=_this;
        _this.setScheduler(new Tonyu.classes.kernel.Scheduler);
        _this.initGlobals();
        _this.initLayers();
        _this.initPeripherals();
        _this.loadPlugins();
        if (Tonyu.globals.$customLoading) {
          _this.tt = Tonyu.thread();
          
          _this.tt.apply(_this,"loadAssets",[true]);
          _this.tt.steps();
          
        } else {
          _this.loadAssets();
          
        }
        _this.createMainObject();
        _this.progress();
        _this.mainLoop();
        
        
        
      },
      fiber$main :function* _trc_Boot_f_main(_thread) {
        "use strict";
        var _this=this;
        //var _arguments=Tonyu.A(arguments);
        
        if (typeof  performance==="undefined") {
          window.performance={};
          
        }
        if (! performance.now) {
          performance.now=(function now() {
            
            return Date.now();
          });
          
        }
        Tonyu.resetLoopCheck(10000);
        Tonyu.globals.$Boot=_this;
        (yield* _this.fiber$setScheduler(_thread, new Tonyu.classes.kernel.Scheduler));
        (yield* _this.fiber$initGlobals(_thread));
        (yield* _this.fiber$initLayers(_thread));
        (yield* _this.fiber$initPeripherals(_thread));
        (yield* _this.fiber$loadPlugins(_thread));
        if (Tonyu.globals.$customLoading) {
          _this.tt = Tonyu.thread();
          
          _this.tt.apply(_this,"loadAssets",[true]);
          _this.tt.steps();
          
        } else {
          (yield* _this.fiber$loadAssets(_thread));
          
        }
        (yield* _this.fiber$createMainObject(_thread));
        (yield* _this.fiber$progress(_thread));
        (yield* _this.fiber$mainLoop(_thread));
        
        
        
        
      },
      initialize :function _trc_Boot_initialize(param) {
        "use strict";
        var _this=this;
        
        _this.extend(param);
        _this.initSymbol();
        _this._th=Tonyu.thread();
        _this._th.apply(_this,"main");
        _this._th.stepsLoop();
        _this.on("die",(function anonymous_876() {
          
          if (_this._th) {
            _this._th.kill();
          }
        }));
      },
      initSymbol :function _trc_Boot_initSymbol() {
        "use strict";
        var _this=this;
        
        Tonyu.globals.$Symbol={subActors: "__SUBACTOR"};
      },
      fiber$initSymbol :function* _trc_Boot_f_initSymbol(_thread) {
        "use strict";
        var _this=this;
        //var _arguments=Tonyu.A(arguments);
        
        Tonyu.globals.$Symbol={subActors: "__SUBACTOR"};
        
      },
      setScheduler :function _trc_Boot_setScheduler(s) {
        "use strict";
        var _this=this;
        
        _this._scheduler=Tonyu.globals.$Scheduler=s;
      },
      fiber$setScheduler :function* _trc_Boot_f_setScheduler(_thread,s) {
        "use strict";
        var _this=this;
        //var _arguments=Tonyu.A(arguments);
        
        _this._scheduler=Tonyu.globals.$Scheduler=s;
        
      },
      moveToScheduler :function _trc_Boot_moveToScheduler(a,oldS,newS) {
        "use strict";
        var _this=this;
        
        a._scheduler=newS;
        oldS.findByThreadGroup(a).forEach((function anonymous_1175(th) {
          
          if (th.scheduled===newS) {
            return _this;
          }
          oldS.unschedule(th);
          newS.addToNext(th);
          newS.checkDuplicate();
        }));
      },
      fiber$moveToScheduler :function* _trc_Boot_f_moveToScheduler(_thread,a,oldS,newS) {
        "use strict";
        var _this=this;
        //var _arguments=Tonyu.A(arguments);
        
        a._scheduler=newS;
        oldS.findByThreadGroup(a).forEach((function anonymous_1175(th) {
          
          if (th.scheduled===newS) {
            return _this;
          }
          oldS.unschedule(th);
          newS.addToNext(th);
          newS.checkDuplicate();
        }));
        
      },
      timeStop :function _trc_Boot_timeStop(except) {
        "use strict";
        var _this=this;
        var oldS;
        var newS;
        var res;
        
        oldS = _this._scheduler;
        
        _this.setScheduler(new Tonyu.classes.kernel.Scheduler);
        newS = _this._scheduler;
        
        oldS.doTimeStop();
        res = {release: (function anonymous_1521(a) {
          
          if (! a) {
            return res.releaseAll();
          }
          a._scheduler=newS;
          _this.moveToScheduler(a,oldS,newS);
        }),releaseAll: (function anonymous_1922() {
          var a;
          var e;
          
          a = Tonyu.globals.$Screen.all();
          
          for ([e] of Tonyu.iterator2(a,1)) {
            res.release(e);
            
          }
        })};
        
        if (except) {
          res.release(except);
        }
        return res;
      },
      fiber$timeStop :function* _trc_Boot_f_timeStop(_thread,except) {
        "use strict";
        var _this=this;
        //var _arguments=Tonyu.A(arguments);
        var oldS;
        var newS;
        var res;
        
        oldS = _this._scheduler;
        
        (yield* _this.fiber$setScheduler(_thread, new Tonyu.classes.kernel.Scheduler));
        newS = _this._scheduler;
        
        oldS.doTimeStop();
        res = {release: (function anonymous_1521(a) {
          
          if (! a) {
            return res.releaseAll();
          }
          a._scheduler=newS;
          _this.moveToScheduler(a,oldS,newS);
        }),releaseAll: (function anonymous_1922() {
          var a;
          var e;
          
          a = Tonyu.globals.$Screen.all();
          
          for ([e] of Tonyu.iterator2(a,1)) {
            res.release(e);
            
          }
        })};
        
        if (except) {
          res.release(except);
        }
        return res;
        
      },
      update :function _trc_Boot_update() {
        "use strict";
        var _this=this;
        
        _this.waitFor(Tonyu.timeout(50));
      },
      fiber$update :function* _trc_Boot_f_update(_thread) {
        "use strict";
        var _this=this;
        //var _arguments=Tonyu.A(arguments);
        
        (yield* _this.fiber$waitFor(_thread, Tonyu.timeout(50)));
        
      },
      initGlobals :function _trc_Boot_initGlobals() {
        "use strict";
        var _this=this;
        var opt;
        var g;
        var name;
        
        opt = Tonyu.globals.$currentProject.getOptions();
        
        if (opt.run&&opt.run.globals) {
          g = opt.run.globals;
          
          for ([name] of Tonyu.iterator2(g,1)) {
            Tonyu.setGlobal(name,g[name]);
            
          }
          
        }
        Tonyu.globals.$fixProductOrder=true;
      },
      fiber$initGlobals :function* _trc_Boot_f_initGlobals(_thread) {
        "use strict";
        var _this=this;
        //var _arguments=Tonyu.A(arguments);
        var opt;
        var g;
        var name;
        
        opt = Tonyu.globals.$currentProject.getOptions();
        
        if (opt.run&&opt.run.globals) {
          g = opt.run.globals;
          
          for ([name] of Tonyu.iterator2(g,1)) {
            Tonyu.setGlobal(name,g[name]);
            
          }
          
        }
        Tonyu.globals.$fixProductOrder=true;
        
      },
      initPeripherals :function _trc_Boot_initPeripherals() {
        "use strict";
        var _this=this;
        
        Tonyu.globals.$Math=Math;
        Tonyu.globals.$JSON=JSON;
        Tonyu.globals.$printColor=null;
        Tonyu.globals.$printSize=20;
        Tonyu.globals.$consolePrintY=465;
        _this.initFPSParams();
        Tonyu.globals.$mouseX=Tonyu.globals.$mouseX||0;
        Tonyu.globals.$mouseY=Tonyu.globals.$mouseY||0;
        _this.debugCnt=50;
        Tonyu.globals.$printLimit=500;
        if (Tonyu.globals.$debugger) {
          _this.autoReload=Tonyu.globals.$debugger.startWithAutoReload;
          Tonyu.globals.$debugger.on("classChanged",(function anonymous_2825() {
            
            _this.getMainClass();
            if (typeof  _this.autoReload==="function") {
              return _this.autoReload({mainClass: _this.mainClass});
              
            }
            if (_this.autoReload===true&&_this.mainClass) {
              _this.loadPage(_this.mainClass);
              
            }
          }));
          
        }
        _this.pageStack=[];
      },
      fiber$initPeripherals :function* _trc_Boot_f_initPeripherals(_thread) {
        "use strict";
        var _this=this;
        //var _arguments=Tonyu.A(arguments);
        
        Tonyu.globals.$Math=Math;
        Tonyu.globals.$JSON=JSON;
        Tonyu.globals.$printColor=null;
        Tonyu.globals.$printSize=20;
        Tonyu.globals.$consolePrintY=465;
        _this.initFPSParams();
        Tonyu.globals.$mouseX=Tonyu.globals.$mouseX||0;
        Tonyu.globals.$mouseY=Tonyu.globals.$mouseY||0;
        _this.debugCnt=50;
        Tonyu.globals.$printLimit=500;
        if (Tonyu.globals.$debugger) {
          _this.autoReload=Tonyu.globals.$debugger.startWithAutoReload;
          Tonyu.globals.$debugger.on("classChanged",(function anonymous_2825() {
            
            _this.getMainClass();
            if (typeof  _this.autoReload==="function") {
              return _this.autoReload({mainClass: _this.mainClass});
              
            }
            if (_this.autoReload===true&&_this.mainClass) {
              _this.loadPage(_this.mainClass);
              
            }
          }));
          
        }
        _this.pageStack=[];
        
      },
      initLayers :function _trc_Boot_initLayers() {
        "use strict";
        var _this=this;
        
        Tonyu.globals.$screenWidth=465;
        Tonyu.globals.$screenHeight=465;
      },
      fiber$initLayers :function* _trc_Boot_f_initLayers(_thread) {
        "use strict";
        var _this=this;
        //var _arguments=Tonyu.A(arguments);
        
        Tonyu.globals.$screenWidth=465;
        Tonyu.globals.$screenHeight=465;
        
      },
      debug :function _trc_Boot_debug() {
        "use strict";
        var _this=this;
        var a;
        
        if (! _this.debugCnt) {
          return _this;
        }
        _this.debugCnt--;
        a = Array.prototype.slice.call(arguments);
        
        a.unshift(_this.debugCnt);
        a.unshift("DEBUG");
        console.log.apply(console,a);
      },
      fiber$debug :function* _trc_Boot_f_debug(_thread) {
        "use strict";
        var _this=this;
        var _arguments=Tonyu.A(arguments);
        var a;
        
        if (! _this.debugCnt) {
          return _this;
        }
        _this.debugCnt--;
        a = Array.prototype.slice.call(_arguments);
        
        a.unshift(_this.debugCnt);
        a.unshift("DEBUG");
        console.log.apply(console,a);
        
      },
      loadPlugins :function _trc_Boot_loadPlugins() {
        "use strict";
        var _this=this;
        
      },
      fiber$loadPlugins :function* _trc_Boot_f_loadPlugins(_thread) {
        "use strict";
        var _this=this;
        //var _arguments=Tonyu.A(arguments);
        
        
      },
      loadImages :function _trc_Boot_loadImages() {
        "use strict";
        var _this=this;
        
      },
      fiber$loadImages :function* _trc_Boot_f_loadImages(_thread) {
        "use strict";
        var _this=this;
        //var _arguments=Tonyu.A(arguments);
        
        
      },
      loadSounds :function _trc_Boot_loadSounds() {
        "use strict";
        var _this=this;
        
      },
      fiber$loadSounds :function* _trc_Boot_f_loadSounds(_thread) {
        "use strict";
        var _this=this;
        //var _arguments=Tonyu.A(arguments);
        
        
      },
      loadAssets :function _trc_Boot_loadAssets(para) {
        "use strict";
        var _this=this;
        
        if (para) {
          _this.progress();
        }
      },
      fiber$loadAssets :function* _trc_Boot_f_loadAssets(_thread,para) {
        "use strict";
        var _this=this;
        //var _arguments=Tonyu.A(arguments);
        
        if (para) {
          (yield* _this.fiber$progress(_thread));
        }
        
      },
      getIDE :function _trc_Boot_getIDE() {
        "use strict";
        var _this=this;
        var e;
        
        try {
          return (parent.Tonyu.globals.$currentProject.ide);
          
        } catch (e) {
          return null;
          
        }
      },
      fiber$getIDE :function* _trc_Boot_f_getIDE(_thread) {
        "use strict";
        var _this=this;
        //var _arguments=Tonyu.A(arguments);
        var e;
        
        try {
          return (parent.Tonyu.globals.$currentProject.ide);
          
        } catch (e) {
          return null;
          
        }
        
      },
      getMainClass :function _trc_Boot_getMainClass() {
        "use strict";
        var _this=this;
        var o;
        var mainClassName;
        
        o = Tonyu.globals.$currentProject.getOptions();
        
        mainClassName = o.run.mainClass;
        
        _this.progress("MainClass= "+mainClassName);
        _this.mainClass=Tonyu.getClass(mainClassName);
        if (! _this.mainClass) {
          throw new Error(mainClassName+" というクラスはありません");
          
          
        }
      },
      fiber$getMainClass :function* _trc_Boot_f_getMainClass(_thread) {
        "use strict";
        var _this=this;
        //var _arguments=Tonyu.A(arguments);
        var o;
        var mainClassName;
        
        o = Tonyu.globals.$currentProject.getOptions();
        
        mainClassName = o.run.mainClass;
        
        (yield* _this.fiber$progress(_thread, "MainClass= "+mainClassName));
        _this.mainClass=Tonyu.getClass(mainClassName);
        if (! _this.mainClass) {
          throw new Error(mainClassName+" というクラスはありません");
          
          
        }
        
      },
      createMainObject :function _trc_Boot_createMainObject() {
        "use strict";
        var _this=this;
        
        _this.getMainClass();
        new _this.mainClass();
      },
      fiber$createMainObject :function* _trc_Boot_f_createMainObject(_thread) {
        "use strict";
        var _this=this;
        //var _arguments=Tonyu.A(arguments);
        
        (yield* _this.fiber$getMainClass(_thread));
        new _this.mainClass();
        
      },
      loadPage :function _trc_Boot_loadPage(page,arg,options) {
        "use strict";
        var _this=this;
        var push;
        var pass;
        var res;
        var oldS;
        var newS;
        var saved;
        var pa;
        
        switch (typeof  arg) {
        case "function":
          options={onLoad: arg};
          arg=undefined;
          break;
          
        case "boolean":
          options={push: arg};
          arg=undefined;
          break;
          
        }
        options=options||{};
        push = (options.push);
        
        pass = (options.pass||[]).concat(Tonyu.globals.$excludeFromAll.toArray());
        
        
        oldS = _this._scheduler;
        
        if (! page) {
          saved = _this.pageStack.pop();
          
          if (! saved) {
            throw new Error(R("noPushedPages"));
            
            
          }
          newS=saved.scheduler;
          _this.setScheduler(newS);
          for ([pa] of Tonyu.iterator2(saved.pass,1)) {
            _this.moveToScheduler(pa,oldS,newS);
            
          }
          
        } else {
          if (push) {
            saved = {scheduler: oldS,sprites: Tonyu.globals.$Screen.saveAndClear(pass),t2World: Tonyu.globals.$t2World,pass: pass};
            
            newS=new Tonyu.classes.kernel.Scheduler;
            _this.setScheduler(newS);
            for ([pa] of Tonyu.iterator2(pass,1)) {
              _this.moveToScheduler(pa,oldS,newS);
              
            }
            _this.pageStack.push(saved);
            res=new page(arg);
            
          } else {
            res=new page(arg);
            
          }
        }
        if (typeof  options.onLoad==="function") {
          options.onLoad({page: res});
        }
      },
      fiber$loadPage :function* _trc_Boot_f_loadPage(_thread,page,arg,options) {
        "use strict";
        var _this=this;
        //var _arguments=Tonyu.A(arguments);
        var push;
        var pass;
        var res;
        var oldS;
        var newS;
        var saved;
        var pa;
        
        switch (typeof  arg) {
        case "function":
          options={onLoad: arg};
          arg=undefined;
          break;
          
        case "boolean":
          options={push: arg};
          arg=undefined;
          break;
          
        }
        options=options||{};
        push = (options.push);
        
        pass = (options.pass||[]).concat(Tonyu.globals.$excludeFromAll.toArray());
        
        
        oldS = _this._scheduler;
        
        if (! page) {
          saved = _this.pageStack.pop();
          
          if (! saved) {
            throw new Error(R("noPushedPages"));
            
            
          }
          newS=saved.scheduler;
          (yield* _this.fiber$setScheduler(_thread, newS));
          for ([pa] of Tonyu.iterator2(saved.pass,1)) {
            (yield* _this.fiber$moveToScheduler(_thread, pa, oldS, newS));
            
          }
          
        } else {
          if (push) {
            saved = {scheduler: oldS,sprites: Tonyu.globals.$Screen.saveAndClear(pass),t2World: Tonyu.globals.$t2World,pass: pass};
            
            newS=new Tonyu.classes.kernel.Scheduler;
            (yield* _this.fiber$setScheduler(_thread, newS));
            for ([pa] of Tonyu.iterator2(pass,1)) {
              (yield* _this.fiber$moveToScheduler(_thread, pa, oldS, newS));
              
            }
            _this.pageStack.push(saved);
            res=new page(arg);
            
          } else {
            res=new page(arg);
            
          }
        }
        if (typeof  options.onLoad==="function") {
          options.onLoad({page: res});
        }
        
      },
      hide :function _trc_Boot_hide() {
        "use strict";
        var _this=this;
        
      },
      fiber$hide :function* _trc_Boot_f_hide(_thread) {
        "use strict";
        var _this=this;
        //var _arguments=Tonyu.A(arguments);
        
        
      },
      schedule :function _trc_Boot_schedule(obj,method,args) {
        "use strict";
        var _this=this;
        var s;
        var th;
        
        if (! method) {
          throw new Error("指定されたメソッドは定義されていません:"+method);
          
        }
        args=args||[];
        s = obj._scheduler||_this._scheduler;
        
        th = s.newThread(obj,method,args);
        
        obj.setThreadGroup(_this);
        th.setThreadGroup(obj);
        return th;
      },
      fiber$schedule :function* _trc_Boot_f_schedule(_thread,obj,method,args) {
        "use strict";
        var _this=this;
        //var _arguments=Tonyu.A(arguments);
        var s;
        var th;
        
        if (! method) {
          throw new Error("指定されたメソッドは定義されていません:"+method);
          
        }
        args=args||[];
        s = obj._scheduler||_this._scheduler;
        
        th = s.newThread(obj,method,args);
        
        obj.setThreadGroup(_this);
        th.setThreadGroup(obj);
        return th;
        
      },
      progress :function _trc_Boot_progress(m) {
        "use strict";
        var _this=this;
        
        if (typeof  SplashScreen=="undefined") {
          return _this;
        }
        if (m) {
          console.log.apply(console,arguments);
          SplashScreen.progress(m);
          
        } else {
          SplashScreen.hide();
        }
      },
      fiber$progress :function* _trc_Boot_f_progress(_thread,m) {
        "use strict";
        var _this=this;
        var _arguments=Tonyu.A(arguments);
        
        if (typeof  SplashScreen=="undefined") {
          return _this;
        }
        if (m) {
          console.log.apply(console,_arguments);
          SplashScreen.progress(m);
          
        } else {
          SplashScreen.hide();
        }
        
      },
      progressNoLog :function _trc_Boot_progressNoLog(m) {
        "use strict";
        var _this=this;
        
        if (typeof  SplashScreen=="undefined") {
          return _this;
        }
        if (m) {
          SplashScreen.progress(m);
          
        } else {
          SplashScreen.hide();
        }
      },
      fiber$progressNoLog :function* _trc_Boot_f_progressNoLog(_thread,m) {
        "use strict";
        var _this=this;
        //var _arguments=Tonyu.A(arguments);
        
        if (typeof  SplashScreen=="undefined") {
          return _this;
        }
        if (m) {
          SplashScreen.progress(m);
          
        } else {
          SplashScreen.hide();
        }
        
      },
      mainLoop :function _trc_Boot_mainLoop() {
        "use strict";
        var _this=this;
        
        Tonyu.globals.$frameCount=0;
        Tonyu.globals.$drawnFrameCount=0;
        while (true) {
          _this.loopTimer();
          Tonyu.globals.$drawnFrameCount++;
          
        }
      },
      fiber$mainLoop :function* _trc_Boot_f_mainLoop(_thread) {
        "use strict";
        var _this=this;
        //var _arguments=Tonyu.A(arguments);
        
        Tonyu.globals.$frameCount=0;
        Tonyu.globals.$drawnFrameCount=0;
        while (true) {
          (yield* _this.fiber$loopTimer(_thread));
          Tonyu.globals.$drawnFrameCount++;
          
        }
        
      },
      loopTimer :function _trc_Boot_loopTimer() {
        "use strict";
        var _this=this;
        
        _this.moveFrame();
        _this.afterDraw({drawn: false});
        _this.waitFrame();
      },
      fiber$loopTimer :function* _trc_Boot_f_loopTimer(_thread) {
        "use strict";
        var _this=this;
        //var _arguments=Tonyu.A(arguments);
        
        _this.moveFrame();
        _this.afterDraw({drawn: false});
        (yield* _this.fiber$waitFrame(_thread));
        
      },
      drawFrame :function _trc_Boot_drawFrame() {
        "use strict";
        var _this=this;
        
      },
      moveFrame :function _trc_Boot_moveFrame() {
        "use strict";
        var _this=this;
        var s;
        var sc;
        
        s = _this.now();
        
        Tonyu.globals.$_printCount=0;
        Tonyu.resetLoopCheck();
        sc = _this._scheduler.stepsAll();
        
        if (Tonyu.globals.$sound) {
          Tonyu.globals.$sound.resetSEFrame();
        }
        _this.moveTime=_this.now()-s;
        Tonyu.globals.$frameCount++;
      },
      afterDraw :function _trc_Boot_afterDraw(e) {
        "use strict";
        var _this=this;
        
        _this.sendEvent("afterDraw",e);
      },
      initFPSParams :function _trc_Boot_initFPSParams() {
        "use strict";
        var _this=this;
        
      },
      now :function _trc_Boot_now() {
        "use strict";
        var _this=this;
        
        return performance.now();
      },
      waitFrame :function _trc_Boot_waitFrame() {
        "use strict";
        var _this=this;
        
        _this.waitFor(Tonyu.timeout(0));
      },
      fiber$waitFrame :function* _trc_Boot_f_waitFrame(_thread) {
        "use strict";
        var _this=this;
        //var _arguments=Tonyu.A(arguments);
        
        (yield* _this.fiber$waitFor(_thread, Tonyu.timeout(0)));
        
      },
      setFrameRate :function _trc_Boot_setFrameRate(fps,maxFrameSkip) {
        "use strict";
        var _this=this;
        
      },
      setEconomyMode :function _trc_Boot_setEconomyMode(options) {
        "use strict";
        var _this=this;
        
        _this.economyMode=options;
      },
      fiber$setEconomyMode :function* _trc_Boot_f_setEconomyMode(_thread,options) {
        "use strict";
        var _this=this;
        //var _arguments=Tonyu.A(arguments);
        
        _this.economyMode=options;
        
      },
      __dummy: false
    };
  },
  decls: {"methods":{"main":{"nowait":false,"isMain":true,"vtype":{"params":[],"returnValue":null}},"new":{"nowait":false,"isMain":false,"vtype":{"params":[null],"returnValue":null}},"initSymbol":{"nowait":false,"isMain":false,"vtype":{"params":[],"returnValue":null}},"setScheduler":{"nowait":false,"isMain":false,"vtype":{"params":[null],"returnValue":null}},"moveToScheduler":{"nowait":false,"isMain":false,"vtype":{"params":["kernel.Actor","kernel.Scheduler","kernel.Scheduler"],"returnValue":null}},"timeStop":{"nowait":false,"isMain":false,"vtype":{"params":[null],"returnValue":null}},"update":{"nowait":false,"isMain":false,"vtype":{"params":[],"returnValue":null}},"initGlobals":{"nowait":false,"isMain":false,"vtype":{"params":[],"returnValue":null}},"initPeripherals":{"nowait":false,"isMain":false,"vtype":{"params":[],"returnValue":null}},"initLayers":{"nowait":false,"isMain":false,"vtype":{"params":[],"returnValue":null}},"debug":{"nowait":false,"isMain":false,"vtype":{"params":[],"returnValue":null}},"loadPlugins":{"nowait":false,"isMain":false,"vtype":{"params":[],"returnValue":null}},"loadImages":{"nowait":false,"isMain":false,"vtype":{"params":[],"returnValue":null}},"loadSounds":{"nowait":false,"isMain":false,"vtype":{"params":[],"returnValue":null}},"loadAssets":{"nowait":false,"isMain":false,"vtype":{"params":[null],"returnValue":null}},"getIDE":{"nowait":false,"isMain":false,"vtype":{"params":[],"returnValue":null}},"getMainClass":{"nowait":false,"isMain":false,"vtype":{"params":[],"returnValue":null}},"createMainObject":{"nowait":false,"isMain":false,"vtype":{"params":[],"returnValue":null}},"loadPage":{"nowait":false,"isMain":false,"vtype":{"params":[null,null,null],"returnValue":null}},"hide":{"nowait":false,"isMain":false,"vtype":{"params":[],"returnValue":null}},"schedule":{"nowait":false,"isMain":false,"vtype":{"params":[null,null,null],"returnValue":null}},"progress":{"nowait":false,"isMain":false,"vtype":{"params":[null],"returnValue":null}},"progressNoLog":{"nowait":false,"isMain":false,"vtype":{"params":[null],"returnValue":null}},"mainLoop":{"nowait":false,"isMain":false,"vtype":{"params":[],"returnValue":null}},"loopTimer":{"nowait":false,"isMain":false,"vtype":{"params":[],"returnValue":null}},"drawFrame":{"nowait":true,"isMain":false,"vtype":{"params":[],"returnValue":null}},"moveFrame":{"nowait":true,"isMain":false,"vtype":{"params":[],"returnValue":null}},"afterDraw":{"nowait":true,"isMain":false,"vtype":{"params":[null],"returnValue":null}},"initFPSParams":{"nowait":true,"isMain":false,"vtype":{"params":[],"returnValue":null}},"now":{"nowait":true,"isMain":false,"vtype":{"params":[],"returnValue":null}},"waitFrame":{"nowait":false,"isMain":false,"vtype":{"params":[],"returnValue":null}},"setFrameRate":{"nowait":true,"isMain":false,"vtype":{"params":[null,null],"returnValue":null}},"setEconomyMode":{"nowait":false,"isMain":false,"vtype":{"params":[null],"returnValue":null}}},"fields":{"tt":{},"debugCnt":{},"autoReload":{},"mainClass":{},"pageStack":{},"moveTime":{},"economyMode":{}}}
});
Tonyu.klass.define({
  fullName: 'kernel.EventHandler',
  shortName: 'EventHandler',
  namespace: 'kernel',
  superclass: Tonyu.classes.kernel.TObject,
  includes: [Tonyu.classes.kernel.EventHandlerCaller],
  methods: function (__superClass) {
    return {
      main :function _trc_EventHandler_main() {
        "use strict";
        var _this=this;
        
        "field strict";
        
      },
      fiber$main :function* _trc_EventHandler_f_main(_thread) {
        "use strict";
        var _this=this;
        //var _arguments=Tonyu.A(arguments);
        
        "field strict";
        
        
      },
      initialize :function _trc_EventHandler_initialize(param) {
        "use strict";
        var _this=this;
        
        __superClass.apply( _this, [param]);
        _this.listeners=[];
      },
      toListener :function _trc_EventHandler_toListener(f) {
        "use strict";
        var _this=this;
        
        if (_this.target&&(typeof  f)=="string") {
          f=_this.target[f];
          
        }
        if (typeof  f!="function") {
          throw new Error("Not a event listener: "+_this.target+" / "+f);
          
        }
        return f;
      },
      newListener :function _trc_EventHandler_newListener(f) {
        "use strict";
        var _this=this;
        var listener;
        
        listener = {action: f};
        
        return listener;
      },
      addListener :function _trc_EventHandler_addListener() {
        "use strict";
        var _this=this;
        var a;
        var f;
        var listener;
        
        a = new Tonyu.classes.kernel.ArgParser(arguments).toArray();
        
        f = a.pop();
        
        f=_this.toListener(f);
        a.push(f);
        listener = Tonyu.bindFunc(_this,_this.newListener).apply(_this,a);
        
        listener.remove=(function anonymous_700() {
          
          _this.removeListener(listener);
        });
        listener.dispose=listener.dispose||(function anonymous_785() {
          
        });
        listener.action=listener.action||f;
        _this.listeners.push(listener);
        return listener;
      },
      doDispose :function _trc_EventHandler_doDispose(listener) {
        "use strict";
        var _this=this;
        
        if (typeof  listener.dispose==="function") {
          listener.dispose({last: _this.listeners.length==0,listener: listener});
          
        }
      },
      removeListener :function _trc_EventHandler_removeListener(listener) {
        "use strict";
        var _this=this;
        var i;
        
        i = _this.listeners.indexOf(listener);
        
        if (i>=0) {
          _this.listeners.splice(i,1);
          _this.doDispose(listener);
          
        }
      },
      removeAllListeners :function _trc_EventHandler_removeAllListeners() {
        "use strict";
        var _this=this;
        var listener;
        
        
        while (listener=_this.listeners.shift()) {
          _this.doDispose(listener);
          
        }
      },
      fire :function _trc_EventHandler_fire(args) {
        "use strict";
        var _this=this;
        var listener;
        
        if (_this.released) {
          return _this;
        }
        for ([listener] of Tonyu.iterator2(_this.listeners.slice(),1)) {
          _this.callEventHandler(listener.action,args);
          
        }
      },
      fiber$fire :function* _trc_EventHandler_f_fire(_thread,args) {
        "use strict";
        var _this=this;
        //var _arguments=Tonyu.A(arguments);
        var listener;
        
        if (_this.released) {
          return _this;
        }
        for ([listener] of Tonyu.iterator2(_this.listeners.slice(),1)) {
          (yield* _this.fiber$callEventHandler(_thread, listener.action, args));
          
        }
        
      },
      release :function _trc_EventHandler_release() {
        "use strict";
        var _this=this;
        
        _this.released=true;
        _this.removeAllListeners();
      },
      __dummy: false
    };
  },
  decls: {"methods":{"main":{"nowait":false,"isMain":true,"vtype":{"params":[],"returnValue":null}},"new":{"nowait":false,"isMain":false,"vtype":{"params":[null],"returnValue":null}},"toListener":{"nowait":true,"isMain":false,"vtype":{"params":[null],"returnValue":null}},"newListener":{"nowait":true,"isMain":false,"vtype":{"params":[null],"returnValue":null}},"addListener":{"nowait":true,"isMain":false,"vtype":{"params":[],"returnValue":null}},"doDispose":{"nowait":true,"isMain":false,"vtype":{"params":[null],"returnValue":null}},"removeListener":{"nowait":true,"isMain":false,"vtype":{"params":[null],"returnValue":null}},"removeAllListeners":{"nowait":true,"isMain":false,"vtype":{"params":[],"returnValue":null}},"fire":{"nowait":false,"isMain":false,"vtype":{"params":[null],"returnValue":null}},"release":{"nowait":true,"isMain":false,"vtype":{"params":[],"returnValue":null}}},"fields":{"listeners":{},"target":{},"released":{}}}
});
Tonyu.klass.define({
  fullName: 'kernel.KernelDemo',
  shortName: 'KernelDemo',
  namespace: 'kernel',
  superclass: Tonyu.classes.kernel.Actor,
  includes: [],
  methods: function (__superClass) {
    return {
      main :function _trc_KernelDemo_main() {
        "use strict";
        var _this=this;
        
        
        _this.x=_this.y=100;
        while (_this.x<200) {
          _this.x++;
          _this.print(_this.x);
          _this.update();
          
        }
      },
      fiber$main :function* _trc_KernelDemo_f_main(_thread) {
        "use strict";
        var _this=this;
        //var _arguments=Tonyu.A(arguments);
        
        
        _this.x=_this.y=100;
        while (_this.x<200) {
          _this.x++;
          _this.print(_this.x);
          (yield* _this.fiber$update(_thread));
          
        }
        
      },
      __dummy: false
    };
  },
  decls: {"methods":{"main":{"nowait":false,"isMain":true,"vtype":{"params":[],"returnValue":null}}},"fields":{"x":{},"y":{}}}
});
Tonyu.klass.define({
  fullName: 'kernel.Matrix',
  shortName: 'Matrix',
  namespace: 'kernel',
  superclass: Tonyu.classes.kernel.TObject,
  includes: [Tonyu.classes.kernel.MathMod,Tonyu.classes.kernel.EventMod,Tonyu.classes.kernel.FileMod],
  methods: function (__superClass) {
    return {
      main :function _trc_Matrix_main() {
        "use strict";
        var _this=this;
        
        
        
        
      },
      fiber$main :function* _trc_Matrix_f_main(_thread) {
        "use strict";
        var _this=this;
        //var _arguments=Tonyu.A(arguments);
        
        
        
        
        
      },
      initialize :function _trc_Matrix_initialize(d) {
        "use strict";
        var _this=this;
        
        _this.data={}||d;
      },
      fromArray :function _trc_Matrix_fromArray(array) {
        "use strict";
        var _this=this;
        var i;
        var row;
        var j;
        var val;
        
        for ([i, row] of Tonyu.iterator2(array,2)) {
          for ([j, val] of Tonyu.iterator2(row,2)) {
            _this.set(j,i,val);
            
          }
          
        }
      },
      fiber$fromArray :function* _trc_Matrix_f_fromArray(_thread,array) {
        "use strict";
        var _this=this;
        //var _arguments=Tonyu.A(arguments);
        var i;
        var row;
        var j;
        var val;
        
        for ([i, row] of Tonyu.iterator2(array,2)) {
          for ([j, val] of Tonyu.iterator2(row,2)) {
            (yield* _this.fiber$set(_thread, j, i, val));
            
          }
          
        }
        
      },
      toArray :function _trc_Matrix_toArray() {
        "use strict";
        var _this=this;
        var res;
        var i;
        var row;
        var j;
        
        res = [];
        
        for (i = 0;
         i<=_this.ymax ; i++) {
          {
            row = [];
            
            res.push(row);
            for (j = 0;
             j<=_this.xmax ; j++) {
              {
                row.push(_this.get(j,i));
              }
            }
          }
        }
        return res;
      },
      fiber$toArray :function* _trc_Matrix_f_toArray(_thread) {
        "use strict";
        var _this=this;
        //var _arguments=Tonyu.A(arguments);
        var res;
        var i;
        var row;
        var j;
        
        res = [];
        
        for (i = 0;
         i<=_this.ymax ; i++) {
          {
            row = [];
            
            res.push(row);
            for (j = 0;
             j<=_this.xmax ; j++) {
              {
                row.push(_this.get(j,i));
              }
            }
          }
        }
        return res;
        
      },
      load :function _trc_Matrix_load(csvFile) {
        "use strict";
        var _this=this;
        var f;
        var x;
        var y;
        var SEP;
        var lines;
        var l;
        
        f = _this.file(csvFile);
        
        x = 0;
        y = 0;
        
        SEP = ",";
        
        lines = f.lines();
        
        for ([l] of Tonyu.iterator2(lines,1)) {
          let row = l.split(SEP);
          
          x=0;
          for (let [cell] of Tonyu.iterator2(row,1)) {
            _this.set(x,y,cell);
            x++;
            
          }
          y++;
          
        }
      },
      fiber$load :function* _trc_Matrix_f_load(_thread,csvFile) {
        "use strict";
        var _this=this;
        //var _arguments=Tonyu.A(arguments);
        var f;
        var x;
        var y;
        var SEP;
        var lines;
        var l;
        
        f=yield* _this.fiber$file(_thread, csvFile);
        
        x = 0;
        y = 0;
        
        SEP = ",";
        
        lines = f.lines();
        
        for ([l] of Tonyu.iterator2(lines,1)) {
          let row = l.split(SEP);
          
          x=0;
          for (let [cell] of Tonyu.iterator2(row,1)) {
            (yield* _this.fiber$set(_thread, x, y, cell));
            x++;
            
          }
          y++;
          
        }
        
      },
      cross :function _trc_Matrix_cross(col,row) {
        "use strict";
        var _this=this;
        var colr;
        var rowr;
        
        colr = _this.find(col);
        
        rowr = _this.find(row);
        
        return _this.get(colr.x,rowr.y);
      },
      fiber$cross :function* _trc_Matrix_f_cross(_thread,col,row) {
        "use strict";
        var _this=this;
        //var _arguments=Tonyu.A(arguments);
        var colr;
        var rowr;
        
        colr=yield* _this.fiber$find(_thread, col);
        
        rowr=yield* _this.fiber$find(_thread, row);
        
        return yield* _this.fiber$get(_thread, colr.x, rowr.y);
        
        
      },
      search :function _trc_Matrix_search(cell,options) {
        "use strict";
        var _this=this;
        var k;
        var v;
        
        for ([k, v] of Tonyu.iterator2(_this.data,2)) {
          if (v===cell) {
            return _this.unkey(k);
            
          }
          
        }
      },
      fiber$search :function* _trc_Matrix_f_search(_thread,cell,options) {
        "use strict";
        var _this=this;
        //var _arguments=Tonyu.A(arguments);
        var k;
        var v;
        
        for ([k, v] of Tonyu.iterator2(_this.data,2)) {
          if (v===cell) {
            return yield* _this.fiber$unkey(_thread, k);
            
            
          }
          
        }
        
      },
      find :function _trc_Matrix_find() {
        "use strict";
        var _this=this;
        var r;
        
        r = Tonyu.bindFunc(_this,_this.search).apply(_this,arguments);
        
        if (r==null) {
          throw new Error(arguments[0]+" not found.");
          
          
        }
        return r;
      },
      fiber$find :function* _trc_Matrix_f_find(_thread) {
        "use strict";
        var _this=this;
        var _arguments=Tonyu.A(arguments);
        var r;
        
        r = Tonyu.bindFunc(_this,_this.search).apply(_this,_arguments);
        
        if (r==null) {
          throw new Error(_arguments[0]+" not found.");
          
          
        }
        return r;
        
      },
      crop :function _trc_Matrix_crop() {
        "use strict";
        var _this=this;
        var a;
        var o;
        var r;
        var y;
        var x;
        
        a = new Tonyu.classes.kernel.ArgParser(arguments);
        
        o = a.parseOptions("left,top,right,bottom,width,height,keepXY");
        
        r = new Tonyu.classes.kernel.Matrix;
        
        if (o.width) {
          o.right=o.left+o.width-1;
        }
        if (o.height) {
          o.bottom=o.top+o.height-1;
        }
        if (o.right==null) {
          o.right=_this.xmax;
        }
        if (o.bottom==null) {
          o.bottom=_this.ymax;
        }
        for (y = o.top;
         y<=o.bottom ; y++) {
          {
            for (x = o.left;
             x<=o.right ; x++) {
              {
                if (o.keepXY) {
                  r.set(x,y,_this.get(x,y));
                  
                } else {
                  r.set(x-o.left,y-o.top,_this.get(x,y));
                  
                }
              }
            }
          }
        }
        return r;
      },
      fiber$crop :function* _trc_Matrix_f_crop(_thread) {
        "use strict";
        var _this=this;
        var _arguments=Tonyu.A(arguments);
        var a;
        var o;
        var r;
        var y;
        var x;
        
        a = new Tonyu.classes.kernel.ArgParser(_arguments);
        
        o = a.parseOptions("left,top,right,bottom,width,height,keepXY");
        
        r = new Tonyu.classes.kernel.Matrix;
        
        if (o.width) {
          o.right=o.left+o.width-1;
        }
        if (o.height) {
          o.bottom=o.top+o.height-1;
        }
        if (o.right==null) {
          o.right=_this.xmax;
        }
        if (o.bottom==null) {
          o.bottom=_this.ymax;
        }
        for (y = o.top;
         y<=o.bottom ; y++) {
          {
            for (x = o.left;
             x<=o.right ; x++) {
              {
                if (o.keepXY) {
                  r.set(x,y,_this.get(x,y));
                  
                } else {
                  r.set(x-o.left,y-o.top,_this.get(x,y));
                  
                }
              }
            }
          }
        }
        return r;
        
      },
      rev :function _trc_Matrix_rev(line) {
        "use strict";
        var _this=this;
        var res;
        var e;
        
        res = [];
        
        for ([e] of Tonyu.iterator2(line,1)) {
          res.unshift(e);
          
        }
        return res;
      },
      fiber$rev :function* _trc_Matrix_f_rev(_thread,line) {
        "use strict";
        var _this=this;
        //var _arguments=Tonyu.A(arguments);
        var res;
        var e;
        
        res = [];
        
        for ([e] of Tonyu.iterator2(line,1)) {
          res.unshift(e);
          
        }
        return res;
        
      },
      keysIterator :function _trc_Matrix_keysIterator() {
        "use strict";
        var _this=this;
        
        return {tonyuIterator: Tonyu.bindFunc(_this,_this.tonyuIteratorKeys)};
      },
      fiber$keysIterator :function* _trc_Matrix_f_keysIterator(_thread) {
        "use strict";
        var _this=this;
        //var _arguments=Tonyu.A(arguments);
        
        return {tonyuIterator: Tonyu.bindFunc(_this,_this.tonyuIteratorKeys)};
        
      },
      rectIterator :function _trc_Matrix_rectIterator() {
        "use strict";
        var _this=this;
        
        return {tonyuIterator: Tonyu.bindFunc(_this,_this.tonyuIteratorRect)};
      },
      fiber$rectIterator :function* _trc_Matrix_f_rectIterator(_thread) {
        "use strict";
        var _this=this;
        //var _arguments=Tonyu.A(arguments);
        
        return {tonyuIterator: Tonyu.bindFunc(_this,_this.tonyuIteratorRect)};
        
      },
      tonyuIteratorKeys :function _trc_Matrix_tonyuIteratorKeys(arity) {
        "use strict";
        var _this=this;
        var res;
        var k;
        var v;
        
        res = {i: 0,keys: []};
        
        for ([k, v] of Tonyu.iterator2(_this.data,2)) {
          res.keys.push(k);
          
        }
        switch (arity) {
        case 3:
          res.next=(function anonymous_2386() {
            var key;
            var xy;
            
            if (res.i>=res.keys.length) {
              return false;
            }
            key = res.keys[res.i];
            
            res.i++;
            xy = _this.unkey(key);
            
            res[0]=xy.x;
            res[1]=xy.y;
            res[2]=_this.data[key];
            return true;
          });
          break;
          
        default:
          throw new Error("Matrix: in の前には3つの変数が必要です");
          
        }
        return res;
      },
      fiber$tonyuIteratorKeys :function* _trc_Matrix_f_tonyuIteratorKeys(_thread,arity) {
        "use strict";
        var _this=this;
        //var _arguments=Tonyu.A(arguments);
        var res;
        var k;
        var v;
        
        res = {i: 0,keys: []};
        
        for ([k, v] of Tonyu.iterator2(_this.data,2)) {
          res.keys.push(k);
          
        }
        switch (arity) {
        case 3:
          res.next=(function anonymous_2386() {
            var key;
            var xy;
            
            if (res.i>=res.keys.length) {
              return false;
            }
            key = res.keys[res.i];
            
            res.i++;
            xy = _this.unkey(key);
            
            res[0]=xy.x;
            res[1]=xy.y;
            res[2]=_this.data[key];
            return true;
          });
          break;
          
        default:
          throw new Error("Matrix: in の前には3つの変数が必要です");
          
        }
        return res;
        
      },
      tonyuIterator :function _trc_Matrix_tonyuIterator(arity) {
        "use strict";
        var _this=this;
        
        if (_this.iterateMode==="keys") {
          return _this.tonyuIteratorKeys(arity);
        }
        return _this.tonyuIteratorRect(arity);
      },
      fiber$tonyuIterator :function* _trc_Matrix_f_tonyuIterator(_thread,arity) {
        "use strict";
        var _this=this;
        //var _arguments=Tonyu.A(arguments);
        
        if (_this.iterateMode==="keys") {
          return yield* _this.fiber$tonyuIteratorKeys(_thread, arity);
          
        }
        return yield* _this.fiber$tonyuIteratorRect(_thread, arity);
        
        
      },
      tonyuIteratorRect :function _trc_Matrix_tonyuIteratorRect(arity) {
        "use strict";
        var _this=this;
        var res;
        
        res = {x: _this.xmin,y: _this.ymin,cnt: 0};
        
        if (_this.xmin==null||_this.ymin==null||_this.xmax==null||_this.ymax==null) {
          res.next=(function anonymous_3077() {
            
            return false;
          });
          return res;
          
        }
        switch (arity) {
        case 3:
          res.next=(function anonymous_3179() {
            
            if (res.x>_this.xmax) {
              res.x=_this.xmin;
              res.y++;
              
            }
            if (res.y<=_this.ymax) {
              res[0]=res.x;
              res[1]=res.y;
              res[2]=_this.get(res.x,res.y);
              res.x++;
              return true;
              
            }
            return false;
          });
          break;
          
        default:
          throw new Error("Matrix: in の前には3つの変数が必要です");
          
        }
        return res;
      },
      fiber$tonyuIteratorRect :function* _trc_Matrix_f_tonyuIteratorRect(_thread,arity) {
        "use strict";
        var _this=this;
        //var _arguments=Tonyu.A(arguments);
        var res;
        
        res = {x: _this.xmin,y: _this.ymin,cnt: 0};
        
        if (_this.xmin==null||_this.ymin==null||_this.xmax==null||_this.ymax==null) {
          res.next=(function anonymous_3077() {
            
            return false;
          });
          return res;
          
        }
        switch (arity) {
        case 3:
          res.next=(function anonymous_3179() {
            
            if (res.x>_this.xmax) {
              res.x=_this.xmin;
              res.y++;
              
            }
            if (res.y<=_this.ymax) {
              res[0]=res.x;
              res[1]=res.y;
              res[2]=_this.get(res.x,res.y);
              res.x++;
              return true;
              
            }
            return false;
          });
          break;
          
        default:
          throw new Error("Matrix: in の前には3つの変数が必要です");
          
        }
        return res;
        
      },
      unkey :function _trc_Matrix_unkey(key) {
        "use strict";
        var _this=this;
        var r;
        
        r = key.split(",");
        
        return {x: r[0]-0,y: r[1]-0};
      },
      fiber$unkey :function* _trc_Matrix_f_unkey(_thread,key) {
        "use strict";
        var _this=this;
        //var _arguments=Tonyu.A(arguments);
        var r;
        
        r = key.split(",");
        
        return {x: r[0]-0,y: r[1]-0};
        
      },
      key :function _trc_Matrix_key(x,y,updateRange) {
        "use strict";
        var _this=this;
        
        x=_this.floor(x)||0;
        y=_this.floor(y)||0;
        if (updateRange) {
          if (_this.xmin==null||x<_this.xmin) {
            _this.xmin=x;
          }
          if (_this.xmax==null||x>_this.xmax) {
            _this.xmax=x;
          }
          if (_this.ymin==null||y<_this.ymin) {
            _this.ymin=y;
          }
          if (_this.ymax==null||y>_this.ymax) {
            _this.ymax=y;
          }
          
        }
        return x+","+y;
      },
      fiber$key :function* _trc_Matrix_f_key(_thread,x,y,updateRange) {
        "use strict";
        var _this=this;
        //var _arguments=Tonyu.A(arguments);
        
        x=_this.floor(x)||0;
        y=_this.floor(y)||0;
        if (updateRange) {
          if (_this.xmin==null||x<_this.xmin) {
            _this.xmin=x;
          }
          if (_this.xmax==null||x>_this.xmax) {
            _this.xmax=x;
          }
          if (_this.ymin==null||y<_this.ymin) {
            _this.ymin=y;
          }
          if (_this.ymax==null||y>_this.ymax) {
            _this.ymax=y;
          }
          
        }
        return x+","+y;
        
      },
      __getter__rows :function _trc_Matrix___getter__rows() {
        "use strict";
        var _this=this;
        
        return _this.xmax-_this.xmin+1;
      },
      __getter__cols :function _trc_Matrix___getter__cols() {
        "use strict";
        var _this=this;
        
        return _this.ymax-_this.ymin+1;
      },
      get :function _trc_Matrix_get(x,y) {
        "use strict";
        var _this=this;
        var res;
        var e;
        
        res = _this.data[_this.key(x,y)];
        
        if (res===undefined) {
          e = {set: (function anonymous_4331(v) {
            
            e.value=v;
            _this.set(x,y,v);
          }),x: x,y: y};
          
          _this.sendEvent("newCell",e);
          return e.value;
          
        }
        return res;
      },
      fiber$get :function* _trc_Matrix_f_get(_thread,x,y) {
        "use strict";
        var _this=this;
        //var _arguments=Tonyu.A(arguments);
        var res;
        var e;
        
        res = _this.data[_this.key(x,y)];
        
        if (res===undefined) {
          e = {set: (function anonymous_4331(v) {
            
            e.value=v;
            _this.set(x,y,v);
          }),x: x,y: y};
          
          _this.sendEvent("newCell",e);
          return e.value;
          
        }
        return res;
        
      },
      exists :function _trc_Matrix_exists(x,y) {
        "use strict";
        var _this=this;
        
        return _this.data[_this.key(x,y)]!==undefined;
      },
      fiber$exists :function* _trc_Matrix_f_exists(_thread,x,y) {
        "use strict";
        var _this=this;
        //var _arguments=Tonyu.A(arguments);
        
        return _this.data[_this.key(x,y)]!==undefined;
        
      },
      set :function _trc_Matrix_set(x,y,v) {
        "use strict";
        var _this=this;
        var k;
        
        
        if (v===undefined) {
          k=_this.key(x,y);
          if (_this.data[k]===undefined) {
            return v;
          }
          _this.fireEvent("change",{x: x,y: y,value: v});
          delete _this.data[k];
          
        } else {
          k=_this.key(x,y,true);
          if (_this.data[k]===v) {
            return v;
          }
          _this.fireEvent("change",{x: x,y: y,value: v});
          return _this.data[k]=v;
          
        }
      },
      fiber$set :function* _trc_Matrix_f_set(_thread,x,y,v) {
        "use strict";
        var _this=this;
        //var _arguments=Tonyu.A(arguments);
        var k;
        
        
        if (v===undefined) {
          k=(yield* _this.fiber$key(_thread, x, y));
          if (_this.data[k]===undefined) {
            return v;
          }
          _this.fireEvent("change",{x: x,y: y,value: v});
          delete _this.data[k];
          
        } else {
          k=(yield* _this.fiber$key(_thread, x, y, true));
          if (_this.data[k]===v) {
            return v;
          }
          _this.fireEvent("change",{x: x,y: y,value: v});
          return _this.data[k]=v;
          
        }
        
      },
      neighbors :function _trc_Matrix_neighbors(x,y,options) {
        "use strict";
        var _this=this;
        var dirs;
        var res;
        var dir;
        var i;
        var j;
        var r;
        
        options=options||{dirs: _this.neighborDirs};
        options.dirs=options.dirs||_this.neighborDirs||4;
        dirs = [[0,- 1],[1,- 1],[1,0],[1,1],[0,1],[- 1,1],[- 1,0],[- 1,- 1]];
        
        res = [];
        
        for ([dir] of Tonyu.iterator2(dirs,1)) {
          i = dir[1];
          j = dir[0];
          
          if (i==0&&j==0) {
            continue;
            
          }
          if (options.dirs==4) {
            if (i*j!=0) {
              continue;
              
            }
            
          }
          
          if (_this.exists(x+j,y+i)) {
            r=_this.get(x+j,y+i);
            res.push({x: x+j,y: y+i,ox: j,oy: i,value: r});
            
          } else {
            if (options.includeEmpty) {
              res.push({x: x+j,y: y+i,ox: j,oy: i});
              
            }
          }
          
        }
        return res;
      },
      fiber$neighbors :function* _trc_Matrix_f_neighbors(_thread,x,y,options) {
        "use strict";
        var _this=this;
        //var _arguments=Tonyu.A(arguments);
        var dirs;
        var res;
        var dir;
        var i;
        var j;
        var r;
        
        options=options||{dirs: _this.neighborDirs};
        options.dirs=options.dirs||_this.neighborDirs||4;
        dirs = [[0,- 1],[1,- 1],[1,0],[1,1],[0,1],[- 1,1],[- 1,0],[- 1,- 1]];
        
        res = [];
        
        for ([dir] of Tonyu.iterator2(dirs,1)) {
          i = dir[1];
          j = dir[0];
          
          if (i==0&&j==0) {
            continue;
            
          }
          if (options.dirs==4) {
            if (i*j!=0) {
              continue;
              
            }
            
          }
          
          if (_this.exists(x+j,y+i)) {
            r=(yield* _this.fiber$get(_thread, x+j, y+i));
            res.push({x: x+j,y: y+i,ox: j,oy: i,value: r});
            
          } else {
            if (options.includeEmpty) {
              res.push({x: x+j,y: y+i,ox: j,oy: i});
              
            }
          }
          
        }
        return res;
        
      },
      fill :function _trc_Matrix_fill(left,top,cols,rows,data) {
        "use strict";
        var _this=this;
        var i;
        var j;
        var d;
        
        data=data||{};
        for (i = top;
         i<top+rows ; i++) {
          {
            for (j = left;
             j<left+cols ; j++) {
              {
                d = data;
                
                if (typeof  data==="object") {
                  d=Object.create(data);
                  
                } else {
                  if (typeof  data==="function") {
                    d=data(j,i);
                    
                  }
                }
                _this.set(j,i,d);
              }
            }
          }
        }
      },
      fiber$fill :function* _trc_Matrix_f_fill(_thread,left,top,cols,rows,data) {
        "use strict";
        var _this=this;
        //var _arguments=Tonyu.A(arguments);
        var i;
        var j;
        var d;
        
        data=data||{};
        for (i = top;
         i<top+rows ; i++) {
          {
            for (j = left;
             j<left+cols ; j++) {
              {
                d = data;
                
                if (typeof  data==="object") {
                  d=Object.create(data);
                  
                } else {
                  if (typeof  data==="function") {
                    d=data(j,i);
                    
                  }
                }
                (yield* _this.fiber$set(_thread, j, i, d));
              }
            }
          }
        }
        
      },
      pack :function _trc_Matrix_pack() {
        "use strict";
        var _this=this;
        var t;
        var k;
        var v;
        var xy;
        var x;
        var y;
        
        
        t=_this.xmin;
        _this.xmin=_this.xmax;
        _this.xmax=t;
        t=_this.ymin;
        _this.ymin=_this.ymax;
        _this.ymax=t;
        for ([k, v] of Tonyu.iterator2(_this.data,2)) {
          xy = _this.unkey(k);
          
          x = xy.x;
          y = xy.y;
          
          if (x<_this.xmin) {
            _this.xmin=x;
            
          }
          if (y<_this.ymin) {
            _this.ymin=y;
            
          }
          if (x>_this.xmax) {
            _this.xmax=x;
            
          }
          if (y>_this.ymax) {
            _this.ymax=y;
            
          }
          
        }
      },
      fiber$pack :function* _trc_Matrix_f_pack(_thread) {
        "use strict";
        var _this=this;
        //var _arguments=Tonyu.A(arguments);
        var t;
        var k;
        var v;
        var xy;
        var x;
        var y;
        
        
        t=_this.xmin;
        _this.xmin=_this.xmax;
        _this.xmax=t;
        t=_this.ymin;
        _this.ymin=_this.ymax;
        _this.ymax=t;
        for ([k, v] of Tonyu.iterator2(_this.data,2)) {
          xy=yield* _this.fiber$unkey(_thread, k);
          
          x = xy.x;
          y = xy.y;
          
          if (x<_this.xmin) {
            _this.xmin=x;
            
          }
          if (y<_this.ymin) {
            _this.ymin=y;
            
          }
          if (x>_this.xmax) {
            _this.xmax=x;
            
          }
          if (y>_this.ymax) {
            _this.ymax=y;
            
          }
          
        }
        
      },
      clone :function _trc_Matrix_clone() {
        "use strict";
        var _this=this;
        var nm;
        var x;
        var y;
        var c;
        
        nm = new Tonyu.classes.kernel.Matrix;
        
        for ([x, y, c] of Tonyu.iterator2(_this,3)) {
          nm.set(x,y,c);
          
        }
        return nm;
      },
      fiber$clone :function* _trc_Matrix_f_clone(_thread) {
        "use strict";
        var _this=this;
        //var _arguments=Tonyu.A(arguments);
        var nm;
        var x;
        var y;
        var c;
        
        nm = new Tonyu.classes.kernel.Matrix;
        
        for ([x, y, c] of Tonyu.iterator2(_this,3)) {
          nm.set(x,y,c);
          
        }
        return nm;
        
      },
      __dummy: false
    };
  },
  decls: {"methods":{"main":{"nowait":false,"isMain":true,"vtype":{"params":[],"returnValue":null}},"new":{"nowait":false,"isMain":false,"vtype":{"params":[null],"returnValue":null}},"fromArray":{"nowait":false,"isMain":false,"vtype":{"params":[null],"returnValue":null}},"toArray":{"nowait":false,"isMain":false,"vtype":{"params":[],"returnValue":null}},"load":{"nowait":false,"isMain":false,"vtype":{"params":[null],"returnValue":null}},"cross":{"nowait":false,"isMain":false,"vtype":{"params":[null,null],"returnValue":null}},"search":{"nowait":false,"isMain":false,"vtype":{"params":[null,null],"returnValue":null}},"find":{"nowait":false,"isMain":false,"vtype":{"params":[],"returnValue":null}},"crop":{"nowait":false,"isMain":false,"vtype":{"params":[],"returnValue":null}},"rev":{"nowait":false,"isMain":false,"vtype":{"params":[null],"returnValue":null}},"keysIterator":{"nowait":false,"isMain":false,"vtype":{"params":[],"returnValue":null}},"rectIterator":{"nowait":false,"isMain":false,"vtype":{"params":[],"returnValue":null}},"tonyuIteratorKeys":{"nowait":false,"isMain":false,"vtype":{"params":[null],"returnValue":null}},"tonyuIterator":{"nowait":false,"isMain":false,"vtype":{"params":[null],"returnValue":null}},"tonyuIteratorRect":{"nowait":false,"isMain":false,"vtype":{"params":[null],"returnValue":null}},"unkey":{"nowait":false,"isMain":false,"vtype":{"params":[null],"returnValue":null}},"key":{"nowait":false,"isMain":false,"vtype":{"params":[null,null,null],"returnValue":null}},"__getter__rows":{"nowait":true,"isMain":false,"vtype":{"params":[],"returnValue":null}},"__getter__cols":{"nowait":true,"isMain":false,"vtype":{"params":[],"returnValue":null}},"get":{"nowait":false,"isMain":false,"vtype":{"params":[null,null],"returnValue":null}},"exists":{"nowait":false,"isMain":false,"vtype":{"params":[null,null],"returnValue":null}},"set":{"nowait":false,"isMain":false,"vtype":{"params":[null,null,null],"returnValue":null}},"neighbors":{"nowait":false,"isMain":false,"vtype":{"params":[null,null,null],"returnValue":null}},"fill":{"nowait":false,"isMain":false,"vtype":{"params":[null,null,null,null,null],"returnValue":null}},"pack":{"nowait":false,"isMain":false,"vtype":{"params":[],"returnValue":null}},"clone":{"nowait":false,"isMain":false,"vtype":{"params":[],"returnValue":null}}},"fields":{"data":{},"iterateMode":{},"neighborDirs":{},"xmax":{},"xmin":{},"ymax":{},"ymin":{}}}
});
Tonyu.klass.define({
  fullName: 'kernel.Random',
  shortName: 'Random',
  namespace: 'kernel',
  superclass: Tonyu.classes.kernel.TObject,
  includes: [Tonyu.classes.kernel.MathMod],
  methods: function (__superClass) {
    return {
      main :function _trc_Random_main() {
        "use strict";
        var _this=this;
        
        
        
      },
      fiber$main :function* _trc_Random_f_main(_thread) {
        "use strict";
        var _this=this;
        //var _arguments=Tonyu.A(arguments);
        
        
        
        
      },
      initialize :function _trc_Random_initialize(seed) {
        "use strict";
        var _this=this;
        
        _this.setSeed(seed);
      },
      setSeed :function _trc_Random_setSeed(seed) {
        "use strict";
        var _this=this;
        
        _this.x=123456789;
        _this.y=362436069;
        _this.z=521288629;
        _this.MAX=2147483648;
        _this.MIN=- _this.MAX;
        _this.w=seed||new Date().getTime();
      },
      next :function _trc_Random_next() {
        "use strict";
        var _this=this;
        var t;
        
        t = _this.x^(_this.x<<11);
        
        _this.x=_this.y;
        _this.y=_this.z;
        _this.z=_this.w;
        return _this.w=(_this.w^(_this.w>>>19))^(t^(t>>>8));
      },
      nextInt :function _trc_Random_nextInt(min,max) {
        "use strict";
        var _this=this;
        var res;
        
        res = _this.floor(min+_this.next01()*(max-min));
        
        return res;
      },
      next01 :function _trc_Random_next01() {
        "use strict";
        var _this=this;
        
        return (_this.next()-_this.MIN)/(_this.MAX-_this.MIN);
      },
      __dummy: false
    };
  },
  decls: {"methods":{"main":{"nowait":false,"isMain":true,"vtype":{"params":[],"returnValue":null}},"new":{"nowait":false,"isMain":false,"vtype":{"params":[null],"returnValue":null}},"setSeed":{"nowait":true,"isMain":false,"vtype":{"params":[null],"returnValue":null}},"next":{"nowait":true,"isMain":false,"vtype":{"params":[],"returnValue":null}},"nextInt":{"nowait":true,"isMain":false,"vtype":{"params":[null,null],"returnValue":null}},"next01":{"nowait":true,"isMain":false,"vtype":{"params":[],"returnValue":null}}},"fields":{"MAX":{},"MIN":{},"x":{},"y":{},"z":{},"w":{}}}
});
Tonyu.klass.define({
  fullName: 'kernel.Scheduler',
  shortName: 'Scheduler',
  namespace: 'kernel',
  superclass: Tonyu.classes.kernel.TObject,
  includes: [],
  methods: function (__superClass) {
    return {
      main :function _trc_Scheduler_main() {
        "use strict";
        var _this=this;
        
        if (typeof  performance==="undefined") {
          window.performance={};
          
        }
        if (! performance.now) {
          performance.now=(function now() {
            
            return Date.now();
          });
          
        }
        _this.cur = [];
        
        _this.next = [];
        
        
      },
      fiber$main :function* _trc_Scheduler_f_main(_thread) {
        "use strict";
        var _this=this;
        //var _arguments=Tonyu.A(arguments);
        
        if (typeof  performance==="undefined") {
          window.performance={};
          
        }
        if (! performance.now) {
          performance.now=(function now() {
            
            return Date.now();
          });
          
        }
        _this.cur = [];
        
        _this.next = [];
        
        
        
      },
      addObj :function _trc_Scheduler_addObj(obj,name,args) {
        "use strict";
        var _this=this;
        
        return _this.newThread(obj,name,args);
      },
      fiber$addObj :function* _trc_Scheduler_f_addObj(_thread,obj,name,args) {
        "use strict";
        var _this=this;
        //var _arguments=Tonyu.A(arguments);
        
        return yield* _this.fiber$newThread(_thread, obj, name, args);
        
        
      },
      newThread :function _trc_Scheduler_newThread(obj,name,args,options) {
        "use strict";
        var _this=this;
        var th;
        
        name=name||"main";
        args=args||[];
        th = Tonyu.thread();
        
        th.apply(obj,name,args);
        th.name=(obj.getClassInfo?obj.getClassInfo().shortName:"Unknown")+"::"+name;
        _this.addToCur(th);
        return th;
      },
      fiber$newThread :function* _trc_Scheduler_f_newThread(_thread,obj,name,args,options) {
        "use strict";
        var _this=this;
        //var _arguments=Tonyu.A(arguments);
        var th;
        
        name=name||"main";
        args=args||[];
        th = Tonyu.thread();
        
        th.apply(obj,name,args);
        th.name=(obj.getClassInfo?obj.getClassInfo().shortName:"Unknown")+"::"+name;
        (yield* _this.fiber$addToCur(_thread, th));
        return th;
        
      },
      addToCur :function _trc_Scheduler_addToCur(th) {
        "use strict";
        var _this=this;
        
        if (th.scheduled) {
          return _this;
        }
        _this.cur.push(th);
        th.scheduled=_this;
        if (Tonyu.globals.$Boot.newLimit) {
          Tonyu.globals.$Boot.newLimitCount--;
          if (Tonyu.globals.$Boot.newLimitCount<=0) {
            throw new Error("一度にたくさんのスレッドを作りすぎています\n"+"       $Boot.newLimitの値を変更すると、1フレーム間に生成できる オブジェクト+スレッドの合計数 を変更できます\n"+"       $Boot.newLimit="+Tonyu.globals.$Boot.newLimit+"; // 現在の オブジェクト数+スレッド数 の限度\n"+"       update(); // 次フレームから適用されます\n"+"       [参考] https://edit.tonyu.jp/doc/limitations.html\n");
            
          }
          
        }
      },
      fiber$addToCur :function* _trc_Scheduler_f_addToCur(_thread,th) {
        "use strict";
        var _this=this;
        //var _arguments=Tonyu.A(arguments);
        
        if (th.scheduled) {
          return _this;
        }
        _this.cur.push(th);
        th.scheduled=_this;
        if (Tonyu.globals.$Boot.newLimit) {
          Tonyu.globals.$Boot.newLimitCount--;
          if (Tonyu.globals.$Boot.newLimitCount<=0) {
            throw new Error("一度にたくさんのスレッドを作りすぎています\n"+"       $Boot.newLimitの値を変更すると、1フレーム間に生成できる オブジェクト+スレッドの合計数 を変更できます\n"+"       $Boot.newLimit="+Tonyu.globals.$Boot.newLimit+"; // 現在の オブジェクト数+スレッド数 の限度\n"+"       update(); // 次フレームから適用されます\n"+"       [参考] https://edit.tonyu.jp/doc/limitations.html\n");
            
          }
          
        }
        
      },
      addToNext :function _trc_Scheduler_addToNext(th) {
        "use strict";
        var _this=this;
        
        if (th.scheduled) {
          return _this;
        }
        _this.next.push(th);
        th.scheduled=_this;
      },
      fiber$addToNext :function* _trc_Scheduler_f_addToNext(_thread,th) {
        "use strict";
        var _this=this;
        //var _arguments=Tonyu.A(arguments);
        
        if (th.scheduled) {
          return _this;
        }
        _this.next.push(th);
        th.scheduled=_this;
        
      },
      unschedule :function _trc_Scheduler_unschedule(th) {
        "use strict";
        var _this=this;
        var i;
        
        i = _this.cur.indexOf(th);
        
        if (i>=0) {
          _this.cur.splice(i,1);
          delete th.scheduled;
          
        } else {
          i=_this.next.indexOf(th);
          if (i>=0) {
            _this.next.splice(i,1);
            delete th.scheduled;
            
          }
          
        }
      },
      fiber$unschedule :function* _trc_Scheduler_f_unschedule(_thread,th) {
        "use strict";
        var _this=this;
        //var _arguments=Tonyu.A(arguments);
        var i;
        
        i = _this.cur.indexOf(th);
        
        if (i>=0) {
          _this.cur.splice(i,1);
          delete th.scheduled;
          
        } else {
          i=_this.next.indexOf(th);
          if (i>=0) {
            _this.next.splice(i,1);
            delete th.scheduled;
            
          }
          
        }
        
      },
      checkTimeout :function _trc_Scheduler_checkTimeout() {
        "use strict";
        var _this=this;
        var now;
        
        now = performance.now();
        
        if (now-_this.lastSteps>1000) {
          throw new Error("待機不能モードでupdateが呼ばれています．ブラウザが固まるのを防ぐために停止します．");
          
          
        }
      },
      fiber$checkTimeout :function* _trc_Scheduler_f_checkTimeout(_thread) {
        "use strict";
        var _this=this;
        //var _arguments=Tonyu.A(arguments);
        var now;
        
        now = performance.now();
        
        if (now-_this.lastSteps>1000) {
          throw new Error("待機不能モードでupdateが呼ばれています．ブラウザが固まるのを防ぐために停止します．");
          
          
        }
        
      },
      checkDuplicate :function _trc_Scheduler_checkDuplicate() {
        "use strict";
        var _this=this;
        var dupc;
        var t;
        
        dupc = {};
        
        for ([t] of Tonyu.iterator2(_this.cur,1)) {
          if (dupc[t.id]) {
            console.log("WARNING","Scheduler: duplicate thread detected in cur",t);
            
          }
          dupc[t.id]="cur";
          
        }
        for ([t] of Tonyu.iterator2(_this.next,1)) {
          if (dupc[t.id]) {
            console.log("WARNING","Scheduler: duplicate thread detected in next and "+dupc[t.id],t);
            
          }
          dupc[t.id]="next";
          
        }
      },
      fiber$checkDuplicate :function* _trc_Scheduler_f_checkDuplicate(_thread) {
        "use strict";
        var _this=this;
        //var _arguments=Tonyu.A(arguments);
        var dupc;
        var t;
        
        dupc = {};
        
        for ([t] of Tonyu.iterator2(_this.cur,1)) {
          if (dupc[t.id]) {
            console.log("WARNING","Scheduler: duplicate thread detected in cur",t);
            
          }
          dupc[t.id]="cur";
          
        }
        for ([t] of Tonyu.iterator2(_this.next,1)) {
          if (dupc[t.id]) {
            console.log("WARNING","Scheduler: duplicate thread detected in next and "+dupc[t.id],t);
            
          }
          dupc[t.id]="next";
          
        }
        
      },
      doTimeStop :function _trc_Scheduler_doTimeStop() {
        "use strict";
        var _this=this;
        
        _this.next=_this.allThreads;
        _this.cur=[];
        return _this.next;
      },
      fiber$doTimeStop :function* _trc_Scheduler_f_doTimeStop(_thread) {
        "use strict";
        var _this=this;
        //var _arguments=Tonyu.A(arguments);
        
        _this.next=_this.allThreads;
        _this.cur=[];
        return _this.next;
        
      },
      resetLastSteps :function _trc_Scheduler_resetLastSteps() {
        "use strict";
        var _this=this;
        
        _this.lastSteps=performance.now();
      },
      fiber$resetLastSteps :function* _trc_Scheduler_f_resetLastSteps(_thread) {
        "use strict";
        var _this=this;
        //var _arguments=Tonyu.A(arguments);
        
        _this.lastSteps=performance.now();
        
      },
      stepsAll :function _trc_Scheduler_stepsAll() {
        "use strict";
        var _this=this;
        var dupc;
        var t;
        
        _this.resetLastSteps();
        dupc = {};
        
        while (_this.cur.length) {
          t = _this.cur.shift();
          
          if (dupc[t.id]) {
            console.log("WARNING","Scheduler: duplicate thread detected",t);
            continue;
            
            
          }
          dupc[t.id]=t;
          delete t.scheduled;
          if (t.waitCount) {
            t.waitCount--;
            _this.addToNext(t);
            
          } else {
            t.steps();
            if (t.preempted) {
              Tonyu.globals.$Boot.fireEvent("preempted",{thread: t,scheduler: _this});
              _this.addToNext(t);
              
            }
            
          }
          
        }
        _this.cur=_this.next;
        _this.next=[];
        return _this.cur.length;
      },
      fiber$stepsAll :function* _trc_Scheduler_f_stepsAll(_thread) {
        "use strict";
        var _this=this;
        //var _arguments=Tonyu.A(arguments);
        var dupc;
        var t;
        
        (yield* _this.fiber$resetLastSteps(_thread));
        dupc = {};
        
        while (_this.cur.length) {
          t = _this.cur.shift();
          
          if (dupc[t.id]) {
            console.log("WARNING","Scheduler: duplicate thread detected",t);
            continue;
            
            
          }
          dupc[t.id]=t;
          delete t.scheduled;
          if (t.waitCount) {
            t.waitCount--;
            (yield* _this.fiber$addToNext(_thread, t));
            
          } else {
            t.steps();
            if (t.preempted) {
              Tonyu.globals.$Boot.fireEvent("preempted",{thread: t,scheduler: _this});
              (yield* _this.fiber$addToNext(_thread, t));
              
            }
            
          }
          
        }
        _this.cur=_this.next;
        _this.next=[];
        return _this.cur.length;
        
      },
      __getter__allThreads :function _trc_Scheduler___getter__allThreads() {
        "use strict";
        var _this=this;
        
        return _this.cur.concat(_this.next);
      },
      findByThreadGroup :function _trc_Scheduler_findByThreadGroup(o) {
        "use strict";
        var _this=this;
        
        return _this.allThreads.filter((function anonymous_3209(t) {
          
          return t._threadGroup===o;
        }));
      },
      fiber$findByThreadGroup :function* _trc_Scheduler_f_findByThreadGroup(_thread,o) {
        "use strict";
        var _this=this;
        //var _arguments=Tonyu.A(arguments);
        
        return _this.allThreads.filter((function anonymous_3209(t) {
          
          return t._threadGroup===o;
        }));
        
      },
      __getter__isEmpty :function _trc_Scheduler___getter__isEmpty() {
        "use strict";
        var _this=this;
        
        return _this.allThreads.length==0;
      },
      __dummy: false
    };
  },
  decls: {"methods":{"main":{"nowait":false,"isMain":true,"vtype":{"params":[],"returnValue":null}},"addObj":{"nowait":false,"isMain":false,"vtype":{"params":[null,null,null],"returnValue":null}},"newThread":{"nowait":false,"isMain":false,"vtype":{"params":[null,null,null,null],"returnValue":null}},"addToCur":{"nowait":false,"isMain":false,"vtype":{"params":[null],"returnValue":null}},"addToNext":{"nowait":false,"isMain":false,"vtype":{"params":[null],"returnValue":null}},"unschedule":{"nowait":false,"isMain":false,"vtype":{"params":[null],"returnValue":null}},"checkTimeout":{"nowait":false,"isMain":false,"vtype":{"params":[],"returnValue":null}},"checkDuplicate":{"nowait":false,"isMain":false,"vtype":{"params":[],"returnValue":null}},"doTimeStop":{"nowait":false,"isMain":false,"vtype":{"params":[],"returnValue":null}},"resetLastSteps":{"nowait":false,"isMain":false,"vtype":{"params":[],"returnValue":null}},"stepsAll":{"nowait":false,"isMain":false,"vtype":{"params":[],"returnValue":null}},"__getter__allThreads":{"nowait":true,"isMain":false,"vtype":{"params":[],"returnValue":null}},"findByThreadGroup":{"nowait":false,"isMain":false,"vtype":{"params":[null],"returnValue":null}},"__getter__isEmpty":{"nowait":true,"isMain":false,"vtype":{"params":[],"returnValue":null}}},"fields":{"cur":{},"next":{},"lastSteps":{}}}
});

//# sourceMappingURL=concat.js.map