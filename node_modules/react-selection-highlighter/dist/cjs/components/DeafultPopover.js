"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var jsx_runtime_1 = require("react/jsx-runtime");
var constants_1 = require("../constants/constants");
var DefaultPopover = function (_a) {
    var selection = _a.selection, removeSelection = _a.removeSelection, updateSelection = _a.updateSelection;
    var handleDelete = function () {
        removeSelection(selection);
    };
    var changeColor = function (colorClassName) {
        var classes = selection.className || constants_1.defaultSelectionWrapperClassName;
        var classArr = classes.split(' ');
        var colorIndex = classArr.findIndex(function (item) { return item.startsWith('bg-'); });
        if (colorIndex !== -1) {
            classArr.splice(colorIndex, 1);
        }
        classArr.push(colorClassName);
        updateSelection(selection.id, tslib_1.__assign(tslib_1.__assign({}, selection), { className: classArr.join(' ') }));
    };
    return ((0, jsx_runtime_1.jsxs)("div", { style: {
            padding: '1rem',
            boxShadow: '5px  5px  10px  0px rgba(0,  0,  0,  0.2)',
            backgroundColor: 'white',
            borderRadius: '6px',
            display: 'flex',
            flexDirection: 'column',
            gap: '5px',
        }, className: 'popover', children: [(0, jsx_runtime_1.jsxs)("p", { style: { fontSize: '12px' }, children: [selection.text.length, " characters selected"] }), (0, jsx_runtime_1.jsxs)("div", { style: { display: 'flex', minWidth: '150px', gap: '10px', justifyContent: 'center', alignItems: 'center' }, children: [(0, jsx_runtime_1.jsx)("div", { onClick: function () { return changeColor('bg-red'); }, style: { backgroundColor: '#FF407D', cursor: 'pointer', height: '25px', width: '25px', borderRadius: '50%' }, children: ' ' }), (0, jsx_runtime_1.jsx)("div", { onClick: function () { return changeColor('bg-yellow'); }, style: { backgroundColor: '#F5DD61', cursor: 'pointer', height: '25px', width: '25px', borderRadius: '50%' }, children: ' ' }), (0, jsx_runtime_1.jsx)("div", { onClick: function () { return changeColor('bg-blue'); }, style: { backgroundColor: '#59D5E0', cursor: 'pointer', height: '25px', width: '25px', borderRadius: '50%' }, children: ' ' }), (0, jsx_runtime_1.jsxs)("div", { onClick: handleDelete, style: { color: 'red', cursor: 'pointer', fontSize: 24, fontWeight: 'bold' }, children: [' ', "\uD83D\uDDD1"] })] })] }));
};
exports.default = DefaultPopover;
