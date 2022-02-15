export= class FileMap {
    sidesList: any[];
    constructor(){this.sidesList=[];}
    add(sides) {// {sideA:path, sideB:path}
        this.sidesList.push(sides);
    }
    convert(path, fromSide, toSide) {
        for (let sides of this.sidesList) {
            if (path.startsWith(sides[fromSide])) {
                return sides[toSide]+path.substring(sides[fromSide].length);
            }
        }
        return path;
    }
}
