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
        
        _this.x = 2+10;
        
        _this.s = ['test \r\n ',_this.x,'\r\ndesuka? '].join('');
        
        console.log(_this.s);
      },
      fiber$main :function* _trc_Main_f_main(_thread) {
        "use strict";
        var _this=this;
        //var _arguments=Tonyu.A(arguments);
        
        _this.x = 2+10;
        
        _this.s = ['test \r\n ',_this.x,'\r\ndesuka? '].join('');
        
        console.log(_this.s);
        
      },
      __dummy: false
    };
  },
  decls: {"methods":{"main":{"nowait":false,"isMain":true,"vtype":{"params":[],"returnValue":null}}},"fields":{"x":{},"s":{"vtype":"String"}}}
});

//# sourceMappingURL=concat.js.map