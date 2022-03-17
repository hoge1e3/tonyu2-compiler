export type Meta={
    fullName:string, shortName:string, namespace:string,
    decls:{methods: object, fields: object},
    superclass:Meta|null,
    includesRec:{[key:string]:boolean},
    includes:Meta[],
    //---- only with builders:
    src?: {tonyu?:any, js?:any},
};
