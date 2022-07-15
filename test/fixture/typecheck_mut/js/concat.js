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
        
        _this.b = new Tonyu.classes.user.B();
        
      },
      fiber$main :function* _trc_A_f_main(_thread) {
        "use strict";
        var _this=this;
        //var _arguments=Tonyu.A(arguments);
        
        _this.b = new Tonyu.classes.user.B();
        
        
      },
      __dummy: false
    };
  },
  decls: {"methods":{"main":{"nowait":false}},"fields":{"b":{"vtype":"user.B"}}}
});
Tonyu.klass.define({
  fullName: 'user.B',
  shortName: 'B',
  namespace: 'user',
  superclass: Tonyu.classes.updatable.Updatable,
  includes: [],
  methods: function (__superClass) {
    return {
      main :function _trc_B_main() {
        "use strict";
        var _this=this;
        
        _this.a = new Tonyu.classes.user.A();
        
      },
      fiber$main :function* _trc_B_f_main(_thread) {
        "use strict";
        var _this=this;
        //var _arguments=Tonyu.A(arguments);
        
        _this.a = new Tonyu.classes.user.A();
        
        
      },
      __dummy: false
    };
  },
  decls: {"methods":{"main":{"nowait":false}},"fields":{"a":{"vtype":"user.A"}}}
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
        
        _this.b = new Tonyu.classes.user.B();
        
        _this.print(Tonyu.classMetas['user.A']);
        _this.print(Tonyu.classMetas['user.B']);
        _this.print(Tonyu.classMetas['user.B']);
        _this.print(Tonyu.classMetas['user.A']);
        _this.print(Tonyu.classMetas['user.A']);
        _this.print(Tonyu.classMetas['user.B']);
      },
      fiber$main :function* _trc_Main_f_main(_thread) {
        "use strict";
        var _this=this;
        //var _arguments=Tonyu.A(arguments);
        
        _this.a = new Tonyu.classes.user.A();
        
        _this.b = new Tonyu.classes.user.B();
        
        _this.print(Tonyu.classMetas['user.A']);
        _this.print(Tonyu.classMetas['user.B']);
        _this.print(Tonyu.classMetas['user.B']);
        _this.print(Tonyu.classMetas['user.A']);
        _this.print(Tonyu.classMetas['user.A']);
        _this.print(Tonyu.classMetas['user.B']);
        
      },
      __dummy: false
    };
  },
  decls: {"methods":{"main":{"nowait":false}},"fields":{"a":{"vtype":"user.A"},"b":{"vtype":"user.B"},"print":{}}}
});

//# sourceMappingURL=concat.js.map