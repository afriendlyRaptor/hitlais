import { __awaiter, __generator, __spreadArray } from "tslib";
import { useContext } from 'react';
import { SelectionsContext } from '../providers/SelectionProvider';
export var useSelections = function () {
    var selectionContext = useContext(SelectionsContext);
    if (!selectionContext) {
        throw new Error('useSelection hook must be used inside selectionProvider');
    }
    var selections = selectionContext.selections, setSelections = selectionContext.setSelections;
    var addSelection = function (selection) { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            setSelections(function (prev) {
                var index = prev.findIndex(function (item) { return item.id === selection.id; });
                if (index === -1) {
                    return __spreadArray(__spreadArray([], prev, true), [selection], false);
                }
                return prev;
            });
            return [2 /*return*/];
        });
    }); };
    var updateSelection = function (id, updatedSelection) { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            setSelections(function (prev) {
                var index = prev.findIndex(function (item) { return item.id === id; });
                if (index !== -1) {
                    prev.splice(index, 1);
                }
                return __spreadArray(__spreadArray([], prev, true), [updatedSelection], false);
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
            return __spreadArray([], prev, true);
        });
    };
    return { selections: selections, setSelections: setSelections, addSelection: addSelection, updateSelection: updateSelection, removeSelection: removeSelection };
};
