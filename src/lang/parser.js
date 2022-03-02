"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRange = exports.setRange = exports.addRange = exports.lazy = exports.TokensParser = exports.StringParser = exports.State = exports.Parser = exports.create = void 0;
const ALL = Symbol("ALL");
const options = { traceTap: false, optimizeFirst: true, profile: false,
    verboseFirst: false, traceFirstTbl: false, traceToken: false };
function dispTbl(tbl) {
    var buf = "";
    var h = {};
    if (!tbl)
        return buf;
    for (var i in tbl) { // tbl:{char:Parser}   i:char
        const n = tbl[i].name;
        if (!h[n])
            h[n] = "";
        h[n] += i;
    }
    for (let n in h) {
        buf += h[n] + "->" + n + ",";
    }
    return buf;
}
;
//var console={log:function (s) { $.consoleBuffer+=s; }};
function _debug(s) { console.log(s); }
//export function Parser
function create(parseFunc) {
    return new Parser(parseFunc);
}
exports.create = create;
;
function nc(v, name) {
    if (v == null)
        throw name + " is null!";
    return v;
}
class Parser {
    constructor(parseFunc) {
        this.parse = parseFunc;
    }
    // Parser.parse:: State->State
    static create(parserFunc) { return create(parserFunc); }
    except(f) {
        var t = this;
        return this.and(Parser.create(function (res) {
            //var res=t.parse(s);
            //if (!res.success) return res;
            if (f.apply({}, res.result)) {
                res.success = false;
            }
            return res;
        }).setName("(except " + t.name + ")", this));
    }
    noFollow(p) {
        var t = this;
        nc(p, "p");
        return this.and(Parser.create(function (res) {
            var res2 = p.parse(res);
            res.success = !res2.success;
            return res;
        }).setName("(" + t.name + " noFollow " + p.name + ")", this));
    }
    andNoUnify(next) {
        nc(next, "next"); // next==next
        var t = this; // Parser
        var res = Parser.create(function (s) {
            var r1 = t.parse(s); // r1:State
            if (!r1.success)
                return r1;
            var r2 = next.parse(r1); //r2:State
            if (r2.success) {
                r2.result = r1.result.concat(r2.result); // concat===append built in func in Array
            }
            return r2;
        });
        return res.setName("(" + this.name + " " + next.name + ")", { type: "and", first: this, next: this });
    }
    and(next) {
        const _res = this.andNoUnify(next);
        //if (!$.options.optimizeFirst) return res;
        if (!this._first)
            return _res;
        var tbl = this._first.tbl;
        var ntbl = {};
        //  tbl           ALL:a1  b:b1     c:c1
        //  next.tbl      ALL:a2           c:c2     d:d2
        //           ALL:a1>>next   b:b1>>next c:c1>>next
        for (var c in tbl) {
            ntbl[c] = tbl[c].andNoUnify(next);
        }
        if (tbl[ALL])
            ntbl[ALL] = tbl[ALL].andNoUnify(next);
        const res = Parser.fromFirst(this._first.space, ntbl);
        res.setName("(" + this.name + " >> " + next.name + ")", _res);
        if (options.verboseFirst) {
            console.log("Created aunify name=" + res.name + " tbl=" + dispTbl(ntbl));
        }
        return res;
    }
    retNoUnify(f) {
        const t = this;
        let p;
        if (typeof f == "function") {
            p = Parser.create(function (r1) {
                var r2 = r1.clone();
                r2.result = [f.apply({}, r1.result)];
                return r2;
            }).setName("retfunc");
        }
        else
            p = f;
        var res = Parser.create(function (s) {
            var r1 = t.parse(s); // r1:State
            if (!r1.success)
                return r1;
            return p.parse(r1);
        }).setName("(" + this.name + " >= " + p.name + ")");
        return res;
    }
    ret(next) {
        if (!this._first)
            return this.retNoUnify(next);
        var tbl = this._first.tbl;
        var ntbl = {};
        for (var c in tbl) {
            ntbl[c] = tbl[c].retNoUnify(next);
        }
        const res = Parser.fromFirst(this._first.space, ntbl);
        res.setName("(" + this.name + " >>= " + next.name + ")");
        if (options.verboseFirst) {
            console.log("Created runify name=" + res.name + " tbl=" + dispTbl(ntbl));
        }
        return res;
    }
    /*
    this._first={space: space, chars:String};
    this._first={space: space, tbl:{char:Parser}};
*/
    first(space, ct) {
        if (!options.optimizeFirst)
            return this;
        if (space == null)
            throw "Space is null2!";
        if (typeof ct == "string") {
            var tbl = {};
            for (var i = 0; i < ct.length; i++) {
                tbl[ct.substring(i, i + 1)] = this;
            }
            //this._first={space: space, tbl:tbl};
            return Parser.fromFirst(space, tbl).setName("(fst " + this.name + ")", this);
            //        		this._first={space: space, chars:ct};
        }
        else if (ct == null) {
            return Parser.fromFirst(space, { [ALL]: this }).setName("(fst " + this.name + ")", this);
            //this._first={space:space, tbl:{ALL:this}};
        }
        else if (typeof ct == "object") {
            throw "this._first={space: space, tbl:ct}";
        }
        return this;
    }
    firstTokens(tokens) {
        if (!options.optimizeFirst)
            return this;
        if (typeof tokens == "string")
            tokens = [tokens];
        const tbl = {};
        if (tokens) {
            for (const token of tokens) {
                tbl[token] = this;
            }
        }
        else {
            tbl[ALL] = this;
        }
        return Parser.fromFirstTokens(tbl).setName("(fstT " + this.name + ")", this);
    }
    unifyFirst(other) {
        //var thiz=this;
        function or(a, b) {
            if (!a)
                return b;
            if (!b)
                return a;
            return a.orNoUnify(b); //.checkTbl();
        }
        var tbl = {}; // tbl.* includes tbl[ALL]
        //this.checkTbl();
        //other.checkTbl();
        function mergeTbl() {
            //   {except_ALL: contains_ALL}
            var t2 = other._first.tbl;
            //before tbl={ALL:a1, b:b1, c:c1}   t2={ALL:a2,c:c2,d:d2}
            //       b1 conts a1  c1 conts a1     c2 conts a2   d2 conts a2
            //after  tbl={ALL:a1|a2 , b:b1|a2    c:c1|c2    d:a1|d2 }
            var keys = {};
            for (let k in tbl) { /*if (d) console.log("tbl.k="+k);*/
                keys[k] = 1;
            }
            for (let k in t2) { /*if (d) console.log("t2.k="+k);*/
                keys[k] = 1;
            }
            //delete keys[ALL];
            if (tbl[ALL] || t2[ALL]) {
                tbl[ALL] = or(tbl[ALL], t2[ALL]);
            }
            for (let k in keys) {
                //if (d) console.log("k="+k);
                //if (tbl[k] && !tbl[k].parse) throw "tbl["+k+"] = "+tbl[k];
                //if (t2[k] && !t2[k].parse) throw "t2["+k+"] = "+tbl[k];
                if (tbl[k] && t2[k]) {
                    tbl[k] = or(tbl[k], t2[k]);
                }
                else if (tbl[k] && !t2[k]) {
                    tbl[k] = or(tbl[k], t2[ALL]);
                }
                else if (!tbl[k] && t2[k]) {
                    tbl[k] = or(tbl[ALL], t2[k]);
                }
            }
        }
        Object.assign(tbl, this._first.tbl);
        mergeTbl();
        var res = Parser.fromFirst(this._first.space, tbl).setName("(" + this.name + ")U(" + other.name + ")", { type: "or", a: this, b: this });
        if (options.verboseFirst)
            console.log("Created unify name=" + res.name + " tbl=" + dispTbl(tbl));
        return res;
    }
    or(other) {
        nc(other, "other");
        if (this._first && other._first &&
            this._first.space && this._first.space === other._first.space) {
            return this.unifyFirst(other);
        }
        else {
            if (options.verboseFirst) {
                console.log("Cannot unify" + this.name + " || " + other.name + " " + this._first + " - " + other._first);
            }
            return this.orNoUnify(other);
        }
    }
    orNoUnify(other) {
        var t = this; // t:Parser
        var res = Parser.create(function (s) {
            var r1 = t.parse(s); // r1:State
            if (!r1.success) {
                var r2 = other.parse(s); // r2:State
                return r2;
            }
            else {
                return r1;
            }
        }).setName("(" + this.name + ")|(" + other.name + ")", { type: "or", a: this, b: this });
        return res;
    }
    setName(n, struct) {
        this.name = n;
        if (struct instanceof Parser) {
            this.struct = { type: "alias", target: struct };
        }
        else {
            this.struct = struct;
        }
        return this;
    }
    repN(min) {
        var p = this;
        if (!min)
            min = 0;
        var res = Parser.create(function (s) {
            let current = s;
            var result = [];
            while (true) {
                var next = p.parse(current);
                if (!next.success) {
                    let res;
                    if (result.length >= min) {
                        res = current.clone();
                        res.result = [result];
                        res.success = true;
                        //console.log("rep0 res="+disp(res.result));
                        return res;
                    }
                    else {
                        res = s.clone();
                        res.success = false;
                        return res;
                    }
                }
                else {
                    result.push(next.result[0]);
                    current = next;
                }
            }
        });
        //if (min>0) res._first=p._first;
        return res.setName("(" + p.name + " * " + min + ")", { type: "rept", elem: p });
    }
    rep0() { return this.repN(0); }
    rep1() { return this.repN(1); }
    opt() {
        var t = this;
        return Parser.create(function (s) {
            var r = t.parse(s);
            if (r.success) {
                return r;
            }
            else {
                s = s.clone();
                s.success = true;
                s.result = [null];
                return s;
            }
        }).setName("(" + t.name + ")?", { type: "opt", elem: t });
    }
    sep1(sep, valuesToArray) {
        var value = this;
        nc(value, "value");
        nc(sep, "sep");
        var tail = sep.and(value).ret(function (r1, r2) {
            if (valuesToArray)
                return r2;
            return { sep: r1, value: r2 };
        });
        return value.and(tail.rep0()).ret(function (r1, r2) {
            //var i;
            if (valuesToArray) {
                var r = [r1];
                for (let i in r2) {
                    r.push(r2[i]);
                }
                return r;
            }
            else {
                return { head: r1, tails: r2 };
            }
        }).setName("(sep1 " + value.name + "~~" + sep.name + ")", { type: "rept", elem: this });
    }
    sep0(s) {
        return this.sep1(s, true).opt().ret(function (r) {
            if (!r)
                return [];
            return r;
        });
    }
    tap(msg) {
        return this;
    }
    retN(i) {
        return this.ret(function () {
            return arguments[i];
        });
    }
    static fromFirst(space, tbl) {
        if (space == "TOKEN") {
            return Parser.fromFirstTokens(tbl);
        }
        var res = Parser.create(function (s0) {
            var s = space.parse(s0);
            var f = s.src.str.substring(s.pos, s.pos + 1);
            if (options.traceFirstTbl) {
                console.log(this.name + ": first=" + f + " tbl=" + (tbl[f] ? tbl[f].name : "-"));
            }
            if (tbl[f]) {
                return tbl[f].parse(s);
            }
            if (tbl[ALL])
                return tbl[ALL].parse(s);
            s.success = false;
            return s;
        });
        res._first = { space: space, tbl: tbl };
        //res.checkTbl();
        return res;
    }
    static fromFirstTokens(tbl) {
        var res = Parser.create(function (s) {
            const src = s.src;
            var t = src.tokens[s.pos];
            var f = t ? t.type : null;
            if (options.traceFirstTbl) {
                console.log(this.name + ": firstT=" + f + " tbl=" + (tbl[f] ? tbl[f].name : "-"));
            }
            if (f != null && tbl[f]) {
                return tbl[f].parse(s);
            }
            if (tbl[ALL])
                return tbl[ALL].parse(s);
            s.success = false;
            return s;
        });
        res._first = { space: "TOKEN", tbl: tbl };
        //res.checkTbl();
        return res;
    }
}
exports.Parser = Parser;
class State {
    constructor(strOrTokens, global) {
        if (strOrTokens != null) {
            //this.src={maxPos:0, global:global};// maxPos is shared by all state
            if (typeof strOrTokens == "string") {
                this.src = { maxPos: 0, global, str: strOrTokens };
            }
            if (strOrTokens instanceof Array) {
                this.src = { maxPos: 0, global, tokens: strOrTokens };
            }
            this.pos = 0;
            this.result = [];
            this.success = true;
        }
    }
    clone() {
        var s = new State();
        s.src = this.src;
        s.pos = this.pos;
        s.result = this.result.slice();
        s.success = this.success;
        return s;
    }
    updateMaxPos(npos) {
        if (npos > this.src.maxPos) {
            this.src.maxPos = npos;
        }
    }
    isSuccess() {
        return this.success;
    }
    getGlobal() {
        if (!this.src.global)
            this.src.global = {};
        return this.src.global;
    }
}
exports.State = State;
function strLike(func) {
    // func :: str,pos, state? -> {len:int, other...}  (null for no match )
    return Parser.create(function (state) {
        const src = state.src;
        const str = src.str;
        if (str == null)
            throw "strLike: str is null!";
        var spos = state.pos;
        //console.log(" strlike: "+str+" pos:"+spos);
        var r1 = func(str, spos, state);
        if (options.traceToken)
            console.log("pos=" + spos + " r=" + r1);
        if (r1) {
            if (options.traceToken)
                console.log("str:succ");
            r1.pos = spos;
            r1.src = state.src; // insert 2013/05/01
            var ns = state.clone();
            Object.assign(ns, { pos: spos + r1.len, success: true, result: [r1] });
            state.updateMaxPos(ns.pos);
            return ns;
        }
        else {
            if (options.traceToken)
                console.log("str:fail");
            state.success = false;
            return state;
        }
    }).setName("STRLIKE");
}
class StringParser {
    static str(st) {
        return this.strLike(function (str, pos) {
            if (str.substring(pos, pos + st.length) === st)
                return { len: st.length };
            return null;
        }).setName(st);
    }
    static reg(r) {
        if (!(r + "").match(/^\/\^/))
            console.log("Waring regex should have ^ at the head:" + (r + ""));
        return strLike(function (str, pos) {
            var res = r.exec(str.substring(pos));
            if (res) {
                res.len = res[0].length;
                return res;
            }
            return null;
        }).setName(r + "");
    }
    static parse(parser, str, global) {
        var st = new State(str, global);
        return parser.parse(st);
    }
}
exports.StringParser = StringParser;
StringParser.empty = Parser.create(function (state) {
    var res = state.clone();
    res.success = true;
    res.result = [null]; //{length:0, isEmpty:true}];
    return res;
}).setName("E");
StringParser.fail = Parser.create(function (s) {
    s.success = false;
    return s;
}).setName("F");
StringParser.strLike = strLike;
StringParser.eof = strLike(function (str, pos) {
    if (pos == str.length)
        return { len: 0 };
    return null;
}).setName("EOF");
//  why not eof: ? because StringParser.strLike
//$.StringParser=StringParser;
exports.TokensParser = {
    token: function (type) {
        return Parser.create(function (s) {
            const src = s.src;
            const t = src.tokens[s.pos];
            s.success = false;
            if (!t)
                return s;
            if (t.type == type) {
                s = s.clone();
                s.updateMaxPos(s.pos);
                s.pos++;
                s.success = true;
                s.result = [t];
            }
            return s;
        }).setName(type).firstTokens(type);
    },
    parse: function (parser, tokens, global) {
        var st = new State(tokens, global);
        return parser.parse(st);
    },
    eof: Parser.create(function (s) {
        const src = s.src;
        const suc = (s.pos >= src.tokens.length);
        s.success = suc;
        if (suc) {
            s = s.clone();
            s.result = [{ type: "EOF" }];
        }
        return s;
    }).setName("EOT")
};
//$.TokensParser=TokensParser;
function lazy(pf) {
    var p = null;
    return Parser.create(function (st) {
        if (!p)
            p = pf();
        if (!p)
            throw pf + " returned null!";
        this.name = pf.name;
        return p.parse(st);
    }).setName("LZ");
}
exports.lazy = lazy;
function addRange(res, newr) {
    if (newr == null)
        return res;
    if (typeof (res.pos) != "number") {
        res.pos = newr.pos;
        res.len = newr.len;
        return res;
    }
    var newEnd = newr.pos + newr.len;
    var curEnd = res.pos + res.len;
    if (newr.pos < res.pos)
        res.pos = newr.pos;
    if (newEnd > curEnd)
        res.len = newEnd - res.pos;
    return res;
}
exports.addRange = addRange;
function setRange(res) {
    if (res == null || typeof res == "string" || typeof res == "number" || typeof res == "boolean")
        return;
    var exRange = getRange(res);
    if (exRange != null)
        return res;
    for (var i in res) {
        if (!res.hasOwnProperty(i))
            continue;
        var range = setRange(res[i]);
        addRange(res, range);
    }
    return res;
}
exports.setRange = setRange;
function getRange(e) {
    if (e == null)
        return null;
    if (typeof e.pos != "number")
        return null;
    if (typeof e.len == "number")
        return e;
    return null;
}
exports.getRange = getRange;
//	return $;
//})();
//export= Parser;
