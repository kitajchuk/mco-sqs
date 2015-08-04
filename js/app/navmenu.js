/*!
 *
 * App Controller: navmenu
 *
 * A nice description of what this controller does...
 *
 *
 */
import "app/dom";
import "app/config";
import { hammered, toggleMouseWheel, toggleTouchMove, getTransitionDuration } from "app/util";


var $_jsNavmenuParent = dom.navmenu.parent(),

    _isActive = false,
    _transitionTime = getTransitionDuration( dom.navmenu[ 0 ] ),


/**
 *
 * @public
 *
 */
navmenu = {
    init: function () {
        dom.navmenu.detach();

        hammered.on( "tap", ".js-navmenu", onToggleNavmenu );
        hammered.on( "tap", ".js-controller--navmenu", onToggleNavmenu );

        dom.body.on( "click", ".js-navbar-shop", onShopNavbar );

        console.log( "navmenu initialized" );
    },


    close: function () {
        closeNavmenu();
    }
},


/**
 *
 * @private
 *
 */
closeNavmenu = function () {
    dom.html.removeClass( "is-navmenu-open" );

    toggleTouchMove( true );
    toggleMouseWheel( true );

    setTimeout(function () {
        dom.navmenu.detach();

    }, _transitionTime );
},


/**
 *
 * @private
 *
 */
onShopNavbar = function ( e ) {
    e.preventDefault();

    console.log( "shop nav" );
},


/**
 *
 * @private
 *
 */
onToggleNavmenu = function () {
    _isActive = !_isActive;

    if ( _isActive ) {
        toggleTouchMove( false );
        toggleMouseWheel( false );

        $_jsNavmenuParent.append( dom.navmenu );

        setTimeout(function () {
            dom.html.addClass( "is-navmenu-open" );

        }, 100 );

    } else {
        closeNavmenu();
    }
};


/******************************************************************************
 * Export
*******************************************************************************/
export default navmenu;