if(!Tonyu.load)Tonyu.load=(_,f)=>f();
Tonyu.load({"compiler":{"defaultSuperClass":"Actor","commentLastPos":true,"diagnose":false,"dependingProjects":[{"namespace":"kernel"}],"namespace":"bot","noLoopCheck":true,"field_strict":false,"typeCheck":false},"run":{"mainClass":"user.AutoMCTS","bootClass":"Boot","globals":{"$defaultFPS":60,"$imageSmoothingDisabled":true,"$soundLoadAndDecode":false}},"kernelEditable":false,"version":1566017719851,"plugins":{"jquery_ui":1},"language":"tonyu"}, ()=>{
Tonyu.klass.define({
  fullName: 'bot.Action',
  shortName: 'Action',
  namespace: 'bot',
  superclass: Tonyu.classes.kernel.Actor,
  includes: [],
  methods: function (__superClass) {
    return {
      main :function _trc_Action_main() {
        var _this=this;
        
      },
      fiber$main :function* _trc_Action_f_main(_thread) {
        var _this=this;
        
        
      },
      __dummy: false
    };
  },
  decls: {"methods":{"main":{"nowait":false,"isMain":true,"vtype":{"params":[],"returnValue":null}}},"fields":{}}
});
Tonyu.klass.define({
  fullName: 'bot.Bot',
  shortName: 'Bot',
  namespace: 'bot',
  superclass: Tonyu.classes.kernel.Actor,
  includes: [],
  methods: function (__superClass) {
    return {
      main :function _trc_Bot_main() {
        var _this=this;
        
      },
      fiber$main :function* _trc_Bot_f_main(_thread) {
        var _this=this;
        
        
      },
      play :function _trc_Bot_play(ctx,s) {
        var _this=this;
        
        throw new Error("Abstract: メソッドplayが実装されていません");
        
      },
      fiber$play :function* _trc_Bot_f_play(_thread,ctx,s) {
        var _this=this;
        
        throw new Error("Abstract: メソッドplayが実装されていません");
        
        
      },
      __dummy: false
    };
  },
  decls: {"methods":{"main":{"nowait":false,"isMain":true,"vtype":{"params":[],"returnValue":null}},"play":{"nowait":false,"isMain":false,"vtype":{"params":[null,"bot.State"],"returnValue":"bot.Action"}}},"fields":{}}
});
Tonyu.klass.define({
  fullName: 'bot.Context',
  shortName: 'Context',
  namespace: 'bot',
  superclass: Tonyu.classes.kernel.Actor,
  includes: [],
  methods: function (__superClass) {
    return {
      main :function _trc_Context_main() {
        var _this=this;
        
        
        
        
      },
      fiber$main :function* _trc_Context_f_main(_thread) {
        var _this=this;
        
        
        
        
        
      },
      __dummy: false
    };
  },
  decls: {"methods":{"main":{"nowait":false,"isMain":true,"vtype":{"params":[],"returnValue":null}}},"fields":{"player":{},"players":{},"debug":{},"number":{},"boolean":{}}}
});
Tonyu.klass.define({
  fullName: 'bot.GameMaster',
  shortName: 'GameMaster',
  namespace: 'bot',
  superclass: Tonyu.classes.kernel.Actor,
  includes: [],
  methods: function (__superClass) {
    return {
      main :function _trc_GameMaster_main() {
        var _this=this;
        
        
        
        
      },
      fiber$main :function* _trc_GameMaster_f_main(_thread) {
        var _this=this;
        
        
        
        
        
      },
      onAppear :function _trc_GameMaster_onAppear() {
        var _this=this;
        
      },
      fiber$onAppear :function* _trc_GameMaster_f_onAppear(_thread) {
        var _this=this;
        
        
      },
      step :function _trc_GameMaster_step() {
        var _this=this;
        
        if (_this.gameover()) {
          throw new Error("Game is over");
          
        }
        if (_this.state.nextIsEvent(_this.context)) {
          let events = _this.state.actionsEvents(_this.context);
          
          let rate = _this.rnd();
          let ratesum = 0;
          let selevent;
          for (let [event] of Tonyu.iterator2(events,1)) {
            if (typeof  event.prob!=="number") {
              throw new Error("prob is not set");
              
            }
            ratesum+=event.prob;
            if (rate<ratesum) {
              selevent=event;
              break;
              
              
            }
            
          }
          if (! selevent) {
            throw new Error("Event is not selected");
            
          }
          if (_this.logger) {
            _this.logger.action(selevent);
          }
          _this.state=_this.state.next(_this.context,selevent);
          if (! _this.state) {
            throw new Error("state is null!");
            
          }
          return selevent;
          
        } else {
          let bot = _this.getBot(_this.state.player);
          
          let action = bot.play(_this.context,_this.state);
          
          if (_this.logger) {
            _this.logger.add("Player: "+_this.state.player);
            _this.logger.botStatus(bot);
            _this.logger.action(action);
            
          }
          _this.state=_this.state.next(_this.context,action);
          if (! _this.state) {
            throw new Error("state is null!");
            
          }
          return action;
          
        }
      },
      fiber$step :function* _trc_GameMaster_f_step(_thread) {
        var _this=this;
        
        if (_this.gameover()) {
          throw new Error("Game is over");
          
        }
        if (_this.state.nextIsEvent(_this.context)) {
          let events = _this.state.actionsEvents(_this.context);
          
          let rate = _this.rnd();
          let ratesum = 0;
          let selevent;
          for (let [event] of Tonyu.iterator2(events,1)) {
            if (typeof  event.prob!=="number") {
              throw new Error("prob is not set");
              
            }
            ratesum+=event.prob;
            if (rate<ratesum) {
              selevent=event;
              break;
              
              
            }
            
          }
          if (! selevent) {
            throw new Error("Event is not selected");
            
          }
          if (_this.logger) {
            _this.logger.action(selevent);
          }
          _this.state=_this.state.next(_this.context,selevent);
          if (! _this.state) {
            throw new Error("state is null!");
            
          }
          return selevent;
          
        } else {
          let bot=yield* _this.fiber$getBot(_thread, _this.state.player);
          
          let action = bot.play(_this.context,_this.state);
          
          if (_this.logger) {
            _this.logger.add("Player: "+_this.state.player);
            _this.logger.botStatus(bot);
            _this.logger.action(action);
            
          }
          _this.state=_this.state.next(_this.context,action);
          if (! _this.state) {
            throw new Error("state is null!");
            
          }
          return action;
          
        }
        
      },
      getBot :function _trc_GameMaster_getBot(p) {
        var _this=this;
        
        if (_this.context.bots&&_this.context.bots[p]) {
          return _this.context.bots[p];
        }
        throw new Error("Bot not found: "+p);
        
      },
      fiber$getBot :function* _trc_GameMaster_f_getBot(_thread,p) {
        var _this=this;
        
        if (_this.context.bots&&_this.context.bots[p]) {
          return _this.context.bots[p];
        }
        throw new Error("Bot not found: "+p);
        
        
      },
      gameover :function _trc_GameMaster_gameover() {
        var _this=this;
        
        return _this.state.gameover(_this.context);
      },
      fiber$gameover :function* _trc_GameMaster_f_gameover(_thread) {
        var _this=this;
        
        return _this.state.gameover(_this.context);
        
      },
      run :function _trc_GameMaster_run() {
        var _this=this;
        
        while (! _this.gameover()) {
          _this.step();
          _this.print(_this.state+"");
          
        }
      },
      fiber$run :function* _trc_GameMaster_f_run(_thread) {
        var _this=this;
        
        while (! _this.gameover()) {
          (yield* _this.fiber$step(_thread));
          _this.print(_this.state+"");
          
        }
        
      },
      __dummy: false
    };
  },
  decls: {"methods":{"main":{"nowait":false,"isMain":true,"vtype":{"params":[],"returnValue":null}},"onAppear":{"nowait":false,"isMain":false,"vtype":{"params":[],"returnValue":null}},"step":{"nowait":false,"isMain":false,"vtype":{"params":[],"returnValue":null}},"getBot":{"nowait":false,"isMain":false,"vtype":{"params":[null],"returnValue":null}},"gameover":{"nowait":false,"isMain":false,"vtype":{"params":[],"returnValue":null}},"run":{"nowait":false,"isMain":false,"vtype":{"params":[],"returnValue":null}}},"fields":{"state":{},"context":{},"logger":{},"Player":{}}}
});
Tonyu.klass.define({
  fullName: 'bot.Logger',
  shortName: 'Logger',
  namespace: 'bot',
  superclass: Tonyu.classes.kernel.Actor,
  includes: [],
  methods: function (__superClass) {
    return {
      main :function _trc_Logger_main() {
        var _this=this;
        
        
        
        
      },
      fiber$main :function* _trc_Logger_f_main(_thread) {
        var _this=this;
        
        
        
        
        
      },
      initialize :function _trc_Logger_initialize(params) {
        var _this=this;
        
        __superClass.apply( _this, [params]);
        _this.actCnt=1;
        let argvs = [...process.argv];
        
        argvs.shift();
        argvs.shift();
        argvs.shift();
        argvs.shift();
        if (! _this.logFile&&params.bots) {
          _this.logFile=_this.replSpecial(_this.formatDate(new Date())+"_"+params.bots[1]+"_vs_"+params.bots[2])+".txt";
          
        }
        _this.logFile=_this.logFile||_this.replSpecial(_this.formatDate(new Date())+argvs.join("_"))+".txt";
        _this.print("logFileName",_this.logFile);
        _this.logFile=_this.file(_this.logFile);
        if (_this.logFile.exists()) {
          let lp = /\[(\d+)\]Action:/;
          
          for (let [line] of Tonyu.iterator2(_this.logFile.lines(),1)) {
            let m = lp.exec(line);
            
            if (m) {
              _this.actCnt=m[1]-(- 1);
              
            }
            
          }
          _this.print("actCnt resumed :",_this.actCnt);
          
        } else {
          if (_this.replay&&_this.replay.linesRead&&_this.replay.actCnt) {
            _this.actCnt=_this.replay.actCnt;
            _this.logFile.text("Continue From:  "+_this.replay.logFile.path()+"\n"+_this.replay.linesRead.join("\n")+"\n");
            _this.add("Restart");
            
          }
        }
      },
      replSpecial :function _trc_Logger_replSpecial(f) {
        var _this=this;
        
        return f.replace(/[\s\/\\\:\?\*\<\>\|]/g,"_");
      },
      fiber$replSpecial :function* _trc_Logger_f_replSpecial(_thread,f) {
        var _this=this;
        
        return f.replace(/[\s\/\\\:\?\*\<\>\|]/g,"_");
        
      },
      formatDate :function _trc_Logger_formatDate(d) {
        var _this=this;
        
        if (! d) {
          d=new Date();
        }
        let p = (function anonymous_1158(n) {
          
          return ((10000+n)+"").substring(3,5);
        });
        
        return (1900+d.getYear())+"/"+p(d.getMonth()+1)+"/"+p(d.getDate())+" "+p(d.getHours())+":"+p(d.getMinutes())+":"+p(d.getSeconds());
      },
      fiber$formatDate :function* _trc_Logger_f_formatDate(_thread,d) {
        var _this=this;
        
        if (! d) {
          d=new Date();
        }
        let p = (function anonymous_1158(n) {
          
          return ((10000+n)+"").substring(3,5);
        });
        
        return (1900+d.getYear())+"/"+p(d.getMonth()+1)+"/"+p(d.getDate())+" "+p(d.getHours())+":"+p(d.getMinutes())+":"+p(d.getSeconds());
        
      },
      add :function _trc_Logger_add(line) {
        var _this=this;
        
        _this.logFile.appendText(_this.formatDate(new Date())+": "+line+"\n");
      },
      fiber$add :function* _trc_Logger_f_add(_thread,line) {
        var _this=this;
        
        _this.logFile.appendText(_this.formatDate(new Date())+": "+line+"\n");
        
      },
      action :function _trc_Logger_action(act) {
        var _this=this;
        
        act=Tonyu.globals.$JSON.stringify(act);
        _this.add(['[',_this.actCnt,']Action: ',act].join(''));
        _this.actCnt++;
      },
      fiber$action :function* _trc_Logger_f_action(_thread,act) {
        var _this=this;
        
        act=Tonyu.globals.$JSON.stringify(act);
        (yield* _this.fiber$add(_thread, ['[',_this.actCnt,']Action: ',act].join('')));
        _this.actCnt++;
        
      },
      botStatus :function _trc_Logger_botStatus(bot) {
        var _this=this;
        
        _this.add(['Bot: ITER=',bot.iterated,' EXP=',bot.expcount,' T/O=',bot.timeoutCount].join(''));
        let lastNode = bot.lastRootNode;
        
        let lastActions = bot.lastActions;
        
        if (lastNode&&lastActions) {
          let sn = [];
          
          for (let a = 0;
           a<lastNode.subnodes.length ; a++) {
            {
              let qc = bot.q(lastNode,a);
              
              sn.push({action: lastActions[a],qc: qc});
            }
          }
          sn.sort((function anonymous_1940(a,b) {
            
            return b.qc-a.qc;
          }));
          if (sn.length==0) {
            return _this;
          }
          let qnmax = sn[0].qc;
          
          let nz = sn.filter((function anonymous_2081(e) {
            
            return e.qc>0;
          }));
          
          let qnmin = nz.length&&nz[nz.length-1].qc;
          
          let qns = sn.map((function anonymous_2178(e) {
            
            return _this.floor(e.qc*1000)/1000;
          }));
          
          for (let i = qns.length-1;
           i>0 ; i--) {
            {
              let pi = i;
              
              i--;
              ;
              
              while(i>=0) {
                {
                  if (qns[i]!=qns[pi]) {
                    break;
                    
                  }
                }
                i--;
              }
              let len = pi-i;
              
              i++;
              if (len>1) {
                qns.splice(i,len,qns[i]+"*"+len);
                
              }
            }
          }
          _this.add("Qn: Max="+qnmax+" Min="+qnmin+" "+Tonyu.globals.$JSON.stringify(qns));
          
        }
      },
      fiber$botStatus :function* _trc_Logger_f_botStatus(_thread,bot) {
        var _this=this;
        
        (yield* _this.fiber$add(_thread, ['Bot: ITER=',bot.iterated,' EXP=',bot.expcount,' T/O=',bot.timeoutCount].join('')));
        let lastNode = bot.lastRootNode;
        
        let lastActions = bot.lastActions;
        
        if (lastNode&&lastActions) {
          let sn = [];
          
          for (let a = 0;
           a<lastNode.subnodes.length ; a++) {
            {
              let qc = bot.q(lastNode,a);
              
              sn.push({action: lastActions[a],qc: qc});
            }
          }
          sn.sort((function anonymous_1940(a,b) {
            
            return b.qc-a.qc;
          }));
          if (sn.length==0) {
            return _this;
          }
          let qnmax = sn[0].qc;
          
          let nz = sn.filter((function anonymous_2081(e) {
            
            return e.qc>0;
          }));
          
          let qnmin = nz.length&&nz[nz.length-1].qc;
          
          let qns = sn.map((function anonymous_2178(e) {
            
            return _this.floor(e.qc*1000)/1000;
          }));
          
          for (let i = qns.length-1;
           i>0 ; i--) {
            {
              let pi = i;
              
              i--;
              ;
              
              while(i>=0) {
                {
                  if (qns[i]!=qns[pi]) {
                    break;
                    
                  }
                }
                i--;
              }
              let len = pi-i;
              
              i++;
              if (len>1) {
                qns.splice(i,len,qns[i]+"*"+len);
                
              }
            }
          }
          (yield* _this.fiber$add(_thread, "Qn: Max="+qnmax+" Min="+qnmin+" "+Tonyu.globals.$JSON.stringify(qns)));
          
        }
        
      },
      argv :function _trc_Logger_argv() {
        var _this=this;
        
        _this.add("argv: "+process.argv.join(" "));
      },
      fiber$argv :function* _trc_Logger_f_argv(_thread) {
        var _this=this;
        
        (yield* _this.fiber$add(_thread, "argv: "+process.argv.join(" ")));
        
      },
      __dummy: false
    };
  },
  decls: {"methods":{"main":{"nowait":false,"isMain":true,"vtype":{"params":[],"returnValue":null}},"new":{"nowait":false,"isMain":false,"vtype":{"params":[null],"returnValue":null}},"replSpecial":{"nowait":false,"isMain":false,"vtype":{"params":[null],"returnValue":null}},"formatDate":{"nowait":false,"isMain":false,"vtype":{"params":[null],"returnValue":null}},"add":{"nowait":false,"isMain":false,"vtype":{"params":[null],"returnValue":null}},"action":{"nowait":false,"isMain":false,"vtype":{"params":[null],"returnValue":null}},"botStatus":{"nowait":false,"isMain":false,"vtype":{"params":[null],"returnValue":null}},"argv":{"nowait":false,"isMain":false,"vtype":{"params":[],"returnValue":null}}},"fields":{"logFile":{},"actCnt":{},"replay":{}}}
});
Tonyu.klass.define({
  fullName: 'bot.MCTSBot',
  shortName: 'MCTSBot',
  namespace: 'bot',
  superclass: Tonyu.classes.bot.Bot,
  includes: [],
  methods: function (__superClass) {
    return {
      main :function _trc_MCTSBot_main() {
        var _this=this;
        
        
        
        
        
        
        
        
        _this.timeoutCount = 0;
        
        _this.expcount = 0;
        
        _this.iterated = 0;
        
        
      },
      fiber$main :function* _trc_MCTSBot_f_main(_thread) {
        var _this=this;
        
        
        
        
        
        
        
        
        _this.timeoutCount = 0;
        
        _this.expcount = 0;
        
        _this.iterated = 0;
        
        
        
      },
      toString :function _trc_MCTSBot_toString() {
        var _this=this;
        
        return ['mcts_',_this.iteration,'_',_this.timeout].join('');
      },
      fiber$toString :function* _trc_MCTSBot_f_toString(_thread) {
        var _this=this;
        
        return ['mcts_',_this.iteration,'_',_this.timeout].join('');
        
      },
      initNodeValues :function _trc_MCTSBot_initNodeValues(ctx,state) {
        var _this=this;
        
        let actions = state.actionsEvents(ctx);
        
        if (state.nextIsEvent(ctx)) {
          return actions.map((function anonymous_721() {
            
            return {q: new Tonyu.classes.bot.Rational(0,0),n: _this.expandThresh};
          }));
          
        }
        return actions.map((function anonymous_801() {
          
          return {q: new Tonyu.classes.bot.Rational(0,0),n: _this.rnd()};
        }));
      },
      fiber$initNodeValues :function* _trc_MCTSBot_f_initNodeValues(_thread,ctx,state) {
        var _this=this;
        
        let actions = state.actionsEvents(ctx);
        
        if (state.nextIsEvent(ctx)) {
          return actions.map((function anonymous_721() {
            
            return {q: new Tonyu.classes.bot.Rational(0,0),n: _this.expandThresh};
          }));
          
        }
        return actions.map((function anonymous_801() {
          
          return {q: new Tonyu.classes.bot.Rational(0,0),n: _this.rnd()};
        }));
        
      },
      expand :function _trc_MCTSBot_expand(ctx,node) {
        var _this=this;
        
        if (node.n<_this.expandThresh) {
          throw new Error(node.n+"<"+_this.expandThresh);
          
        }
        let s = _this.getState(ctx,node);
        
        if (node.subnodes) {
          throw new Error(s+" already expanded");
          
        }
        let vals = _this.initNodeValues(ctx,s);
        
        node.subnodes=vals.map((function anonymous_1248(r,i) {
          
          let res = {parent: node,q: r.q,n: r.n,subnodes: null};
          
          if (r.disabled) {
            res.disabled=true;
          }
          return res;
        }));
        _this.expcount++;
        return node;
      },
      fiber$expand :function* _trc_MCTSBot_f_expand(_thread,ctx,node) {
        var _this=this;
        
        if (node.n<_this.expandThresh) {
          throw new Error(node.n+"<"+_this.expandThresh);
          
        }
        let s=yield* _this.fiber$getState(_thread, ctx, node);
        
        if (node.subnodes) {
          throw new Error(s+" already expanded");
          
        }
        let vals=yield* _this.fiber$initNodeValues(_thread, ctx, s);
        
        node.subnodes=vals.map((function anonymous_1248(r,i) {
          
          let res = {parent: node,q: r.q,n: r.n,subnodes: null};
          
          if (r.disabled) {
            res.disabled=true;
          }
          return res;
        }));
        _this.expcount++;
        return node;
        
      },
      str :function _trc_MCTSBot_str(s) {
        var _this=this;
        var r;
        
        r = s+"";
        
        if (r=="[object Object]") {
          return s;
        }
        return r;
      },
      fiber$str :function* _trc_MCTSBot_f_str(_thread,s) {
        var _this=this;
        var r;
        
        r = s+"";
        
        if (r=="[object Object]") {
          return s;
        }
        return r;
        
      },
      c :function _trc_MCTSBot_c(node,a) {
        var _this=this;
        var nsa;
        var _n;
        
        nsa = _this.n(node,a);
        
        _n = _this.n(node);
        
        if (nsa<1||_n<1) {
          return 1000000+_n;
        }
        return _this.nanc(_this.Cp*_this.sqrt(2*Tonyu.globals.$Math.log(_n))/nsa);
      },
      fiber$c :function* _trc_MCTSBot_f_c(_thread,node,a) {
        var _this=this;
        var nsa;
        var _n;
        
        nsa=yield* _this.fiber$n(_thread, node, a);
        
        _n=yield* _this.fiber$n(_thread, node);
        
        if (nsa<1||_n<1) {
          return 1000000+_n;
        }
        return yield* _this.fiber$nanc(_thread, _this.Cp*_this.sqrt(2*Tonyu.globals.$Math.log(_n))/nsa);
        
        
      },
      q :function _trc_MCTSBot_q(node,a) {
        var _this=this;
        
        if (a==null) {
          return node.q.value;
          
        } else {
          if (! node.subnodes) {
            throw new Error("Not expanded");
            
          }
          return node.subnodes[a].q.value;
          
        }
      },
      fiber$q :function* _trc_MCTSBot_f_q(_thread,node,a) {
        var _this=this;
        
        if (a==null) {
          return node.q.value;
          
        } else {
          if (! node.subnodes) {
            throw new Error("Not expanded");
            
          }
          return node.subnodes[a].q.value;
          
        }
        
      },
      n :function _trc_MCTSBot_n(node,a) {
        var _this=this;
        
        if (a==null) {
          return _this.nanc(node.n);
          
        } else {
          if (! node.subnodes) {
            throw new Error("Not expanded");
            
          }
          return _this.nanc(node.subnodes[a].n);
          
        }
      },
      fiber$n :function* _trc_MCTSBot_f_n(_thread,node,a) {
        var _this=this;
        
        if (a==null) {
          return yield* _this.fiber$nanc(_thread, node.n);
          
          
        } else {
          if (! node.subnodes) {
            throw new Error("Not expanded");
            
          }
          return yield* _this.fiber$nanc(_thread, node.subnodes[a].n);
          
          
        }
        
      },
      selection :function _trc_MCTSBot_selection(ctx,node) {
        var _this=this;
        var acts;
        var sgn;
        var ma;
        var mqc;
        var test;
        var a;
        var qc;
        
        if (! node.subnodes) {
          throw new Error(_this.getState(ctx,Tonyu.bindFunc(_this,_this.n))+"Not expanded");
          
        }
        while (true) {
          acts = node.subnodes;
          
          let state = _this.getState(ctx,node);
          
          sgn = (state.player===_this.player?1:- 1);
          
          node.n+=1;
          if (! acts||acts.length==0) {
            break;
            
          }
          ma = - 1;
          mqc = 0;
          
          for (a = 0;
           a<acts.length ; a++) {
            {
              if (acts[a].disabled) {
                continue;
                
              }
              qc = _this.q(node,a)*sgn+_this.c(node,a);
              
              if (ma<0||qc>=mqc) {
                mqc=qc;
                ma=a;
                
              }
            }
          }
          node=acts[ma];
          if (! node) {
            throw new Error(['Node null ',ma].join(''));
            
          }
          
        }
        return node;
      },
      fiber$selection :function* _trc_MCTSBot_f_selection(_thread,ctx,node) {
        var _this=this;
        var acts;
        var sgn;
        var ma;
        var mqc;
        var test;
        var a;
        var qc;
        
        if (! node.subnodes) {
          throw new Error(_this.getState(ctx,Tonyu.bindFunc(_this,_this.n))+"Not expanded");
          
        }
        while (true) {
          acts = node.subnodes;
          
          let state=yield* _this.fiber$getState(_thread, ctx, node);
          
          sgn = (state.player===_this.player?1:- 1);
          
          node.n+=1;
          if (! acts||acts.length==0) {
            break;
            
          }
          ma = - 1;
          mqc = 0;
          
          for (a = 0;
           a<acts.length ; a++) {
            {
              if (acts[a].disabled) {
                continue;
                
              }
              qc = _this.q(node,a)*sgn+_this.c(node,a);
              
              if (ma<0||qc>=mqc) {
                mqc=qc;
                ma=a;
                
              }
            }
          }
          node=acts[ma];
          if (! node) {
            throw new Error(['Node null ',ma].join(''));
            
          }
          
        }
        return node;
        
      },
      depth :function _trc_MCTSBot_depth(node) {
        var _this=this;
        
        let res = 0;
        
        while (node) {
          node=node.parent;
          res++;
          
        }
        return res;
      },
      fiber$depth :function* _trc_MCTSBot_f_depth(_thread,node) {
        var _this=this;
        
        let res = 0;
        
        while (node) {
          node=node.parent;
          res++;
          
        }
        return res;
        
      },
      play :function _trc_MCTSBot_play(ctx,s) {
        var _this=this;
        var rootNode;
        var i;
        var endState;
        var v;
        var ma;
        var mqc;
        var a;
        var qc;
        var acts;
        
        if (! _this.os&&typeof  require==="function") {
          _this.os=require("os");
          
        }
        let memlim = 1*1000*1000*1000;
        
        _this.expcount=0;
        _this.lastRootNode=null;
        _this.timeoutCount=0;
        rootNode = {parent: null,state: s,q: new Tonyu.classes.bot.Rational(0,0),n: _this.expandThresh+1,subnodes: null};
        
        _this.player=s.player;
        _this.nanc(_this.expandThresh);
        _this.expand(ctx,rootNode);
        _this.iterated=0;
        let stime = performance.now();
        
        if (typeof  gc==="function") {
          let mu = process.memoryUsage();
          
          gc();
          let mu2 = process.memoryUsage();
          
          _this.print("GC : "+mu.heapUsed+"/"+mu.heapTotal+" -> "+mu2.heapUsed+"/"+mu2.heapTotal);
          
        }
        let mu;
        for (i = 0;
         i<_this.iteration ; i++) {
          {
            let leaf;
            let expRecur = 0;
            
            let mem;
            while (true) {
              leaf=_this.selection(ctx,rootNode);
              mu=process.memoryUsage();
              let memAvail = (mu.heapUsed<memlim);
              
              if (! memAvail) {
                break;
                
              }
              if (_this.n(leaf)<_this.expandThresh) {
                break;
                
              }
              if (leaf.subnodes&&leaf.subnodes.length==0) {
                break;
                
              }
              _this.expand(ctx,leaf);
              expRecur++;
              
            }
            _this.iterated++;
            if (performance.now()-stime>3000) {
              let ap = _this.actionPath(ctx,leaf);
              
              _this.print("Progress: iter=",_this.iterated," exp=",_this.expcount," Mem= "+(mu&&mu.heapUsed+"/"+mu.heapTotal)+" Path= "+ap.map((function anonymous_5040(a) {
                
                return Tonyu.globals.$JSON.stringify(a);
              })).join("->"));
              stime+=3000;
              
            }
            endState = _this.rollout(ctx,leaf,_this.timeout);
            
            v = _this.value(ctx,s.player,endState);
            
            _this.backup(leaf,v);
          }
        }
        ma = - 1;
        mqc = 0;
        
        for (a = 0;
         a<rootNode.subnodes.length ; a++) {
          {
            qc = _this.q(rootNode,a);
            
            if (ma<0||qc>=mqc) {
              mqc=qc;
              ma=a;
              
            }
          }
        }
        acts = s.actionsEvents(ctx);
        
        if (! acts[ma]) {
          throw new Error("Action not found "+ma);
          
        }
        _this.print("EXP",_this.expcount," TO",_this.timeoutCount);
        _this.lastRootNode=rootNode;
        _this.lastActions=acts;
        return acts[ma];
      },
      fiber$play :function* _trc_MCTSBot_f_play(_thread,ctx,s) {
        var _this=this;
        var rootNode;
        var i;
        var endState;
        var v;
        var ma;
        var mqc;
        var a;
        var qc;
        var acts;
        
        if (! _this.os&&typeof  require==="function") {
          _this.os=require("os");
          
        }
        let memlim = 1*1000*1000*1000;
        
        _this.expcount=0;
        _this.lastRootNode=null;
        _this.timeoutCount=0;
        rootNode = {parent: null,state: s,q: new Tonyu.classes.bot.Rational(0,0),n: _this.expandThresh+1,subnodes: null};
        
        _this.player=s.player;
        (yield* _this.fiber$nanc(_thread, _this.expandThresh));
        (yield* _this.fiber$expand(_thread, ctx, rootNode));
        _this.iterated=0;
        let stime = performance.now();
        
        if (typeof  gc==="function") {
          let mu = process.memoryUsage();
          
          gc();
          let mu2 = process.memoryUsage();
          
          _this.print("GC : "+mu.heapUsed+"/"+mu.heapTotal+" -> "+mu2.heapUsed+"/"+mu2.heapTotal);
          
        }
        let mu;
        for (i = 0;
         i<_this.iteration ; i++) {
          {
            let leaf;
            let expRecur = 0;
            
            let mem;
            while (true) {
              leaf=(yield* _this.fiber$selection(_thread, ctx, rootNode));
              mu=process.memoryUsage();
              let memAvail = (mu.heapUsed<memlim);
              
              if (! memAvail) {
                break;
                
              }
              if (_this.n(leaf)<_this.expandThresh) {
                break;
                
              }
              if (leaf.subnodes&&leaf.subnodes.length==0) {
                break;
                
              }
              (yield* _this.fiber$expand(_thread, ctx, leaf));
              expRecur++;
              
            }
            _this.iterated++;
            if (performance.now()-stime>3000) {
              let ap=yield* _this.fiber$actionPath(_thread, ctx, leaf);
              
              _this.print("Progress: iter=",_this.iterated," exp=",_this.expcount," Mem= "+(mu&&mu.heapUsed+"/"+mu.heapTotal)+" Path= "+ap.map((function anonymous_5040(a) {
                
                return Tonyu.globals.$JSON.stringify(a);
              })).join("->"));
              stime+=3000;
              
            }
            endState=yield* _this.fiber$rollout(_thread, ctx, leaf, _this.timeout);
            
            v = _this.value(ctx,s.player,endState);
            
            (yield* _this.fiber$backup(_thread, leaf, v));
          }
        }
        ma = - 1;
        mqc = 0;
        
        for (a = 0;
         a<rootNode.subnodes.length ; a++) {
          {
            qc=yield* _this.fiber$q(_thread, rootNode, a);
            
            if (ma<0||qc>=mqc) {
              mqc=qc;
              ma=a;
              
            }
          }
        }
        acts = s.actionsEvents(ctx);
        
        if (! acts[ma]) {
          throw new Error("Action not found "+ma);
          
        }
        _this.print("EXP",_this.expcount," TO",_this.timeoutCount);
        _this.lastRootNode=rootNode;
        _this.lastActions=acts;
        return acts[ma];
        
      },
      backup :function _trc_MCTSBot_backup(node,value) {
        var _this=this;
        
        while (node) {
          node.q=node.q.inc(value);
          node=node.parent;
          
        }
      },
      fiber$backup :function* _trc_MCTSBot_f_backup(_thread,node,value) {
        var _this=this;
        
        while (node) {
          node.q=node.q.inc(value);
          node=node.parent;
          
        }
        
      },
      rollout :function _trc_MCTSBot_rollout(ctx,node,timeout) {
        var _this=this;
        var state;
        var t;
        var a;
        
        state = _this.getState(ctx,node);
        
        t = new Date().getTime();
        
        while (! state.gameover(ctx)) {
          a = _this.playRandom(ctx,state);
          
          state=state.next(ctx,a);
          if (new Date().getTime()-t>timeout) {
            _this.timeoutCount++;
            break;
            
            
          }
          
        }
        return state;
      },
      fiber$rollout :function* _trc_MCTSBot_f_rollout(_thread,ctx,node,timeout) {
        var _this=this;
        var state;
        var t;
        var a;
        
        state=yield* _this.fiber$getState(_thread, ctx, node);
        
        t = new Date().getTime();
        
        while (! state.gameover(ctx)) {
          a=yield* _this.fiber$playRandom(_thread, ctx, state);
          
          state=state.next(ctx,a);
          if (new Date().getTime()-t>timeout) {
            _this.timeoutCount++;
            break;
            
            
          }
          
        }
        return state;
        
      },
      actionPath :function _trc_MCTSBot_actionPath(ctx,n) {
        var _this=this;
        
        let nodePath = [];
        
        for (let nn = n;
         nn ; nn=nn.parent) {
          nodePath=[nn,...nodePath];
        }
        let res = [];
        
        for (let i = 0;
         i<nodePath.length-1 ; i++) {
          {
            let pn = nodePath[i];
            let cn = nodePath[i+1];
            
            let s = _this.getState(ctx,pn);
            
            let acts = s.actionsEvents(ctx);
            
            let idx = pn.subnodes.indexOf(cn);
            
            if (idx<0) {
              throw new Error("Invalid path ");
              
            }
            res.push(acts[idx]);
          }
        }
        return res;
      },
      fiber$actionPath :function* _trc_MCTSBot_f_actionPath(_thread,ctx,n) {
        var _this=this;
        
        let nodePath = [];
        
        for (let nn = n;
         nn ; nn=nn.parent) {
          nodePath=[nn,...nodePath];
        }
        let res = [];
        
        for (let i = 0;
         i<nodePath.length-1 ; i++) {
          {
            let pn = nodePath[i];
            let cn = nodePath[i+1];
            
            let s=yield* _this.fiber$getState(_thread, ctx, pn);
            
            let acts = s.actionsEvents(ctx);
            
            let idx = pn.subnodes.indexOf(cn);
            
            if (idx<0) {
              throw new Error("Invalid path ");
              
            }
            res.push(acts[idx]);
          }
        }
        return res;
        
      },
      getState :function _trc_MCTSBot_getState(ctx,node) {
        var _this=this;
        var p;
        var idx;
        
        p = node.parent;
        
        if (! p) {
          if (! node.state) {
            throw new Error("Root not should have state");
            
          }
          return node.state;
          
        }
        idx = p.subnodes.indexOf(node);
        
        if (idx<0) {
          throw new Error("Index not found");
          
        }
        let ps = _this.getState(ctx,p);
        
        let acts = ps.actionsEvents(ctx);
        
        let res = ps.next(ctx,acts[idx]);
        
        return res;
      },
      fiber$getState :function* _trc_MCTSBot_f_getState(_thread,ctx,node) {
        var _this=this;
        var p;
        var idx;
        
        p = node.parent;
        
        if (! p) {
          if (! node.state) {
            throw new Error("Root not should have state");
            
          }
          return node.state;
          
        }
        idx = p.subnodes.indexOf(node);
        
        if (idx<0) {
          throw new Error("Index not found");
          
        }
        let ps=yield* _this.fiber$getState(_thread, ctx, p);
        
        let acts = ps.actionsEvents(ctx);
        
        let res = ps.next(ctx,acts[idx]);
        
        return res;
        
      },
      playRandom :function _trc_MCTSBot_playRandom(ctx,s) {
        var _this=this;
        var acts;
        var a;
        
        if (! ctx) {
          throw new Error("CTX is null");
          
        }
        acts = s.actionsEvents(ctx);
        
        a = acts[_this.rnd(acts.length)];
        
        return a;
      },
      fiber$playRandom :function* _trc_MCTSBot_f_playRandom(_thread,ctx,s) {
        var _this=this;
        var acts;
        var a;
        
        if (! ctx) {
          throw new Error("CTX is null");
          
        }
        acts = s.actionsEvents(ctx);
        
        a = acts[_this.rnd(acts.length)];
        
        return a;
        
      },
      nanc :function _trc_MCTSBot_nanc(v) {
        var _this=this;
        
        if (typeof  v!=="number") {
          throw new Error("null");
          
        }
        if (v!==v) {
          throw new Error("Nan");
          
        }
        return v;
      },
      fiber$nanc :function* _trc_MCTSBot_f_nanc(_thread,v) {
        var _this=this;
        
        if (typeof  v!=="number") {
          throw new Error("null");
          
        }
        if (v!==v) {
          throw new Error("Nan");
          
        }
        return v;
        
      },
      __dummy: false
    };
  },
  decls: {"methods":{"main":{"nowait":false,"isMain":true,"vtype":{"params":[],"returnValue":null}},"toString":{"nowait":false,"isMain":false,"vtype":{"params":[],"returnValue":null}},"initNodeValues":{"nowait":false,"isMain":false,"vtype":{"params":[null,null],"returnValue":null}},"expand":{"nowait":false,"isMain":false,"vtype":{"params":["bot.Context",null],"returnValue":null}},"str":{"nowait":false,"isMain":false,"vtype":{"params":[null],"returnValue":null}},"c":{"nowait":false,"isMain":false,"vtype":{"params":[null,"Number"],"returnValue":null}},"q":{"nowait":false,"isMain":false,"vtype":{"params":[null,"Number"],"returnValue":null}},"n":{"nowait":false,"isMain":false,"vtype":{"params":[null,"Number"],"returnValue":null}},"selection":{"nowait":false,"isMain":false,"vtype":{"params":["bot.Context",null],"returnValue":null}},"depth":{"nowait":false,"isMain":false,"vtype":{"params":[null],"returnValue":null}},"play":{"nowait":false,"isMain":false,"vtype":{"params":["bot.Context","bot.State"],"returnValue":"bot.Action"}},"backup":{"nowait":false,"isMain":false,"vtype":{"params":[null,"Number"],"returnValue":null}},"rollout":{"nowait":false,"isMain":false,"vtype":{"params":[null,null,null],"returnValue":null}},"actionPath":{"nowait":false,"isMain":false,"vtype":{"params":[null,null],"returnValue":null}},"getState":{"nowait":false,"isMain":false,"vtype":{"params":[null,null],"returnValue":null}},"playRandom":{"nowait":false,"isMain":false,"vtype":{"params":["bot.Context","bot.State"],"returnValue":"bot.Action"}},"nanc":{"nowait":false,"isMain":false,"vtype":{"params":[null],"returnValue":null}}},"fields":{"Cp":{},"expandThresh":{},"value":{},"iteration":{},"player":{},"timeout":{},"lastRootNode":{},"lastActions":{},"timeoutCount":{},"expcount":{},"iterated":{},"os":{}}}
});
Tonyu.klass.define({
  fullName: 'bot.RandomBot',
  shortName: 'RandomBot',
  namespace: 'bot',
  superclass: Tonyu.classes.bot.Bot,
  includes: [],
  methods: function (__superClass) {
    return {
      main :function _trc_RandomBot_main() {
        var _this=this;
        
      },
      fiber$main :function* _trc_RandomBot_f_main(_thread) {
        var _this=this;
        
        
      },
      play :function _trc_RandomBot_play(ctx,s) {
        var _this=this;
        var acts;
        var a;
        
        if (! ctx) {
          throw new Error("CTX is null");
          
        }
        acts = s.actionsEvents(ctx);
        
        a = acts[_this.rnd(acts.length)];
        
        return a;
      },
      fiber$play :function* _trc_RandomBot_f_play(_thread,ctx,s) {
        var _this=this;
        var acts;
        var a;
        
        if (! ctx) {
          throw new Error("CTX is null");
          
        }
        acts = s.actionsEvents(ctx);
        
        a = acts[_this.rnd(acts.length)];
        
        return a;
        
      },
      __dummy: false
    };
  },
  decls: {"methods":{"main":{"nowait":false,"isMain":true,"vtype":{"params":[],"returnValue":null}},"play":{"nowait":false,"isMain":false,"vtype":{"params":["bot.Context","bot.State"],"returnValue":"bot.Action"}}},"fields":{}}
});
Tonyu.klass.define({
  fullName: 'bot.Rational',
  shortName: 'Rational',
  namespace: 'bot',
  superclass: Tonyu.classes.kernel.TObject,
  includes: [],
  methods: function (__superClass) {
    return {
      main :function _trc_Rational_main() {
        var _this=this;
        
        
      },
      fiber$main :function* _trc_Rational_f_main(_thread) {
        var _this=this;
        
        
        
      },
      initialize :function _trc_Rational_initialize(q,n) {
        var _this=this;
        
        _this.q=q;
        _this.n=n;
      },
      inc :function _trc_Rational_inc(qby) {
        var _this=this;
        
        return new Tonyu.classes.bot.Rational(_this.q+qby,_this.n+1);
      },
      fiber$inc :function* _trc_Rational_f_inc(_thread,qby) {
        var _this=this;
        
        return new Tonyu.classes.bot.Rational(_this.q+qby,_this.n+1);
        
      },
      __getter__value :function _trc_Rational___getter__value() {
        var _this=this;
        
        if (_this.n==0) {
          return 0;
        }
        return _this.nanc(_this.q/_this.n);
      },
      nanc :function _trc_Rational_nanc(v) {
        var _this=this;
        
        if (v!==v) {
          throw new Error(_this.q+" / "+_this.n);
          
        }
        return v;
      },
      fiber$nanc :function* _trc_Rational_f_nanc(_thread,v) {
        var _this=this;
        
        if (v!==v) {
          throw new Error(_this.q+" / "+_this.n);
          
        }
        return v;
        
      },
      toString :function _trc_Rational_toString() {
        var _this=this;
        
        return _this.q+"/"+_this.n;
      },
      fiber$toString :function* _trc_Rational_f_toString(_thread) {
        var _this=this;
        
        return _this.q+"/"+_this.n;
        
      },
      __dummy: false
    };
  },
  decls: {"methods":{"main":{"nowait":false,"isMain":true,"vtype":{"params":[],"returnValue":null}},"new":{"nowait":false,"isMain":false,"vtype":{"params":[null,null],"returnValue":null}},"inc":{"nowait":false,"isMain":false,"vtype":{"params":["Number"],"returnValue":null}},"__getter__value":{"nowait":true,"isMain":false,"vtype":{"params":[],"returnValue":null}},"nanc":{"nowait":false,"isMain":false,"vtype":{"params":[null],"returnValue":null}},"toString":{"nowait":false,"isMain":false,"vtype":{"params":[],"returnValue":null}}},"fields":{"q":{},"n":{}}}
});
Tonyu.klass.define({
  fullName: 'bot.Replay',
  shortName: 'Replay',
  namespace: 'bot',
  superclass: Tonyu.classes.kernel.Actor,
  includes: [],
  methods: function (__superClass) {
    return {
      main :function _trc_Replay_main() {
        var _this=this;
        
        
        
        
        
        
        
      },
      fiber$main :function* _trc_Replay_f_main(_thread) {
        var _this=this;
        
        
        
        
        
        
        
        
      },
      initialize :function _trc_Replay_initialize(params) {
        var _this=this;
        
        __superClass.apply( _this, [params]);
        _this.logFile=_this.file(_this.logFile);
        _this.lines=_this.logFile.lines();
        _this.linesRead=[];
        _this.actCnt=1;
      },
      step :function _trc_Replay_step() {
        var _this=this;
        
        let pat = /Action:(.*)/;
        
        while (true) {
          let r = _this.lines.shift();
          
          _this.linesRead.push(r);
          if (! r) {
            return false;
          }
          let m = pat.exec(r);
          
          if (! m) {
            continue;
            
          }
          _this.actCnt++;
          let a = Tonyu.globals.$JSON.parse(m[1]);
          
          _this.state=_this.state.next(_this.context,a);
          return true;
          
        }
      },
      fiber$step :function* _trc_Replay_f_step(_thread) {
        var _this=this;
        
        let pat = /Action:(.*)/;
        
        while (true) {
          let r = _this.lines.shift();
          
          _this.linesRead.push(r);
          if (! r) {
            return false;
          }
          let m = pat.exec(r);
          
          if (! m) {
            continue;
            
          }
          _this.actCnt++;
          let a = Tonyu.globals.$JSON.parse(m[1]);
          
          _this.state=_this.state.next(_this.context,a);
          return true;
          
        }
        
      },
      dump :function _trc_Replay_dump(bot) {
        var _this=this;
        
        _this.print(_this.play1(bot));
      },
      fiber$dump :function* _trc_Replay_f_dump(_thread,bot) {
        var _this=this;
        
        _this.print(_this.play1(bot));
        
      },
      play1 :function _trc_Replay_play1(bot) {
        var _this=this;
        
        bot.play(_this.context,_this.state);
        let lastNode = bot.lastRootNode;
        
        let lastActions = bot.lastActions;
        
        if (lastNode&&lastActions) {
          let sns = [];
          
          for (let a = 0;
           a<lastNode.subnodes.length ; a++) {
            {
              let qc = bot.q(lastNode,a);
              
              let sn = lastNode.subnodes[a];
              
              sns.push({action: lastActions[a],qc: qc});
            }
          }
          sns.sort((function anonymous_1045(a,b) {
            
            return b.qc-a.qc;
          }));
          return sns;
          
        }
        return null;
      },
      fiber$play1 :function* _trc_Replay_f_play1(_thread,bot) {
        var _this=this;
        
        bot.play(_this.context,_this.state);
        let lastNode = bot.lastRootNode;
        
        let lastActions = bot.lastActions;
        
        if (lastNode&&lastActions) {
          let sns = [];
          
          for (let a = 0;
           a<lastNode.subnodes.length ; a++) {
            {
              let qc = bot.q(lastNode,a);
              
              let sn = lastNode.subnodes[a];
              
              sns.push({action: lastActions[a],qc: qc});
            }
          }
          sns.sort((function anonymous_1045(a,b) {
            
            return b.qc-a.qc;
          }));
          return sns;
          
        }
        return null;
        
      },
      __dummy: false
    };
  },
  decls: {"methods":{"main":{"nowait":false,"isMain":true,"vtype":{"params":[],"returnValue":null}},"new":{"nowait":false,"isMain":false,"vtype":{"params":[null],"returnValue":null}},"step":{"nowait":false,"isMain":false,"vtype":{"params":[],"returnValue":"Boolean"}},"dump":{"nowait":false,"isMain":false,"vtype":{"params":[null],"returnValue":null}},"play1":{"nowait":false,"isMain":false,"vtype":{"params":[null],"returnValue":null}}},"fields":{"logFle":{},"state":{},"context":{},"lines":{},"linesRead":{},"actCnt":{},"logFile":{}}}
});
Tonyu.klass.define({
  fullName: 'bot.State',
  shortName: 'State',
  namespace: 'bot',
  superclass: Tonyu.classes.kernel.TObject,
  includes: [Tonyu.classes.kernel.EventMod],
  methods: function (__superClass) {
    return {
      main :function _trc_State_main() {
        var _this=this;
        
        
      },
      fiber$main :function* _trc_State_f_main(_thread) {
        var _this=this;
        
        
        
      },
      print :function _trc_State_print(p) {
        var _this=this;
        var cp;
        
        cp = Tonyu.globals.$consolePanel;
        
        console.log.apply(console,arguments);
      },
      fiber$print :function* _trc_State_f_print(_thread,p) {
        var _this=this;
        var _arguments=Tonyu.A(arguments);
        var cp;
        
        cp = Tonyu.globals.$consolePanel;
        
        console.log.apply(console,_arguments);
        
      },
      next :function _trc_State_next(ctx,a) {
        var _this=this;
        
        throw new Error("Abstract: メソッドnextが実装されていません");
        
      },
      fiber$next :function* _trc_State_f_next(_thread,ctx,a) {
        var _this=this;
        
        throw new Error("Abstract: メソッドnextが実装されていません");
        
        
      },
      actionsEvents :function _trc_State_actionsEvents(ctx) {
        var _this=this;
        
        throw new Error("Abstract: メソッドactionsEventsが実装されていません");
        
      },
      fiber$actionsEvents :function* _trc_State_f_actionsEvents(_thread,ctx) {
        var _this=this;
        
        throw new Error("Abstract: メソッドactionsEventsが実装されていません");
        
        
      },
      gameover :function _trc_State_gameover(ctx) {
        var _this=this;
        
        return _this.actionsEvents(ctx).length==0;
      },
      fiber$gameover :function* _trc_State_f_gameover(_thread,ctx) {
        var _this=this;
        
        return _this.actionsEvents(ctx).length==0;
        
      },
      id :function _trc_State_id(ctx) {
        var _this=this;
        
        throw new Error("Abstract: メソッドidが実装されていません");
        
      },
      fiber$id :function* _trc_State_f_id(_thread,ctx) {
        var _this=this;
        
        throw new Error("Abstract: メソッドidが実装されていません");
        
        
      },
      playerIndex :function _trc_State_playerIndex(ctx,p) {
        var _this=this;
        
        return ctx.players.indexOf(p);
      },
      fiber$playerIndex :function* _trc_State_f_playerIndex(_thread,ctx,p) {
        var _this=this;
        
        return ctx.players.indexOf(p);
        
      },
      nextIsEvent :function _trc_State_nextIsEvent(ctx) {
        var _this=this;
        
        return false;
      },
      fiber$nextIsEvent :function* _trc_State_f_nextIsEvent(_thread,ctx) {
        var _this=this;
        
        return false;
        
      },
      __dummy: false
    };
  },
  decls: {"methods":{"main":{"nowait":false,"isMain":true,"vtype":{"params":[],"returnValue":null}},"print":{"nowait":false,"isMain":false,"vtype":{"params":[null],"returnValue":null}},"next":{"nowait":false,"isMain":false,"vtype":{"params":["bot.Context","bot.Action"],"returnValue":"bot.State"}},"actionsEvents":{"nowait":false,"isMain":false,"vtype":{"params":["bot.Context"],"returnValue":null}},"gameover":{"nowait":false,"isMain":false,"vtype":{"params":["bot.Context"],"returnValue":null}},"id":{"nowait":false,"isMain":false,"vtype":{"params":[null],"returnValue":null}},"playerIndex":{"nowait":false,"isMain":false,"vtype":{"params":[null,null],"returnValue":null}},"nextIsEvent":{"nowait":false,"isMain":false,"vtype":{"params":["bot.Context"],"returnValue":null}}},"fields":{"player":{},"Player":{}}}
});

});

//# sourceMappingURL=concat.js.map