"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tokenizerFactory = exports.BQ = void 0;
const parser_1 = require("./parser");
exports.BQ = "backquote";
function tokenizerFactory({ reserved, caseInsensitive }) {
    const BQH = "backquoteHead";
    /*function profileTbl(parser, name) {
        var tbl=parser._first.tbl;
        for (var c in tbl) {
            tbl[c].profile();//(c+" of "+tbl[name);
        }
    }*/
    //const spcs={};for(i=0;i<=0xffff;i++) if (String.fromCharCode(i).match(/\s/)) spcs[i]=1;
    const spcs = {
        9: 1, 10: 1, 11: 1, 12: 1, 13: 1, 32: 1, 160: 1, 5760: 1,
        8192: 1, 8193: 1, 8194: 1, 8195: 1, 8196: 1, 8197: 1, 8198: 1, 8199: 1,
        8200: 1, 8201: 1, 8202: 1, 8232: 1, 8233: 1, 8239: 1, 8287: 1,
        12288: 1, 65279: 1
    };
    function skipSpace(str, pos) {
        const spos = pos;
        const max = str.length;
        //const spcs={9:1,10:1,11:1,12:1,13:1,32:1};
        for (; pos < max; pos++) {
            if (spcs[str.charCodeAt(pos)])
                continue;
            if (str[pos] === "/") {
                if (str[pos + 1] === "*" && readMultiComment())
                    continue;
                else if (str[pos + 1] === "/" && readSingleComment())
                    continue;
            }
            break;
        }
        return { len: pos - spos };
        function readSingleComment() {
            /* <pos>//....<pos>\n */
            for (; pos < max; pos++) {
                if (str[pos] == "\n") {
                    return true;
                }
            }
            pos--;
            return true;
        }
        function readMultiComment() {
            // <pos>/*....*<pos>/
            const spos = pos;
            pos += 2;
            for (; pos < max; pos++) {
                if (str[pos] === "*" && str[pos + 1] === "/") {
                    pos++;
                    return true;
                }
            }
            pos = spos;
        }
    }
    //var sp=Parser.StringParser;
    var SAMENAME = "SAMENAME";
    const DIV = 1, REG = 2;
    //var space=sp.reg(/^(\s*(\/\*\/?([^\/]|[^*]\/|\r|\n)*\*\/)*(\/\/.*\r?\n)*)*/).setName("space");
    var space = new parser_1.StringParser().strLike(skipSpace).setName("space");
    const sp = parser_1.StringParser.withSpace(space);
    function tk(r, name) {
        let pat;
        //let fst:string;
        if (typeof r == "string") {
            if (!name)
                name = r;
            pat = sp.str(r, name);
            //if (r.length>0) fst=r.substring(0,1);
        }
        else {
            if (!name)
                name = r + "";
            pat = sp.reg(r, name);
        }
        return pat.ret((b) => {
            var res = {};
            res.pos = b.pos;
            if (typeof res.pos != "number")
                throw "no pos for " + name + " "; //+disp(b);
            res.len = b.len;
            res.text = b.src.str.substring(res.pos, res.pos + res.len);
            if (typeof res.text != "string")
                throw "no text(" + res.text + ") for " + name + " "; //+disp(b);
            res.toString = function () {
                return this.text;
            };
            res.isToken = true;
            return res;
        });
        //if (fst) res=res.first(fst);
        //return res;//.profile();
    }
    var parsers = {}, posts = {};
    function dtk2(prev, name, parser) {
        //console.log("2reg="+prev+" name="+name);
        if (typeof parser == "string")
            parser = tk(parser, name);
        parsers[prev] = or(parsers[prev], parser.ret((res) => {
            res.type = name;
            return res;
        }).setName(name));
    }
    function dtk(prev, name, parser, post) {
        if (name == SAMENAME)
            name = parser;
        for (var m = 1; m <= prev; m *= 2) {
            //prev=1  -> m=1
            //prev=2  -> m=1x,2
            //XXprev=3  -> m=1,2,3
            if ((prev & m) != 0)
                dtk2(prev & m, name, parser);
        }
        posts[name] = post;
    }
    function or(a, b) {
        if (!a)
            return b;
        return a.or(b);
    }
    class Step {
        constructor(state) {
            this.state = state;
            this.mode = REG;
        }
        next() {
            this.state = parsers[this.mode].parse(this.state);
            if (!this.state.success)
                return null;
            const e = this.state.result[0];
            this.mode = posts[e.type];
            return e;
        }
    }
    function tokenizeBQInner(stp) {
        const res = [];
        let curl = 0;
        while (true) {
            let e = stp.next();
            if (!e)
                break;
            if (e.text === "{") {
                curl++;
            }
            else if (e.text === "}") {
                curl--;
                break;
            }
            else if (e.type === BQH) {
                tokenizeBQ(e, stp);
            }
            res.push(e);
        }
        return res;
    }
    function tokenizeBQ(bqt, stp) {
        let state = stp.state;
        let str = state.src.str;
        let pos = state.pos;
        let opos = pos;
        const subs = [];
        bqt.subs = subs;
        bqt.type = exports.BQ;
        while (pos < str.length) {
            if (str[pos] === "`") {
                if (pos - opos > 0) {
                    subs.push({ text: str.substring(opos, pos), pos: opos, len: pos - opos });
                }
                pos++;
                let ns = state.clone();
                ns.pos = pos;
                stp.state = ns;
                bqt.len = pos - bqt.pos;
                bqt.text = str.substring(bqt.pos, bqt.pos + bqt.len);
                break;
            }
            else if (str[pos] === "\\") {
                pos += 2;
            }
            else if (str.substring(pos, pos + 2) === "${") {
                if (pos - opos > 0) {
                    subs.push({ text: str.substring(opos, pos), pos: opos, len: pos - opos });
                }
                pos += 2;
                let ns = state.clone();
                ns.pos = pos;
                stp.state = ns;
                subs.push(tokenizeBQInner(stp));
                pos = opos = stp.state.pos;
            }
            else {
                pos++;
            }
        }
    }
    const all = sp.create((st) => {
        /*var mode=REG;
        var res=[];
        while (true) {
            st=parsers[mode].parse(st);
            if (!st.success) break;
            var e=st.result[0];
            mode=posts[e.type];
            //console.log("Token",e, mode);
            res.push(e);
        }*/
        let res = [];
        const stp = new Step(st);
        while (true) {
            let e = stp.next();
            if (!e)
                break;
            if (e.type === BQH) {
                tokenizeBQ(e, stp);
            }
            res.push(e);
        }
        st = stp.state;
        st = space.parse(st);
        const src = st.src;
        st = st.clone();
        if (st.pos === src.str.length) {
            st.error = null;
        }
        else {
            st.error = st.src.maxErrors.errors.join(" or ");
        }
        //st.success=st.src.maxPos==src.str.length;
        st.result[0] = res;
        console.dir(res, { depth: null });
        return st;
    }).setName("tokens:all");
    // Tested at https://codepen.io/hoge1e3/pen/NWWaaPB?editors=1010
    var num = tk(/^(?:0x[0-9a-f]+|0b[01]+|(?:[0-9]+(?:\.[0-9]*)?|\.[0-9]+)(?:e-?[0-9]+)?)/i, "'number'").ret(function (n) {
        n.type = "number";
        n.value = n.text - 0; //parseInt(n.text);
        return n;
    }).first("0123456789");
    var literal = tk({ exec: function (s) {
            var head = s.substring(0, 1);
            if (head !== '"' && head !== "'")
                return false;
            for (var i = 1; i < s.length; i++) {
                var c = s.substring(i, i + 1);
                if (c === head) {
                    return [s.substring(0, i + 1)];
                }
                else if (c === "\\") {
                    i++;
                }
            }
            return false;
        }, toString: function () { return "'literal'"; }
    }).first("\"'");
    var regex = tk({ exec: function (s) {
            if (s.substring(0, 1) !== '/')
                return false;
            for (var i = 1; i < s.length; i++) {
                var c = s.substring(i, i + 1);
                if (c === '/') {
                    var r = /^[ig]*/.exec(s.substring(i + 1));
                    return [s.substring(0, i + 1 + r[0].length)];
                }
                else if (c == "\n") {
                    return false;
                }
                else if (c === "\\") {
                    i++;
                }
            }
            return false;
        }, toString: function () { return "'regex'"; }
    }).first("/");
    dtk(REG | DIV, "number", num, DIV);
    dtk(REG, "regex", regex, DIV);
    dtk(REG | DIV, "literal", literal, DIV);
    dtk(REG | DIV, BQH, "`", DIV);
    dtk(REG | DIV, SAMENAME, "++", DIV);
    dtk(REG | DIV, SAMENAME, "--", DIV);
    dtk(REG | DIV, SAMENAME, "!==", REG);
    dtk(REG | DIV, SAMENAME, "===", REG);
    dtk(REG | DIV, SAMENAME, ">>>", REG);
    dtk(REG | DIV, SAMENAME, "+=", REG);
    dtk(REG | DIV, SAMENAME, "-=", REG);
    dtk(REG | DIV, SAMENAME, "*=", REG);
    dtk(REG | DIV, SAMENAME, "/=", REG);
    dtk(REG | DIV, SAMENAME, "%=", REG);
    dtk(REG | DIV, SAMENAME, ">=", REG);
    dtk(REG | DIV, SAMENAME, "<=", REG);
    dtk(REG | DIV, SAMENAME, "!=", REG);
    dtk(REG | DIV, SAMENAME, "==", REG);
    dtk(REG | DIV, SAMENAME, ">>", REG);
    dtk(REG | DIV, SAMENAME, "<<", REG);
    dtk(REG | DIV, SAMENAME, "&&", REG);
    dtk(REG | DIV, SAMENAME, "||", REG);
    dtk(REG | DIV, SAMENAME, "(", REG);
    dtk(REG | DIV, SAMENAME, ")", DIV);
    dtk(REG | DIV, SAMENAME, "[", REG);
    dtk(REG | DIV, SAMENAME, "]", DIV); // a[i]/3
    dtk(REG | DIV, SAMENAME, "{", REG);
    //dtk(REG|DIV,SAMENAME ,"}",REG );  // if () { .. }  /[a-z]/.exec()
    dtk(REG | DIV, SAMENAME, "}", DIV); //in tonyu:  a{x:5}/3
    dtk(REG | DIV, SAMENAME, ">", REG);
    dtk(REG | DIV, SAMENAME, "<", REG);
    dtk(REG | DIV, SAMENAME, "^", REG);
    dtk(REG | DIV, SAMENAME, "+", REG);
    dtk(REG | DIV, SAMENAME, "-", REG);
    dtk(REG | DIV, SAMENAME, ".", REG);
    dtk(REG | DIV, SAMENAME, "?", REG);
    dtk(REG | DIV, SAMENAME, "=", REG);
    dtk(REG | DIV, SAMENAME, "*", REG);
    dtk(REG | DIV, SAMENAME, "%", REG);
    dtk(DIV, SAMENAME, "/", REG);
    //dtk(DIV|REG, SAMENAME ,"^",REG );
    dtk(DIV | REG, SAMENAME, "~", REG);
    dtk(DIV | REG, SAMENAME, "\\", REG);
    dtk(DIV | REG, SAMENAME, ":", REG);
    dtk(DIV | REG, SAMENAME, ";", REG);
    dtk(DIV | REG, SAMENAME, ",", REG);
    dtk(REG | DIV, SAMENAME, "!", REG);
    dtk(REG | DIV, SAMENAME, "&", REG);
    dtk(REG | DIV, SAMENAME, "|", REG);
    var symresv = tk(/^[a-zA-Z_$][a-zA-Z0-9_$]*/, "symresv_reg").ret(function (s) {
        s.type = (s.text == "constructor" ? "tk_constructor" :
            reserved.hasOwnProperty(s.text) ? s.text : "symbol");
        if (caseInsensitive) {
            s.text = s.text.toLowerCase();
        }
        return s;
    }); //.first(ALL);
    for (var n in reserved) {
        posts[n] = REG;
    }
    posts.tk_constructor = REG;
    posts.symbol = DIV;
    parsers[REG] = or(parsers[REG], symresv).setName("Token_REG");
    parsers[DIV] = or(parsers[DIV], symresv).setName("Token_DIV");
    //parsers[REG].dispTbl();
    //parsers[DIV].dispTbl();
    //console.log(parsers[DIV]);
    function parse(str) {
        var res = sp.parse(all, str);
        if (res.success) {
        }
        else {
            console.log("Stopped with ", res.src.maxErrors);
            const maxPos = res.src.maxErrors.pos;
            console.log("Stopped at " +
                str.substring(maxPos - 5, maxPos) + "!!HERE!!" + str.substring(maxPos, maxPos + 5));
        }
        return res;
    }
    return { parse: parse, extension: "js", reserved: reserved };
}
exports.tokenizerFactory = tokenizerFactory;
;
