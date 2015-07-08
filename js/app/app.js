/*!
 *
 * App basic javascript
 *
 * A nice description of what this file does...
 *
 *
 */
import "jquery/dist/jquery";
import "node_modules/hammerjs/hammer";
import "app/resizes";
import "app/router";
import "app/detect";
import "app/navbar";


window.onload = function () {
    // Global detection initializer
    detect.init();


    // Global router initializer
    router.init();


    // Global resize element initializer
    resizes.init();


    // Primary navbar initializer
    navbar.init();
};