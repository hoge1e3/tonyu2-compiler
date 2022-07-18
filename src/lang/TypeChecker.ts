import * as cu from "./compiler";
import R from "../lib/R";
import {context} from "./context";
import { FuncDecl, ParamDecl, Postfix, TNode, VarAccess, VarDecl, Exprstmt, isCall, isMember, NewExpr, isArrayElem, Forin } from "./NodeTypes";
//import Grammar from "./Grammar";
import { SUBELEMENTS, Token } from "./parser";
import {Visitor} from "./Visitor";
import { AnnotatedType, Annotation, BuilderEnv, C_FieldInfo, C_Meta, FuncInfo, isArrayType, isMeta, isMethodType, isNativeClass } from "./CompilerTypes";
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
		forin(node:Forin) {
			this.visit(node.set);
			const a=annotation(node.set);
			if (a.resolvedType && isArrayType(a.resolvedType) &&
				node.isVar && node.isVar.text!=="var") {
				if (node.vars.length==1) {
					const sa=annotation(node.vars[0]);
					sa.scopeInfo.resolvedType=a.resolvedType.element;
				} else if (node.vars.length==2) {
					const sa=annotation(node.vars[1]);
					sa.scopeInfo.resolvedType=a.resolvedType.element;

					const si=annotation(node.vars[0]);
					si.scopeInfo.resolvedType={class:Number};

				}
			} else {
				this.visit(node.vars);
			}
		},
		varDecl(node: VarDecl) {
			//console.log("TCV","varDecl",node);
			if (node.value) this.visit(node.value);
			let rt:AnnotatedType;
			if (node.value) {
				const a=annotation(node.value);
				if (a.resolvedType) {
					rt=a.resolvedType;
					//console.log("Inferred",rt);
				}
			}
			if (node.name && node.typeDecl) {
				const va=annotation(node.typeDecl.vtype);
				rt=va.resolvedType;
			}
			if (rt) {
				const a=annotation(node);
				const si=a.scopeInfo;
				if (si) {
					si.resolvedType=rt;
					if (si.type===cu.ScopeTypes.FIELD) {
						si.info.resolvedType=rt;
					}
				}
			} else {
				env.unresolvedVars++;
			}
		},
		paramDecl(node: ParamDecl) {
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
		funcDecl(node: FuncDecl) {
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
					const prop=cu.getProperty(vtype,name);
					if (!field && !method && !prop) {
						throw TError( R("memberNotFoundInClass",vtype.shortName, name) , srcFile, node.op.name.pos);
					}
					//console.log("GETF",vtype,m.name,f);
					// fail if f is not set when strict check
					if (field && field.resolvedType) {
						annotation(node,{resolvedType:field.resolvedType});
					} else if (method) {
						annotation(node,{resolvedType:{method}});
					} else if (prop && prop.getter) {
						annotation(node,{resolvedType:prop.getter.returnType});
					} else if (prop && prop.setter && prop.setter.paramTypes) {
						annotation(node,{resolvedType:prop.setter.paramTypes[0]});
					}
				}
				if (vtype && isNativeClass(vtype)) {
					if (vtype.class.prototype[name]) {
						//OK (as any)
					} else {
						throw TError( R("memberNotFoundInClass",vtype.class.name, name) , srcFile, node.op.name.pos);
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
			} else if (isArrayElem(node.op)) {
				const leftA=annotation(node.left);
				if (leftA && leftA.resolvedType && isArrayType(leftA.resolvedType)) {
					const rt=leftA.resolvedType.element;
					annotation(node,{resolvedType:rt});
				}
			}
		},
		newExpr: function (node:NewExpr) {
			const a=annotation(node.klass);
			if (a.scopeInfo && a.scopeInfo.type===cu.ScopeTypes.CLASS) {
				const rt:AnnotatedType=a.scopeInfo.info;
				annotation(node, {resolvedType:rt});
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
					annotation(node,{resolvedType:{method:si.info}});
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
				//o.fiberCallRequired_lazy();
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
