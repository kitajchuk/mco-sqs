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
import { emitter, hammered, toggleMouseWheel, toggleTouchMove } from "app/util";


var $_jsNavmenu = dom.body.find( ".js-navmenu" ),
    $_jsNavmenuParent = $_jsNavmenu.parent(),

    _isNavmenuOpen = false,
    _isSmallOn = false,
    _isSmall = (window.innerWidth <= config.tabletWidth),


/**
 *
 * @public
 *
 */
navmenu = {
    init: function () {
        hammered.on( "tap", ".js-navmenu", onToggleNavmenu );
        hammered.on( "tap", ".js-controller--navmenu", onToggleNavmenu );

        console.log( $_jsNavmenuParent );

        emitter.on( "app--resize", onResizer );

        if ( _isSmall ) {
            _isSmallOn = true;

        } else {
            unbindSmallNavmenu();
        }

        console.log( "navmenu initialized" );
    },


    close: function () {
        closeNavmenu();
    }
},


bindSmallNavmenu = function () {
    $_jsNavmenuParent.append( $_jsNavmenu );
},


unbindSmallNavmenu = function () {
    _isNavmenuOpen = false;

    $_jsNavmenu.detach().removeClass( "is-active" );
},


onResizer = function () {
    _isSmall = (window.innerWidth <= config.tabletWidth);

    if ( _isSmall && !_isSmallOn ) {
        _isSmallOn = true;

        bindSmallNavmenu();

    } else if ( !_isSmall && _isSmallOn ) {
        _isSmallOn = false;

        unbindSmallNavmenu();
    }
},


/**
 *
 * @private
 *
 */
closeNavmenu = function () {
    _isNavmenuOpen = false;

    dom.html.removeClass( "is-navmenu-open" );

    toggleTouchMove( true );
    toggleMouseWheel( true );
},


/**
 *
 * @private
 *
 */
onToggleNavmenu = function () {
    if ( _isNavmenuOpen ) {
        closeNavmenu();

    } else {
        _isNavmenuOpen = true;

        toggleTouchMove( false );
        toggleMouseWheel( false );

        dom.html.addClass( "is-navmenu-open" );
    }
};


/******************************************************************************
 * Export
*******************************************************************************/
export default navmenu;