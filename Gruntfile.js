/*!
 *
 * Midnight Collective config.
 *
 * Grunt Nautilus:
 * https://github.com/kitajchuk/grunt-nautilus
 *
 * Available grunt-nautilus tasks:
 * grunt nautilus:build [, flags...]
 * grunt nautilus:deploy [, flags...]
 * grunt nautilus:module [, flags...]
 *
 */
module.exports = function ( grunt ) {


    "use strict";


    // Default project paths.
    var pubRoot = ".",
        sassRoot = "./sass",
        cssRoot = "./sqs_template/styles",
        jsRoot = "./js",
        appRoot = jsRoot + "/app",
        libRoot = jsRoot + "/lib",
        distRoot = "sqs_template/scripts";


    // Project configuration.
    grunt.initConfig({
        // Project meta.
        meta: {
            version: "0.1.0"
        },


        // Nautilus config.
        nautilus: {
            options: {
                cssRoot: cssRoot,
                hintOn: [
                    "watch",
                    "build",
                    "deploy"
                ],
                jsAppRoot: appRoot,
                jsDistRoot: distRoot,
                jsdocs: false,
                jsGlobals: {
                    $: true,
                    jQuery: true,
                    Hammer: true,
                    DocumentTouch: true,
                    Squarespace: true,
                    Y: true,
                    sqs: true
                },
                jsLibRoot: libRoot,
                jsRoot: jsRoot,
                pubRoot: pubRoot,
                sassRoot: sassRoot
            }
        }


    });


    // Load the nautilus plugin.
    grunt.loadNpmTasks( "grunt-contrib-jshint" );
    grunt.loadNpmTasks( "grunt-contrib-concat" );
    grunt.loadNpmTasks( "grunt-contrib-uglify" );
    grunt.loadNpmTasks( "grunt-contrib-watch" );
    grunt.loadNpmTasks( "grunt-contrib-sass" );
    grunt.loadNpmTasks( "grunt-contrib-clean" );
    grunt.loadNpmTasks( "grunt-jsdoc" );
    grunt.loadNpmTasks( "grunt-postcss" );
    grunt.loadNpmTasks( "grunt-nautilus" );


    // Register default task.
    grunt.registerTask( "default", ["nautilus:build"] );


};