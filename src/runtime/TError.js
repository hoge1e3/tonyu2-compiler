"use strict";
function TError(message, src, pos, len = 0) {
    let rc;
    const extend = (dst, src) => { for (var k in src)
        dst[k] = src[k]; return dst; };
    if (typeof src == "string") {
        rc = TError.calcRowCol(src, pos);
        message += " at " + (rc.row) + ":" + (rc.col);
        return extend(new Error(message), {
            isTError: true,
            src: {
                path: function () { return "/"; },
                name: function () { return "unknown"; },
                text: function () { return src; }
            },
            pos, row: rc.row, col: rc.col, len,
            raise: function () {
                throw this;
            }
        });
    }
    let klass = null;
    if (src && src.src) {
        klass = src;
        src = klass.src.tonyu;
    }
    if (typeof src.name !== "function" || typeof src.text !== "function") {
        throw new Error("src=" + src + " should be file object");
    }
    const s = src.text();
    rc = TError.calcRowCol(s, pos);
    message += " at " + src.name() + ":" + rc.row + ":" + rc.col;
    return extend(new Error(message), {
        isTError: true,
        src, pos, row: rc.row, col: rc.col, len, klass,
        raise: function () {
            throw this;
        }
    });
}
;
TError.calcRowCol = function (text, pos) {
    const lines = text.split("\n");
    let pp = 0, row, col;
    /*
aaa\n
bb\n
cc!cc
pp = 4  7   11
row=2  pp=11  pos=9
lines[row].length=4
    */
    for (row = 0; row < lines.length; row++) {
        const ppp = pp;
        pp += lines[row].length + 1;
        if (pp > pos) {
            col = pos - ppp;
            break;
        }
    }
    return { row: row + 1, col: col + 1 };
};
module.exports = TError;
//module.exports=TError;
