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
        fontsRoot = "./sqs_template/assets/fonts",
        imgRoot = "./sqs_template/assets/images",
    
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
                jsGlobals: {},
                hintOn: [
                    "watch",
                    "build",
                    "deploy"
                ],
                compass: {
                    cssRoot: cssRoot,
                    sassRoot: sassRoot,
                    imgRoot: imgRoot,
                    fontsRoot: fontsRoot
                }
                
            }
        }


    });


    // Load the nautilus plugin.
    grunt.loadNpmTasks( "grunt-nautilus" );


    // Register default task.
    grunt.registerTask( "default", ["nautilus:build"] );


};