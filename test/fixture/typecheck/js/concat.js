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
      __dummy: false
    };
  },
  decls: {"methods":{"main":{"nowait":false}},"fields":{"x":{},"s":{}}}
});
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
        
        _this.a = new Tonyu.classes.user.A();
        
        _this.print('Any');
        _this.print('Any');
        _this.print('Any');
      },
      fiber$main :function _trc_Main_f_main(_thread) {
        "use strict";
        var _this=this;
        //var _arguments=Tonyu.A(arguments);
        var __pc=0;
        
        _this.a = new Tonyu.classes.user.A();
        
        
        _thread.enter(function _trc_Main_ent_main(_thread) {
          if (_thread.lastEx) __pc=_thread.catchPC;
          for(var __cnt=100 ; __cnt--;) {
            switch (__pc) {
            case 0:
              _this.fiber$print(_thread, 'Any');
              __pc=1;return;
            case 1:
              
              _this.fiber$print(_thread, 'Any');
              __pc=2;return;
            case 2:
              
              _this.fiber$print(_thread, 'Any');
              __pc=3;return;
            case 3:
              
              _thread.exit(_this);return;
            }
          }
        });
      },
      print :function _trc_Main_print(x) {
        "use strict";
        var _this=this;
        
        console.log(x);
      },
      fiber$print :function _trc_Main_f_print(_thread,x) {
        "use strict";
        var _this=this;
        //var _arguments=Tonyu.A(arguments);
        var __pc=0;
        
        console.log(x);
        
        _thread.retVal=_this;return;
      },
      __dummy: false
    };
  },
  decls: {"methods":{"main":{"nowait":false},"print":{"nowait":false}},"fields":{"a":{}}}
});

//# sourceMappingURL=concat.js.map