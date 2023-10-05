if(!Tonyu.load)Tonyu.load=(_,f)=>f();
Tonyu.load({"compiler":{"dependingProjects":[{"dir":"../updatable/"}],"outputFile":"js/concat.js","namespace":"user"},"run":{}}, ()=>{
Tonyu.klass.define({
  fullName: 'user.Excludes',
  shortName: 'Excludes',
  namespace: 'user',
  includes: [],
  methods: function (__superClass) {
    return {
      main :function _trc_Excludes_main() {
        var _this=this;
        
      },
      fiber$main :function* _trc_Excludes_f_main(_thread) {
        var _this=this;
        
        
      },
      man :function _trc_Excludes_man() {
        var _this=this;
        
        _this.console.log("Excludes:man");
        return 30;
      },
      fiber$man :function* _trc_Excludes_f_man(_thread) {
        var _this=this;
        
        _this.console.log("Excludes:man");
        return 30;
        
      },
      __dummy: false
    };
  },
  decls: {"methods":{"main":{"nowait":false,"isMain":true,"vtype":{"params":[],"returnValue":null}},"man":{"nowait":false,"isMain":false,"vtype":{"params":[],"returnValue":null}}},"fields":{"console":{}}}
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
        var _this=this;
        
        _this.s=new Set;
        _this.s.add(5);
        _this.s.add(10);
        console.log("listing elem");
        for ([_this.k] of Tonyu.iterator2(_this.s,1)) {
          console.log("elem",_this.k);
          
        }
        _this.aw=_this.waitFor(new Promise((function anonymous_337(s) {
          
          s("awawawa!");
        })));
        console.log("aw=",_this.aw);
        Tonyu.globals.$restart=(function anonymous_400() {
          
          console.log(_this);
          _this.appear(new Tonyu.classes.user.Preya);
        });
        console.log(_this);
        Tonyu.globals.$restart();
      },
      fiber$main :function* _trc_Main_f_main(_thread) {
        var _this=this;
        
        _this.s=new Set;
        _this.s.add(5);
        _this.s.add(10);
        console.log("listing elem");
        for ([_this.k] of Tonyu.iterator2(_this.s,1)) {
          console.log("elem",_this.k);
          
        }
        _this.aw=(yield* _this.fiber$waitFor(_thread, new Promise((function anonymous_337(s) {
          
          s("awawawa!");
        }))));
        console.log("aw=",_this.aw);
        Tonyu.globals.$restart=(function anonymous_400() {
          
          console.log(_this);
          _this.appear(new Tonyu.classes.user.Preya);
        });
        console.log(_this);
        Tonyu.globals.$restart();
        
      },
      __dummy: false
    };
  },
  decls: {"methods":{"main":{"nowait":false,"isMain":true,"vtype":{"params":[],"returnValue":null}}},"fields":{"s":{},"k":{},"aw":{}}}
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
        var _this=this;
        
        _this.y=(yield* __superClass.prototype.fiber$man.apply( _this, [_thread]));
        _this.x=100;
        _this.y=200;
        _this.fillStyle="yellow";
        _this.radius=16;
        while (_this.x<120) {
          yield null;
          _this.x+=5;
          console.log(_this.x,_this.y,"zen　kaku");
          (yield* _this.fiber$update(_thread));
          
        }
        
      },
      a :function _trc_Chara_a() {
        var _this=this;
        
        while (true) {
          Tonyu.checkLoop();
          _this.x++;
          
        }
      },
      move :function _trc_Chara_move() {
        var _this=this;
        
        _this.x+=10;
      },
      fiber$move :function* _trc_Chara_f_move(_thread) {
        var _this=this;
        
        _this.x+=10;
        
      },
      man :function _trc_Chara_man() {
        var _this=this;
        
        console.log("Chara:man");
        return 10;
      },
      fiber$man :function* _trc_Chara_f_man(_thread) {
        var _this=this;
        
        console.log("Chara:man");
        return 10;
        
      },
      men :function _trc_Chara_men() {
        var _this=this;
        
        _this.man();
        if (! _this.test) {
          return _this;
        }
        _this.man();
      },
      fiber$men :function* _trc_Chara_f_men(_thread) {
        var _this=this;
        
        (yield* _this.fiber$man(_thread));
        if (! _this.test) {
          return _this;
        }
        (yield* _this.fiber$man(_thread));
        
      },
      __dummy: false
    };
  },
  decls: {"methods":{"main":{"nowait":false,"isMain":true,"vtype":{"params":[],"returnValue":null}},"a":{"nowait":true,"isMain":false,"vtype":{"params":[],"returnValue":null}},"move":{"nowait":false,"isMain":false,"vtype":{"params":[],"returnValue":null}},"man":{"nowait":false,"isMain":false,"vtype":{"params":[],"returnValue":null}},"men":{"nowait":false,"isMain":false,"vtype":{"params":[],"returnValue":null}}},"fields":{"y":{},"x":{},"fillStyle":{},"radius":{},"test":{}}}
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
        var _this=this;
        
        Tonyu.globals.$Boot.autoReload=(function anonymous_129(e) {
          
          _this.print("Reload!",e.mainClass===Tonyu.classes.user.Field);
          _this.loadPage(Tonyu.classes.user.Field);
        });
        new _this.BodyActor({isStatic: true,x: 128,y: 50,width: 10,height: 200,fillStyle: "#8f8"});
        new _this.BodyActor({isStatic: true,x: 307,y: 50,width: 10,height: 200,fillStyle: "#8f8"});
      },
      fiber$main :function* _trc_Field_f_main(_thread) {
        var _this=this;
        
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
  decls: {"methods":{"main":{"nowait":false,"isMain":true,"vtype":{"params":[],"returnValue":null}}},"fields":{"print":{},"loadPage":{},"BodyActor":{}}}
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
        var _this=this;
        
        _this.man();
        _this.x=0;
        while (_this.x<120) {
          Tonyu.checkLoop();
          _this.move();
          console.log(_this.x);
          _this.update();
          
        }
        for (_this.x=0; _this.x<3 ; _this.x++) {
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
        var _this=this;
        
        (yield* _this.fiber$man(_thread));
        _this.x=0;
        while (_this.x<120) {
          yield null;
          (yield* _this.fiber$move(_thread));
          console.log(_this.x);
          (yield* _this.fiber$update(_thread));
          
        }
        for (_this.x=0; _this.x<3 ; _this.x++) {
          yield null;
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
        var _this=this;
        
        _this.y=__superClass.prototype.man.apply( _this, []);
        console.log("Preya::Man",_this.y);
      },
      fiber$man :function* _trc_Preya_f_man(_thread) {
        var _this=this;
        
        _this.y=(yield* __superClass.prototype.fiber$man.apply( _this, [_thread]));
        console.log("Preya::Man",_this.y);
        
      },
      __dummy: false
    };
  },
  decls: {"methods":{"main":{"nowait":false,"isMain":true,"vtype":{"params":[],"returnValue":null}},"man":{"nowait":false,"isMain":false,"vtype":{"params":[],"returnValue":null}}},"fields":{}}
});

});

//# sourceMappingURL=concat.js.map