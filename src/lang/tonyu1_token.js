"use strict";
/*define(["Grammar", "XMLBuffer", "IndentBuffer","disp", "Parser","TError"],
function (Grammar, XMLBuffer, IndentBuffer, disp, Parser,TError) {
*/
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const tokenizerFactory_1 = __importDefault(require("./tokenizerFactory"));
module.exports = tokenizerFactory_1.default({
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
