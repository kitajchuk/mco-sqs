import $ from "js_libs/jquery/dist/jquery";
import * as util from "./util";
import dom from "./dom";
import preload from "./preload";
import navmenu from "./navmenu";
import grid from "./grid";
import product from "./product";
import views from "./views";
import home from "./home";
import scrolls from "./scrolls";
import article from "./article";
import PageController from "properjs-pagecontroller";
import debounce from "properjs-debounce";
import cache from "./cache";
import log from "./log";


const _pageDuration = util.getTransitionDuration( dom.page[ 0 ] );


const router = {
    init () {
        this.captureLinks();
        this.setPageMinHeight();
        this.makePageController();

        util.emitter.on( "app--resize", onDebounceResize );

        log( "router initialized" );
    },


    makePageController () {
        this.controller = new PageController({
            transitionTime: _pageDuration
        });

        this.controller.setConfig([
            "*"
        ]);

        this.controller.setModules([
            preload,
            grid,
            product,
            views,
            home,
            article
        ]);

        this.controller.on( "page-controller-router-samepage", () => navmenu.close() );
        this.controller.on( "page-controller-router-transition-out", this.changePageOut.bind( this ) );
        this.controller.on( "page-controller-router-refresh-document", this.changeContent.bind( this ) );
        this.controller.on( "page-controller-router-transition-in", this.changePageIn.bind( this ) );
        this.controller.on( "page-controller-initialized-page", ( html ) => {
            this.cachePage( dom.html, $( html ).filter( ".js-page" )[ 0 ].innerHTML );
            this.cacheStaticContext( window.Static.SQUARESPACE_CONTEXT );
        });

        this.controller.initPage();
    },


    captureLinks () {
        // Suppress #hash
        dom.body.on( "click", "[href^='#']", ( e ) => {
            e.preventDefault();
        });


        dom.body.on( "click", ".absolute-cart-box", ( e ) => {
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();
            return false;
        });
    },


    cachePage ( $object, response ) {
        cache.set( this.getPageKey(), {
            $object,
            response
        });
    },


    setPageMinHeight () {
        dom.page[ 0 ].style.minHeight = util.px( window.innerHeight - dom.footerbar[ 0 ].clientHeight );
    },


    cacheStaticContext ( json ) {
        cache.set( `${this.getPageKey()}-context`, json );
    },


    getPageKey () {
        return ((window.location.pathname === "/" ? "homepage" : window.location.pathname) + window.location.search);
    },

    bindCaptureLinks () {
        dom.body.on( "click", "[href^='#']", ( e ) => e.preventDefault() );
    },


    route ( path ) {
        this.controller.getRouter().trigger( path );
    },


    push ( path, cb ) {
        this.controller.routeSilently( path, (cb || util.noop) );
    },


    track ( type, data ) {
        log( "router:track:View", type, data );

        Y.Squarespace.Analytics.view( type, data );
    },


    pushTrack ( html, $doc ) {
        let ctx = null;

        $doc = ($doc || $( html ));

        ctx = this.getStaticContext( html );

        if ( ctx ) {
            this.track( (ctx.item ? "item" : "collection"), (ctx.item || ctx.collection) );
        }

        this.setDocumentTitle( $doc.filter( "title" ).text() );
    },


    onPreloadDone () {
        router.setPageMinHeight();

        util.disableMouseWheel( false );
        util.disableTouchMove( false );

        dom.html.removeClass( "is-routing" );
        dom.page.removeClass( "is-reactive is-inactive" );
        dom.footerbar.removeClass( "is-inactive" );

        scrolls.topout( 0 );

        util.emitter.off( "app--preload-done", this.onPreloadDone );
    },


    getStaticContext ( resHTML ) {
        // Match the { data } in Static.SQUARESPACE_CONTEXT
        let ctx = cache.get( `${this.getPageKey()}-context` );

        if ( !ctx ) {
            ctx = resHTML.match( /Static\.SQUARESPACE_CONTEXT\s=\s(.*?)\};/ );

            if ( ctx && ctx[ 1 ] ) {
                ctx = ctx[ 1 ];

                // Put the ending {object} bracket back in there :-(
                ctx = `${ctx}}`;

                // Parse the string as a valid piece of JSON content
                try {
                    ctx = JSON.parse( ctx );

                } catch ( error ) {
                    throw error;
                }

                // Cache context locally
                this.cacheStaticContext( ctx );

            } else {
                ctx = false;
            }
        }

        return ctx;
    },


    changePageOut ( /* data */ ) {
        util.disableMouseWheel( true );
        util.disableTouchMove( true );

        dom.html.addClass( "is-routing" );
        dom.page.removeClass( "is-reactive" ).addClass( "is-inactive" );
        dom.footerbar.addClass( "is-inactive" );

        util.emitter.on( "app--preload-done", this.onPreloadDone );
    },


    changeContent ( html ) {
        let $object = null;
        let response = null;
        const cached = cache.get( this.getPageKey() );

        if ( cached ) {
            $object = cached.$object;
            response = cached.response;

        } else {
            $object = $( html ).filter( "title, div, main, section, header, footer, span" );
            response = $object.filter( ".js-page" )[ 0 ].innerHTML;

            this.cachePage( $object, response );
        }

        dom.page[ 0 ].innerHTML = response;

        this.pushTrack( html, $object );

        util.emitter.fire( "app--cleanup" );
    },


    changePageIn ( /* data */ ) {
        dom.page.addClass( "is-reactive" );
    },


    setDocumentTitle ( title ) {
        document.title = title;
    }
};


const onDebounceResize = debounce(function () {
    router.setPageMinHeight();

}, 300 );


/******************************************************************************
 * Export
*******************************************************************************/
export default router;