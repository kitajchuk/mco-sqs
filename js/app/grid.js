/*!
 *
 * App Controller: grid
 *
 * A nice description of what this controller does...
 *
 *
 */
import "app/dom";
import "app/resizes";
import { emitter } from "app/util";


var $_jsGrid = null,
    $_jsItems = null,

    _isActive = false,
    _isLoaded = false,


/**
 *
 * @public
 *
 */
grid = {
    init: function () {
        console.log( "grid initialized" );
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

        emitter.on( "app--resize-small", unbindAnimateGrid );
        emitter.on( "app--resize-normal", bindAnimateGrid );

        if ( !resizes.isSmall() ) {
            bindAnimateGrid();
        }
    },


    unload: function () {
        if ( _isLoaded ) {
            this.teardown();
        }
    },


    getElements: function () {
        $_jsGrid = dom.page.find( ".js-grid" );
        $_jsItems = $_jsGrid.children();

        return ( $_jsGrid.length );
    },


    teardown: function () {
        unbindAnimateGrid();

        $_jsGrid = null;
        $_jsItems = null;

        _isActive = false;
        _isLoaded = false;
    }
},


/**
 *
 * @private
 *
 */
bindAnimateGrid = function () {
    emitter.on( "app--scroll", onScroller );
    emitter.on( "app--scroll-up", onScrollerUp );
    emitter.on( "app--scroll-down", onScrollerDown );

    onScroller();

    console.log( "bind animate grid" );
},


/**
 *
 * @private
 *
 */
unbindAnimateGrid = function () {
    emitter.off( "app--scroll", onScroller );
    emitter.off( "app--scroll-up", onScrollerUp );
    emitter.off( "app--scroll-down", onScrollerDown );

    $_jsItems.removeClass( "is-above is-below is-entering is-leaving-bottom is-leaving-top" );

    console.log( "unbind animate grid" );
},


/**
 *
 * @private
 *
 */
onScroller = function () {
    var bounds,
        $item,
        i;

    for ( i = $_jsItems.length; i--; ) {
        $item = $_jsItems.eq( i );
        bounds = $item[ 0 ].getBoundingClientRect();

        // In the visible viewport
        if ( bounds.top > 0 && bounds.bottom < window.innerHeight ) {
            $item.addClass( "is-entering" ).removeClass( "is-above is-below is-leaving-bottom is-leaving-top" );
        }

        // Out of the visible viewport above
        if ( bounds.top < 0 && bounds.bottom < 0 ) {
            $item.addClass( "is-above" ).removeClass( "is-below is-entering is-leaving-bottom is-leaving-top" );
        }

        // Out of the visible viewport below
        if ( bounds.top > window.innerHeight && bounds.bottom > window.innerHeight ) {
            $item.addClass( "is-below" ).removeClass( "is-above is-entering is-leaving-bottom is-leaving-top" );
        }
    }
},


/**
 *
 * @private
 *
 */
onScrollerDown = function () {
    var bounds,
        $item,
        i;

    for ( i = $_jsItems.length; i--; ) {
        $item = $_jsItems.eq( i );
        bounds = $item[ 0 ].getBoundingClientRect();

        // Entering from the bottom
        if ( bounds.top < window.innerHeight && bounds.bottom > window.innerHeight ) {
            $item.addClass( "is-entering" ).removeClass( "is-above is-below is-leaving-bottom is-leaving-top" );
        }

        // Exiting from the top
        if ( (bounds.top + (bounds.height / 2)) < 0 && bounds.bottom > 0 ) {
            $item.addClass( "is-leaving-top" ).removeClass( "is-above is-below is-entering is-leaving-bottom" );
        }
    }
},


/**
 *
 * @private
 *
 */
onScrollerUp = function () {
    var bounds,
        $item,
        i;

    for ( i = $_jsItems.length; i--; ) {
        $item = $_jsItems.eq( i );
        bounds = $item[ 0 ].getBoundingClientRect();

        // Entering from the top
        if ( bounds.bottom > 0 && bounds.top < 0 ) {
            $item.addClass( "is-entering" ).removeClass( "is-above is-below is-leaving-bottom is-leaving-top" );
        }

        // Exiting from the bottom
        if ( (bounds.top + (bounds.height / 2)) > window.innerHeight && bounds.top < window.innerHeight ) {
            $item.addClass( "is-leaving-bottom" ).removeClass( "is-above is-below is-entering is-leaving-top" );
        }
    }
};


/******************************************************************************
 * Export
*******************************************************************************/
export default grid;