"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Visitor = void 0;
class Visitor /*<N extends NT>*/ {
    constructor(funcs /*<N>*/) {
        this.funcs = funcs;
        this.debug = false;
        this.path = [];
    }
    visit(node) {
        const $ = this;
        try {
            $.path.push(node);
            if ($.debug)
                console.log("visit ", node.type, node.pos);
            var v = (node ? this.funcs[node.type] : null);
            if (v)
                return v.call($, node);
            else if ($.def)
                return $.def.call($, node);
        }
        finally {
            $.path.pop();
        }
    }
    replace(node) {
        const $ = this;
        if (!$.def) {
            $.def = function (node) {
                if (typeof node == "object") {
                    for (var i in node) {
                        if (node[i] && typeof node[i] == "object") {
                            node[i] = $.visit(node[i]);
                        }
                    }
                }
                return node;
            };
        }
        return $.visit(node);
    }
    ;
} /*
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
exports.Visitor = Visitor;
//};
