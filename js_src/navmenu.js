import dom from "./dom";
import product from "./product";
import * as util from "./util";
import router from "./router";
import config from "./config";
import Hammered from "properjs-hammered";


const $_jsNavmenuParent = dom.navmenu.parent();
const _transitionTime = util.getTransitionDuration( dom.navmenu[ 0 ] );
const _hammers = {};
let _isActive = false;


const navmenu = {
    init: function () {
        dom.navmenu.detach();

        _hammers.listIcon = new Hammered( dom.navbar[ 0 ], config.defaultHammerOptions );
        _hammers.listIcon.on( "tap", ".js-controller--navmenu", onToggleNavmenu );

        _hammers.navMenu = new Hammered( dom.navmenu[ 0 ], config.defaultHammerOptions );
        _hammers.navMenu.on( "tap", ".js-navmenu", onToggleNavmenu );

        _hammers.gridIcon = new Hammered( dom.navbar[ 0 ], config.defaultHammerOptions );
        _hammers.gridIcon.on( "tap", ".js-controller--grid", onToggleNavmenu );

        dom.body.on( "click", ".js-navbar-shop", onShopNavbar );

        console.log( "navmenu initialized" );
    },


    close: function () {
        closeNavmenu();
    }
};


const closeNavmenu = function () {
    dom.html.removeClass( "is-navmenu-open" );

    util.disableTouchMove( false );
    util.disableMouseWheel( false );

    setTimeout(function () {
        dom.navmenu.detach();

    }, _transitionTime );
};


const onShopNavbar = function ( e ) {
    e.preventDefault();

    console.log( "shop nav" );
};


const onToggleNavmenu = function () {
    if ( product.isActive() ) {
        router.controller.getRouter().trigger( "/shop/" );

        return;
    }

    _isActive = !_isActive;

    if ( _isActive ) {
        util.disableTouchMove( true );
        util.disableMouseWheel( true );

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