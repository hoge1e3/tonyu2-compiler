Tonyu.klass.define({
  fullName: 'user.Main',
  shortName: 'Main',
  namespace: 'user',
  superclass: Tonyu.classes.updatable.Updatable,
  includes: [],
  methods: function (__superClass) {
    return {
      main :function _trc_Main_main() {
        "use strict";
        var _this=this;
        
        _this.x=100;
        _this.y=200;
        _this.fillStyle="yellow";
        _this.radius=16;
        while (_this.x<300) {
          Tonyu.checkLoop();
          _this.x++;
          if (_this.getkey("e")==1) {
            _this.appude_to();
          }
          _this.update();
          
        }
      },
      fiber$main :function* _trc_Main_f_main(_thread) {
        "use strict";
        var _this=this;
        //var _arguments=Tonyu.A(arguments);
        
        _this.x=100;
        _this.y=200;
        _this.fillStyle="yellow";
        _this.radius=16;
        while (_this.x<300) {
          Tonyu.checkLoop();
          _this.x++;
          if (_this.getkey("e")==1) {
            _this.appude_to();
          }
          (yield* _this.fiber$update(_thread));
          
          
        }
        
      },
      __dummy: false
    };
  },
  decls: {"methods":{"main":{"nowait":false}},"fields":{"x":{},"y":{},"fillStyle":{},"radius":{},"getkey":{},"appude_to":{}}}
});

//# sourceMappingURL=concat.js.map