/*global module:true, require: true */

module.exports = function(grunt) {

    // list of css / js files to be build (could be a single page
    // or a group of pages that use the css and js)
    var groupIds = [
        'restore',
        'speed'
    ];
    
    require('jit-grunt')(grunt, {
        sprite: 'grunt-spritesmith',
        azureUpload: './tools/grunt-azureUpload.js',
        ver: './tools/grunt-ver.js'
    });
    
    // project configuration
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        clean: {
            cdnVersions: [ 'server/cdnVersions.json' ],
            temp: [ 'temp' ]
        },
        concat: {
            libs: {
                src: [
                    'node_modules/underscore/underscore-min.js',
                    'node_modules/backbone/backbone-min.js',
                    //'client/libs/gsDrawSVGPlugin.min.js',
                    'client/libs/gsEasePack.min.js',
                    'client/libs/gsCustomEase.js',
                    //'client/libs/gsSnapSvgPlugin.js',
                    //'client/libs/gsTextPlugin.min.js',
                    //'client/libs/gsTimelineLite.min.js',
                    //'client/libs/gsTweenLite.min.js',
                    'client/libs/gsTimelineMax.min.js',
                    'client/libs/gsTweenMax.min.js',
                    //'client/libs/requestAnimationFrame.js',
                    // 'client/libs/ScrollMagic.min.js',
                    // 'client/libs/ScrollMagic.gsap.js',
                    //'client/libs/transit.js',
                ],
                dest: 'server/public/scripts/libs.js'
            }
        },
        copy: {
            jQuery: {
                files: [{
                    src: ['node_modules/jquery/dist/jquery.min.js'],
                    dest: 'server/public/scripts/jquery.min.js'
                }]
            },
            cdn: {
                files: [
                    {
                        expand: true,
                        cwd: 'server/public/',
                        src: [ '**', '!restore/**', '!**/Thumbs.db' ],
                        dest: 'temp/cdn/'
                    }
                ]
            }
        },
        eslint: {
            all: {
                src: [
                    'Gruntfile.js',
                    'client/js/**/*.js',
                    '!client/js/libs/*.js',
                    '!client/js/utils/polyfill.js',
                    '!client/js/views/templates.js',
                    '!client/js/greensock/*.js',

                    // TODO: fix when updating welcome pages
                    '!client/js/welcome/safe.js',
                    '!client/js/welcome/speed.js',
                    '!client/js/welcome/speedDial.js',
                    '!client/js/welcome/tabs.js',

                    'tools/**/*.js',
                    'server/**/*.js',
                    '!server/public/**/*.js',
                    '!server/snapshots/**/*'
                ]
            }
        },
        uglify: {
            all: {
                files: {
                    'server/public/scripts/*.js': ['server/public/scripts/*.js']
                }
            }
        },

        sass: {
            // dynamically generated for each group
        },
        postcss: {
            options: {
                map: false,
                processors: [
                    require('autoprefixer')({
                        browsers: 'last 2 versions'
                    }) 
                    // require('cssnano')() 
                ]
            },
            app: {
                src: 'server/public/css/*.css'
            }
        },        
        cssmin: {
            options: {
                rebase: false
            },
            all: {
                files: [{
                    expand: true,
                    cwd: 'server/public/css/',
                    src: ['*.css'],
                    dest: 'server/public/css',
                    ext: '.css'
                }]
            }
        },
        responsive_images: {
            features: {
                options: {
                    newFilesOnly: false,
                    sizes: [{
                        name: 'sm',
                        width: 640
                    }, {
                        name: 'md',
                        width: 800
                    }, {
                        name: 'lg',
                        width: 1600
                    }, {
                        name: 'default',
                        rename: false,
                        width: 800
                    }]
                },
                files: [{
                    expand: true,
                    src: ['images/features/**.{jpg,gif,png}'],
                    dest: 'server/public/'
                }]
            }
        },
        svgmin: {
            options: {
                plugins: [
                    {removeUselessStrokeAndFill: false},
                    {removeDimensions: true},
                    {cleanupIDs: false},
                    {collapseGroups: false},
                    {convertShapeToPath: false},
                    {removeComments: true},
                    {removeUselessDefs: true}
                ]
            },
            dist: {
                expand: true,
                cwd: 'server/public/images/',
                src: ['*.svg'],
                ext: '.svg.html',
                dest: 'server/views/partials/svg/'
            }
        },
        replace: {
            dist: {
                options: {
                    patterns: [{
                        match: /SegoePro-Bold|Segoe Pro|SegoePro/g,
                        replacement: 'SegoeUI'
                    },{
                        match: /path-\d*|mask-\d*/g,
                        //replacement: '<%= grunt.task.current %>'
                        replacement: function(str, b, c, srcpath, e) {
                            
                            var filename = (/(\w+)(?=\.svg)/g).exec(srcpath);
                            
                            if (filename && filename.length) {
                                filename = filename[0];
                                filename = filename.replace('_', '');
                            }
                            else {
                                filename = '';
                            }
                            
                            return str + '-' + filename;
                        }
                    }]
                },
                files: [{
                    expand: true,
                    cwd: 'server/views/partials/svg/',
                    src: ['*.svg.html'],
                    ext: '.svg.html',
                    dest: 'server/views/partials/svg/'
                }]
            }
        },
        ver: {
            cdn: {
                baseDir: 'temp/cdn/',
                phases: [
                    {
                        files: [
                            'temp/cdn/assets/**',
                            'temp/cdn/images/**',
                            'temp/cdn/fonts/**',
                            '!Thumbs.db',
                        ],
                        references: [
                            'temp/cdn/scripts/*.js',
                            'temp/cdn/css/*.css'
                        ]
                    },
                    {
                        files: [
                            'temp/cdn/css/*.css',
                            'temp/cdn/scripts/*.js'
                        ]
                    }
                ],
                versionFile: 'server/cdnVersions.json'
            }
        },
        azureUpload: {
            siteCdn: {
                options: {
                    storageAccount: 'edgewelcomepublic',
                    storageAccessKey: 'To9w0bLGx+nZkHNTbkcZhO/VZqOxSoXLcNXW3LwJrkJCHK92b468Sr8a1mN52ujb5zEcWOyURyJO3i1NKxn93w==',
                    container: 'site',
                    cacheControl: 'public, max-age=31556926'  // 1 year
                },
                expand: true,
                cwd: 'temp/cdn/',
                src: [ '**' ]
            }
        },
        webfont: {
            icons: {
                src: 'client/icons/svg/*.svg',
                dest: 'client/icons/',
                destScss: 'client/scss/',
                options: {
                    engine: 'node',
                    font: 'icons',
                    embed: true,
                    hashes: true,
                    types: 'woff',
                    htmlDemo: false,
                    template: 'client/icons/icon-template.css',
                    templateOptions: {
                        classPrefix: 'icon-'
                    },
                    fontHeight: 256,
                    stylesheet: 'scss',
                    relativeFontPath: '../fonts/',
                }
            }
        },          
        watch: {
            svg: {
                files: [ 'server/public/images/*.svg' ],
                tasks: [ 'svgmin', 'replace' ]
            },
            icons: {
                files: [
                    'client/icons/svg/*.svg'
                ],
                tasks: ['icons']
            },
        }
    });

    grunt.registerTask('generateGroupTasks', 'Generate group specific tasks', function() {

        groupIds.forEach(function(groupId) {
            // build group specific css
            grunt.config.set('sass.' + groupId, {
                src: [ 'client/scss/' + groupId + '.scss' ],
                dest: 'server/public/css/' + groupId + '.css'
            });
    
            // copy shared + site specific templates to temp/templates folder
            grunt.config.set('concat.' + groupId, {
                options: {
                    banner: '(function(){\n',
                    footer: '\n})();'
                },
                src: [
                    'client/js/namespace.js',
                    'client/js/utils/analytics.js',
                    'client/js/utils/*.js',
                    'client/js/' + groupId + '/*.js'
                ],
                dest: 'server/public/scripts/' + groupId + '.js'
            });
        });
    });

    grunt.registerTask('svg', [
        'svgmin',
        'replace'
    ]);

    grunt.registerTask('debug', [
        'newer:eslint',
        'newer:copy:jQuery',
        'generateGroupTasks',
        'concat',
        'sass',
        'postcss',
        'clean:cdnVersions'
    ]);

    grunt.registerTask('ship', [
        'copy:jQuery',
        'generateGroupTasks',
        'concat',
        'less',
        'sass',
        'postcss',
        'cssmin',
        'uglify',
        'clean:cdnVersions'
    ]);

    grunt.registerTask('updateCdn', [
        'clean:cdnVersions',
        'clean:temp',
        'copy:cdn',
        'ver',
        'azureUpload',
        'clean:temp'
    ]);

    grunt.registerTask('azure', [
        'clean',
        'ship',
        'updateCdn'
    ]);




    grunt.registerTask('default', 'debug');

};