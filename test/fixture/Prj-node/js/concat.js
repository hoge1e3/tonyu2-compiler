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
      move :function _trc_Chara_move() {
        "use strict";
        var _this=this;
        
        _this.x+=10;
      },
      fiber$move :function _trc_Chara_f_move(_thread) {
        "use strict";
        var _this=this;
        //var _arguments=Tonyu.A(arguments);
        var __pc=0;
        
        _this.x+=10;
        
        _thread.retVal=_this;return;
      },
      man :function _trc_Chara_man() {
        "use strict";
        var _this=this;
        
        console.log("Chara:man");
        return 10;
      },
      fiber$man :function _trc_Chara_f_man(_thread) {
        "use strict";
        var _this=this;
        //var _arguments=Tonyu.A(arguments);
        var __pc=0;
        
        console.log("Chara:man");
        _thread.retVal=10;return;
        
        
        _thread.retVal=_this;return;
      },
      __dummy: false
    };
  },
  decls: {"methods":{"main":{"nowait":false},"a":{"nowait":true},"move":{"nowait":false},"man":{"nowait":false}},"fields":{"x":{},"y":{},"fillStyle":{},"radius":{}}}
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
        var _it_1;
        
        _this.s=new Set;
        _this.s.add(5);
        _this.s.add(10);
        console.log("listing elem");
        _it_1=Tonyu.iterator(_this.s,1);
        while(_it_1.next()) {
          _this.k=_it_1[0];
          
          console.log("elem",_this.k);
          
        }
        Tonyu.globals.$restart=(function anonymous_305() {
          
          _this.appear(new Tonyu.classes.user.Preya);
        });
        Tonyu.globals.$restart();
      },
      fiber$main :function _trc_Main_f_main(_thread) {
        "use strict";
        var _this=this;
        //var _arguments=Tonyu.A(arguments);
        var __pc=0;
        var _it_1;
        
        _this.s=new Set;
        _this.s.add(5);
        _this.s.add(10);
        console.log("listing elem");
        _it_1=Tonyu.iterator(_this.s,1);
        while(_it_1.next()) {
          _this.k=_it_1[0];
          
          console.log("elem",_this.k);
          
        }
        
        _thread.enter(function _trc_Main_ent_main(_thread) {
          if (_thread.lastEx) __pc=_thread.catchPC;
          for(var __cnt=100 ; __cnt--;) {
            switch (__pc) {
            case 0:
              Tonyu.globals.$restart=(function anonymous_305() {
                
                _this.appear(new Tonyu.classes.user.Preya);
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
  decls: {"methods":{"main":{"nowait":false}},"fields":{"s":{},"k":{}}}
});
Tonyu.klass.define({
  fullName: 'user.Preya',
  shortName: 'Preya',
  namespace: 'user',
  superclass: Tonyu.classes.user.Chara,
  includes: [],
  methods: function (__superClass) {
    return {
      main :function _trc_Preya_main() {
        "use strict";
        var _this=this;
        
        _this.man();
        _this.x=0;
        while (_this.x<120) {
          Tonyu.checkLoop();
          _this.move();
          console.log(_this.x);
          _this.update();
          
        }
        _this.x=0;for (; _this.x<3 ; _this.x++) {
          Tonyu.checkLoop();
          {
            console.log(_this.x);
            _this.update();
          }
        }
      },
      fiber$main :function _trc_Preya_f_main(_thread) {
        "use strict";
        var _this=this;
        //var _arguments=Tonyu.A(arguments);
        var __pc=0;
        
        
        _thread.enter(function _trc_Preya_ent_main(_thread) {
          if (_thread.lastEx) __pc=_thread.catchPC;
          for(var __cnt=100 ; __cnt--;) {
            switch (__pc) {
            case 0:
              _this.fiber$man(_thread);
              __pc=1;return;
            case 1:
              
              _this.x=0;
            case 2:
              if (!(_this.x<120)) { __pc=5     ; break; }
              _this.fiber$move(_thread);
              __pc=3;return;
            case 3:
              
              console.log(_this.x);
              _this.fiber$update(_thread);
              __pc=4;return;
            case 4:
              
              __pc=2;break;
            case 5     :
              
              _this.x=0;
            case 6:
              if (!(_this.x<3)) { __pc=9     ; break; }
              console.log(_this.x);
              _this.fiber$update(_thread);
              __pc=7;return;
            case 7:
              
            case 8     :
              _this.x++;
              __pc=6;break;
            case 9     :
              
              _thread.exit(_this);return;
            }
          }
        });
      },
      man :function _trc_Preya_man() {
        "use strict";
        var _this=this;
        
        _this.y=__superClass.prototype.man.apply( _this, []);
        console.log("Preya::Man",_this.y);
      },
      fiber$man :function _trc_Preya_f_man(_thread) {
        "use strict";
        var _this=this;
        //var _arguments=Tonyu.A(arguments);
        var __pc=0;
        
        
        _thread.enter(function _trc_Preya_ent_man(_thread) {
          if (_thread.lastEx) __pc=_thread.catchPC;
          for(var __cnt=100 ; __cnt--;) {
            switch (__pc) {
            case 0:
              __superClass.prototype.fiber$man.apply( _this, [_thread]);
              __pc=1;return;
            case 1:
              _this.y=_thread.retVal;
              
              console.log("Preya::Man",_this.y);
              _thread.exit(_this);return;
            }
          }
        });
      },
      __dummy: false
    };
  },
  decls: {"methods":{"main":{"nowait":false},"man":{"nowait":false}},"fields":{}}
});

//# sourceMappingURL=concat.js.map