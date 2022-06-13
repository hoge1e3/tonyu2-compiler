Tonyu.klass.define({
  fullName: 'user.A',
  shortName: 'A',
  namespace: 'user',
  includes: [],
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
      test :function _trc_A_test() {
        "use strict";
        var _this=this;
        
        _this.test2();
        if (! _this.a) {
          return _this;
        }
        _this.test2();
      },
      fiber$test :function _trc_A_f_test(_thread) {
        "use strict";
        var _this=this;
        //var _arguments=Tonyu.A(arguments);
        var __pc=0;
        
        
        _thread.enter(function _trc_A_ent_test(_thread) {
          if (_thread.lastEx) __pc=_thread.catchPC;
          for(var __cnt=100 ; __cnt--;) {
            switch (__pc) {
            case 0:
              _this.fiber$test2(_thread);
              __pc=1;return;
            case 1:
              
              if (!(! _this.a)) { __pc=2     ; break; }
              _thread.exit(_this);return;
            case 2     :
              
              _this.fiber$test2(_thread);
              __pc=3;return;
            case 3:
              
              _thread.exit(_this);return;
            }
          }
        });
      },
      test2 :function _trc_A_test2() {
        "use strict";
        var _this=this;
        
      },
      fiber$test2 :function _trc_A_f_test2(_thread) {
        "use strict";
        var _this=this;
        //var _arguments=Tonyu.A(arguments);
        var __pc=0;
        
        
        _thread.retVal=_this;return;
      },
      __dummy: false
    };
  },
  decls: {"methods":{"main":{"nowait":false},"test":{"nowait":false},"test2":{"nowait":false}},"fields":{"a":{}}}
});

//# sourceMappingURL=concat.js.map