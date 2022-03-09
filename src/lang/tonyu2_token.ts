import {tokenizerFactory} from "./tokenizerFactory";

/*define(["Grammar", "XMLBuffer", "IndentBuffer","disp", "Parser","TError"],
function (Grammar, XMLBuffer, IndentBuffer, disp, Parser,TError) {
*/
export= tokenizerFactory({
	caseInsensitive: false,
	reserved:{
		"function":true, "var":true , "return":true, "typeof": true, "if":true,
		"__typeof": true,
		"for":true,
		"else": true,
		"super": true,
		"while":true,
		"continue":true,
		"break":true,
		"do":true,
		"switch":true,
		"case":true,
		"default":true,
		"try": true,
		"catch": true,
		"finally": true,
		"throw": true,
		"of": true,
		"in": true,
		fiber:true,
		"native": true,
		"instanceof":true,
		"new": true,
		"is": true,
		"true": true,
		"false": true,
		"null":true,
		"this":true,
		"undefined": true,
		"usethread": true,
		"constructor": true,
		ifwait:true,
		nowait:true,
		_thread:true,
		arguments:true,
		"delete": true,
		"extends":true,
		"includes":true
	}
});
