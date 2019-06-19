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
        
        _this.play("cde","eg<c");
        new _this.BodyActor({isStatic: true,x: 100,y: 200,width: 500,height: 10,fillStyle: "white",rotation: 10});
        new _this.BodyActor({isStatic: false,x: 100,y: 100,radius: 10,fillStyle: "white",rotation: 10});
      },
      fiber$main :function _trc_Main_f_main(_thread) {
        "use strict";
        var _this=this;
        //var _arguments=Tonyu.A(arguments);
        var __pc=0;
        
        _this.play("cde","eg<c");
        new _this.BodyActor({isStatic: true,x: 100,y: 200,width: 500,height: 10,fillStyle: "white",rotation: 10});
        new _this.BodyActor({isStatic: false,x: 100,y: 100,radius: 10,fillStyle: "white",rotation: 10});
        
        _thread.retVal=_this;return;
      },
      __dummy: false
    };
  },
  decls: {"methods":{"main":{"nowait":false}},"fields":{"play":{},"BodyActor":{}}}
});

//# sourceMappingURL=concat.js.map