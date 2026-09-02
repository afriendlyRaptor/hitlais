function findContainerByText(text, root) {
    var _a;
    var walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null);
    var node;
    while ((node = walker.nextNode())) {
        if ((_a = node.nodeValue) === null || _a === void 0 ? void 0 : _a.trim().includes(text.trim())) {
            return node;
        }
    }
    return null;
}
//@ts-ignore
function getNextNode(node) {
    if (!node) {
        return null;
    }
    if (node.firstChild)
        return node.firstChild;
    while (node) {
        if (node.nextSibling)
            return node.nextSibling;
        node = node.parentNode;
    }
}
function getNodeCount(range) {
    var count = 1;
    var node = range.startContainer;
    while (node && node !== range.endContainer) {
        if (node.nodeType === Node.ELEMENT_NODE) {
            node = getNextNode(node);
            continue;
        }
        count++;
        node = getNextNode(node);
    }
    return count;
}
export var getRangeStartEndContainerText = function (range) {
    var _a, _b;
    if (range.startContainer === range.endContainer) {
        return { startContainerText: range.toString(), endContainerText: range.toString() };
    }
    var startContainerText = (_a = range.startContainer.textContent) === null || _a === void 0 ? void 0 : _a.substring(range.startOffset, range.startContainer.textContent.length);
    var endContainerText = (_b = range.endContainer.textContent) === null || _b === void 0 ? void 0 : _b.substring(0, range.endOffset);
    return { startContainerText: startContainerText, endContainerText: endContainerText };
};
export function getOriginalRange(range, root) {
    var _a, _b, _c, _d, _e;
    var firstOffset = 0, secondOffset = 0;
    var firstContainer = findContainerByText(range.startContainer.textContent, root);
    var lastContainter = findContainerByText(range.endContainer.textContent, root);
    var rangeNodeCount = getNodeCount(range);
    if (rangeNodeCount === 1) {
        var rangeFirstContainerText = (_a = range.startContainer.textContent) === null || _a === void 0 ? void 0 : _a.substring(range.startOffset, range.endOffset);
        firstOffset = ((_b = firstContainer === null || firstContainer === void 0 ? void 0 : firstContainer.textContent) === null || _b === void 0 ? void 0 : _b.indexOf(rangeFirstContainerText)) || 0;
        secondOffset = firstOffset + rangeFirstContainerText.length;
    }
    else {
        var rangeFirstContainerText = (_c = range.startContainer.textContent) === null || _c === void 0 ? void 0 : _c.substring(range.startOffset, range.startContainer.textContent.length);
        firstOffset = ((_d = firstContainer === null || firstContainer === void 0 ? void 0 : firstContainer.textContent) === null || _d === void 0 ? void 0 : _d.indexOf(rangeFirstContainerText)) || 0;
        var rangeLastContainerText = (_e = range.endContainer.textContent) === null || _e === void 0 ? void 0 : _e.substring(0, range.endOffset);
        secondOffset = (rangeLastContainerText === null || rangeLastContainerText === void 0 ? void 0 : rangeLastContainerText.length) || 0;
    }
    if (!firstContainer || !lastContainter) {
        return null;
    }
    var newRange = document.createRange();
    newRange.setStart(firstContainer, firstOffset);
    newRange.setEnd(lastContainter, secondOffset);
    return newRange;
}
