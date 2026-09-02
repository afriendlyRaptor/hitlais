"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SelectionProvider = exports.SelectionsContext = void 0;
var jsx_runtime_1 = require("react/jsx-runtime");
var react_1 = require("react");
exports.SelectionsContext = (0, react_1.createContext)(null);
var SelectionProvider = function (_a) {
    var children = _a.children;
    var _b = (0, react_1.useState)([]), selections = _b[0], setSelections = _b[1];
    var value = { selections: selections, setSelections: setSelections };
    return (0, jsx_runtime_1.jsx)(exports.SelectionsContext.Provider, { value: value, children: children });
};
exports.SelectionProvider = SelectionProvider;
