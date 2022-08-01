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
        
        _this.x=_this.y=100;
        while (_this.x<200) {
          Tonyu.checkLoop();
          _this.x++;
          _this.update();
          
        }
      },
      fiber$main :function* _trc_Main_f_main(_thread) {
        "use strict";
        var _this=this;
        //var _arguments=Tonyu.A(arguments);
        
        _this.x=_this.y=100;
        while (_this.x<200) {
          yield null;
          _this.x++;
          _this.update();
          
        }
        
      },
      __dummy: false
    };
  },
  decls: {"methods":{"main":{"nowait":false,"isMain":true,"vtype":{"params":[],"returnValue":null}}},"fields":{"x":{},"y":{},"update":{}}}
});

//# sourceMappingURL=concat.js.map