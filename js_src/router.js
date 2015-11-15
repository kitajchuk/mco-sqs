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
import PageController from "properjs-pagecontroller";


const _pageDuration = util.getTransitionDuration( dom.page[ 0 ] );


const router = {
    controller: new PageController({
        transitionTime: _pageDuration
    }),


    init () {
        this.controller.setConfig([
            "*"
        ]);

        this.controller.setModules([
            preload,
            grid,
            product,
            views,
            home
        ]);

        this.controller.initPage();

        this.controller.on( "page-controller-router-samepage", () => navmenu.close() );
        this.controller.on( "page-controller-router-transition-out", changePageOut );
        this.controller.on( "page-controller-router-refresh-document", changeContent );
        this.controller.on( "page-controller-router-transition-in", changePageIn );

        captureLinks();

        console.log( "router initialized" );
    }
};


const captureLinks = function () {
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
};


const onPreloadDone = function () {
    scrolls.topout( 0 );

    setTimeout(() => {
        dom.html.removeClass( "is-routing" );
        dom.page.removeClass( "is-reactive is-inactive" );

    }, _pageDuration );

    util.emitter.off( "app--preload-done", onPreloadDone );
};


const changePageOut = function () {
    navmenu.close();

    dom.html.addClass( "is-routing" );
    dom.page.removeClass( "is-reactive" ).addClass( "is-inactive" );

    util.emitter.on( "app--preload-done", onPreloadDone );
};


const changeContent = function ( html ) {
    const $doc = $( html );
    const res = $doc.filter( ".js-page" )[ 0 ].innerHTML;

    document.title = $doc.filter( "title" ).text();

    dom.page[ 0 ].innerHTML = res;
};


const changePageIn = function () {
    dom.page.addClass( "is-reactive" );
};


/******************************************************************************
 * Export
*******************************************************************************/
export default router;