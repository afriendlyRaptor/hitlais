import { jsx as _jsx } from "react/jsx-runtime";
import { useRef, useCallback, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { deserializeRange, serializeRange } from '../../libs/serialize';
import { generateId } from '../../libs/uid';
import { getPopoverElement, getSpanElement } from '../../libs/wrapperElements';
import DefaultPopover from '../DeafultPopover';
import { useSelections } from '../../hooks/UseSelection';
import { defaultMinSelectionLength, defaultSelectionWrapperClassName } from '../../constants/constants';
import { addHighlight, isHighlightable } from '../../libs/dom';
import { getOriginalRange, getRangeStartEndContainerText } from '../../libs/createRange';
import { sortByPositionAndOffset } from '../../libs/sort';
export var Highlighter = function (_a) {
    var htmlString = _a.htmlString, onClickHighlight = _a.onClickHighlight, disablePopover = _a.disablePopover, maxSelectionLength = _a.maxSelectionLength, minSelectionLength = _a.minSelectionLength, className = _a.className, PopoverChildren = _a.PopoverChildren, PopoverClassName = _a.PopoverClassName, selectionWrapperClassName = _a.selectionWrapperClassName, onSelection = _a.onSelection, onClick = _a.onClick;
    var _b = useSelections(), selections = _b.selections, addSelection = _b.addSelection, removeSelection = _b.removeSelection, updateSelection = _b.updateSelection;
    var rootRef = useRef(null);
    var tempRef = useRef(null);
    var div = document.createElement('div');
    tempRef.current = div;
    tempRef.current.innerHTML = htmlString;
    var getWrapper = useCallback(function (selection) {
        var span = getSpanElement({ className: selection.className || defaultSelectionWrapperClassName });
        if (!disablePopover) {
            var popover_1 = getPopoverElement({ className: PopoverClassName });
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
            minSelectionLength = defaultMinSelectionLength;
        }
        if (minSelectionLength && selection.toString().length < minSelectionLength)
            return;
        if (maxSelectionLength && selection.toString().length > maxSelectionLength)
            return;
        var range = selection.getRangeAt(0);
        if (!isHighlightable(range))
            return;
        var expRange = getOriginalRange(range, tempRef.current);
        if (!expRange)
            return;
        var _a = getRangeStartEndContainerText(range), startContainerText = _a.startContainerText, endContainerText = _a.endContainerText;
        var newSelection = {
            meta: serializeRange(expRange, tempRef.current),
            text: range.toString(),
            id: "selection-".concat(generateId()),
            className: selectionWrapperClassName || defaultSelectionWrapperClassName,
            startContainerText: startContainerText,
            endContainerText: endContainerText,
        };
        addSelection(newSelection);
        onSelection && onSelection(newSelection);
    };
    useEffect(function () {
        var sortedSelections = sortByPositionAndOffset(selections);
        if (!rootRef.current)
            return;
        rootRef.current.innerHTML = '';
        rootRef.current.innerHTML = htmlString;
        if (sortedSelections && sortedSelections.length) {
            for (var i = 0; i < sortedSelections.length; i++) {
                var item = sortedSelections[i];
                var range = deserializeRange(item.meta, rootRef.current);
                if (range) {
                    addHighlight(range, getWrapper(item));
                }
                var popoverRoot = document.getElementById("pop-".concat(item.id));
                if (!popoverRoot)
                    return;
                var root = ReactDOM.createRoot(popoverRoot);
                if (PopoverChildren) {
                    root.render(_jsx(PopoverChildren, { selection: item, removeSelection: removeSelection, updateSelection: updateSelection }));
                }
                else {
                    root.render(_jsx(DefaultPopover, { removeSelection: removeSelection, selection: item, updateSelection: updateSelection }));
                }
            }
        }
    }, [selections, getWrapper, PopoverChildren, htmlString, removeSelection, updateSelection]);
    return _jsx("div", { ref: rootRef, id: 'highlighter-root', onClick: onClick, onMouseUp: handleMouseUp, className: className });
};
