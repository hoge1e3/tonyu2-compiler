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
        var e;
        
        _this.r=new Promise((function anonymous_78(s,e) {
          
          setTimeout((function anonymous_107() {
            
            e(100);
          }),500);
        }));
        try {
          console.log(_this.r);
          
        } catch (e) {
          console.error("ERA-",e);
          
        }
      },
      fiber$main :function* _trc_Main_f_main(_thread) {
        "use strict";
        var _this=this;
        //var _arguments=Tonyu.A(arguments);
        var e;
        
        _this.r=(yield* _thread.await(new Promise((function anonymous_78(s,e) {
          
          setTimeout((function anonymous_107() {
            
            e(100);
          }),500);
        }))));
        try {
          console.log(_this.r);
          
        } catch (e) {
          console.error("ERA-",e);
          
        }
        
      },
      __dummy: false
    };
  },
  decls: {"methods":{"main":{"nowait":false}},"fields":{"r":{}}}
});

//# sourceMappingURL=concat.js.map