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
    var autoprefixer = require( "autoprefixer-core" ),

        pubRoot = ".",

        //sassRoot = "./sass",
        //cssRoot = "./sqs_template/styles",
        //fontsRoot = "./sqs_template/assets/fonts",
        //imgRoot = "./sqs_template/assets/images",
    
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
                jsAppRoot: appRoot,
                jsDistRoot: distRoot,
                jsLibRoot: libRoot,
                jsRoot: jsRoot,
                pubRoot: pubRoot,
                jsGlobals: {
                    $: true,
                    jQuery: true,
                    Hammer: true,
                    DocumentTouch: true,
                    Squarespace: true,
                    Y: true
                },
                hintOn: [
                    "watch",
                    "build",
                    "deploy"
                ]
            }
        },


         sass: {
            styles: {
                options: {
                    style: "expanded"
                },

                files: {
                    "./sqs_template/styles/screen.css": "sass/screen.scss"
                }
            }
        },


        postcss: {
            options: {
                processors: [
                    autoprefixer( {browsers: "last 2 versions"} )
                ]
            },

            dist: {
                src: "./sqs_template/styles/*.css"
            }
        },


        "nautilus-watch": {
            styles: {
                files: ["sass/**/*.scss"],
                tasks: ["sass", "postcss"]
            }
        }


    });


    // Load the nautilus plugin.
    grunt.loadNpmTasks( "grunt-nautilus" );
    grunt.loadNpmTasks( "grunt-contrib-sass" );
    grunt.loadNpmTasks( "grunt-postcss" );


    // Register default task.
    grunt.registerTask( "default", ["nautilus:build", "sass", "postcss"] );


};