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
        
        _this.a=[1,5,3];
        for ([_this.e] of Tonyu.iterator2(_this.a,1)) {
          console.log(_this.e);
          
        }
        console.log("START");
        for (_this.i=_this.test(); _this.i<10 ; _this.i++) {
          Tonyu.checkLoop();
          {
            console.log(_this.i);
          }
        }
        _this.test2();
      },
      fiber$main :function* _trc_Main_f_main(_thread) {
        "use strict";
        var _this=this;
        //var _arguments=Tonyu.A(arguments);
        
        _this.a=[1,5,3];
        for ([_this.e] of Tonyu.iterator2(_this.a,1)) {
          console.log(_this.e);
          
        }
        console.log("START");
        for (_this.i=(yield* _this.fiber$test(_thread)); _this.i<10 ; _this.i++) {
          yield null;
          {
            console.log(_this.i);
          }
        }
        (yield* _this.fiber$test2(_thread));
        
      },
      test :function _trc_Main_test() {
        "use strict";
        var _this=this;
        
        new Promise((function anonymous_91(s,e) {
          
          setTimeout((function anonymous_120() {
            
            s(100);
          }),500);
        }));
        return 5;
      },
      fiber$test :function* _trc_Main_f_test(_thread) {
        "use strict";
        var _this=this;
        //var _arguments=Tonyu.A(arguments);
        
        (yield* _thread.await(new Promise((function anonymous_91(s,e) {
          
          setTimeout((function anonymous_120() {
            
            s(100);
          }),500);
        }))));
        return 5;
        
      },
      test2 :function _trc_Main_test2() {
        "use strict";
        var _this=this;
        var i;
        var k;
        var v;
        
        console.log("START2");
        for (i = _this.test();
         i<10 ; i++) {
          Tonyu.checkLoop();
          {
            console.log(i);
          }
        }
        for ([k, v] of Tonyu.iterator2(_this,2)) {
          if (typeof  v==="function") {
            continue;
            
          }
          console.log(k,v);
          
        }
      },
      fiber$test2 :function* _trc_Main_f_test2(_thread) {
        "use strict";
        var _this=this;
        //var _arguments=Tonyu.A(arguments);
        var i;
        var k;
        var v;
        
        console.log("START2");
        for (i=yield* _this.fiber$test(_thread);
         i<10 ; i++) {
          yield null;
          {
            console.log(i);
          }
        }
        for ([k, v] of Tonyu.iterator2(_this,2)) {
          if (typeof  v==="function") {
            continue;
            
          }
          console.log(k,v);
          
        }
        
      },
      test3 :function _trc_Main_test3() {
        "use strict";
        var _this=this;
        var i;
        var x;
        
        for ([i] of Tonyu.iterator2([1,2,3],1)) {
          x = i;
          
          
        }
        console.log(x);
      },
      fiber$test3 :function* _trc_Main_f_test3(_thread) {
        "use strict";
        var _this=this;
        //var _arguments=Tonyu.A(arguments);
        var i;
        var x;
        
        for ([i] of Tonyu.iterator2([1,2,3],1)) {
          x = i;
          
          
        }
        console.log(x);
        
      },
      __dummy: false
    };
  },
  decls: {"methods":{"main":{"nowait":false,"isMain":true,"vtype":{"params":[],"returnValue":null}},"test":{"nowait":false,"isMain":false,"vtype":{"params":[],"returnValue":null}},"test2":{"nowait":false,"isMain":false,"vtype":{"params":[],"returnValue":null}},"test3":{"nowait":false,"isMain":false,"vtype":{"params":[],"returnValue":null}}},"fields":{"a":{},"e":{},"i":{}}}
});

//# sourceMappingURL=concat.js.map