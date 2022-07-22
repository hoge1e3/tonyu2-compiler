"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.match = exports.isVar = exports.Z = exports.Y = exports.X = exports.W = exports.V = exports.U = exports.T = exports.S = exports.R = exports.Q = exports.P = exports.O = exports.N = exports.M = exports.L = exports.K = exports.J = exports.I = exports.H = exports.G = exports.F = exports.E = exports.D = exports.C = exports.B = exports.A = exports.v = void 0;
//var OM:any={};
const VAR = Symbol("$var"); //,THIZ="$this";
function v(name, cond = {}) {
    const res = function (cond2) {
        const cond3 = Object.assign({}, cond);
        Object.assign(cond3, cond2);
        return v(name, cond3);
    };
    res.vname = name;
    res.cond = cond;
    res[VAR] = true;
    //if (cond) res[THIZ]=cond;
    return res;
}
exports.v = v;
function isVariable(a) {
    return a[VAR];
}
//OM.isVar=isVar;
exports.A = v("A");
exports.B = v("B");
exports.C = v("C");
exports.D = v("D");
exports.E = v("E");
exports.F = v("F");
exports.G = v("G");
exports.H = v("H");
exports.I = v("I");
exports.J = v("J");
exports.K = v("K");
exports.L = v("L");
exports.M = v("M");
exports.N = v("N");
exports.O = v("O");
exports.P = v("P");
exports.Q = v("Q");
exports.R = v("R");
exports.S = v("S");
exports.T = v("T");
exports.U = v("U");
exports.V = v("V");
exports.W = v("W");
exports.X = v("X");
exports.Y = v("Y");
exports.Z = v("Z");
/*var names="ABCDEFGHIJKLMNOPQRSTUVWXYZ";
for (var i =0 ; i<names.length ; i++) {
    var c=names.substring(i,i+1);
    OM[c]=v(c);
}*/
function isVar(o) {
    return o && o[VAR];
}
exports.isVar = isVar;
function match(obj, tmpl) {
    var res = {};
    if (m(obj, tmpl, res))
        return res;
    return null;
}
exports.match = match;
;
function m(obj, tmpl, res) {
    if (obj === tmpl)
        return true;
    else if (obj == null)
        return false;
    else if (isVariable(tmpl)) {
        if (!m(obj, tmpl.cond, res))
            return false;
        res[tmpl.vname] = obj;
        return true;
    }
    else if (typeof obj == "string" && tmpl instanceof RegExp) {
        return obj.match(tmpl);
    }
    else if (typeof tmpl == "function") {
        return tmpl(obj, res);
    }
    else if (typeof tmpl == "object") {
        //if (typeof obj!="object") obj={$this:obj};
        for (var i in tmpl) {
            //if (i==VAR) continue;
            var oe = obj[i]; //(i==THIZ? obj :  obj[i] );
            var te = tmpl[i];
            if (!m(oe, te, res))
                return false;
        }
        /*if (tmpl[VAR]) {
            res[tmpl[VAR]]=obj;
        }*/
        return true;
    }
    return false;
}
//export= OM;
