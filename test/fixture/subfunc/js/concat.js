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
        
        _this.aa=50;
        _this.a();
      },
      fiber$main :function* _trc_Main_f_main(_thread) {
        "use strict";
        var _this=this;
        //var _arguments=Tonyu.A(arguments);
        
        _this.aa=50;
        (yield* _this.fiber$a(_thread));
        
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
      a :function _trc_Main_a() {
        "use strict";
        var _this=this;
        function b() {
          
          _this.print(aa);
        }
        let aa = 10;
        
        
        b();
      },
      fiber$a :function* _trc_Main_f_a(_thread) {
        "use strict";
        var _this=this;
        //var _arguments=Tonyu.A(arguments);
        function b() {
          
          _this.print(aa);
        }
        let aa = 10;
        
        
        b();
        
      },
      __dummy: false
    };
  },
  decls: {"methods":{"main":{"nowait":false,"isMain":true,"vtype":{"params":[],"returnValue":null}},"print":{"nowait":false,"isMain":false,"vtype":{"params":[null],"returnValue":null}},"a":{"nowait":false,"isMain":false,"vtype":{"params":[],"returnValue":null}}},"fields":{"aa":{}}}
});

//# sourceMappingURL=concat.js.map