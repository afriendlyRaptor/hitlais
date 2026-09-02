"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Highlighter = void 0;
var tslib_1 = require("tslib");
var jsx_runtime_1 = require("react/jsx-runtime");
var react_1 = require("react");
var client_1 = tslib_1.__importDefault(require("react-dom/client"));
var serialize_1 = require("../../libs/serialize");
var uid_1 = require("../../libs/uid");
var wrapperElements_1 = require("../../libs/wrapperElements");
var DeafultPopover_1 = tslib_1.__importDefault(require("../DeafultPopover"));
var UseSelection_1 = require("../../hooks/UseSelection");
var constants_1 = require("../../constants/constants");
var dom_1 = require("../../libs/dom");
var createRange_1 = require("../../libs/createRange");
var sort_1 = require("../../libs/sort");
var Highlighter = function (_a) {
    var htmlString = _a.htmlString, onClickHighlight = _a.onClickHighlight, disablePopover = _a.disablePopover, maxSelectionLength = _a.maxSelectionLength, minSelectionLength = _a.minSelectionLength, className = _a.className, PopoverChildren = _a.PopoverChildren, PopoverClassName = _a.PopoverClassName, selectionWrapperClassName = _a.selectionWrapperClassName, onSelection = _a.onSelection, onClick = _a.onClick;
    var _b = (0, UseSelection_1.useSelections)(), selections = _b.selections, addSelection = _b.addSelection, removeSelection = _b.removeSelection, updateSelection = _b.updateSelection;
    var rootRef = (0, react_1.useRef)(null);
    var tempRef = (0, react_1.useRef)(null);
    var div = document.createElement('div');
    tempRef.current = div;
    tempRef.current.innerHTML = htmlString;
    var getWrapper = (0, react_1.useCallback)(function (selection) {
        var span = (0, wrapperElements_1.getSpanElement)({ className: selection.className || constants_1.defaultSelectionWrapperClassName });
        if (!disablePopover) {
            var popover_1 = (0, wrapperElements_1.getPopoverElement)({ className: PopoverClassName });
            if (!PopoverClassName) {
                span.onmouseover = function () {
                    popover_1.style.visibility = 'visible';
                    popover_1.style.opacity = '1';
                };
                span.onmouseout = function () {
                    popover_1.style.visibility = 'hidden';
                    popover_1.style.opacity = '0';
                };
            }
            popover_1.id = "pop-".concat(selection.id);
            span.appendChild(popover_1);
        }
        if (onClickHighlight) {
            span.onclick = function (e) { return onClickHighlight(selection, e); };
        }
        span.id = selection.id;
        return span;
    }, [PopoverClassName, disablePopover, onClickHighlight]);
    var handleMouseUp = function () {
        // e.stopPropagation()
        var selection = window.getSelection();
        if (!selection)
            return;
        if (!minSelectionLength) {
            minSelectionLength = constants_1.defaultMinSelectionLength;
        }
        if (minSelectionLength && selection.toString().length < minSelectionLength)
            return;
        if (maxSelectionLength && selection.toString().length > maxSelectionLength)
            return;
        var range = selection.getRangeAt(0);
        if (!(0, dom_1.isHighlightable)(range))
            return;
        var expRange = (0, createRange_1.getOriginalRange)(range, tempRef.current);
        if (!expRange)
            return;
        var _a = (0, createRange_1.getRangeStartEndContainerText)(range), startContainerText = _a.startContainerText, endContainerText = _a.endContainerText;
        var newSelection = {
            meta: (0, serialize_1.serializeRange)(expRange, tempRef.current),
            text: range.toString(),
            id: "selection-".concat((0, uid_1.generateId)()),
            className: selectionWrapperClassName || constants_1.defaultSelectionWrapperClassName,
            startContainerText: startContainerText,
            endContainerText: endContainerText,
        };
        addSelection(newSelection);
        onSelection && onSelection(newSelection);
    };
    (0, react_1.useEffect)(function () {
        var sortedSelections = (0, sort_1.sortByPositionAndOffset)(selections);
        if (!rootRef.current)
            return;
        rootRef.current.innerHTML = '';
        rootRef.current.innerHTML = htmlString;
        if (sortedSelections && sortedSelections.length) {
            for (var i = 0; i < sortedSelections.length; i++) {
                var item = sortedSelections[i];
                var range = (0, serialize_1.deserializeRange)(item.meta, rootRef.current);
                if (range) {
                    (0, dom_1.addHighlight)(range, getWrapper(item));
                }
                var popoverRoot = document.getElementById("pop-".concat(item.id));
                if (!popoverRoot)
                    return;
                var root = client_1.default.createRoot(popoverRoot);
                if (PopoverChildren) {
                    root.render((0, jsx_runtime_1.jsx)(PopoverChildren, { selection: item, removeSelection: removeSelection, updateSelection: updateSelection }));
                }
                else {
                    root.render((0, jsx_runtime_1.jsx)(DeafultPopover_1.default, { removeSelection: removeSelection, selection: item, updateSelection: updateSelection }));
                }
            }
        }
    }, [selections, getWrapper, PopoverChildren, htmlString, removeSelection, updateSelection]);
    return (0, jsx_runtime_1.jsx)("div", { ref: rootRef, id: 'highlighter-root', onClick: onClick, onMouseUp: handleMouseUp, className: className });
};
exports.Highlighter = Highlighter;
