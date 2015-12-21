import dom from "./dom";
import resizes from "./resizes";
import * as util from "./util";


let $_jsGrid = null;
let $_jsItems = null;


const grid = {
    init () {
        console.log( "grid initialized" );
    },


    isActive () {
        return (this.getElements() > 0);
    },


    onload () {
        util.emitter.on( "app--resize", onResizer );
        util.emitter.on( "app--resize-small", unbindAnimateGrid );
        util.emitter.on( "app--resize-normal", bindAnimateGrid );

        if ( !resizes.isSmall() ) {
            bindAnimateGrid();
        }
    },


    unload () {
        this.teardown();
    },


    getElements () {
        $_jsGrid = dom.page.find( ".js-grid" );
        $_jsItems = $_jsGrid.children();

        return ( $_jsGrid.length );
    },


    teardown () {
        unbindAnimateGrid();

        util.emitter.off( "app--resize", onResizer );
        util.emitter.off( "app--resize-small", unbindAnimateGrid );
        util.emitter.off( "app--resize-normal", bindAnimateGrid );

        $_jsGrid = null;
        $_jsItems = null;
    }
};


const bindAnimateGrid = function () {
    util.emitter.on( "app--scroll", onScroller );
    util.emitter.on( "app--scroll-up", onScrollerUp );
    util.emitter.on( "app--scroll-down", onScrollerDown );

    onScroller();

    console.log( "bind animate grid" );
};


const unbindAnimateGrid = function () {
    util.emitter.off( "app--scroll", onScroller );
    util.emitter.off( "app--scroll-up", onScrollerUp );
    util.emitter.off( "app--scroll-down", onScrollerDown );

    $_jsItems.removeClass( "is-above is-below is-entering is-leaving-bottom is-leaving-top" );

    console.log( "unbind animate grid" );
};


const onResizer = function () {
    onScroller();
    onScrollerUp();
    onScrollerDown();
};


const onScroller = function () {
    let bounds = null;
    let $item = null;
    let i = $_jsItems.length;

    for ( i; i--; ) {
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
};


const onScrollerDown = function () {
    let bounds = null;
    let $item = null;
    let i = $_jsItems.length;

    for ( i; i--; ) {
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
};


const onScrollerUp = function () {
    let bounds = null;
    let $item = null;
    let i = $_jsItems.length;

    for ( i; i--; ) {
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