/*!
 *
 * App basic javascript
 *
 * A nice description of what this file does...
 *
 *
 */
import "node_modules/squarespace-yui-block-initializers/sqs";
import "jquery/dist/jquery";
import "node_modules/hammerjs/hammer";
import "app/resizes";
import "app/router";
import "app/detect";
import "app/navmenu";
import "app/footerbar";
import "app/dom";
import "app/util";


window.onload = function () {
    window.Squarespace.onInitialize( Y, function () {
        var $cart = $( ".absolute-cart-box" );

        dom.navbar.append( $cart );

        $cart.addClass( "is-active" );
    });


    util.emitter.on( "app--preload-done", function appInit () {
        util.emitter.off( "app--preload-done", appInit );

        util.resizeElems();

        dom.body.addClass( "is-active" );
    });


    // Global router initializer
    router.init();

    // Global detection initializer
    detect.init();


    // Global resize element initializer
    resizes.init();


    // Primary navmenu initializer
    navmenu.init();


    // Primary footerbar initializer
    footerbar.init();
};