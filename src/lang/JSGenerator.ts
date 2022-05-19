import {Visitor} from "./Visitor";

import {IndentBuffer} from "./IndentBuffer";
import TError from "../runtime/TError";
import R from "../lib/R";
import assert from "../lib/assert";
import { isTonyu1 } from "./tonyu1";
import * as OM from "./ObjectMatcher";
import * as cu from "./compiler";
import {context} from "./context";
import { Annotation, C_Meta, BuilderEnv, FuncInfo, GenOptions, AnnotatedType, NativeClass, isMethodType, isMeta } from "./CompilerTypes";
import { ArgList, Arylit, Break, Call, Case, Catch, Compound, Continue, Default, Do, Exprstmt, For, Forin, FuncDecl, FuncDeclHead, FuncExpr, If, IfWait, Infix, JsonElem, NewExpr, NormalFor, Objlit, ObjlitArg, ParamDecl, ParamDecls, ParenExpr, Postfix, Prefix, Return, Scall, SuperExpr, Switch, Throw, TNode, Trifix, Try, VarAccess, VarDecl, VarsDecl, While } from "./NodeTypes";
import { Empty, Token } from "./parser";
import { DeclsInDefinition } from "../runtime/RuntimeTypes";

//export=(cu as any).JSGenerator=(function () {
// TonyuソースファイルをJavascriptに変換する
var TH="_thread",THIZ="_this", ARGS="_arguments",FIBPRE="fiber$", FRMPC="__pc", LASTPOS="$LASTPOS",CNTV="__cnt",CNTC=100;//G
var BINDF="Tonyu.bindFunc";
var INVOKE_FUNC="Tonyu.invokeMethod";
var CALL_FUNC="Tonyu.callFunc";
var CHK_NN="Tonyu.checkNonNull";
var CLASS_HEAD="Tonyu.classes.", GLOBAL_HEAD="Tonyu.globals.";
var GET_THIS="this";//"this.isTonyuObject?this:Tonyu.not_a_tonyu_object(this)";
var USE_STRICT='"use strict";%n';
var ITER="Tonyu.iterator";
var SUPER="__superClass";
/*var ScopeTypes={FIELD:"field", METHOD:"method", NATIVE:"native",//B
		LOCAL:"local", THVAR:"threadvar", PARAM:"param", GLOBAL:"global", CLASS:"class"};*/
var ScopeTypes=cu.ScopeTypes;
//var genSt=cu.newScopeType;
var stype=cu.getScopeType;
//var newScope=cu.newScope;
//var nc=cu.nullCheck;
//var genSym=cu.genSym;
var annotation3=cu.annotation;
var getMethod2=cu.getMethod;
var getDependingClasses=cu.getDependingClasses;
var getParams=cu.getParams;

//-----------
export function genJS(klass:C_Meta, env:BuilderEnv, genOptions:GenOptions) {//B
	var srcFile=klass.src.tonyu; //file object  //S
	var srcCont=srcFile.text();
	function getSource(node:TNode) {
		return cu.getSource(srcCont,node);
	}
	genOptions=genOptions||{};
	// env.codeBuffer is not recommended(if generate in parallel...?)
	var buf=genOptions.codeBuffer || (env as any).codeBuffer || new IndentBuffer({fixLazyLength:6});
	var traceIndex=genOptions.traceIndex||{};
	buf.setSrcFile(srcFile);
	var printf=buf.printf;
	type GenCtx={
		noWait: boolean,
		pc: number,
		threadAvail: boolean,
		finfo: any,
		method: any,
		closestBrk: any,
		closestCnt: any,
		inTry: boolean,
		exitTryOnJump: boolean,
	};
	var ctx=context<GenCtx>();
	var debug=false;
	//var traceTbl=env.traceTbl;
	// method := fiber | function
	const decls=klass.decls;
	const methods=decls.methods;
	// ↑ このクラスが持つフィールド，ファイバ，関数，ネイティブ変数の集まり．親クラスの宣言は含まない
	var ST=ScopeTypes;
	var fnSeq=0;
	var diagnose=env.options.compiler.diagnose;
	var genMod=env.options.compiler.genAMD;
	var doLoopCheck=!env.options.compiler.noLoopCheck;

	function annotation(node:TNode, aobj:Annotation=undefined) {//B
		return annotation3(klass.annotation,node,aobj) as Annotation;
	}
	function getClassName(klass:string|C_Meta){// should be object or short name //G
		if (typeof klass=="string") return CLASS_HEAD+(env.aliases[klass] || klass);//CFN  CLASS_HEAD+env.aliases[klass](null check)
		if (klass.builtin) return klass.fullName;// CFN klass.fullName
		return CLASS_HEAD+klass.fullName;// CFN  klass.fullName
	}
	function getClassNames(cs: C_Meta[]){//G
		return cs.map(getClassName);
		/*var res=[];
		cs.forEach(function (c) { res.push(getClassName(c)); });
		return res;*/
	}
	function enterV(obj:Partial<GenCtx>, node:TNode) {//G
		return function (buf:IndentBuffer) {
			ctx.enter(obj,function () {
				v.visit(node);
			});
		};
	}
	function varAccess(n:string, si:cu.ScopeInfo, an:Annotation) {//G
		var t=stype(si);
		if (t==ST.THVAR) {
			buf.printf("%s",TH);
		} else if (t==ST.FIELD || t==ST.PROP) {
			buf.printf("%s.%s",THIZ, n);
		} else if (t==ST.METHOD) {
			if (an && an.noBind) {
				buf.printf("%s.%s",THIZ, n);
			} else {
				buf.printf("%s(%s,%s.%s)",BINDF, THIZ, THIZ, n);
			}
		} else if (t==ST.CLASS) {
			buf.printf("%s",getClassName(n));
		} else if (t==ST.GLOBAL) {
			buf.printf("%s%s",GLOBAL_HEAD, n);
		} else if (t==ST.PARAM || t==ST.LOCAL || t==ST.NATIVE || t==ST.MODULE) {
			if (isTonyu1(env.options) && t==ST.NATIVE) {
				buf.printf("%s.%s",THIZ, n);
			} else {
				buf.printf("%s",n);
			}
		} else {
			console.log("Unknown scope type: ",t);
			throw new Error("Unknown scope type: "+t);
		}
		return si;
	}
	function noSurroundCompoundF(node:TNode) {//G
		return function () {
			noSurroundCompound.apply(this, [node]);
		};
	}
	function noSurroundCompound(node:TNode) {//G
		if (node.type=="compound") {
			ctx.enter({noWait:true},function () {
				buf.printf("%j%n", ["%n",(node as Compound).stmts]);
				// buf.printf("%{%j%n%}", ["%n",node.stmts]);
			});
		} else {
			v.visit(node);
		}
	}
	function lastPosF(node:TNode) {//G
		return function () {
			/*if (ctx.noLastPos) return;
			buf.printf("%s%s=%s;//%s%n", (env.options.compiler.commentLastPos?"//":""),
					LASTPOS, traceTbl.add(klass,node.pos ), klass.fullName+":"+node.pos);*/
		};
	}
	var THNode={type:"THNode"};//G
	const v=buf.visitor=new Visitor({//G
		THNode: function (node:Token) {
			buf.printf(TH);
		},
		dummy: function (node:TNode) {
			buf.printf("",node);
		},
		literal: function (node:Token) {
			buf.printf("%s",node.text);
		},
		paramDecl: function (node:ParamDecl) {
			buf.printf("%v",node.name);
		},
		paramDecls: function (node:ParamDecls) {
			buf.printf("(%j)",[", ",node.params]);
		},
		funcDeclHead: function (node:FuncDeclHead) {
			buf.printf("function %v %v",node.name, node.params);
		},
		funcDecl: function (node:FuncDecl) {
		},
		"return": function (node:Return) {
			if (ctx.inTry) throw TError(R("cannotWriteReturnInTryStatement"),srcFile,node.pos);
			if (!ctx.noWait) {
				if (node.value) {
					var t=annotation(node.value).fiberCall;
					if (t) {
						buf.printf(//VDC
							"%s.%s%s(%j);%n" +//FIBERCALL
							"%s=%s;return;%n" +
							"%}case %d:%{"+
							"%s.exit(%s.retVal);return;%n",
								THIZ, FIBPRE, t.N, [", ",[THNode].concat(t.A)],
								FRMPC, ctx.pc,
								ctx.pc++,
								TH,TH
						);
					} else {
						buf.printf("%s.exit(%v);return;",TH,node.value);
					}
				} else {
					buf.printf("%s.exit(%s);return;",TH,THIZ);
				}
			} else {
				if (ctx.threadAvail) {
					if (node.value) {
						buf.printf("%s.retVal=%v;return;%n",TH, node.value);
					} else {
						buf.printf("%s.retVal=%s;return;%n",TH, THIZ);
					}
				} else {
					if (node.value) {
						buf.printf("return %v;",node.value);
					} else {
						buf.printf("return %s;",THIZ);
					}

				}
			}
		},
		/*program: function (node) {
			genClass(node.stmts);
		},*/
		number: function (node) {//TODO: NumbreLiteral
			buf.printf("%s", node.value );
		},
		reservedConst: function (node:Token) {//TODO: Symbol
			if (node.text=="this") {
				buf.printf("%s",THIZ);
			} else if (node.text=="arguments" && ctx.threadAvail) {
				buf.printf("%s",ARGS);
			} else if (node.text==TH) {
				buf.printf("%s", (ctx.threadAvail)?TH:"null");
			} else {
				buf.printf("%s", node.text);
			}
		},
		varDecl: function (node:VarDecl) {
			var a=annotation(node);
			var thisForVIM=a.varInMain? THIZ+"." :"";
			if (node.value) {
				var t=(!ctx.noWait) && annotation(node).fiberCall;
				if (t) {
					assert.is(ctx.pc,Number);
					buf.printf(//VDC
						"%s.%s%s(%j);%n" +//FIBERCALL
						"%s=%s;return;%n" +/*B*/
						"%}case %d:%{"+
						"%s%v=%s.retVal;%n",
							THIZ, FIBPRE, t.N, [", ",[THNode].concat(t.A)],
							FRMPC, ctx.pc,
							ctx.pc++,
							thisForVIM, node.name, TH
					);
				} else {
					buf.printf("%s%v = %v;%n", thisForVIM, node.name, node.value);
				}
			} else {
				//buf.printf("%v", node.name);
			}
		},
		varsDecl: function (node:VarsDecl) {
			var decls=node.decls.filter(function (n) { return n.value; });
			if (decls.length>0) {
				lastPosF(node)();
				decls.forEach(function (decl) {
					buf.printf("%v",decl);
				});
			}
		},
		jsonElem: function (node:JsonElem) {
			if (node.value) {
				buf.printf("%v: %v", node.key, node.value);
			} else {
				buf.printf("%v: %f", node.key, function () {
					/*const si=*/varAccess( node.key.text, annotation(node).scopeInfo, annotation(node));
				});
			}
		},
		objlit: function (node:Objlit) {
			buf.printf("{%j}", [",", node.elems]);
		},
		arylit: function (node:Arylit) {
			buf.printf("[%j]", [",", node.elems]);
		},
		funcExpr: function (node: FuncExpr) {
			genFuncExpr(node);
		},
		parenExpr: function (node:ParenExpr) {
			buf.printf("(%v)",node.expr);
		},
		varAccess: function (node:VarAccess) {
			var n=node.name.text;
			/*const si=*/varAccess(n,annotation(node).scopeInfo, annotation(node));
		},
		exprstmt: function (node:Exprstmt) {//exprStmt
			var t:any={};
			lastPosF(node)();
			if (!ctx.noWait) {
				t=annotation(node).fiberCall || {};
			}
			if (t.type=="noRet") {
				buf.printf(
						"%s.%s%s(%j);%n" +//FIBERCALL
						"%s=%s;return;%n" +/*B*/
						"%}case %d:%{",
							THIZ, FIBPRE, t.N,  [", ",[THNode].concat(t.A)],
							FRMPC, ctx.pc,
							ctx.pc++
				);
			} else if (t.type=="ret") {
				buf.printf(//VDC
						"%s.%s%s(%j);%n" +//FIBERCALL
						"%s=%s;return;%n" +/*B*/
						"%}case %d:%{"+
						"%v%v%s.retVal;%n",
							THIZ, FIBPRE, t.N, [", ",[THNode].concat(t.A)],
							FRMPC, ctx.pc,
							ctx.pc++,
							t.L, t.O, TH
				);
			} else if (t.type=="noRetSuper") {
				const p=SUPER;//getClassName(klass.superclass);
				buf.printf(
							"%s.prototype.%s%s.apply( %s, [%j]);%n" +//FIBERCALL
							"%s=%s;return;%n" +/*B*/
							"%}case %d:%{",
							p,  FIBPRE, t.S.name.text,  THIZ,  [", ",[THNode].concat(t.A)],
								FRMPC, ctx.pc,
								ctx.pc++
					);
			} else if (t.type=="retSuper") {
				const p=SUPER;//getClassName(klass.superclass);
				buf.printf(
							"%s.prototype.%s%s.apply( %s, [%j]);%n" +//FIBERCALL
							"%s=%s;return;%n" +/*B*/
							"%}case %d:%{"+
							"%v%v%s.retVal;%n",
								p,  FIBPRE, t.S.name.text,  THIZ, [", ",[THNode].concat(t.A)],
								FRMPC, ctx.pc,
								ctx.pc++,
								t.L, t.O, TH
					);
			} else {
				buf.printf("%v;", node.expr );
			}
		},
		infix: function (node:Infix) {
			var opn=node.op.text;
			/*if (opn=="=" || opn=="+=" || opn=="-=" || opn=="*=" ||  opn=="/=" || opn=="%=" ) {
				checkLVal(node.left);
			}*/
			if (diagnose) {
				if (opn=="+" || opn=="-" || opn=="*" ||  opn=="/" || opn=="%" ) {
					buf.printf("%s(%v,%l)%v%s(%v,%l)", CHK_NN, node.left, getSource(node.left), node.op,
							CHK_NN, node.right, getSource(node.right));
					return;
				}
				if (opn=="+=" || opn=="-=" || opn=="*=" ||  opn=="/=" || opn=="%=" ) {
					buf.printf("%v%v%s(%v,%l)", node.left, node.op,
							CHK_NN, node.right, getSource(node.right));
					return;
				}
			}
			if (node.op.type==="is") {
				buf.printf("Tonyu.is(%v,%v)",node.left, node.right);
			} else {
				buf.printf("%v%v%v", node.left, node.op, node.right);
			}
		},
		trifixr:function (node:Trifix) {
			buf.printf("%v%v%v%v%v", node.left, node.op1, node.mid, node.op2, node.right);
		},
		prefix: function (node:Prefix) {
			if (node.op.text==="__typeof") {
				const a=annotation(node.right);
				console.log("__typeof",a);
				if (a.resolvedType) {
					const t=a.resolvedType;
					if (isMethodType(t)) {
						buf.printf("Tonyu.classMetas[%l].decls.methods.%s",t.method.klass.fullName, t.method.name);
					} else if (isMeta(t)) {
						buf.printf("Tonyu.classMetas[%l]",t.fullName);
					} else {
						buf.printf(t.class.name);
					}
				} else {
					buf.printf("%l","Any");
				}
				return;
			}
			buf.printf("%v %v", node.op, node.right);
		},
		postfix: function (node:Postfix) {
			var a=annotation(node);
			if (diagnose) {
				if (a.myMethodCall) {
					const mc=a.myMethodCall;
					var si=mc.scopeInfo;
					var st=stype(si);
					if (st==ST.FIELD || st==ST.PROP || st==ST.METHOD) {
						buf.printf("%s(%s, %l, [%j], %l )", INVOKE_FUNC,THIZ, mc.name, [",",mc.args],"this");
					} else {
						buf.printf("%s(%v, [%j], %l)", CALL_FUNC, node.left, [",",mc.args], getSource(node.left));
					}
					return;
				} else if (a.othersMethodCall) {
					var oc=a.othersMethodCall;
					buf.printf("%s(%v, %l, [%j], %l )", INVOKE_FUNC, oc.target, oc.name, [",",oc.args],getSource(oc.target));
					return;
				} else if (a.memberAccess) {
					var ma=a.memberAccess;
					buf.printf("%s(%v,%l).%s", CHK_NN, ma.target, getSource(ma.target), ma.name );
					return;
				}
			} else if (a.myMethodCall) {
				const mc=a.myMethodCall;
				const si=mc.scopeInfo;
				const st=stype(si);
				if (st==ST.METHOD) {
					buf.printf("%s.%s(%j)",THIZ, mc.name, [",",mc.args]);
					return;
				}
			}
			buf.printf("%v%v", node.left, node.op);
		},
		"break": function (node:Break) {
			if (!ctx.noWait) {
				if (ctx.inTry && ctx.exitTryOnJump) throw TError(R("cannotWriteBreakInTryStatement"),srcFile,node.pos);
				if (ctx.closestBrk) {
					buf.printf("%s=%z; break;%n", FRMPC, ctx.closestBrk);
				} else {
					throw TError( R("breakShouldBeUsedInIterationOrSwitchStatement") , srcFile, node.pos);
				}
			} else {
				buf.printf("break;%n");
			}
		},
		"continue": function (node:Continue) {
			if (!ctx.noWait) {
				if (ctx.inTry && ctx.exitTryOnJump) throw TError(R("cannotWriteContinueInTryStatement"),srcFile,node.pos);
				if ( typeof (ctx.closestCnt)=="number" ) {
					buf.printf("%s=%s; break;%n", FRMPC, ctx.closestCnt);
				} else if (ctx.closestCnt) {
					buf.printf("%s=%z; break;%n", FRMPC, ctx.closestCnt);
				} else {
					throw TError( R("continueShouldBeUsedInIterationStatement") , srcFile, node.pos);
				}
			} else {
				buf.printf("continue;%n");
			}
		},
		"try": function (node:Try) {
			var an=annotation(node);
			if (!ctx.noWait &&
					(an.fiberCallRequired || an.hasJump || an.hasReturn)) {
				//buf.printf("/*try catch in wait mode is not yet supported*/%n");
				if (node.catches.length!=1 || node.catches[0].type!="catch") {
					throw TError(R("cannotWriteTwoOrMoreCatch"),srcFile,node.pos);
				}
				var ct=node.catches[0];
				var catchPos:any={},finPos:any={};
				buf.printf("%s.enterTry(%z);%n",TH,catchPos);
				buf.printf("%f", enterV({inTry:true, exitTryOnJump:true},node.stmt) );
				buf.printf("%s.exitTry();%n",TH);
				buf.printf("%s=%z;break;%n",FRMPC,finPos);
				buf.printf("%}case %f:%{",function (){
						buf.print(catchPos.put(ctx.pc++));
				});
				buf.printf("%s=%s.startCatch();%n",ct.name.text, TH);
				//buf.printf("%s.exitTry();%n",TH);
				buf.printf("%v%n", ct.stmt);
				buf.printf("%}case %f:%{",function (){
					buf.print(finPos.put(ctx.pc++));
				});
			} else {
				ctx.enter({noWait:true}, function () {
					buf.printf("try {%{%f%n%}} ",
							noSurroundCompoundF(node.stmt));
					node.catches.forEach(v.visit);
				});
			}
		},
		"catch": function (node: Catch) {
			buf.printf("catch (%s) {%{%f%n%}}",node.name.text, noSurroundCompoundF(node.stmt));
		},
		"throw": function (node: Throw) {
			buf.printf("throw %v;%n",node.ex);
		},
		"switch": function (node: Switch) {
			if (!ctx.noWait) {
				const labels=node.cases.map(()=>buf.lazy());
				if (node.defs) labels.push(buf.lazy());
				var brkpos=buf.lazy();
				buf.printf(
						"switch (%v) {%{"+
						"%f"+
						"%n%}}%n"+
						"break;%n",
						node.value,
						function setpc() {
							var i=0;
							node.cases.forEach(function (c:Case) {
								buf.printf("%}case %v:%{%s=%z;break;%n", c.value, FRMPC,labels[i]);
								i++;
							});
							if (node.defs) {
								buf.printf("%}default:%{%s=%z;break;%n", FRMPC, labels[i]);
							} else {
								buf.printf("%}default:%{%s=%z;break;%n", FRMPC, brkpos);
							}
						});
				ctx.enter({closestBrk:brkpos}, function () {
					var i=0;
					node.cases.forEach(function (c:Case) {
						buf.printf(
								"%}case %f:%{"+
								"%j%n",
								function () { buf.print(labels[i].put(ctx.pc++)); },
								["%n",c.stmts]);
						i++;
					});
					if (node.defs) {
						buf.printf(
								"%}case %f:%{"+
								"%j%n",
								function () { buf.print(labels[i].put(ctx.pc++)); },
								["%n",node.defs.stmts]);
					}
					buf.printf("case %f:%n",
					function () { buf.print(brkpos.put(ctx.pc++)); });
				});
			} else {
				buf.printf(
						"switch (%v) {%{"+
						"%j"+
						(node.defs?"%n%v":"%D")+
						"%n%}}"						,
						node.value,
						["%n",node.cases],
						node.defs
						);
			}
		},
		"case": function (node:Case) {
			buf.printf("%}case %v:%{%j",node.value, ["%n",node.stmts]);
		},
		"default": function (node:Default) {
			buf.printf("%}default:%{%j", ["%n",node.stmts]);
		},
		"while": function (node:While) {
			lastPosF(node)();
			var an=annotation(node);
			if (!ctx.noWait &&
					(an.fiberCallRequired || an.hasReturn)) {
				var brkpos=buf.lazy();
				var pc=ctx.pc++;
				var isTrue= node.cond.type=="reservedConst" && node.cond.text=="true";
				buf.printf(
						/*B*/
						"%}case %d:%{" +
						(isTrue?"%D%D%D":"if (!(%v)) { %s=%z; break; }%n") +
						"%f%n" +
						"%s=%s;break;%n" +
						"%}case %f:%{",
							pc,
							node.cond, FRMPC, brkpos,
							enterV({closestBrk:brkpos, closestCnt:pc, exitTryOnJump:false}, node.loop),
							FRMPC, pc,
							function () { buf.print(brkpos.put(ctx.pc++)); }
				);
			} else {
				ctx.enter({noWait:true},function () {
					buf.printf("while (%v) {%{"+
						(doLoopCheck?"Tonyu.checkLoop();%n":"")+
						"%f%n"+
					"%}}", node.cond, noSurroundCompoundF(node.loop));
				});
			}
		},
		"do": function (node:Do) {
			lastPosF(node)();
			var an=annotation(node);
			if (!ctx.noWait &&
					(an.fiberCallRequired || an.hasReturn)) {
				var brkpos=buf.lazy();
				var cntpos=buf.lazy();
				var pc=ctx.pc++;
				buf.printf(
						"%}case %d:%{" +
						"%f%n" +
						"%}case %f:%{" +
						"if (%v) { %s=%s; break; }%n"+
						"%}case %f:%{",
							pc,
							enterV({closestBrk:brkpos, closestCnt:cntpos, exitTryOnJump:false}, node.loop),
							function () { buf.print(cntpos.put(ctx.pc++)); },
							node.cond, FRMPC, pc,
							function () { buf.print(brkpos.put(ctx.pc++)); }
				);
			} else {
				ctx.enter({noWait:true},function () {
					buf.printf("do {%{"+
						(doLoopCheck?"Tonyu.checkLoop();%n":"")+
						"%f%n"+
					"%}} while (%v);%n",
						noSurroundCompoundF(node.loop), node.cond );
				});
			}
		},
		"for": function (node:For) {
			lastPosF(node)();
			var an=annotation(node);
			if (node.inFor.type=="forin") {
				const inFor:Forin=node.inFor;
				var itn=annotation(node.inFor).iterName;
				if (!ctx.noWait &&
						(an.fiberCallRequired || an.hasReturn)) {
					var brkpos=buf.lazy();
					var pc=ctx.pc++;
					buf.printf(
							"%s=%s(%v,%s);%n"+
							"%}case %d:%{" +
							"if (!(%s.next())) { %s=%z; break; }%n" +
							"%f%n" +
							"%f%n" +
							"%s=%s;break;%n" +
							"%}case %f:%{",
								itn, ITER, inFor.set, inFor.vars.length,
								pc,
								itn, FRMPC, brkpos,
								getElemF(itn, inFor.isVar, inFor.vars),
								enterV({closestBrk:brkpos, closestCnt: pc, exitTryOnJump:false}, node.loop),//node.loop,
								FRMPC, pc,
								function (buf) { buf.print(brkpos.put(ctx.pc++)); }
					);
				} else {
					ctx.enter({noWait:true},function() {
						buf.printf(
							"%s=%s(%v,%s);%n"+
							"while(%s.next()) {%{" +
							"%f%n"+
							"%f%n" +
							"%}}",
							itn, ITER, inFor.set, inFor.vars.length,
							itn,
							getElemF(itn, inFor.isVar, inFor.vars),
							noSurroundCompoundF(node.loop)
						);
					});
				}
			} else {
				const inFor:NormalFor=node.inFor;
				if (!ctx.noWait&&
						(an.fiberCallRequired || an.hasReturn)) {
					const brkpos=buf.lazy();
					var cntpos=buf.lazy();
					const pc=ctx.pc++;
					buf.printf(
							"%v%n"+
							"%}case %d:%{" +
							"if (!(%v)) { %s=%z; break; }%n" +
							"%f%n" +
							"%}case %f:%{"+
							"%v;%n" +
							"%s=%s;break;%n" +
							"%}case %f:%{",
								node.inFor.init ,
								pc,
								node.inFor.cond, FRMPC, brkpos,
								enterV({closestBrk:brkpos,closestCnt:cntpos,exitTryOnJump:false}, node.loop),//node.loop,
								function (buf:IndentBuffer) { buf.print(cntpos.put(ctx.pc++)); },
								node.inFor.next,
								FRMPC, pc,
								function (buf:IndentBuffer) { buf.print(brkpos.put(ctx.pc++)); }
					);
				} else {
					ctx.enter({noWait:true},function() {
						if (inFor.init.type=="varsDecl" || inFor.init.type=="exprstmt") {
							buf.printf(
									"%v"+
									"for (; %v ; %v) {%{"+
										(doLoopCheck?"Tonyu.checkLoop();%n":"")+
										"%v%n" +
									"%}}"										,
									/*enterV({noLastPos:true},*/ inFor.init,
									inFor.cond, inFor.next,
									node.loop
								);
						} else {
							buf.printf(
									"%v%n"+
									"while(%v) {%{" +
										(doLoopCheck?"Tonyu.checkLoop();%n":"")+
										"%v%n" +
										"%v;%n" +
									"%}}",
									inFor.init ,
									inFor.cond,
										node.loop,
										inFor.next
								);
						}
					});
				}
			}
			function getElemF(itn: string, isVar: Token, vars: Token[]) {
				return function () {
					vars.forEach(function (v,i) {
						var an=annotation(v);
						varAccess(v.text, an.scopeInfo,an);
						buf.printf("=%s[%s];%n", itn, i);
						//buf.printf("%s=%s[%s];%n", v.text, itn, i);
					});
				};
			}
		},
		"if": function (node:If) {
			lastPosF(node)();
			//buf.printf("/*FBR=%s*/",!!annotation(node).fiberCallRequired);
			var an=annotation(node);
			if (!ctx.noWait &&
					(an.fiberCallRequired || an.hasJump || an.hasReturn)) {
				var fipos=buf.lazy(), elpos=buf.lazy();
				if (node._else) {
					buf.printf(
							"if (!(%v)) { %s=%z; break; }%n" +
							"%v%n" +
							"%s=%z;break;%n" +
							"%}case %f:%{" +
							"%v%n" +
							/*B*/
							"%}case %f:%{"   ,
								node.cond, FRMPC, elpos,
								node.then,
								FRMPC, fipos,
								function () { buf.print(elpos.put(ctx.pc++)); },
								node._else,

								function () { buf.print(fipos.put(ctx.pc++)); }
					);

				} else {
					buf.printf(
							"if (!(%v)) { %s=%z; break; }%n" +
							"%v%n" +
							/*B*/
							"%}case %f:%{",
								node.cond, FRMPC, fipos,
								node.then,

								function () { buf.print(fipos.put(ctx.pc++)); }
					);
				}
			} else {
				ctx.enter({noWait:true}, function () {
					if (node._else) {
						buf.printf("if (%v) {%{%f%n%}} else {%{%f%n%}}", node.cond,
								noSurroundCompoundF(node.then),
								noSurroundCompoundF(node._else));
					} else {
						buf.printf("if (%v) {%{%f%n%}}", node.cond,
								noSurroundCompoundF(node.then));
					}
				});
			}
		},
		ifWait: function (node:IfWait) {
			if (!ctx.noWait) {
				buf.printf("%v",node.then);
			} else {
				if (node._else) {
					buf.printf("%v",node._else);
				}
			}
		},
		empty: function (node:Empty) {
			buf.printf(";%n");
		},
		call: function (node:Call) {
			buf.printf("(%j)", [",",node.args]);
		},
		objlitArg: function (node:ObjlitArg) {
			buf.printf("%v",node.obj);
		},
		argList: function (node:ArgList) {
			buf.printf("%j",[",",node.args]);
		},
		newExpr: function (node:NewExpr) {
			var p=node.params;
			if (p) {
				buf.printf("new %v%v",node.klass,p);
			} else {
				buf.printf("new %v",node.klass);
			}
		},
		scall: function (node:Scall) {
			buf.printf("[%j]", [",",node.args]);
		},
		superExpr: function (node:SuperExpr) {
			let name: string;
			//if (!klass.superclass) throw new Error(klass.fullName+"には親クラスがありません");
			if (node.name) {
				name=node.name.text;
				buf.printf("%s.prototype.%s.apply( %s, %v)",
						SUPER/*getClassName(klass.superclass)*/,  name, THIZ, node.params);
			} else {
				buf.printf("%s.apply( %s, %v)",
						SUPER/*getClassName(klass.superclass)*/, THIZ, node.params);
			}
		},
		arrayElem: function (node) {
			buf.printf("[%v]",node.subscript);
		},
		member: function (node) {
			buf.printf(".%s",node.name);
		},
		symbol: function (node:Token) {// Todo: Symbol(TSymbol)
			buf.print(node.text);
		},
		"normalFor": function (node:NormalFor) {
			buf.printf("%v; %v; %v", node.init, node.cond, node.next);
		},
		compound: function (node:Compound) {
			var an=annotation(node);
			if (!ctx.noWait &&
					(an.fiberCallRequired || an.hasJump || an.hasReturn) ) {
				buf.printf("%j", ["%n",node.stmts]);
			} else {
				/*if (ctx.noSurroundBrace) {
					ctx.enter({noSurroundBrace:false,noWait:true},function () {
						buf.printf("%{%j%n%}", ["%n",node.stmts]);
					});
				} else {*/
					ctx.enter({noWait:true},function () {
						buf.printf("{%{%j%n%}}", ["%n",node.stmts]);
					});
				//}
			}
		},
	"typeof": function (node: Token) {
		buf.printf("typeof ");
	},
	"instanceof": function (node: Token) {
		buf.printf(" instanceof ");
	},
	"is": function (node: Token) {
		buf.printf(" instanceof ");
	},
	regex: function (node: Token) {
		buf.printf("%s",node.text);
	}
	});
	var opTokens=["++", "--", "!==", "===", "+=", "-=", "*=", "/=",
			"%=", ">=", "<=",
	"!=", "==", ">>>",">>", "<<", "&&", "||", ">", "<", "+", "?", "=", "*",
	"%", "/", "^", "~", "\\", ":", ";", ",", "!", "&", "|", "-"	,"delete"	 ];
	opTokens.forEach(function (opt:string) {
		v.funcs[opt]=function (node: Token) {
			buf.printf("%s",opt);
		};
	});
	//v.debug=debug;
	v.def=function (node:TNode) {
		console.log("Err node=");
		console.log(node);
		throw new Error(node.type+" is not defined in visitor:compiler2");
	};
	//v.cnt=0;
	function genSource() {//G
		ctx.enter({}, function () {
			if (genMod) {
				printf("define(function (require) {%{");
				var reqs={Tonyu:1};
				for (var mod in klass.decls.amds) {
					reqs[mod]=1;
				}
				if (klass.superclass) {
					const mod=klass.superclass.shortName;
					reqs[mod]=1;
				}
				(klass.includes||[]).forEach(function (klass) {
					var mod=klass.shortName;
					reqs[mod]=1;
				});
				for (let mod in klass.decls.softRefClasses) {
					reqs[mod]=1;
				}
				for (let mod in reqs) {
					printf("var %s=require('%s');%n",mod,mod);
				}
			}
			printf((genMod?"return ":"")+"Tonyu.klass.define({%{");
			printf("fullName: %l,%n", klass.fullName);
			printf("shortName: %l,%n", klass.shortName);
			printf("namespace: %l,%n", klass.namespace);
			if (klass.superclass) printf("superclass: %s,%n", getClassName(klass.superclass));
			printf("includes: [%s],%n", getClassNames(klass.includes).join(","));
			printf("methods: function (%s) {%{",SUPER);
			printf("return {%{");
			const procMethod=(name:string)=>{
				if (debug) console.log("method1", name);
				const method=methods[name];
				if (!method.params) {
					console.log("MYSTERY2", method.params, methods, klass, env);
				}
				ctx.enter({noWait:true, threadAvail:false}, function () {
					genFunc(method);
				});
				if (debug) console.log("method2", name);
				if (!method.nowait ) {
					ctx.enter({noWait:false,threadAvail:true}, function () {
						genFiber(method);
					});
				}
				if (debug) console.log("method3", name);
			};
			for (var name in methods) procMethod(name);
			printf("__dummy: false%n");
			printf("%}};%n");
			printf("%}},%n");
			printf("decls: %s%n", JSON.stringify(digestDecls(klass)));
			printf("%}});");
			if (genMod) printf("%n%}});");
			printf("%n");
			//printf("%}});%n");
		});
		//printf("Tonyu.klass.addMeta(%s,%s);%n",
		//        getClassName(klass),JSON.stringify(digestMeta(klass)));
		//if (env.options.compiler.asModule) {
		//    printf("//%}});");
		//}
	}
	function getNameOfType(t: AnnotatedType) {
		if (!(t as C_Meta).fullName && !(t as NativeClass).class) {
			console.log(t);
			throw new Error("Invalid annotatedType"+ t);
		}
		return (t as C_Meta).fullName || (t as NativeClass).class.name;
	}
	function klass2name(t: AnnotatedType) {
		if (isMethodType(t)) {
			return `${t.method.klass.fullName}.${t.method.name}()`;
		} else if (isMeta(t)) {
			return t.fullName;
		} else {
			return t.class.name;
		}
	}
	function digestDecls(klass: C_Meta):DeclsInDefinition {
		var res={methods:{},fields:{}} as DeclsInDefinition;
		for (let i in klass.decls.methods) {
			res.methods[i]=
			{nowait:!!klass.decls.methods[i].nowait};
		}
		for (let i in klass.decls.fields) {
			const src=klass.decls.fields[i];
			const dst={
				vtype:src.resolvedType ? klass2name(src.resolvedType) : src.vtype
			};
			res.fields[i]=dst;
		}
		return res;
	}
	function digestMeta(klass:C_Meta) {//G
		var res={
				fullName: klass.fullName,
				namespace: klass.namespace,
				shortName: klass.shortName,
				decls:{methods:{}}
		};
		for (var i in klass.decls.methods) {
			res.decls.methods[i]=
			{nowait:!!klass.decls.methods[i].nowait};
		}
		return res;
	}
	function genFiber(fiber: FuncInfo) {//G
		if (isConstructor(fiber)) return;
		var stmts=fiber.stmts;
		var noWaitStmts=[], waitStmts=[], curStmts=noWaitStmts;
		var opt=true;
		if (opt) {
			stmts.forEach(function (s) {
				if (annotation(s).fiberCallRequired) {
					curStmts=waitStmts;
				}
				curStmts.push(s);
			});
		} else {
			waitStmts=stmts;
		}
		printf(
				"%s%s :function %s(%j) {%{"+
				USE_STRICT+
				"var %s=%s;%n"+
				"%svar %s=%s;%n"+
				"var %s=0;%n"+
				"%f%n"+
				"%f%n",
				FIBPRE, fiber.name, genFn("f_"+fiber.name), [",",[THNode].concat(fiber.params)],
				THIZ, GET_THIS,
				(fiber.useArgs?"":"//"), ARGS, "Tonyu.A(arguments)",
				FRMPC,
				genLocalsF(fiber),
				nfbody
		);
		if (waitStmts.length>0) {
			printf(
				"%s.enter(function %s(%s) {%{"+
					"if (%s.lastEx) %s=%s.catchPC;%n"+
					"for(var %s=%d ; %s--;) {%{"+
						"switch (%s) {%{"+
						"%}case 0:%{"+
						"%f" +
						"%s.exit(%s);return;%n"+
						"%}}%n"+
					"%}}%n"+
				"%}});%n",
				TH,genFn("ent_"+fiber.name),TH,
					TH,FRMPC,TH,
					CNTV, CNTC, CNTV,
						FRMPC,
						// case 0:
						fbody,
						TH,THIZ
			);
		} else {
			printf("%s.retVal=%s;return;%n",TH,THIZ);
		}
		printf("%}},%n");
		function nfbody() {
			ctx.enter({method:fiber, /*scope: fiber.scope,*/ noWait:true, threadAvail:true }, function () {
				noWaitStmts.forEach(function (stmt) {
					printf("%v%n", stmt);
				});
			});
		}
		function fbody() {
			ctx.enter({method:fiber, /*scope: fiber.scope,*/
				finfo:fiber, pc:1}, function () {
				waitStmts.forEach(function (stmt) {
					printf("%v%n", stmt);
				});
			});
		}
	}
	function genFunc(func:FuncInfo) {//G
		var fname= isConstructor(func) ? "initialize" : func.name;
		if (!func.params) {//TODO
			console.log("MYSTERY",func.params);
		}
		printf("%s :function %s(%j) {%{"+
					USE_STRICT+
					"var %s=%s;%n"+
					"%f%n" +
					"%f" +
				"%}},%n",
				fname, genFn(fname), [",",func.params],
				THIZ, GET_THIS,
						genLocalsF(func),
						fbody
		);
		function fbody() {
			ctx.enter({method:func, finfo:func,
				/*scope: func.scope*/ }, function () {
				func.stmts.forEach(function (stmt) {
					printf("%v%n", stmt);
				});
			});
		}
	}
	function genFuncExpr(node:FuncExpr) {//G
		var finfo=annotation(node).funcInfo;// annotateSubFuncExpr(node);
		buf.printf("(function %s(%j) {%{"+
						"%f%n"+
						"%f"+
					"%}})"				,
					finfo.name, [",", finfo.params],
					genLocalsF(finfo),
						fbody
		);
		function fbody() {
			ctx.enter({noWait: true, threadAvail:false,
				finfo:finfo, /*scope: finfo.scope*/ }, function () {
				node.body.stmts.forEach(function (stmt) {
					printf("%v%n", stmt);
				});
			});
		}
	}
	function genFn(/*pos:number ,*/name:string) {//G
		if (!name) name=(fnSeq++)+"";
		let n=("_trc_"+klass.shortName+"_"+name);
		traceIndex[n]=1;
		return n;
//        return ("_trc_func_"+traceTbl.add(klass,pos )+"_"+(fnSeq++));//  Math.random()).replace(/\./g,"");
	}
	function genSubFunc(node: FuncDecl) {//G
		var finfo=annotation(node).funcInfo;// annotateSubFuncExpr(node);
		buf.printf("function %s(%j) {%{"+
						"%f%n"+
						"%f"+
					"%}}"				,
					finfo.name,[",", finfo.params],
						genLocalsF(finfo),
						fbody
		);
		function fbody() {
			ctx.enter({noWait: true, threadAvail:false,
				finfo:finfo, /*scope: finfo.scope*/ }, function () {
				node.body.stmts.forEach(function (stmt) {
					printf("%v%n", stmt);
				});
			});
		}
	}
	function genLocalsF(finfo:FuncInfo) {//G
		return f;
		function f() {
			ctx.enter({/*scope:finfo.scope*/}, function (){
				for (let i in finfo.locals.varDecls) {
					buf.printf("var %s;%n",i);
				}
				for (let i in finfo.locals.subFuncDecls) {
					genSubFunc(finfo.locals.subFuncDecls[i]);
				}
			});
		}
	}
	function isConstructor(f: FuncInfo) {//G
		return OM.match(f, {ftype:"constructor"}) || OM.match(f, {name:"new"});
	}
	genSource();//G
	if (genMod) {
		klass.src.js=klass.src.tonyu.up().rel(klass.src.tonyu.truncExt()+".js");
		klass.src.js.text(buf.buf);
	} else {
		klass.src.js=buf.buf;//G
	}
	delete klass.jsNotUpToDate;
	if (debug) {
		console.log("method4", buf.buf);
		//throw "ERR";
	}
	//var bufres=buf.close();
	klass.src.map=buf.mapStr;
	return buf;//res;
}//B
//return {genJS:genJS};
//})();
