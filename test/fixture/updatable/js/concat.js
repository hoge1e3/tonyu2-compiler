Tonyu.klass.define({
  fullName: 'updatable.Chara',
  shortName: 'Chara',
  namespace: 'updatable',
  includes: [],
  methods: function (__superClass) {
    return {
      main :function _trc_Chara_main() {
        "use strict";
        var _this=this;
        
      },
      fiber$main :function _trc_Chara_f_main(_thread) {
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
  fullName: 'updatable.Updatable',
  shortName: 'Updatable',
  namespace: 'updatable',
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
});

//# sourceMappingURL=concat.js.map