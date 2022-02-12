/*define(["Grammar", "XMLBuffer", "IndentBuffer","disp", "Parser","TError"],
function (Grammar, XMLBuffer, IndentBuffer, disp, Parser,TError) {
*/
import tokenizerFactory = require("./tokenizerFactory");

export=tokenizerFactory({
	caseInsensitive: true,
	reserved:{
		'while':true,
        'switch':true,
        'case':true,
        'default':true,
        'break':true,
        'if':true,
        'is':true,
        'in':true,
        'else':true,
        'null':true,
        'for':true,
        'fork':true,
        'function':true,
        'constructor':true,
        'destructor':true,
        'extends':true,
        'native':true,
        'new':true,
        'return':true,
        'var':true,
	}
});
