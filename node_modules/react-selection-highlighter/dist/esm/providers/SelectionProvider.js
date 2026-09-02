import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useState } from 'react';
export var SelectionsContext = createContext(null);
export var SelectionProvider = function (_a) {
    var children = _a.children;
    var _b = useState([]), selections = _b[0], setSelections = _b[1];
    var value = { selections: selections, setSelections: setSelections };
    return _jsx(SelectionsContext.Provider, { value: value, children: children });
};
