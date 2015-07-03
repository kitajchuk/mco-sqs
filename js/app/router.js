/*!
 *
 * App Controller: router
 *
 * A nice description of what this controller does...
 *
 *
 */
import { emitter, hammered, getTransitionDuration } from "app/util";
import "app/dom";
import "app/preload";
import "app/scrolls";


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
            preload
        ]);

        _pageController.initPage();

        _pageController.on( "page-controller-router-samepage", function () {
            console.log( "samepage" );
        });

        _pageController.on( "page-controller-router-transition-out", function () {
            changePageOut();
        });

        _pageController.on( "page-controller-router-transition-in", function ( data ) {
            changePageIn( data );
        });

        captureLinks();

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
},


/**
 *
 * @private
 *
 */
onPreloadDone = function () {
    preload.triggerEvents();

    setTimeout(function () {
        dom.page.removeClass( "is-reactive is-inactive" );

    }, _pageDuration );

    emitter.off( "app--preload", onPreloadDone );
},


/**
 *
 * @private
 *
 */
changePageOut = function () {
    dom.page.removeClass( "is-reactive" ).addClass( "is-inactive" );

    emitter.on( "app--preload", onPreloadDone );
},


/**
 *
 * @private
 *
 */
changePageIn = function ( data ) {
    var $doc = $( data.response ),
        res = $doc.find( ".js-page" )[ 0 ].innerHTML;

    document.title = $doc.filter( "title" ).text();

    dom.page.addClass( "is-reactive" )[ 0 ].innerHTML = res;
};


/******************************************************************************
 * Export
*******************************************************************************/
export default router;