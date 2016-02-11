import * as core from "./core";
import $ from "js_libs/jquery/dist/jquery";
import PageController from "properjs-pagecontroller";
import navmenu from "./navmenu";
import grid from "./grid";
import product from "./product";
import views from "./views";
import home from "./home";
import article from "./article";


/**
 *
 * @public
 * @namespace router
 * @description Handles async web app routing for nice transitions.
 *
 */
const router = {
    /**
     *
     * @public
     * @method init
     * @memberof router
     * @description Initialize the router module.
     *
     */
    init () {
        this.pageDuration = core.util.getTransitionDuration( core.dom.page[ 0 ] );
        this.bindEmptyHashLinks();
        this.createPageController();

        core.emitter.on( "app--resize-debounced", this.setPageMinHeight );

        core.log( "router initialized" );
    },


    /**
     *
     * @public
     * @method createPageController
     * @memberof router
     * @description Create the PageController instance.
     *
     */
    createPageController () {
        this.controller = new PageController({
            transitionTime: this.pageDuration
        });

        this.controller.setConfig([
            "*"
        ]);

        this.controller.setModules([
            core.images,

            grid,
            home,
            views,
            product,
            article
        ]);

        this.controller.on( "page-controller-router-samepage", () => navmenu.close() );
        this.controller.on( "page-controller-router-transition-out", this.changePageOut.bind( this ) );
        this.controller.on( "page-controller-router-refresh-document", this.changeContent.bind( this ) );
        this.controller.on( "page-controller-router-transition-in", this.changePageIn.bind( this ) );
        this.controller.on( "page-controller-initialized-page", ( html ) => {
            this.setPageMinHeight();
            this.cachePage( core.dom.html, $( html ).filter( ".js-page" )[ 0 ].innerHTML );
        });

        this.controller.initPage();
    },


    /**
     *
     * @public
     * @method cachePage
     * @param {jQuery} $object The node for use
     * @param {string} response The XHR responseText
     * @memberof router
     * @description Cache the DOM content for a page once its parsed out.
     *
     */
    cachePage ( $object, response ) {
        core.cache.set( core.util.getPageKey(), {
            $object,
            response
        });
    },

    /**
     *
     * @public
     * @method bindEmptyHashLinks
     * @memberof router
     * @description Suppress #hash links.
     *
     */
    bindEmptyHashLinks () {
        core.dom.body.on( "click", "[href^='#']", ( e ) => e.preventDefault() );
        core.dom.body.on( "click", ".absolute-cart-box", ( e ) => {
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();
            return false;
        });
    },


    /**
     *
     * @public
     * @method route
     * @param {string} path The uri to route to
     * @memberof router
     * @description Trigger app to route a specific page. [Reference]{@link https://github.com/ProperJS/Router/blob/master/Router.js#L222}
     *
     */
    route ( path ) {
        this.controller.getRouter().trigger( path );
    },


    /**
     *
     * @public
     * @method push
     * @param {string} path The uri to route to
     * @param {function} cb Optional callback to fire
     * @memberof router
     * @description Trigger a silent route with a supplied callback.
     *
     */
    push ( path, cb ) {
        this.controller.routeSilently( path, (cb || core.util.noop) );
    },


    /**
     *
     * @public
     * @method onPreloadDone
     * @memberof router
     * @description Finish routing sequence when image pre-loading is done.
     *
     */
    onPreloadDone () {
        core.util.disableMouseWheel( false );
        core.util.disableTouchMove( false );

        core.dom.html.removeClass( "is-routing" );
        core.dom.page.removeClass( "is-reactive is-inactive" );
        core.dom.footerbar.removeClass( "is-inactive" );

        core.scrolls.topout( 0 );
        core.scrolls.clearStates();

        setTimeout( () => {
            core.emitter.fire( "app--intro-art" );

        }, this.pageDuration );

        core.emitter.off( "app--preload-done", this.onPreloadDone );
    },


    /**
     *
     * @public
     * @method changePageOut
     * @memberof router
     * @description Trigger transition-out animation.
     *
     */
    changePageOut () {
        core.util.disableMouseWheel( true );
        core.util.disableTouchMove( true );

        core.dom.html.addClass( "is-routing" );
        core.dom.page.removeClass( "is-reactive" ).addClass( "is-inactive" );
        core.dom.footerbar.addClass( "is-inactive" );

        core.emitter.on( "app--preload-done", this.onPreloadDone );
    },


    /**
     *
     * @public
     * @method changeContent
     * @param {string} html The responseText as an HTML string
     * @memberof router
     * @description Swap the new content into the DOM.
     *
     */
    changeContent ( html ) {
        let $object = null;
        let response = null;
        let doc = null;
        const cached = core.cache.get( core.util.getPageKey() );

        if ( cached ) {
            $object = cached.$object;
            response = cached.response;

        } else {
            doc = document.createElement( "html" );
            doc.innerHTML = html;
            $object = $( doc );
            response = $object.find( ".js-page" )[ 0 ].innerHTML;

            this.cachePage( $object, response );
        }

        core.dom.page[ 0 ].innerHTML = response;

        core.emitter.fire( "app--analytics-push", html, $object );

        core.emitter.fire( "app--cleanup" );
    },


    /**
     *
     * @public
     * @method changePageIn
     * @memberof router
     * @description Trigger transition-in animation.
     *
     */
    changePageIn () {
        this.setPageMinHeight();

        core.dom.page.addClass( "is-reactive" );
    },


    /**
     *
     * @private
     * @method setPageMinHeight
     * @memberof router
     * @description Update page paddingTop
     *
     */
    setPageMinHeight () {
        core.dom.page[ 0 ].style.minHeight = core.util.px( window.innerHeight - core.dom.footerbar[ 0 ].clientHeight );
    }
};



/******************************************************************************
 * Export
*******************************************************************************/
export default router;