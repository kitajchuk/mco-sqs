import dom from "./dom";
import * as util from "./util";
import config from "./config";


let $_jsHome = null;
let $_jsHomeImg = null;


const home = {
    init () {
        console.log( "home initialized" );
    },


    isActive () {
        return (this.getElements() > 0);
    },


    onload () {
        const imgSrcs = util.shuffle( $_jsHomeImg.data( "imgSrcs" ).split( "," ) );
        let imgSrc = localStorage.getItem( config.homeImageKey );
        let i = imgSrcs.length;

        if ( imgSrcs.length === 1 ) {
            imgSrc = imgSrcs[ 0 ];

        } else {
            for ( i; i--; ) {
                if ( imgSrcs[ i ] !== imgSrc ) {
                    imgSrc = imgSrcs[ i ];

                    localStorage.setItem( config.homeImageKey, imgSrc );

                    break;
                }
            }
        }

        $_jsHomeImg.attr( config.lazyImageAttr, imgSrc );

        util.loadImages( $_jsHomeImg, util.noop );
    },


    unload () {
        this.teardown();
    },


    teardown () {
        $_jsHome = null;
        $_jsHomeImg = null;
    },


    getElements () {
        $_jsHome = dom.page.find( ".js-home" );
        $_jsHomeImg = $_jsHome.find( ".js-home-image" );

        return ($_jsHome.length);
    }
};


/******************************************************************************
 * Export
*******************************************************************************/
export default home;