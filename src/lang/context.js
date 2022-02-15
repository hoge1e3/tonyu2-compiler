"use strict";
module.exports = function context() {
    var c = {};
    c.ovrFunc = function (from, to) {
        to.parent = from;
        return to;
    };
    c.enter = enter;
    var builtins = {};
    c.clear = function () {
        for (var k in c) {
            if (!builtins[k])
                delete c[k];
        }
    };
    for (var k in c) {
        builtins[k] = true;
    }
    return c;
    function enter(val, act) {
        var sv = {};
        for (let k in val) {
            if (k[0] === "$") {
                k = k.substring(1);
                sv[k] = c[k];
                c[k] = c.ovrFunc(c[k], val[k]);
            }
            else {
                sv[k] = c[k];
                c[k] = val[k];
            }
        }
        var res = act(c);
        for (let k in sv) {
            c[k] = sv[k];
        }
        return res;
    }
};
