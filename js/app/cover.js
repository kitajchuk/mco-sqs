/*!
 *
 * App Controller: cover
 *
 * A nice description of what this controller does...
 *
 *
 */
import "app/dom";


var $_jsCover = null,

    _isActive = false,


/**
 *
 * @public
 *
 */
cover = {
    init: function () {
        console.log( "cover initialized" );
    },


    isActive: function () {
        return (_isActive = this.getElements() > 0);
    },


    onload: function () {
        dom.html.addClass( "is-cover-page" );
    },


    unload: function () {
        this.teardown();
    },


    getElements: function () {
        $_jsCover = dom.body.find( ".js-cover" );

        return ( $_jsCover.length );
    },


    teardown: function () {
        $_jsCover.remove();
        $_jsCover = null;

        dom.html.removeClass( "is-cover-page" );

        _isActive = false;
    }
};


/******************************************************************************
 * Export
*******************************************************************************/
export default cover;