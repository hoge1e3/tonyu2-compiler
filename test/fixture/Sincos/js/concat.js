Tonyu.klass.define({
  fullName: 'user.Main',
  shortName: 'Main',
  namespace: 'user',
  superclass: Tonyu.classes.kernel.Actor,
  includes: [],
  methods: function (__superClass) {
    return {
      main :function _trc_Main_main() {
        "use strict";
        var _this=this;
        
        _this.t=10;
        Tonyu.globals.$panel.fillStyle="white";
        _this.a = new Tonyu.classes.kernel.Actor;
        
        _this.a.teseet();
        _this.print(Tonyu.classMetas['kernel.Actor']);
        _this.print('Any');
        while (true) {
          Tonyu.checkLoop();
          _this.p=- 1;
          _this.x=200+_this.cos(_this.t)*100;
          _this.y=200+_this.sin(_this.t)*100;
          Tonyu.globals.$panel.fillRect(_this.a.x,_this.a.y,1,1);
          _this.t++;
          _this.a.x=_this.x+_this.sin(_this.t*2.1)*50;
          _this.a.y=_this.y+_this.cos(_this.t*2.1)*50;
          _this.update();
          
        }
      },
      fiber$main :function* _trc_Main_f_main(_thread) {
        "use strict";
        var _this=this;
        //var _arguments=Tonyu.A(arguments);
        
        _this.t=10;
        Tonyu.globals.$panel.fillStyle="white";
        _this.a = new Tonyu.classes.kernel.Actor;
        
        _this.a.teseet();
        _this.print(Tonyu.classMetas['kernel.Actor']);
        _this.print('Any');
        while (true) {
          yield null;
          _this.p=- 1;
          _this.x=200+_this.cos(_this.t)*100;
          _this.y=200+_this.sin(_this.t)*100;
          Tonyu.globals.$panel.fillRect(_this.a.x,_this.a.y,1,1);
          _this.t++;
          _this.a.x=_this.x+_this.sin(_this.t*2.1)*50;
          _this.a.y=_this.y+_this.cos(_this.t*2.1)*50;
          (yield* _this.fiber$update(_thread));
          
        }
        
      },
      __dummy: false
    };
  },
  decls: {"methods":{"main":{"nowait":false,"isMain":true,"vtype":{"params":[],"returnValue":null}}},"fields":{"a":{"vtype":"kernel.Actor"},"t":{}}}
});

//# sourceMappingURL=concat.js.map