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
import "app/navmenu";
import "app/footerbar";


window.onload = function () {
    // Global detection initializer
    detect.init();


    // Global router initializer
    router.init();


    // Global resize element initializer
    resizes.init();


    // Primary navmenu initializer
    navmenu.init();


    // Primary footerbar initializer
    footerbar.init();
};