module.exports = function (grunt) {
    "use strict";

    require('load-grunt-tasks')(grunt);
    
    var mode = grunt.option('mode') || 'dev';

    var assets = require('./build.config');

    function isProductionMode (mode) {
        return mode === 'prod';
    }
    
    var getTemplateVariables = function () {
        return function () {
            var vars = null,
                cssCommon = [],
                cssApp = [],
                jsCommon = grunt.config('concat.common.dest'),
                jsApp = [];

            if(isProductionMode(mode)) {
                assets.common.css.forEach(function(e) {
                    cssCommon.push(sanitizeDistFilename(e));
                });

                vars = {
                    js: {
                        common: sanitizeDistFilename(jsCommon),
                        app: [sanitizeDistFilename(grunt.config('uglify.dist.dest'))]
                    },
                    css: {
                        app: ['assets/css/main.min.css'],
                        common: cssCommon
                    }
                };
            }
            else {
                assets.common.css.forEach(function(e) {
                    cssCommon.push(sanitizeDevFilename(e));
                });
                grunt.file.expand(assets.src.css).forEach(function(e) {
                    cssApp.push(sanitizeDevFilename(e));
                });

                grunt.file.expand(
                    assets.src.js
                    .concat([
                        grunt.config.process('<%= html2js.app.dest %>'),
                    ]))
                .forEach(function(e) {
                    jsApp.push(sanitizeDevFilename(e));
                });

                vars = {
                    js: {
                        common: sanitizeDevFilename(jsCommon),
                        app: jsApp
                    },
                    css: {
                        app: cssApp,
                        common: cssCommon
                    }
                };
            }
            return vars;
        }
    };


    grunt.initConfig({
        bump : {
            options : {
                files: ['package.json', 'bower.json'],
                pushTo : 'origin master',
                commitFiles: ['package.json', 'bower.json', 'dist', 'CHANGELOG.md'],
                commitMessage: 'chore: release v%VERSION%',
            }
        },
        clean : {
            files : [
                'tmp/', 'dist/'
            ]
        },
        concat : {
            app: {
                src: assets.src.js.concat(['<%= html2js.app.dest %>']),
                dest: 'dist/angular-utils.js'
            }
        },
        copy: {
            prod: {
                files: [
                    {expand: true, cwd: 'src/', src: ['**/*.html'], dest: 'tmp/html/'}
                ]
            }
        },
        html2js: {
            options: {
                base: 'tmp'
            },
            app: {
                src: ['tmp/html/**/*.html'],
                dest: 'tmp/templates.js'
            }
        },
        htmlmin: {
            options: {
                removeComments: true,
                collapseWhitespace: true
            },
            templates: {
                files: [
                    {expand: true, cwd: 'tmp/html/', src: '**/*.html', dest: 'tmp/html/'}
                ]
            }
        },
        jshint: {
            all: assets.src.js,
            options : {
                jshintrc: '.jshintrc'
            }
        },
        ngAnnotate: {
            options: {
                singleQuotes: true
            },
            dist: {
                files: [
                    {
                        src: [ '<%= concat.app.dest %>' ]
                    }
                ]
            }
        },
        uglify: {
            dist: {
                src: [ '<%= concat.app.dest %>'],
                dest: 'dist/angular-utils.min.js'
            }
        },
        watch : {
            js: {
                files : ['<%= jshint.all %>'],
                tasks : ['jshint', 'template']
            }
        }
    });

    grunt.registerTask('buildDev', [
        'clean',
        'jshint',
        'html2js'
    ]);
    
    grunt.registerTask('buildProd', [
        'clean',
        'jshint',
        'copy',
        'htmlmin',
        'html2js',
        'concat',
        'ngAnnotate',
        'uglify'
    ]);

    /*
     * --mode=prod
     * --mode=dev
     */
    grunt.registerTask('build', 'Build', function () {
        grunt.log.subhead('Build in mode ' + mode);
        switch (mode) {
        case 'dev':
            grunt.task.run('buildDev');
            break;
        case 'prod':
            grunt.task.run('buildProd');
            break;
        default:
            grunt.verbose.or.write('Incorrect build mode [' + mode + ']').error();
            grunt.fail.warn('Please retry with --mode=dev|prod');
        }
    });

    grunt.registerTask('default', 'buildDev');

};

