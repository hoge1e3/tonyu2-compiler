"use strict";
//import * as Parser from "./parser";
const parser_1 = require("./parser");
const Grammar = function () {
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
        return (0, parser_1.lazy)(function () {
            var r = defs[name];
            if (!r)
                throw "grammar named '" + name + "' is undefined";
            return r;
        }).setName("(Lazy of " + name + ")");
    }
    function chain(parsers, f) {
        const [first, ...rest] = parsers;
        let p = first;
        for (const e of rest) {
            p = f(p, e);
        }
        return p;
    }
    function buildTypes() {
        function traverse(ti, visited, depth) {
            //if (depth>10) return "DEPTH";
            if (visited.has(ti))
                return "LOOP";
            visited.add(ti);
            if (ti instanceof parser_1.Parser) {
                const st = ti.struct;
                if (st && st.name)
                    return st.name;
                const res = st ? traverse(st, visited, depth + 1) : ti.name; //ti.struct;
                visited.delete(ti);
                return res;
            }
            if (ti instanceof Array) {
                const res = ti.map((e) => traverse(e, visited, depth + 1));
                visited.delete(ti);
                return res;
            }
            if (typeof ti === "object") {
                const res = {};
                for (const k of Object.keys(ti)) {
                    res[k] = traverse(ti[k], visited, depth + 1);
                }
                visited.delete(ti);
                return res;
            }
            visited.delete(ti);
            return ti;
        }
        for (const k of Object.keys(defs)) {
            const v = defs[k];
            console.log("---", k);
            console.dir(traverse(v.struct, new Set, 0), { depth: null });
        }
    }
    /*function setTypeInfo(parser, name, fields={}) {
        parser.typeInfo={name, fields};
        return parser;
    }*/
    const defs = {};
    return comp((name) => {
        return {
            alias(parser) {
                defs[name] = parser;
            },
            ands(...parsers) {
                parsers = parsers.map(trans);
                const p = chain(parsers, (p, e) => p.and(e)).tap(name);
                //p.parsers=parsers;
                defs[name] = p;
                return {
                    ret(...args) {
                        if (args.length == 0)
                            return p;
                        if (typeof args[0] == "function") {
                            defs[name] = p.ret(args[0]);
                            return defs[name];
                        }
                        const names = [];
                        const fields = {};
                        let fn = (e) => e; //(e){return e;};
                        for (var i = 0; i < args.length; i++) {
                            if (typeof args[i] == "function") {
                                fn = args[i];
                                break;
                            }
                            names[i] = args[i];
                            if (names[i])
                                fields[names[i]] = parsers[i];
                        }
                        const res = p.ret(function (...args) {
                            var res = { type: name };
                            res[Grammar.SUBELEMENTS] = [];
                            for (var i = 0; i < args.length; i++) {
                                var e = args[i];
                                var rg = (0, parser_1.setRange)(e);
                                (0, parser_1.addRange)(res, rg);
                                if (names[i]) {
                                    res[names[i]] = e;
                                }
                                res[Grammar.SUBELEMENTS].push(e);
                            }
                            res.toString = function () {
                                return "(" + this.type + ")";
                            };
                            return fn(res);
                        }).setName(name);
                        res.struct = { type: "object", name, fields };
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
                p.struct = { type: "or", name, elems: parsers };
                defs[name] = p; //setTypeInfo(p,"or",{});
                return defs[name];
            }
        };
        //return $$;
    }, { defs, get, buildTypes });
    //return $;
};
Grammar.SUBELEMENTS = Symbol("[SUBELEMENTS]");
module.exports = Grammar;
