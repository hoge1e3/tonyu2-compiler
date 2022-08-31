Tonyu.klass.define({
  fullName: 'user.Main',
  shortName: 'Main',
  namespace: 'user',
  includes: [],
  methods: function (__superClass) {
    return {
      main :function _trc_Main_main() {
        var _this=this;
        
        _this.f("hoge",3);
      },
      fiber$main :function* _trc_Main_f_main(_thread) {
        var _this=this;
        //var _arguments=Tonyu.A(arguments);
        
        (yield* _this.fiber$f(_thread, "hoge", 3));
        
      },
      f :function _trc_Main_f(...a) {
        var _this=this;
        
        console.log("A",...a);
      },
      fiber$f :function* _trc_Main_f_f(_thread,...a) {
        var _this=this;
        //var _arguments=Tonyu.A(arguments);
        
        console.log("A",...a);
        
      },
      __dummy: false
    };
  },
  decls: {"methods":{"main":{"nowait":false,"isMain":true,"vtype":{"params":[],"returnValue":null}},"f":{"nowait":false,"isMain":false,"vtype":{"params":[null],"returnValue":null}}},"fields":{}}
});

//# sourceMappingURL=concat.js.map