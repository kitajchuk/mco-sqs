import $ from "js_libs/jquery/dist/jquery";
import sqs from "squarespace-yui-block-initializers";
import * as util from "./util";
import router from "./router";
import dom from "./dom";


let $_jsCart = null;
let _pillBox = null;


const cart = {
    init () {
        window.Squarespace.onInitialize( Y, onSqsInit );
    }
};


const onSqsInit = function () {
    _pillBox = Y.one( ".sqs-pill-shopping-cart-content" );
    _pillBox.detach( "click" ).on( "click", onPillBoxClick );

    $_jsCart = $( ".absolute-cart-box" );

    dom.navbar.append( $_jsCart );

    $_jsCart.addClass( "is-active" );
};


const handleShowCart = function () {
    dom.page.removeClass( "is-inactive" );

    const $imgs = $( "img" );
    const $titles = $( ".item-desc > a" );
    let i = $imgs.length;

    for ( i; i--; ) {
        $imgs[ i ].src = $imgs[ i ].src
            .replace( window.location.href, "" )
            .replace( "format=100w", "format=500w" )
            .replace( /^https:|^http:/g, "" );
    }

    i = $titles.length;

    for ( i; i--; ) {
        util.fixTitle( $titles[ i ] );
    }
};


const onPillBoxClick = function () {
    util.disableMouseWheel( true );
    util.disableTouchMove( true );

    dom.page.addClass( "is-inactive" );
    dom.footerbar.addClass( "is-inactive" );

    router.push( "/commerce/show-cart/", ( data ) => {
        const $doc = $( data.response );
        const $cart = $doc.find( "#sqs-shopping-cart-wrapper" );

        dom.page.html( $cart );

        sqs.initCommerce();

        setTimeout( handleShowCart, 500 );
    });
};



/******************************************************************************
 * Export
*******************************************************************************/
export default cart;