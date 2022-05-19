Tonyu.klass.define({
  fullName: 'user.A',
  shortName: 'A',
  namespace: 'user',
  superclass: Tonyu.classes.updatable.Updatable,
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
        var i;
        var s;
        
        i = 0;
        s = 0;
        
        while (i<_this.n) {
          Tonyu.checkLoop();
          console.log(i);
          _this.update();
          i++;
          s+=i;
          
        }
        return s;
      },
      fiber$test :function _trc_A_f_test(_thread) {
        "use strict";
        var _this=this;
        //var _arguments=Tonyu.A(arguments);
        var __pc=0;
        var i;
        var s;
        
        i = 0;
        s = 0;
        
        
        _thread.enter(function _trc_A_ent_test(_thread) {
          if (_thread.lastEx) __pc=_thread.catchPC;
          for(var __cnt=100 ; __cnt--;) {
            switch (__pc) {
            case 0:
            case 1:
              if (!(i<_this.n)) { __pc=3     ; break; }
              console.log(i);
              _this.fiber$update(_thread);
              __pc=2;return;
            case 2:
              
              i++;
              s+=i;
              __pc=1;break;
            case 3     :
              
              _thread.exit(s);return;
              _thread.exit(_this);return;
            }
          }
        });
      },
      toste :function _trc_A_toste() {
        "use strict";
        var _this=this;
        
      },
      __dummy: false
    };
  },
  decls: {"methods":{"main":{"nowait":false},"test":{"nowait":false},"toste":{"nowait":true}},"fields":{"x":{"vtype":"Number"},"s":{"vtype":"String"},"n":{}}}
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
        
        _this.n = 3;
        
        _this.a.n=10;
        _this.r=_this.a.test();
        _this.print(_this.r);
      },
      fiber$main :function _trc_Main_f_main(_thread) {
        "use strict";
        var _this=this;
        //var _arguments=Tonyu.A(arguments);
        var __pc=0;
        
        _this.a = new Tonyu.classes.user.A();
        
        _this.n = 3;
        
        _this.a.n=10;
        
        _thread.enter(function _trc_Main_ent_main(_thread) {
          if (_thread.lastEx) __pc=_thread.catchPC;
          for(var __cnt=100 ; __cnt--;) {
            switch (__pc) {
            case 0:
              _this.a.fiber$test(_thread);
              __pc=1;return;
            case 1:
              _this.r=_thread.retVal;
              
              _this.fiber$print(_thread, _this.r);
              __pc=2;return;
            case 2:
              
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
  decls: {"methods":{"main":{"nowait":false},"print":{"nowait":false}},"fields":{"a":{"vtype":"user.A"},"n":{},"r":{}}}
});

//# sourceMappingURL=concat.js.map