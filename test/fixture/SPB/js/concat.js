Tonyu.klass.define({
  fullName: 'user.Ancestors',
  shortName: 'Ancestors',
  namespace: 'user',
  superclass: Tonyu.classes.kernel.Actor,
  includes: [],
  methods: function (__superClass) {
    return {
      main :function _trc_Ancestors_main() {
        "use strict";
        var _this=this;
        
        Tonyu.globals.$Screen.resize(400,600);
        _this.ancestors(Tonyu.classes.user.A);
      },
      fiber$main :function _trc_Ancestors_f_main(_thread) {
        "use strict";
        var _this=this;
        //var _arguments=Tonyu.A(arguments);
        var __pc=0;
        
        Tonyu.globals.$Screen.resize(400,600);
        
        _thread.enter(function _trc_Ancestors_ent_main(_thread) {
          if (_thread.lastEx) __pc=_thread.catchPC;
          for(var __cnt=100 ; __cnt--;) {
            switch (__pc) {
            case 0:
              _this.fiber$ancestors(_thread, Tonyu.classes.user.A);
              __pc=1;return;
            case 1:
              
              _thread.exit(_this);return;
            }
          }
        });
      },
      ancestors :function _trc_Ancestors_ancestors(k) {
        "use strict";
        var _this=this;
        var p;
        var ci;
        
        p = k.prototype;
        
        while (p) {
          Tonyu.checkLoop();
          if (p.getClassInfo) {
            ci = p.getClassInfo();
            
            _this.print(ci.isShim,ci.fullName||ci.extenderFullName);
            
          }
          p=p.__proto__;
          _this.update();
          
        }
      },
      fiber$ancestors :function _trc_Ancestors_f_ancestors(_thread,k) {
        "use strict";
        var _this=this;
        //var _arguments=Tonyu.A(arguments);
        var __pc=0;
        var p;
        var ci;
        
        p = k.prototype;
        
        
        _thread.enter(function _trc_Ancestors_ent_ancestors(_thread) {
          if (_thread.lastEx) __pc=_thread.catchPC;
          for(var __cnt=100 ; __cnt--;) {
            switch (__pc) {
            case 0:
            case 1:
              if (!(p)) { __pc=3     ; break; }
              if (p.getClassInfo) {
                ci = p.getClassInfo();
                
                _this.print(ci.isShim,ci.fullName||ci.extenderFullName);
                
              }
              p=p.__proto__;
              _this.fiber$update(_thread);
              __pc=2;return;
            case 2:
              
              __pc=1;break;
            case 3     :
              
              _thread.exit(_this);return;
            }
          }
        });
      },
      __dummy: false
    };
  },
  decls: {"methods":{"main":{"nowait":false},"ancestors":{"nowait":false}},"fields":{}}
});
Tonyu.klass.define({
  fullName: 'user.E',
  shortName: 'E',
  namespace: 'user',
  superclass: Tonyu.classes.kernel.Actor,
  includes: [],
  methods: function (__superClass) {
    return {
      main :function _trc_E_main() {
        "use strict";
        var _this=this;
        
      },
      fiber$main :function _trc_E_f_main(_thread) {
        "use strict";
        var _this=this;
        //var _arguments=Tonyu.A(arguments);
        var __pc=0;
        
        
        _thread.retVal=_this;return;
      },
      __dummy: false
    };
  },
  decls: {"methods":{"main":{"nowait":false}},"fields":{}}
});
Tonyu.klass.define({
  fullName: 'user.F',
  shortName: 'F',
  namespace: 'user',
  superclass: Tonyu.classes.kernel.Actor,
  includes: [],
  methods: function (__superClass) {
    return {
      main :function _trc_F_main() {
        "use strict";
        var _this=this;
        
      },
      fiber$main :function _trc_F_f_main(_thread) {
        "use strict";
        var _this=this;
        //var _arguments=Tonyu.A(arguments);
        var __pc=0;
        
        
        _thread.retVal=_this;return;
      },
      __dummy: false
    };
  },
  decls: {"methods":{"main":{"nowait":false}},"fields":{}}
});
Tonyu.klass.define({
  fullName: 'user.SHI',
  shortName: 'SHI',
  namespace: 'user',
  superclass: Tonyu.classes.kernel.Actor,
  includes: [],
  methods: function (__superClass) {
    return {
      main :function _trc_SHI_main() {
        "use strict";
        var _this=this;
        
      },
      fiber$main :function _trc_SHI_f_main(_thread) {
        "use strict";
        var _this=this;
        //var _arguments=Tonyu.A(arguments);
        var __pc=0;
        
        
        _thread.retVal=_this;return;
      },
      hoge :function _trc_SHI_hoge(x) {
        "use strict";
        var _this=this;
        var r;
        
        _this.print("SHI::hoge");
        _this.i=0;for (; _this.i<3 ; _this.i++) {
          Tonyu.checkLoop();
          {
            _this.print(x+_this.i);
            _this.updateEx(10);
          }
        }
        
        r=__superClass.prototype.hoge.apply( _this, [x+1]);
        return r;
      },
      fiber$hoge :function _trc_SHI_f_hoge(_thread,x) {
        "use strict";
        var _this=this;
        //var _arguments=Tonyu.A(arguments);
        var __pc=0;
        var r;
        
        _this.print("SHI::hoge");
        
        _thread.enter(function _trc_SHI_ent_hoge(_thread) {
          if (_thread.lastEx) __pc=_thread.catchPC;
          for(var __cnt=100 ; __cnt--;) {
            switch (__pc) {
            case 0:
              _this.i=0;
            case 1:
              if (!(_this.i<3)) { __pc=4     ; break; }
              _this.print(x+_this.i);
              _this.fiber$updateEx(_thread, 10);
              __pc=2;return;
            case 2:
              
            case 3     :
              _this.i++;
              __pc=1;break;
            case 4     :
              
              
              __superClass.prototype.fiber$hoge.apply( _this, [_thread, x+1]);
              __pc=5;return;
            case 5:
              r=_thread.retVal;
              
              _thread.exit(r);return;
              _thread.exit(_this);return;
            }
          }
        });
      },
      __dummy: false
    };
  },
  decls: {"methods":{"main":{"nowait":false},"hoge":{"nowait":false}},"fields":{"i":{}}}
});
Tonyu.klass.define({
  fullName: 'user.SPC',
  shortName: 'SPC',
  namespace: 'user',
  superclass: Tonyu.classes.kernel.Actor,
  includes: [],
  methods: function (__superClass) {
    return {
      main :function _trc_SPC_main() {
        "use strict";
        var _this=this;
        
      },
      fiber$main :function _trc_SPC_f_main(_thread) {
        "use strict";
        var _this=this;
        //var _arguments=Tonyu.A(arguments);
        var __pc=0;
        
        
        _thread.retVal=_this;return;
      },
      hoge :function _trc_SPC_hoge(x) {
        "use strict";
        var _this=this;
        
        _this.print("SPC::hoge");
        _this.updateEx(30);
        return x*2;
      },
      fiber$hoge :function _trc_SPC_f_hoge(_thread,x) {
        "use strict";
        var _this=this;
        //var _arguments=Tonyu.A(arguments);
        var __pc=0;
        
        _this.print("SPC::hoge");
        
        _thread.enter(function _trc_SPC_ent_hoge(_thread) {
          if (_thread.lastEx) __pc=_thread.catchPC;
          for(var __cnt=100 ; __cnt--;) {
            switch (__pc) {
            case 0:
              _this.fiber$updateEx(_thread, 30);
              __pc=1;return;
            case 1:
              
              _thread.exit(x*2);return;
              _thread.exit(_this);return;
            }
          }
        });
      },
      __dummy: false
    };
  },
  decls: {"methods":{"main":{"nowait":false},"hoge":{"nowait":false}},"fields":{}}
});
Tonyu.klass.define({
  fullName: 'user.B',
  shortName: 'B',
  namespace: 'user',
  superclass: Tonyu.classes.kernel.Actor,
  includes: [Tonyu.classes.user.F],
  methods: function (__superClass) {
    return {
      main :function _trc_B_main() {
        "use strict";
        var _this=this;
        
      },
      fiber$main :function _trc_B_f_main(_thread) {
        "use strict";
        var _this=this;
        //var _arguments=Tonyu.A(arguments);
        var __pc=0;
        
        
        _thread.retVal=_this;return;
      },
      __dummy: false
    };
  },
  decls: {"methods":{"main":{"nowait":false}},"fields":{}}
});
Tonyu.klass.define({
  fullName: 'user.C',
  shortName: 'C',
  namespace: 'user',
  superclass: Tonyu.classes.kernel.Actor,
  includes: [Tonyu.classes.user.E],
  methods: function (__superClass) {
    return {
      main :function _trc_C_main() {
        "use strict";
        var _this=this;
        
      },
      fiber$main :function _trc_C_f_main(_thread) {
        "use strict";
        var _this=this;
        //var _arguments=Tonyu.A(arguments);
        var __pc=0;
        
        
        _thread.retVal=_this;return;
      },
      __dummy: false
    };
  },
  decls: {"methods":{"main":{"nowait":false}},"fields":{}}
});
Tonyu.klass.define({
  fullName: 'user.D',
  shortName: 'D',
  namespace: 'user',
  superclass: Tonyu.classes.kernel.Actor,
  includes: [Tonyu.classes.user.F],
  methods: function (__superClass) {
    return {
      main :function _trc_D_main() {
        "use strict";
        var _this=this;
        
      },
      fiber$main :function _trc_D_f_main(_thread) {
        "use strict";
        var _this=this;
        //var _arguments=Tonyu.A(arguments);
        var __pc=0;
        
        
        _thread.retVal=_this;return;
      },
      __dummy: false
    };
  },
  decls: {"methods":{"main":{"nowait":false}},"fields":{}}
});
Tonyu.klass.define({
  fullName: 'user.SBC',
  shortName: 'SBC',
  namespace: 'user',
  superclass: Tonyu.classes.user.SPC,
  includes: [Tonyu.classes.user.SHI],
  methods: function (__superClass) {
    return {
      main :function _trc_SBC_main() {
        "use strict";
        var _this=this;
        
        _this.print(_this instanceof Tonyu.classes.kernel.SpriteMod,Tonyu.is(_this,Tonyu.classes.kernel.SpriteMod),Tonyu.is(_this,Tonyu.classes.kernel.BaseActor));
        _this.print("START");
        _this.r=_this.hoge(10);
        _this.print("END",_this.r);
      },
      fiber$main :function _trc_SBC_f_main(_thread) {
        "use strict";
        var _this=this;
        //var _arguments=Tonyu.A(arguments);
        var __pc=0;
        
        _this.print(_this instanceof Tonyu.classes.kernel.SpriteMod,Tonyu.is(_this,Tonyu.classes.kernel.SpriteMod),Tonyu.is(_this,Tonyu.classes.kernel.BaseActor));
        _this.print("START");
        
        _thread.enter(function _trc_SBC_ent_main(_thread) {
          if (_thread.lastEx) __pc=_thread.catchPC;
          for(var __cnt=100 ; __cnt--;) {
            switch (__pc) {
            case 0:
              _this.fiber$hoge(_thread, 10);
              __pc=1;return;
            case 1:
              _this.r=_thread.retVal;
              
              _this.print("END",_this.r);
              _thread.exit(_this);return;
            }
          }
        });
      },
      hoge :function _trc_SBC_hoge() {
        "use strict";
        var _this=this;
        var y;
        
        _this.print("SBC::hoge");
        
        y=__superClass.prototype.hoge.apply( _this, [5]);
        _this.print(y);
        return y;
      },
      fiber$hoge :function _trc_SBC_f_hoge(_thread) {
        "use strict";
        var _this=this;
        //var _arguments=Tonyu.A(arguments);
        var __pc=0;
        var y;
        
        _this.print("SBC::hoge");
        
        
        _thread.enter(function _trc_SBC_ent_hoge(_thread) {
          if (_thread.lastEx) __pc=_thread.catchPC;
          for(var __cnt=100 ; __cnt--;) {
            switch (__pc) {
            case 0:
              __superClass.prototype.fiber$hoge.apply( _this, [_thread, 5]);
              __pc=1;return;
            case 1:
              y=_thread.retVal;
              
              _this.print(y);
              _thread.exit(y);return;
              _thread.exit(_this);return;
            }
          }
        });
      },
      __dummy: false
    };
  },
  decls: {"methods":{"main":{"nowait":false},"hoge":{"nowait":false}},"fields":{"r":{}}}
});
Tonyu.klass.define({
  fullName: 'user.A',
  shortName: 'A',
  namespace: 'user',
  superclass: Tonyu.classes.user.B,
  includes: [Tonyu.classes.user.C,Tonyu.classes.user.D],
  methods: function (__superClass) {
    return {
      main :function _trc_A_main() {
        "use strict";
        var _this=this;
        
      },
      fiber$main :function _trc_A_f_main(_thread) {
        "use strict";
        var _this=this;
        //var _arguments=Tonyu.A(arguments);
        var __pc=0;
        
        
        _thread.retVal=_this;return;
      },
      __dummy: false
    };
  },
  decls: {"methods":{"main":{"nowait":false}},"fields":{}}
});

//# sourceMappingURL=concat.js.map