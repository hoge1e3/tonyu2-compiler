//	var Klass=require("../lib/Klass");

import { TonyuMethod } from "../lang/RuntimeTypes";
import R from "../lib/R";

//const R=require("../lib/R");
interface ThreadGroup {
    isDeadThreadGroup(): boolean;
    objectPoolAge: any;
}
type Frame={
    prev?:Frame, func:Function,
};
//export= function TonyuThreadF(Tonyu) {
	let idSeq=1;
	//try {window.cnts=cnts;}catch(e){}
	export class TonyuThread {
        frame: Frame;
        private _isDead: boolean;
        cnt: number;
        private _isWaiting: boolean;
        fSuspended: boolean;
        tryStack: any[];
        preemptionTime: number;
        onEndHandlers: any[];
        onTerminateHandlers: any[];
        id: number;
        age: number;
		_threadGroup: ThreadGroup;
		termStatus: undefined|"killed"|"exception";
		preempted=false;
        retVal: any;
        lastEvent: any[];
        lastEx: any;
        catchPC: any;
        handleEx: any;
        tGrpObjectPoolAge: any;
		constructor(public Tonyu:{currentThread:TonyuThread}) {
			this.frame=null;
			this._isDead=false;
			//this._isAlive=true;
			this.cnt=0;
			this._isWaiting=false;
			this.fSuspended=false;
			this.tryStack=[];
			this.preemptionTime=60;
			this.onEndHandlers=[];
			this.onTerminateHandlers=[];
			this.id=idSeq++;
			this.age=0; // inc if object pooled
		}
		isAlive() {
			return !this.isDead();
			//return this.frame!=null && this._isAlive;
		}
		isDead() {
			this._isDead=this._isDead || (this.frame==null) ||
			(this._threadGroup && (
					this._threadGroup.objectPoolAge!=this.tGrpObjectPoolAge ||
					this._threadGroup.isDeadThreadGroup()
			));
			return this._isDead;
		}
		setThreadGroup(g:ThreadGroup) {// g:TonyuThread
			this._threadGroup=g;
			this.tGrpObjectPoolAge=g.objectPoolAge;
			//if (g) g.add(fb);
		}
		isWaiting() {
			return this._isWaiting;
		}
		suspend() {
			this.fSuspended=true;
			this.cnt=0;
		}
		enter(frameFunc: Function) {
			//var n=frameFunc.name;
			//cnts.enterC[n]=(cnts.enterC[n]||0)+1;
			this.frame={prev:this.frame, func:frameFunc};
		}
		apply(obj:any, methodName:string, args:any[]) {
			if (!args) args=[];
		    let method: TonyuMethod;
			if (typeof methodName=="string") {
				method=obj["fiber$"+methodName];
				if (!method) {
					throw new Error(R("undefinedMethod",methodName));
				}
			}
			if (typeof methodName=="function") {
                const fmethod:TonyuMethod=methodName ;
				method=fmethod.fiber;
				if (!method) {
					var n=fmethod.methodInfo ? fmethod.methodInfo.name : fmethod.name;
					throw new Error(R("notAWaitableMethod",n));
				}
			}
			args=[this].concat(args);
			var pc=0;
			return this.enter(function (th) {
				switch (pc){
				case 0:
					method.apply(obj,args);
					pc=1;break;
				case 1:
					th.termStatus="success";
					th.notifyEnd(th.retVal);
					args[0].exit();
					pc=2;break;
				}
			});
		}
		notifyEnd(r) {
			this.onEndHandlers.forEach(function (e) {
				e(r);
			});
			this.notifyTermination({status:"success",value:r});
		}
		notifyTermination(tst) {
			this.onTerminateHandlers.forEach(function (e) {
				e(tst);
			});
		}
		on(type,f) {
			if (type==="end"||type==="success") this.onEndHandlers.push(f);
			if (type==="terminate") {
				this.onTerminateHandlers.push(f);
				if (this.handleEx) delete this.handleEx;
			}
		}
		promise() {
			var fb=this;
			return new Promise(function (succ,err) {
				fb.on("terminate",function (st) {
					if (st.status==="success") {
						succ(st.value);
					} else if (st.status==="exception"){
						err(st.exception);
					} else {
						err(new Error(st.status));
					}
				});
			});
		}
		then(succ,err) {
			if (err) return this.promise().then(succ,err);
			else return this.promise().then(succ);
		}
		fail(err) {
			return this.promise().then(e=>e, err);
		}
		gotoCatch(e) {
			var fb=this;
			if (fb.tryStack.length==0) {
				fb.termStatus="exception";
				fb.kill();
				if (fb.handleEx) fb.handleEx(e);
				else fb.notifyTermination({status:"exception",exception:e});
				return;
			}
			fb.lastEx=e;
			var s=fb.tryStack.pop();
			while (fb.frame) {
				if (s.frame===fb.frame) {
					fb.catchPC=s.catchPC;
					break;
				} else {
					fb.frame=fb.frame.prev;
				}
			}
		}
		startCatch() {
			var fb=this;
			var e=fb.lastEx;
			fb.lastEx=null;
			return e;
		}
		exit(res) {
			//cnts.exitC++;
			this.frame=(this.frame ? this.frame.prev:null);
			this.retVal=res;
		}
		enterTry(catchPC) {
			var fb=this;
			fb.tryStack.push({frame:fb.frame,catchPC:catchPC});
		}
		exitTry() {
			var fb=this;
			fb.tryStack.pop();
		}
		waitEvent(obj:any, eventSpec:any[]) { // eventSpec=[EventType, arg1, arg2....]
			const fb=this;
			fb.suspend();
			if (typeof obj.on!=="function") return;
			let h=obj.on(...eventSpec,(...args)=>{
				fb.lastEvent=args;
				fb.retVal=args[0];
				h.remove();
				fb.steps();
			});
		}
		runAsync(f:Function) {
			var fb=this;
			var succ=function () {
				fb.retVal=arguments;
				fb.steps();
			};
			var err=function () {
				var msg="";
				for (var i=0; i<arguments.length; i++) {
					msg+=arguments[i]+",";
				}
				if (msg.length==0) msg="Async fail";
				var e:any=new Error(msg);
				e.args=arguments;
				fb.gotoCatch(e);
				fb.steps();
			};
			fb.suspend();
			setTimeout(function () {
				f(succ,err);
			},0);
		}
		waitFor(j:any):Promise<any> {
			var fb=this;
			fb._isWaiting=true;
			fb.suspend();
			if (j instanceof TonyuThread) j=j.promise();
			return Promise.resolve(j).then(function (r) {
				fb.retVal=r;
				fb.stepsLoop();
			}).then(e=>e,function (e) {
				fb.gotoCatch(fb.wrapError(e));
				fb.stepsLoop();
			});
		}
		wrapError(e:any) {
			if (e instanceof Error) return e;
			var re:any=new Error(e);
			re.original=e;
			return re as Error;
		}
		resume(retVal:any) {
			this.retVal=retVal;
			this.steps();
		}
		steps() {
			const fb=this;
			if (fb.isDead()) return;
			const sv=this.Tonyu.currentThread;
			this.Tonyu.currentThread=fb;
			fb.cnt=fb.preemptionTime;
			fb.preempted=false;
			fb.fSuspended=false;
			while (fb.cnt>0 && fb.frame) {
				try {
					//while (new Date().getTime()<lim) {
					while (fb.cnt-->0 && fb.frame) {
						fb.frame.func(fb);
					}
					fb.preempted= (!fb.fSuspended) && fb.isAlive();
				} catch(e) {
					fb.gotoCatch(e);
				}
			}
			this.Tonyu.currentThread=sv;
		}
		stepsLoop() {
			var fb=this;
			fb.steps();
			if (fb.preempted) {
				setTimeout(function () {
					fb.stepsLoop();
				},0);
			}
		}
		kill() {
			var fb=this;
			//fb._isAlive=false;
			fb._isDead=true;
			fb.frame=null;
			if (!fb.termStatus) {
				fb.termStatus="killed";
				fb.notifyTermination({status:"killed"});
			}
		}
		clearFrame() {
			this.frame=null;
			this.tryStack=[];
		}
	}
