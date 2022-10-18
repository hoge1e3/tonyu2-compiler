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
        //var _arguments=Tonyu.A(arguments);
        
        
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
        //var _arguments=Tonyu.A(arguments);
        
        
      },
      play :function _trc_Bot_play(ctx,s) {
        var _this=this;
        
        throw new Error("Abstract: メソッドplayが実装されていません");
        
      },
      fiber$play :function* _trc_Bot_f_play(_thread,ctx,s) {
        var _this=this;
        //var _arguments=Tonyu.A(arguments);
        
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
        //var _arguments=Tonyu.A(arguments);
        
        
        
        
        
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
        //var _arguments=Tonyu.A(arguments);
        
        
        
        
        
      },
      onAppear :function _trc_GameMaster_onAppear() {
        var _this=this;
        
      },
      fiber$onAppear :function* _trc_GameMaster_f_onAppear(_thread) {
        var _this=this;
        //var _arguments=Tonyu.A(arguments);
        
        
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
        //var _arguments=Tonyu.A(arguments);
        
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
        //var _arguments=Tonyu.A(arguments);
        
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
        //var _arguments=Tonyu.A(arguments);
        
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
        //var _arguments=Tonyu.A(arguments);
        
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
        //var _arguments=Tonyu.A(arguments);
        
        
        
        
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
        _this.logFile=_this.logFile||(_this.formatDate(new Date())+argvs.join("_")).replace(/[\s\/\\\:\?\*\<\>\|]/g,"_")+".txt";
        _this.print("logFileName",_this.logFile);
        _this.logFile=_this.file(_this.logFile);
      },
      formatDate :function _trc_Logger_formatDate(d) {
        var _this=this;
        
        let p = (function anonymous_414(n) {
          
          return ((10000+n)+"").substring(3,5);
        });
        
        return (1900+d.getYear())+"/"+p(d.getMonth()+1)+"/"+p(d.getDate())+" "+p(d.getHours())+":"+p(d.getMinutes())+":"+p(d.getSeconds());
      },
      fiber$formatDate :function* _trc_Logger_f_formatDate(_thread,d) {
        var _this=this;
        //var _arguments=Tonyu.A(arguments);
        
        let p = (function anonymous_414(n) {
          
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
        //var _arguments=Tonyu.A(arguments);
        
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
        //var _arguments=Tonyu.A(arguments);
        
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
          sn.sort((function anonymous_1196(a,b) {
            
            return b.qc-a.qc;
          }));
          if (sn.length==0) {
            return _this;
          }
          let qnmax = sn[0].qc;
          
          let qns = sn.map((function anonymous_1335(e) {
            
            return _this.floor(e.qc*100/qnmax);
          }));
          
          _this.add("Qn: Max="+qnmax+" "+Tonyu.globals.$JSON.stringify(qns));
          
        }
      },
      fiber$botStatus :function* _trc_Logger_f_botStatus(_thread,bot) {
        var _this=this;
        //var _arguments=Tonyu.A(arguments);
        
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
          sn.sort((function anonymous_1196(a,b) {
            
            return b.qc-a.qc;
          }));
          if (sn.length==0) {
            return _this;
          }
          let qnmax = sn[0].qc;
          
          let qns = sn.map((function anonymous_1335(e) {
            
            return _this.floor(e.qc*100/qnmax);
          }));
          
          (yield* _this.fiber$add(_thread, "Qn: Max="+qnmax+" "+Tonyu.globals.$JSON.stringify(qns)));
          
        }
        
      },
      argv :function _trc_Logger_argv() {
        var _this=this;
        
        _this.add("argv: "+process.argv.join(" "));
      },
      fiber$argv :function* _trc_Logger_f_argv(_thread) {
        var _this=this;
        //var _arguments=Tonyu.A(arguments);
        
        (yield* _this.fiber$add(_thread, "argv: "+process.argv.join(" ")));
        
      },
      __dummy: false
    };
  },
  decls: {"methods":{"main":{"nowait":false,"isMain":true,"vtype":{"params":[],"returnValue":null}},"new":{"nowait":false,"isMain":false,"vtype":{"params":[null],"returnValue":null}},"formatDate":{"nowait":false,"isMain":false,"vtype":{"params":[null],"returnValue":null}},"add":{"nowait":false,"isMain":false,"vtype":{"params":[null],"returnValue":null}},"action":{"nowait":false,"isMain":false,"vtype":{"params":[null],"returnValue":null}},"botStatus":{"nowait":false,"isMain":false,"vtype":{"params":[null],"returnValue":null}},"argv":{"nowait":false,"isMain":false,"vtype":{"params":[],"returnValue":null}}},"fields":{"logFile":{},"actCnt":{}}}
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
        //var _arguments=Tonyu.A(arguments);
        
        
        
        
        
        
        
        
        _this.timeoutCount = 0;
        
        _this.expcount = 0;
        
        _this.iterated = 0;
        
        
      },
      initNodeValues :function _trc_MCTSBot_initNodeValues(state,actions) {
        var _this=this;
        
        return actions.map((function anonymous_500() {
          
          return {q: new Tonyu.classes.bot.Rational(0,0),n: 0};
        }));
      },
      fiber$initNodeValues :function* _trc_MCTSBot_f_initNodeValues(_thread,state,actions) {
        var _this=this;
        //var _arguments=Tonyu.A(arguments);
        
        return actions.map((function anonymous_500() {
          
          return {q: new Tonyu.classes.bot.Rational(0,0),n: 0};
        }));
        
      },
      expand :function _trc_MCTSBot_expand(ctx,node) {
        var _this=this;
        
        if (node.n<_this.expandThresh) {
          throw new Error(node.n+"<"+_this.expandThresh);
          
        }
        if (node.subnodes) {
          throw new Error(node.state+" already expanded");
          
        }
        let s = _this.getState(ctx,node);
        
        node.actions=s.actionsEvents(ctx);
        let vals = _this.initNodeValues(s,node.actions);
        
        node.subnodes=vals.map((function anonymous_953(r,i) {
          
          let a = node.actions[i];
          
          return {parent: node,state: node.state.next(ctx,a),q: r.q,n: r.n,a: _this.str(a),subnodes: null};
        }));
        _this.expcount++;
        return node;
      },
      fiber$expand :function* _trc_MCTSBot_f_expand(_thread,ctx,node) {
        var _this=this;
        //var _arguments=Tonyu.A(arguments);
        
        if (node.n<_this.expandThresh) {
          throw new Error(node.n+"<"+_this.expandThresh);
          
        }
        if (node.subnodes) {
          throw new Error(node.state+" already expanded");
          
        }
        let s=yield* _this.fiber$getState(_thread, ctx, node);
        
        node.actions=s.actionsEvents(ctx);
        let vals=yield* _this.fiber$initNodeValues(_thread, s, node.actions);
        
        node.subnodes=vals.map((function anonymous_953(r,i) {
          
          let a = node.actions[i];
          
          return {parent: node,state: node.state.next(ctx,a),q: r.q,n: r.n,a: _this.str(a),subnodes: null};
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
        //var _arguments=Tonyu.A(arguments);
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
        
        if (nsa==0||_n==0) {
          return 1000000-_this.rnd();
        }
        return _this.nanc(_this.Cp*_this.sqrt(2*Tonyu.globals.$Math.log(_n))/nsa);
      },
      fiber$c :function* _trc_MCTSBot_f_c(_thread,node,a) {
        var _this=this;
        //var _arguments=Tonyu.A(arguments);
        var nsa;
        var _n;
        
        nsa=yield* _this.fiber$n(_thread, node, a);
        
        _n=yield* _this.fiber$n(_thread, node);
        
        if (nsa==0||_n==0) {
          return 1000000-_this.rnd();
        }
        return yield* _this.fiber$nanc(_thread, _this.Cp*_this.sqrt(2*Tonyu.globals.$Math.log(_n))/nsa);
        
        
      },
      q :function _trc_MCTSBot_q(node,a) {
        var _this=this;
        
        if (a==null) {
          return node.q.value;
          
        } else {
          if (! node.subnodes) {
            throw new Error(Tonyu.bindFunc(_this,_this.n).state+"Not expanded");
            
          }
          return node.subnodes[a].q.value;
          
        }
      },
      fiber$q :function* _trc_MCTSBot_f_q(_thread,node,a) {
        var _this=this;
        //var _arguments=Tonyu.A(arguments);
        
        if (a==null) {
          return node.q.value;
          
        } else {
          if (! node.subnodes) {
            throw new Error(Tonyu.bindFunc(_this,_this.n).state+"Not expanded");
            
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
            throw new Error(Tonyu.bindFunc(_this,_this.n).state+"Not expanded");
            
          }
          return _this.nanc(node.subnodes[a].n);
          
        }
      },
      fiber$n :function* _trc_MCTSBot_f_n(_thread,node,a) {
        var _this=this;
        //var _arguments=Tonyu.A(arguments);
        
        if (a==null) {
          return yield* _this.fiber$nanc(_thread, node.n);
          
          
        } else {
          if (! node.subnodes) {
            throw new Error(Tonyu.bindFunc(_this,_this.n).state+"Not expanded");
            
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
          throw new Error(Tonyu.bindFunc(_this,_this.n).state+"Not expanded");
          
        }
        while (true) {
          acts = node.subnodes;
          
          sgn = (node.state.player===_this.player?1:- 1);
          
          node.n+=1;
          if (! acts||acts.length==0) {
            break;
            
          }
          ma = - 1;
          mqc = 0;
          
          for (a = 0;
           a<acts.length ; a++) {
            {
              qc = _this.q(node,a)*sgn+_this.c(node,a);
              
              acts[a].test="q="+_this.q(node,a)*sgn+" c="+_this.c(node,a);
              if (ma<0||qc>=mqc) {
                mqc=qc;
                ma=a;
                
              }
            }
          }
          node=acts[ma];
          
        }
        return node;
      },
      fiber$selection :function* _trc_MCTSBot_f_selection(_thread,ctx,node) {
        var _this=this;
        //var _arguments=Tonyu.A(arguments);
        var acts;
        var sgn;
        var ma;
        var mqc;
        var test;
        var a;
        var qc;
        
        if (! node.subnodes) {
          throw new Error(Tonyu.bindFunc(_this,_this.n).state+"Not expanded");
          
        }
        while (true) {
          acts = node.subnodes;
          
          sgn = (node.state.player===_this.player?1:- 1);
          
          node.n+=1;
          if (! acts||acts.length==0) {
            break;
            
          }
          ma = - 1;
          mqc = 0;
          
          for (a = 0;
           a<acts.length ; a++) {
            {
              qc = _this.q(node,a)*sgn+_this.c(node,a);
              
              acts[a].test="q="+_this.q(node,a)*sgn+" c="+_this.c(node,a);
              if (ma<0||qc>=mqc) {
                mqc=qc;
                ma=a;
                
              }
            }
          }
          node=acts[ma];
          
        }
        return node;
        
      },
      play :function _trc_MCTSBot_play(ctx,s) {
        var _this=this;
        var rootNode;
        var i;
        var leaf;
        var endState;
        var v;
        var ma;
        var mqc;
        var a;
        var qc;
        var acts;
        
        _this.expcount=0;
        _this.lastRootNode=null;
        _this.timeoutCount=0;
        rootNode = {parent: null,state: s,q: new Tonyu.classes.bot.Rational(0,0),n: _this.expandThresh+1,subnodes: null};
        
        _this.player=s.player;
        _this.nanc(_this.expandThresh);
        _this.expand(ctx,rootNode);
        _this.iterated=0;
        let stime = performance.now();
        
        for (i = 0;
         i<_this.iteration ; i++) {
          {
            while (true) {
              leaf = _this.selection(ctx,rootNode);
              
              if (_this.n(leaf)<_this.expandThresh) {
                break;
                
              }
              if (leaf.subnodes&&leaf.subnodes.length==0) {
                break;
                
              }
              _this.expand(ctx,leaf);
              
            }
            _this.iterated++;
            if (performance.now()-stime>10000) {
              _this.print("Progress: iter=",_this.iterated," exp=",_this.expcount);
              stime+=10000;
              
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
        //var _arguments=Tonyu.A(arguments);
        var rootNode;
        var i;
        var leaf;
        var endState;
        var v;
        var ma;
        var mqc;
        var a;
        var qc;
        var acts;
        
        _this.expcount=0;
        _this.lastRootNode=null;
        _this.timeoutCount=0;
        rootNode = {parent: null,state: s,q: new Tonyu.classes.bot.Rational(0,0),n: _this.expandThresh+1,subnodes: null};
        
        _this.player=s.player;
        (yield* _this.fiber$nanc(_thread, _this.expandThresh));
        (yield* _this.fiber$expand(_thread, ctx, rootNode));
        _this.iterated=0;
        let stime = performance.now();
        
        for (i = 0;
         i<_this.iteration ; i++) {
          {
            while (true) {
              leaf=yield* _this.fiber$selection(_thread, ctx, rootNode);
              
              if (_this.n(leaf)<_this.expandThresh) {
                break;
                
              }
              if (leaf.subnodes&&leaf.subnodes.length==0) {
                break;
                
              }
              (yield* _this.fiber$expand(_thread, ctx, leaf));
              
            }
            _this.iterated++;
            if (performance.now()-stime>10000) {
              _this.print("Progress: iter=",_this.iterated," exp=",_this.expcount);
              stime+=10000;
              
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
        //var _arguments=Tonyu.A(arguments);
        
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
        //var _arguments=Tonyu.A(arguments);
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
      getState :function _trc_MCTSBot_getState(ctx,node) {
        var _this=this;
        var p;
        var idx;
        var act;
        
        if (node.state) {
          return node.state;
        }
        p = node.parent;
        
        idx = p.subnodes.indexOf(node);
        
        if (idx<0) {
          throw new Error("Index not found");
          
        }
        act = p.subnodes[idx];
        
        if (! act) {
          throw new Error("Action not found "+idx);
          
        }
        node.state=_this.getState(ctx,p).next(ctx,act);
        return node.state;
      },
      fiber$getState :function* _trc_MCTSBot_f_getState(_thread,ctx,node) {
        var _this=this;
        //var _arguments=Tonyu.A(arguments);
        var p;
        var idx;
        var act;
        
        if (node.state) {
          return node.state;
        }
        p = node.parent;
        
        idx = p.subnodes.indexOf(node);
        
        if (idx<0) {
          throw new Error("Index not found");
          
        }
        act = p.subnodes[idx];
        
        if (! act) {
          throw new Error("Action not found "+idx);
          
        }
        node.state=_this.getState(ctx,p).next(ctx,act);
        return node.state;
        
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
        //var _arguments=Tonyu.A(arguments);
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
        //var _arguments=Tonyu.A(arguments);
        
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
  decls: {"methods":{"main":{"nowait":false,"isMain":true,"vtype":{"params":[],"returnValue":null}},"initNodeValues":{"nowait":false,"isMain":false,"vtype":{"params":[null,null],"returnValue":null}},"expand":{"nowait":false,"isMain":false,"vtype":{"params":["bot.Context",null],"returnValue":null}},"str":{"nowait":false,"isMain":false,"vtype":{"params":[null],"returnValue":null}},"c":{"nowait":false,"isMain":false,"vtype":{"params":[null,"Number"],"returnValue":null}},"q":{"nowait":false,"isMain":false,"vtype":{"params":[null,"Number"],"returnValue":null}},"n":{"nowait":false,"isMain":false,"vtype":{"params":[null,"Number"],"returnValue":null}},"selection":{"nowait":false,"isMain":false,"vtype":{"params":["bot.Context",null],"returnValue":null}},"play":{"nowait":false,"isMain":false,"vtype":{"params":["bot.Context","bot.State"],"returnValue":"bot.Action"}},"backup":{"nowait":false,"isMain":false,"vtype":{"params":[null,"Number"],"returnValue":null}},"rollout":{"nowait":false,"isMain":false,"vtype":{"params":[null,null,null],"returnValue":null}},"getState":{"nowait":false,"isMain":false,"vtype":{"params":[null,null],"returnValue":null}},"playRandom":{"nowait":false,"isMain":false,"vtype":{"params":["bot.Context","bot.State"],"returnValue":"bot.Action"}},"nanc":{"nowait":false,"isMain":false,"vtype":{"params":[null],"returnValue":null}}},"fields":{"Cp":{},"expandThresh":{},"value":{},"iteration":{},"player":{},"timeout":{},"lastRootNode":{},"lastActions":{},"timeoutCount":{},"expcount":{},"iterated":{}}}
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
        //var _arguments=Tonyu.A(arguments);
        
        
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
        //var _arguments=Tonyu.A(arguments);
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
        //var _arguments=Tonyu.A(arguments);
        
        
        
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
        //var _arguments=Tonyu.A(arguments);
        
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
        //var _arguments=Tonyu.A(arguments);
        
        if (v!==v) {
          throw new Error(_this.q+" / "+_this.n);
          
        }
        return v;
        
      },
      __dummy: false
    };
  },
  decls: {"methods":{"main":{"nowait":false,"isMain":true,"vtype":{"params":[],"returnValue":null}},"new":{"nowait":false,"isMain":false,"vtype":{"params":[null,null],"returnValue":null}},"inc":{"nowait":false,"isMain":false,"vtype":{"params":["Number"],"returnValue":null}},"__getter__value":{"nowait":true,"isMain":false,"vtype":{"params":[],"returnValue":null}},"nanc":{"nowait":false,"isMain":false,"vtype":{"params":[null],"returnValue":null}}},"fields":{"q":{},"n":{}}}
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
        //var _arguments=Tonyu.A(arguments);
        
        
        
        
        
        
      },
      initialize :function _trc_Replay_initialize(params) {
        var _this=this;
        
        __superClass.apply( _this, [params]);
        _this.logFile=_this.file(_this.logFile);
        _this.lines=_this.logFile.lines();
      },
      step :function _trc_Replay_step() {
        var _this=this;
        
        let pat = /Action:(.*)/;
        
        while (true) {
          let r = _this.lines.shift();
          
          if (! r) {
            return false;
          }
          let m = pat.exec(r);
          
          if (! m) {
            continue;
            
          }
          let a = Tonyu.globals.$JSON.parse(m[1]);
          
          _this.state=_this.state.next(_this.context,a);
          return true;
          
        }
      },
      fiber$step :function* _trc_Replay_f_step(_thread) {
        var _this=this;
        //var _arguments=Tonyu.A(arguments);
        
        let pat = /Action:(.*)/;
        
        while (true) {
          let r = _this.lines.shift();
          
          if (! r) {
            return false;
          }
          let m = pat.exec(r);
          
          if (! m) {
            continue;
            
          }
          let a = Tonyu.globals.$JSON.parse(m[1]);
          
          _this.state=_this.state.next(_this.context,a);
          return true;
          
        }
        
      },
      dump :function _trc_Replay_dump(bot) {
        var _this=this;
        
        bot.play(_this.context,_this.state);
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
          sn.sort((function anonymous_806(a,b) {
            
            return b.qc-a.qc;
          }));
          _this.print(sn);
          
        }
      },
      fiber$dump :function* _trc_Replay_f_dump(_thread,bot) {
        var _this=this;
        //var _arguments=Tonyu.A(arguments);
        
        bot.play(_this.context,_this.state);
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
          sn.sort((function anonymous_806(a,b) {
            
            return b.qc-a.qc;
          }));
          _this.print(sn);
          
        }
        
      },
      __dummy: false
    };
  },
  decls: {"methods":{"main":{"nowait":false,"isMain":true,"vtype":{"params":[],"returnValue":null}},"new":{"nowait":false,"isMain":false,"vtype":{"params":[null],"returnValue":null}},"step":{"nowait":false,"isMain":false,"vtype":{"params":[],"returnValue":"Boolean"}},"dump":{"nowait":false,"isMain":false,"vtype":{"params":[null],"returnValue":null}}},"fields":{"logFle":{},"state":{},"context":{},"lines":{},"logFile":{}}}
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
        //var _arguments=Tonyu.A(arguments);
        
        
        
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
        //var _arguments=Tonyu.A(arguments);
        
        throw new Error("Abstract: メソッドnextが実装されていません");
        
        
      },
      actionsEvents :function _trc_State_actionsEvents(ctx) {
        var _this=this;
        
        throw new Error("Abstract: メソッドactionsEventsが実装されていません");
        
      },
      fiber$actionsEvents :function* _trc_State_f_actionsEvents(_thread,ctx) {
        var _this=this;
        //var _arguments=Tonyu.A(arguments);
        
        throw new Error("Abstract: メソッドactionsEventsが実装されていません");
        
        
      },
      gameover :function _trc_State_gameover(ctx) {
        var _this=this;
        
        return _this.actionsEvents(ctx).length==0;
      },
      fiber$gameover :function* _trc_State_f_gameover(_thread,ctx) {
        var _this=this;
        //var _arguments=Tonyu.A(arguments);
        
        return _this.actionsEvents(ctx).length==0;
        
      },
      id :function _trc_State_id(ctx) {
        var _this=this;
        
        throw new Error("Abstract: メソッドidが実装されていません");
        
      },
      fiber$id :function* _trc_State_f_id(_thread,ctx) {
        var _this=this;
        //var _arguments=Tonyu.A(arguments);
        
        throw new Error("Abstract: メソッドidが実装されていません");
        
        
      },
      playerIndex :function _trc_State_playerIndex(ctx,p) {
        var _this=this;
        
        return ctx.players.indexOf(p);
      },
      fiber$playerIndex :function* _trc_State_f_playerIndex(_thread,ctx,p) {
        var _this=this;
        //var _arguments=Tonyu.A(arguments);
        
        return ctx.players.indexOf(p);
        
      },
      nextIsEvent :function _trc_State_nextIsEvent(ctx) {
        var _this=this;
        
        return false;
      },
      fiber$nextIsEvent :function* _trc_State_f_nextIsEvent(_thread,ctx) {
        var _this=this;
        //var _arguments=Tonyu.A(arguments);
        
        return false;
        
      },
      __dummy: false
    };
  },
  decls: {"methods":{"main":{"nowait":false,"isMain":true,"vtype":{"params":[],"returnValue":null}},"print":{"nowait":false,"isMain":false,"vtype":{"params":[null],"returnValue":null}},"next":{"nowait":false,"isMain":false,"vtype":{"params":["bot.Context","bot.Action"],"returnValue":"bot.State"}},"actionsEvents":{"nowait":false,"isMain":false,"vtype":{"params":["bot.Context"],"returnValue":null}},"gameover":{"nowait":false,"isMain":false,"vtype":{"params":["bot.Context"],"returnValue":null}},"id":{"nowait":false,"isMain":false,"vtype":{"params":[null],"returnValue":null}},"playerIndex":{"nowait":false,"isMain":false,"vtype":{"params":[null,null],"returnValue":null}},"nextIsEvent":{"nowait":false,"isMain":false,"vtype":{"params":["bot.Context"],"returnValue":null}}},"fields":{"player":{},"Player":{}}}
});

//# sourceMappingURL=concat.js.map