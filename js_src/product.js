import $ from "js_libs/jquery/dist/jquery";
import sqs from "squarespace-yui-block-initializers";
import * as core from "./core";


let $_jsProduct = null;
let $_jsInputWrap = null;
let $_jsInput = null;
let $_jsWeight = null;
let $_jsTitle = null;

const $_jsDec = $( "<div class=\"product__dec\"><span class=\"icon icon--minus\"></span></div>" );
const $_jsInc = $( "<div class=\"product__inc\"><span class=\"icon icon--plus\"></span></div>" );


const product = {
    init () {
        core.log( "product initialized" );
    },


    isActive () {
        return (this.getElements() > 0);
    },


    onload () {
        sqs.initCommerce();

        // Exclude current product from the shop grid below it
        core.dom.body.find( `.js-shop-item[data-id=${$_jsProduct.data( "id" )}]` ).remove();

        $_jsDec.on( "click", onDecClick );
        $_jsInc.on( "click", onIncClick );

        $_jsWeight.text( parseFloat( $_jsWeight.text() ) * 16 );
        $_jsInputWrap.append( $_jsDec, $_jsInc );

        core.util.fixTitle( $_jsTitle[ 0 ] );

        core.dom.html.addClass( "is-product-detail" );
    },


    unload () {
        this.teardown();
    },


    getElements () {
        $_jsProduct = core.dom.body.find( ".js-product" );
        $_jsInputWrap = $_jsProduct.find( ".product-quantity-input" );
        $_jsInput = $_jsInputWrap.find( "input" );
        $_jsWeight = $_jsProduct.find( ".js-weight" );
        $_jsTitle = $_jsProduct.find( ".js-product-title" );

        return ( $_jsProduct.length );
    },


    teardown () {
        $_jsProduct = null;
        $_jsInputWrap = null;
        $_jsInput = null;
        $_jsWeight = null;
        $_jsTitle = null;

        $_jsDec.off( "click", onDecClick );
        $_jsInc.off( "click", onIncClick );

        core.dom.html.removeClass( "is-product-detail" );
    }
};


const onIncClick = function () {
    let val = $_jsInput.val();

    val++;

    $_jsInput.val( Math.max( 1, val ) );
};


const onDecClick = function () {
    let val = $_jsInput.val();

    val--;

    $_jsInput.val( Math.max( 1, val ) );
};


/******************************************************************************
 * Export
*******************************************************************************/
export default product;