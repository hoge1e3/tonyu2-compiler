//type NT={type:string, pos:number};
type VisitF/*<N extends NT>*/=(this:Visitor, node:N)=>void;
type Funcs/*<N extends NT>*/={[key:string]:VisitF/*<N>*/};
type N=any;
export class Visitor/*<N extends NT>*/ {
	path: N[];
	debug=false;
	def?:VisitF/*<N>*/;
	constructor(public funcs:Funcs/*<N>*/) {
		this.path=[];
	}
	visit(node:N) {
		const $=this;
		try {
			$.path.push(node);
			if ($.debug) console.log("visit ",node.type, node.pos);
			var v=(node ? this.funcs[node.type] :null);
			if (v) return v.call($, node);
			else if ($.def) return $.def.call($,node);
		} finally {
			$.path.pop();
		}
	}
	replace(node:N) {
		const $=this;
		if (!$.def) {
			$.def=function (node:N) {
				if (typeof node=="object"){
					for (var i in node) {
						if (node[i] && typeof node[i]=="object") {
							node[i]=$.visit(node[i] as unknown as N);
						}
					}
				}
				return node;
			};
		}
		return $.visit(node);
	};
}/*
export function Visitor<N extends NT>(funcs: Funcs<N>) {
	return new VisitorClass(funcs);
	var $:any={funcs:funcs, path:[]};
	$.visit=function (node) {
		try {
			$.path.push(node);
			if ($.debug) console.log("visit ",node.type, node.pos);
			var v=(node ? funcs[node.type] :null);
			if (v) return v.call($, node);
			else if ($.def) return $.def.call($,node);
		} finally {
			$.path.pop();
		}
	};
	$.replace=function (node) {
		if (!$.def) {
			$.def=function (node) {
				if (typeof node=="object"){
					for (var i in node) {
						if (node[i] && typeof node[i]=="object") {
							node[i]=$.visit(node[i]);
						}
					}
				}
				return node;
			};
		}
		return $.visit(node);
	};
	return $;*/
//};
