"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.IndentBuffer = void 0;
const StringBuilder_1 = __importDefault(require("../lib/StringBuilder"));
const source_map_1 = __importDefault(require("./source-map"));
const Pos2RC = function (src) {
    var map = [];
    var pos = 0;
    var lastRow = 0;
    src.split("\n").forEach(function (line) {
        map.push(pos);
        pos += line.length + 1;
    });
    map.push(pos);
    return {
        getRC(pos) {
            while (true) {
                if (lastRow < 0) {
                    return { row: 1, col: 1 };
                }
                if (lastRow + 1 >= map.length) {
                    return { row: map.length, col: 1 };
                }
                //A(!( pos<map[lastRow]  &&  map[lastRow]<=pos ));
                //A(!( map[lastRow+1]<=pos  &&  pos<map[lastRow+1] ));
                if (pos < map[lastRow]) {
                    lastRow--;
                }
                else if (map[lastRow + 1] <= pos) {
                    lastRow++;
                }
                else {
                    return { row: lastRow + 1, col: pos - map[lastRow] + 1 };
                }
            }
        }
    };
};
class IndentBuffer {
    constructor(options) {
        this.useLengthPlace = false;
        this.lazyOverflow = false;
        this.traceIndex = {};
        //$.printf=$;
        this.buf = StringBuilder_1.default();
        this.bufRow = 1;
        this.bufCol = 1;
        this.srcmap = new source_map_1.default.SourceMapGenerator();
        this.indentBuf = "";
        this.indentStr = "  ";
        const $ = this;
        this.options = options || {};
        this.options.fixLazyLength = this.options.fixLazyLength || 6;
        $.dstFile = options.dstFile;
        $.mapFile = options.mapFile;
    }
    get printf() { return this._printf.bind(this); }
    _printf(fmt, ...args) {
        const $ = this;
        //var args=arguments;
        //var fmt=args[0];
        //console.log(fmt+ " -- "+arguments[0]+" --- "+arguments.length);
        let ai = -1;
        function shiftArg(nullable = false) {
            ai++;
            var res = args[ai];
            if (res == null && !nullable) {
                console.log(args);
                throw new Error(ai + "th null param: fmt=" + fmt);
            }
            return res;
        }
        while (true) {
            var i = fmt.indexOf("%");
            if (i < 0) {
                $.print(fmt);
                break;
            }
            $.print(fmt.substring(0, i));
            i++;
            var fstr = fmt.charAt(i);
            if (fstr == "s") {
                var str = shiftArg();
                if (typeof str == "string" || typeof str == "number") { }
                else if (str == null)
                    str = "null";
                else if (str.text) {
                    $.addMapping(str);
                    str = str.text;
                }
                $.print(str);
                i++;
            }
            else if (fstr == "d") {
                var n = shiftArg();
                if (typeof n != "number")
                    throw new Error(n + " is not a number: fmt=" + fmt);
                $.print(n);
                i++;
            }
            else if (fstr == "n") {
                $.ln();
                i++;
            }
            else if (fstr == "{") {
                $.indent();
                i++;
            }
            else if (fstr == "}") {
                $.dedent();
                i++;
            }
            else if (fstr == "%") {
                $.print("%");
                i++;
            }
            else if (fstr == "f") {
                shiftArg()($);
                i++;
            }
            else if (fstr == "l") {
                var lit = shiftArg();
                $.print($.toLiteral(lit));
                i++;
            }
            else if (fstr == "v") {
                var a = shiftArg();
                if (!a)
                    throw new Error("Null %v");
                if (typeof a != "object")
                    throw new Error("nonobject %v:" + a);
                $.addMapping(a);
                $.visit(a);
                i++;
            }
            else if (fstr == "z") {
                var place = shiftArg();
                if ("val" in place) {
                    $.print(place.val);
                    return;
                }
                if (!place.inited) {
                    $.lazy(place);
                }
                place.print();
                //$.print(place.gen);
                i++;
            }
            else if (fstr == "j") {
                var sp_node = shiftArg();
                var sp = sp_node[0];
                var node = sp_node[1];
                var sep = false;
                if (!node || !node.forEach) {
                    console.log(node);
                    throw new Error(node + " is not array. cannot join fmt:" + fmt);
                }
                for (let n of node) {
                    if (sep)
                        $.printf(sp);
                    sep = true;
                    $.visit(n);
                }
                i++;
            }
            else if (fstr == "D") {
                shiftArg(true);
                i++;
            }
            else {
                i += 2;
            }
            fmt = fmt.substring(i);
        }
        if (ai + 1 < args.length)
            throw new Error(`printf: Argument remains ${ai + 1}<${args.length}`);
    }
    visit(n) {
        if (!this.visitor)
            throw new Error("Visitor is not set");
        this.visitor.visit(n);
    }
    addTraceIndex(fname) {
        this.traceIndex[fname] = 1;
    }
    addMapping(token) {
        const $ = this;
        //console.log("Token",token,$.srcFile+"");
        if (!$.srcFile)
            return;
        // token:extend({text:String},{pos:Number}|{row:Number,col:Number})
        var rc;
        if (typeof token.row == "number" && typeof token.col == "number") {
            rc = { row: token.row, col: token.col };
        }
        else if (typeof token.pos == "number") {
            rc = $.srcRCM.getRC(token.pos);
        }
        if (rc) {
            //console.log("Map",{src:{file:$.srcFile+"",row:rc.row,col:rc.col},
            //dst:{row:$.bufRow,col:$.bufCol}  });
            $.srcmap.addMapping({
                generated: {
                    line: $.bufRow,
                    column: $.bufCol
                },
                source: $.srcFile + "",
                original: {
                    line: rc.row,
                    column: rc.col
                }
                //name: "christopher"
            });
        }
    }
    ;
    setSrcFile(f) {
        const $ = this;
        $.srcFile = f;
        $.srcRCM = Pos2RC(f.text());
        $.srcmap.setSourceContent(f.path(), f.text());
    }
    print(v) {
        const $ = this;
        $.buf.append(v);
        var a = (v + "").split("\n");
        a.forEach(function (line, i) {
            if (i < a.length - 1) { // has \n
                $.bufCol += line.length + 1;
                $.bufRow++;
                $.bufCol = 1;
            }
            else {
                $.bufCol += line.length;
            }
        });
    }
    ;
    lazy(place = {}) {
        const $ = this;
        const options = $.options;
        place.length = place.length || options.fixLazyLength;
        place.pad = place.pad || " ";
        place.gen = (function () {
            var r = "";
            for (var i = 0; i < place.length; i++)
                r += place.pad;
            return r;
        })();
        place.puts = [];
        $.useLengthPlace = true;
        place.inited = true;
        //place.src=place.gen;
        place.put = function (val) {
            this.val = val + "";
            if (this.puts) {
                if (this.val.length > this.length) {
                    $.lazyOverflow = true;
                }
                while (this.val.length < this.length) {
                    this.val += this.pad;
                }
                var place = this;
                this.puts.forEach(function (i) {
                    $.buf.replace(i, place.val);
                    /*var pl=$.buf.length;
                    $.buf=$.buf.substring(0,i)+place.val+$.buf.substring(i+place.length);
                    A.eq(pl,$.buf.length);*/
                });
            }
            /*if (this.reg) {
                $.buf=$.buf.replace(this.reg, val);
            }*/
            return this.val;
        };
        place.print = function () {
            if (this.puts)
                this.puts.push($.buf.getLength());
            $.print(this.gen);
        };
        return place;
        //return {put: function () {} };
    }
    ln() {
        const $ = this;
        $.print("\n" + $.indentBuf);
    }
    indent() {
        const $ = this;
        $.indentBuf += $.indentStr;
        $.print("\n" + $.indentBuf);
    }
    dedent() {
        const $ = this;
        var len = $.indentStr.length;
        if (!$.buf.last(len).match(/^\s*$/)) {
            console.log($.buf);
            throw new Error("Non-space truncated ");
        }
        $.buf.truncate(len); //=$.buf.substring(0,$.buf.length-len);
        $.indentBuf = $.indentBuf.substring(0, $.indentBuf.length - len);
    }
    toLiteral(s, quote = "'") {
        if (typeof s !== "string") {
            console.log("no literal ", s);
            throw new Error("toLiteral:" + s + " is not a literal");
        }
        s = s.replace(/\\/g, "\\\\");
        s = s.replace(/\r/g, "\\r");
        s = s.replace(/\n/g, "\\n");
        if (quote == "'")
            s = s.replace(/'/g, "\\'");
        else
            s = s.replace(/"/g, '\\"');
        return quote + s + quote;
    }
    close() {
        const $ = this;
        $.mapStr = $.srcmap.toString();
        if ($.mapFile && $.dstFile) {
            $.mapFile.text($.mapStr);
            $.printf("%n//# sourceMappingURL=%s%n", $.mapFile.relPath($.dstFile.up()));
        }
        const gen = $.buf + "";
        if ($.dstFile) {
            $.dstFile.text(gen);
        }
        return gen;
    }
    ;
}
exports.IndentBuffer = IndentBuffer;
/*
export= function IndentBuffer(options) {
    options=options||{};
    options.fixLazyLength=options.fixLazyLength||6;
    var $:any=function (fmt:string, ...args:any[]) {
        //var args=arguments;
        //var fmt=args[0];
        //console.log(fmt+ " -- "+arguments[0]+" --- "+arguments.length);
        var ai=-1;
        function shiftArg(nullable=false) {
            ai++;
            var res=args[ai];
            if (res==null && !nullable) {
                console.log(args);
                throw new Error(ai+"th null param: fmt="+fmt);
            }
            return res;
        }
        while (true) {
            var i=fmt.indexOf("%");
            if (i<0) {$.print(fmt); break;}
            $.print(fmt.substring(0,i));
            i++;
            var fstr=fmt.charAt(i);
            if (fstr=="s") {
                var str=shiftArg();
                if (typeof str == "string" || typeof str =="number") {}
                else if (str==null) str="null";
                else if (str.text) {
                    $.addMapping(str);
                    str=str.text;
                }
                $.print(str);
                i++;
            } else if (fstr=="d") {
                var n=shiftArg();
                if (typeof n!="number") throw new Error (n+" is not a number: fmt="+fmt);
                $.print(n);
                i++;
            } else if (fstr=="n") {
                $.ln();
                i++;
            } else if (fstr=="{") {
                $.indent();
                i++;
            } else if (fstr=="}") {
                $.dedent();
                i++;
            } else if (fstr=="%") {
                $.print("%");
                i++;
            } else if (fstr=="f") {
                shiftArg()($);
                i++;
            } else if (fstr=="l") {
                var lit=shiftArg();
                $.print($.toLiteral(lit));
                i++;
            } else if (fstr=="v") {
                var a=shiftArg();
                if (!a) throw new Error ("Null %v");
                if (typeof a!="object") throw new Error("nonobject %v:"+a);
                $.addMapping(a);
                $.visitor.visit(a);
                i++;
            } else if (fstr=="z") {
                var place=shiftArg();
                if ("val" in place) {
                    $.print(place.val);
                    return;
                }
                if (!place.inited) {
                    $.lazy(place);
                }
                place.print();
                //$.print(place.gen);
                i++;
            } else if (fstr=="j") {
                var sp_node=shiftArg();
                var sp=sp_node[0];
                var node=sp_node[1];
                var sep=false;
                if (!node || !node.forEach) {
                    console.log(node);
                    throw new Error (node+" is not array. cannot join fmt:"+fmt);
                }
                for (let n of node) {
                    if (sep) $.printf(sp);
                    sep=true;
                    $.visitor.visit(n);
                }
                i++;
            } else if (fstr=="D"){
                shiftArg(true);
                i++;
            } else {
                i+=2;
            }
            fmt=fmt.substring(i);
        }
    };
    $.addTraceIndex=function (fname) {
        if (!this.traceIndex) this.traceIndex={};
        this.traceIndex[fname]=1;
    };
    $.addMapping=function (token) {
        //console.log("Token",token,$.srcFile+"");
        if (!$.srcFile) return ;
        // token:extend({text:String},{pos:Number}|{row:Number,col:Number})
        var rc;
        if (typeof token.row=="number" && typeof token.col=="number") {
            rc={row:token.row, col:token.col};
        } else if (typeof token.pos=="number") {
            rc=$.srcRCM.getRC(token.pos);
        }
        if (rc) {
            //console.log("Map",{src:{file:$.srcFile+"",row:rc.row,col:rc.col},
            //dst:{row:$.bufRow,col:$.bufCol}  });
            $.srcmap.addMapping({
                generated: {
                    line: $.bufRow,
                    column: $.bufCol
                },
                source: $.srcFile+"",
                original: {
                    line: rc.row,
                    column: rc.col
                }
                //name: "christopher"
            });
        }
    };
    $.setSrcFile=function (f) {
        $.srcFile=f;
        $.srcRCM=Pos2RC(f.text());
        $.srcmap.setSourceContent(f.path(),f.text());
    };
    $.print=function (v) {
        $.buf.append(v);
        var a=(v+"").split("\n");
        a.forEach(function (line,i) {
            if (i<a.length-1) {// has \n
                $.bufCol+=line.length+1;
                $.bufRow++;
                $.bufCol=1;
            } else {
                $.bufCol+=line.length;
            }
        });
    };
    $.dstFile=options.dstFile;
    $.mapFile=options.mapFile;
    $.printf=$;
    $.buf=StringBuilder();
    $.bufRow=1;
    $.bufCol=1;
    $.srcmap=new SourceMap.SourceMapGenerator();
    $.lazy=function (place) {
        if (!place) place={};
            place.length=place.length||options.fixLazyLength;
            place.pad=place.pad||" ";
            place.gen=(function () {
                var r="";
                for(var i=0;i<place.length;i++) r+=place.pad;
                return r;
            })();
            place.puts=[];
            $.useLengthPlace=true;

        place.inited=true;
        //place.src=place.gen;
        place.put=function (val) {
            this.val=val+"";
            if (this.puts) {
                if (this.val.length>this.length) {
                    $.lazyOverflow=true;
                }
                while (this.val.length<this.length) {
                    this.val+=this.pad;
                }
                var place=this;
                this.puts.forEach(function (i) {
                    $.buf.replace(i, place.val);

                });
            }

            return this.val;
        };
        place.print=function () {
            if (this.puts) this.puts.push($.buf.getLength());
            $.print(this.gen);
        };
        return place;
        //return {put: function () {} };
    };
    $.ln=function () {
        $.print("\n"+$.indentBuf);
    };
    $.indent=function () {
        $.indentBuf+=$.indentStr;
        $.print("\n"+$.indentBuf);
    };
    $.dedent = function () {
        var len=$.indentStr.length;
        if (!$.buf.last(len).match(/^\s*$/)) {
            console.log($.buf);
            throw new Error ("Non-space truncated ");
        }
        $.buf.truncate(len);//=$.buf.substring(0,$.buf.length-len);
        $.indentBuf=$.indentBuf.substring(0 , $.indentBuf.length-len);
    };
    $.toLiteral= function (s, quote) {
        if (!quote) quote="'";
    if (typeof s!=="string") {
        console.log("no literal ",s);
        throw new Error("toLiteral:"+s+" is not a literal");
    }
        s = s.replace(/\\/g, "\\\\");
        s = s.replace(/\r/g, "\\r");
        s = s.replace(/\n/g, "\\n");
        if (quote=="'") s = s.replace(/'/g, "\\'");
        else s = s.replace(/"/g, '\\"');
        return quote + s + quote;
    };
    $.indentBuf="";
    $.indentStr="  ";
    $.close=function () {
        $.mapStr=$.srcmap.toString();
        if ($.mapFile && $.dstFile) {
            $.mapFile.text($.mapStr);
            $.printf("%n//# sourceMappingURL=%s%n",$.mapFile.relPath($.dstFile.up()));
        }
        const gen=$.buf+"";
        if ($.dstFile) {
            $.dstFile.text(gen);
        }
        return gen;
    };
    return $;
};*/
