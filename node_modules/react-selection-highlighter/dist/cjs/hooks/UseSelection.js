"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useSelections = void 0;
var tslib_1 = require("tslib");
var react_1 = require("react");
var SelectionProvider_1 = require("../providers/SelectionProvider");
var useSelections = function () {
    var selectionContext = (0, react_1.useContext)(SelectionProvider_1.SelectionsContext);
    if (!selectionContext) {
        throw new Error('useSelection hook must be used inside selectionProvider');
    }
    var selections = selectionContext.selections, setSelections = selectionContext.setSelections;
    var addSelection = function (selection) { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
        return tslib_1.__generator(this, function (_a) {
            setSelections(function (prev) {
                var index = prev.findIndex(function (item) { return item.id === selection.id; });
                if (index === -1) {
                    return tslib_1.__spreadArray(tslib_1.__spreadArray([], prev, true), [selection], false);
                }
                return prev;
            });
            return [2 /*return*/];
        });
    }); };
    var updateSelection = function (id, updatedSelection) { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
        return tslib_1.__generator(this, function (_a) {
            setSelections(function (prev) {
                var index = prev.findIndex(function (item) { return item.id === id; });
                if (index !== -1) {
                    prev.splice(index, 1);
                }
                return tslib_1.__spreadArray(tslib_1.__spreadArray([], prev, true), [updatedSelection], false);
            });
            return [2 /*return*/];
        });
    }); };
    var removeSelection = function (selection) {
        setSelections(function (prev) {
            var index = prev.findIndex(function (item) { return item.id === selection.id; });
            if (index !== -1) {
                prev = prev.filter(function (item) { return item.id !== selection.id; });
            }
            return tslib_1.__spreadArray([], prev, true);
        });
    };
    return { selections: selections, setSelections: setSelections, addSelection: addSelection, updateSelection: updateSelection, removeSelection: removeSelection };
};
exports.useSelections = useSelections;
