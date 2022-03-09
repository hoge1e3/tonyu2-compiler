//import * as Parser from "./parser";
import { addRange, ALL, lazy, Parser, ParserContext, setRange, Struct } from "./parser";

const Grammar=function (context:ParserContext) {
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
	function get(name:string):Parser {
		if (defs[name]) return defs[name];
		if (lazyDefs[name]) return lazyDefs[name];
		const res=context.lazy(function () {
			const r=defs[name];
			if (!r) throw "grammar named '"+name +"' is undefined";
			return r;
		}).setName("(Lazy of "+name+")", {type:"lazy",name});
		lazyDefs[name]=res;
		typeInfos.set(res,{name,struct:{type:"lazy",name}});
		return res;
	}
	function chain<P>(parsers:P[], f:(p:P, e:P)=>P) {
		const [first,...rest]=parsers;
		let p=first;
		for (const e of rest) {
			p=f(p,e);
		}
		return p;
	}
	function traverse(val:any,visited:Set<any>/*,depth:number*/) {
		//if (depth>10) return "DEPTH";
		if (visited.has(val)) return "LOOP";
		try {
			visited.add(val);
			if (val instanceof Parser) {
				const ti=typeInfos.get(val);
				if (ti) return ti.name;
				const st=val.struct;
				if (st && st.type==="lazy") return st.name;
				const res=st ? traverse(st, visited) : val.name; //ti.struct;
				return res;
			}
			if (val instanceof Array) {
				const res=val.map((e)=>traverse(e,visited));
				return res;
			}
			if (typeof val==="object") {
				const res={};
				const keys=Object.keys(val);
				for (const k of keys) {
					res[k]=traverse(val[k],visited);
				}
				return res;
			}
			return val;

		} finally {
			visited.delete(val);
		}
	}
	function buildTypes() {
		for (const k of Object.keys(defs)) {
			const v=defs[k];
			console.log("---",k);
			console.dir(traverse( typeInfos.get(v) , new Set), {depth:null}  );
		}
	}
	function checkFirstTbl() {
		for (const k of Object.keys(defs)) {
			const v=defs[k];
			console.log("---",k);
			if (v._first) {
				const tbl=v._first;
				for (let f of Object.keys(tbl)) {
					let p=tbl[f];
					if (p._lazy) p=p._lazy.resolve();
					//console.dir({[f]: traverse( /*typeInfos.get*/(p) , new Set)}, {depth:null}  );
					console.log("  "+f+"=>", p.name);
				}
				if (tbl[ALL]) {
					let p=tbl[ALL];
					if (p._lazy) p=p._lazy.resolve();
					//console.dir({[f]: traverse( /*typeInfos.get*/(p) , new Set)}, {depth:null}  );
					console.log("  ALL=>", p.name);
				}
			} else {
				console.log("NO FIRST TBL");
			}
		}
	}
	type TypeInfo={
		name:string,
		struct: Struct|{type:"object", fields:{[key:string]:Parser}}
	}
	const typeInfos=new WeakMap<Parser, TypeInfo>();
	/*function setTypeInfo(parser, name, fields={}) {
		parser.typeInfo={name, fields};
		return parser;
	}*/
	const defs:{[key:string]:Parser}={};
	const lazyDefs:{[key:string]:Parser}={};
	return comp((name:string)=>{
		return {
			alias(parser:Parser):Parser {
				defs[name]=parser;
				typeInfos.set(parser,{name, struct:parser.struct});
				return parser;
			},
			ands(...parsers) {
				parsers=parsers.map(trans);
				const p=chain(parsers, (p,e)=>p.and(e)).tap(name);
				//p.parsers=parsers;
				defs[name]=p;
				return {
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
							if (names[i]) fields[names[i]]=parsers[i];
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
						typeInfos.set(res,{name, struct:{type:"object", fields}});
						//setTypeInfo(res,name,fields);
						defs[name]=res;
						return  res;
					}
				};
			},
			ors(...parsers) {
				parsers=parsers.map(trans);
				const p=chain(parsers, (p,e)=>p.or(e)).setName(name);
				//p.parsers=parsers;
				typeInfos.set(p,{name, struct:{type:"or", elems:parsers}});
				defs[name]=p;//setTypeInfo(p,"or",{});
				return defs[name];
			}
		};
		//return $$;
	}, {defs,get,buildTypes,checkFirstTbl});
	//return $;
};
Grammar.SUBELEMENTS=Symbol("[SUBELEMENTS]");
export=  Grammar;
