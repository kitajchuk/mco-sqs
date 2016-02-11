import $ from "js_libs/jquery/dist/jquery";
import Hammered from "properjs-hammered";
import * as core from "./core";


let $_jsViews = null;


const views = {
    init () {
        core.log( "views initialized" );
    },


    isActive () {
        return (this.getElements() > 0);
    },


    onload () {
        loadViews();

        core.emitter.on( "app--resize", onResize );
    },


    unload () {
        this.teardown();
    },


    teardown () {
        stopViews();

        $_jsViews = null;

        core.emitter.off( "app--resize", onResize );
    },


    getElements () {
        $_jsViews = core.dom.page.find( ".js-views" );

        return ($_jsViews.length);
    }
};


const onResize = function () {
    let i = $_jsViews.length;

    for ( i; i--; ) {
        resizeView( $_jsViews.eq( i ) );
    }
};


const onTapView = function () {
    const $nav = $( this );
    const $view = $nav.closest( ".js-views" );
    let $next = null;
    let $curr = null;
    const data = $view.data();

    try {
        clearTimeout( data.timeout );

        data.$boxes.removeClass( "is-entering is-exiting is-active" );

    } catch ( error ) {
        throw error;
    }

    // Get the curr box
    $curr = data.$boxes.eq( data.index );

    // Set the index
    data.index = $nav.index();

    // Set the next box
    $next = data.$boxes.eq( data.index );

    // Toggle nav states
    data.$navs.removeClass( "is-active" );
    data.$navs.eq( data.index ).addClass( "is-active" );

    // Toggle the boxes
    $curr.removeClass( "is-active" ).addClass( "is-exiting" );
    $next.addClass( "is-entering" );

    // Tweak view box height
    data.$box[ 0 ].style.height = core.util.px( $next[ 0 ].clientHeight );

    $view.data({
        index: data.index,
        timeout: setTimeout(() => {
            $curr.removeClass( "is-exiting" );
            $next.removeClass( "is-entering" ).addClass( "is-active" );

        }, data.duration )
    });
};


const resizeView = function ( $view ) {
    const data = $view.data();

    data.$box[ 0 ].style.height = core.util.px( data.$boxes.filter( ".is-active" )[ 0 ].clientHeight );
};


const stopView = function ( $view ) {
    const data = $view.data();

    data.hammered.off( "tap", onTapView );

    $view.removeData();
};


const stopViews = function () {
    let i = $_jsViews.length;

    for ( i; i--; ) {
        stopView( $_jsViews.eq( i ) );
    }
};


const loadView = function ( $view ) {
    const $navs = $view.find( ".js-views-nav" );
    const $boxes = $view.find( ".js-views-box" );
    const $box = $view.find( ".js-views-boxes" );
    const hammered = new Hammered( $view[ 0 ], core.config.defaultHammerOptions );

    $navs.first().addClass( "is-active" );
    $boxes.first().addClass( "is-active" );
    $box[ 0 ].style.height = core.util.px( $boxes.first()[ 0 ].clientHeight );

    $view.data({
        index: 0,
        timeout: null,
        duration: core.util.getTransitionDuration( $boxes[ 0 ] ),
        hammered,
        $navs,
        $boxes,
        $box
    });

    hammered.on( "tap", ".js-views-nav", onTapView );
};


const loadViews = function () {
    let i = $_jsViews.length;

    for ( i; i--; ) {
        loadView( $_jsViews.eq( i ) );
    }
};


/******************************************************************************
 * Export
*******************************************************************************/
export default views;