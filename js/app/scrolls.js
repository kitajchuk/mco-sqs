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
        onScrollerUp();
        onScrollerDown();

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
        scroller.off( "scrollup", onScrollerUp );
        scroller.off( "scrolldown", onScrollerDown );
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
    var scrollPos = scroller.getScrollY();

    if ( !detect.isTouch() ) {
        suppressEvents( scrollPos );
    }

    emitter.fire( "app--scroll", scrollPos );
},


/**
 *
 * @private
 *
 */
onScrollerUp = function () {
    var scrollPos = scroller.getScrollY();

    emitter.fire( "app--scroll-up", scrollPos );
},


/**
 *
 * @private
 *
 */
onScrollerDown = function () {
    var scrollPos = scroller.getScrollY();

    emitter.fire( "app--scroll-down", scrollPos );
};


/******************************************************************************
 * Export
*******************************************************************************/
export default scrolls;