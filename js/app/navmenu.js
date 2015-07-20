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


var $_jsNavmenu = dom.body.find( ".js-navmenu" ),
    $_jsNavmenuParent = $_jsNavmenu.parent(),

    _isActive = false,
    _transitionTime = getTransitionDuration( $_jsNavmenu[ 0 ] ),


/**
 *
 * @public
 *
 */
navmenu = {
    init: function () {
        $_jsNavmenu.detach();

        hammered.on( "tap", ".js-navmenu", onToggleNavmenu );
        hammered.on( "tap", ".js-controller--navmenu", onToggleNavmenu );

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
        $_jsNavmenu.detach();

    }, _transitionTime );
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

        $_jsNavmenuParent.append( $_jsNavmenu );

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