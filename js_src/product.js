import $ from "js_libs/jquery/dist/jquery";
import sqs from "squarespace-yui-block-initializers";
import dom from "./dom";
import * as util from "./util";
import config from "./config";
import router from "./router";


let $_jsProduct = null;
let $_jsInputWrap = null;
let $_jsInput = null;
let $_jsWeight = null;
let $_jsTitle = null;
let _pillBox = null;

const $_jsDec = $( "<div class=\"product__dec\"><span class=\"icon icon--minus icon--void\"></span></div>" );
const $_jsInc = $( "<div class=\"product__inc\"><span class=\"icon icon--plus\"></span></div>" );


const product = {
    init: function () {
        _pillBox = Y.one( ".sqs-pill-shopping-cart-content" );
        _pillBox.detach( "click" ).on( "click", onPillBoxClick );

        console.log( "product initialized" );
    },


    isActive: function () {
        return (this.getElements() > 0);
    },


    onload: function () {
        sqs.initCommerce();

        // Exclude current product from the shop grid below it
        dom.body.find( `.js-shop-item[data-id=${$_jsProduct.data( "id" )}]` ).remove();

        $_jsDec.on( "click", onDecClick );
        $_jsInc.on( "click", onIncClick );

        $_jsWeight.text( parseFloat( $_jsWeight.text() ) * 16 );
        $_jsInputWrap.append( $_jsDec, $_jsInc );

        fixTitle( $_jsTitle[ 0 ] );

        dom.html.addClass( "is-product-detail" );
    },


    unload: function () {
        this.teardown();
    },


    getElements: function () {
        $_jsProduct = dom.body.find( ".js-product" );
        $_jsInputWrap = $_jsProduct.find( ".product-quantity-input" );
        $_jsInput = $_jsInputWrap.find( "input" );
        $_jsWeight = $_jsProduct.find( ".js-weight" );
        $_jsTitle = $_jsProduct.find( ".js-product-title" );

        return ( $_jsProduct.length );
    },


    teardown: function () {
        $_jsProduct = null;
        $_jsInputWrap = null;
        $_jsInput = null;
        $_jsWeight = null;
        $_jsTitle = null;

        $_jsDec.off( "click", onDecClick );
        $_jsInc.off( "click", onIncClick );

        dom.html.removeClass( "is-product-detail" );
    }
};


const fixTitle = function ( titleEl ) {
    const title = titleEl.innerHTML.split( " " );
    const top = title.slice( 0, title.length - 2 );
    const bot = title.slice( title.length - 2, title.length );

    titleEl.innerHTML = `${top.join( "&nbsp;" )}<br />${bot.join( "&nbsp;" )}`;
};


const onPillBoxTimeout = function () {
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
        fixTitle( $titles[ i ] );
    }
};


const onInitComm = function () {
    sqs.initCommerce();

    // Load slightly higher res images for /commerce/show-cart page
    setTimeout( onPillBoxTimeout, config.easeDuration );

    util.emitter.off( "app--preload-done", onInitComm );
};


const onPillBoxClick = function () {
    util.emitter.on( "app--preload-done", onInitComm );

    router.controller.getRouter().trigger( "/commerce/show-cart/" );
};


const voidDecIcon = function ( val ) {
    const $ic = $_jsDec.find( ".icon" );

    if ( val > 1 ) {
        $ic.removeClass( "icon--void" );

    } else {
        $ic.addClass( "icon--void" );
    }
};


const onIncClick = function () {
    let val = $_jsInput.val();

    val++;

    voidDecIcon( val );

    $_jsInput.val( Math.max( 1, val ) );
};


const onDecClick = function () {
    let val = $_jsInput.val();

    val--;

    voidDecIcon( val );

    $_jsInput.val( Math.max( 1, val ) );
};


/******************************************************************************
 * Export
*******************************************************************************/
export default product;