"use strict";
module.exports = function StringBuilder(bufSize = 1024) {
    const buf = [""];
    function rest(lastIdx) {
        return bufSize - buf[lastIdx].length;
    }
    function validate() {
        for (let i = 0; i < buf.length - 1; i++) {
            if (buf[i].length !== bufSize) {
                console.log(buf);
                throw new Error("NO!");
            }
        }
    }
    function append(content) {
        content = content + "";
        while (content) {
            let lastIdx = buf.length - 1;
            let r = rest(lastIdx);
            if (content.length <= r) {
                buf[lastIdx] += content;
                break;
            }
            else {
                buf[lastIdx] += content.substring(0, r);
                buf.push("");
                content = content.substring(r);
            }
        }
        validate();
    }
    function rowcol(index) {
        const row = Math.floor(index / bufSize);
        const col = index % bufSize;
        return { row, col };
    }
    function replace(index, replacement) {
        replacement = replacement + "";
        if (replacement.length > bufSize) {
            throw new Error("Cannot replace over len=" + bufSize);
        }
        let start = rowcol(index);
        let end = rowcol(index + replacement.length);
        if (start.row === end.row) {
            const line = buf[start.row];
            buf[start.row] = line.substring(0, start.col) + replacement + line.substring(end.col);
        }
        else {
            const line1 = buf[start.row];
            const line2 = buf[end.row];
            const len1 = bufSize - start.col;
            const len2 = replacement.length - len1;
            buf[start.row] = line1.substring(0, start.col) + replacement.substring(0, len1);
            buf[end.row] = replacement.substring(len1) + line2.substring(len2);
        }
        validate();
    }
    function truncate(length) {
        while (true) {
            let lastIdx = buf.length - 1;
            let dec = buf[lastIdx].length - length;
            //console.log(buf,length, lastIdx,dec);
            if (dec >= 0) {
                buf[lastIdx] = buf[lastIdx].substring(0, dec);
                break;
            }
            else {
                buf.pop();
                length = -dec; // <=> l-=bl <=> l=l-bl <=> l=-(bl-l) <=> l=-dec
            }
        }
        validate();
    }
    function getLength() {
        const lastIdx = buf.length - 1;
        return bufSize * lastIdx + buf[lastIdx].length;
    }
    function last(len) {
        if (len > bufSize) {
            throw new Error("Cannot replace over len=" + bufSize);
        }
        const lastIdx = buf.length - 1;
        const deced = buf[lastIdx].length - len;
        if (deced >= 0) {
            return buf[lastIdx].substring(deced);
        }
        else {
            return buf[lastIdx - 1].substring(bufSize + deced) + buf[lastIdx];
        }
    }
    function toString() {
        return buf.join("");
    }
    return { append, replace, truncate, toString, getLength, last };
};
