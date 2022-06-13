"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.context = exports.RawContext = void 0;
/*export= function context() {
    var c:any={};
    c.ovrFunc=function (from , to) {
        to.parent=from;
        return to;
    };
    c.enter=enter;
    var builtins={};*/
class RawContext {
    constructor() {
        this.value = {};
    }
    clear() {
        const value = this.value;
        for (let k in value) {
            delete value[k];
        }
    }
    enter(newval, act) {
        const sv = {};
        const curval = this.value;
        for (let k in newval) {
            /*if (k[0]==="$") {
                k=k.substring(1);
                sv[k]=c[k];
                c[k]=c.ovrFunc(c[k], val[k]);
            } else {*/
            sv[k] = curval[k];
            curval[k] = newval[k];
            //}
        }
        const res = act(this);
        for (let k in sv) {
            curval[k] = sv[k];
        }
        return res;
    }
}
exports.RawContext = RawContext;
function context() {
    const res = new RawContext();
    res.value = res;
    return res;
}
exports.context = context;
