Tonyu.klass.define({
  fullName: 'user.Action',
  shortName: 'Action',
  namespace: 'user',
  superclass: Tonyu.classes.kernel.Actor,
  includes: [],
  methods: function (__superClass) {
    return {
      main :function _trc_Action_main() {
        "use strict";
        var _this=this;
        
      },
      fiber$main :function* _trc_Action_f_main(_thread) {
        "use strict";
        var _this=this;
        //var _arguments=Tonyu.A(arguments);
        
        
      },
      __dummy: false
    };
  },
  decls: {"methods":{"main":{"nowait":false,"isMain":true,"vtype":{"params":[],"returnValue":null}}},"fields":{}}
});
Tonyu.klass.define({
  fullName: 'user.Bot',
  shortName: 'Bot',
  namespace: 'user',
  superclass: Tonyu.classes.kernel.Actor,
  includes: [],
  methods: function (__superClass) {
    return {
      main :function _trc_Bot_main() {
        "use strict";
        var _this=this;
        
      },
      fiber$main :function* _trc_Bot_f_main(_thread) {
        "use strict";
        var _this=this;
        //var _arguments=Tonyu.A(arguments);
        
        
      },
      play :function _trc_Bot_play(ctx,s) {
        "use strict";
        var _this=this;
        
        throw new Error("Abstract: メソッドplayが実装されていません");
        
      },
      fiber$play :function* _trc_Bot_f_play(_thread,ctx,s) {
        "use strict";
        var _this=this;
        //var _arguments=Tonyu.A(arguments);
        
        throw new Error("Abstract: メソッドplayが実装されていません");
        
        
      },
      __dummy: false
    };
  },
  decls: {"methods":{"main":{"nowait":false,"isMain":true,"vtype":{"params":[],"returnValue":null}},"play":{"nowait":false,"isMain":false,"vtype":{"params":[null,"user.State"],"returnValue":"user.Action"}}},"fields":{}}
});
Tonyu.klass.define({
  fullName: 'user.Context',
  shortName: 'Context',
  namespace: 'user',
  superclass: Tonyu.classes.kernel.Actor,
  includes: [],
  methods: function (__superClass) {
    return {
      main :function _trc_Context_main() {
        "use strict";
        var _this=this;
        
        
        
        
        
      },
      fiber$main :function* _trc_Context_f_main(_thread) {
        "use strict";
        var _this=this;
        //var _arguments=Tonyu.A(arguments);
        
        
        
        
        
        
      },
      __dummy: false
    };
  },
  decls: {"methods":{"main":{"nowait":false,"isMain":true,"vtype":{"params":[],"returnValue":null}}},"fields":{"player":{"vtype":"Number"},"players":{"vtype":{"element":"Number"}},"debug":{"vtype":"Boolean"},"bots":{"vtype":{"element":"user.Bot"}}}}
});
Tonyu.klass.define({
  fullName: 'user.CornerMCTSBot',
  shortName: 'CornerMCTSBot',
  namespace: 'user',
  superclass: Tonyu.classes.user.Bot,
  includes: [],
  methods: function (__superClass) {
    return {
      main :function _trc_CornerMCTSBot_main() {
        "use strict";
        var _this=this;
        
        
        
        
        
        
        
        "field strict";
        _this.expcount = 0;
        
      },
      fiber$main :function* _trc_CornerMCTSBot_f_main(_thread) {
        "use strict";
        var _this=this;
        //var _arguments=Tonyu.A(arguments);
        
        
        
        
        
        
        
        "field strict";
        _this.expcount = 0;
        
        
      },
      expand :function _trc_CornerMCTSBot_expand(ctx,node) {
        "use strict";
        var _this=this;
        var hasCorner;
        
        if (node.n<_this.expandThresh) {
          throw new Error(node.n+"<"+_this.expandThresh);
          
        }
        if (node.subnodes) {
          throw new Error("already expanded");
          
        }
        _this.expcount++;
        node.actions=_this.getState(ctx,node).actionsEvents(ctx);
        hasCorner = node.actions.some(Tonyu.bindFunc(_this,_this.isCorner));
        
        node.subnodes=node.actions.map((function anonymous_772(a) {
          var q;
          var n;
          
          
          if (! hasCorner) {
            q=new Tonyu.classes.user.Rational(0,0);
            n=0;
            
          } else {
            if (_this.isCorner(a)) {
              q=new Tonyu.classes.user.Rational(5,0);
              n=0;
              
            } else {
              q=new Tonyu.classes.user.Rational(0,0);
              n=1;
              
            }
          }
          return {parent: node,q: q,n: n};
        }));
        return node;
      },
      fiber$expand :function* _trc_CornerMCTSBot_f_expand(_thread,ctx,node) {
        "use strict";
        var _this=this;
        //var _arguments=Tonyu.A(arguments);
        var hasCorner;
        
        if (node.n<_this.expandThresh) {
          throw new Error(node.n+"<"+_this.expandThresh);
          
        }
        if (node.subnodes) {
          throw new Error("already expanded");
          
        }
        _this.expcount++;
        node.actions=_this.getState(ctx,node).actionsEvents(ctx);
        hasCorner = node.actions.some(Tonyu.bindFunc(_this,_this.isCorner));
        
        node.subnodes=node.actions.map((function anonymous_772(a) {
          var q;
          var n;
          
          
          if (! hasCorner) {
            q=new Tonyu.classes.user.Rational(0,0);
            n=0;
            
          } else {
            if (_this.isCorner(a)) {
              q=new Tonyu.classes.user.Rational(5,0);
              n=0;
              
            } else {
              q=new Tonyu.classes.user.Rational(0,0);
              n=1;
              
            }
          }
          return {parent: node,q: q,n: n};
        }));
        return node;
        
      },
      str :function _trc_CornerMCTSBot_str(s) {
        "use strict";
        var _this=this;
        var r;
        
        r = s+"";
        
        if (r=="[object Object]") {
          return s;
        }
        return r;
      },
      fiber$str :function* _trc_CornerMCTSBot_f_str(_thread,s) {
        "use strict";
        var _this=this;
        //var _arguments=Tonyu.A(arguments);
        var r;
        
        r = s+"";
        
        if (r=="[object Object]") {
          return s;
        }
        return r;
        
      },
      c :function _trc_CornerMCTSBot_c(node,a) {
        "use strict";
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
      fiber$c :function* _trc_CornerMCTSBot_f_c(_thread,node,a) {
        "use strict";
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
      q :function _trc_CornerMCTSBot_q(node,a) {
        "use strict";
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
      fiber$q :function* _trc_CornerMCTSBot_f_q(_thread,node,a) {
        "use strict";
        var _this=this;
        //var _arguments=Tonyu.A(arguments);
        
        if (a==null) {
          return node.q.value;
          
        } else {
          if (! node.subnodes) {
            throw new Error("Not expanded");
            
          }
          return node.subnodes[a].q.value;
          
        }
        
      },
      n :function _trc_CornerMCTSBot_n(node,a) {
        "use strict";
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
      fiber$n :function* _trc_CornerMCTSBot_f_n(_thread,node,a) {
        "use strict";
        var _this=this;
        //var _arguments=Tonyu.A(arguments);
        
        if (a==null) {
          return yield* _this.fiber$nanc(_thread, node.n);
          
          
        } else {
          if (! node.subnodes) {
            throw new Error("Not expanded");
            
          }
          return yield* _this.fiber$nanc(_thread, node.subnodes[a].n);
          
          
        }
        
      },
      selection :function _trc_CornerMCTSBot_selection(ctx,node) {
        "use strict";
        var _this=this;
        var subs;
        var sgn;
        var ma;
        var mqc;
        var test;
        var a;
        var qc;
        
        if (! node.subnodes) {
          throw new Error("Not expanded");
          
        }
        while (true) {
          subs = node.subnodes;
          
          node.n+=1;
          if (! subs||subs.length==0) {
            break;
            
          }
          sgn = (_this.getState(ctx,node).player===_this.player?1:- 1);
          
          ma = - 1;
          mqc = 0;
          
          for (a = 0;
           a<subs.length ; a++) {
            {
              qc = _this.q(node,a)*sgn+_this.c(node,a);
              
              subs[a].test="q="+_this.q(node,a)*sgn+" c="+_this.c(node,a);
              if (ma<0||qc>=mqc) {
                mqc=qc;
                ma=a;
                
              }
            }
          }
          node=subs[ma];
          
        }
        return node;
      },
      fiber$selection :function* _trc_CornerMCTSBot_f_selection(_thread,ctx,node) {
        "use strict";
        var _this=this;
        //var _arguments=Tonyu.A(arguments);
        var subs;
        var sgn;
        var ma;
        var mqc;
        var test;
        var a;
        var qc;
        
        if (! node.subnodes) {
          throw new Error("Not expanded");
          
        }
        while (true) {
          subs = node.subnodes;
          
          node.n+=1;
          if (! subs||subs.length==0) {
            break;
            
          }
          sgn = (_this.getState(ctx,node).player===_this.player?1:- 1);
          
          ma = - 1;
          mqc = 0;
          
          for (a = 0;
           a<subs.length ; a++) {
            {
              qc = _this.q(node,a)*sgn+_this.c(node,a);
              
              subs[a].test="q="+_this.q(node,a)*sgn+" c="+_this.c(node,a);
              if (ma<0||qc>=mqc) {
                mqc=qc;
                ma=a;
                
              }
            }
          }
          node=subs[ma];
          
        }
        return node;
        
      },
      play :function _trc_CornerMCTSBot_play(ctx,s) {
        "use strict";
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
        rootNode = {parent: null,state: s,q: new Tonyu.classes.user.Rational(0,0),n: _this.expandThresh+1,actions: null};
        
        _this.player=s.player;
        _this.nanc(_this.expandThresh);
        _this.expand(ctx,rootNode);
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
            endState = _this.rollout(ctx,leaf,_this.timeout);
            
            v = _this.value(ctx,s.player,endState);
            
            _this.backup(leaf,v);
            if (_this.expcount>=300) {
              break;
              
            }
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
        _this.print("EXP",_this.expcount);
        return acts[ma];
      },
      fiber$play :function* _trc_CornerMCTSBot_f_play(_thread,ctx,s) {
        "use strict";
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
        rootNode = {parent: null,state: s,q: new Tonyu.classes.user.Rational(0,0),n: _this.expandThresh+1,actions: null};
        
        _this.player=s.player;
        (yield* _this.fiber$nanc(_thread, _this.expandThresh));
        (yield* _this.fiber$expand(_thread, ctx, rootNode));
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
            endState=yield* _this.fiber$rollout(_thread, ctx, leaf, _this.timeout);
            
            v = _this.value(ctx,s.player,endState);
            
            (yield* _this.fiber$backup(_thread, leaf, v));
            if (_this.expcount>=300) {
              break;
              
            }
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
        _this.print("EXP",_this.expcount);
        return acts[ma];
        
      },
      backup :function _trc_CornerMCTSBot_backup(node,value) {
        "use strict";
        var _this=this;
        
        while (node) {
          node.q=node.q.inc(value);
          node=node.parent;
          
        }
      },
      fiber$backup :function* _trc_CornerMCTSBot_f_backup(_thread,node,value) {
        "use strict";
        var _this=this;
        //var _arguments=Tonyu.A(arguments);
        
        while (node) {
          node.q=node.q.inc(value);
          node=node.parent;
          
        }
        
      },
      getState :function _trc_CornerMCTSBot_getState(ctx,node) {
        "use strict";
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
        act = p.actions[idx];
        
        if (! act) {
          throw new Error("Action not found "+idx);
          
        }
        node.state=_this.getState(ctx,p).next(ctx,act);
        return node.state;
      },
      fiber$getState :function* _trc_CornerMCTSBot_f_getState(_thread,ctx,node) {
        "use strict";
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
        act = p.actions[idx];
        
        if (! act) {
          throw new Error("Action not found "+idx);
          
        }
        node.state=_this.getState(ctx,p).next(ctx,act);
        return node.state;
        
      },
      rollout :function _trc_CornerMCTSBot_rollout(ctx,node,timeout) {
        "use strict";
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
            break;
            
          }
          
        }
        return state;
      },
      fiber$rollout :function* _trc_CornerMCTSBot_f_rollout(_thread,ctx,node,timeout) {
        "use strict";
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
            break;
            
          }
          
        }
        return state;
        
      },
      isCorner :function _trc_CornerMCTSBot_isCorner(a) {
        "use strict";
        var _this=this;
        
        if (Tonyu.globals.$stations[a.stext].nexts.length==Tonyu.globals.$stations[a.stext].lines.length) {
          return true;
          
        } else {
          return false;
          
        }
      },
      fiber$isCorner :function* _trc_CornerMCTSBot_f_isCorner(_thread,a) {
        "use strict";
        var _this=this;
        //var _arguments=Tonyu.A(arguments);
        
        if (Tonyu.globals.$stations[a.stext].nexts.length==Tonyu.globals.$stations[a.stext].lines.length) {
          return true;
          
        } else {
          return false;
          
        }
        
      },
      playRandom :function _trc_CornerMCTSBot_playRandom(ctx,s) {
        "use strict";
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
      fiber$playRandom :function* _trc_CornerMCTSBot_f_playRandom(_thread,ctx,s) {
        "use strict";
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
      nanc :function _trc_CornerMCTSBot_nanc(v) {
        "use strict";
        var _this=this;
        
        if (typeof  v!=="number") {
          throw new Error("null");
          
        }
        if (v!==v) {
          throw new Error("Nan");
          
        }
        return v;
      },
      fiber$nanc :function* _trc_CornerMCTSBot_f_nanc(_thread,v) {
        "use strict";
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
  decls: {"methods":{"main":{"nowait":false,"isMain":true,"vtype":{"params":[],"returnValue":null}},"expand":{"nowait":false,"isMain":false,"vtype":{"params":["user.Context",null],"returnValue":null}},"str":{"nowait":false,"isMain":false,"vtype":{"params":[null],"returnValue":null}},"c":{"nowait":false,"isMain":false,"vtype":{"params":[null,"Number"],"returnValue":null}},"q":{"nowait":false,"isMain":false,"vtype":{"params":[null,"Number"],"returnValue":null}},"n":{"nowait":false,"isMain":false,"vtype":{"params":[null,"Number"],"returnValue":null}},"selection":{"nowait":false,"isMain":false,"vtype":{"params":["user.Context",null],"returnValue":null}},"play":{"nowait":false,"isMain":false,"vtype":{"params":["user.Context","user.State"],"returnValue":"user.Action"}},"backup":{"nowait":false,"isMain":false,"vtype":{"params":[null,"Number"],"returnValue":null}},"getState":{"nowait":false,"isMain":false,"vtype":{"params":[null,null],"returnValue":null}},"rollout":{"nowait":false,"isMain":false,"vtype":{"params":[null,null,null],"returnValue":null}},"isCorner":{"nowait":false,"isMain":false,"vtype":{"params":[null],"returnValue":null}},"playRandom":{"nowait":false,"isMain":false,"vtype":{"params":["user.Context","user.State"],"returnValue":"user.Action"}},"nanc":{"nowait":false,"isMain":false,"vtype":{"params":[null],"returnValue":null}}},"fields":{"Cp":{},"expandThresh":{},"value":{},"iteration":{},"player":{},"timeout":{},"expcount":{"vtype":"Number"}}}
});
Tonyu.klass.define({
  fullName: 'user.GameMaster',
  shortName: 'GameMaster',
  namespace: 'user',
  superclass: Tonyu.classes.kernel.Actor,
  includes: [],
  methods: function (__superClass) {
    return {
      main :function _trc_GameMaster_main() {
        "use strict";
        var _this=this;
        
        
        
      },
      fiber$main :function* _trc_GameMaster_f_main(_thread) {
        "use strict";
        var _this=this;
        //var _arguments=Tonyu.A(arguments);
        
        
        
        
      },
      onAppear :function _trc_GameMaster_onAppear() {
        "use strict";
        var _this=this;
        
      },
      fiber$onAppear :function* _trc_GameMaster_f_onAppear(_thread) {
        "use strict";
        var _this=this;
        //var _arguments=Tonyu.A(arguments);
        
        
      },
      step :function _trc_GameMaster_step() {
        "use strict";
        var _this=this;
        var action;
        
        if (_this.gameover()) {
          throw new Error("Game is over");
          
        }
        action = _this.getBot(_this.state.player).play(_this.context,_this.state);
        
        _this.state=_this.state.next(_this.context,action);
        if (! _this.state) {
          throw new Error("state is null!");
          
        }
        return action;
      },
      fiber$step :function* _trc_GameMaster_f_step(_thread) {
        "use strict";
        var _this=this;
        //var _arguments=Tonyu.A(arguments);
        var action;
        
        if (_this.gameover()) {
          throw new Error("Game is over");
          
        }
        action = _this.getBot(_this.state.player).play(_this.context,_this.state);
        
        _this.state=_this.state.next(_this.context,action);
        if (! _this.state) {
          throw new Error("state is null!");
          
        }
        return action;
        
      },
      getBot :function _trc_GameMaster_getBot(p) {
        "use strict";
        var _this=this;
        
        if (_this.context.bots&&_this.context.bots[p]) {
          return _this.context.bots[p];
        }
        throw new Error("Bot not found: "+p);
        
      },
      fiber$getBot :function* _trc_GameMaster_f_getBot(_thread,p) {
        "use strict";
        var _this=this;
        //var _arguments=Tonyu.A(arguments);
        
        if (_this.context.bots&&_this.context.bots[p]) {
          return _this.context.bots[p];
        }
        throw new Error("Bot not found: "+p);
        
        
      },
      gameover :function _trc_GameMaster_gameover() {
        "use strict";
        var _this=this;
        
        return _this.state.gameover(_this.context);
      },
      fiber$gameover :function* _trc_GameMaster_f_gameover(_thread) {
        "use strict";
        var _this=this;
        //var _arguments=Tonyu.A(arguments);
        
        return _this.state.gameover(_this.context);
        
      },
      run :function _trc_GameMaster_run() {
        "use strict";
        var _this=this;
        
        while (! _this.gameover()) {
          _this.step();
          _this.print(_this.state+"");
          
        }
      },
      fiber$run :function* _trc_GameMaster_f_run(_thread) {
        "use strict";
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
  decls: {"methods":{"main":{"nowait":false,"isMain":true,"vtype":{"params":[],"returnValue":null}},"onAppear":{"nowait":false,"isMain":false,"vtype":{"params":[],"returnValue":null}},"step":{"nowait":false,"isMain":false,"vtype":{"params":[],"returnValue":null}},"getBot":{"nowait":false,"isMain":false,"vtype":{"params":["Number"],"returnValue":null}},"gameover":{"nowait":false,"isMain":false,"vtype":{"params":[],"returnValue":null}},"run":{"nowait":false,"isMain":false,"vtype":{"params":[],"returnValue":null}}},"fields":{"state":{},"context":{"vtype":"user.Context"}}}
});
Tonyu.klass.define({
  fullName: 'user.MCTSBot',
  shortName: 'MCTSBot',
  namespace: 'user',
  superclass: Tonyu.classes.user.Bot,
  includes: [],
  methods: function (__superClass) {
    return {
      main :function _trc_MCTSBot_main() {
        "use strict";
        var _this=this;
        
        
        
        
        
        
        
      },
      fiber$main :function* _trc_MCTSBot_f_main(_thread) {
        "use strict";
        var _this=this;
        //var _arguments=Tonyu.A(arguments);
        
        
        
        
        
        
        
        
      },
      expand :function _trc_MCTSBot_expand(ctx,node) {
        "use strict";
        var _this=this;
        
        if (node.n<_this.expandThresh) {
          throw new Error(node.n+"<"+_this.expandThresh);
          
        }
        if (node.subnodes) {
          throw new Error(node.state+" already expanded");
          
        }
        node.subnodes=node.state.actionsEvents(ctx).map((function anonymous_679(a) {
          
          return {parent: node,state: node.state.next(ctx,a),q: new Tonyu.classes.user.Rational(0,0),n: 0,a: _this.str(a),subnodes: null};
        }));
        _this.expcount++;
        return node;
      },
      fiber$expand :function* _trc_MCTSBot_f_expand(_thread,ctx,node) {
        "use strict";
        var _this=this;
        //var _arguments=Tonyu.A(arguments);
        
        if (node.n<_this.expandThresh) {
          throw new Error(node.n+"<"+_this.expandThresh);
          
        }
        if (node.subnodes) {
          throw new Error(node.state+" already expanded");
          
        }
        node.subnodes=node.state.actionsEvents(ctx).map((function anonymous_679(a) {
          
          return {parent: node,state: node.state.next(ctx,a),q: new Tonyu.classes.user.Rational(0,0),n: 0,a: _this.str(a),subnodes: null};
        }));
        _this.expcount++;
        return node;
        
      },
      str :function _trc_MCTSBot_str(s) {
        "use strict";
        var _this=this;
        var r;
        
        r = s+"";
        
        if (r=="[object Object]") {
          return s;
        }
        return r;
      },
      fiber$str :function* _trc_MCTSBot_f_str(_thread,s) {
        "use strict";
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
        "use strict";
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
        "use strict";
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
        "use strict";
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
        "use strict";
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
        "use strict";
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
        "use strict";
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
        "use strict";
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
        "use strict";
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
        "use strict";
        var _this=this;
        var rootNode;
        var leaf;
        var endState;
        var v;
        var ma;
        var mqc;
        var a;
        var qc;
        var acts;
        
        _this.expcount=0;
        rootNode = {parent: null,state: s,q: new Tonyu.classes.user.Rational(0,0),n: _this.expandThresh+1,subnodes: null};
        
        _this.player=s.player;
        _this.nanc(_this.expandThresh);
        _this.expand(ctx,rootNode);
        _this.timeouted=0;
        _this.iterated=0;
        let endTime = Tonyu.globals.$Boot.now()+_this.totalTime;
        
        while (Tonyu.globals.$Boot.now()<endTime) {
          _this.iterated++;
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
          endState = _this.rollout(ctx,leaf);
          
          v = _this.value(ctx,s.player,endState);
          
          _this.backup(leaf,v);
          
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
        _this.print("ITER",_this.iterated,"EXP",_this.expcount,"T/O",_this.timeouted);
        return acts[ma];
      },
      fiber$play :function* _trc_MCTSBot_f_play(_thread,ctx,s) {
        "use strict";
        var _this=this;
        //var _arguments=Tonyu.A(arguments);
        var rootNode;
        var leaf;
        var endState;
        var v;
        var ma;
        var mqc;
        var a;
        var qc;
        var acts;
        
        _this.expcount=0;
        rootNode = {parent: null,state: s,q: new Tonyu.classes.user.Rational(0,0),n: _this.expandThresh+1,subnodes: null};
        
        _this.player=s.player;
        (yield* _this.fiber$nanc(_thread, _this.expandThresh));
        (yield* _this.fiber$expand(_thread, ctx, rootNode));
        _this.timeouted=0;
        _this.iterated=0;
        let endTime = Tonyu.globals.$Boot.now()+_this.totalTime;
        
        while (Tonyu.globals.$Boot.now()<endTime) {
          _this.iterated++;
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
          endState=yield* _this.fiber$rollout(_thread, ctx, leaf);
          
          v = _this.value(ctx,s.player,endState);
          
          (yield* _this.fiber$backup(_thread, leaf, v));
          
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
        _this.print("ITER",_this.iterated,"EXP",_this.expcount,"T/O",_this.timeouted);
        return acts[ma];
        
      },
      backup :function _trc_MCTSBot_backup(node,value) {
        "use strict";
        var _this=this;
        
        while (node) {
          node.q=node.q.inc(value);
          node=node.parent;
          
        }
      },
      fiber$backup :function* _trc_MCTSBot_f_backup(_thread,node,value) {
        "use strict";
        var _this=this;
        //var _arguments=Tonyu.A(arguments);
        
        while (node) {
          node.q=node.q.inc(value);
          node=node.parent;
          
        }
        
      },
      rollout :function _trc_MCTSBot_rollout(ctx,node) {
        "use strict";
        var _this=this;
        var state;
        var t;
        var a;
        
        state = _this.getState(ctx,node);
        
        t = Tonyu.globals.$Boot.now();
        
        while (! state.gameover(ctx)) {
          a = _this.playRandom(ctx,state);
          
          state=state.next(ctx,a);
          if (Tonyu.globals.$Boot.now()-t>_this.timeout&&state.player===_this.player) {
            _this.timeouted++;
            break;
            
            
          }
          
        }
        return state;
      },
      fiber$rollout :function* _trc_MCTSBot_f_rollout(_thread,ctx,node) {
        "use strict";
        var _this=this;
        //var _arguments=Tonyu.A(arguments);
        var state;
        var t;
        var a;
        
        state=yield* _this.fiber$getState(_thread, ctx, node);
        
        t = Tonyu.globals.$Boot.now();
        
        while (! state.gameover(ctx)) {
          a=yield* _this.fiber$playRandom(_thread, ctx, state);
          
          state=state.next(ctx,a);
          if (Tonyu.globals.$Boot.now()-t>_this.timeout&&state.player===_this.player) {
            _this.timeouted++;
            break;
            
            
          }
          
        }
        return state;
        
      },
      getState :function _trc_MCTSBot_getState(ctx,node) {
        "use strict";
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
        "use strict";
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
        "use strict";
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
        "use strict";
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
        "use strict";
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
        "use strict";
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
  decls: {"methods":{"main":{"nowait":false,"isMain":true,"vtype":{"params":[],"returnValue":null}},"expand":{"nowait":false,"isMain":false,"vtype":{"params":["user.Context",null],"returnValue":null}},"str":{"nowait":false,"isMain":false,"vtype":{"params":[null],"returnValue":null}},"c":{"nowait":false,"isMain":false,"vtype":{"params":[null,"Number"],"returnValue":null}},"q":{"nowait":false,"isMain":false,"vtype":{"params":[null,"Number"],"returnValue":null}},"n":{"nowait":false,"isMain":false,"vtype":{"params":[null,"Number"],"returnValue":null}},"selection":{"nowait":false,"isMain":false,"vtype":{"params":["user.Context",null],"returnValue":null}},"play":{"nowait":false,"isMain":false,"vtype":{"params":["user.Context","user.State"],"returnValue":"user.Action"}},"backup":{"nowait":false,"isMain":false,"vtype":{"params":[null,"Number"],"returnValue":null}},"rollout":{"nowait":false,"isMain":false,"vtype":{"params":[null,null],"returnValue":null}},"getState":{"nowait":false,"isMain":false,"vtype":{"params":[null,null],"returnValue":null}},"playRandom":{"nowait":false,"isMain":false,"vtype":{"params":["user.Context","user.State"],"returnValue":"user.Action"}},"nanc":{"nowait":false,"isMain":false,"vtype":{"params":[null],"returnValue":null}}},"fields":{"Cp":{},"expandThresh":{},"value":{},"player":{},"totalTime":{},"timeout":{},"timeouted":{},"iterated":{},"expcount":{"vtype":"Number"}}}
});
Tonyu.klass.define({
  fullName: 'user.NStepBot',
  shortName: 'NStepBot',
  namespace: 'user',
  superclass: Tonyu.classes.user.Bot,
  includes: [],
  methods: function (__superClass) {
    return {
      main :function _trc_NStepBot_main() {
        "use strict";
        var _this=this;
        
        
        
      },
      fiber$main :function* _trc_NStepBot_f_main(_thread) {
        "use strict";
        var _this=this;
        //var _arguments=Tonyu.A(arguments);
        
        
        
        
      },
      play :function _trc_NStepBot_play(ctx,s) {
        "use strict";
        var _this=this;
        var a;
        
        a = _this.playN(ctx,s,_this.n);
        
        if (! a[0]) {
          throw new Error("Action is null 2! "+_this.n);
          
          
        }
        return a[0];
      },
      fiber$play :function* _trc_NStepBot_f_play(_thread,ctx,s) {
        "use strict";
        var _this=this;
        //var _arguments=Tonyu.A(arguments);
        var a;
        
        a=yield* _this.fiber$playN(_thread, ctx, s, _this.n);
        
        if (! a[0]) {
          throw new Error("Action is null 2! "+_this.n);
          
          
        }
        return a[0];
        
      },
      playN :function _trc_NStepBot_playN(ctx,s,n) {
        "use strict";
        var _this=this;
        var acts;
        var player;
        var maxv;
        var besta;
        var acvs;
        
        if (n<=0) {
          return [];
        }
        if (! ctx) {
          throw new Error("CTX is null");
          
        }
        acts = s.actionsEvents(ctx);
        
        if (acts.length==0) {
          return [];
        }
        player = s.player;
        
        maxv = - 100;
        
        acvs = acts.map((function anonymous_569(a) {
          var ns;
          var sa;
          var ae;
          var v;
          
          ns = s.next(ctx,a);
          
          sa = _this.playN(ctx,ns,n-1);
          
          for ([ae] of Tonyu.iterator2(sa,1)) {
            ns=ns.next(ctx,ae);
            
          }
          v = _this.value(ctx,player,ns);
          
          return {value: v,actions: [a].concat(sa)};
        }));
        
        acvs.sort((function anonymous_845() {
          
          return _this.rnd()-0.5;
        }));
        acvs.sort((function anonymous_882(a,b) {
          
          return b.value-a.value;
        }));
        return acvs[0].actions;
      },
      fiber$playN :function* _trc_NStepBot_f_playN(_thread,ctx,s,n) {
        "use strict";
        var _this=this;
        //var _arguments=Tonyu.A(arguments);
        var acts;
        var player;
        var maxv;
        var besta;
        var acvs;
        
        if (n<=0) {
          return [];
        }
        if (! ctx) {
          throw new Error("CTX is null");
          
        }
        acts = s.actionsEvents(ctx);
        
        if (acts.length==0) {
          return [];
        }
        player = s.player;
        
        maxv = - 100;
        
        acvs = acts.map((function anonymous_569(a) {
          var ns;
          var sa;
          var ae;
          var v;
          
          ns = s.next(ctx,a);
          
          sa = _this.playN(ctx,ns,n-1);
          
          for ([ae] of Tonyu.iterator2(sa,1)) {
            ns=ns.next(ctx,ae);
            
          }
          v = _this.value(ctx,player,ns);
          
          return {value: v,actions: [a].concat(sa)};
        }));
        
        acvs.sort((function anonymous_845() {
          
          return _this.rnd()-0.5;
        }));
        acvs.sort((function anonymous_882(a,b) {
          
          return b.value-a.value;
        }));
        return acvs[0].actions;
        
      },
      __dummy: false
    };
  },
  decls: {"methods":{"main":{"nowait":false,"isMain":true,"vtype":{"params":[],"returnValue":null}},"play":{"nowait":false,"isMain":false,"vtype":{"params":[null,"user.State"],"returnValue":"user.Action"}},"playN":{"nowait":false,"isMain":false,"vtype":{"params":[null,"user.State","Number"],"returnValue":null}}},"fields":{"n":{"vtype":"Number"},"value":{}}}
});
Tonyu.klass.define({
  fullName: 'user.OneStepBot',
  shortName: 'OneStepBot',
  namespace: 'user',
  superclass: Tonyu.classes.user.Bot,
  includes: [],
  methods: function (__superClass) {
    return {
      main :function _trc_OneStepBot_main() {
        "use strict";
        var _this=this;
        
        
      },
      fiber$main :function* _trc_OneStepBot_f_main(_thread) {
        "use strict";
        var _this=this;
        //var _arguments=Tonyu.A(arguments);
        
        
        
      },
      play :function _trc_OneStepBot_play(ctx,s) {
        "use strict";
        var _this=this;
        var acts;
        var player;
        var maxv;
        var besta;
        var acvs;
        
        if (! ctx) {
          throw new Error("CTX is null");
          
        }
        acts = s.actionsEvents(ctx);
        
        player = s.player;
        
        maxv = - 100;
        
        acvs = acts.map((function anonymous_325(a) {
          var ns;
          var v;
          
          ns = s.next(ctx,a);
          
          v = _this.value(ctx,player,ns);
          
          return {value: v,action: a};
        }));
        
        acvs.sort((function anonymous_478() {
          
          return _this.rnd()-0.5;
        }));
        acvs.sort((function anonymous_515(a,b) {
          
          return b.value-a.value;
        }));
        if (! acvs[0].action) {
          _this.print(acvs);
          throw new Error("Action is null!");
          
          
        }
        return acvs[0].action;
      },
      fiber$play :function* _trc_OneStepBot_f_play(_thread,ctx,s) {
        "use strict";
        var _this=this;
        //var _arguments=Tonyu.A(arguments);
        var acts;
        var player;
        var maxv;
        var besta;
        var acvs;
        
        if (! ctx) {
          throw new Error("CTX is null");
          
        }
        acts = s.actionsEvents(ctx);
        
        player = s.player;
        
        maxv = - 100;
        
        acvs = acts.map((function anonymous_325(a) {
          var ns;
          var v;
          
          ns = s.next(ctx,a);
          
          v = _this.value(ctx,player,ns);
          
          return {value: v,action: a};
        }));
        
        acvs.sort((function anonymous_478() {
          
          return _this.rnd()-0.5;
        }));
        acvs.sort((function anonymous_515(a,b) {
          
          return b.value-a.value;
        }));
        if (! acvs[0].action) {
          _this.print(acvs);
          throw new Error("Action is null!");
          
          
        }
        return acvs[0].action;
        
      },
      __dummy: false
    };
  },
  decls: {"methods":{"main":{"nowait":false,"isMain":true,"vtype":{"params":[],"returnValue":null}},"play":{"nowait":false,"isMain":false,"vtype":{"params":[null,"user.State"],"returnValue":"user.Action"}}},"fields":{"value":{}}}
});
Tonyu.klass.define({
  fullName: 'user.RandomBot',
  shortName: 'RandomBot',
  namespace: 'user',
  superclass: Tonyu.classes.user.Bot,
  includes: [],
  methods: function (__superClass) {
    return {
      main :function _trc_RandomBot_main() {
        "use strict";
        var _this=this;
        
      },
      fiber$main :function* _trc_RandomBot_f_main(_thread) {
        "use strict";
        var _this=this;
        //var _arguments=Tonyu.A(arguments);
        
        
      },
      play :function _trc_RandomBot_play(ctx,s) {
        "use strict";
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
        "use strict";
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
  decls: {"methods":{"main":{"nowait":false,"isMain":true,"vtype":{"params":[],"returnValue":null}},"play":{"nowait":false,"isMain":false,"vtype":{"params":["user.Context","user.State"],"returnValue":"user.Action"}}},"fields":{}}
});
Tonyu.klass.define({
  fullName: 'user.Rational',
  shortName: 'Rational',
  namespace: 'user',
  superclass: Tonyu.classes.kernel.TObject,
  includes: [],
  methods: function (__superClass) {
    return {
      main :function _trc_Rational_main() {
        "use strict";
        var _this=this;
        
        
      },
      fiber$main :function* _trc_Rational_f_main(_thread) {
        "use strict";
        var _this=this;
        //var _arguments=Tonyu.A(arguments);
        
        
        
      },
      initialize :function _trc_Rational_initialize(q,n) {
        "use strict";
        var _this=this;
        
        _this.q=q;
        _this.n=n;
      },
      inc :function _trc_Rational_inc(qby) {
        "use strict";
        var _this=this;
        
        return new Tonyu.classes.user.Rational(_this.q+qby,_this.n+1);
      },
      fiber$inc :function* _trc_Rational_f_inc(_thread,qby) {
        "use strict";
        var _this=this;
        //var _arguments=Tonyu.A(arguments);
        
        return new Tonyu.classes.user.Rational(_this.q+qby,_this.n+1);
        
      },
      __getter__value :function _trc_Rational___getter__value() {
        "use strict";
        var _this=this;
        
        if (_this.n==0) {
          return 0;
        }
        return _this.nanc(_this.q/_this.n);
      },
      nanc :function _trc_Rational_nanc(v) {
        "use strict";
        var _this=this;
        
        if (v!==v) {
          throw new Error(_this.q+" / "+_this.n);
          
        }
        return v;
      },
      fiber$nanc :function* _trc_Rational_f_nanc(_thread,v) {
        "use strict";
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
  fullName: 'user.SanpuLinesBot',
  shortName: 'SanpuLinesBot',
  namespace: 'user',
  superclass: Tonyu.classes.user.Bot,
  includes: [],
  methods: function (__superClass) {
    return {
      main :function _trc_SanpuLinesBot_main() {
        "use strict";
        var _this=this;
        
      },
      fiber$main :function* _trc_SanpuLinesBot_f_main(_thread) {
        "use strict";
        var _this=this;
        //var _arguments=Tonyu.A(arguments);
        
        
      },
      play :function _trc_SanpuLinesBot_play(ctx,s) {
        "use strict";
        var _this=this;
        var acts;
        var a;
        
        if (! ctx) {
          throw new Error("CTX is null");
          
        }
        acts = s.actionsEvents(ctx);
        
        a = _this.spraying(acts);
        
        return a;
      },
      fiber$play :function* _trc_SanpuLinesBot_f_play(_thread,ctx,s) {
        "use strict";
        var _this=this;
        //var _arguments=Tonyu.A(arguments);
        var acts;
        var a;
        
        if (! ctx) {
          throw new Error("CTX is null");
          
        }
        acts = s.actionsEvents(ctx);
        
        a=yield* _this.fiber$spraying(_thread, acts);
        
        return a;
        
      },
      searchCorner :function _trc_SanpuLinesBot_searchCorner(stationArray) {
        "use strict";
        var _this=this;
        var biggest;
        var i;
        
        biggest = stationArray[0];
        
        for (i = 1;
         i<stationArray.length ; i++) {
          {
            if (Tonyu.globals.$stations[biggest].nexts.length<Tonyu.globals.$stations[stationArray[i]].nexts.length) {
              biggest=stationArray[i];
              
            }
          }
        }
        return biggest;
      },
      fiber$searchCorner :function* _trc_SanpuLinesBot_f_searchCorner(_thread,stationArray) {
        "use strict";
        var _this=this;
        //var _arguments=Tonyu.A(arguments);
        var biggest;
        var i;
        
        biggest = stationArray[0];
        
        for (i = 1;
         i<stationArray.length ; i++) {
          {
            if (Tonyu.globals.$stations[biggest].nexts.length<Tonyu.globals.$stations[stationArray[i]].nexts.length) {
              biggest=stationArray[i];
              
            }
          }
        }
        return biggest;
        
      },
      spraying :function _trc_SanpuLinesBot_spraying(acts) {
        "use strict";
        var _this=this;
        var choice;
        var stn;
        var kouho;
        
        
        
        kouho = [];
        
        for ([stn] of Tonyu.iterator2(acts,1)) {
          if (Tonyu.globals.$stations[stn.stext].nexts.length==Tonyu.globals.$stations[stn.stext].lines.length&&Tonyu.globals.$stations[stn.stext].midway!=true) {
            kouho.push(stn.stext);
            
          }
          
        }
        if (kouho.length>0) {
          return {stext: _this.searchCorner(_this.shuffle(kouho))};
          
        } else {
          return acts[_this.rnd(acts.length)];
          
        }
      },
      fiber$spraying :function* _trc_SanpuLinesBot_f_spraying(_thread,acts) {
        "use strict";
        var _this=this;
        //var _arguments=Tonyu.A(arguments);
        var choice;
        var stn;
        var kouho;
        
        
        
        kouho = [];
        
        for ([stn] of Tonyu.iterator2(acts,1)) {
          if (Tonyu.globals.$stations[stn.stext].nexts.length==Tonyu.globals.$stations[stn.stext].lines.length&&Tonyu.globals.$stations[stn.stext].midway!=true) {
            kouho.push(stn.stext);
            
          }
          
        }
        if (kouho.length>0) {
          return {stext: _this.searchCorner(_this.shuffle(kouho))};
          
        } else {
          return acts[_this.rnd(acts.length)];
          
        }
        
      },
      shuffle :function _trc_SanpuLinesBot_shuffle(stArray) {
        "use strict";
        var _this=this;
        var newArray;
        var choice;
        var z;
        
        newArray = [];
        
        
        
        while (true) {
          z=stArray.splice([_this.rnd(stArray.length)],1);
          newArray.push(z[0]);
          if (stArray.length==0) {
            break;
            
            
          }
          
        }
        return newArray;
      },
      fiber$shuffle :function* _trc_SanpuLinesBot_f_shuffle(_thread,stArray) {
        "use strict";
        var _this=this;
        //var _arguments=Tonyu.A(arguments);
        var newArray;
        var choice;
        var z;
        
        newArray = [];
        
        
        
        while (true) {
          z=stArray.splice([_this.rnd(stArray.length)],1);
          newArray.push(z[0]);
          if (stArray.length==0) {
            break;
            
            
          }
          
        }
        return newArray;
        
      },
      __dummy: false
    };
  },
  decls: {"methods":{"main":{"nowait":false,"isMain":true,"vtype":{"params":[],"returnValue":null}},"play":{"nowait":false,"isMain":false,"vtype":{"params":["user.Context","user.State"],"returnValue":"user.Action"}},"searchCorner":{"nowait":false,"isMain":false,"vtype":{"params":[null],"returnValue":null}},"spraying":{"nowait":false,"isMain":false,"vtype":{"params":[null],"returnValue":null}},"shuffle":{"nowait":false,"isMain":false,"vtype":{"params":[null],"returnValue":null}}},"fields":{}}
});
Tonyu.klass.define({
  fullName: 'user.SanpuStationsBot',
  shortName: 'SanpuStationsBot',
  namespace: 'user',
  superclass: Tonyu.classes.user.Bot,
  includes: [],
  methods: function (__superClass) {
    return {
      main :function _trc_SanpuStationsBot_main() {
        "use strict";
        var _this=this;
        
      },
      fiber$main :function* _trc_SanpuStationsBot_f_main(_thread) {
        "use strict";
        var _this=this;
        //var _arguments=Tonyu.A(arguments);
        
        
      },
      play :function _trc_SanpuStationsBot_play(ctx,s) {
        "use strict";
        var _this=this;
        var acts;
        var a;
        
        if (! ctx) {
          throw new Error("CTX is null");
          
        }
        acts = s.actionsEvents(ctx);
        
        a = _this.spraying(acts);
        
        return a;
      },
      fiber$play :function* _trc_SanpuStationsBot_f_play(_thread,ctx,s) {
        "use strict";
        var _this=this;
        //var _arguments=Tonyu.A(arguments);
        var acts;
        var a;
        
        if (! ctx) {
          throw new Error("CTX is null");
          
        }
        acts = s.actionsEvents(ctx);
        
        a=yield* _this.fiber$spraying(_thread, acts);
        
        return a;
        
      },
      searchCorner :function _trc_SanpuStationsBot_searchCorner(stationArray) {
        "use strict";
        var _this=this;
        var max;
        var i;
        
        max = stationArray[0];
        
        for (i = 1;
         i<stationArray.length ; i++) {
          {
            if (_this.linesAllStations(max)<_this.linesAllStations(stationArray[i])) {
              max=stationArray[i];
              
            }
          }
        }
        return max;
      },
      fiber$searchCorner :function* _trc_SanpuStationsBot_f_searchCorner(_thread,stationArray) {
        "use strict";
        var _this=this;
        //var _arguments=Tonyu.A(arguments);
        var max;
        var i;
        
        max = stationArray[0];
        
        for (i = 1;
         i<stationArray.length ; i++) {
          {
            if (_this.linesAllStations(max)<_this.linesAllStations(stationArray[i])) {
              max=stationArray[i];
              
            }
          }
        }
        return max;
        
      },
      spraying :function _trc_SanpuStationsBot_spraying(acts) {
        "use strict";
        var _this=this;
        var choice;
        var stn;
        var kouho;
        
        
        
        kouho = [];
        
        for ([stn] of Tonyu.iterator2(acts,1)) {
          if (Tonyu.globals.$stations[stn.stext].nexts.length==Tonyu.globals.$stations[stn.stext].lines.length&&Tonyu.globals.$stations[stn.stext].midway!=true) {
            kouho.push(stn.stext);
            
          }
          
        }
        if (kouho.length>0) {
          return {stext: _this.searchCorner(_this.shuffle(kouho))};
          
        } else {
          return acts[_this.rnd(acts.length)];
          
        }
      },
      fiber$spraying :function* _trc_SanpuStationsBot_f_spraying(_thread,acts) {
        "use strict";
        var _this=this;
        //var _arguments=Tonyu.A(arguments);
        var choice;
        var stn;
        var kouho;
        
        
        
        kouho = [];
        
        for ([stn] of Tonyu.iterator2(acts,1)) {
          if (Tonyu.globals.$stations[stn.stext].nexts.length==Tonyu.globals.$stations[stn.stext].lines.length&&Tonyu.globals.$stations[stn.stext].midway!=true) {
            kouho.push(stn.stext);
            
          }
          
        }
        if (kouho.length>0) {
          return {stext: _this.searchCorner(_this.shuffle(kouho))};
          
        } else {
          return acts[_this.rnd(acts.length)];
          
        }
        
      },
      shuffle :function _trc_SanpuStationsBot_shuffle(stArray) {
        "use strict";
        var _this=this;
        var newArray;
        var choice;
        var z;
        
        newArray = [];
        
        
        
        while (true) {
          z=stArray.splice([_this.rnd(stArray.length)],1);
          newArray.push(z[0]);
          if (stArray.length==0) {
            break;
            
            
          }
          
        }
        return newArray;
      },
      fiber$shuffle :function* _trc_SanpuStationsBot_f_shuffle(_thread,stArray) {
        "use strict";
        var _this=this;
        //var _arguments=Tonyu.A(arguments);
        var newArray;
        var choice;
        var z;
        
        newArray = [];
        
        
        
        while (true) {
          z=stArray.splice([_this.rnd(stArray.length)],1);
          newArray.push(z[0]);
          if (stArray.length==0) {
            break;
            
            
          }
          
        }
        return newArray;
        
      },
      linesAllStations :function _trc_SanpuStationsBot_linesAllStations(stationName) {
        "use strict";
        var _this=this;
        var sum;
        var sLines;
        var i;
        var station;
        
        sum = 0;
        
        sLines = Tonyu.globals.$stations[stationName].lines;
        
        for (i = 0;
         i<sLines.length ; i++) {
          {
            for ([station] of Tonyu.iterator2(Tonyu.globals.$stationPlace,1)) {
              if (Tonyu.globals.$stations[station.name].lines.indexOf(sLines[i])>- 1) {
                sum+=1;
                
              }
              
            }
          }
        }
        return sum;
      },
      fiber$linesAllStations :function* _trc_SanpuStationsBot_f_linesAllStations(_thread,stationName) {
        "use strict";
        var _this=this;
        //var _arguments=Tonyu.A(arguments);
        var sum;
        var sLines;
        var i;
        var station;
        
        sum = 0;
        
        sLines = Tonyu.globals.$stations[stationName].lines;
        
        for (i = 0;
         i<sLines.length ; i++) {
          {
            for ([station] of Tonyu.iterator2(Tonyu.globals.$stationPlace,1)) {
              if (Tonyu.globals.$stations[station.name].lines.indexOf(sLines[i])>- 1) {
                sum+=1;
                
              }
              
            }
          }
        }
        return sum;
        
      },
      __dummy: false
    };
  },
  decls: {"methods":{"main":{"nowait":false,"isMain":true,"vtype":{"params":[],"returnValue":null}},"play":{"nowait":false,"isMain":false,"vtype":{"params":["user.Context","user.State"],"returnValue":"user.Action"}},"searchCorner":{"nowait":false,"isMain":false,"vtype":{"params":[null],"returnValue":null}},"spraying":{"nowait":false,"isMain":false,"vtype":{"params":[null],"returnValue":null}},"shuffle":{"nowait":false,"isMain":false,"vtype":{"params":[null],"returnValue":null}},"linesAllStations":{"nowait":false,"isMain":false,"vtype":{"params":[null],"returnValue":null}}},"fields":{}}
});
Tonyu.klass.define({
  fullName: 'user.State',
  shortName: 'State',
  namespace: 'user',
  superclass: Tonyu.classes.kernel.TObject,
  includes: [Tonyu.classes.kernel.EventMod],
  methods: function (__superClass) {
    return {
      main :function _trc_State_main() {
        "use strict";
        var _this=this;
        
        
      },
      fiber$main :function* _trc_State_f_main(_thread) {
        "use strict";
        var _this=this;
        //var _arguments=Tonyu.A(arguments);
        
        
        
      },
      print :function _trc_State_print(p) {
        "use strict";
        var _this=this;
        var cp;
        
        cp = Tonyu.globals.$consolePanel;
        
        console.log.apply(console,arguments);
        cp.print.apply(cp,arguments);
      },
      fiber$print :function* _trc_State_f_print(_thread,p) {
        "use strict";
        var _this=this;
        var _arguments=Tonyu.A(arguments);
        var cp;
        
        cp = Tonyu.globals.$consolePanel;
        
        console.log.apply(console,_arguments);
        cp.print.apply(cp,_arguments);
        
      },
      next :function _trc_State_next(ctx,a) {
        "use strict";
        var _this=this;
        
        throw new Error("Abstract: メソッドnextが実装されていません");
        
      },
      fiber$next :function* _trc_State_f_next(_thread,ctx,a) {
        "use strict";
        var _this=this;
        //var _arguments=Tonyu.A(arguments);
        
        throw new Error("Abstract: メソッドnextが実装されていません");
        
        
      },
      actionsEvents :function _trc_State_actionsEvents(ctx) {
        "use strict";
        var _this=this;
        
        throw new Error("Abstract: メソッドactionsEventsが実装されていません");
        
      },
      fiber$actionsEvents :function* _trc_State_f_actionsEvents(_thread,ctx) {
        "use strict";
        var _this=this;
        //var _arguments=Tonyu.A(arguments);
        
        throw new Error("Abstract: メソッドactionsEventsが実装されていません");
        
        
      },
      gameover :function _trc_State_gameover(ctx) {
        "use strict";
        var _this=this;
        
        return _this.actionsEvents(ctx).length==0;
      },
      fiber$gameover :function* _trc_State_f_gameover(_thread,ctx) {
        "use strict";
        var _this=this;
        //var _arguments=Tonyu.A(arguments);
        
        return _this.actionsEvents(ctx).length==0;
        
      },
      id :function _trc_State_id(ctx) {
        "use strict";
        var _this=this;
        
        throw new Error("Abstract: メソッドidが実装されていません");
        
      },
      fiber$id :function* _trc_State_f_id(_thread,ctx) {
        "use strict";
        var _this=this;
        //var _arguments=Tonyu.A(arguments);
        
        throw new Error("Abstract: メソッドidが実装されていません");
        
        
      },
      playerIndex :function _trc_State_playerIndex(ctx,p) {
        "use strict";
        var _this=this;
        
        return ctx.players.indexOf(p);
      },
      fiber$playerIndex :function* _trc_State_f_playerIndex(_thread,ctx,p) {
        "use strict";
        var _this=this;
        //var _arguments=Tonyu.A(arguments);
        
        return ctx.players.indexOf(p);
        
      },
      __dummy: false
    };
  },
  decls: {"methods":{"main":{"nowait":false,"isMain":true,"vtype":{"params":[],"returnValue":null}},"print":{"nowait":false,"isMain":false,"vtype":{"params":[null],"returnValue":null}},"next":{"nowait":false,"isMain":false,"vtype":{"params":["user.Context","user.Action"],"returnValue":"user.State"}},"actionsEvents":{"nowait":false,"isMain":false,"vtype":{"params":["user.Context"],"returnValue":null}},"gameover":{"nowait":false,"isMain":false,"vtype":{"params":["user.Context"],"returnValue":null}},"id":{"nowait":false,"isMain":false,"vtype":{"params":[null],"returnValue":null}},"playerIndex":{"nowait":false,"isMain":false,"vtype":{"params":[null,null],"returnValue":null}}},"fields":{"player":{"vtype":"Number"}}}
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
        "use strict";
        var _this=this;
        
        _this.bots = [];
        
        _this.logf = _this.file("log.txt");
        
        _this.to1 = _this.rnd()*10+0.1;
        _this.to2 = _this.rnd()*10+0.1;
        
        _this.tt1 = _this.rnd(1000,5000);
        _this.tt2 = _this.rnd(1000,5000);
        
        
        for (let i = 0;
         i<1000 ; i++) {
          {
            _this.match();
          }
        }
      },
      fiber$main :function* _trc_Main_f_main(_thread) {
        "use strict";
        var _this=this;
        //var _arguments=Tonyu.A(arguments);
        
        _this.bots = [];
        
        _this.logf=yield* _this.fiber$file(_thread, "log.txt");
        
        _this.to1 = _this.rnd()*10+0.1;
        _this.to2 = _this.rnd()*10+0.1;
        
        _this.tt1 = _this.rnd(1000,5000);
        _this.tt2 = _this.rnd(1000,5000);
        
        
        for (let i = 0;
         i<1000 ; i++) {
          {
            (yield* _this.fiber$match(_thread));
          }
        }
        
      },
      value :function _trc_Main_value(ctx,player,state) {
        "use strict";
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
        "use strict";
        var _this=this;
        //var _arguments=Tonyu.A(arguments);
        
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
      match :function _trc_Main_match() {
        "use strict";
        var _this=this;
        
        _this.print("totaltimes:",_this.tt1,_this.tt2);
        _this.print("timeouts:",_this.to1,_this.to2);
        _this.bots[1]=new Tonyu.classes.user.MCTSBot({Cp: 1,expandThresh: 3,value: Tonyu.bindFunc(_this,_this.value),totalTime: _this.tt1,timeout: _this.to1});
        _this.bots[2]=new Tonyu.classes.user.MCTSBot({Cp: 1,expandThresh: 3,value: Tonyu.bindFunc(_this,_this.value),totalTime: _this.tt2,timeout: _this.to2});
        let context = new Tonyu.classes.user.Context({players: [1,2],bots: _this.bots});
        
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
        
        let g = new Tonyu.classes.user.GameMaster({context: context,state: state});
        
        _this.print(g.state+"");
        while (! g.gameover()) {
          let a = g.step();
          
          _this.print(a.x,a.y,a.dx,a.dy);
          _this.print(g.state+"");
          _this.print(_this.value(context,g.state.player,g.state));
          _this.updateEx(1);
          
        }
        _this.print(_this.tt1,_this.to1,_this.tt2,_this.to2);
        _this.print("loser is ",g.state.player);
        _this.logf.appendText(_this.tt1+","+_this.to1+","+_this.tt2+","+_this.to2+","+g.state.player+"\n");
        _this.tt1=_this.rnd(1000,5000);
        _this.tt2=_this.rnd(1000,5000);
        _this.to1=_this.rnd()*10+0.1;
        _this.to2=_this.rnd()*10+0.1;
      },
      fiber$match :function* _trc_Main_f_match(_thread) {
        "use strict";
        var _this=this;
        //var _arguments=Tonyu.A(arguments);
        
        _this.print("totaltimes:",_this.tt1,_this.tt2);
        _this.print("timeouts:",_this.to1,_this.to2);
        _this.bots[1]=new Tonyu.classes.user.MCTSBot({Cp: 1,expandThresh: 3,value: Tonyu.bindFunc(_this,_this.value),totalTime: _this.tt1,timeout: _this.to1});
        _this.bots[2]=new Tonyu.classes.user.MCTSBot({Cp: 1,expandThresh: 3,value: Tonyu.bindFunc(_this,_this.value),totalTime: _this.tt2,timeout: _this.to2});
        let context = new Tonyu.classes.user.Context({players: [1,2],bots: _this.bots});
        
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
        
        let g = new Tonyu.classes.user.GameMaster({context: context,state: state});
        
        _this.print(g.state+"");
        while (! g.gameover()) {
          let a = g.step();
          
          _this.print(a.x,a.y,a.dx,a.dy);
          _this.print(g.state+"");
          _this.print(_this.value(context,g.state.player,g.state));
          (yield* _this.fiber$updateEx(_thread, 1));
          
        }
        _this.print(_this.tt1,_this.to1,_this.tt2,_this.to2);
        _this.print("loser is ",g.state.player);
        _this.logf.appendText(_this.tt1+","+_this.to1+","+_this.tt2+","+_this.to2+","+g.state.player+"\n");
        _this.tt1=_this.rnd(1000,5000);
        _this.tt2=_this.rnd(1000,5000);
        _this.to1=_this.rnd()*10+0.1;
        _this.to2=_this.rnd()*10+0.1;
        
      },
      __dummy: false
    };
  },
  decls: {"methods":{"main":{"nowait":false,"isMain":true,"vtype":{"params":[],"returnValue":null}},"value":{"nowait":false,"isMain":false,"vtype":{"params":["user.Context","Number","user.Board"],"returnValue":null}},"match":{"nowait":false,"isMain":false,"vtype":{"params":[],"returnValue":null}}},"fields":{"bots":{},"logf":{},"to1":{},"to2":{},"tt1":{},"tt2":{},"komas":{}}}
});
Tonyu.klass.define({
  fullName: 'user.Board',
  shortName: 'Board',
  namespace: 'user',
  superclass: Tonyu.classes.user.State,
  includes: [],
  methods: function (__superClass) {
    return {
      main :function _trc_Board_main() {
        "use strict";
        var _this=this;
        
        
        
      },
      fiber$main :function* _trc_Board_f_main(_thread) {
        "use strict";
        var _this=this;
        //var _arguments=Tonyu.A(arguments);
        
        
        
        
      },
      next :function _trc_Board_next(ctx,a) {
        "use strict";
        var _this=this;
        
        let nm = _this.mat.clone();
        
        let p = _this.mat.get(a.x,a.y);
        
        nm.set(a.x,a.y,0);
        nm.set(a.x+a.dx,a.y+a.dy,p);
        let foe = 3-_this.player;
        
        return new Tonyu.classes.user.Board({mat: nm,player: foe});
      },
      fiber$next :function* _trc_Board_f_next(_thread,ctx,a) {
        "use strict";
        var _this=this;
        //var _arguments=Tonyu.A(arguments);
        
        let nm = _this.mat.clone();
        
        let p = _this.mat.get(a.x,a.y);
        
        nm.set(a.x,a.y,0);
        nm.set(a.x+a.dx,a.y+a.dy,p);
        let foe = 3-_this.player;
        
        return new Tonyu.classes.user.Board({mat: nm,player: foe});
        
      },
      actionsEvents :function _trc_Board_actionsEvents(ctx) {
        "use strict";
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
                
                if (g>=3) {
                  g-=2;
                }
                if (g!=null&&g!=p) {
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
        "use strict";
        var _this=this;
        //var _arguments=Tonyu.A(arguments);
        
        let res = [];
        
        let kings = 0;
        
        for (let [x, y, p] of Tonyu.iterator2(_this.mat,3)) {
          if (p===_this.player||p===_this.player+2) {
            let dy = (p==1||p==3)?- 1:1;
            
            for (let dx = - 1;
             dx<=1 ; dx++) {
              {
                let g = _this.mat.get(x+dx,y+dy);
                
                if (g>=3) {
                  g-=2;
                }
                if (g!=null&&g!=p) {
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
        "use strict";
        var _this=this;
        
        return _this.actionsEvents(ctx).length==0;
      },
      fiber$gameover :function* _trc_Board_f_gameover(_thread,ctx) {
        "use strict";
        var _this=this;
        //var _arguments=Tonyu.A(arguments);
        
        return _this.actionsEvents(ctx).length==0;
        
      },
      toString :function _trc_Board_toString() {
        "use strict";
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
        "use strict";
        var _this=this;
        //var _arguments=Tonyu.A(arguments);
        
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
  decls: {"methods":{"main":{"nowait":false,"isMain":true,"vtype":{"params":[],"returnValue":null}},"next":{"nowait":false,"isMain":false,"vtype":{"params":["user.Context",null],"returnValue":"user.State"}},"actionsEvents":{"nowait":false,"isMain":false,"vtype":{"params":["user.Context"],"returnValue":null}},"gameover":{"nowait":false,"isMain":false,"vtype":{"params":["user.Context"],"returnValue":null}},"toString":{"nowait":false,"isMain":false,"vtype":{"params":[],"returnValue":null}}},"fields":{"mat":{"vtype":"kernel.Matrix"},"player":{"vtype":"Number"}}}
});

//# sourceMappingURL=concat.js.map