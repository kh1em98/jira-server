"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.doesPathsExist = void 0;
function doesPathsExist(selections, paths) {
    if (!selections) {
        return false;
    }
    for (const path of paths) {
        const node = selections.find((x) => x.name.value === path);
        if (!node)
            return false;
    }
    return true;
}
exports.doesPathsExist = doesPathsExist;
//# sourceMappingURL=doesPathExist.js.map