Tonyu.klass.define({
  fullName: 'user.Chara',
  shortName: 'Chara',
  namespace: 'user',
  includes: [],
  methods: function (__superClass) {
    return {
      main :function _trc_Chara_main() {
        "use strict";
        var _this=this;
        
        _this.x=3+_this.a*2>5?2*3+4*5:! _this.x;
        while (true) {
          Tonyu.checkLoop();
          
          
        }
      },
      fiber$main :function _trc_Chara_f_main(_thread) {
        "use strict";
        var _this=this;
        //var _arguments=Tonyu.A(arguments);
        var __pc=0;
        
        _this.x=3+_this.a*2>5?2*3+4*5:! _this.x;
        
        _thread.enter(function _trc_Chara_ent_main(_thread) {
          if (_thread.lastEx) __pc=_thread.catchPC;
          for(var __cnt=100 ; __cnt--;) {
            switch (__pc) {
            case 0:
            case 1:
              {
                
              }
              __pc=1;break;
            case 2     :
              
              _thread.exit(_this);return;
            }
          }
        });
      },
      __dummy: false
    };
  },
  decls: {"methods":{"main":{"nowait":false}},"fields":{"x":{},"a":{}}}
});

//# sourceMappingURL=concat.js.map