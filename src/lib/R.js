const ja={
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
let dict=ja;
function R(name,...params) {
    let mesg=dict[name];
    if (!mesg) {
        return name+": "+params.join(",");
    }
    return buildMesg(mesg, ...params);//+"です！";
}
function buildMesg() {
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
module.exports=R;
