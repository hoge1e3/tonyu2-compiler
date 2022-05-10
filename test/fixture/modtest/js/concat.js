Tonyu.klass.define({
  fullName: 'user.EMod',
  shortName: 'EMod',
  namespace: 'user',
  includes: [],
  methods: function (__superClass) {
    return {
      main :function _trc_EMod_main() {
        "use strict";
        var _this=this;
        
      },
      fiber$main :function _trc_EMod_f_main(_thread) {
        "use strict";
        var _this=this;
        //var _arguments=Tonyu.A(arguments);
        var __pc=0;
        
        
        _thread.retVal=_this;return;
      },
      test :function _trc_EMod_test() {
        "use strict";
        var _this=this;
        
        _this.print("EMod::test");
        __superClass.prototype.test.apply( _this, []);
      },
      fiber$test :function _trc_EMod_f_test(_thread) {
        "use strict";
        var _this=this;
        //var _arguments=Tonyu.A(arguments);
        var __pc=0;
        
        _this.print("EMod::test");
        
        _thread.enter(function _trc_EMod_ent_test(_thread) {
          if (_thread.lastEx) __pc=_thread.catchPC;
          for(var __cnt=100 ; __cnt--;) {
            switch (__pc) {
            case 0:
              __superClass.prototype.fiber$test.apply( _this, [_thread]);
              __pc=1;return;
            case 1:
              
              _thread.exit(_this);return;
            }
          }
        });
      },
      __dummy: false
    };
  },
  decls: {"methods":{"main":{"nowait":false},"test":{"nowait":false}},"fields":{"print":{}}}
});
Tonyu.klass.define({
  fullName: 'user.FMod',
  shortName: 'FMod',
  namespace: 'user',
  includes: [],
  methods: function (__superClass) {
    return {
      main :function _trc_FMod_main() {
        "use strict";
        var _this=this;
        
      },
      fiber$main :function _trc_FMod_f_main(_thread) {
        "use strict";
        var _this=this;
        //var _arguments=Tonyu.A(arguments);
        var __pc=0;
        
        
        _thread.retVal=_this;return;
      },
      test :function _trc_FMod_test() {
        "use strict";
        var _this=this;
        
        _this.print("FMod::test");
      },
      fiber$test :function _trc_FMod_f_test(_thread) {
        "use strict";
        var _this=this;
        //var _arguments=Tonyu.A(arguments);
        var __pc=0;
        
        _this.print("FMod::test");
        
        _thread.retVal=_this;return;
      },
      __dummy: false
    };
  },
  decls: {"methods":{"main":{"nowait":false},"test":{"nowait":false}},"fields":{"print":{}}}
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
        
        _this.a=new Tonyu.classes.user.A();
        _this.a.test();
      },
      fiber$main :function _trc_Main_f_main(_thread) {
        "use strict";
        var _this=this;
        //var _arguments=Tonyu.A(arguments);
        var __pc=0;
        
        _this.a=new Tonyu.classes.user.A();
        _this.a.test();
        
        _thread.retVal=_this;return;
      },
      __dummy: false
    };
  },
  decls: {"methods":{"main":{"nowait":false}},"fields":{"a":{}}}
});
Tonyu.klass.define({
  fullName: 'user.B',
  shortName: 'B',
  namespace: 'user',
  includes: [Tonyu.classes.user.FMod],
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
      initialize :function _trc_B_initialize() {
        "use strict";
        var _this=this;
        
        _this.print("new::B");
      },
      test :function _trc_B_test() {
        "use strict";
        var _this=this;
        
        _this.print("B::test");
        __superClass.prototype.test.apply( _this, []);
      },
      fiber$test :function _trc_B_f_test(_thread) {
        "use strict";
        var _this=this;
        //var _arguments=Tonyu.A(arguments);
        var __pc=0;
        
        _this.print("B::test");
        
        _thread.enter(function _trc_B_ent_test(_thread) {
          if (_thread.lastEx) __pc=_thread.catchPC;
          for(var __cnt=100 ; __cnt--;) {
            switch (__pc) {
            case 0:
              __superClass.prototype.fiber$test.apply( _this, [_thread]);
              __pc=1;return;
            case 1:
              
              _thread.exit(_this);return;
            }
          }
        });
      },
      __dummy: false
    };
  },
  decls: {"methods":{"main":{"nowait":false},"new":{"nowait":false},"test":{"nowait":false}},"fields":{}}
});
Tonyu.klass.define({
  fullName: 'user.CMod',
  shortName: 'CMod',
  namespace: 'user',
  includes: [Tonyu.classes.user.EMod],
  methods: function (__superClass) {
    return {
      main :function _trc_CMod_main() {
        "use strict";
        var _this=this;
        
      },
      fiber$main :function _trc_CMod_f_main(_thread) {
        "use strict";
        var _this=this;
        //var _arguments=Tonyu.A(arguments);
        var __pc=0;
        
        
        _thread.retVal=_this;return;
      },
      test :function _trc_CMod_test() {
        "use strict";
        var _this=this;
        
        _this.print("CMod::test");
        __superClass.prototype.test.apply( _this, []);
      },
      fiber$test :function _trc_CMod_f_test(_thread) {
        "use strict";
        var _this=this;
        //var _arguments=Tonyu.A(arguments);
        var __pc=0;
        
        _this.print("CMod::test");
        
        _thread.enter(function _trc_CMod_ent_test(_thread) {
          if (_thread.lastEx) __pc=_thread.catchPC;
          for(var __cnt=100 ; __cnt--;) {
            switch (__pc) {
            case 0:
              __superClass.prototype.fiber$test.apply( _this, [_thread]);
              __pc=1;return;
            case 1:
              
              _thread.exit(_this);return;
            }
          }
        });
      },
      __dummy: false
    };
  },
  decls: {"methods":{"main":{"nowait":false},"test":{"nowait":false}},"fields":{}}
});
Tonyu.klass.define({
  fullName: 'user.DMod',
  shortName: 'DMod',
  namespace: 'user',
  includes: [Tonyu.classes.user.FMod],
  methods: function (__superClass) {
    return {
      main :function _trc_DMod_main() {
        "use strict";
        var _this=this;
        
      },
      fiber$main :function _trc_DMod_f_main(_thread) {
        "use strict";
        var _this=this;
        //var _arguments=Tonyu.A(arguments);
        var __pc=0;
        
        
        _thread.retVal=_this;return;
      },
      test :function _trc_DMod_test() {
        "use strict";
        var _this=this;
        
        _this.print("DMod::test");
        __superClass.prototype.test.apply( _this, []);
      },
      fiber$test :function _trc_DMod_f_test(_thread) {
        "use strict";
        var _this=this;
        //var _arguments=Tonyu.A(arguments);
        var __pc=0;
        
        _this.print("DMod::test");
        
        _thread.enter(function _trc_DMod_ent_test(_thread) {
          if (_thread.lastEx) __pc=_thread.catchPC;
          for(var __cnt=100 ; __cnt--;) {
            switch (__pc) {
            case 0:
              __superClass.prototype.fiber$test.apply( _this, [_thread]);
              __pc=1;return;
            case 1:
              
              _thread.exit(_this);return;
            }
          }
        });
      },
      __dummy: false
    };
  },
  decls: {"methods":{"main":{"nowait":false},"test":{"nowait":false}},"fields":{}}
});
Tonyu.klass.define({
  fullName: 'user.A',
  shortName: 'A',
  namespace: 'user',
  superclass: Tonyu.classes.user.B,
  includes: [Tonyu.classes.user.CMod,Tonyu.classes.user.DMod],
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
      initialize :function _trc_A_initialize() {
        "use strict";
        var _this=this;
        
        _this.print("new::A");
        __superClass.apply( _this, []);
        _this.x=5;
        _this.print(_this);
      },
      test :function _trc_A_test() {
        "use strict";
        var _this=this;
        
        _this.print("A::test");
        __superClass.prototype.test.apply( _this, []);
      },
      fiber$test :function _trc_A_f_test(_thread) {
        "use strict";
        var _this=this;
        //var _arguments=Tonyu.A(arguments);
        var __pc=0;
        
        _this.print("A::test");
        
        _thread.enter(function _trc_A_ent_test(_thread) {
          if (_thread.lastEx) __pc=_thread.catchPC;
          for(var __cnt=100 ; __cnt--;) {
            switch (__pc) {
            case 0:
              __superClass.prototype.fiber$test.apply( _this, [_thread]);
              __pc=1;return;
            case 1:
              
              _thread.exit(_this);return;
            }
          }
        });
      },
      print :function _trc_A_print(s) {
        "use strict";
        var _this=this;
        
        console.log(s);
      },
      fiber$print :function _trc_A_f_print(_thread,s) {
        "use strict";
        var _this=this;
        //var _arguments=Tonyu.A(arguments);
        var __pc=0;
        
        console.log(s);
        
        _thread.retVal=_this;return;
      },
      __dummy: false
    };
  },
  decls: {"methods":{"main":{"nowait":false},"new":{"nowait":false},"test":{"nowait":false},"print":{"nowait":false}},"fields":{"x":{}}}
});

//# sourceMappingURL=concat.js.map