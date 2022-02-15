"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
exports.default = TError;
;
TError.calcRowCol = function (text, pos) {
    var lines = text.split("\n");
    var pp = 0, row, col;
    for (row = 0; row < lines.length; row++) {
        pp += lines[row].length + 1;
        if (pp > pos) {
            col = pos - (pp - lines[row].length);
            break;
        }
    }
    return { row: row + 1, col: col + 1 };
};
//module.exports=TError;
