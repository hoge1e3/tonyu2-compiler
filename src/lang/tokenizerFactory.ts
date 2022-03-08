/*define(["Grammar", "XMLBuffer", "IndentBuffer","disp", "Parser","TError"],
function (Grammar, XMLBuffer, IndentBuffer, disp, Parser,TError) {
*/

import { ALL, Parser, StringParser, StrStateSrc } from "./parser";

//import Parser from "./parser";

export= function tokenizerFactory({reserved, caseInsensitive}) {
	/*function profileTbl(parser, name) {
		var tbl=parser._first.tbl;
		for (var c in tbl) {
			tbl[c].profile();//(c+" of "+tbl[name);
		}
	}*/
	//const spcs={};for(i=0;i<=0xffff;i++) if (String.fromCharCode(i).match(/\s/)) spcs[i]=1;
	const spcs={
		9: 1, 10: 1, 11: 1, 12: 1, 13: 1, 32: 1, 160: 1, 5760: 1,
		8192: 1, 8193: 1, 8194: 1, 8195: 1, 8196: 1, 8197: 1, 8198: 1, 8199: 1,
		8200: 1, 8201: 1, 8202: 1, 8232: 1, 8233: 1, 8239: 1, 8287: 1,
		12288: 1, 65279: 1
	};
	function skipSpace(str:string,pos:number) {
		const spos=pos;
		const max=str.length;
		//const spcs={9:1,10:1,11:1,12:1,13:1,32:1};
		for(;pos<max;pos++) {
		    if (spcs[str.charCodeAt(pos)]) continue;
		    if (str[pos]==="/") {
		      	if (str[pos+1]==="*" && readMultiComment()) continue;
		      	else if (str[pos+1]==="/" && readSingleComment()) continue;
		    }
		    break;
		}
		return {len:pos-spos};

		function readSingleComment() {
		   	/* <pos>//....<pos>\n */
		   	for(;pos<max;pos++) {
		      	if (str[pos]=="\n") {return true;}
		   	}
		    pos--;
		    return true;
		}
		function readMultiComment(){
		    // <pos>/*....*<pos>/
		    const spos=pos;
		    pos+=2;
		    for(;pos<max;pos++) {
		    	if (str[pos]==="*" && str[pos+1]==="/") {
		        	pos++;return true;
		      	}
		    }
		    pos=spos;
		}
	}
	//var sp=Parser.StringParser;
	var SAMENAME="SAMENAME";
	const DIV=1,REG=2;
	type Mode=number;
	//var space=sp.reg(/^(\s*(\/\*\/?([^\/]|[^*]\/|\r|\n)*\*\/)*(\/\/.*\r?\n)*)*/).setName("space");
	var space=new StringParser().strLike(skipSpace).setName("space");
	const sp=StringParser.withSpace(space);
	function tk(r, name?:string) {
		let pat:Parser;
		let fst:string;
		if (typeof r=="string") {
			pat=sp.str(r);
			if (r.length>0) fst=r.substring(0,1);
			if (!name) name=r;
		} else {
			pat=sp.reg(r);
			if (!name) name=r+"";
		}
		var res=pat.ret((b)=>{
			var res:any={};
			res.pos=b.pos;
			if (typeof res.pos!="number") throw "no pos for "+name+" ";//+disp(b);
			res.len=b.len;
			res.text=b.src.str.substring(res.pos, res.pos+res.len);
			if (typeof res.text!="string") throw "no text("+res.text+") for "+name+" ";//+disp(b);
			res.toString=function (){
				return this.text;
			};
			res.isToken=true;
			return res;
		});
		if (fst) res=res.first(fst);
		return res.setName(name);//.profile();
	}
	var parsers:any={},posts:any={};
	function dtk2(prev:Mode, name:string, parser:Parser|string) {
		//console.log("2reg="+prev+" name="+name);
		if (typeof parser=="string") parser=tk(parser);
		parsers[prev]=or(parsers[prev], parser.ret(function (res) {
			res.type=name;
			return res;
		}).setName(name) );
	}
	function dtk(prev:Mode, name:string, parser, post:Mode) {
		if(name==SAMENAME) name=parser;
		for (var m=1; m<=prev; m*=2) {
			//prev=1  -> m=1
			//prev=2  -> m=1x,2
			//XXprev=3  -> m=1,2,3
			if ((prev&m)!=0) dtk2(prev&m, name, parser);
		}
		posts[name]=post;
	}
	function or(a,b){
		if (!a) return b;
		return a.or(b);
	}

	var all=sp.create(function (st) {
		var mode=REG;
		var res=[];
		while (true) {
			st=parsers[mode].parse(st);
			if (!st.success) break;
			var e=st.result[0];
			mode=posts[e.type];
			//console.log("Token",e, mode);
			res.push(e);
		}
		st=space.parse(st);
		//console.log(st.src.maxPos+"=="+st.src.str.length)
		const src=st.src as StrStateSrc;
		st.success=st.src.maxPos==src.str.length;
		st.result[0]=res;
		return st;
	});
	// Tested at https://codepen.io/hoge1e3/pen/NWWaaPB?editors=1010
	var num=tk(/^(?:0x[0-9a-f]+|0b[01]+|(?:[0-9]+(?:\.[0-9]*)?|\.[0-9]+)(?:e-?[0-9]+)?)/i).ret(function (n) {
		n.type="number";
		n.value=n.text-0;//parseInt(n.text);
		return n;
	}).first("0123456789");
	var literal=tk({exec: function (s) {
		var head=s.substring(0,1);
		if (head!=='"' && head!=="'") return false;
		for (var i=1 ;i<s.length ; i++) {
			var c=s.substring(i,i+1);
			if (c===head) {
				return [s.substring(0,i+1)];
			} else if (c==="\\") {
				i++;
			}
		}
		return false;
	},toString:function(){return"literal";}
	}).first("\"'");
	var regex=tk({exec: function (s) {
		if (s.substring(0,1)!=='/') return false;
		for (var i=1 ;i<s.length ; i++) {
			var c=s.substring(i,i+1);
			if (c==='/') {
				var r=/^[ig]*/.exec( s.substring(i+1) );
				return [s.substring(0,i+1+r[0].length)];
			} else if (c=="\n") {
				return false;
			} else if (c==="\\") {
				i++;
			}
		}
		return false;
	},toString:function(){return"regex";}
	}).first("/");

	dtk(REG|DIV, "number", num,DIV );
	dtk(REG,  "regex" ,regex,DIV );
	dtk(REG|DIV,  "literal" ,literal,DIV );

	dtk(REG|DIV,SAMENAME ,"++",DIV );
	dtk(REG|DIV,SAMENAME ,"--",DIV );

	dtk(REG|DIV,SAMENAME ,"!==",REG );
	dtk(REG|DIV,SAMENAME ,"===",REG );
	dtk(REG|DIV,SAMENAME ,">>>",REG );
	dtk(REG|DIV,SAMENAME ,"+=",REG );
	dtk(REG|DIV,SAMENAME ,"-=",REG );
	dtk(REG|DIV,SAMENAME ,"*=",REG );
	dtk(REG|DIV,SAMENAME ,"/=",REG );
	dtk(REG|DIV,SAMENAME ,"%=",REG );
	dtk(REG|DIV,SAMENAME ,">=",REG );
	dtk(REG|DIV,SAMENAME ,"<=",REG );
	dtk(REG|DIV,SAMENAME ,"!=",REG );
	dtk(REG|DIV,SAMENAME ,"==",REG );
	dtk(REG|DIV,SAMENAME ,">>",REG );
	dtk(REG|DIV,SAMENAME ,"<<",REG );

	dtk(REG|DIV,SAMENAME ,"&&",REG );
	dtk(REG|DIV,SAMENAME ,"||",REG );


	dtk(REG|DIV,SAMENAME ,"(",REG );
	dtk(REG|DIV,SAMENAME ,")",DIV );


	dtk(REG|DIV,SAMENAME ,"[",REG );
	dtk(REG|DIV,SAMENAME ,"]",DIV );  // a[i]/3

	dtk(REG|DIV,SAMENAME ,"{",REG );
	//dtk(REG|DIV,SAMENAME ,"}",REG );  // if () { .. }  /[a-z]/.exec()
	dtk(REG|DIV,SAMENAME ,"}",DIV ); //in tonyu:  a{x:5}/3

	dtk(REG|DIV,SAMENAME ,">",REG );
	dtk(REG|DIV,SAMENAME ,"<",REG );
	dtk(REG|DIV,SAMENAME ,"^",REG );
	dtk(REG|DIV,SAMENAME ,"+",REG );
	dtk(REG|DIV,SAMENAME ,"-",REG );
	dtk(REG|DIV, SAMENAME ,".",REG );
	dtk(REG|DIV,SAMENAME ,"?",REG );

	dtk(REG|DIV, SAMENAME ,"=",REG );
	dtk(REG|DIV, SAMENAME ,"*",REG );
	dtk(REG|DIV, SAMENAME ,"%",REG );
	dtk(DIV, SAMENAME ,"/",REG );

	dtk(DIV|REG, SAMENAME ,"^",REG );
	dtk(DIV|REG, SAMENAME ,"~",REG );

	dtk(DIV|REG, SAMENAME ,"\\",REG );
	dtk(DIV|REG, SAMENAME ,":",REG );
	dtk(DIV|REG, SAMENAME ,";",REG );
	dtk(DIV|REG, SAMENAME ,",",REG );
	dtk(REG|DIV,SAMENAME ,"!",REG );
	dtk(REG|DIV,SAMENAME ,"&",REG );
	dtk(REG|DIV,SAMENAME ,"|",REG );

	var symresv=tk(/^[a-zA-Z_$][a-zA-Z0-9_$]*/,"symresv_reg").ret(function (s) {
		s.type=(s.text=="constructor" ? "tk_constructor" :
			reserved.hasOwnProperty(s.text) ? s.text : "symbol");
		if (caseInsensitive) {
			s.text=s.text.toLowerCase();
		}
		return s;
	}).first(ALL);
	for (var n in reserved) {
		posts[n]=REG;
	}
	posts.tk_constructor=REG;
	posts.symbol=DIV;
	parsers[REG]=or(parsers[REG],symresv);
	parsers[DIV]=or(parsers[DIV],symresv);
	console.log(parsers[REG]);
	console.log(parsers[DIV]);

	function parse(str:string) {
		var res=sp.parse(all, str);
		if (res.success) {
		} else {
			console.log("Stopped at "+
			str.substring( res.src.maxPos-5, res.src.maxPos)+"!!HERE!!"+str.substring(res.src.maxPos,res.src.maxPos+5));
		}
		return res;
	}
	return {parse:parse, extension:"js",reserved:reserved};
};
