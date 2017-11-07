module.exports = {
    env: {
        browser: true,
        es6: true,
        node: true
    },
    extends: 'eslint:recommended',
    parserOptions: {
        sourceType: 'module'
    },
    rules: {
        'indent': [ 'error', 4, { 
            "SwitchCase": 1,  // case indented 1 level
            "MemberExpression": "off" // permit differences in indent on chained methods
        }],
        'linebreak-style': "off",
        'no-console': "off",
        'no-unused-vars': [ 'error', { args: 'none' } ],
        'quotes': [ 'error', 'single' ],
        'semi': [ 'error', 'always']
    },
    globals: {
        '$': true,
        'app': true,
        'jQuery': true,
        '_': true,
        'Backbone': true,
        'P': true,
        'TimelineMax': true,
        'TweenLite': true,
        'TweenMax': true,
        'Expo': true,
        'Power3': true,
        'Back': true
    }
};