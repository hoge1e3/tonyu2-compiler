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
        
      },
      fiber$main :function* _trc_Main_f_main(_thread) {
        "use strict";
        var _this=this;
        //var _arguments=Tonyu.A(arguments);
        
        
      },
      test :function _trc_Main_test() {
        "use strict";
        var _this=this;
        
        let nonvar = 3;
        
        for (let nonvar = 0;
         nonvar<10 ; nonvar++) {
          Tonyu.checkLoop();
          ;
          
        }
      },
      fiber$test :function* _trc_Main_f_test(_thread) {
        "use strict";
        var _this=this;
        //var _arguments=Tonyu.A(arguments);
        
        let nonvar = 3;
        
        for (let nonvar = 0;
         nonvar<10 ; nonvar++) {
          yield null;
          ;
          
        }
        
      },
      __dummy: false
    };
  },
  decls: {"methods":{"main":{"nowait":false},"test":{"nowait":false}},"fields":{}}
});

//# sourceMappingURL=concat.js.map