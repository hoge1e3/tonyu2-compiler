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
        _this.p = new Tonyu.classes.user.Parent;
        
        console.log(Number);
        console.log(Tonyu.classMetas['user.Main'].decls.methods.__getter__y);
        _this.p.test=5;
        console.log(_this.p.x);
        console.log("Child");
        _this.c=new Tonyu.classes.user.Child;
        _this.c.x=10;
        console.log(_this.c.x,_this.c.test);
      },
      fiber$main :function* _trc_Main_f_main(_thread) {
        "use strict";
        var _this=this;
        //var _arguments=Tonyu.A(arguments);
        
        console.log("Parent");
        _this.p = new Tonyu.classes.user.Parent;
        
        console.log(Number);
        console.log(Tonyu.classMetas['user.Main'].decls.methods.__getter__y);
        _this.p.test=5;
        console.log(_this.p.x);
        console.log("Child");
        _this.c=new Tonyu.classes.user.Child;
        _this.c.x=10;
        console.log(_this.c.x,_this.c.test);
        
      },
      foo :function _trc_Main_foo(s) {
        "use strict";
        var _this=this;
        
        return s+"";
      },
      fiber$foo :function* _trc_Main_f_foo(_thread,s) {
        "use strict";
        var _this=this;
        //var _arguments=Tonyu.A(arguments);
        
        return s+"";
        
      },
      __getter__y :function _trc_Main___getter__y() {
        "use strict";
        var _this=this;
        
        return 3;
      },
      __dummy: false
    };
  },
  decls: {"methods":{"main":{"nowait":false,"isMain":true,"vtype":{"params":[],"returnValue":null}},"foo":{"nowait":false,"isMain":false,"vtype":{"params":["Number"],"returnValue":"String"}},"__getter__y":{"nowait":true,"isMain":false,"vtype":{"params":[],"returnValue":"Number"}}},"fields":{"p":{"vtype":"user.Parent"},"c":{}}}
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
      fiber$main :function* _trc_Parent_f_main(_thread) {
        "use strict";
        var _this=this;
        //var _arguments=Tonyu.A(arguments);
        
        _this.test=5;
        
      },
      __getter__x :function _trc_Parent___getter__x() {
        "use strict";
        var _this=this;
        
        console.log("get x",_this.test*2);
        return _this.test*2;
      },
      __setter__x :function _trc_Parent___setter__x(val) {
        "use strict";
        var _this=this;
        
        console.log("Set x",val);
      },
      __dummy: false
    };
  },
  decls: {"methods":{"main":{"nowait":false,"isMain":true,"vtype":{"params":[],"returnValue":null}},"__getter__x":{"nowait":true,"isMain":false,"vtype":{"params":[],"returnValue":"Number"}},"__setter__x":{"nowait":true,"isMain":false,"vtype":{"params":["Number"],"returnValue":null}}},"fields":{"test":{}}}
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
      fiber$main :function* _trc_Child_f_main(_thread) {
        "use strict";
        var _this=this;
        //var _arguments=Tonyu.A(arguments);
        
        
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
  decls: {"methods":{"main":{"nowait":false,"isMain":true,"vtype":{"params":[],"returnValue":null}},"__setter__x":{"nowait":true,"isMain":false,"vtype":{"params":["Number"],"returnValue":null}}},"fields":{}}
});

//# sourceMappingURL=concat.js.map