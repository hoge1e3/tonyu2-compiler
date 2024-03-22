if(!Tonyu.load)Tonyu.load=(_,f)=>f();
Tonyu.load({"compiler":{"dependingProjects":[{"dir":"../updatable/"}],"outputFile":"js/concat.js","namespace":"user"},"run":{}}, ()=>{
Tonyu.klass.define({
  fullName: 'user.Main',
  shortName: 'Main',
  namespace: 'user',
  includes: [],
  methods: function (__superClass) {
    return {
      main :function _trc_Main_main() {
        var _this=this;
        var e;
        
        try {
          console.log("await...");
          _this.r=new Promise((function anonymous_133(s,e) {
            
            setTimeout((function anonymous_162() {
              
              e(100);
            }),500);
          }));
          console.log(_this.r);
          
        } catch (e) {
          console.error("ERA-",e.stack);
          
        }
      },
      fiber$main :function* _trc_Main_f_main(_thread) {
        var _this=this;
        var e;
        
        try {
          console.log("await...");
          _this.r=(yield* _thread.await(new Promise((function anonymous_133(s,e) {
            
            setTimeout((function anonymous_162() {
              
              e(100);
            }),500);
          }))));
          console.log(_this.r);
          
        } catch (e) {
          console.error("ERA-",e.stack);
          
        }
        
      },
      __dummy: false
    };
  },
  decls: {"methods":{"main":{"nowait":false,"isMain":true,"vtype":{"params":[],"returnValue":null}}},"fields":{"r":{}}}
});

});

//# sourceMappingURL=concat.js.map