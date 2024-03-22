//	var Klass=require("../lib/Klass");

import { TonyuMethod } from "./RuntimeTypes";
import R from "../lib/R";

//const R=require("../lib/R");
interface ThreadGroup {// See Kernel/thread/ThreadGroupMod.tonyu
	setThreadGroup(g:ThreadGroup):void;
    isDeadThreadGroup(): boolean;
	killThreadGroup():void;
    objectPoolAge: any;
}
type TerminateStatus=undefined|"killed"|"exception"|"success";
type TerminateEvent=
	{status: "killed"}|
	{status: "success", value:any}|
	{status: "exception", exception:Error};
type TerminateHandler=(st:TerminateEvent)=>void;
class KilledError extends Error {
	isKilled:true
}
//const SYM_Exception=Symbol("exception");
/*type Frame={
    prev?:Frame, func:Function,
};*/
//export= function TonyuThreadF(Tonyu) {
	let idSeq=1;
	//try {window.cnts=cnts;}catch(e){}
	export class TonyuThread implements ThreadGroup {
        //frame: Frame;
		generator: Generator<any>;
        private _isDead: boolean;
        //cnt: number;
        private _isWaiting: boolean;
        fSuspended: boolean;
        //tryStack: any[];
        preemptionTime: number;
        onEndHandlers: any[];
        onTerminateHandlers: TerminateHandler[];
        id: number;
        age: number;
		termStatus: TerminateStatus;
		preempted=false;
        retVal: any;
        lastEvent: any[];
        lastEx: Error;
        //catchPC: any;
        handleEx: any;
		_threadGroup: undefined|ThreadGroup;
		objectPoolAge: any;
        tGrpObjectPoolAge: any;
		constructor(public Tonyu:{currentThread:TonyuThread, globals:{[key:string]:any}}) {
			this.generator=null;
			this._isDead=false;
			//this._isAlive=true;
			//this.cnt=0;
			this._isWaiting=false;
			this.fSuspended=false;
			//this.tryStack=[];
			this.preemptionTime=Tonyu.globals.$preemptionTime||5;
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
			this._isDead=this._isDead || (!!this.termStatus) ||
			(this._threadGroup && (
					this._threadGroup.objectPoolAge!=this.tGrpObjectPoolAge ||
					this._threadGroup.isDeadThreadGroup()
			));
			return this._isDead;
		}
		isDeadThreadGroup(): boolean {
			return this.isDead();
		}
		killThreadGroup(): void {
			this.kill();
		}
		setThreadGroup(g:ThreadGroup) {// g:TonyuThread
			this._threadGroup=g;
			this.tGrpObjectPoolAge=g.objectPoolAge;
			//if (g) g.add(fb);
		}
		suspend() {
			this.fSuspended=true;
			//this.cnt=0;
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
			this.generator=method.apply(obj, args);
		}
		notifyEnd(r) {
			this.onEndHandlers.forEach(function (e) {
				e(r);
			});
			this.notifyTermination({status:"success",value:r});
		}
		notifyTermination(tst:TerminateEvent) {
			this.onTerminateHandlers.forEach((e)=>e(tst));
		}
		on(type,f) {
			if (type==="end"||type==="success") this.onEndHandlers.push(f);
			if (type==="terminate") {
				this.onTerminateHandlers.push(f);
				if (this.handleEx) delete this.handleEx;
			}
		}
		promise() {
			switch(this.termStatus) {
				case "success":
					return Promise.resolve(this.retVal);
				case "exception":
					return Promise.reject(this.lastEx);
				case "killed":
					return Promise.reject(new KilledError(this.termStatus));
				default:
			}
			return new Promise((succ,err)=>{
				this.on("terminate",(st:TerminateEvent)=>{
					if (st.status==="success") {
						succ(st.value);
					} else if (st.status==="exception"){
						err(st.exception);
					} else {
						err(new KilledError(st.status));
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
		waitEvent(obj:any, eventSpec:any[]) { // eventSpec=[EventType, arg1, arg2....]
			const fb=this;
			fb._isWaiting=true;
			fb.suspend();
			if (typeof obj.on!=="function") return;
			let h=obj.on(...eventSpec,(...args)=>{
				fb.lastEvent=args;
				fb.retVal=args[0];
				h.remove();
				fb._isWaiting=false;
				fb.stepsLoop();
			});
		}
		isWaiting() {
			return this._isWaiting;
		}
		waitFor(j:any):Promise<any> {
			var fb=this;
			fb._isWaiting=true;
			fb.suspend();
			let p=j;
			if (p instanceof TonyuThread) p=p.promise();
			return Promise.resolve(p).then(function (r) {
				fb.retVal=r;
				fb.lastEx=null;
				fb._isWaiting=false;
				fb.stepsLoop();
			}).then(e=>e,function (e) {
				e=fb.wrapError(e);
				fb.lastEx=e;
				fb._isWaiting=false;
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
			if (fb.isWaiting()) {
				throw new Error("Illegal state: Cannot step while awaiting.");
			}
			if (fb.isDead()) return;
			const sv=this.Tonyu.currentThread;
			this.Tonyu.currentThread=fb;
			const lim=performance.now()+fb.preemptionTime;
			fb.preempted=false;
			fb.fSuspended=false;
			let awaited=null;
			try {
				while (performance.now()<lim && !this.fSuspended) {
					const n=this.generator.next();
					if (n.done) {
						this.termStatus="success";
						this.retVal=n.value;
						this.notifyEnd(this.retVal);
						break;
					}	
					if (n.value) {
						awaited=n.value;
						break;
					}
				}
				fb.preempted= (!awaited) && (!this.fSuspended) && this.isAlive();
			} catch (e){
				return this.exception(e);
			} finally {
				this.Tonyu.currentThread=sv;
				if (awaited) {
					//console.log("AWAIT!", awaited);
					return this.waitFor(awaited);
				}
			}
		}
		exception(e:Error) {
			this.termStatus="exception";
			this.lastEx=e;
			this.kill();
			if (this.handleEx) this.handleEx(e);
			else this.notifyTermination({status:"exception",exception:e});
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
			fb._isDead=true;
			if (!fb.termStatus) {
				fb.termStatus="killed";
				fb.notifyTermination({status:"killed"});
			}
		}
		*await(p:any) {
			this.lastEx=null;
			yield p;
			if (this.lastEx) throw this.lastEx;
			return this.retVal;
		}
	}
