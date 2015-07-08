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
    _isLoaded = false,


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
        return _isActive;
    },


    isLoaded: function () {
        return _isLoaded;
    },


    onload: function () {
        _isActive = this.getElements();

        if ( _isLoaded ) {
            return;

        } else if ( !_isActive ) {
            return;
        }

        _isLoaded = true;

        dom.html.addClass( "is-cover-page" );
    },


    unload: function () {
        if ( _isLoaded ) {
            this.teardown();
        }
    },


    getElements: function () {
        $_jsCover = dom.body.find( ".js-cover" );

        return ( $_jsCover.length );
    },


    teardown: function () {
        $_jsCover.remove();
        $_jsCover = null;

        dom.html.removeClass( "is-cover-page" );

        _isLoaded = false;
        _isActive = false;
    }
};


/******************************************************************************
 * Export
*******************************************************************************/
export default cover;