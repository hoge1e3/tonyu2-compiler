"use strict";
/*define(["Grammar", "XMLBuffer", "IndentBuffer","disp", "Parser","TError"],
function (Grammar, XMLBuffer, IndentBuffer, disp, Parser,TError) {
*/
Object.defineProperty(exports, "__esModule", { value: true });
const tokenizerFactory_1 = require("./tokenizerFactory");
exports.default = (0, tokenizerFactory_1.default)({
    caseInsensitive: true,
    reserved: {
        'while': true,
        'switch': true,
        'case': true,
        'default': true,
        'break': true,
        'if': true,
        'is': true,
        'in': true,
        'else': true,
        'null': true,
        'for': true,
        'fork': true,
        'function': true,
        'constructor': true,
        'destructor': true,
        'extends': true,
        'native': true,
        'new': true,
        'return': true,
        'var': true,
    }
});
