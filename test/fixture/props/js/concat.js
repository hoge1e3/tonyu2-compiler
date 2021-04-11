Tonyu.klass.define({
  fullName: 'user.Main',
  shortName: 'Main',
  namespace: 'user',
  includes: [],
  methods: function (__superClass) {
    return {
      main :function _trc_Main_main() {
        "use strict";
        var _this=this;
        
        console.log("Parent");
        _this.p=new Tonyu.classes.user.Parent;
        _this.p.test=5;
        console.log(_this.p.x);
        console.log("Child");
        _this.c=new Tonyu.classes.user.Child;
        _this.c.x=10;
        console.log(_this.c.x,_this.c.test);
      },
      fiber$main :function _trc_Main_f_main(_thread) {
        "use strict";
        var _this=this;
        //var _arguments=Tonyu.A(arguments);
        var __pc=0;
        
        console.log("Parent");
        _this.p=new Tonyu.classes.user.Parent;
        _this.p.test=5;
        console.log(_this.p.x);
        console.log("Child");
        _this.c=new Tonyu.classes.user.Child;
        _this.c.x=10;
        console.log(_this.c.x,_this.c.test);
        
        _thread.retVal=_this;return;
      },
      __dummy: false
    };
  },
  decls: {"methods":{"main":{"nowait":false}},"fields":{"p":{},"c":{}}}
});
Tonyu.klass.define({
  fullName: 'user.Parent',
  shortName: 'Parent',
  namespace: 'user',
  includes: [],
  methods: function (__superClass) {
    return {
      main :function _trc_Parent_main() {
        "use strict";
        var _this=this;
        
        _this.test=5;
      },
      fiber$main :function _trc_Parent_f_main(_thread) {
        "use strict";
        var _this=this;
        //var _arguments=Tonyu.A(arguments);
        var __pc=0;
        
        _this.test=5;
        
        _thread.retVal=_this;return;
      },
      __getter__x :function _trc_Parent___getter__x() {
        "use strict";
        var _this=this;
        
        console.log("get x",_this.test*2);
        return _this.test*2;
      },
      __dummy: false
    };
  },
  decls: {"methods":{"main":{"nowait":false},"__getter__x":{"nowait":true}},"fields":{"test":{}}}
});
Tonyu.klass.define({
  fullName: 'user.Child',
  shortName: 'Child',
  namespace: 'user',
  superclass: Tonyu.classes.user.Parent,
  includes: [],
  methods: function (__superClass) {
    return {
      main :function _trc_Child_main() {
        "use strict";
        var _this=this;
        
      },
      fiber$main :function _trc_Child_f_main(_thread) {
        "use strict";
        var _this=this;
        //var _arguments=Tonyu.A(arguments);
        var __pc=0;
        
        
        _thread.retVal=_this;return;
      },
      __setter__x :function _trc_Child___setter__x(v) {
        "use strict";
        var _this=this;
        
        console.log("set x",v);
        _this.test=v/2;
      },
      __dummy: false
    };
  },
  decls: {"methods":{"main":{"nowait":false},"__setter__x":{"nowait":true}},"fields":{}}
});

//# sourceMappingURL=concat.js.map