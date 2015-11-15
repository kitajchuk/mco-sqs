import dom from "./dom";
import detect from "./detect";
import * as util from "./util";


let _timeout = null;
let _isNones = false;
const _idleout = 300;


const scrolls = {
    init: function () {
        util.scroller.on( "scroll", onScroller );
        util.scroller.on( "scrollup", onScrollerUp );
        util.scroller.on( "scrolldown", onScrollerDown );
        util.emitter.on( "app--do-scroll", onScroller );

        onScroller();
        onScrollerUp();
        onScrollerDown();

        this.topout();

        console.log( "scrolls initialized" );
    },


    topout: function ( top ) {
        top = top || 0;

        window.scrollTo( 0, top );
    }
};


const suppressEvents = function ( scrollPos ) {
    if ( detect.isTouch() ) {
        return;
    }

    try {
        clearTimeout( _timeout );

    } catch ( error ) {
        throw error;
    }

    if ( !_isNones ) {
        _isNones = true;

        dom.html.addClass( "is-scrolling" );

        util.emitter.fire( "app--scroll-start" );
    }

    _timeout = setTimeout(function () {
        if ( scrollPos === util.scroller.getScrollY() ) {
            _isNones = false;

            dom.html.removeClass( "is-scrolling" );

            util.emitter.fire( "app--scroll-end" );
        }

    }, _idleout );
};


const onScroller = function () {
    const scrollPos = util.scroller.getScrollY();

    suppressEvents( scrollPos );

    util.emitter.fire( "app--scroll", scrollPos );
};


const onScrollerUp = function () {
    const scrollPos = util.scroller.getScrollY();

    if ( scrollPos <= 0 || detect.isTouch() ) {
        return;
    }

    util.emitter.fire( "app--scroll-up", scrollPos );
};


const onScrollerDown = function () {
    const scrollPos = util.scroller.getScrollY();

    if ( scrollPos <= 0 || detect.isTouch() ) {
        return;
    }

    util.emitter.fire( "app--scroll-down", scrollPos );
};


/******************************************************************************
 * Export
*******************************************************************************/
export default scrolls;