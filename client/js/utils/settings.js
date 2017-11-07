(function() {

    // test whether local storage is available
    var canUseStorage = false;
    try {
        canUseStorage = !!window.localStorage;
    } catch (ex) {
        // can throw a security exception in some cases, ex: when hosted
        // in a iframe on another domain
    }

    app.settings = {
        get: function (key) {

            if (!canUseStorage) {
                return null;
            }

            return localStorage.getItem(key);
        },
        set: function (key, value) {
            if (canUseStorage) {
                if (value === null) {
                    localStorage.removeItem(key);
                }
                else {
                    localStorage.setItem(key, value.toString());
                }
            }
        },
        remove: function (key) {
            if (canUseStorage) {
                localStorage.removeItem(key);
            }
        },
        getBoolOrDefault: function (key, defaultValue) {
            var val = this.get(key);
            if (val === null) {
                return defaultValue;
            }
            return (val === 'true');
        },
        getIntOrDefault: function (key, defaultValue) {
            var val = this.get(key);
            if (val === null) {
                return defaultValue;
            }
            return parseInt(val, 10);
        }

    };

}());