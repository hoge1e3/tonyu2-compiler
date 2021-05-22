
class NS2DepSpec {
    constructor(hashOrArray) {
        if (isArray(hashOrArray)) {
            this.array=hashOrArray;
        } else {
            this.array=Object.keys(hashOrArray).map(n=>hashOrArray[n]);
        }
    }
    has(ns) {
        return this.array.filter(e=>e.namespace===ns)[0];
    }
    specs() {
        return this.array;
    }
    [Symbol.iterator]() {
        return this.array[Symbol.iterator]();
    }
}
function isArray(o) {
    return (o && typeof o.slice==="function");
}
module.exports=NS2DepSpec;
