function extractNumbers(str) {
    // Remove h1, h2, h3, h4, h5, h6 from the string
    var cleanedStr = str.replace(/h\d/g, '');
    // Match and extract numbers
    var regex = /\d+/g;
    var matches = cleanedStr.match(regex);
    // adding weight to initial paths for better sorting
    if (matches) {
        if (matches.length < 2) {
            matches[0] = matches[0].concat('11');
        }
        return +matches.join('');
    }
    else {
        return 0;
    }
}
export var sortByPositionAndOffset = function (slections) {
    // alert('working')
    return slections.sort(function (a, b) {
        var path1 = JSON.parse(a.meta);
        var path2 = JSON.parse(b.meta);
        var path1Weight = extractNumbers(path1.start) * 10000 + path1.startOffset;
        var path2Weight = extractNumbers(path2.start) * 10000 + path2.startOffset;
        return path2Weight - path1Weight;
    });
};
