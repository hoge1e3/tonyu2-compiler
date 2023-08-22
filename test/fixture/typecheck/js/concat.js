if(!Tonyu.load)Tonyu.load=(_,f)=>f();
Tonyu.load({"compiler":{"dependingProjects":[{"dir":"../updatable/"}],"outputFile":"js/concat.js","namespace":"user","typeCheck":"true"},"run":{}}, ()=>{
Tonyu.klass.define({
  fullName: 'user.A',
  shortName: 'A',
  namespace: 'user',
  superclass: Tonyu.classes.updatable.Updatable,
  includes: [],
  methods: function (__superClass) {
    return {
      main :function _trc_A_main() {
        var _this=this;
        
        
        
        _this.ns = 3;
        
        console.log(_this.ns.hoge);
        _this.print(Number);
        _this.print(Number);
        console.log(_this.s.length);
      },
      fiber$main :function* _trc_A_f_main(_thread) {
        var _this=this;
        
        
        
        _this.ns = 3;
        
        console.log(_this.ns.hoge);
        _this.print(Number);
        _this.print(Number);
        console.log(_this.s.length);
        
      },
      test :function _trc_A_test() {
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
        var _this=this;
        
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
        var _this=this;
        
        console.log(x);
      },
      __setter__e :function _trc_A___setter__e(x) {
        var _this=this;
        
        return 3;
      },
      __dummy: false
    };
  },
  decls: {"methods":{"main":{"nowait":false,"isMain":true,"vtype":{"params":[],"returnValue":null}},"test":{"nowait":false,"isMain":false,"vtype":{"params":[],"returnValue":"user.A"}},"toste":{"nowait":true,"isMain":false,"vtype":{"params":["Number"],"returnValue":"user.A"}},"__setter__e":{"nowait":true,"isMain":false,"vtype":{"params":["Number"],"returnValue":null}}},"fields":{"x":{"vtype":"Number"},"s":{"vtype":"String"},"ns":{"vtype":{"candidates":["Number","String","user.A"]}},"print":{},"n":{}}}
});
Tonyu.klass.define({
  fullName: 'user.Ary',
  shortName: 'Ary',
  namespace: 'user',
  includes: [],
  methods: function (__superClass) {
    return {
      main :function _trc_Ary_main() {
        var _this=this;
        
        _this.list = [new Tonyu.classes.user.A];
        
        _this.print("typeofx",Tonyu.classMetas['user.A']);
      },
      fiber$main :function* _trc_Ary_f_main(_thread) {
        var _this=this;
        
        _this.list = [new Tonyu.classes.user.A];
        
        _this.print("typeofx",Tonyu.classMetas['user.A']);
        
      },
      __getter__x :function _trc_Ary___getter__x() {
        var _this=this;
        
        return new Tonyu.classes.user.A;
      },
      __dummy: false
    };
  },
  decls: {"methods":{"main":{"nowait":false,"isMain":true,"vtype":{"params":[],"returnValue":null}},"__getter__x":{"nowait":true,"isMain":false,"vtype":{"params":[],"returnValue":"user.A"}}},"fields":{"list":{"vtype":{"element":"user.A"}},"print":{}}}
});
Tonyu.klass.define({
  fullName: 'user.Main',
  shortName: 'Main',
  namespace: 'user',
  includes: [],
  methods: function (__superClass) {
    return {
      main :function _trc_Main_main() {
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
        _this.print(Number);
        _this.n = 3;
        
        _this.a.n=10;
        _this.s = ['a= ',_this.a.n,'  '].join('');
        
        _this.print(_this.s,_this.s.length);
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
        _this.func("hoge",3);
      },
      fiber$main :function* _trc_Main_f_main(_thread) {
        var _this=this;
        
        "external waitable";
        _this.a = new Tonyu.classes.user.A();
        
        (yield* _this.fiber$print(_thread, Tonyu.classMetas['user.A']));
        (yield* _this.fiber$print(_thread, Number));
        (yield* _this.fiber$print(_thread, String));
        (yield* _this.fiber$print(_thread, Tonyu.classMetas['user.A'].decls.methods.test));
        (yield* _this.fiber$print(_thread, Tonyu.classMetas['user.A']));
        (yield* _this.fiber$print(_thread, Tonyu.classMetas['user.Main'].decls.methods.getA));
        (yield* _this.fiber$print(_thread, Tonyu.classMetas['user.A']));
        (yield* _this.fiber$print(_thread, Number));
        _this.n = 3;
        
        _this.a.n=10;
        _this.s = ['a= ',_this.a.n,'  '].join('');
        
        (yield* _this.fiber$print(_thread, _this.s, _this.s.length));
        _this.r=yield* _this.getA().fiber$test(_thread);
        
        (yield* _this.fiber$print(_thread, _this.r));
        _this.alist = [];
        
        (yield* _this.fiber$print(_thread, [Tonyu.classMetas['user.A']]));
        (yield* _this.fiber$print(_thread, Tonyu.classMetas['user.A']));
        _this.alist.push(_this.a);
        _this.alist[0].test();
        for (let [i, e] of Tonyu.iterator2(_this.alist,2)) {
          (yield* _this.fiber$print(_thread, i, e.test()));
          (yield* _this.fiber$print(_thread, Number, Tonyu.classMetas['user.A']));
          
        }
        (yield* _this.fiber$func(_thread, "hoge", 3));
        
      },
      print :function _trc_Main_print(...x) {
        var _this=this;
        
        console.log(...x);
      },
      fiber$print :function* _trc_Main_f_print(_thread,...x) {
        var _this=this;
        
        console.log(...x);
        
      },
      getA :function _trc_Main_getA() {
        var _this=this;
        
        let b;
        return _this.a;
      },
      fiber$getA :function* _trc_Main_f_getA(_thread) {
        var _this=this;
        
        let b;
        return _this.a;
        
      },
      func :function _trc_Main_func(...a) {
        var _this=this;
        
        a.push("fuga");
        _this.print("FUNC",...a);
      },
      fiber$func :function* _trc_Main_f_func(_thread,...a) {
        var _this=this;
        
        a.push("fuga");
        (yield* _this.fiber$print(_thread, "FUNC", ...a));
        
      },
      __dummy: false
    };
  },
  decls: {"methods":{"main":{"nowait":false,"isMain":true,"vtype":{"params":[],"returnValue":null}},"print":{"nowait":false,"isMain":false,"vtype":{"params":[null],"returnValue":null}},"getA":{"nowait":false,"isMain":false,"vtype":{"params":[],"returnValue":"user.A"}},"func":{"nowait":false,"isMain":false,"vtype":{"params":[null],"returnValue":null}}},"fields":{"a":{"vtype":"user.A"},"n":{"vtype":"Number"},"s":{"vtype":"String"},"r":{"vtype":"user.A"},"alist":{"vtype":{"element":"user.A"}}}}
});

});

//# sourceMappingURL=concat.js.map