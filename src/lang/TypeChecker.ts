import * as cu from "./compiler";
import R from "../lib/R";
import {context} from "./context";
import { FuncDecl, ParamDecl, Postfix, TNode, VarAccess, VarDecl, Exprstmt, isCall, isMember } from "./NodeTypes";
//import Grammar from "./Grammar";
import { SUBELEMENTS, Token } from "./parser";
import {Visitor} from "./Visitor";
import { AnnotatedType, Annotation, BuilderEnv, C_FieldInfo, C_Meta, FuncInfo, isMeta, isMethodType } from "./CompilerTypes";
import { ScopeInfo } from "./compiler";
import TError from "../runtime/TError";

	//var ex={"[SUBELEMENTS]":1,pos:1,len:1};
	const ScopeTypes=cu.ScopeTypes;
	//var genSt=cu.newScopeType;
	const stype=cu.getScopeType;
	const newScope=cu.newScope;
	//var nc=cu.nullCheck;
	const genSym=cu.genSym;
	const annotation3=cu.annotation;
	const getMethod2=cu.getMethod;
	const getDependingClasses=cu.getDependingClasses;
	const getParams=cu.getParams;
	//const JSNATIVES={Array:1, String:1, Boolean:1, Number:1, Void:1, Object:1,RegExp:1,Error:1};
//var TypeChecker:any={};
function visitSub(node:TNode) {//S
	var t=this;
	if (!node || typeof node!="object") return;
	//console.log("TCV",node.type,node);
	var es;
	if (node instanceof Array) es=node;
	else es=node[SUBELEMENTS];
	if (!es) {
		es=[];
		for (var i in node) {
			es.push(node[i]);
		}
	}
	es.forEach(function (e) {
		t.visit(e);
	});
}
type TypeChkCtx={

};

export function checkTypeDecl(klass: C_Meta,env: BuilderEnv) {
	function annotation(node: TNode, aobj: (Annotation|undefined)=undefined):Annotation {//B
		return annotation3(klass.annotation,node,aobj);
	}
	var typeDeclVisitor=new Visitor({
		varDecl: function (node: VarDecl) {
			//console.log("TCV","varDecl",node);
			if (node.value) this.visit(node.value);
			if (node.name && node.typeDecl) {
				var va=annotation(node.typeDecl.vtype);
				//console.log("var typeis",node.name+"", node.typeDecl.vtype, va.resolvedType);
				const rt=va.resolvedType;
				if (rt) {
					const a=annotation(node);
					const si=a.scopeInfo;// for local
					const info=a.fieldInfo;// for field
					if (si) {
						//console.log("set var type",node.name+"", va.resolvedType );
						si.resolvedType=va.resolvedType;
					} else if (info) {
						//console.log("set fld type",node.name+"", va.resolvedType );
						info.resolvedType=va.resolvedType;
					}

				}
				/*} else if (a.declaringClass) {
					//console.log("set fld type",a.declaringClass,a.declaringClass.decls.fields[node.name+""],node.name+"", node.typeDecl.vtype+"");
					a.declaringClass.decls.fields[node.name+""].vtype=node.typeDecl.vtype;
				}*/
			}
		},
		paramDecl: function (node: ParamDecl) {
			if (node.name && node.typeDecl) {
				//console.log("param typeis",node.name+"", node.typeDecl.vtype+"");
				var va=annotation(node.typeDecl.vtype);
				var a=annotation(node);
				var si=a.scopeInfo;
				if (si && va.resolvedType) {
					//console.log("set param type",node.name+"", node.typeDecl.vtype+"");
					si.resolvedType=va.resolvedType;
				}
			}
		},
		funcDecl: function (node: FuncDecl) {
			//console.log("Visit funcDecl",node);
			var head=node.head;
			/*const finfo=annotation(node).funcInfo;
			if (finfo && head.rtype) {
				const tanon=annotation(head.rtype);
				console.log("ret type of ",head.name+": ", head.rtype.vtype.name+"", tanon);
				finfo.returnType=tanon.resolvedType;// head.rtype.vtype;
			}*/
			this.visit(head);
			this.visit(node.body);
		},

	});
	typeDeclVisitor.def=visitSub;//S
	typeDeclVisitor.visit(klass.node);
}
export function checkExpr(klass:C_Meta ,env:BuilderEnv) {
	const srcFile=klass.src!.tonyu; //file object  //S
	function annotation(node:TNode, aobj?:Annotation):Annotation {//B
		return annotation3(klass.annotation,node,aobj);
	}
	var typeAnnotationVisitor=new Visitor({
		number: function (node:Token) {
			annotation(node,{resolvedType:{class:Number}});
		},
		literal: function (node:Token) {
			annotation(node,{resolvedType:{class:String}});
		},
		postfix:function (node:Postfix) {
			//var a=annotation(node);
			this.visit(node.left);
			this.visit(node.op);
			if (isMember(node.op)) {
				//var m=a.memberAccess;
				const a=annotation(node.left);
				var vtype=a.resolvedType;// visitExpr(m.target);
				const name=node.op.name.text;
				if (vtype && isMeta(vtype)) {
					const field=cu.getField(vtype,name);
					const method=cu.getMethod(vtype,name);
					if (!field && !method) {
						throw TError( R("memberNotFoundInClass",vtype.shortName, name) , srcFile, node.op.name.pos);
					}
					//console.log("GETF",vtype,m.name,f);
					// fail if f is not set when strict check
					if (field && field.resolvedType) {
						annotation(node,{resolvedType:field.resolvedType});
					} else if (method) {
						annotation(node,{resolvedType:{method}});
					}
				}
			} else if (isCall(node.op)) {
				const leftA=annotation(node.left);
				//console.log("OPCALL1", leftA);
				if (leftA && leftA.resolvedType) {
					const leftT=leftA.resolvedType;
					if (!isMethodType(leftT)) {
						throw TError( R("cannotCallNonFunctionType"), srcFile, node.op.pos);
					}
					//console.log("OPCALL", leftT);
					annotation(node, {resolvedType: leftT.method.returnType});
				}
			}
		},
		varAccess: function (node: VarAccess) {
			var a=annotation(node);
			var si=a.scopeInfo;
			if (si) {
				if (si.resolvedType) {
					//console.log("VA typeof",node.name+":",si.resolvedType);
					annotation(node,{resolvedType:si.resolvedType});
				} else if (si.type===ScopeTypes.FIELD) {
					const fld=klass.decls.fields[node.name+""];
					if (!fld) {
						// because parent field does not contain...
						//console.log("TC Warning: fld not found",klass,node.name+"");
						return;
					}
					var rtype=fld.resolvedType;
					if (!rtype) {
						//console.log("VA resolvedType not found",node.name+":",fld);
					} else {
						annotation(node,{resolvedType:rtype});
						//console.log("VA typeof",node.name+":",rtype);
					}
				} else if (si.type===ScopeTypes.METHOD) {
					annotation(node,{resolvedType:{method:si.info}});
				} else if (si.type===ScopeTypes.PROP) {
					//TODO
				}
			}
		},
		exprstmt(node: Exprstmt) {
			this.visit(node.expr);
			handleOtherFiberCall(node);
		},
		varDecl(node:VarDecl) {
			this.visit(node.name);
			this.visit(node.typeDecl);
			this.visit(node.value);
			handleOtherFiberCall(node);
		},
	});
	function handleOtherFiberCall(node:TNode) {
		const a=annotation(node);
		if (a.otherFiberCall) {
			const o=a.otherFiberCall;
			const ta=annotation(o.T);
			if (ta.resolvedType && isMethodType(ta.resolvedType) && !ta.resolvedType.method.nowait) {
				o.fiberCallRequired_lazy();
				o.fiberType=ta.resolvedType;
			}
		}
	}
	const ctx=context<TypeChkCtx>();
	typeAnnotationVisitor.def=visitSub;
	typeAnnotationVisitor.visit(klass.node);
	function visitExpr(node) {
		typeAnnotationVisitor.visit(node);
		var va=annotation(node);
		return va.resolvedType;
	}
};
