"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const parserFactory_1 = require("./parserFactory");
const tonyu1_token_1 = require("./tonyu1_token");
const Tonyu1Lang = (0, parserFactory_1.default)({ TT: tonyu1_token_1.default });
exports.default = Tonyu1Lang;
