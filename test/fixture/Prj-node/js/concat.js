Tonyu.klass.define({
  fullName: 'user.Updatable',
  shortName: 'Updatable',
  namespace: 'user',
  includes: [],
  methods: function (__superClass) {
    return {
      main :function _trc_Updatable_main() {
        "use strict";
        var _this=this;
        
      },
      fiber$main :function _trc_Updatable_f_main(_thread) {
        "use strict";
        var _this=this;
        //var _arguments=Tonyu.A(arguments);
        var __pc=0;
        
        
        _thread.retVal=_this;return;
      },
      waitFor :function _trc_Updatable_waitFor(f) {
        "use strict";
        var _this=this;
        var r;
        
        if (null) {
          r = null.waitFor(f);
          
          return r;
          
        }
        return f;
      },
      fiber$waitFor :function _trc_Updatable_f_waitFor(_thread,f) {
        "use strict";
        var _this=this;
        //var _arguments=Tonyu.A(arguments);
        var __pc=0;
        var r;
        
        if (_thread) {
          r = _thread.waitFor(f);
          
          _thread.retVal=r;return;
          
          
        }
        _thread.retVal=f;return;
        
        
        _thread.retVal=_this;return;
      },
      update :function _trc_Updatable_update(t) {
        "use strict";
        var _this=this;
        
        _this.waitFor(new Promise((function anonymous_206(s) {
          
          setTimeout(s,t||50);
        })));
      },
      fiber$update :function _trc_Updatable_f_update(_thread,t) {
        "use strict";
        var _this=this;
        //var _arguments=Tonyu.A(arguments);
        var __pc=0;
        
        
        _thread.enter(function _trc_Updatable_ent_update(_thread) {
          if (_thread.lastEx) __pc=_thread.catchPC;
          for(var __cnt=100 ; __cnt--;) {
            switch (__pc) {
            case 0:
              _this.fiber$waitFor(_thread, new Promise((function anonymous_206(s) {
                
                setTimeout(s,t||50);
              })));
              __pc=1;return;
            case 1:
              
              _thread.exit(_this);return;
            }
          }
        });
      },
      appear :function _trc_Updatable_appear(o) {
        "use strict";
        var _this=this;
        var t;
        
        t = Tonyu.thread();
        
        t.apply(o,"main",[]);
        t.steps();
        return o;
      },
      fiber$appear :function _trc_Updatable_f_appear(_thread,o) {
        "use strict";
        var _this=this;
        //var _arguments=Tonyu.A(arguments);
        var __pc=0;
        var t;
        
        t = Tonyu.thread();
        
        t.apply(o,"main",[]);
        t.steps();
        _thread.retVal=o;return;
        
        
        _thread.retVal=_this;return;
      },
      __dummy: false
    };
  },
  decls: {"methods":{"main":{"nowait":false},"waitFor":{"nowait":false},"update":{"nowait":false},"appear":{"nowait":false}},"fields":{}}
});Tonyu.klass.define({
  fullName: 'user.Main',
  shortName: 'Main',
  namespace: 'user',
  superclass: Tonyu.classes.user.Updatable,
  includes: [],
  methods: function (__superClass) {
    return {
      main :function _trc_Main_main() {
        "use strict";
        var _this=this;
        
        Tonyu.globals.$restart=(function anonymous_45() {
          
          _this.appear(new Tonyu.classes.user.Chara);
        });
        Tonyu.globals.$restart();
      },
      fiber$main :function _trc_Main_f_main(_thread) {
        "use strict";
        var _this=this;
        //var _arguments=Tonyu.A(arguments);
        var __pc=0;
        
        
        _thread.enter(function _trc_Main_ent_main(_thread) {
          if (_thread.lastEx) __pc=_thread.catchPC;
          for(var __cnt=100 ; __cnt--;) {
            switch (__pc) {
            case 0:
              Tonyu.globals.$restart=(function anonymous_45() {
                
                _this.appear(new Tonyu.classes.user.Chara);
              });
              Tonyu.globals.$restart();
              _thread.exit(_this);return;
            }
          }
        });
      },
      __dummy: false
    };
  },
  decls: {"methods":{"main":{"nowait":false}},"fields":{}}
});Tonyu.klass.define({
  fullName: 'user.Chara',
  shortName: 'Chara',
  namespace: 'user',
  superclass: Tonyu.classes.user.Updatable,
  includes: [],
  methods: function (__superClass) {
    return {
      main :function _trc_Chara_main() {
        "use strict";
        var _this=this;
        
        _this.x=100;
        _this.y=200;
        _this.fillStyle="yellow";
        _this.radius=16;
        while (_this.x<120) {
          Tonyu.checkLoop();
          _this.x+=5;
          console.log(_this.x,_this.y);
          _this.update();
          
        }
      },
      fiber$main :function _trc_Chara_f_main(_thread) {
        "use strict";
        var _this=this;
        //var _arguments=Tonyu.A(arguments);
        var __pc=0;
        
        _this.x=100;
        _this.y=200;
        _this.fillStyle="yellow";
        _this.radius=16;
        
        _thread.enter(function _trc_Chara_ent_main(_thread) {
          if (_thread.lastEx) __pc=_thread.catchPC;
          for(var __cnt=100 ; __cnt--;) {
            switch (__pc) {
            case 0:
            case 1:
              if (!(_this.x<120)) { __pc=3     ; break; }
              _this.x+=5;
              console.log(_this.x,_this.y);
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
  decls: {"methods":{"main":{"nowait":false}},"fields":{"x":{},"y":{},"fillStyle":{},"radius":{}}}
});
//# sourceMappingURL=concat.js.map