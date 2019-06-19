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
        
        console.log("Hello");
      },
      fiber$main :function _trc_Main_f_main(_thread) {
        "use strict";
        var _this=this;
        //var _arguments=Tonyu.A(arguments);
        var __pc=0;
        
        console.log("Hello");
        
        _thread.retVal=_this;return;
      },
      __dummy: false
    };
  },
  decls: {"methods":{"main":{"nowait":false}},"fields":{}}
});

//# sourceMappingURL=concat.js.map