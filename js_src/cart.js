// Cart QTY triggers re-render and images are 100w again... ?

import $ from "js_libs/jquery/dist/jquery";
import sqs from "squarespace-yui-block-initializers";
import router from "./router";
import * as core from "./core";
import product from "./product";


let $_jsCartIcon = null;
let _pillBox = null;


const cart = {
    init () {
        window.Squarespace.onInitialize( Y, onSqsInit );
    }
};


const onSqsInit = function () {
    const $cartCheckout = core.dom.page.find( "#sqs-shopping-cart-wrapper" );

    _pillBox = Y.one( ".sqs-pill-shopping-cart-content" );
    _pillBox.detach( "click" ).on( "click", onPillBoxClick );

    $_jsCartIcon = $( ".absolute-cart-box" );

    core.dom.navbar.append( $_jsCartIcon );

    $_jsCartIcon.addClass( "is-active" );

    if ( $cartCheckout.length ) {
        setTimeout( processCheckout, 500 );
    }
};


const processCheckout = function () {
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
        core.util.fixTitle( $titles[ i ] );
    }
};


const handleShowCart = function () {
    processCheckout();

    core.util.disableMouseWheel( false );
    core.util.disableTouchMove( false );

    core.dom.page.removeClass( "is-inactive" );
    core.dom.footerbar.removeClass( "is-inactive" );
};


const onPillBoxClick = function () {
    core.util.disableMouseWheel( true );
    core.util.disableTouchMove( true );

    core.dom.page.addClass( "is-inactive" );
    core.dom.footerbar.addClass( "is-inactive" );

    if ( product.isActive() ) {
        product.teardown();
    }

    router.push( "/commerce/show-cart/", ( data ) => {
        const $doc = $( data.response );
        const $cart = $doc.find( "#sqs-shopping-cart-wrapper" );

        core.dom.page.html( $cart );

        sqs.initCommerce();

        setTimeout( handleShowCart, 500 );
    });
};



/******************************************************************************
 * Export
*******************************************************************************/
export default cart;