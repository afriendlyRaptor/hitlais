//@ts-ignore
import { fromRange, toRange } from 'xpath-range';
export var serializeRange = function (range, root) {
    return JSON.stringify(fromRange(range, root));
};
export var deserializeRange = function (path, root) {
    var parsed = JSON.parse(path);
    try {
        return toRange(parsed.start, parsed.startOffset, parsed.end, parsed.endOffset, root);
    }
    catch (error) {
        // console.log(path)
        console.error(error);
    }
};
