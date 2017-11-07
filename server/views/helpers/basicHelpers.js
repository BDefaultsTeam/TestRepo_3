var _ = require('lodash');

module.exports = function(Handlebars) {


    return {

        // helper for debugging (provides current context)
        debug: function(optionalValue) {
            console.log('Current Context');
            console.log('====================');
            console.log(this);

            if (optionalValue) {
                console.log('Value');
                console.log('====================');
                console.log(optionalValue);
            }
        },

        isoDateToLocaleString: function(isoDate) {
            if (!isoDate) { return null; }
            var d = new Date(isoDate);
            return d.toLocaleString();
        },

        // equality helper (usage: {{#equal type "image" }}{{/equal}})
        equal: function(lvalue, rvalue, options) {
            if (arguments.length < 3)
                throw new Error('Handlebars Helper equal needs 2 parameters');
            if( lvalue!==rvalue ) {
                return options.inverse(this);
            } else {
                return options.fn(this);
            }
        },

        // equality helper (usage: {{#notEqual type "image" }}{{/notEqual}})
        notEqual: function(lvalue, rvalue, options) {
            if (arguments.length < 3)
                throw new Error('Handlebars Helper notEqual needs 2 parameters');
            if( lvalue!==rvalue ) {
                return options.fn(this);
            } else {
                return options.inverse(this);
            }
        },

        // in helper : checks if value is in list (usage: {{#in type "image,video" }}{{/equal}})
        in: function(lvalue, rvalues, scope) {
            if (typeof rvalues === 'string') {
                rvalues = rvalues.split(',');
            }
            if (arguments.length < 3) {
                throw new Error('Handlebars Helper 'in' needs 2 parameters');
            }
            if( _.indexOf(rvalues, lvalue) < 0 ) {
                return scope.inverse(this);
            } else {
                return scope.fn(this);
            }
        },

        //{{#and a b }} if both and and b then this will be rendered.{{else}}{{/and}}
        and: function(a, b, options) {
            if (a && b) {
                return options.fn(this);
            }
            return options.inverse(this);
        },   

        // {{#or a b c}} if any value is true this will be rendered.{{else}}{{/or}}
        or: function(/* any, any, ..., options */) {
            var len = arguments.length - 1;
            var options = arguments[len];

            for (var i = 0; i < len; i++) {
                if (arguments[i]) {
                    return options.fn(this);
                }
            }

            return options.inverse(this);
        },

        // {{#moduloIf @index 2}} even content {{else}} odd content {{/moduloIf}}
        moduloIf: function(index_count, mod, block) {
            if (parseInt(index_count) % (mod) === 0) {
                return block.fn(this);
            }

            block.inverse(this);
        },

        // {{#even @index}} even content {{else}} odd content {{/even}}
        even: function(index_count, block) {
            if (parseInt(index_count) % 2 === 0) {
                return block.fn(this);
            }
            block.inverse(this);
        },

        // {{#odd @index}} odd content {{else}} even content {{/odd}}
        odd: function(index_count, block) {
            if (parseInt(index_count) % 2 === 1) {
                return block.fn(this);
            }
            block.inverse(this);
        },

        //helper for using everyother in a loop (usage in-between #each {{everyOther @index 2}}{{/everyOther}})
        everyOther: function (index, amount, scope) {
            if ( ++index % amount )
                return scope.inverse(this);
            else
                return scope.fn(this);
        },

        block: function (name, options) {
            /* Look for partial by name. */
            var partial = Handlebars.loadPartial(name) || options.fn;
            return partial(this, { data : options.hash });
        },

        encodeURI: function(value) {
            var encodedValue = encodeURI(value);
            return new Handlebars.SafeString(encodedValue);
        },

        encodeURIComponent: function(value) {
            var encodedValue = encodeURIComponent(value);
            return new Handlebars.SafeString(encodedValue);
        },

        cdnVer: function(originalPath) {

            var cdn = this._locals.cdn || { baseUrl: '', versions: {} };
            var path = cdn.versions[originalPath] || originalPath;

            // don't encode the url
            return new Handlebars.SafeString(cdn.baseUrl + path);
        },

        /*
            Nested #each loops:

            {{#eachGroup 3 items}}
            <div class="row">
                {{#each this }}
                <div class="one-third">{{prop}}</div>
                {{/each}}
            </div>
            {{/eachGroup}}
        */

        eachGroup: function(every, context, options) {

            //console.log('eachGroup');
            //console.log(context);

            var out = '', subcontext = [], i;
            if (context && context.length > 0) {
                for (i = 0; i < context.length; i++) {
                    if (i > 0 && i % every === 0) {
                        out += options.fn(subcontext);
                        subcontext = [];
                    }
                    subcontext.push(context[i]);
                }
                out += options.fn(subcontext);
            }
            return out;
        },

        /*
            helper that generates the block for each char of a value, character value is 'char'

            **Example
             {{#eachChar value}}
                <div>{{char}}</div>
             {{/eachChar}}
        */
        eachChar: function(value, options){
            var out = '';
            for(var i = 0; i < (value += '').length; i++){
                out += options.fn({char:value.charAt(i)});
            }
            return out;
        },


        picture: function(src, suffixes, widths, sizes, alt /*, options */) {

            /* Example:

                {{picture "cat.jpg", "-sm,-lg", "640,1280", "(min-width: 640px) 640px, 50vw", "cat" }}

                src (cat.jpg)
                Filename for the image itself without a prefix (but with the extension)

                "suffixes"
                List of suffixes that get appended to the filename (before the extension) that
                correlate to the actual images on the server.

                "widths"
                The actual pixel widths of the images.

                "sizes"
                The value passed to the "sizes" property. A list strings separated by commas indicating a set
                of source sizes.

                "alt"
                The value for the "alt" property.


                produces the following:

                <picture>
                    <source
                        srcset="cat-sm.jpg 640w, cat-lg.jpg 1280w"
                        sizes="(max-width: 640px) 100vw, 50vw">
                    <img
                        src="cat.jpg" alt="cat"
                        srcset="cat-sm.jpg 640w, cat-lg.jpg 1280w"
                        sizes="(max-width: 640px) 100vw, 50vw">
                </picture>

            */

            suffixes = suffixes.split(',');
            widths = widths.split(',');

            var count = Math.min(suffixes.length, widths.length),
                srcset = [];

            for (var i = count -1 ; i >= 0; i--) {
                var suffix = suffixes[i],
                    filename = src.replace(/(\.[\w\d_-]+)$/i, suffix + '$1');
                srcset.push(filename + ' ' + widths[i] + 'w');            }

            srcset = srcset.join(', ');

            var out = [
                '<picture>',
                '  <source srcset="' + srcset + '" sizes="' + sizes + '">',
                '  <img src="' + src + '" alt="' + alt + '" srcset="' + srcset + '" sizes="' + sizes + '">',
                '</picture>'
            ].join('\r\n');

            return new Handlebars.SafeString(out);
        },

        math: function(lvalue, operator, rvalue, options) {
            lvalue = parseFloat(lvalue);
            rvalue = parseFloat(rvalue);
                
            return {
                '+': lvalue + rvalue,
                '-': lvalue - rvalue,
                '*': lvalue * rvalue,
                '/': lvalue / rvalue,
                '%': lvalue % rvalue
            }[operator];
        }
    };

};