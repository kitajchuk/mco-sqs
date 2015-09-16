/*!
 *
 * App Controller: product
 *
 * A nice description of what this controller does...
 *
 *
 */
import "app/dom";
import "app/util";


var $_jsProduct = null,
    $_jsInputWrap = null,
    $_jsInput = null,
    $_jsDec = $( '<div class="product__dec"><span class="icon icon--minus icon--void"></span></div>' ),
    $_jsInc = $( '<div class="product__inc"><span class="icon icon--plus"></span></div>' ),
    $_jsWeight = null,
    $_jsTitle = null,

    _pillBox = null,
    _isActive = false,


/**
 *
 * @public
 *
 */
product = {
    name: "product",


    init: function () {
        _pillBox = Y.one( ".sqs-pill-shopping-cart-content" );
        _pillBox.detach( "click" ).on( "click", onPillBoxClick );

        console.log( "product initialized" );
    },


    isActive: function () {
        return (_isActive = this.getElements() > 0);
    },


    onload: function () {
        sqs.initCommerce();

        $_jsDec.on( "click", onDecClick );
        $_jsInc.on( "click", onIncClick );

        $_jsWeight.text( parseFloat( $_jsWeight.text() ) * 16 );

        $_jsInputWrap.append( $_jsDec, $_jsInc );

        var title = $_jsTitle[ 0 ].innerHTML.split( " " ),
            top = title.slice( 0, title.length - 2 ),
            bot = title.slice( title.length - 2, title.length );

        $_jsTitle[ 0 ].innerHTML = (top.join( "&nbsp;" ) + "<br />" + bot.join( "&nbsp;" ));

        util.emitter.fire( "app--product-detail-on" );
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

        _isActive = false;

        util.emitter.fire( "app--product-detail-off" );
    }
},


onPillBoxClick = function () {
    var onInitComm = function () {
        sqs.initCommerce();

        util.emitter.off( "app--preload-done", onInitComm );
    };

    util.emitter.on( "app--preload-done", onInitComm );

    app.router.pageController.getRouter().trigger( "/commerce/show-cart/" );
},


voidDecIcon = function ( val ) {
    var $ic = $_jsDec.find( ".icon" );

    if ( val > 1 ) {
        $ic.removeClass( "icon--void" );

    } else {
        $ic.addClass( "icon--void" );
    }
},


onIncClick = function () {
    var val = $_jsInput.val();

    val++;

    voidDecIcon( val );

    $_jsInput.val( Math.max( 1, val ) );
},


onDecClick = function () {
    var val = $_jsInput.val();

    val--;

    voidDecIcon( val );

    $_jsInput.val( Math.max( 1, val ) );
};


/******************************************************************************
 * Export
*******************************************************************************/
export default product;