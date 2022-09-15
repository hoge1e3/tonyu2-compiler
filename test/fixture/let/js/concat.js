Tonyu.klass.define({
  fullName: 'user.Main',
  shortName: 'Main',
  namespace: 'user',
  includes: [],
  methods: function (__superClass) {
    return {
      main :function _trc_Main_main() {
        var _this=this;
        
        "field strict";
        _this.a = [1,5,3];
        
        for (let [e] of Tonyu.iterator2(_this.a,1)) {
          let nofld = e+1;
          
          console.log(nofld);
          
        }
        console.log("START");
        for (let i = _this.test();
         i<10 ; i++) {
          Tonyu.checkLoop();
          {
            console.log(i);
          }
        }
        switch (_this.a[0]) {
        case 1:
          let j = _this.a[0]*2;
          
          console.log("j=",j);
          break;
          
        }
        _this.test2();
      },
      fiber$main :function* _trc_Main_f_main(_thread) {
        var _this=this;
        //var _arguments=Tonyu.A(arguments);
        
        "field strict";
        _this.a = [1,5,3];
        
        for (let [e] of Tonyu.iterator2(_this.a,1)) {
          let nofld = e+1;
          
          console.log(nofld);
          
        }
        console.log("START");
        for (let i=yield* _this.fiber$test(_thread);
         i<10 ; i++) {
          yield null;
          {
            console.log(i);
          }
        }
        switch (_this.a[0]) {
        case 1:
          let j = _this.a[0]*2;
          
          console.log("j=",j);
          break;
          
        }
        (yield* _this.fiber$test2(_thread));
        
      },
      test :function _trc_Main_test() {
        var _this=this;
        
        new Promise((function anonymous_108(s,e) {
          
          setTimeout((function anonymous_137() {
            
            s(100);
          }),500);
        }));
        return 5;
      },
      fiber$test :function* _trc_Main_f_test(_thread) {
        var _this=this;
        //var _arguments=Tonyu.A(arguments);
        
        (yield* _thread.await(new Promise((function anonymous_108(s,e) {
          
          setTimeout((function anonymous_137() {
            
            s(100);
          }),500);
        }))));
        return 5;
        
      },
      test2 :function _trc_Main_test2() {
        var _this=this;
        
        for (let i = _this.test();
         i<10 ; i++) {
          Tonyu.checkLoop();
          {
            console.log(i);
          }
        }
        let v = 50;
        
        for (let [k, v] of Tonyu.iterator2(_this,2)) {
          if (typeof  v==="function") {
            continue;
            
          }
          console.log(k,v);
          
        }
        console.log("after v=",v);
      },
      fiber$test2 :function* _trc_Main_f_test2(_thread) {
        var _this=this;
        //var _arguments=Tonyu.A(arguments);
        
        for (let i=yield* _this.fiber$test(_thread);
         i<10 ; i++) {
          yield null;
          {
            console.log(i);
          }
        }
        let v = 50;
        
        for (let [k, v] of Tonyu.iterator2(_this,2)) {
          if (typeof  v==="function") {
            continue;
            
          }
          console.log(k,v);
          
        }
        console.log("after v=",v);
        
      },
      test3 :function _trc_Main_test3() {
        var _this=this;
        var i;
        var x;
        
        for ([i] of Tonyu.iterator2([1,2,3],1)) {
          x = i;
          
          
        }
        console.log(x);
      },
      fiber$test3 :function* _trc_Main_f_test3(_thread) {
        var _this=this;
        //var _arguments=Tonyu.A(arguments);
        var i;
        var x;
        
        for ([i] of Tonyu.iterator2([1,2,3],1)) {
          x = i;
          
          
        }
        console.log(x);
        
      },
      __dummy: false
    };
  },
  decls: {"methods":{"main":{"nowait":false,"isMain":true,"vtype":{"params":[],"returnValue":null}},"test":{"nowait":false,"isMain":false,"vtype":{"params":[],"returnValue":null}},"test2":{"nowait":false,"isMain":false,"vtype":{"params":[],"returnValue":null}},"test3":{"nowait":false,"isMain":false,"vtype":{"params":[],"returnValue":null}}},"fields":{"a":{},"j":{}}}
});

//# sourceMappingURL=concat.js.map