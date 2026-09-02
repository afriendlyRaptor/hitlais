"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isHighlightable = exports.addHighlight = void 0;
var addHighlight = function (range, element) {
    var _a;
    if (!(0, exports.isHighlightable)(range)) {
        return;
    }
    var exists = document.getElementById(element.id);
    if (exists) {
        exists.className = element.className;
        return;
    }
    element.appendChild(range.extractContents());
    range.insertNode(element);
    (_a = window.getSelection()) === null || _a === void 0 ? void 0 : _a.removeAllRanges();
};
exports.addHighlight = addHighlight;
var isHighlightable = function (range) {
    var contents = range.cloneContents();
    var hasp = [];
    // if (contents.childNodes.length > 0 && contents.childNodes.length % 2 === 0) {
    //   console.log(contents)
    //   return false
    // }
    contents.childNodes.forEach(function (item) {
        if (item.nodeName === 'P') {
            hasp.push(true);
        }
        else {
            hasp.push(false);
        }
    });
    return !hasp.includes(true);
};
exports.isHighlightable = isHighlightable;
