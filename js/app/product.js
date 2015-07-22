/*!
 *
 * App Controller: product
 *
 * A nice description of what this controller does...
 *
 *
 */
import "app/dom";


var $_jsProduct = null,

    _isActive = false,
    _isCommerce = false,


/**
 *
 * @public
 *
 */
product = {
    name: "product",


    init: function () {
        this.tryInitCommerce();

        console.log( "product initialized" );
    },


    isActive: function () {
        return (_isActive = this.getElements() > 0);
    },


    onload: function () {
        this.tryInitCommerce();
    },


    unload: function () {
        this.teardown();
    },


    getElements: function () {
        $_jsProduct = dom.body.find( ".js-product" );

        return ( $_jsProduct.length );
    },


    teardown: function () {
        $_jsProduct = null;

        _isActive = false;
        _isCommerce = false;
    },


    tryInitCommerce: function () {
        if ( this.isActive() && !_isCommerce ) {
            _isCommerce = true;

            Y.Squarespace.Commerce.initializeCommerce( Y );
        }
    }
};


/******************************************************************************
 * Export
*******************************************************************************/
export default product;