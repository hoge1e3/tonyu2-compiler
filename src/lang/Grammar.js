"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const parser_1 = __importDefault(require("./parser"));
const p = parser_1.default;
const Grammar = function () {
    function trans(name) {
        if (typeof name == "string")
            return get(name);
        return name;
    }
    function tap(name) {
        return p.Parser.create(function (st) {
            console.log("Parsing " + name + " at " + st.pos + "  " + st.src.str.substring(st.pos, st.pos + 20).replace(/[\r\n]/g, "\\n"));
            return st;
        });
    }
    function comp(o1, o2) {
        return Object.assign(o1, o2);
    }
    function get(name) {
        if (defs[name])
            return defs[name];
        return p.lazy(function () {
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
    const defs = {};
    return comp((name) => {
        return {
            ands(...parsers) {
                parsers = parsers.map(trans);
                const p = chain(parsers, (p, e) => p.and(e)).tap(name);
                p.parsers = parsers;
                /*let p=trans(first);
                for (const e of rest) {
                    p=p.and( trans(e) );
                }
                p=p.tap(name);*/
                defs[name] = p;
                return {
                    autoNode() {
                        var res = p.ret(function (...args) {
                            const res = { type: name };
                            for (var i = 0; i < args.length; i++) {
                                var e = args[i];
                                var rg = parser_1.default.setRange(e);
                                parser_1.default.addRange(res, rg);
                                res["-element" + i] = e;
                            }
                            res.toString = function () {
                                return "(" + this.type + ")";
                            };
                        }).setName(name);
                        defs[name] = res;
                        return res;
                    },
                    ret(...args) {
                        if (args.length == 0)
                            return p;
                        if (typeof args[0] == "function") {
                            defs[name] = p.ret(args[0]);
                            return defs[name];
                        }
                        const names = [];
                        let fn = (e) => e; //(e){return e;};
                        for (var i = 0; i < args.length; i++) {
                            if (typeof args[i] == "function") {
                                fn = args[i];
                                break;
                            }
                            names[i] = args[i];
                        }
                        const res = p.ret(function (...args) {
                            var res = { type: name };
                            res[Grammar.SUBELEMENTS] = [];
                            for (var i = 0; i < args.length; i++) {
                                var e = args[i];
                                var rg = parser_1.default.setRange(e);
                                parser_1.default.addRange(res, rg);
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
                        defs[name] = res;
                        return res;
                    }
                };
            },
            ors(...parsers) {
                parsers = parsers.map(trans);
                const p = chain(parsers, (p, e) => p.or(e)).tap(name);
                p.parsers = parsers;
                defs[name] = p;
                return defs[name];
            }
        };
        //return $$;
    }, { defs, get });
    //return $;
};
Grammar.SUBELEMENTS = Symbol("[SUBELEMENTS]");
module.exports = Grammar;
