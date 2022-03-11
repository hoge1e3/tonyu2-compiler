"use strict";
//import * as Parser from "./parser";
const parser_1 = require("./parser");
const Grammar = function (context) {
    function trans(name) {
        if (typeof name == "string")
            return get(name);
        return name;
    }
    /*function tap(name) {
        return Parser.create(function (st) {
            console.log("Parsing "+name+" at "+st.pos+"  "+st.src.str.substring(st.pos, st.pos+20).replace(/[\r\n]/g,"\\n"));
            return st;
        });
    }*/
    function comp(o1, o2) {
        return Object.assign(o1, o2);
    }
    function get(name) {
        if (defs[name])
            return defs[name];
        if (lazyDefs[name])
            return lazyDefs[name];
        const res = context.lazy(function () {
            const r = defs[name];
            if (!r)
                throw "grammar named '" + name + "' is undefined";
            return r;
        }).setName("(Lazy of " + name + ")", { type: "lazy", name });
        lazyDefs[name] = res;
        typeInfos.set(res, { name }); //,struct:{type:"lazy",name}});
        return res;
    }
    function chain(parsers, f) {
        const [first, ...rest] = parsers;
        let p = first;
        for (const e of rest) {
            p = f(p, e);
        }
        return p;
    }
    function traverseStruct(st, visited) {
        if (st && st.type === "lazy")
            return st.name;
        if (st && st.type === "retN") {
            return traverse(st.elems[st.index], visited);
        }
        if (st && st.type === "object") {
            const fields = {};
            for (let k in st.fields) {
                fields[k] = st.elems[st.fields[k]];
            }
            return {
                type: "object",
                fields: traverse(fields, visited),
            };
        }
        return traverse(st, visited);
    }
    function traverse(val, visited /*,depth:number*/) {
        //if (depth>10) return "DEPTH";
        if (visited.has(val))
            return "LOOP";
        try {
            visited.add(val);
            if (val instanceof parser_1.Parser) {
                const ti = typeInfos.get(val);
                if (ti)
                    return ti.name;
                const st = val.struct;
                if (st)
                    return traverseStruct(st, visited);
                return val.name;
            }
            if (val instanceof Array) {
                const res = val.map((e) => traverse(e, visited));
                return res;
            }
            if (typeof val === "object") {
                const res = {};
                const keys = Object.keys(val);
                for (const k of keys) {
                    res[k] = traverse(val[k], visited);
                }
                return res;
            }
            return val;
        }
        finally {
            visited.delete(val);
        }
    }
    function buildTypes() {
        for (const k of Object.keys(defs)) {
            const v = defs[k];
            console.log("---", k);
            console.dir(traverseStruct(v.struct, new Set), { depth: null });
        }
        let buf = "";
        function c(n) {
            return n[0].toUpperCase() + n.substring(1);
        }
        function uniq(a) {
            return Array.from(new Set(a));
        }
        function toType(st, type) {
            if (!st)
                return;
            if (st.type === "or") {
                return uniq(st.elems.map(toType)).join("|");
            }
            else if (st.type === "object") {
                return "{\n" +
                    (type ? `  type: "${type}";\n` : "") +
                    Object.keys(st.fields).map((f) => `  ${f}: ${toType(st.fields[f])}`).join(", \n") + "\n}";
            }
            else if (st.type === "opt") {
                return toType(st.elem) + "|null";
            }
            else if (st.type === "rept") {
                return toType(st.elem) + "[]";
            }
            else if (st.type === "primitive") {
                return "Token";
            }
            return c(st + "");
        }
        const cands = [];
        for (const k of Object.keys(defs)) {
            const v = defs[k];
            if (!v.struct)
                continue;
            buf += `export type ${c(k)}=${v.struct.type === "object" ? "NodeBase&" : ""}`;
            buf += toType(traverseStruct(v.struct, new Set), k);
            buf += ";\n";
            if (v.struct.type === "object") {
                buf += `export function is${c(k)}(n:Node):n is ${c(k)} {
   return n && n.type==="${k}";
}
`;
                cands.push(c(k));
            }
        }
        buf += `export type Node=${cands.join("|")};\n`;
        console.log(buf);
    }
    function checkFirstTbl() {
        for (const k of Object.keys(defs)) {
            const v = defs[k];
            console.log("---", k);
            if (v._first) {
                const tbl = v._first;
                for (let f of Object.keys(tbl)) {
                    let p = tbl[f];
                    if (p._lazy)
                        p = p._lazy.resolve();
                    //console.dir({[f]: traverse( /*typeInfos.get*/(p) , new Set)}, {depth:null}  );
                    console.log("  " + f + "=>", p.name);
                }
                if (tbl[parser_1.ALL]) {
                    let p = tbl[parser_1.ALL];
                    if (p._lazy)
                        p = p._lazy.resolve();
                    //console.dir({[f]: traverse( /*typeInfos.get*/(p) , new Set)}, {depth:null}  );
                    console.log("  ALL=>", p.name);
                }
            }
            else {
                console.log("NO FIRST TBL");
            }
        }
    }
    const typeInfos = new WeakMap();
    /*function setTypeInfo(parser, name, fields={}) {
        parser.typeInfo={name, fields};
        return parser;
    }*/
    const defs = {};
    const lazyDefs = {};
    return comp((name) => {
        return {
            alias(parser) {
                defs[name] = parser;
                typeInfos.set(parser, { name }); //, struct:parser.struct});
                return parser;
            },
            ands(..._parsers) {
                const parsers = _parsers.map(trans);
                const p = chain(parsers, (p, e) => p.and(e)).tap(name);
                //p.parsers=parsers;
                defs[name] = p;
                return {
                    ret(...args) {
                        if (args.some((e) => e === "type")) {
                            throw new Error("Cannot use field name 'type' which is reserved.");
                        }
                        /*if (false) {
                            if (args.length==0) return p;
                            const names=[];
                            const fields={};
                            for (var i=0 ; i<args.length ;i++) {
                                names[i]=args[i];
                                if (names[i]) fields[names[i]]=parsers[i];
                            }
                            const res=p.ret(function (...args) {
                                var res={type:name};
                                res[SUBELEMENTS]=[];
                                for (var i=0 ; i<args.length ;i++) {
                                    var e=args[i];
                                    var rg=setRange(e);
                                    addRange(res, rg);
                                    if (names[i]) {
                                        res[names[i]]=e;
                                    }
                                    res[SUBELEMENTS].push(e);
                                }
                                res.toString=function () {
                                    return "("+this.type+")";
                                };
                                return (res);
                            }).setName(name);
                            typeInfos.set(res,{name, struct:res.struct});
                            //setTypeInfo(res,name,fields);
                            defs[name]=res;
                            return  res;
                        }*/
                        const res0 = p.obj(...args).setName(name);
                        const res = res0.assign({
                            type: name,
                            toString: () => `(${name})`,
                        }).setAlias(res0);
                        typeInfos.set(res, { name }); //, struct:res.struct});
                        //setTypeInfo(res,name,fields);
                        defs[name] = res;
                        return res;
                    }
                };
            },
            ors(...parsers) {
                parsers = parsers.map(trans);
                const p = chain(parsers, (p, e) => p.or(e)).setName(name);
                //p.parsers=parsers;
                typeInfos.set(p, { name }); //, struct:{type:"or", elems:parsers}});
                defs[name] = p; //setTypeInfo(p,"or",{});
                return defs[name];
            }
        };
        //return $$;
    }, { defs, get, buildTypes, checkFirstTbl });
    //return $;
};
module.exports = Grammar;
