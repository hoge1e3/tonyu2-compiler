Tonyu.klass.define({
  fullName: 'user.Chara',
  shortName: 'Chara',
  namespace: 'user',
  superclass: Tonyu.classes.updatable.Updatable,
  includes: [],
  methods: function (__superClass) {
    return {
      main :function _trc_Chara_main() {
        "use strict";
        var _this=this;
        
        _this.x=100;
        _this.y=200;
        _this.fillStyle="yellow";
        _this.radius=16;
        while (_this.x<120) {
          Tonyu.checkLoop();
          _this.x+=5;
          console.log(_this.x,_this.y,"zen　kaku");
          _this.update();
          
        }
      },
      fiber$main :function _trc_Chara_f_main(_thread) {
        "use strict";
        var _this=this;
        //var _arguments=Tonyu.A(arguments);
        var __pc=0;
        
        _this.x=100;
        _this.y=200;
        _this.fillStyle="yellow";
        _this.radius=16;
        
        _thread.enter(function _trc_Chara_ent_main(_thread) {
          if (_thread.lastEx) __pc=_thread.catchPC;
          for(var __cnt=100 ; __cnt--;) {
            switch (__pc) {
            case 0:
            case 1:
              if (!(_this.x<120)) { __pc=3     ; break; }
              _this.x+=5;
              console.log(_this.x,_this.y,"zen　kaku");
              _this.fiber$update(_thread);
              __pc=2;return;
            case 2:
              
              __pc=1;break;
            case 3     :
              
              _thread.exit(_this);return;
            }
          }
        });
      },
      a :function _trc_Chara_a() {
        "use strict";
        var _this=this;
        
        while (true) {
          Tonyu.checkLoop();
          _this.x++;
          
        }
      },
      __dummy: false
    };
  },
  decls: {"methods":{"main":{"nowait":false},"a":{"nowait":true}},"fields":{"x":{},"y":{},"fillStyle":{},"radius":{}}}
});
Tonyu.klass.define({
  fullName: 'user.Field',
  shortName: 'Field',
  namespace: 'user',
  superclass: Tonyu.classes.user.Chara,
  includes: [],
  methods: function (__superClass) {
    return {
      main :function _trc_Field_main() {
        "use strict";
        var _this=this;
        
        Tonyu.globals.$Boot.autoReload=(function anonymous_129(e) {
          
          _this.print("Reload!",e.mainClass===Tonyu.classes.user.Field);
          _this.loadPage(Tonyu.classes.user.Field);
        });
        new _this.BodyActor({isStatic: true,x: 128,y: 50,width: 10,height: 200,fillStyle: "#8f8"});
        new _this.BodyActor({isStatic: true,x: 307,y: 50,width: 10,height: 200,fillStyle: "#8f8"});
      },
      fiber$main :function _trc_Field_f_main(_thread) {
        "use strict";
        var _this=this;
        //var _arguments=Tonyu.A(arguments);
        var __pc=0;
        
        Tonyu.globals.$Boot.autoReload=(function anonymous_129(e) {
          
          _this.print("Reload!",e.mainClass===Tonyu.classes.user.Field);
          _this.loadPage(Tonyu.classes.user.Field);
        });
        new _this.BodyActor({isStatic: true,x: 128,y: 50,width: 10,height: 200,fillStyle: "#8f8"});
        new _this.BodyActor({isStatic: true,x: 307,y: 50,width: 10,height: 200,fillStyle: "#8f8"});
        
        _thread.retVal=_this;return;
      },
      __dummy: false
    };
  },
  decls: {"methods":{"main":{"nowait":false}},"fields":{"print":{},"loadPage":{},"BodyActor":{}}}
});
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
        
        Tonyu.globals.$restart=(function anonymous_172() {
          
          _this.appear(new Tonyu.classes.user.Chara);
        });
        Tonyu.globals.$restart();
      },
      fiber$main :function _trc_Main_f_main(_thread) {
        "use strict";
        var _this=this;
        //var _arguments=Tonyu.A(arguments);
        var __pc=0;
        
        
        _thread.enter(function _trc_Main_ent_main(_thread) {
          if (_thread.lastEx) __pc=_thread.catchPC;
          for(var __cnt=100 ; __cnt--;) {
            switch (__pc) {
            case 0:
              Tonyu.globals.$restart=(function anonymous_172() {
                
                _this.appear(new Tonyu.classes.user.Chara);
              });
              Tonyu.globals.$restart();
              _thread.exit(_this);return;
            }
          }
        });
      },
      __dummy: false
    };
  },
  decls: {"methods":{"main":{"nowait":false}},"fields":{}}
});

//# sourceMappingURL=concat.js.map