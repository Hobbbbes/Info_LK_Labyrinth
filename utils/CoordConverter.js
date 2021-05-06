"use strict";
exports.__esModule = true;
exports.roomNumToCoords = function (i, breit) {
    return [(Math.floor(i / (breit))), i % (breit)];
};
exports.coordsToRoomNum = function (_a, breit) {
    var x = _a[0], y = _a[1];
    return breit * y + x;
};
