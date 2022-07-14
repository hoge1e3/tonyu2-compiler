import Tonyu from "../runtime/TonyuRuntime";
import R from "../lib/R";
import TError from "../runtime/TError";
import root from "../lib/root";
import { isTonyu1 } from "./tonyu1";
import ObjectMatcher = require("./ObjectMatcher");
const OM:any=ObjectMatcher;
import TonyuLang1 from "./parse_tonyu1";
import TonyuLang2 from "./parse_tonyu2";
import assert from "../lib/assert";
import * as cu from "./compiler";
import {Visitor} from "./Visitor";
import {context} from "./context";
import { SUBELEMENTS, Token } from "./parser";
import {Catch, Exprstmt, Forin, FuncDecl, FuncExpr, isPostfix, isVarAccess, NativeDecl, TNode, Program, Stmt, VarDecl, TypeExpr, VarAccess, Objlit, JsonElem, Compound, ParamDecl, Do, Switch, While, For, IfWait, Try, Return, Break, Continue, Postfix, Infix, VarsDecl, NamedTypeExpr, ArrayTypeExpr, isNamedTypeExpr, isArrayTypeExpr} from "./NodeTypes";
import { FieldInfo, Meta } from "../runtime/RuntimeTypes";
import { AnnotatedType, Annotation, ArrayType, BuilderEnv, C_Meta, FuncInfo, Locals, Methods, NamedType } from "./CompilerTypes";
import { packAnnotation } from "./compiler";
var ScopeTypes=cu.ScopeTypes;
//var genSt=cu.newScopeType;
var stype=cu.getScopeType;
var newScope=cu.newScope;
const SI=cu.ScopeInfos;
//var nc=cu.nullCheck;
var genSym=cu.genSym;
var annotation3=cu.annotation;
var getMethod2=cu.getMethod;
var getDependingClasses=cu.getDependingClasses;
var getParams=cu.getParams;
var JSNATIVES={Array:1, String:1, Boolean:1, Number:1, Void:1, Object:1,RegExp:1,Error:1,Date:1};
function visitSub(node: TNode) {//S
	var t=this;
	if (!node || typeof node!="object") return;
	var es:TNode[];
	if (node instanceof Array) es=node;
	else es=node[SUBELEMENTS];
	if (!es) {
		es=[];
		for (var i in node) {
			es.push(node[i]);
		}
	}
	es.forEach((e:TNode)=>t.visit(e));
}
function getSourceFile(klass: C_Meta) {
	return assert(klass.src && klass.src.tonyu,"File for "+klass.fullName+" not found.");
}
export function parse(klass: C_Meta, options={}):Program {
	const s=getSourceFile(klass);//.src.tonyu; //file object
	let node:Program;
	if (klass.node && klass.nodeTimestamp==s.lastUpdate()) {
		node=klass.node;
	}
	if (!node) {
		//console.log("Parse "+s);
		if (isTonyu1(options)) {
			node=TonyuLang1.parse(s);
		} else {
			node=TonyuLang2.parse(s);
		}
		klass.nodeTimestamp=s.lastUpdate();
	}
	return node;
}
type ScopeMap= {[key:string]: cu.ScopeInfo};
type SemCtx={
	scope: ScopeMap,
	method: FuncInfo,
	finfo: FuncInfo,
	locals: {
		varDecls: {[key: string]:VarDecl|Forin|Catch|Token},
		subFuncDecls: {[key: string]:FuncDecl}
	},
	noWait: boolean,
	isMain: boolean,
	contable: boolean,
	brkable: boolean,
	inBlockScope: boolean,
};
//-----------
export function initClassDecls(klass:C_Meta, env:BuilderEnv ) {//S
	// The main task of initClassDecls is resolve 'dependency', it calls before orderByInheritance
	var s=getSourceFile(klass); //file object
	klass.hasSemanticError=true;
	if (klass.src && klass.src.js) {
		// falsify on generateJS. if some class hasSemanticError, it remains true
		klass.jsNotUpToDate=true;
	}
	const node=parse(klass, env.options);
	var MAIN:FuncInfo={klass, name:"main",stmts:[], isMain:true, nowait: false};//, klass:klass.fullName};
	// method := fiber | function
	const fields={}, methods:Methods={main: MAIN}, natives={}, amds={},softRefClasses={};
	klass.decls={fields, methods, natives, amds, softRefClasses};
	// ↑ このクラスが持つフィールド，ファイバ，関数，ネイティブ変数，AMDモジュール変数
	//   extends/includes以外から参照してれるクラス の集まり．親クラスの宣言は含まない
	klass.node=node;

	function initMethods(program: Program) {
		let spcn=env.options.compiler.defaultSuperClass;
		var pos=0;
		var t=OM.match( program , {ext:{superclassName:{text:OM.N, pos:OM.P}}});
		if (t) {
			spcn=t.N;
			pos=t.P;
			if (spcn=="null") spcn=null;
		}
		klass.includes=[];
		t=OM.match( program , {incl:{includeClassNames:OM.C}});
		if (t) {
			t.C.forEach(function (i:Token) {
				var n=i.text;/*ENVC*/
				var p=i.pos;
				var incc=env.classes[env.aliases[n] || n];/*ENVC*/ //CFN env.classes[env.aliases[n]]
				if (!incc) throw TError ( R("classIsUndefined",n), s, p);
				klass.includes.push(incc);
			});
		}
		if (spcn=="Array") {
			klass.superclass={shortName:"Array",fullName:"Array",builtin:true} as C_Meta;
		} else if (spcn) {
			var spc=env.classes[env.aliases[spcn] || spcn];/*ENVC*/  //CFN env.classes[env.aliases[spcn]]
			if (!spc) {
				throw TError ( R("superClassIsUndefined",spcn), s, pos);
			}
			klass.superclass=spc;
		} else {
			delete klass.superclass;
		}
		klass.directives={};
		//--
		function addField(name:Token,node=undefined) {// name should be node
			node=node||name;
			fields[name+""]={
				node:node,
				klass:klass.fullName,
				name:name+"",
				pos:node.pos
			};
		}
		const ctx=context<SemCtx>();
		var fieldsCollector=new Visitor({
			varDecl: function (node:VarDecl) {
				addField(node.name, node);
			},
			varsDecl(node:VarsDecl) {
				if (ctx.inBlockScope && node.declPrefix.text!=="var") return;
				for (let d of node.decls) {
					fieldsCollector.visit(d);
				}
			},
			nativeDecl: function (node:NativeDecl) {//-- Unify later
			},
			funcDecl: function (node:FuncDecl) {//-- Unify later
			},
			funcExpr: function (node:FuncExpr) {
			},
			"catch": function (node:Catch) {
			},
			exprstmt: function (node:Exprstmt) {
				if (node.expr.type==="literal") {
					if (node.expr.text.match(/^.field strict.$/)) {
						klass.directives.field_strict=true;
					}
					if (node.expr.text.match(/^.external waitable.$/)) {
						klass.directives.external_waitable=true;
					}
				}
			},
			"for": function(node:For) {
				ctx.enter({inBlockScope:true},()=>fieldsCollector.def!(node));
			},
			compound(node:Compound) {
				ctx.enter({inBlockScope:true},()=>fieldsCollector.def!(node));
			},
			"forin": function (node:Forin) {
				var isVar=node.isVar;
				if (isVar && isVar.text==="var") {
					node.vars.forEach((v:Token)=>{
						addField(v);
					});
				}
			}
		});
		fieldsCollector.def=visitSub;
		fieldsCollector.visit(program.stmts);
		//-- end of fieldsCollector
		program.stmts.forEach(function (stmt:Stmt) {
			if (stmt.type=="funcDecl") {
				var head=stmt.head;
				var ftype="function";
				if (head.ftype) {
					ftype=head.ftype.text;
					//console.log("head.ftype:",stmt);
				}
				var name=head.name.text;
				var propHead=(head.params ? "" : head.setter ? "__setter__" : "__getter__");
				name=propHead+name;
				methods[name]={
						klass,
						nowait: (!!head.nowait || propHead!==""),
						ftype,
						name,
						//klass: klass.fullName,
						head,
						//pos: head.pos,
						stmts: stmt.body.stmts,
						node: stmt
				};
			} else if (stmt.type=="nativeDecl") {
				natives[stmt.name.text]=stmt;
			} else {
				MAIN.stmts.push(stmt);
			}
		});
	}
	initMethods(node);        // node=program
	//delete klass.hasSemanticError;
	// Why delete deleted? because decls.methods.params is still undef
}// of initClassDecls
function annotateSource2(klass:C_Meta, env:BuilderEnv) {//B
	// annotateSource2 is call after orderByInheritance
	klass.hasSemanticError=true;
	const srcFile=klass.src!.tonyu; //file object  //S
	var srcCont=srcFile.text();
	function getSource(node: TNode) {
		return cu.getSource(srcCont,node);
	}
	//var traceTbl=env.traceTbl;
	// method := fiber | function
	const decls=klass.decls;
	const methods=decls.methods;
	// ↑ このクラスが持つフィールド，ファイバ，関数，ネイティブ変数，モジュール変数の集まり．親クラスの宣言は含まない
	var ST=ScopeTypes;
	var topLevelScope={} as ScopeMap;
	// ↑ このソースコードのトップレベル変数の種類 ，親クラスの宣言を含む
	//  キー： 変数名   値： ScopeTypesのいずれか
	
	const ctx=context<SemCtx>();
	const debug=false;
	const othersMethodCallTmpl={
			type:"postfix",
			left:{
				type:"postfix",
				left:OM.T,
				op:{type:"member",name:{text:OM.N}}
			},
			op:{type:"call", args:OM.A }
	};
	const memberAccessTmpl={
			type:"postfix",
			left: OM.T,
			op:{type:"member",name:{text:OM.N}}
	};
	// These has same value but different purposes:
	//  myMethodCallTmpl: avoid using bounded field for normal method(); call
	//  fiberCallTmpl: detect fiber call
	const myMethodCallTmpl={
			type:"postfix",
			left:{type:"varAccess", name: {text:OM.N}},
			op:{type:"call", args:OM.A }
	};
	const fiberCallTmpl=myMethodCallTmpl;
	const noRetFiberCallTmpl={
		expr: fiberCallTmpl
	};
	const retFiberCallTmpl={
		expr: {
			type: "infix",
			op: OM.O,
			left: OM.L,
			right: fiberCallTmpl
		}
	};
	const otherFiberCallTmpl={
		type:"postfix",
		left: OM.T({
			type:"postfix",
			left: OM.O,
			op:{type:"member", name: {text:OM.N}}
		}),
		op:{type:"call", args:OM.A }
	};
	const noRetOtherFiberCallTmpl={
		expr: otherFiberCallTmpl
	};
	const retOtherFiberCallTmpl={
		expr: {
			type: "infix",
			op: OM.P,
			left: OM.L,
			right: otherFiberCallTmpl
		}
	};
	function external_waitable_enabled(){
		return env.options.compiler.external_waitable || klass.directives.external_waitable;
	}

	const noRetSuperFiberCallTmpl={
		expr: OM.S({type:"superExpr", params:{args:OM.A}})
	};
	const retSuperFiberCallTmpl={
			expr: {
				type: "infix",
				op: OM.O,
				left: OM.L,
				right: OM.S({type:"superExpr", params:{args:OM.A}})
			}
		};
	klass.annotation={};
	function annotation(node: TNode, aobj:Annotation|undefined=undefined):Annotation {//B
		return annotation3(klass.annotation,node,aobj);
	}
	function initTopLevelScope2(klass: C_Meta) {//S
		if (klass.builtin) return;
		var s=topLevelScope;
		var decls=klass.decls;
		if (!decls) {
			console.log("DECLNUL",klass);
		}
		for (let i in decls.fields) {
			const info=decls.fields[i];
			s[i]=new SI.FIELD(klass, i, info);
			if (info.node) {
				annotation(info.node,{/*fieldInfo: info,*/ scopeInfo: s[i]});
			}
		}
		for (let i in decls.methods) {
			const info=decls.methods[i];
			var r=Tonyu.klass.propReg.exec(i);
			if (r) {
				const name=r[2];
				s[name]=new SI.PROP(klass.fullName, name, info);
			} else {
				s[i]=new SI.METHOD(klass.fullName, i, info);
			}
			if (info.node) {
				annotation(info.node,{funcInfo:info});
			}
		}
	}
	function initTopLevelScope() {//S
		var s=topLevelScope;
		getDependingClasses(klass).forEach(initTopLevelScope2);
		var decls=klass.decls;// Do not inherit parents' natives
		if (!isTonyu1(env.options)) {
			for (let i in JSNATIVES) {
				s[i]=new SI.NATIVE("native::"+i, {class:root[i]});
			}
		}
		for (let i in env.aliases) {/*ENVC*/ //CFN  env.classes->env.aliases
			var fullName=env.aliases[i];
			s[i]=new SI.CLASS(i,fullName,env.classes[fullName]);
		}
		for (let i in decls.natives) {
			s[i]=new SI.NATIVE("native::"+i, {class:root[i]});
		}
	}
	function inheritSuperMethod() {//S
		var d=getDependingClasses(klass);
		for (var n in klass.decls.methods) {
			var m2=klass.decls.methods[n];
			for (let k of d) {
				var m=k.decls.methods[n];
				if (m && m.nowait) {
					m2.nowait=true;
				}
			}
		}
	}
	function getMethod(name:string) {//B
		return getMethod2(klass,name);
	}
	function getSuperMethod(name:string):FuncInfo|undefined {//B
		for (let c of getDependingClasses(klass)) {
			if (c===klass) continue;
			const r=getMethod2(c,name);
			if (r) return r;
		}
		//return getMethod2(klass,name);
	}

	function isFiberMethod(name:string) {
		return stype(ctx.scope[name])==ST.METHOD &&
		!getMethod(name).nowait ;
	}
	function checkLVal(node: TNode) {//S
		if (isVarAccess(node) ||
				isPostfix(node) && (node.op.type=="member" || node.op.type=="arrayElem") ) {
			if (node.type=="varAccess") {
				annotation(node,{noBind:true});
			}
			return true;
		}
		//console.log("LVal",node);
		throw TError( R("invalidLeftValue",getSource(node)) , srcFile, node.pos);
	}
	function getScopeInfo(node:Token):cu.ScopeInfo {//S
		const n=node+"";
		const si=ctx.scope[n];
		const t=stype(si);
		if (!t) {
			/*if (env.amdPaths && env.amdPaths[n]) {
				//t=ST.MODULE;
				klass.decls.amds[n]=env.amdPaths[n];
				topLevelScope[n]=new SI.MODULE(n);
				//console.log(n,"is module");
			} else {*/
				var isg=n.match(/^\$/);
				if (env.options.compiler.field_strict || klass.directives.field_strict) {
					if (!isg) throw TError(R("fieldDeclarationRequired",n),srcFile,node.pos);
				}
				if (isg) {
					topLevelScope[n]=new SI.GLOBAL(n);
				} else {
					//opt.klass=klass.name;
					const fi:FieldInfo={
						klass,
						name:n
					};
					if (!klass.decls.fields[n]) {
						klass.decls.fields[n]=fi;
					} else {
						Object.assign(klass.decls.fields[n],fi);//si;
					}
					//console.log("Implicit field declaration:", n, klass.decls.fields[n]);
					topLevelScope[n]=new SI.FIELD(klass, n, klass.decls.fields[n]);
				}
			//}
			return topLevelScope[n];
			//var opt:any={name:n};
			/*if (t==ST.FIELD) {
				opt.klass=klass.name;
				klass.decls.fields[n]=klass.decls.fields[n]||{};
				Object.assign(klass.decls.fields[n],{
					klass:klass.fullName,
					name:n
				});//si;
			}*/
			//topLevelScope[n]=si;//genSt(t,opt);
		}
		if (t==ST.CLASS) {
			klass.decls.softRefClasses[n]=si;
		}
		return si;
	}
	// locals are only var, not let or const
	var localsCollector=new Visitor({
		varDecl: function (node: VarDecl) {
			if (ctx.isMain) {
				annotation(node,{varInMain:true});
				annotation(node,{declaringClass:klass});
				//console.log("var in main",node.name.text);
			} else {
				//if (node.name.text==="nonvar") throw new Error("WHY1!!!");
				ctx.locals.varDecls[node.name.text]=node;
				//console.log("DeclaringFunc of ",node.name.text,ctx.finfo);
				annotation(node,{declaringFunc:ctx.finfo});
			}
		},
		varsDecl(node:VarsDecl) {
			if (node.declPrefix.text!=="var") return;
			for (let d of node.decls) {
				localsCollector.visit(d);
			}
		},
		funcDecl: function (node: FuncDecl) {/*FDITSELFIGNORE*/
			ctx.locals.subFuncDecls[node.head.name.text]=node;
			//initParamsLocals(node);??
		},
		funcExpr: function (node: FuncExpr) {/*FEIGNORE*/
			//initParamsLocals(node);??
		},
		"catch": function (node: Catch) {
			ctx.locals.varDecls[node.name.text]=node;
		},
		exprstmt: function (node: Exprstmt) {
		},
		"forin": function (node: Forin) {
			var isVar=node.isVar;
			node.vars.forEach(function (v) {
				if (isVar && isVar.text==="var") {
					if (ctx.isMain) {
						annotation(v,{varInMain:true});
						annotation(v,{declaringClass:klass});
					} else {
						//if (v.text==="nonvar") throw new Error("WHY2!!!");
						ctx.locals.varDecls[v.text]=v;//node??;
						annotation(v,{declaringFunc:ctx.finfo});
					}
				}
			});
			var n=`_it_${Object.keys(ctx.locals.varDecls).length}`;//genSym("_it_");
			annotation(node, {iterName:n});
			ctx.locals.varDecls[n]=node;// ??
		}
	});
	localsCollector.def=visitSub;//S

	function collectLocals(node:Compound|TNode[]) {//S
		var locals:Locals={varDecls:{}, subFuncDecls:{}};
		ctx.enter({locals},function () {
			localsCollector.visit(node);
		});
		return locals;
	}
	function annotateParents(path:TNode[], data:Annotation) {//S
		path.forEach(function (n:TNode) {
			annotation(n,data);
		});
	}
	/*function fiberCallRequired(path: TNode[]) {//S
		if (ctx.method) ctx.method.fiberCallRequired=true;
		annotateParents(path, {fiberCallRequired:true} );
	}*/
	var varAccessesAnnotator=new Visitor({//S
		varAccess: function (node:VarAccess) {
			var si=getScopeInfo(node.name);
			annotation(node,{scopeInfo:si});
		},
		funcDecl: function (node:FuncDecl) {/*FDITSELFIGNORE*/
		},
		funcExpr: function (node:FuncExpr) {/*FEIGNORE*/
			annotateSubFuncExpr(node);
		},
		objlit:function (node: Objlit) {
			var t=this;
			var dup={};
			node.elems.forEach(function (e: JsonElem) {
				const kn=(e.key.type=="literal")?
					e.key.text.substring(1,e.key.text.length-1):
					e.key.text;
				if (dup.hasOwnProperty(kn)) {
					throw TError( R("duplicateKeyInObjectLiteral",kn) , srcFile, e.pos);
				}
				dup[kn]=1;
				//console.log("objlit",e.key.text);
				t.visit(e);
			});
		},
		jsonElem: function (node:JsonElem) {
			if (node.value) {
				this.visit(node.value);
			} else {
				if (node.key.type=="literal") {
					throw TError( R("cannotUseStringLiteralAsAShorthandOfObjectValue") , srcFile, node.pos);
				}
				var si=getScopeInfo(node.key);
				annotation(node,{scopeInfo:si});
			}
		},
		"do": function (node:Do) {
			var t=this;
			ctx.enter({brkable:true,contable:true}, function () {
				t.def!(node);
			});
		},
		"switch": function (node:Switch) {
			var t=this;
			ctx.enter({brkable:true}, function () {
				t.def!(node);
			});
		},
		"while": function (node:While) {
			var t=this;
			ctx.enter({brkable:true,contable:true}, function () {
				t.def!(node);
			});
			//fiberCallRequired(this.path);//option
		},
		"for": function (node:For) {
			var t=this;
			if ((node as any).isToken) return;
			ctx.enter({inBlockScope:true},()=>{
				const ns=newScope(ctx.scope);
				if (node.inFor.type==="normalFor") {
					collectBlockScopedVardecl([node.inFor.init],ns);
				} else {
					if (node.inFor.isVar && node.inFor.isVar.text!=="var") {
						for (let v of node.inFor.vars) {
							ns[v.text]=new SI.LOCAL(ctx.finfo,true);
						}
					}
				}
				ctx.enter({scope:ns, brkable:true,contable:true}, function () {
					t.def!(node);
				});
			});
		},
		"forin": function (node:Forin) {
			node.vars.forEach(function (v) {
				var si=getScopeInfo(v);
				annotation(v,{scopeInfo:si});
			});
			this.visit(node.set);
		},
		compound(node:Compound) {
			ctx.enter({inBlockScope:true}, ()=>{
				const ns=newScope(ctx.scope);
				collectBlockScopedVardecl(node.stmts,ns);
				ctx.enter({scope:ns}, ()=>{
					for (let stmt of node.stmts) this.visit(stmt);
				});
			});
		},
		ifWait: function (node:IfWait) {
			var TH="_thread";
			var t=this;
			var ns=newScope(ctx.scope);
			ns[TH]=new SI.THVAR();//genSt(ST.THVAR);
			ctx.enter({scope:ns}, function () {
				t.visit(node.then);
			});
			if (node._else) {
				t.visit(node._else);
			}
			//fiberCallRequired(this.path);
		},
		"try": function (node:Try) {
			//ctx.finfo.useTry=true;
			this.def!(node);
		},
		"return": function (node:Return) {
			var t;
			if (!ctx.noWait) {
				if (node.value && (t=OM.match(node.value, fiberCallTmpl)) &&
				isFiberMethod(t.N)) {
					annotation(node.value, {fiberCall:t});
					//fiberCallRequired(this.path);
				}
				//annotateParents(this.path,{hasReturn:true});
			}
			this.visit(node.value);
		},
		"break": function (node:Break) {
			if (!ctx.brkable) throw TError( R("breakShouldBeUsedInIterationOrSwitchStatement") , srcFile, node.pos);
			if (!ctx.noWait) annotateParents(this.path,{hasJump:true});
		},
		"continue": function (node:Continue) {
			if (!ctx.contable) throw TError( R("continueShouldBeUsedInIterationStatement") , srcFile, node.pos);
			if (!ctx.noWait) annotateParents(this.path,{hasJump:true});
		},
		"reservedConst": function (node:Token) {
			if (node.text=="arguments") {
				ctx.finfo.useArgs=true;
			}
		},
		postfix: function (node:Postfix) {
			var t:any;
			function match(node:TNode, tmpl:any) {
				t=OM.match(node,tmpl);
				return t;
			}
			this.visit(node.left);
			this.visit(node.op);
			if (match(node, myMethodCallTmpl)) {
				const si=annotation(node.left).scopeInfo!;
				annotation(node, {myMethodCall:{name:t.N as string,args:t.A,scopeInfo:si}});
			} else if (match(node, othersMethodCallTmpl)) {
				annotation(node, {othersMethodCall:{target:t.T,name:t.N as string,args:t.A} });
			} else if (match(node, memberAccessTmpl)) {
				annotation(node, {memberAccess:{target:t.T,name:t.N as string} });
			}
		},
		infix: function (node:Infix) {
			var opn=node.op.text;
			if (opn=="=" || opn=="+=" || opn=="-=" || opn=="*=" ||  opn=="/=" || opn=="%=" ) {
				checkLVal(node.left);
			}
			this.def!(node);
		},
		exprstmt: function (node:Exprstmt) {
			var t:any,m: FuncInfo;
			if (node.expr.type==="objlit") {
				throw TError( R("cannotUseObjectLiteralAsTheExpressionOfStatement") , srcFile, node.pos);
			}
			const path=this.path.slice();
			/*if (klass.fullName==="user.Main") {
				console.dir(node,{depth:null});
			}*/
			if (!ctx.noWait &&
					(t=OM.match(node,noRetFiberCallTmpl)) &&
					isFiberMethod(t.N)) {
				t.type="noRet";
				annotation(node, {fiberCall:t});
				//fiberCallRequired(this.path);
			} else if (!ctx.noWait &&
					(t=OM.match(node,retFiberCallTmpl)) &&
					isFiberMethod(t.N)) {
				t.type="ret";
				annotation(node, {fiberCall:t});
				//fiberCallRequired(this.path);
			} else if (!ctx.noWait && external_waitable_enabled() &&
					(t=OM.match(node,noRetOtherFiberCallTmpl))) {
				//console.log("noRetOtherFiberCallTmpl", t);
				t.type="noRetOther";
				//t.fiberCallRequired_lazy=()=>fiberCallRequired(path);
				annotation(node, {otherFiberCall:t});
			} else if (!ctx.noWait && external_waitable_enabled() &&
					(t=OM.match(node,retOtherFiberCallTmpl))) {
				t.type="retOther";
				//t.fiberCallRequired_lazy=()=>fiberCallRequired(path);
				annotation(node, {otherFiberCall:t});
			} else if (!ctx.noWait &&
					(t=OM.match(node,noRetSuperFiberCallTmpl)) &&
					t.S.name) {
				const m=getSuperMethod(t.S.name.text);
				if (!m) throw new Error(R("undefinedSuperMethod",t.S.name.text));
				if (!m.nowait) {
					t.type="noRetSuper";
					t.superclass=klass.superclass;
					annotation(node, {fiberCall:t});
					//fiberCallRequired(this.path);
				}
			} else if (!ctx.noWait &&
					(t=OM.match(node,retSuperFiberCallTmpl)) &&
					t.S.name) {
				if (!klass.superclass) {
					throw new Error(R("Class {1} has no superclass",klass.shortName));
				}
				m=getSuperMethod(t.S.name.text);
				if (!m) throw new Error(R("undefinedSuperMethod",t.S.name.text));
				if (!m.nowait) {
					t.type="retSuper";
					t.superclass=klass.superclass;
					annotation(node, {fiberCall:t});
					//fiberCallRequired(this.path);
				}
			}
			this.visit(node.expr);
		},
		varDecl: function (node:VarDecl) {
			let t:any;
			const path=this.path.slice();
			if (!ctx.noWait &&
					(t=OM.match(node.value,fiberCallTmpl)) &&
					isFiberMethod(t.N)) {
				t.type="varDecl";
				annotation(node, {fiberCall:t});
				//fiberCallRequired(this.path);
			}
			if (!ctx.noWait && external_waitable_enabled() &&
					(t=OM.match(node.value,otherFiberCallTmpl))) {
				t.type="varDecl";
				//t.fiberCallRequired_lazy=()=>fiberCallRequired(path);
				annotation(node, {otherFiberCall:t});
			}
			this.visit(node.value);
			this.visit(node.typeDecl);
		},
		namedTypeExpr: function (node:NamedTypeExpr) {
			resolveNamedType(node);
		},
		arrayTypeExpr(node: ArrayTypeExpr) {
			//console.log("ARRATYTPEEXPR",node);
			resolveArrayType(node);
		}
	});
	function resolveType(node:TypeExpr):AnnotatedType {
		if (isNamedTypeExpr(node)) return resolveNamedType(node);
		else if (isArrayTypeExpr(node)) return resolveArrayType(node);
	}
	function resolveArrayType(node:ArrayTypeExpr):ArrayType {
		const et=resolveType(node.element);
		//console.log("ET",et);
		const rt={element:et};
		if (rt) annotation(node, {resolvedType:rt});
		return rt;
	}
	function resolveNamedType(node:NamedTypeExpr):NamedType {
		const si=getScopeInfo(node.name);
		const resolvedType=
			(si instanceof SI.NATIVE)?si.value:
			(si instanceof SI.CLASS) ?si.info : undefined;
		if (resolvedType) {
			annotation(node, {resolvedType});
		} else if (env.options.compiler.typeCheck) {
			console.log("typeNotFound: topLevelScope",topLevelScope,si,env.classes);
			throw TError(R("typeNotFound",node.name),srcFile,node.pos);
		}
		return resolvedType;
	}
	varAccessesAnnotator.def=visitSub;//S
	function annotateVarAccesses(node:Stmt[],scope:ScopeMap) {//S
		const ns=newScope(scope);
		collectBlockScopedVardecl(node, ns);
		ctx.enter({scope:ns}, function () {
			varAccessesAnnotator.visit(node);
		});
	}
	function copyLocals(finfo: FuncInfo, scope: ScopeMap) {//S
		const locals=finfo.locals!;
		for (var i in locals.varDecls) {
			//console.log("LocalVar ",i,"declared by ",finfo);
			var si=new SI.LOCAL(finfo,false);
			scope[i]=si;
			annotation(locals.varDecls[i],{scopeInfo:si});
		}
		for (let i in locals.subFuncDecls) {
			const si=new SI.LOCAL(finfo, false);
			scope[i]=si;
			annotation(locals.subFuncDecls[i],{scopeInfo:si});
		}
	}
	function resolveTypesOfParams(params:ParamDecl[]) {
		params.forEach(function (param) {
			if (param.typeDecl) {
				//console.log("restype",param);
				resolveType(param.typeDecl.vtype);
			}
		});
	}
	function initParamsLocals(f: FuncInfo) {//S
		//console.log("IS_MAIN", f, f.name, f.isMain);
		ctx.enter({isMain:f.isMain,finfo:f}, function () {
			f.locals=collectLocals(f.stmts);
			f.params=getParams(f);
		});
		//if (!f.params) throw new Error("f.params is not inited");
		resolveTypesOfParams(f.params!);
	}
	function collectBlockScopedVardecl(stmts:Stmt[],scope:ScopeMap) {
		for (let stmt of stmts) {
			if (stmt.type==="varsDecl" && stmt.declPrefix.text!=="var") {
				const ism=ctx.finfo.isMain;
				//console.log("blockscope",ctx,ism);
				if (ism && !ctx.inBlockScope) annotation(stmt, {varInMain:true});
				for (const d of stmt.decls) {
					if (ism && !ctx.inBlockScope) {
						annotation(d,{varInMain:true});
						annotation(d,{declaringClass:klass});
					} else {
						const si=new SI.LOCAL(ctx.finfo, true);
						scope[d.name.text]=si;
						annotation(d,{declaringFunc:ctx.finfo, scopeInfo:si});
					}
				}
			}
		}
	}
	function annotateSubFuncExpr(node: FuncExpr|FuncDecl) {// annotateSubFunc or FuncExpr
		var m:any,ps:ParamDecl[];
		var body=node.body;
		var name=(node.head.name ? node.head.name.text : "anonymous_"+node.pos );
		m=OM.match( node, {head:{params:{params:OM.P}}});
		if (m) {
			ps=m.P;
		} else {
			ps=[];
		}
		var finfo:FuncInfo={klass, name, stmts:body.stmts, nowait: true};
		var ns=newScope(ctx.scope);
		//var locals;
		ctx.enter({finfo}, function () {
			ps.forEach(function (p) {
				var si=new SI.PARAM(finfo);
				annotation(p,{scopeInfo:si});
				ns[p.name.text]=si;
			});
			finfo.locals=collectLocals(body);
			copyLocals(finfo, ns);
			annotateVarAccesses(body.stmts,ns);
		});
		finfo.scope=ns;
		//finfo.name=name;
		finfo.params=ps;
		//var res={scope:ns, locals:finfo.locals, name:name, params:ps};
		resolveTypesOfParams(finfo.params);
		//annotation(node,res);
		annotation(node,{funcInfo:finfo});
		annotateSubFuncExprs(finfo.locals!, ns);
		return finfo;
	}
	function annotateSubFuncExprs(locals:Locals, scope:ScopeMap) {//S
		ctx.enter({scope}, function () {
			for (var n in locals.subFuncDecls) {
				annotateSubFuncExpr(locals.subFuncDecls[n]);
			}
		});
	}
	function annotateMethodFiber(f: FuncInfo) {//S
		var ns=newScope(ctx.scope);
		f.params!.forEach(function (p) {
			var si=new SI.PARAM(f);
			//	klass:klass.name, name:f.name, no:cnt, declaringFunc:f
			//});
			ns[p.name.text]=si;
			annotation(p,{scopeInfo:si,declaringFunc:f});
		});
		if (f.head && f.head.rtype) {
			const rt=resolveType(f.head.rtype.vtype);
			f.returnType=rt;
			//console.log("Annotated return type ", f, rt);
			//throw new Error("!");
		}
		copyLocals(f, ns);
		ctx.enter({method:f,finfo:f, noWait:false}, function () {
			annotateVarAccesses(f.stmts, ns);
		});
		f.scope=ns;
		annotateSubFuncExprs(f.locals!, ns);
		return ns;
	}
	function annotateSource() {//S
		ctx.enter({scope:topLevelScope}, function () {
			for (var name in methods) {
				if (debug) console.log("anon method1", name);
				var method=methods[name];
				initParamsLocals(method);//MAINVAR
				annotateMethodFiber(method);
			}
		});
		packAnnotation(klass.annotation);
	}
	initTopLevelScope();//S
	inheritSuperMethod();//S
	annotateSource();
	delete klass.hasSemanticError;
}//B  end of annotateSource2
export const annotate= annotateSource2;
