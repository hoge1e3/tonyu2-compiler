"use strict";
module.exports = class FileMap {
    constructor() { this.sidesList = []; }
    add(sides) {
        this.sidesList.push(sides);
    }
    convert(path, fromSide, toSide) {
        for (let sides of this.sidesList) {
            if (path.startsWith(sides[fromSide])) {
                return sides[toSide] + path.substring(sides[fromSide].length);
            }
        }
        return path;
    }
};
