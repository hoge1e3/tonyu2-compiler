const ja={
    "MethodAlreadyDeclared": "メソッド{1}はすでに定義されています",
    typeNotFound: "型{1}が見つかりません",
    cannotCallNonFunctionType: "関数・メソッドでないので呼び出すことはできません",
    memberNotFoundInClass: "クラス{1}にフィールドまたはメソッド{2}が定義されていません",
    expected: "ここには{1}などが入ることが予想されます",
    superClassIsUndefined:"親クラス {1}は定義されていません",
    classIsUndefined:"クラス {1}は定義されていません",
    invalidLeftValue:"'{1}'は左辺には書けません．",
    fieldDeclarationRequired: "{1}は宣言されていません（フィールドの場合，明示的に宣言してください）．",
    duplicateKeyInObjectLiteral:"オブジェクトリテラルのキー名'{1}'が重複しています",
    cannotUseStringLiteralAsAShorthandOfObjectValue:"オブジェクトリテラルのパラメタに単独の文字列は使えません",
    breakShouldBeUsedInIterationOrSwitchStatement:"break； は繰り返しまたはswitch文の中で使います." ,
    continueShouldBeUsedInIterationStatement:"continue； は繰り返しの中で使います.",
    cannotUseObjectLiteralAsTheExpressionOfStatement:"オブジェクトリテラル単独の式文は書けません．",
    undefinedMethod:"メソッド{1}はありません．",
    undefinedSuperMethod:"親クラスまたは参照モジュールにメソッド'{1}'がありません．",
    notAWaitableMethod: "メソッド{1}は待機可能メソッドではありません",
    circularDependencyDetected: "次のクラス間に循環参照があります: {1}",
    cannotWriteReturnInTryStatement: "現実装では、tryの中にreturnは書けません",
    cannotWriteBreakInTryStatement: "現実装では、tryの中にbreakは書けません",
    cannotWriteContinueInTryStatement: "現実装では、tryの中にcontinueは書けません",
    cannotWriteTwoOrMoreCatch: "現実装では、catch節1個のみをサポートしています",
    lexicalError:"文法エラー(Token)",
    parseError:"文法エラー",
    ambiguousClassName: "曖昧なクラス名： {1}.{2}, {3}",
    cannotInvokeMethod: "{1}(={2})のメソッド {3}を呼び出せません",
    notAMethod :"{1}{2}(={3})はメソッドではありません",
    notAFunction: "{1}は関数ではありません",
    uninitialized: "{1}(={2})は初期化されていなません",
    newIsRequiredOnInstanciate: "クラス名{1}はnewをつけて呼び出して下さい。",
    bootClassIsNotFound: "{1}というクラスはありません．",
    infiniteLoopDetected: "無限ループをストップしました。\n"+
        "   プロジェクト オプションで無限ループチェックの有無を設定できます。\n"+
        "   [参考]https://edit.tonyu.jp/doc/options.html\n",
};
const en={
    "MethodAlreadyDeclared": "Method {1} is already defined",
    typeNotFound: "Type {1} is not found",
    cannotCallNonFunctionType: "Cannot call what is neither function or method.",
    memberNotFoundInClass: "No such field or method: {1}.{2}",
    "expected": "Expected: {1}",
    "superClassIsUndefined" : "Super Class '{1}' is not defined", //親クラス {1}は定義されていません
    "classIsUndefined" : "Class {1} is Undefined", //クラス {1}は定義されていません
    "invalidLeftValue" : "{1} is not a valid Left Value", //'{1}'は左辺には書けません．
    "fieldDeclarationRequired" : "'{1}' is not declared, If you have meant it is a Field, Declare Explicitly.", //{1}は宣言されていません（フィールドの場合，明示的に宣言してください）．
    "duplicateKeyInObjectLiteral" : "Duplicate Key In Object Literal: {1}", //オブジェクトリテラルのキー名'{1}'が重複しています
    "cannotUseStringLiteralAsAShorthandOfObjectValue" : "Cannot Use String Literal as a Shorthand of Object Value", //オブジェクトリテラルのパラメタに単独の文字列は使えません
    "breakShouldBeUsedInIterationOrSwitchStatement" : "break; Should be Used In Iteration or switch Statement", //break； は 繰り返しまたはswitch文の中で使います.
    "continueShouldBeUsedInIterationStatement" : "continue; Should be Used In Iteration Statement", //continue； は繰り返しの中で使います.
    "cannotUseObjectLiteralAsTheExpressionOfStatement" : "Cannot Use Object Literal As The Expression Of Statement", //オブ ジェクトリテラル単独の式文は書けません．
    "undefinedMethod" : "Undefined Method: '{1}'", //メソッド{1}はありません．
    undefinedSuperMethod:"Method '{1}' is defined in neigher superclass or including modules.",
    "notAWaitableMethod" : "Not A Waitable Method: '{1}'", //メソッド{1}は待機可能メソッドではありません
    "circularDependencyDetected" : "Circular Dependency Detected: {1}", //次のクラス間に循環参照があります: {1}
    "cannotWriteReturnInTryStatement" : "Cannot Write Return In Try Statement", //現実装では、tryの中にreturnは書けません
    "cannotWriteBreakInTryStatement" : "Cannot Write Break In Try Statement", //現実装では、tryの中にbreakは書けません
    "cannotWriteContinueInTryStatement" : "Cannot Write Continue In Try Statement", //現実装では、tryの中にcontinueは書けま せん
    "cannotWriteTwoOrMoreCatch" : "Cannot Write Two Or More Catch", //現実装では、catch節1個のみをサポートしています
    "lexicalError" : "Lexical Error", //文法エラー(Token)
    "parseError" : "Parse Error", //文法エラー
    "ambiguousClassName" : "Ambiguous Class Name: {1}.{2} vs {3}", //曖昧なクラス名： {1}.{2}, {3}
    "cannotInvokeMethod" : "Cannot Invoke Method {1}(={2}).{3}", //{1}(={2})のメソッド {3}を呼び出せません
    "notAMethod" : "Not A Method: {1}{2}(={3})", //{1}{2}(={3})はメソッドではありません
    "notAFunction" : "Not A Function: {1}", //{1}は関数ではありません
    "uninitialized" : "Uninitialized: {1}(={2})", //{1}(={2})は初期化されていなません
    "newIsRequiredOnInstanciate" : "new is required to Instanciate {1}", //クラス名{1}はnewをつけて呼び出して下さい。
    "bootClassIsNotFound" : "Boot Class {1} Is Not Found", //{1}というクラスはありません．
    "infiniteLoopDetected" : "Infinite Loop Detected",
};
/*let buf="";
    for (let k of Object.keys(ja)) {
        buf+=`"${k}" : "${englishify(k)}", //${ja[k]}\n`;
    }
    console.log(buf);*/

let dict=en;
function R(name,...params) {
    let mesg=dict[name];
    if (!mesg) {
        return englishify(name)+(params.length?": "+params.join(","):"");
    }
    return buildMesg(mesg, ...params);//+"です！";
}
function buildMesg(...params) {
    var a=Array.prototype.slice.call(arguments);
    var format=a.shift();
    if (a.length===1 && a[0] instanceof Array) a=a[0];
    var P="vroijvowe0r324";
    format=format.replace(/\{([0-9])\}/g,P+"$1"+P);
    format=format.replace(new RegExp(P+"([0-9])"+P,"g"),function (_,n) {
        return a[parseInt(n)-1]+"";
    });
    return format;
}
function englishify(name) {
    name=name.replace(/([A-Z])/g," $1");
    name=name[0].toUpperCase()+name.substring(1);
    return name;
}
R.setLocale=locale=>{
    if (locale==="ja") dict=ja;
    if (locale==="en") dict=en;
};
R.dicts={ja,en};
export=R;
//module.exports=R;
