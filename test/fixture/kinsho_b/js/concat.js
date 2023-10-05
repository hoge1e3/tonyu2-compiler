if(!Tonyu.load)Tonyu.load=(_,f)=>f();
Tonyu.load({"compiler":{"namespace":"user","defaultSuperClass":"kernel.Actor","dependingProjects":[{"namespace":"kernel"},{"dir":"../bot/"}],"noLoopCheck":true,"field_strict":true,"typeCheck":true},"run":{"mainClass":"user.Main","bootClass":"kernel.Boot","globals":{"$defaultFPS":60,"$imageSmoothingDisabled":true,"$soundLoadAndDecode":false}},"plugins":{},"kernelEditable":false,"language":"tonyu","version":1658553334869}, ()=>{
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
        
        let nm = _this.mat.clone();
        
        let p = _this.mat.get(a.x,a.y);
        
        nm.set(a.x,a.y,0);
        nm.set(a.x+a.dx,a.y+a.dy,p);
        let foe = 3-_this.player;
        
        return new Tonyu.classes.user.Board({mat: nm,player: foe});
      },
      fiber$next :function* _trc_Board_f_next(_thread,ctx,a) {
        var _this=this;
        
        let nm = _this.mat.clone();
        
        let p = _this.mat.get(a.x,a.y);
        
        nm.set(a.x,a.y,0);
        nm.set(a.x+a.dx,a.y+a.dy,p);
        let foe = 3-_this.player;
        
        return new Tonyu.classes.user.Board({mat: nm,player: foe});
        
      },
      actionsEvents :function _trc_Board_actionsEvents(ctx) {
        var _this=this;
        
        let res = [];
        
        let kings = 0;
        
        for (let [x, y, p] of Tonyu.iterator2(_this.mat,3)) {
          if (p===_this.player||p===_this.player+2) {
            let dy = (p==1||p==3)?- 1:1;
            
            for (let dx = - 1;
             dx<=1 ; dx++) {
              {
                let g = _this.mat.get(x+dx,y+dy);
                
                let gt = (g>=3?g-2:g);
                
                let pt = (p>=3?p-2:p);
                
                if (g!=null&&gt!=pt) {
                  res.push({x: x,y: y,dx: dx,dy: dy});
                  
                }
              }
            }
            
          }
          if (p==3||p==4) {
            kings++;
          }
          
        }
        if (kings<2) {
          return [];
        }
        return res;
      },
      fiber$actionsEvents :function* _trc_Board_f_actionsEvents(_thread,ctx) {
        var _this=this;
        
        let res = [];
        
        let kings = 0;
        
        for (let [x, y, p] of Tonyu.iterator2(_this.mat,3)) {
          if (p===_this.player||p===_this.player+2) {
            let dy = (p==1||p==3)?- 1:1;
            
            for (let dx = - 1;
             dx<=1 ; dx++) {
              {
                let g = _this.mat.get(x+dx,y+dy);
                
                let gt = (g>=3?g-2:g);
                
                let pt = (p>=3?p-2:p);
                
                if (g!=null&&gt!=pt) {
                  res.push({x: x,y: y,dx: dx,dy: dy});
                  
                }
              }
            }
            
          }
          if (p==3||p==4) {
            kings++;
          }
          
        }
        if (kings<2) {
          return [];
        }
        return res;
        
      },
      gameover :function _trc_Board_gameover(ctx) {
        var _this=this;
        
        return _this.actionsEvents(ctx).length==0;
      },
      fiber$gameover :function* _trc_Board_f_gameover(_thread,ctx) {
        var _this=this;
        
        return _this.actionsEvents(ctx).length==0;
        
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
          buf+=p+" ";
          
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
          buf+=p+" ";
          
        }
        buf+="\n"+"Player "+_this.player;
        return buf;
        
      },
      __dummy: false
    };
  },
  decls: {"methods":{"main":{"nowait":false,"isMain":true,"vtype":{"params":[],"returnValue":null}},"next":{"nowait":false,"isMain":false,"vtype":{"params":["bot.Context",null],"returnValue":"bot.State"}},"actionsEvents":{"nowait":false,"isMain":false,"vtype":{"params":["bot.Context"],"returnValue":null}},"gameover":{"nowait":false,"isMain":false,"vtype":{"params":["bot.Context"],"returnValue":null}},"toString":{"nowait":false,"isMain":false,"vtype":{"params":[],"returnValue":null}}},"fields":{"mat":{"vtype":"kernel.Matrix"},"player":{"vtype":"Number"}}}
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
        if (! process.argv[10]) {
          throw new Error("ゲーム実行回数が入力されていません！");
          
          
        }
        _this.player1 = {name: process.argv[4],iteration: process.argv[5],timeout: process.argv[6]};
        
        _this.player2 = {name: process.argv[7],iteration: process.argv[8],timeout: process.argv[9]};
        
        _this.print(_this.player1);
        _this.print(_this.player2);
        _this.bots = [0,_this.botParameter(_this.player1),_this.botParameter(_this.player2)];
        
        
        _this.replayFile = process.argv[11];
        
        if (_this.replayFile) {
          _this.update();
          let context = new Tonyu.classes.bot.Context({players: [1,2],bots: _this.bots});
          
          let state = _this.initBoard();
          
          let replay = new Tonyu.classes.bot.Replay({state: state,context: context,logFile: _this.replayFile});
          
          let turn = process.argv[12];
          
          for (let i = 0;
           i<turn ; i++) {
            {
              _this.print(replay.state+"");
              replay.step();
            }
          }
          _this.print(replay.state+"");
          let bot = _this.bots[replay.state.player];
          
          replay.dump(bot);
          
        } else {
          for (let i = 0;
           i<process.argv[10]-0 ; i++) {
            {
              _this.match();
            }
          }
          
        }
      },
      fiber$main :function* _trc_Main_f_main(_thread) {
        var _this=this;
        
        "field strict";
        if (! process.argv[10]) {
          throw new Error("ゲーム実行回数が入力されていません！");
          
          
        }
        _this.player1 = {name: process.argv[4],iteration: process.argv[5],timeout: process.argv[6]};
        
        _this.player2 = {name: process.argv[7],iteration: process.argv[8],timeout: process.argv[9]};
        
        _this.print(_this.player1);
        _this.print(_this.player2);
        _this.bots = [0,_this.botParameter(_this.player1),_this.botParameter(_this.player2)];
        
        
        _this.replayFile = process.argv[11];
        
        if (_this.replayFile) {
          (yield* _this.fiber$update(_thread));
          let context = new Tonyu.classes.bot.Context({players: [1,2],bots: _this.bots});
          
          let state=yield* _this.fiber$initBoard(_thread);
          
          let replay = new Tonyu.classes.bot.Replay({state: state,context: context,logFile: _this.replayFile});
          
          let turn = process.argv[12];
          
          for (let i = 0;
           i<turn ; i++) {
            {
              _this.print(replay.state+"");
              replay.step();
            }
          }
          _this.print(replay.state+"");
          let bot = _this.bots[replay.state.player];
          
          replay.dump(bot);
          
        } else {
          for (let i = 0;
           i<process.argv[10]-0 ; i++) {
            {
              (yield* _this.fiber$match(_thread));
            }
          }
          
        }
        
      },
      botParameter :function _trc_Main_botParameter(player) {
        var _this=this;
        var bot;
        
        
        if (player.name=="mcts") {
          bot=new Tonyu.classes.bot.MCTSBot({value: Tonyu.bindFunc(_this,_this.value),Cp: 10,expandThresh: 3,iteration: Number(player.iteration),timeout: Number(player.timeout)});
          
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
          bot=new Tonyu.classes.bot.MCTSBot({value: Tonyu.bindFunc(_this,_this.value),Cp: 10,expandThresh: 3,iteration: Number(player.iteration),timeout: Number(player.timeout)});
          
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
        
        let acts = state.actionsEvents(ctx);
        
        if (acts.length===0) {
          if (player===state.player) {
            return 0;
          } else {
            return 1;
          }
          
        }
        if (player===state.player) {
          return 0.5+acts.length/_this.komas/3;
          
        } else {
          return 0.5-acts.length/_this.komas/3;
          
        }
      },
      fiber$value :function* _trc_Main_f_value(_thread,ctx,player,state) {
        var _this=this;
        
        let acts = state.actionsEvents(ctx);
        
        if (acts.length===0) {
          if (player===state.player) {
            return 0;
          } else {
            return 1;
          }
          
        }
        if (player===state.player) {
          return 0.5+acts.length/_this.komas/3;
          
        } else {
          return 0.5-acts.length/_this.komas/3;
          
        }
        
      },
      initBoard :function _trc_Main_initBoard(context) {
        var _this=this;
        
        let mat = new Tonyu.classes.kernel.Matrix;
        
        let s = ["2 2 2 2 2 2 2","0 2 0 0 0 2 0","2 2 2 2 2 2 2","0 0 0 0 0 0 0","1 1 1 1 1 1 1","0 1 0 0 0 1 0","1 1 1 1 1 1 1"];
        
        s=["2 2 4 2 2","2 2 2 2 2","0 0 0 0 0","1 1 1 1 1","1 1 3 1 1"];
        let player = 1;
        
        _this.komas=0;
        for (let [r, row] of Tonyu.iterator2(s,2)) {
          for (let [c, col] of Tonyu.iterator2(row.split(" "),2)) {
            if (col!="0") {
              _this.komas++;
            }
            mat.set(c,r,col-0);
            
          }
          
        }
        _this.print("komas",_this.komas);
        let state = new Tonyu.classes.user.Board({mat: mat,player: player});
        
        return state;
      },
      fiber$initBoard :function* _trc_Main_f_initBoard(_thread,context) {
        var _this=this;
        
        let mat = new Tonyu.classes.kernel.Matrix;
        
        let s = ["2 2 2 2 2 2 2","0 2 0 0 0 2 0","2 2 2 2 2 2 2","0 0 0 0 0 0 0","1 1 1 1 1 1 1","0 1 0 0 0 1 0","1 1 1 1 1 1 1"];
        
        s=["2 2 4 2 2","2 2 2 2 2","0 0 0 0 0","1 1 1 1 1","1 1 3 1 1"];
        let player = 1;
        
        _this.komas=0;
        for (let [r, row] of Tonyu.iterator2(s,2)) {
          for (let [c, col] of Tonyu.iterator2(row.split(" "),2)) {
            if (col!="0") {
              _this.komas++;
            }
            mat.set(c,r,col-0);
            
          }
          
        }
        _this.print("komas",_this.komas);
        let state = new Tonyu.classes.user.Board({mat: mat,player: player});
        
        return state;
        
      },
      match :function _trc_Main_match() {
        var _this=this;
        
        let context = new Tonyu.classes.bot.Context({players: [1,2],bots: _this.bots});
        
        let state = _this.initBoard();
        
        let logger = new Tonyu.classes.bot.Logger;
        
        let g = new Tonyu.classes.bot.GameMaster({context: context,state: state,logger: logger});
        
        _this.print(g.state+"");
        while (! g.gameover()) {
          let a = g.step();
          
          _this.print(a.x,a.y,a.dx,a.dy);
          _this.print(g.state+"");
          _this.print(_this.value(context,g.state.player,g.state));
          _this.updateEx(1);
          
        }
        logger.add("Result: loser="+g.state.player);
      },
      fiber$match :function* _trc_Main_f_match(_thread) {
        var _this=this;
        
        let context = new Tonyu.classes.bot.Context({players: [1,2],bots: _this.bots});
        
        let state=yield* _this.fiber$initBoard(_thread);
        
        let logger = new Tonyu.classes.bot.Logger;
        
        let g = new Tonyu.classes.bot.GameMaster({context: context,state: state,logger: logger});
        
        _this.print(g.state+"");
        while (! g.gameover()) {
          let a = g.step();
          
          _this.print(a.x,a.y,a.dx,a.dy);
          _this.print(g.state+"");
          _this.print(_this.value(context,g.state.player,g.state));
          (yield* _this.fiber$updateEx(_thread, 1));
          
        }
        logger.add("Result: loser="+g.state.player);
        
      },
      __dummy: false
    };
  },
  decls: {"methods":{"main":{"nowait":false,"isMain":true,"vtype":{"params":[],"returnValue":null}},"botParameter":{"nowait":false,"isMain":false,"vtype":{"params":[null],"returnValue":null}},"value":{"nowait":false,"isMain":false,"vtype":{"params":["bot.Context","Number","user.Board"],"returnValue":null}},"initBoard":{"nowait":false,"isMain":false,"vtype":{"params":[null],"returnValue":null}},"match":{"nowait":false,"isMain":false,"vtype":{"params":[],"returnValue":null}}},"fields":{"player1":{},"player2":{},"bots":{},"komas":{},"replayFile":{}}}
});

});

//# sourceMappingURL=concat.js.map