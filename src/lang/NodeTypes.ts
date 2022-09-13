import { NodeBase, Token } from "./parser";

/*export type Token=NodeBase &{
    type: string,
    text: string,
};
export type NodeBase={
    pos:number,
    len:number,
};*/
export type Expression=Elem|Prefix|Postfix|Infix|Trifix;
export type Prefix=NodeBase&{
    type:"prefix",
    op:Token,
    right: Expression,
};
export function isPrefix(n:TNode): n is Prefix {
	return n.type=="prefix";
}
export type Postfix=NodeBase&{
    type:"postfix",
    left: Expression,
    op:TNode,
};
export function isPostfix(n:TNode): n is Postfix {
	return n.type=="postfix";
}
export type Infix=NodeBase&{
    type:"infix",
    left: Expression,
    op:Token,
    right: Expression,
};
export function isInfix(n:TNode): n is Infix {
	return n.type=="infix";
}
export type Trifix=NodeBase&{
    type:"trifix",
    left: Expression,
    op1:Token,
    mid : Expression,
    op2:Token,
    right: Expression,
};
export function isTrifix(n:TNode): n is Trifix {
	return n.type=="trifix";
}
export type Expr=Expression;

//----

export type ArrayElem=NodeBase&{
  type: "arrayElem";
  subscript: Expression
};
export function isArrayElem(n:TNode):n is ArrayElem {
   return n && n.type==="arrayElem";
}
export type ArgList=NodeBase&{
  type: "argList";
  args: DottableExpression[]
};
export function isArgList(n:TNode):n is ArgList {
   return n && n.type==="argList";
}
export type Member=NodeBase&{
  type: "member";
  name: Token
};
export function isMember(n:TNode):n is Member {
   return n && n.type==="member";
}
export type ParenExpr=NodeBase&{
  type: "parenExpr";
  expr: Expression
};
export function isParenExpr(n:TNode):n is ParenExpr {
   return n && n.type==="parenExpr";
}
export type VarAccess=NodeBase&{
  type: "varAccess";
  name: Token
};
export function isVarAccess(n:TNode):n is VarAccess {
   return n && n.type==="varAccess";
}
export type FuncExprArg=NodeBase&{
  type: "funcExprArg";
  obj: FuncExpr
};
export function isFuncExprArg(n:TNode):n is FuncExprArg {
   return n && n.type==="funcExprArg";
}
export type ObjlitArg=NodeBase&{
  type: "objlitArg";
  obj: Objlit
};
export function isObjlitArg(n:TNode):n is ObjlitArg {
   return n && n.type==="objlitArg";
}
export type ObjOrFuncArg=ObjlitArg|FuncExprArg;
export type CallBody=Expression[];
export type Call=NodeBase&{
  type: "call";
  args: CallBody
};
export function isCall(n:TNode):n is Call {
   return n && n.type==="call";
}
export type Scall=NodeBase&{
  type: "scall";
  args: CallBody
};
export function isScall(n:TNode):n is Scall {
   return n && n.type==="scall";
}
export type NewExpr=NodeBase&{
  type: "newExpr";
  klass: VarAccess,
  params: Call|null
};
export function isNewExpr(n:TNode):n is NewExpr {
   return n && n.type==="newExpr";
}
export type SuperExpr=NodeBase&{
  type: "superExpr";
  name: Token|null,
  params: Scall
};
export function isSuperExpr(n:TNode):n is SuperExpr {
   return n && n.type==="superExpr";
}
export type Elem=Token|ParenExpr|NewExpr|SuperExpr|FuncExpr|Objlit|Arylit|VarAccess;
export type StmtList=Stmt[];
export type Exprstmt=NodeBase&{
  type: "exprstmt";
  expr: Expr
};
export function isExprstmt(n:TNode):n is Exprstmt {
   return n && n.type==="exprstmt";
}
export type Compound=NodeBase&{
  type: "compound";
  stmts: StmtList
};
export function isCompound(n:TNode):n is Compound {
   return n && n.type==="compound";
}
export type Return=NodeBase&{
  type: "return";
  value: Expr|null
};
export function isReturn(n:TNode):n is Return {
   return n && n.type==="return";
}
export type If=NodeBase&{
  type: "if";
  cond: Expr,
  then: Stmt,
  _else: Stmt|null
};
export function isIf(n:TNode):n is If {
   return n && n.type==="if";
}
export type Forin=NodeBase&{
  type: "forin";
  isVar: Token|null,
  vars: Token[],
  inof: Token,
  set: Expr
};
export function isForin(n:TNode):n is Forin {
   return n && n.type==="forin";
}
export type NormalFor=NodeBase&{
  type: "normalFor";
  init: Stmt,
  cond: Expr|null,
  next: Expr|null
};
export function isNormalFor(n:TNode):n is NormalFor {
   return n && n.type==="normalFor";
}
export type For=NodeBase&{
  type: "for";
  inFor: NormalFor|Forin,
  loop: Stmt
};
export function isFor(n:TNode):n is For {
   return n && n.type==="for";
}
export type While=NodeBase&{
  type: "while";
  cond: Expr,
  loop: Stmt
};
export function isWhile(n:TNode):n is While {
   return n && n.type==="while";
}
export type Do=NodeBase&{
  type: "do";
  loop: Stmt,
  cond: Expr
};
export function isDo(n:TNode):n is Do {
   return n && n.type==="do";
}
export type Case=NodeBase&{
  type: "case";
  value: Expr,
  stmts: StmtList
};
export function isCase(n:TNode):n is Case {
   return n && n.type==="case";
}
export type Default=NodeBase&{
  type: "default";
  stmts: StmtList
};
export function isDefault(n:TNode):n is Default {
   return n && n.type==="default";
}
export type Switch=NodeBase&{
  type: "switch";
  value: Expr,
  cases: Case[],
  defs: Default|null
};
export function isSwitch(n:TNode):n is Switch {
   return n && n.type==="switch";
}
export type Break=NodeBase&{
  type: "break";
  brk: Token
};
export function isBreak(n:TNode):n is Break {
   return n && n.type==="break";
}
export type Continue=NodeBase&{
  type: "continue";
  cont: Token
};
export function isContinue(n:TNode):n is Continue {
   return n && n.type==="continue";
}
export type Finally=NodeBase&{
  type: "finally";
  stmt: Stmt
};
export function isFinally(n:TNode):n is Finally {
   return n && n.type==="finally";
}
export type Catch=NodeBase&{
  type: "catch";
  name: Token,
  stmt: Stmt
};
export function isCatch(n:TNode):n is Catch {
   return n && n.type==="catch";
}
export type Catches=Catch|Finally;
export type Try=NodeBase&{
  type: "try";
  stmt: Stmt,
  catches: Catches[]
};
export function isTry(n:TNode):n is Try {
   return n && n.type==="try";
}
export type Throw=NodeBase&{
  type: "throw";
  ex: Expr
};
export function isThrow(n:TNode):n is Throw {
   return n && n.type==="throw";
}
export type TypeExpr=NamedTypeExpr|ArrayTypeExpr;
export type ArrayTypeExpr=NodeBase&{
    type: "arrayTypeExpr",
    element: TypeExpr;
};
export function isArrayTypeExpr(n:TNode):n is ArrayTypeExpr {
  return n && n.type==="arrayTypeExpr";
}
export type NamedTypeExpr=NodeBase&{
  type: "namedTypeExpr";
  name: Token
};
export function isNamedTypeExpr(n:TNode):n is NamedTypeExpr {
   return n && n.type==="namedTypeExpr";
}
export type TypeDecl=NodeBase&{
  type: "typeDecl";
  vtype: TypeExpr
};
export function isTypeDecl(n:TNode):n is TypeDecl {
   return n && n.type==="typeDecl";
}
export type VarDecl=NodeBase&{
  type: "varDecl";
  name: Token,
  typeDecl: TypeDecl|null,
  value: Expr|null
};
export function isVarDecl(n:TNode):n is VarDecl {
   return n && n.type==="varDecl";
}
export type VarsDecl=NodeBase&{
  type: "varsDecl";
  declPrefix: Token, // var const let
  decls: VarDecl[]
};
export function isVarsDecl(n:TNode):n is VarsDecl {
   return n && n.type==="varsDecl";
}
export type ParamDecl=NodeBase&{
  type: "paramDecl";
  dot: Token|null,
  name: Token,
  typeDecl: TypeDecl|null
};
export type DotExpr=NodeBase&{
  type:"dotExpr",
  expr: Expr,
};
export type DottableExpression=DotExpr|Expression;
export function isParamDecl(n:TNode):n is ParamDecl {
   return n && n.type==="paramDecl";
}
export type ParamDecls=NodeBase&{
  type: "paramDecls";
  params: ParamDecl[]
};
export function isParamDecls(n:TNode):n is ParamDecls {
   return n && n.type==="paramDecls";
}
export type SetterDecl=NodeBase&{
  type: "setterDecl";
  value: ParamDecl
};
export function isSetterDecl(n:TNode):n is SetterDecl {
   return n && n.type==="setterDecl";
}
export type FuncDeclHead=NodeBase&{
  type: "funcDeclHead";
  nowait: Token|null,
  ftype: Token|null,
  name: Token,
  setter: SetterDecl|null,
  params: ParamDecls|null,
  rtype: TypeDecl|null
};
export function isFuncDeclHead(n:TNode):n is FuncDeclHead {
   return n && n.type==="funcDeclHead";
}
export type FuncDecl=NodeBase&{
  type: "funcDecl";
  head: FuncDeclHead,
  body: Compound
};
export function isFuncDecl(n:TNode):n is FuncDecl {
   return n && n.type==="funcDecl";
}
export type NativeDecl=NodeBase&{
  type: "nativeDecl";
  name: Token
};
export function isNativeDecl(n:TNode):n is NativeDecl {
   return n && n.type==="nativeDecl";
}
export type IfWait=NodeBase&{
  type: "ifWait";
  then: Stmt,
  _else: Stmt|null
};
export function isIfWait(n:TNode):n is IfWait {
   return n && n.type==="ifWait";
}
export type Empty=NodeBase&{
  type: "empty";

};
export function isEmpty(n:TNode):n is Empty {
   return n && n.type==="empty";
}
export type Stmt=Return|If|For|While|Do|Break|Continue|Switch|IfWait|Try|Throw|NativeDecl|FuncDecl|Compound|Exprstmt|VarsDecl|Empty;
export type FuncExprHead=NodeBase&{
  type: "funcExprHead";
  name: Token|null,
  params: ParamDecls|null
};
export function isFuncExprHead(n:TNode):n is FuncExprHead {
   return n && n.type==="funcExprHead";
}
export type FuncExpr=NodeBase&{
  type: "funcExpr";
  head: FuncExprHead,
  body: Compound
};
export function isFuncExpr(n:TNode):n is FuncExpr {
   return n && n.type==="funcExpr";
}
export type JsonElem=NodeBase&{
  type: "jsonElem";
  key: Token,
  value: Expr|null
};
export function isJsonElem(n:TNode):n is JsonElem {
   return n && n.type==="jsonElem";
}
export type Objlit=NodeBase&{
  type: "objlit";
  elems: JsonElem[]
};
export function isObjlit(n:TNode):n is Objlit {
   return n && n.type==="objlit";
}
export type Arylit=NodeBase&{
  type: "arylit";
  elems: DottableExpression[]
};
export function isArylit(n:TNode):n is Arylit {
   return n && n.type==="arylit";
}
export type Extends=NodeBase&{
  type: "extends";
  superclassName: Token
};
export function isExtends(n:TNode):n is Extends {
   return n && n.type==="extends";
}
export type Includes=NodeBase&{
  type: "includes";
  includeClassNames: Token[]
};
export function isIncludes(n:TNode):n is Includes {
   return n && n.type==="includes";
}
export type Program=NodeBase&{
  type: "program";
  ext: Extends|null,
  incl: Includes|null,
  stmts: Stmt[]
};
export function isProgram(n:TNode):n is Program {
   return n && n.type==="program";
}
export type BackquoteText=Token&{
  type:"backquoteText",
};
export function isBackquoteText(n:TNode):n is BackquoteText {
  return n && n.type==="backquoteText";
};
export type BackquoteLiteral=NodeBase&{
  type:"backquoteLiteral",
  body:(BackquoteText|Expr)[]
};
export function isBackquoteLiteral(n:TNode):n is BackquoteLiteral {
  return n && n.type==="backquoteLiteral";
}
export type TNode=ArrayElem|ArgList|Member|ParenExpr|VarAccess|FuncExprArg|ObjlitArg|Call|Scall|NewExpr|SuperExpr|Exprstmt|Compound|Return|If|Forin|NormalFor|For|While|Do|Case|Default|Switch|Break|Continue|Finally|Catch|Try|Throw|TypeExpr|TypeDecl|VarDecl|VarsDecl|ParamDecl|ParamDecls|SetterDecl|FuncDeclHead|FuncDecl|NativeDecl|IfWait|Empty|FuncExprHead|FuncExpr|JsonElem|Objlit|Arylit|Extends|Includes|Program|Expression|BackquoteLiteral;
