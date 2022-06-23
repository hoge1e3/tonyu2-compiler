"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const parserFactory_1 = __importDefault(require("./parserFactory"));
const tonyu1_token_1 = __importDefault(require("./tonyu1_token"));
const Tonyu1Lang = parserFactory_1.default({ TT: tonyu1_token_1.default });
module.exports = Tonyu1Lang;
