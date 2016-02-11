import router from "./router";
import navmenu from "./navmenu";
import footerbar from "./footerbar";
import cart from "./cart";
import * as core from "./core";


/**
 *
 * @public
 * @class App
 * @classdesc Load the App application Class to handle it ALL.
 *
 */
class App {
    constructor () {
        this.cart = cart;
        this.core = core;
        this.router = router;
        this.navmenu = navmenu;
        this.footerbar = footerbar;

        this.initEvents();
        this.initModules();
    }


    /**
     *
     * @public
     * @instance
     * @method initModules
     * @memberof App
     * @description Initialize application modules.
     *
     */
    initModules () {
        this.core.detect.init( this );
        this.core.resizes.init( this );
        this.core.scrolls.init( this );
        this.cart.init( this );
        this.router.init( this );
        this.navmenu.init( this );
        this.footerbar.init( this );

        this.analytics = new this.core.Analytics();
    }


    /**
     *
     * @public
     * @instance
     * @method initEvents
     * @memberof App
     * @description Initialize application events.
     *
     */
    initEvents () {
        this._onPreloadDone = this.onPreloadDone.bind( this );

        this.core.emitter.on( "app--preload-done", this._onPreloadDone );
    }


    /**
     *
     * @public
     * @instance
     * @method onPreloadDone
     * @memberof App
     * @description Handle the event for initializing the app.
     *
     */
    onPreloadDone () {
        this.core.emitter.off( "app--preload-done", this._onPreloadDone );

        this.core.dom.html.removeClass( "is-clipped" );
        this.core.dom.body.removeClass( "is-clipped" ).addClass( "is-active" );
    }
}


/******************************************************************************
 * Bootstrap
*******************************************************************************/
window.onload = function () {
    window.app = new App();
};