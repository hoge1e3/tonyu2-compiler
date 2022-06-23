Tonyu.klass.define({
  fullName: 'updatable.Chara',
  shortName: 'Chara',
  namespace: 'updatable',
  includes: [],
  methods: function (__superClass) {
    return {
      main :function _trc_Chara_main() {
        "use strict";
        var _this=this;
        
        
        
      },
      fiber$main :function* _trc_Chara_f_main(_thread) {
        "use strict";
        var _this=this;
        //var _arguments=Tonyu.A(arguments);
        
        
        
        
      },
      __dummy: false
    };
  },
  decls: {"methods":{"main":{"nowait":false}},"fields":{"x":{},"y":{}}}
});
Tonyu.klass.define({
  fullName: 'updatable.Updatable',
  shortName: 'Updatable',
  namespace: 'updatable',
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
        
        if (null) {
          return f;
          
        }
        return f;
      },
      fiber$waitFor :function* _trc_Updatable_f_waitFor(_thread,f) {
        "use strict";
        var _this=this;
        //var _arguments=Tonyu.A(arguments);
        
        if (_thread) {
          return (yield* _thread.await(f));
          
        }
        return f;
        
      },
      update :function _trc_Updatable_update(t) {
        "use strict";
        var _this=this;
        
        _this.waitFor(new Promise((function anonymous_179(s) {
          
          setTimeout(s,t||50);
        })));
      },
      fiber$update :function* _trc_Updatable_f_update(_thread,t) {
        "use strict";
        var _this=this;
        //var _arguments=Tonyu.A(arguments);
        
        (yield* _this.fiber$waitFor(_thread, new Promise((function anonymous_179(s) {
          
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

//# sourceMappingURL=concat.js.map