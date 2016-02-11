import product from "./product";
import article from "./article";
import router from "./router";
import Hammered from "properjs-hammered";
import * as core from "./core";


const $_jsNavmenuParent = core.dom.navmenu.parent();
const _transitionTime = core.util.getTransitionDuration( core.dom.navmenu[ 0 ] );
const _hammers = {};
let _isActive = false;


const navmenu = {
    init () {
        core.dom.navmenu.detach();

        _hammers.listIcon = new Hammered( core.dom.navbar[ 0 ], core.config.defaultHammerOptions );
        _hammers.listIcon.on( "tap", ".js-controller--navmenu", onToggleNavmenu );

        _hammers.navMenu = new Hammered( core.dom.navmenu[ 0 ], core.config.defaultHammerOptions );
        _hammers.navMenu.on( "tap", ".js-navmenu", onToggleNavmenu );

        _hammers.gridIcon = new Hammered( core.dom.navbar[ 0 ], core.config.defaultHammerOptions );
        _hammers.gridIcon.on( "tap", ".js-controller--grid", onToggleNavmenu );

        core.dom.body.on( "click", ".js-navbar-shop", onShopNavbar );

        core.log( "navmenu initialized" );
    },


    close () {
        closeNavmenu();
    }
};


const closeNavmenu = function () {
    core.dom.html.removeClass( "is-navmenu-open" );

    core.util.disableTouchMove( false );
    core.util.disableMouseWheel( false );

    setTimeout(() => {
        core.dom.navmenu.detach();

    }, _transitionTime );
};


const onShopNavbar = function ( e ) {
    e.preventDefault();

    core.log( "shop nav" );
};


const onToggleNavmenu = function () {
    if ( product.isActive() ) {
        router.controller.getRouter().trigger( "/shop/" );
        return;
    }

    if ( article.isActive() ) {
        router.controller.getRouter().trigger( "/journal/" );
        return;
    }

    _isActive = !_isActive;

    if ( _isActive ) {
        core.util.disableTouchMove( true );
        core.util.disableMouseWheel( true );

        $_jsNavmenuParent.append( core.dom.navmenu );

        setTimeout(() => {
            core.dom.html.addClass( "is-navmenu-open" );

        }, 100 );

    } else {
        closeNavmenu();
    }
};


/******************************************************************************
 * Export
*******************************************************************************/
export default navmenu;