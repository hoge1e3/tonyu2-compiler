Tonyu.klass.define({
  fullName: 'user.Excludes',
  shortName: 'Excludes',
  namespace: 'user',
  includes: [],
  methods: function (__superClass) {
    return {
      main :function _trc_Excludes_main() {
        "use strict";
        var _this=this;
        
      },
      fiber$main :function* _trc_Excludes_f_main(_thread) {
        "use strict";
        var _this=this;
        //var _arguments=Tonyu.A(arguments);
        
        
      },
      man :function _trc_Excludes_man() {
        "use strict";
        var _this=this;
        
        _this.console.log("Excludes:man");
        return 30;
      },
      fiber$man :function* _trc_Excludes_f_man(_thread) {
        "use strict";
        var _this=this;
        //var _arguments=Tonyu.A(arguments);
        
        _this.console.log("Excludes:man");
        return 30;
        
      },
      __dummy: false
    };
  },
  decls: {"methods":{"main":{"nowait":false},"man":{"nowait":false}},"fields":{"console":{}}}
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
        var _it_0;
        
        _this.s=new Set;
        _this.s.add(5);
        _this.s.add(10);
        console.log("listing elem");
        _it_0=Tonyu.iterator(_this.s,1);
        while(_it_0.next()) {
          _this.k=_it_0[0];
          
          console.log("elem",_this.k);
          
        }
        console.log("awawa");
        Tonyu.globals.$restart=(function anonymous_338() {
          
          console.log(_this);
          _this.appear(new Tonyu.classes.user.Preya);
        });
        console.log(_this);
        Tonyu.globals.$restart();
      },
      fiber$main :function* _trc_Main_f_main(_thread) {
        "use strict";
        var _this=this;
        //var _arguments=Tonyu.A(arguments);
        var _it_0;
        
        _this.s=new Set;
        _this.s.add(5);
        _this.s.add(10);
        console.log("listing elem");
        _it_0=Tonyu.iterator(_this.s,1);
        while(_it_0.next()) {
          _this.k=_it_0[0];
          
          console.log("elem",_this.k);
          
        }
        console.log((yield* _thread.await("awawa")));
        Tonyu.globals.$restart=(function anonymous_338() {
          
          console.log(_this);
          _this.appear(new Tonyu.classes.user.Preya);
        });
        console.log(_this);
        Tonyu.globals.$restart();
        
      },
      __dummy: false
    };
  },
  decls: {"methods":{"main":{"nowait":false}},"fields":{"s":{},"k":{}}}
});
Tonyu.klass.define({
  fullName: 'user.Chara',
  shortName: 'Chara',
  namespace: 'user',
  superclass: Tonyu.classes.updatable.Updatable,
  includes: [Tonyu.classes.user.Excludes],
  methods: function (__superClass) {
    return {
      main :function _trc_Chara_main() {
        "use strict";
        var _this=this;
        
        _this.y=__superClass.prototype.man.apply( _this, []);
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
      fiber$main :function* _trc_Chara_f_main(_thread) {
        "use strict";
        var _this=this;
        //var _arguments=Tonyu.A(arguments);
        
        _this.y=(yield* __superClass.prototype.fiber$man.apply( _this, [_thread]));
        
        _this.x=100;
        _this.y=200;
        _this.fillStyle="yellow";
        _this.radius=16;
        while (_this.x<120) {
          Tonyu.checkLoop();
          _this.x+=5;
          console.log(_this.x,_this.y,"zen　kaku");
          (yield* _this.fiber$update(_thread));
          
          
        }
        
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
      fiber$move :function* _trc_Chara_f_move(_thread) {
        "use strict";
        var _this=this;
        //var _arguments=Tonyu.A(arguments);
        
        _this.x+=10;
        
      },
      man :function _trc_Chara_man() {
        "use strict";
        var _this=this;
        
        console.log("Chara:man");
        return 10;
      },
      fiber$man :function* _trc_Chara_f_man(_thread) {
        "use strict";
        var _this=this;
        //var _arguments=Tonyu.A(arguments);
        
        console.log("Chara:man");
        return 10;
        
      },
      men :function _trc_Chara_men() {
        "use strict";
        var _this=this;
        
        _this.man();
        if (! _this.test) {
          return _this;
        }
        _this.man();
      },
      fiber$men :function* _trc_Chara_f_men(_thread) {
        "use strict";
        var _this=this;
        //var _arguments=Tonyu.A(arguments);
        
        (yield* _this.fiber$man(_thread));
        
        if (! _this.test) {
          return _this;
        }
        (yield* _this.fiber$man(_thread));
        
        
      },
      __dummy: false
    };
  },
  decls: {"methods":{"main":{"nowait":false},"a":{"nowait":true},"move":{"nowait":false},"man":{"nowait":false},"men":{"nowait":false}},"fields":{"y":{},"x":{},"fillStyle":{},"radius":{},"test":{}}}
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
      fiber$main :function* _trc_Field_f_main(_thread) {
        "use strict";
        var _this=this;
        //var _arguments=Tonyu.A(arguments);
        
        Tonyu.globals.$Boot.autoReload=(function anonymous_129(e) {
          
          _this.print("Reload!",e.mainClass===Tonyu.classes.user.Field);
          _this.loadPage(Tonyu.classes.user.Field);
        });
        new _this.BodyActor({isStatic: true,x: 128,y: 50,width: 10,height: 200,fillStyle: "#8f8"});
        new _this.BodyActor({isStatic: true,x: 307,y: 50,width: 10,height: 200,fillStyle: "#8f8"});
        
      },
      __dummy: false
    };
  },
  decls: {"methods":{"main":{"nowait":false}},"fields":{"print":{},"loadPage":{},"BodyActor":{}}}
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
            console.log("x=",_this.x);
            _this.update();
          }
        }
        _this.x=1+2*3+4>0?50-6-7:8%9+10;
        console.log(_this.x);
        _this.men();
        console.log("Men end");
      },
      fiber$main :function* _trc_Preya_f_main(_thread) {
        "use strict";
        var _this=this;
        //var _arguments=Tonyu.A(arguments);
        
        (yield* _this.fiber$man(_thread));
        
        _this.x=0;
        while (_this.x<120) {
          Tonyu.checkLoop();
          (yield* _this.fiber$move(_thread));
          
          console.log(_this.x);
          (yield* _this.fiber$update(_thread));
          
          
        }
        _this.x=0;for (; _this.x<3 ; _this.x++) {
          Tonyu.checkLoop();
          {
            console.log("x=",_this.x);
            (yield* _this.fiber$update(_thread));
            
          }
        }
        _this.x=1+2*3+4>0?50-6-7:8%9+10;
        console.log(_this.x);
        (yield* _this.fiber$men(_thread));
        
        console.log("Men end");
        
      },
      man :function _trc_Preya_man() {
        "use strict";
        var _this=this;
        
        _this.y=__superClass.prototype.man.apply( _this, []);
        console.log("Preya::Man",_this.y);
      },
      fiber$man :function* _trc_Preya_f_man(_thread) {
        "use strict";
        var _this=this;
        //var _arguments=Tonyu.A(arguments);
        
        _this.y=(yield* __superClass.prototype.fiber$man.apply( _this, [_thread]));
        
        console.log("Preya::Man",_this.y);
        
      },
      __dummy: false
    };
  },
  decls: {"methods":{"main":{"nowait":false},"man":{"nowait":false}},"fields":{}}
});

//# sourceMappingURL=concat.js.map