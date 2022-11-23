Tonyu.klass.define({
  fullName: 'user.Main',
  shortName: 'Main',
  namespace: 'user',
  superclass: Tonyu.classes.kernel.Actor,
  includes: [],
  methods: function (__superClass) {
    return {
      main :function _trc_Main_main() {
        var _this=this;
        
        _this.print("GO!");
        _this.p = new Promise((function anonymous_57(s,e) {
          
          setTimeout(s,1000);
        }));
        
        _this.waitFor(_this.p);
        while (true) {
          Tonyu.checkLoop();
          _this.print("hoge");
          
        }
      },
      fiber$main :function* _trc_Main_f_main(_thread) {
        var _this=this;
        //var _arguments=Tonyu.A(arguments);
        
        _this.print("GO!");
        _this.p = new Promise((function anonymous_57(s,e) {
          
          setTimeout(s,1000);
        }));
        
        (yield* _this.fiber$waitFor(_thread, _this.p));
        while (true) {
          yield null;
          _this.print("hoge");
          
        }
        
      },
      __dummy: false
    };
  },
  decls: {"methods":{"main":{"nowait":false,"isMain":true,"vtype":{"params":[],"returnValue":null}}},"fields":{"p":{}}}
});

//# sourceMappingURL=concat.js.map