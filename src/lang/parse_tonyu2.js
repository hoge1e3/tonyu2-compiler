"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const parserFactory_1 = __importDefault(require("./parserFactory"));
const tonyu2_token_1 = __importDefault(require("./tonyu2_token"));
const Tonyu2Lang = (0, parserFactory_1.default)({ TT: tonyu2_token_1.default });
module.exports = Tonyu2Lang;
