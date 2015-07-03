/*!
 *
 * App Controller: scrolls
 *
 * A nice description of what this controller does...
 *
 *
 */
import "app/dom";
import "app/detect";
import { scroller, emitter, noop } from "app/util";


var _timeout = null,
    _idleout = 300,
    _isNones = false,


/**
 *
 * @public
 *
 */
scrolls = {
    init: function () {
        console.log( "scrolls initialized" );
    },


    isActive: noop,


    isLoaded: noop,


    onload: function () {
        scroller.on( "scroll", onScroller );
        scroller.on( "scrollup", onScrollerUp );
        scroller.on( "scrolldown", onScrollerDown );
        emitter.on( "app--do-scroll", onScroller );

        onScroller();

        this.topout();
    },


    unload: function () {
        this.teardown();
    },


    topout: function ( top ) {
        top = top || 0;

        window.scrollTo( 0, top );
    },


    teardown: function () {
        scroller.off( "scroll", onScroller );
        emitter.off( "app--do-scroll", onScroller );
    }
},


/**
 *
 * @private
 *
 */
suppressEvents = function ( scrollPos ) {
    try {
        clearTimeout( _timeout );

    } catch ( error ) {}

    if ( !_isNones ) {
        _isNones = true;

        dom.html.addClass( "is-scrolling" );
    }

    _timeout = setTimeout(function () {
        if ( scrollPos === scroller.getScrollY() ) {
            _isNones = false;

            dom.html.removeClass( "is-scrolling" );
        }

    }, _idleout );
},


/**
 *
 * @private
 *
 */
onScroller = function () {
    var scrollPos = scroller.getScrollY(),
        bounds,
        $items = $( ".js-grid" ).children(),
        $item,
        i;

    if ( !detect.isTouch() ) {
        suppressEvents( scrollPos );
    }

    emitter.fire( "app--scroll", scrollPos );


    for ( i = $items.length; i--; ) {
        $item = $items.eq( i );
        bounds = $items[ i ].getBoundingClientRect();

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


onScrollerDown = function () {
    var bounds,
        $items = $( ".js-grid" ).children(),
        $item,
        i;

    for ( i = $items.length; i--; ) {
        $item = $items.eq( i );
        bounds = $items[ i ].getBoundingClientRect();

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


onScrollerUp = function () {
    var bounds,
        $items = $( ".js-grid" ).children(),
        $item,
        i;

    for ( i = $items.length; i--; ) {
        $item = $items.eq( i );
        bounds = $items[ i ].getBoundingClientRect();

        // Entering from the top
        if ( bounds.top < window.innerHeight && bounds.bottom > window.innerHeight ) {
            $item.addClass( "is-leaving-bottom" ).removeClass( "is-entering is-leaving-top" );
        }

        // Exiting from the bottom
        if ( (bounds.top + (bounds.height / 2)) < 0 && bounds.bottom > 0 ) {
            $item.addClass( "is-entering" ).removeClass( "is-leaving-bottom is-leaving-top" );
        }
    }
};


/******************************************************************************
 * Export
*******************************************************************************/
export default scrolls;