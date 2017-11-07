app.getObjectPath = function(item, paths) {

    if (!paths) {
        return item;
    } else if (!Array.isArray(paths)) {
        // handle non-array key name
        return item[paths];
    }

    // walk path to get the value
    var value = item;
    for (var i = 0; i < paths.length; i++) {
        if (value) {
            value = value[paths[i]];
        }
    }

    return value;
};