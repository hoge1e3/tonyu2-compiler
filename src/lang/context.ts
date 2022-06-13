/*export= function context() {
	var c:any={};
	c.ovrFunc=function (from , to) {
		to.parent=from;
		return to;
	};
	c.enter=enter;
	var builtins={};*/
export class RawContext<T> {
	public value: Partial<T>={};
	clear() {
		const value=this.value;
		for (let k in value) {
			delete value[k];
		}
	}
	enter(newval:Partial<T>, act:(ctx:RawContext<T>)=>any) {
		const sv:Partial<T>={};
		const curval=this.value;
		for (let k in newval) {
			/*if (k[0]==="$") {
				k=k.substring(1);
				sv[k]=c[k];
				c[k]=c.ovrFunc(c[k], val[k]);
			} else {*/
				sv[k]=curval[k];
				curval[k]=newval[k];
			//}
		}
		const res=act(this);
		for (let k in sv) {
			curval[k]=sv[k];
		}
		return res;
	}
}
export type Context<T>=RawContext<T> & T;
export function context<T>():Context<T> {
	const res=new RawContext();
	res.value=res;
	return res as Context<T>;
}
