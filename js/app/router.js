/*!
 *
 * App Controller: router
 *
 * A nice description of what this controller does...
 *
 *
 */
import { emitter, getTransitionDuration } from "app/util";
import "app/dom";
import "app/preload";
import "app/scrolls";
import "app/navmenu";
import "app/grid";
import "app/product";
import "app/views";


var PageController = require( "PageController" ),

    _pageDuration = getTransitionDuration( dom.page[ 0 ] ),
    _pageController = new PageController({
        anchorTop: false,
        transitionTime: _pageDuration
    }),


/**
 *
 * @public
 *
 */
router = {
    init: function () {
        _pageController.setConfig([
            "*"
        ]);

        _pageController.setModules([
            scrolls,
            preload,

            grid,
            product,
            views
        ]);

        _pageController.initPage();

        _pageController.on( "page-controller-router-samepage", function () {
            navmenu.close();
        });

        _pageController.on( "page-controller-router-transition-out", function () {
            changePageOut();
        });

        _pageController.on( "page-controller-router-refresh-document", function ( html ) {
            changeContent( html );
        });

        _pageController.on( "page-controller-router-transition-in", function ( data ) {
            changePageIn( data );
        });

        captureLinks();

        // Don't do this, ideally :-/
        this.pageController = _pageController;

        console.log( "router initialized" );
    }
},


/**
 *
 * @private
 *
 */
captureLinks = function () {
    // Suppress #hash
    dom.body.on( "click", "[href^='#']", function ( e ) {
        e.preventDefault();
    });


    dom.body.on( "click", ".absolute-cart-box", function ( e ) {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        return false;
    });
},


/**
 *
 * @private
 *
 */
onPreloadDone = function () {
    preload.triggerEvents();

    setTimeout(function () {
        dom.html.removeClass( "is-routing" );
        dom.page.removeClass( "is-reactive is-inactive" );

    }, _pageDuration );

    emitter.off( "app--preload-done", onPreloadDone );
},


/**
 *
 * @private
 *
 */
changePageOut = function () {
    navmenu.close();

    dom.html.addClass( "is-routing" );
    dom.page.removeClass( "is-reactive" ).addClass( "is-inactive" );

    emitter.on( "app--preload-done", onPreloadDone );
},


/**
 *
 * @private
 *
 */
changeContent = function ( html ) {
    var $doc = $( html ),
        res = $doc.filter( ".js-page" )[ 0 ].innerHTML;

    document.title = $doc.filter( "title" ).text();

    dom.page[ 0 ].innerHTML = res;
},


/**
 *
 * @private
 *
 */
changePageIn = function () {
    dom.page.addClass( "is-reactive" );
};


/******************************************************************************
 * Export
*******************************************************************************/
export default router;