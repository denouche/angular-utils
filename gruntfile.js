module.exports = function (grunt) {
    "use strict";

    require('load-grunt-tasks')(grunt);
    
    var mode = grunt.option('mode') || 'dev';

    var assets = require('./build.config');

    function isProductionMode (mode) {
        return mode === 'prod';
    }

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
        copy: {
            prod: {
                files: [
                    {expand: true, cwd: 'src/', src: ['**/*.html'], dest: 'tmp/angular-utils/'}
                ]
            }
        },
        html2js: {
            options: {
                base: 'tmp',
                module: 'angular-utils-templates'
            },
            app: {
                src: ['tmp/angular-utils/**/*.html'],
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
                    {expand: true, cwd: 'tmp/angular-utils/', src: '**/*.html', dest: 'tmp/angular-utils/'}
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
                files: {
                    'dist/angular-utils.js': ['<%= html2js.app.dest %>'].concat(assets.src.js)
                }
            }
        },
        uglify: {
            dist: {
                src: [ 'dist/angular-utils.js'],
                dest: 'dist/angular-utils.min.js'
            }
        },
        watch : {
            js: {
                files : ['<%= jshint.all %>'],
                tasks : ['build']
            }
        }
    });
    
    grunt.registerTask('build', [
        'clean',
        'jshint',
        'copy',
        'htmlmin',
        'html2js',
        'ngAnnotate',
        'uglify'
    ]);

    grunt.registerTask('default', 'build');

};

