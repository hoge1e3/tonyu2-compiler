"use strict";
const root = (function () {
    if (typeof window !== "undefined")
        return window;
    if (typeof self !== "undefined")
        return self;
    if (typeof global !== "undefined")
        return global;
    return (function () { return this; })();
})();
module.exports = root;
