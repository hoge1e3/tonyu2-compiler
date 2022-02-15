"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const parserFactory_1 = require("./parserFactory");
const tonyu2_token_1 = require("./tonyu2_token");
const Tonyu2Lang = (0, parserFactory_1.default)({ TT: tonyu2_token_1.default });
exports.default = Tonyu2Lang;
