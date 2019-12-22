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
};
let dict=ja;
function R(name,...params) {
    let mesg=dict[name];
    if (!mesg) {
        return name+": "+params.join(",");
    }
    return buildMesg(mesg, ...params);
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
