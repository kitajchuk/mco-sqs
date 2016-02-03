import $ from "js_libs/jquery/dist/jquery";
import resizes from "./resizes";
import router from "./router";
import detect from "./detect";
import navmenu from "./navmenu";
import footerbar from "./footerbar";
import dom from "./dom";
import scrolls from "./scrolls";
import cache from "./cache";
import * as util from "./util";
import Store from "./Store";


const appInit = function () {
    util.emitter.off( "app--preload-done", appInit );

    dom.html.removeClass( "is-clipped" );
    dom.body.removeClass( "is-clipped" ).addClass( "is-active" );
};


const sqsInit = function () {
    const $cart = $( ".absolute-cart-box" );

    dom.navbar.append( $cart );

    $cart.addClass( "is-active" );
};


window.onload = function () {
    window.Squarespace.onInitialize( Y, sqsInit );


    util.emitter.on( "app--preload-done", appInit );


    // Global router initializer
    router.init();

    // Global detection initializer
    detect.init();


    // Global scrolls element initializer
    scrolls.init();


    // Global resize element initializer
    resizes.init();


    // Primary navmenu initializer
    navmenu.init();


    // Primary footerbar initializer
    footerbar.init();


    // Global { app }
    window.app = { cache, Store };
};