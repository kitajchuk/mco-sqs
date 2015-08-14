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
import "app/product";
import { emitter, hammered, toggleMouseWheel, toggleTouchMove, getTransitionDuration } from "app/util";


var $_jsNavmenuParent = dom.navmenu.parent(),
    $_jsNavmenuIcon = dom.navbar.find( ".js-navmenu-icon" ),

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

        emitter.on( "app--product-detail-on", onProductDetail );
        emitter.on( "app--product-detail-off", offProductDetail );

        dom.body.on( "click", ".js-navbar-shop", onShopNavbar );

        console.log( "navmenu initialized" );
    },


    close: function () {
        closeNavmenu();
    }
},


onProductDetail = function () {
    $_jsNavmenuIcon.addClass( "icon--grid" ).removeClass( "icon--menu" );
},


offProductDetail = function () {
    $_jsNavmenuIcon.addClass( "icon--menu" ).removeClass( "icon--grid" );
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
    if ( product.isActive() ) {
        app.router.pageController.getRouter().trigger( "/shop/" );

        return;
    }

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