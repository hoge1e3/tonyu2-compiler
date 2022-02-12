/* global define*/

    //const Tonyu=require("../runtime/TonyuRuntime");
export    class VType{
        toPlain() {
            throw new Error("toPlain: abstract");
        }
        getMember(name) {
            throw new Error("getMemeber: abstract");
        }
        isAssignableFrom(vtype) {
            throw new Error("isAssignableFrom: abstract");
        }
    }
    // "fullName";
export    class Class extends VType {
        constructor(ctx, n_m) {
            this.ctx=ctx;
            if (typeof n_m==="string") {
                this.fullName=n_m;
                this.classMeta=nn(ctx.classMetas[this.fullName], this.fullName);
            } else if (typeof n_m==="object"){
                this.classMeta=n_m;
                this.fullName=this.classMeta.fullName;
            } else {
                throw new Error("Invalid spec "+n_m);
            }
            this.deps=this.traverseDeps();
        }
        toPlain() {return this.fullName;}
        getMemeber(name) {
            return this.getDirectMember(name) ||  this.getSuperMember(name);
        }
        getDirectMember(name) {
            const m=this.classMeta.decls.methods[name];
            if (m) {
                const vt=parse(this.ctx, m.vtype || {return:"any"});
                return new Member(this, name, vt );
            }
            const f=this.classMeta.decls.fields[name];
            if (f) {
                const vt=parse(this.ctx, m.vtype);
                return new Member(this, name, vt );
            }
        }
        getSuperMember(name) {
            // TODO: order
            for (let fullName in this.deps) {
                const r=this.deps[fullName].getDirectMember(name);
                if (r) return r;
            }
        }
        getSuperClass() {
            if (!this.classMeta.superclass) return null;
            return new Class(this.ctx, this.classMeta.superclass);
        }
        getIncludingClasses() {// direcly.
            return this.classMeta.includes.map(e=>new Class(this.ctx,e));
        }
        traverseDeps(visited={}){
            if (visited[this.fullName]) return visited;
            visited[this.fullName]=this;
            const deps=[this.getSuperClass(), ...this.getIncludingClasses()];
            for (let dep of deps) {
                dep.traverseDeps(visited);
            }
            return visited;
        }
        isAssignableFrom(val) {
            if (val instanceof Any) return true;
            if (val instanceof Class) {
                // this=Enemy , val=Actor -> false  Actor.deps[Enemy]=false
                // this=Actor , val=Enemy-> true   Enemy.deps[Actor]=true
                return this.fullName===val.fullName || val.deps[this.fullName];
                //return val.superclass
            }
        }
    }
    exports.Class=Class;
    function nn(val, name) {
        if (val) return val;
        throw new Error(`${name} is not found`);
    }
    // "number"|"string"|"boolean"
export    class Primitive extends VType  {
        constructor(name, nativeConstructor) {
            this.name=name;
            this.nativeConstructor=nativeConstructor;
        }
        toPlain() {
            return this.name;
        }
        getMember(name) {
            if (name in this.nativeConstructor.prototype) {
                if (typeof this.nativeConstructor.prototype[name]==="function") {
                    return parse(null,{return:"any"});
                }
            }
        }
        isAssignableFrom(vtype) {
            if (vtype instanceof Primitive) {
                return this.name===vtype.name;
            }
            return false;
        }
    }
    exports.Primitive=Primitive;
    // {element: vtype}
export    class TArray extends Primitive {
        constructor(element) {
            this.element=element;
            this.name="Array";
            this.nativeConstructor=Array;
        }
        toPlain() {
            return {element: this.element.toPlain()};
        }
        getMember(name) {
            if (name==="[]") {
                return this.element;
            }
            return super.getMember(name);
        }
        isAssignableFrom(val) {
            if (val instanceof Any) return true;
            if (val instanceof TArray) {
                return val.element.isAssignableFrom(this.element) &&
                       this.element.isAssignableFrom(val.element);
            }
            return false;
        }
    }
    exports.Array=TArray;
    //  {x:num, y:num, p:num, ...a:Actor, ...all}
    //   a.x, a.y , a.scaleX etc... not a.hoge
    //     if scaleY is not passed, not assignable??
    //  all contiains all field  all.x,  all.y, all.scaleX, all.hoge, even all.a
    class Parameter {
        // name:string?
        // vtype: VType
        // dependingNames: [string]
        //    x=y+z  -> ["y","z"]
        // isSpread: boolean

    }
    class ParameterList {
        isAssignableFrom(a/*:[Argument]*/) {

        }
    }
    class Argument {
        // name:string?
        // vtype: VType
    }
    // {params:[Member] or null for anys , return: vtype}
    class TFunction extends Primitive {
        constructor(params, ret) {
            this.params=params;
            this.return=ret;
            this.nativeConstructor=Function;
        }
        toPlain() {
            return {
                params: this.params && this.params.map(p=>({[p.name]:p.vtype.toPlain()})),
                return: this.return.toPlain()
            };
        }
        isAssignableFrom(vtype) {
            if (vtype instanceof TFunction) {
                // this   a->Actor
                // vtype  a->Enemy
                if (!this.ret.isAssignableFrom(vtype.ret)) return false;
                // this    Enemy->a
                // vtype   Actor->a
                //TORIAEZU
                if (this.params.length !== vtype.params.length) return false;
                for (let i=0;i<this.params.length;i++) {
                    const p=this.params[i];
                    const v=vtype.params[i];
                    if (p.name && p.name!==v.name) return false;
                    if (!p.vtype.isAssignableFrom(v.vtype)) return false;
                }
                return true;
                // this  (int,int)->a
                // vtype (int)->a

                /*
                var f:{x:num, y:num}=>num ;
                \g{y:num, x:num}:num {
                    //...
                }
                f=g;
                f(2,3) //NOOOO


                var f:{x:num, y:num}=>num ;
                \g{x:num, y:num, z=x+y}:num {
                    //...
                }
                f=g;
                f(2,3);//OK

                */
            }
            return false;
        }
    }
    exports.Function=TFunction;
    // {optional: vtype}
    class Optional extends VType {
        constructor(vtype) {
            this.vtype=vtype;
        }
        toPlain() {
            return {optional:this.vtype.toPlain()};
        }
        getMemeber(name) {
            return null;
        }
        isAssignableFrom(vtype) {
            if (vtype instanceof Any) return true;
            if (vtype instanceof Primitive && vtype==="null") return true;
            return this.vtype.isAssignableFrom(vtype);
        }
    }
    exports.Optional=Optional;
    class Null extends Primitive {
        constructor() {
            this.name="null";
        }

    }
    // null
export    class Any extends VType {
        toPlain() {
            return null;
        }
        getMemeber(name) {
            return new Any();
        }
    }
    exports.Any=Any;
    // {or:[vtype]}
    class Or extends VType {
        constructor(vtypes) {
            this.vtypes=vtypes;
        }
        toPlain() {
            return {or:this.vtypes.map(e=>e.toPlain())};
        }
    }
    class Void extends VType {
        toPlain() {
            return "void";
        }
        getMemeber(name) {
            return null;
        }
    }
    class TypeParameter extends VType {
        constructor(name,  boundDirection/* "<" ">" */, bound) {
            this.boundDirection=boundDirection;
            this.bound=bound;
            this.name=name;
        }
        getMember(name) {
            if (this.boundDirection==="<") {
                return this.bound.getMember(name);
            }
            return null;
        }
    }

    class Member {// contains fields methods
        constructor(owner, name, vtype) {
            this.owner=owner;
            this.name=name;
            this.vtype=vtype;
        }
    }
export    function parse(ctx, plain) {
        const p=plain=>parse(ctx,plain);
        if (plain==="number") {
            return new Primitive(plain, Number);
        }
        if (plain==="string") {
            return new Primitive(plain, String);
        }
        if (plain==="boolean") {
            return new Primitive(plain, Boolean);
        }
        if (plain==="void") {
            return new Void();
        }
        if (plain==="any") {
            return new Any();
        }
        if (typeof plain==="string") {
            return new Class(ctx, plain);
        }
        if (!plain) {
            return new Any();
        }
        if (plain.element) {
            return new TArray(p(plain.element));
        }
        if (plain.return) {
            return new TFunction(plain.params && plain.params.map(p), p(plain.return ));
        }
        if (plain.optional) {
            return new Optional(p(plain.optional));
        }
        if (plain.or) {
            return new Or(plain.or.map(p));
        }
    }
