"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isObjlit = exports.isJsonElem = exports.isFuncExpr = exports.isFuncExprHead = exports.isEmpty = exports.isIfWait = exports.isNativeDecl = exports.isFuncDecl = exports.isFuncDeclHead = exports.isSetterDecl = exports.isParamDecls = exports.isParamDecl = exports.isVarsDecl = exports.isVarDecl = exports.isTypeDecl = exports.isNamedTypeExpr = exports.isArrayTypeExpr = exports.isThrow = exports.isTry = exports.isCatch = exports.isFinally = exports.isContinue = exports.isBreak = exports.isSwitch = exports.isDefault = exports.isCase = exports.isDo = exports.isWhile = exports.isFor = exports.isNormalFor = exports.isForin = exports.isIf = exports.isReturn = exports.isCompound = exports.isExprstmt = exports.isSuperExpr = exports.isNewExpr = exports.isScall = exports.isCall = exports.isObjlitArg = exports.isFuncExprArg = exports.isVarAccess = exports.isParenExpr = exports.isMember = exports.isArgList = exports.isArrayElem = exports.isTrifix = exports.isInfix = exports.isPostfix = exports.isPrefix = void 0;
exports.isProgram = exports.isIncludes = exports.isExtends = exports.isArylit = void 0;
function isPrefix(n) {
    return n.type == "prefix";
}
exports.isPrefix = isPrefix;
function isPostfix(n) {
    return n.type == "postfix";
}
exports.isPostfix = isPostfix;
function isInfix(n) {
    return n.type == "infix";
}
exports.isInfix = isInfix;
function isTrifix(n) {
    return n.type == "trifix";
}
exports.isTrifix = isTrifix;
function isArrayElem(n) {
    return n && n.type === "arrayElem";
}
exports.isArrayElem = isArrayElem;
function isArgList(n) {
    return n && n.type === "argList";
}
exports.isArgList = isArgList;
function isMember(n) {
    return n && n.type === "member";
}
exports.isMember = isMember;
function isParenExpr(n) {
    return n && n.type === "parenExpr";
}
exports.isParenExpr = isParenExpr;
function isVarAccess(n) {
    return n && n.type === "varAccess";
}
exports.isVarAccess = isVarAccess;
function isFuncExprArg(n) {
    return n && n.type === "funcExprArg";
}
exports.isFuncExprArg = isFuncExprArg;
function isObjlitArg(n) {
    return n && n.type === "objlitArg";
}
exports.isObjlitArg = isObjlitArg;
function isCall(n) {
    return n && n.type === "call";
}
exports.isCall = isCall;
function isScall(n) {
    return n && n.type === "scall";
}
exports.isScall = isScall;
function isNewExpr(n) {
    return n && n.type === "newExpr";
}
exports.isNewExpr = isNewExpr;
function isSuperExpr(n) {
    return n && n.type === "superExpr";
}
exports.isSuperExpr = isSuperExpr;
function isExprstmt(n) {
    return n && n.type === "exprstmt";
}
exports.isExprstmt = isExprstmt;
function isCompound(n) {
    return n && n.type === "compound";
}
exports.isCompound = isCompound;
function isReturn(n) {
    return n && n.type === "return";
}
exports.isReturn = isReturn;
function isIf(n) {
    return n && n.type === "if";
}
exports.isIf = isIf;
function isForin(n) {
    return n && n.type === "forin";
}
exports.isForin = isForin;
function isNormalFor(n) {
    return n && n.type === "normalFor";
}
exports.isNormalFor = isNormalFor;
function isFor(n) {
    return n && n.type === "for";
}
exports.isFor = isFor;
function isWhile(n) {
    return n && n.type === "while";
}
exports.isWhile = isWhile;
function isDo(n) {
    return n && n.type === "do";
}
exports.isDo = isDo;
function isCase(n) {
    return n && n.type === "case";
}
exports.isCase = isCase;
function isDefault(n) {
    return n && n.type === "default";
}
exports.isDefault = isDefault;
function isSwitch(n) {
    return n && n.type === "switch";
}
exports.isSwitch = isSwitch;
function isBreak(n) {
    return n && n.type === "break";
}
exports.isBreak = isBreak;
function isContinue(n) {
    return n && n.type === "continue";
}
exports.isContinue = isContinue;
function isFinally(n) {
    return n && n.type === "finally";
}
exports.isFinally = isFinally;
function isCatch(n) {
    return n && n.type === "catch";
}
exports.isCatch = isCatch;
function isTry(n) {
    return n && n.type === "try";
}
exports.isTry = isTry;
function isThrow(n) {
    return n && n.type === "throw";
}
exports.isThrow = isThrow;
function isArrayTypeExpr(n) {
    return n && n.type === "arrayTypeExpr";
}
exports.isArrayTypeExpr = isArrayTypeExpr;
function isNamedTypeExpr(n) {
    return n && n.type === "namedTypeExpr";
}
exports.isNamedTypeExpr = isNamedTypeExpr;
function isTypeDecl(n) {
    return n && n.type === "typeDecl";
}
exports.isTypeDecl = isTypeDecl;
function isVarDecl(n) {
    return n && n.type === "varDecl";
}
exports.isVarDecl = isVarDecl;
function isVarsDecl(n) {
    return n && n.type === "varsDecl";
}
exports.isVarsDecl = isVarsDecl;
function isParamDecl(n) {
    return n && n.type === "paramDecl";
}
exports.isParamDecl = isParamDecl;
function isParamDecls(n) {
    return n && n.type === "paramDecls";
}
exports.isParamDecls = isParamDecls;
function isSetterDecl(n) {
    return n && n.type === "setterDecl";
}
exports.isSetterDecl = isSetterDecl;
function isFuncDeclHead(n) {
    return n && n.type === "funcDeclHead";
}
exports.isFuncDeclHead = isFuncDeclHead;
function isFuncDecl(n) {
    return n && n.type === "funcDecl";
}
exports.isFuncDecl = isFuncDecl;
function isNativeDecl(n) {
    return n && n.type === "nativeDecl";
}
exports.isNativeDecl = isNativeDecl;
function isIfWait(n) {
    return n && n.type === "ifWait";
}
exports.isIfWait = isIfWait;
function isEmpty(n) {
    return n && n.type === "empty";
}
exports.isEmpty = isEmpty;
function isFuncExprHead(n) {
    return n && n.type === "funcExprHead";
}
exports.isFuncExprHead = isFuncExprHead;
function isFuncExpr(n) {
    return n && n.type === "funcExpr";
}
exports.isFuncExpr = isFuncExpr;
function isJsonElem(n) {
    return n && n.type === "jsonElem";
}
exports.isJsonElem = isJsonElem;
function isObjlit(n) {
    return n && n.type === "objlit";
}
exports.isObjlit = isObjlit;
function isArylit(n) {
    return n && n.type === "arylit";
}
exports.isArylit = isArylit;
function isExtends(n) {
    return n && n.type === "extends";
}
exports.isExtends = isExtends;
function isIncludes(n) {
    return n && n.type === "includes";
}
exports.isIncludes = isIncludes;
function isProgram(n) {
    return n && n.type === "program";
}
exports.isProgram = isProgram;
