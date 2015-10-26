import "app/dom";
import "app/util";
import "app/config";


var $_jsViews = null,


    Hammered = require( "Hammered" ),


/**
 *
 * @public
 * @namespace app.views
 * @memberof app.
 * @description A nice description of what this module does...
 *
 */
views = {
    /**
     *
     * @public
     * @method init
     * @memberof app.views
     * @description Method runs once when window loads.
     *
     */
    init: function () {
        console.log( "views initialized" );
    },


    /**
     *
     * @public
     * @method isActive
     * @memberof app.views
     * @description Method informs PageController of active status.
     * @returns {boolean}
     *
     */
    isActive: function () {
        return (this.getElements() > 0);
    },


    /**
     *
     * @public
     * @method onload
     * @memberof app.views
     * @description Method performs onloading actions for this module.
     *
     */
    onload: function () {
        loadViews();

        util.emitter.on( "app--resize", onResize );
    },


    /**
     *
     * @public
     * @method unload
     * @memberof app.views
     * @description Method performs unloading actions for this module.
     *
     */
    unload: function () {
        this.teardown();
    },


    /**
     *
     * @public
     * @method teardown
     * @memberof app.views
     * @description Method performs cleanup after this module. Remmoves events, null vars etc...
     *
     */
    teardown: function () {
        stopViews();

        $_jsViews = null;

        util.emitter.off( "app--resize", onResize );
    },


    getElements: function () {
        $_jsViews = dom.page.find( ".js-views" );

        return ($_jsViews.length);
    }
},


onResize = function () {
    var i;

    for ( i = $_jsViews.length; i--; ) {
        resizeView( $_jsViews.eq( i ) );
    }
},


onTapView = function () {
    var $nav = $( this ),
        $view = $nav.closest( ".js-views" ),
        $next = null,
        $curr = null,
        data = $view.data();

    try {
        clearTimeout( data.timeout );

        data.$boxes.removeClass( "is-entering is-exiting is-active" );

    } catch ( error ) {}

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
    data.$box[ 0 ].style.height = util.px( $next[ 0 ].clientHeight );

    $view.data({
        index: data.index,
        timeout: setTimeout(function () {
            $curr.removeClass( "is-exiting" );
            $next.removeClass( "is-entering" ).addClass( "is-active" );

        }, data.duration )
    });
},


resizeView = function ( $view ) {
    var data = $view.data();

    data.$box[ 0 ].style.height = util.px( data.$boxes.filter( ".is-active" )[ 0 ].clientHeight );
},


stopView = function ( $view ) {
    var data = $view.data();

    data.hammered.off( "tap", onTapView );

    $view.removeData();
},


stopViews = function () {
    var i;

    for ( i = $_jsViews.length; i--; ) {
        stopView( $_jsViews.eq( i ) );
    }
},


loadView = function ( $view ) {
    var $navs = $view.find( ".js-views-nav" ),
        $boxes = $view.find( ".js-views-box" ),
        $box = $view.find( ".js-views-boxes" ),
        hammered = new Hammered( $view[ 0 ], config.hammerDefaults );

    $navs.first().addClass( "is-active" );
    $boxes.first().addClass( "is-active" );
    $box[ 0 ].style.height = util.px( $boxes.first()[ 0 ].clientHeight );

    $view.data({
        index: 0,
        timeout: null,
        duration: util.getTransitionDuration( $boxes[ 0 ] ),
        hammered: hammered,
        $navs: $navs,
        $boxes: $boxes,
        $box: $box
    });

    hammered.on( "tap", ".js-views-nav", onTapView );
},


loadViews = function () {
    var i;

    for ( i = $_jsViews.length; i--; ) {
        loadView( $_jsViews.eq( i ) );
    }
};


/******************************************************************************
 * Export
*******************************************************************************/
export default views;