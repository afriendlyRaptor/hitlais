"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deserializeRange = exports.serializeRange = void 0;
//@ts-ignore
var xpath_range_1 = require("xpath-range");
var serializeRange = function (range, root) {
    return JSON.stringify((0, xpath_range_1.fromRange)(range, root));
};
exports.serializeRange = serializeRange;
var deserializeRange = function (path, root) {
    var parsed = JSON.parse(path);
    try {
        return (0, xpath_range_1.toRange)(parsed.start, parsed.startOffset, parsed.end, parsed.endOffset, root);
    }
    catch (error) {
        // console.log(path)
        console.error(error);
    }
};
exports.deserializeRange = deserializeRange;
