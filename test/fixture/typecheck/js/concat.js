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
      fiber$main :function* _trc_A_f_main(_thread) {
        "use strict";
        var _this=this;
        //var _arguments=Tonyu.A(arguments);
        
        
        
        
      },
      test :function _trc_A_test() {
        "use strict";
        var _this=this;
        
        let i = 0;
        let s = 0;
        
        while (i<_this.n) {
          Tonyu.checkLoop();
          console.log(i);
          _this.update();
          i++;
          s+=i;
          
        }
        return _this;
      },
      fiber$test :function* _trc_A_f_test(_thread) {
        "use strict";
        var _this=this;
        //var _arguments=Tonyu.A(arguments);
        
        let i = 0;
        let s = 0;
        
        while (i<_this.n) {
          yield null;
          console.log(i);
          (yield* _this.fiber$update(_thread));
          i++;
          s+=i;
          
        }
        return _this;
        
      },
      toste :function _trc_A_toste(x) {
        "use strict";
        var _this=this;
        
        console.log(x);
      },
      __dummy: false
    };
  },
  decls: {"methods":{"main":{"nowait":false,"isMain":true,"vtype":{"params":[],"returnValue":null}},"test":{"nowait":false,"isMain":false,"vtype":{"params":[],"returnValue":"user.A"}},"toste":{"nowait":true,"isMain":false,"vtype":{"params":["Number"],"returnValue":"user.A"}}},"fields":{"x":{"vtype":"Number"},"s":{"vtype":"String"},"n":{}}}
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
        
        "external waitable";
        _this.a = new Tonyu.classes.user.A();
        
        _this.print(Tonyu.classMetas['user.A']);
        _this.print(Number);
        _this.print(String);
        _this.print(Tonyu.classMetas['user.A'].decls.methods.test);
        _this.print(Tonyu.classMetas['user.A']);
        _this.print(Tonyu.classMetas['user.Main'].decls.methods.getA);
        _this.print(Tonyu.classMetas['user.A']);
        _this.a.hoge;
        _this.n = 3;
        
        _this.a.n=10;
        _this.r = _this.getA().test();
        
        _this.print(_this.r);
        _this.alist = [];
        
        _this.print([Tonyu.classMetas['user.A']]);
        _this.print(Tonyu.classMetas['user.A']);
        _this.alist.push(_this.a);
        _this.alist[0].test();
        for (let [i, e] of Tonyu.iterator2(_this.alist,2)) {
          _this.print(i,e.test());
          _this.print(Number,Tonyu.classMetas['user.A']);
          
        }
      },
      fiber$main :function* _trc_Main_f_main(_thread) {
        "use strict";
        var _this=this;
        //var _arguments=Tonyu.A(arguments);
        
        "external waitable";
        _this.a = new Tonyu.classes.user.A();
        
        (yield* _this.fiber$print(_thread, Tonyu.classMetas['user.A']));
        (yield* _this.fiber$print(_thread, Number));
        (yield* _this.fiber$print(_thread, String));
        (yield* _this.fiber$print(_thread, Tonyu.classMetas['user.A'].decls.methods.test));
        (yield* _this.fiber$print(_thread, Tonyu.classMetas['user.A']));
        (yield* _this.fiber$print(_thread, Tonyu.classMetas['user.Main'].decls.methods.getA));
        (yield* _this.fiber$print(_thread, Tonyu.classMetas['user.A']));
        _this.a.hoge;
        _this.n = 3;
        
        _this.a.n=10;
        _this.r=yield* _this.getA().fiber$test(_thread);
        
        (yield* _this.fiber$print(_thread, _this.r));
        _this.alist = [];
        
        (yield* _this.fiber$print(_thread, [Tonyu.classMetas['user.A']]));
        (yield* _this.fiber$print(_thread, Tonyu.classMetas['user.A']));
        _this.alist.push(_this.a);
        (yield* _this.alist[0].fiber$test(_thread));
        for (let [i, e] of Tonyu.iterator2(_this.alist,2)) {
          (yield* _this.fiber$print(_thread, i, e.test()));
          (yield* _this.fiber$print(_thread, Number, Tonyu.classMetas['user.A']));
          
        }
        
      },
      print :function _trc_Main_print(x) {
        "use strict";
        var _this=this;
        
        console.log(x);
      },
      fiber$print :function* _trc_Main_f_print(_thread,x) {
        "use strict";
        var _this=this;
        //var _arguments=Tonyu.A(arguments);
        
        console.log(x);
        
      },
      getA :function _trc_Main_getA() {
        "use strict";
        var _this=this;
        
        let b;
        return _this.a;
      },
      fiber$getA :function* _trc_Main_f_getA(_thread) {
        "use strict";
        var _this=this;
        //var _arguments=Tonyu.A(arguments);
        
        let b;
        return _this.a;
        
      },
      __dummy: false
    };
  },
  decls: {"methods":{"main":{"nowait":false,"isMain":true,"vtype":{"params":[],"returnValue":null}},"print":{"nowait":false,"isMain":false,"vtype":{"params":[null],"returnValue":null}},"getA":{"nowait":false,"isMain":false,"vtype":{"params":[],"returnValue":"user.A"}}},"fields":{"a":{"vtype":"user.A"},"n":{"vtype":"Number"},"r":{"vtype":"user.A"},"alist":{"vtype":{"element":"user.A"}}}}
});

//# sourceMappingURL=concat.js.map