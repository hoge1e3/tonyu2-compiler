if(!Tonyu.load)Tonyu.load=(_,f)=>f();
Tonyu.load({"compiler":{"namespace":"user","defaultSuperClass":"kernel.Actor","dependingProjects":[{"namespace":"kernel"},{"dir":"../bot/"}],"noLoopCheck":true,"field_strict":true,"typeCheck":false},"run":{"mainClass":"user.Main","bootClass":"kernel.Boot","globals":{"$defaultFPS":60,"$imageSmoothingDisabled":true,"$soundLoadAndDecode":false}},"plugins":{},"kernelEditable":false,"language":"tonyu","version":1663210092703}, ()=>{
Tonyu.klass.define({
  fullName: 'user.Board',
  shortName: 'Board',
  namespace: 'user',
  superclass: Tonyu.classes.bot.State,
  includes: [],
  methods: function (__superClass) {
    return {
      main :function _trc_Board_main() {
        var _this=this;
        
        
        
        
        
      },
      fiber$main :function* _trc_Board_f_main(_thread) {
        var _this=this;
        
        
        
        
        
        
      },
      next :function _trc_Board_next(ctx,a) {
        var _this=this;
        
        let nm = _this.cloneMat();
        
        let foe = 3-_this.player;
        
        if (a.pass) {
          return new Tonyu.classes.user.Board({mat: nm,player: foe,foePassed: true});
          
        }
        nm.set(a.x,a.y,_this.player);
        let changed = false;
        
        let vs = [[0,- 1],[1,- 1],[1,0],[1,1],[0,1],[- 1,1],[- 1,0],[- 1,- 1]];
        
        for (let [v] of Tonyu.iterator2(vs,1)) {
          let dx = v[0];
          let dy = v[1];
          
          if (! dx&&! dy) {
            throw new Error(" dx dy "+dx+","+dy);
            
          }
          let x = a.x+dx;
          let y = a.y+dy;
          
          if (typeof  x!=="number"||typeof  y!=="number") {
            throw new Error(" x y "+x+","+y);
            
          }
          let c = 0;
          
          while (true) {
            if (x<0||x>=8||y<0||y>=8) {
              break;
              
            }
            let g = nm.get(x,y);
            
            if (g==0) {
              break;
              
              
            } else {
              if (g==_this.player) {
                x-=dx;
                y-=dy;
                while (x!=a.x||y!=a.y) {
                  if (x<0||x>=8||x<0||y>=8) {
                    throw new Error("g!?="+x+","+y);
                    
                  }
                  nm.set(x,y,_this.player);
                  x-=dx;
                  y-=dy;
                  changed=true;
                  
                }
                break;
                
                
              } else {
                if (g==foe) {
                  x+=dx;
                  y+=dy;
                  
                } else {
                  throw new Error("g!?="+g);
                  
                  
                }
              }
            }
            
          }
          
        }
        return new Tonyu.classes.user.Board({mat: nm,player: foe,changed: changed,foePassed: false});
      },
      fiber$next :function* _trc_Board_f_next(_thread,ctx,a) {
        var _this=this;
        
        let nm=yield* _this.fiber$cloneMat(_thread);
        
        let foe = 3-_this.player;
        
        if (a.pass) {
          return new Tonyu.classes.user.Board({mat: nm,player: foe,foePassed: true});
          
        }
        nm.set(a.x,a.y,_this.player);
        let changed = false;
        
        let vs = [[0,- 1],[1,- 1],[1,0],[1,1],[0,1],[- 1,1],[- 1,0],[- 1,- 1]];
        
        for (let [v] of Tonyu.iterator2(vs,1)) {
          let dx = v[0];
          let dy = v[1];
          
          if (! dx&&! dy) {
            throw new Error(" dx dy "+dx+","+dy);
            
          }
          let x = a.x+dx;
          let y = a.y+dy;
          
          if (typeof  x!=="number"||typeof  y!=="number") {
            throw new Error(" x y "+x+","+y);
            
          }
          let c = 0;
          
          while (true) {
            if (x<0||x>=8||y<0||y>=8) {
              break;
              
            }
            let g = nm.get(x,y);
            
            if (g==0) {
              break;
              
              
            } else {
              if (g==_this.player) {
                x-=dx;
                y-=dy;
                while (x!=a.x||y!=a.y) {
                  if (x<0||x>=8||x<0||y>=8) {
                    throw new Error("g!?="+x+","+y);
                    
                  }
                  nm.set(x,y,_this.player);
                  x-=dx;
                  y-=dy;
                  changed=true;
                  
                }
                break;
                
                
              } else {
                if (g==foe) {
                  x+=dx;
                  y+=dy;
                  
                } else {
                  throw new Error("g!?="+g);
                  
                  
                }
              }
            }
            
          }
          
        }
        return new Tonyu.classes.user.Board({mat: nm,player: foe,changed: changed,foePassed: false});
        
      },
      cloneMat :function _trc_Board_cloneMat() {
        var _this=this;
        
        let nm = _this.mat.clone();
        
        return nm;
      },
      fiber$cloneMat :function* _trc_Board_f_cloneMat(_thread) {
        var _this=this;
        
        let nm = _this.mat.clone();
        
        return nm;
        
      },
      actionsEvents :function _trc_Board_actionsEvents(ctx) {
        var _this=this;
        
        let res = [];
        
        for (let y = 0;
         y<8 ; y++) {
          {
            for (let x = 0;
             x<8 ; x++) {
              {
                if (_this.mat.get(x,y)!=0) {
                  continue;
                  
                }
                res.push({x: x,y: y});
              }
            }
          }
        }
        if (! ctx.free) {
          res=res.filter((function anonymous_2307(a) {
            
            return _this.next(ctx,a).changed;
          }));
          if (res.length==0&&! _this.foePassed) {
            res.push({pass: true});
            
          }
          
        }
        return res;
      },
      fiber$actionsEvents :function* _trc_Board_f_actionsEvents(_thread,ctx) {
        var _this=this;
        
        let res = [];
        
        for (let y = 0;
         y<8 ; y++) {
          {
            for (let x = 0;
             x<8 ; x++) {
              {
                if (_this.mat.get(x,y)!=0) {
                  continue;
                  
                }
                res.push({x: x,y: y});
              }
            }
          }
        }
        if (! ctx.free) {
          res=res.filter((function anonymous_2307(a) {
            
            return _this.next(ctx,a).changed;
          }));
          if (res.length==0&&! _this.foePassed) {
            res.push({pass: true});
            
          }
          
        }
        return res;
        
      },
      gameover :function _trc_Board_gameover(ctx) {
        var _this=this;
        
        if (_this.actionsEvents(ctx).length==0) {
          let c1 = 0;
          let c2 = 0;
          
          for (let [x, y, p] of Tonyu.iterator2(_this.mat,3)) {
            if (p==1) {
              c1++;
            }
            if (p==2) {
              c2++;
            }
            
          }
          if (c1>c2) {
            return 1;
          }
          if (c2>c1) {
            return 2;
          }
          return true;
          
        }
        return false;
      },
      fiber$gameover :function* _trc_Board_f_gameover(_thread,ctx) {
        var _this=this;
        
        if (_this.actionsEvents(ctx).length==0) {
          let c1 = 0;
          let c2 = 0;
          
          for (let [x, y, p] of Tonyu.iterator2(_this.mat,3)) {
            if (p==1) {
              c1++;
            }
            if (p==2) {
              c2++;
            }
            
          }
          if (c1>c2) {
            return 1;
          }
          if (c2>c1) {
            return 2;
          }
          return true;
          
        }
        return false;
        
      },
      toString :function _trc_Board_toString() {
        var _this=this;
        
        let buf = "";
        let py = 0;
        
        for (let [x, y, p] of Tonyu.iterator2(_this.mat,3)) {
          if (y!=py) {
            buf+="\n";
          }
          py=y;
          let pp = (p==0?"-":p);
          
          if (pp==null) {
            throw new Error("Why undef? p.length="+p.length);
            
          }
          buf+=pp+" ";
          
        }
        buf+="\n"+"Player "+_this.player;
        return buf;
      },
      fiber$toString :function* _trc_Board_f_toString(_thread) {
        var _this=this;
        
        let buf = "";
        let py = 0;
        
        for (let [x, y, p] of Tonyu.iterator2(_this.mat,3)) {
          if (y!=py) {
            buf+="\n";
          }
          py=y;
          let pp = (p==0?"-":p);
          
          if (pp==null) {
            throw new Error("Why undef? p.length="+p.length);
            
          }
          buf+=pp+" ";
          
        }
        buf+="\n"+"Player "+_this.player;
        return buf;
        
      },
      __dummy: false
    };
  },
  decls: {"methods":{"main":{"nowait":false,"isMain":true,"vtype":{"params":[],"returnValue":null}},"next":{"nowait":false,"isMain":false,"vtype":{"params":["bot.Context",null],"returnValue":"bot.State"}},"cloneMat":{"nowait":false,"isMain":false,"vtype":{"params":[],"returnValue":null}},"actionsEvents":{"nowait":false,"isMain":false,"vtype":{"params":["bot.Context"],"returnValue":null}},"gameover":{"nowait":false,"isMain":false,"vtype":{"params":["bot.Context"],"returnValue":null}},"toString":{"nowait":false,"isMain":false,"vtype":{"params":[],"returnValue":null}}},"fields":{"mat":{},"player":{},"changed":{},"foePassed":{}}}
});
Tonyu.klass.define({
  fullName: 'user.Main',
  shortName: 'Main',
  namespace: 'user',
  superclass: Tonyu.classes.kernel.Actor,
  includes: [],
  methods: function (__superClass) {
    return {
      main :function _trc_Main_main() {
        var _this=this;
        
        "field strict";
        if (process.argv[1]=="--expose-gc") {
          process.argv.shift();
        }
        if (! process.argv[10]) {
          throw new Error("ゲーム実行回数が入力されていません！");
          
          
        }
        _this.player1 = {name: process.argv[4],iteration: process.argv[5],timeout: process.argv[6]};
        
        _this.player2 = {name: process.argv[7],iteration: process.argv[8],timeout: process.argv[9]};
        
        _this.print(_this.player1);
        _this.print(_this.player2);
        _this.replayFile = process.argv[11];
        
        if (_this.replayFile) {
          _this.update();
          for (let mt = 0;
           mt<process.argv[10]-0 ; mt++) {
            {
              let bots = [0,_this.botParameter(_this.player1),_this.botParameter(_this.player2)];
              
              let context = new Tonyu.classes.bot.Context({players: [1,2],bots: bots});
              
              let state = _this.initialState(context);
              
              let replay = new Tonyu.classes.bot.Replay({state: state,context: context,logFile: _this.replayFile});
              
              let turn = process.argv[12];
              
              _this.print(replay.state+"");
              for (let i = 0;
               i<turn ; i++) {
                {
                  replay.step();
                  _this.print(replay.state+"");
                }
              }
              let acts = replay.state.actionsEvents(context);
              
              for (let [act] of Tonyu.iterator2(acts,1)) {
                let nr = replay.actionModified(act);
                
                _this.match(context,nr.state,nr);
                
              }
            }
          }
          
        } else {
          for (let i = 0;
           i<process.argv[10]-0 ; i++) {
            {
              let bots = [0,_this.botParameter(_this.player1),_this.botParameter(_this.player2)];
              
              let context = new Tonyu.classes.bot.Context({players: [1,2],bots: bots});
              
              let state = _this.initialState(context);
              
              _this.match(context,state);
            }
          }
          
        }
      },
      fiber$main :function* _trc_Main_f_main(_thread) {
        var _this=this;
        
        "field strict";
        if (process.argv[1]=="--expose-gc") {
          process.argv.shift();
        }
        if (! process.argv[10]) {
          throw new Error("ゲーム実行回数が入力されていません！");
          
          
        }
        _this.player1 = {name: process.argv[4],iteration: process.argv[5],timeout: process.argv[6]};
        
        _this.player2 = {name: process.argv[7],iteration: process.argv[8],timeout: process.argv[9]};
        
        _this.print(_this.player1);
        _this.print(_this.player2);
        _this.replayFile = process.argv[11];
        
        if (_this.replayFile) {
          (yield* _this.fiber$update(_thread));
          for (let mt = 0;
           mt<process.argv[10]-0 ; mt++) {
            {
              let bots = [0,_this.botParameter(_this.player1),_this.botParameter(_this.player2)];
              
              let context = new Tonyu.classes.bot.Context({players: [1,2],bots: bots});
              
              let state=yield* _this.fiber$initialState(_thread, context);
              
              let replay = new Tonyu.classes.bot.Replay({state: state,context: context,logFile: _this.replayFile});
              
              let turn = process.argv[12];
              
              _this.print(replay.state+"");
              for (let i = 0;
               i<turn ; i++) {
                {
                  replay.step();
                  _this.print(replay.state+"");
                }
              }
              let acts = replay.state.actionsEvents(context);
              
              for (let [act] of Tonyu.iterator2(acts,1)) {
                let nr = replay.actionModified(act);
                
                (yield* _this.fiber$match(_thread, context, nr.state, nr));
                
              }
            }
          }
          
        } else {
          for (let i = 0;
           i<process.argv[10]-0 ; i++) {
            {
              let bots = [0,_this.botParameter(_this.player1),_this.botParameter(_this.player2)];
              
              let context = new Tonyu.classes.bot.Context({players: [1,2],bots: bots});
              
              let state=yield* _this.fiber$initialState(_thread, context);
              
              (yield* _this.fiber$match(_thread, context, state));
            }
          }
          
        }
        
      },
      randomRange :function _trc_Main_randomRange(rstr) {
        var _this=this;
        
        let p = /^([\.\d]+)-([\.\d]+)$/;
        
        let m = p.exec(rstr);
        
        if (! m) {
          return Number(rstr);
        }
        return _this.rnd(m[2]-m[1])+(m[1]-0);
      },
      fiber$randomRange :function* _trc_Main_f_randomRange(_thread,rstr) {
        var _this=this;
        
        let p = /^([\.\d]+)-([\.\d]+)$/;
        
        let m = p.exec(rstr);
        
        if (! m) {
          return Number(rstr);
        }
        return _this.rnd(m[2]-m[1])+(m[1]-0);
        
      },
      botParameter :function _trc_Main_botParameter(player) {
        var _this=this;
        var bot;
        
        
        if (player.name=="mcts") {
          bot=new Tonyu.classes.bot.MCTSBot({value: Tonyu.bindFunc(_this,_this.value),Cp: 10,expandThresh: 3,iteration: _this.randomRange(player.iteration),timeout: _this.randomRange(player.timeout)});
          
        } else {
          if (player.name=="cmcts") {
            
            
          } else {
            throw new Error("bot:",bot);
            
            
          }
        }
        return bot;
      },
      fiber$botParameter :function* _trc_Main_f_botParameter(_thread,player) {
        var _this=this;
        var bot;
        
        
        if (player.name=="mcts") {
          bot=new Tonyu.classes.bot.MCTSBot({value: Tonyu.bindFunc(_this,_this.value),Cp: 10,expandThresh: 3,iteration: _this.randomRange(player.iteration),timeout: _this.randomRange(player.timeout)});
          
        } else {
          if (player.name=="cmcts") {
            
            
          } else {
            throw new Error("bot:",bot);
            
            
          }
        }
        return bot;
        
      },
      value :function _trc_Main_value(ctx,player,state) {
        var _this=this;
        
        let win = state.gameover(ctx);
        
        if (! win||win===true) {
          return 0.5;
          
        } else {
          if (player===win) {
            return 1;
            
          } else {
            return 0;
            
          }
        }
      },
      fiber$value :function* _trc_Main_f_value(_thread,ctx,player,state) {
        var _this=this;
        
        let win = state.gameover(ctx);
        
        if (! win||win===true) {
          return 0.5;
          
        } else {
          if (player===win) {
            return 1;
            
          } else {
            return 0;
            
          }
        }
        
      },
      dump :function _trc_Main_dump(bot,context,state,player) {
        var _this=this;
        
        bot.play(context,state);
        _this.print(state+"");
        let lastNode = bot.lastRootNode;
        
        let lastActions = bot.lastActions;
        
        if (lastNode&&lastActions) {
          let sns = [];
          
          for (let a = 0;
           a<lastNode.subnodes.length ; a++) {
            {
              let qc = bot.q(lastNode,a);
              
              let ns = state.next(context,lastActions[a]);
              
              let sn = lastNode.subnodes[a];
              
              sns.push({action: lastActions[a],qc: qc,q: sn.q+"",n: sn.n,ns: ns+" gov="+ns.gameover(),value: _this.value(context,player,ns)});
            }
          }
          sns.sort((function anonymous_3383(a,b) {
            
            return b.qc-a.qc;
          }));
          _this.print(sns);
          
        }
      },
      fiber$dump :function* _trc_Main_f_dump(_thread,bot,context,state,player) {
        var _this=this;
        
        bot.play(context,state);
        _this.print(state+"");
        let lastNode = bot.lastRootNode;
        
        let lastActions = bot.lastActions;
        
        if (lastNode&&lastActions) {
          let sns = [];
          
          for (let a = 0;
           a<lastNode.subnodes.length ; a++) {
            {
              let qc = bot.q(lastNode,a);
              
              let ns = state.next(context,lastActions[a]);
              
              let sn = lastNode.subnodes[a];
              
              sns.push({action: lastActions[a],qc: qc,q: sn.q+"",n: sn.n,ns: ns+" gov="+ns.gameover(),value: _this.value(context,player,ns)});
            }
          }
          sns.sort((function anonymous_3383(a,b) {
            
            return b.qc-a.qc;
          }));
          _this.print(sns);
          
        }
        
      },
      initialState :function _trc_Main_initialState(context) {
        var _this=this;
        
        let mat = new Tonyu.classes.kernel.Matrix;
        
        let r = 8;
        
        for (let i = 0;
         i<r ; i++) {
          {
            for (let j = 0;
             j<r ; j++) {
              {
                mat.set(j,i,0);
              }
            }
          }
        }
        mat.set(3,3,1);
        mat.set(4,4,1);
        mat.set(3,4,2);
        mat.set(4,3,2);
        let player = 1;
        
        let state = new Tonyu.classes.user.Board({mat: mat,player: player});
        
        return state;
      },
      fiber$initialState :function* _trc_Main_f_initialState(_thread,context) {
        var _this=this;
        
        let mat = new Tonyu.classes.kernel.Matrix;
        
        let r = 8;
        
        for (let i = 0;
         i<r ; i++) {
          {
            for (let j = 0;
             j<r ; j++) {
              {
                mat.set(j,i,0);
              }
            }
          }
        }
        mat.set(3,3,1);
        mat.set(4,4,1);
        mat.set(3,4,2);
        mat.set(4,3,2);
        let player = 1;
        
        let state = new Tonyu.classes.user.Board({mat: mat,player: player});
        
        return state;
        
      },
      match :function _trc_Main_match(context,state,replay) {
        var _this=this;
        
        let bots = context.bots;
        
        let logger = new Tonyu.classes.bot.Logger({replay: replay,bots: bots});
        
        let g = new Tonyu.classes.bot.GameMaster({context: context,state: state,logger: logger});
        
        _this.print(g.state+"");
        let winner = 0;
        
        while (! (winner=g.gameover())) {
          let a = g.step();
          
          _this.print(Tonyu.globals.$JSON.stringify(a));
          _this.print(g.state+"");
          _this.print(_this.value(context,g.state.player,g.state));
          _this.updateEx(1);
          
        }
        _this.print("winner is ",winner);
        logger.add("Winner: "+winner);
      },
      fiber$match :function* _trc_Main_f_match(_thread,context,state,replay) {
        var _this=this;
        
        let bots = context.bots;
        
        let logger = new Tonyu.classes.bot.Logger({replay: replay,bots: bots});
        
        let g = new Tonyu.classes.bot.GameMaster({context: context,state: state,logger: logger});
        
        _this.print(g.state+"");
        let winner = 0;
        
        while (! (winner=g.gameover())) {
          let a = g.step();
          
          _this.print(Tonyu.globals.$JSON.stringify(a));
          _this.print(g.state+"");
          _this.print(_this.value(context,g.state.player,g.state));
          (yield* _this.fiber$updateEx(_thread, 1));
          
        }
        _this.print("winner is ",winner);
        logger.add("Winner: "+winner);
        
      },
      __dummy: false
    };
  },
  decls: {"methods":{"main":{"nowait":false,"isMain":true,"vtype":{"params":[],"returnValue":null}},"randomRange":{"nowait":false,"isMain":false,"vtype":{"params":[null],"returnValue":null}},"botParameter":{"nowait":false,"isMain":false,"vtype":{"params":[null],"returnValue":null}},"value":{"nowait":false,"isMain":false,"vtype":{"params":["bot.Context","Number","user.Board"],"returnValue":null}},"dump":{"nowait":false,"isMain":false,"vtype":{"params":[null,null,null,null],"returnValue":null}},"initialState":{"nowait":false,"isMain":false,"vtype":{"params":[null],"returnValue":null}},"match":{"nowait":false,"isMain":false,"vtype":{"params":[null,null,null],"returnValue":null}}},"fields":{"player1":{},"player2":{},"replayFile":{}}}
});
Tonyu.klass.define({
  fullName: 'user.Test',
  shortName: 'Test',
  namespace: 'user',
  superclass: Tonyu.classes.kernel.Actor,
  includes: [],
  methods: function (__superClass) {
    return {
      main :function _trc_Test_main() {
        var _this=this;
        
        _this.mat = new Tonyu.classes.kernel.Matrix;
        
        _this.r = 3;
        
        for (let i = 0;
         i<_this.r ; i++) {
          {
            for (let j = 0;
             j<_this.r ; j++) {
              {
                _this.mat.set(j,i,[]);
              }
            }
          }
        }
        _this.mat.set(0,0,[3,5]);
        _this.mat.set(1,0,[5]);
        _this.mat.set(2,0,[6]);
        _this.player = 1;
        
        _this.state = new Tonyu.classes.user.Board({mat: _this.mat,player: _this.player,having: [1,1,2,2,3,3,4,4,5,5,6,6],cnt: 0,lastPut: [0,0,0]});
        
        _this.print(_this.state.gameover());
        _this.print(_this.state);
      },
      fiber$main :function* _trc_Test_f_main(_thread) {
        var _this=this;
        
        _this.mat = new Tonyu.classes.kernel.Matrix;
        
        _this.r = 3;
        
        for (let i = 0;
         i<_this.r ; i++) {
          {
            for (let j = 0;
             j<_this.r ; j++) {
              {
                _this.mat.set(j,i,[]);
              }
            }
          }
        }
        _this.mat.set(0,0,[3,5]);
        _this.mat.set(1,0,[5]);
        _this.mat.set(2,0,[6]);
        _this.player = 1;
        
        _this.state = new Tonyu.classes.user.Board({mat: _this.mat,player: _this.player,having: [1,1,2,2,3,3,4,4,5,5,6,6],cnt: 0,lastPut: [0,0,0]});
        
        _this.print(_this.state.gameover());
        _this.print(_this.state);
        
      },
      __dummy: false
    };
  },
  decls: {"methods":{"main":{"nowait":false,"isMain":true,"vtype":{"params":[],"returnValue":null}}},"fields":{"mat":{},"r":{},"player":{},"state":{}}}
});

});

//# sourceMappingURL=concat.js.map