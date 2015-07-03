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


window.onload = function () {
    // Global router initializer
    router.init();


    // Global resize element initializer
    resizes.init();
};