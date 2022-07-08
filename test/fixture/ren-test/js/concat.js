Tonyu.klass.define({
  fullName: 'user.Mode',
  shortName: 'Mode',
  namespace: 'user',
  includes: [],
  methods: function (__superClass) {
    return {
      main :function _trc_Mode_main() {
        "use strict";
        var _this=this;
        
      },
      fiber$main :function* _trc_Mode_f_main(_thread) {
        "use strict";
        var _this=this;
        //var _arguments=Tonyu.A(arguments);
        
        
      },
      __dummy: false
    };
  },
  decls: {"methods":{"main":{"nowait":false}},"fields":{}}
});
Tonyu.klass.define({
  fullName: 'user.Updatable',
  shortName: 'Updatable',
  namespace: 'user',
  includes: [],
  methods: function (__superClass) {
    return {
      main :function _trc_Updatable_main() {
        "use strict";
        var _this=this;
        
      },
      fiber$main :function* _trc_Updatable_f_main(_thread) {
        "use strict";
        var _this=this;
        //var _arguments=Tonyu.A(arguments);
        
        
      },
      waitFor :function _trc_Updatable_waitFor(f) {
        "use strict";
        var _this=this;
        var r;
        
        if (null) {
          r = null.waitFor(f);
          
          return r;
          
        }
        return f;
      },
      fiber$waitFor :function* _trc_Updatable_f_waitFor(_thread,f) {
        "use strict";
        var _this=this;
        //var _arguments=Tonyu.A(arguments);
        var r;
        
        if (_thread) {
          r = _thread.waitFor(f);
          
          return r;
          
        }
        return f;
        
      },
      update :function _trc_Updatable_update(t) {
        "use strict";
        var _this=this;
        
        _this.waitFor(new Promise((function anonymous_206(s) {
          
          setTimeout(s,t||50);
        })));
      },
      fiber$update :function* _trc_Updatable_f_update(_thread,t) {
        "use strict";
        var _this=this;
        //var _arguments=Tonyu.A(arguments);
        
        (yield* _this.fiber$waitFor(_thread, new Promise((function anonymous_206(s) {
          
          setTimeout(s,t||50);
        }))));
        
        
      },
      appear :function _trc_Updatable_appear(o) {
        "use strict";
        var _this=this;
        var t;
        
        t = Tonyu.thread();
        
        t.apply(o,"main",[]);
        t.steps();
        return o;
      },
      fiber$appear :function* _trc_Updatable_f_appear(_thread,o) {
        "use strict";
        var _this=this;
        //var _arguments=Tonyu.A(arguments);
        var t;
        
        t = Tonyu.thread();
        
        t.apply(o,"main",[]);
        t.steps();
        return o;
        
      },
      __dummy: false
    };
  },
  decls: {"methods":{"main":{"nowait":false},"waitFor":{"nowait":false},"update":{"nowait":false},"appear":{"nowait":false}},"fields":{}}
});
Tonyu.klass.define({
  fullName: 'user.Kyara',
  shortName: 'Kyara',
  namespace: 'user',
  superclass: Tonyu.classes.user.Updatable,
  includes: [],
  methods: function (__superClass) {
    return {
      main :function _trc_Kyara_main() {
        "use strict";
        var _this=this;
        
        _this.x=100;
        _this.y=200;
        _this.fillStyle="yellow";
        _this.radius=16;
        while (_this.x<120) {
          Tonyu.checkLoop();
          _this.x+=1;
          console.log(_this.x,_this.y);
          _this.update();
          
        }
      },
      fiber$main :function* _trc_Kyara_f_main(_thread) {
        "use strict";
        var _this=this;
        //var _arguments=Tonyu.A(arguments);
        
        _this.x=100;
        _this.y=200;
        _this.fillStyle="yellow";
        _this.radius=16;
        while (_this.x<120) {
          yield null;
          _this.x+=1;
          console.log(_this.x,_this.y);
          (yield* _this.fiber$update(_thread));
          
          
        }
        
      },
      __dummy: false
    };
  },
  decls: {"methods":{"main":{"nowait":false}},"fields":{"x":{},"y":{},"fillStyle":{},"radius":{}}}
});
Tonyu.klass.define({
  fullName: 'user.Main',
  shortName: 'Main',
  namespace: 'user',
  superclass: Tonyu.classes.user.Updatable,
  includes: [],
  methods: function (__superClass) {
    return {
      main :function _trc_Main_main() {
        "use strict";
        var _this=this;
        
        Tonyu.globals.$restart=(function anonymous_48() {
          
          _this.appear(new Tonyu.classes.user.Kyara);
        });
        Tonyu.globals.$restart();
      },
      fiber$main :function* _trc_Main_f_main(_thread) {
        "use strict";
        var _this=this;
        //var _arguments=Tonyu.A(arguments);
        
        Tonyu.globals.$restart=(function anonymous_48() {
          
          _this.appear(new Tonyu.classes.user.Kyara);
        });
        Tonyu.globals.$restart();
        
      },
      __dummy: false
    };
  },
  decls: {"methods":{"main":{"nowait":false}},"fields":{}}
});
Tonyu.klass.define({
  fullName: 'user.Child',
  shortName: 'Child',
  namespace: 'user',
  superclass: Tonyu.classes.user.Kyara,
  includes: [Tonyu.classes.user.Mode],
  methods: function (__superClass) {
    return {
      main :function _trc_Child_main() {
        "use strict";
        var _this=this;
        
        if (Tonyu.is(_this.x,Tonyu.classes.user.Kyara)) {
          
          
        }
      },
      fiber$main :function* _trc_Child_f_main(_thread) {
        "use strict";
        var _this=this;
        //var _arguments=Tonyu.A(arguments);
        
        if (Tonyu.is(_this.x,Tonyu.classes.user.Kyara)) {
          
          
        }
        
      },
      __dummy: false
    };
  },
  decls: {"methods":{"main":{"nowait":false}},"fields":{}}
});

//# sourceMappingURL=concat.js.map