//import * as Parser from "./parser";
import { addRange, lazy, Parser, setRange } from "./parser";

const Grammar=function () {
	function trans(name:any) {
		if (typeof name=="string") return get(name);
		return name;
	}
	/*function tap(name) {
		return Parser.create(function (st) {
			console.log("Parsing "+name+" at "+st.pos+"  "+st.src.str.substring(st.pos, st.pos+20).replace(/[\r\n]/g,"\\n"));
			return st;
		});
	}*/
	function comp<T1,T2>(o1:T1, o2:T2):T1&T2 {
		return Object.assign(o1,o2);
	}
	function get(name:string) {
		if (defs[name]) return defs[name];
		return setTypeInfo( lazy(function () {
			var r=defs[name];
			if (!r) throw "grammar named '"+name +"' is undefined";
			return r;
		}).setName("(Lazy of "+name+")") , name);
	}
	function chain<P>(parsers:P[], f:(p:P, e:P)=>P) {
		const [first,...rest]=parsers;
		let p=first;
		for (const e of rest) {
			p=f(p,e);
		}
		return p;
	}
	function buildTypes() {
		for (const k of Object.keys(defs)) {
			const v=defs[k];
			console.log(k,  v.typeInfo);
		}
	}
	function setTypeInfo(parser, name, fields={}) {
		parser.typeInfo={name, fields};
		return parser;
	}
	const defs={};
	return comp((name:string)=>{
		return {
			ands(...parsers) {
				parsers=parsers.map(trans);
				const p=chain(parsers, (p,e)=>p.and(e)).tap(name);
				p.parsers=parsers;
				/*let p=trans(first);
				for (const e of rest) {
					p=p.and( trans(e) );
				}
				p=p.tap(name);*/
				defs[name]=p;
				return {
					/*autoNode() {
						var res=p.ret(function (...args) {
							const res={type:name};
							for (var i=0 ; i<args.length ;i++) {
								var e=args[i];
								var rg=Parser.setRange(e);
								Parser.addRange(res, rg);
								res["-element"+i]=e;
							}
							res.toString=function () {
								return "("+this.type+")";
							};
						}).setName(name);
						defs[name]=res;
						return res;
					},*/
					ret (...args) {
						if (args.length==0) return p;
						if (typeof args[0]=="function") {
							defs[name]=p.ret(args[0]);
							return defs[name];
						}
						const names=[];
						const fields={};
						let fn=(e:any)=>e;//(e){return e;};
						for (var i=0 ; i<args.length ;i++) {
							if (typeof args[i]=="function") {
								fn=args[i];
								break;
							}
							names[i]=args[i];
							fields[names[i]]=parsers[i];
						}
						const res=p.ret(function (...args) {
							var res={type:name};
							res[Grammar.SUBELEMENTS]=[];
							for (var i=0 ; i<args.length ;i++) {
								var e=args[i];
								var rg=setRange(e);
								addRange(res, rg);
								if (names[i]) {
									res[names[i]]=e;
								}
								res[Grammar.SUBELEMENTS].push(e);
							}
							res.toString=function () {
								return "("+this.type+")";
							};
							return fn(res);
						}).setName(name);
						setTypeInfo(res,name,fields);
						defs[name]=res;
						return  res;
					}
				};
			},
			ors(...parsers) {
				parsers=parsers.map(trans);
				const p=chain(parsers, (p,e)=>p.or(e)).tap(name).setName(`(ors ${name})`);
				p.parsers=parsers;
				defs[name]=setTypeInfo(p,"or",{});
				return defs[name];
			}
		};
		//return $$;
	}, {defs,get,buildTypes});
	//return $;
};
Grammar.SUBELEMENTS=Symbol("[SUBELEMENTS]");
export=  Grammar;
