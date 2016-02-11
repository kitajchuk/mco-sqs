import * as core from "./core";


let $_jsGrid = null;
let $_jsItems = null;


const grid = {
    init () {
        core.log( "grid initialized" );
    },


    isActive () {
        return (this.getElements() > 0);
    },


    onload () {
        core.emitter.on( "app--resize", onResizer );
        core.emitter.on( "app--scroll", onScroller );
        core.emitter.on( "app--scroll-up", onScrollerUp );
        core.emitter.on( "app--scroll-down", onScrollerDown );

        onScroller();
    },


    unload () {
        this.teardown();
    },


    getElements () {
        $_jsGrid = core.dom.page.find( ".js-grid" );
        $_jsItems = $_jsGrid.children();

        return ( $_jsGrid.length );
    },


    teardown () {
        core.emitter.off( "app--resize", onResizer );

        $_jsGrid = null;
        $_jsItems = null;
    }
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