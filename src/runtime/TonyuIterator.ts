//define(["Klass"], function (Klass) {
	//var Klass=require("../lib/Klass");
	const SYMIT=typeof Symbol!=="undefined" && Symbol.iterator;
	interface ITonyuIterator {
		set: any;
		i: number;
		next():boolean;
	}
	class ArrayValueIterator implements ITonyuIterator {
        set: any;
        i: number;
		constructor(set) {
			this.set=set;
			this.i=0;
		}
		next () {
			if (this.i>=this.set.length) return false;
			this[0]=this.set[this.i];
			this.i++;
			return true;
		}
	}
	class ArrayKeyValueIterator implements ITonyuIterator {
		constructor(set) {
			this.set=set;
			this.i=0;
		}
        set: any;
        i: number;
		next() {
			if (this.i>=this.set.length) return false;
			this[0]=this.i;
			this[1]=this.set[this.i];
			this.i++;
			return true;
		}
	}
	class ObjectKeyIterator implements ITonyuIterator {
        elems: any[];
		constructor(set) {
			this.elems=[];
			for (var k in set) {
				this.elems.push(k);
			}
			this.i=0;
		}
        set: any;
        i: number;
		next() {
			if (this.i>=this.elems.length) return false;
			this[0]=this.elems[this.i];
			this.i++;
			return true;
		}
	}
	class ObjectKeyValueIterator  implements ITonyuIterator{
        elems: any[];
		constructor(set) {
			this.elems=[];
			for (var k in set) {
				this.elems.push([k,set[k]]);
			}
			this.i=0;
		}
        set: any;
        i: number;
		next() {
			if (this.i>=this.elems.length) return false;
			this[0]=this.elems[this.i][0];
			this[1]=this.elems[this.i][1];
			this.i++;
			return true;
		}
	}
	class NativeIteratorWrapper implements ITonyuIterator {
        it: any;
		constructor(it) {
			this.it=it;
		}
        set: any;
        i=0;
		next() {
			const {value,done}=this.it.next();
			if (done) return false;
			this[0]=value;
			return true;
		}
	}
	export function IT(set:any, arity:number):ITonyuIterator {
		if (set && typeof set.tonyuIterator==="function") {
			// TODO: the prototype of class having tonyuIterator will iterate infinitively
			return set.tonyuIterator(arity);
		} else if (set instanceof Array) {
			if (arity==1) {
				return new ArrayValueIterator(set);
			} else {
				return new ArrayKeyValueIterator(set);
			}
		} else if (set && typeof set[SYMIT]==="function") {
			return new NativeIteratorWrapper(set[SYMIT]());
		} else if (set instanceof Object){
			if (arity==1) {
				return new ObjectKeyIterator(set);
			} else {
				return new ObjectKeyValueIterator(set);
			}
		} else {
			console.log(set);
			throw new Error(set+" is not iterable");
		}
	}
	export function IT2(set:any, arity:number):Generator<any> {
		const it=IT(set,arity);
		return function *() {
			while(it.next()) {
				const yielded=[];
				for (let i=0;i<arity;i++) {
					yielded[i]=it[i];
				}
				yield yielded;
			}
		}();
	}
		//	module.exports=IT;
//   Tonyu.iterator=IT;
//	return IT;
//});
