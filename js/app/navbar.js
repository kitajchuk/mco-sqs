/*!
 *
 * App Controller: navbar
 *
 * A nice description of what this controller does...
 *
 *
 */
import "app/dom";
import "app/config";
import { emitter, hammered, toggleMouseWheel, toggleTouchMove } from "app/util";


var $_jsNavbar = dom.body.find( ".js-navbar-small" ),
    $_jsNavbarParent = $_jsNavbar.parent(),
    $_jsNavbarItems = $_jsNavbar.find( ".js-navbar-small-item" ),

    _isNavbarOpen = false,
    _isSmallOn = false,
    _isSmall = (window.innerWidth <= config.tabletWidth),


/**
 *
 * @public
 *
 */
navbar = {
    init: function () {
        hammered.on( "tap", ".js-navbar-small", onToggleNavbar );
        hammered.on( "tap", ".js-navbar-small-item", onNavbarItem );
        hammered.on( "tap", ".js-controller--navbar", onToggleNavbar );

        console.log( $_jsNavbarParent );

        emitter.on( "app--resize", onResizer );

        if ( _isSmall ) {
            _isSmallOn = true;

        } else {
            unbindSmallNavbar();
        }

        console.log( "navbar initialized" );
    },


    close: function () {
        closeNavbar();
    },


    clearActive: function () {
        $_jsNavbarItems.removeClass( "is-active" );
    }
},


bindSmallNavbar = function () {
    $_jsNavbarParent.append( $_jsNavbar );
},


unbindSmallNavbar = function () {
    _isNavbarOpen = false;

    $_jsNavbar.detach().removeClass( "is-active" );
},


onResizer = function () {
    _isSmall = (window.innerWidth <= config.tabletWidth);

    if ( _isSmall && !_isSmallOn ) {
        _isSmallOn = true;

        bindSmallNavbar();

    } else if ( !_isSmall && _isSmallOn ) {
        _isSmallOn = false;

        unbindSmallNavbar();
    }
},


/**
 *
 * @private
 *
 */
closeNavbar = function () {
    _isNavbarOpen = false;

    $_jsNavbar.removeClass( "is-active" );

    toggleTouchMove( true );
    toggleMouseWheel( true );
},


/**
 *
 * @temp
 *
 */
onNavbarItem = function () {
    var $this = $( this );

    $_jsNavbarItems.removeClass( "is-active" );
    $this.addClass( "is-active" );
},


/**
 *
 * @private
 *
 */
onToggleNavbar = function () {
    if ( _isNavbarOpen ) {
        closeNavbar();

    } else {
        _isNavbarOpen = true;

        toggleTouchMove( false );
        toggleMouseWheel( false );

        $_jsNavbar.addClass( "is-active" );
    }
};


/******************************************************************************
 * Export
*******************************************************************************/
export default navbar;