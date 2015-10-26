import "app/dom";
import "app/util";
import "app/config";


var $_jsHome = null,
    $_jsHomeImg = null,


/**
 *
 * @public
 * @namespace app.home
 * @memberof app.
 * @description A nice description of what this module does...
 *
 */
home = {
    /**
     *
     * @public
     * @method init
     * @memberof app.home
     * @description Method runs once when window loads.
     *
     */
    init: function () {
        console.log( "home initialized" );
    },


    /**
     *
     * @public
     * @method isActive
     * @memberof app.home
     * @description Method informs PageController of active status.
     * @returns {boolean}
     *
     */
    isActive: function () {
        return (this.getElements() > 0);
    },


    /**
     *
     * @public
     * @method onload
     * @memberof app.home
     * @description Method performs onloading actions for this module.
     *
     */
    onload: function () {
        var imgSrcs = util.shuffle( $_jsHomeImg.data( "imgSrcs" ).split( "|" ) ),
            imgSrc = localStorage.getItem( "mco--home-image" ),
            i = imgSrcs.length;

        for ( i; i--; ) {
            if ( imgSrcs[ i ] !== imgSrc ) {
                imgSrc = imgSrcs[ i ];

                $_jsHomeImg.attr( "data-img-src", imgSrc );

                localStorage.setItem( "mco--home-image", imgSrc );

                break;
            }
        }

        util.loadImages( $_jsHomeImg, util.noop ).on( "done", function () {
            console.log( "home image loaded" );
        });
    },


    /**
     *
     * @public
     * @method unload
     * @memberof app.home
     * @description Method performs unloading actions for this module.
     *
     */
    unload: function () {
        this.teardown();
    },


    /**
     *
     * @public
     * @method teardown
     * @memberof app.home
     * @description Method performs cleanup after this module. Remmoves events, null vars etc...
     *
     */
    teardown: function () {
        $_jsHome = null;
        $_jsHomeImg = null;
    },


    getElements: function () {
        $_jsHome = dom.page.find( ".js-home" );
        $_jsHomeImg = $_jsHome.find( ".js-home-image" );

        return ($_jsHome.length);
    }
};


/*
imgSrcs = null,
imgSrc = null,
$img = null,
            

if ( /js-random-image/.test( $_images[ i ].className ) ) {
    $img = $_images.eq( i );

    imgSrcs = $img.data( "imgSrcs" ).split( "|" );
    imgSrc = imgSrcs[ random( 0, (imgSrcs.length - 1) ) ];

    console.log( imgSrc );

    $img.attr( "data-img-src", imgSrc );
}
*/


/******************************************************************************
 * Export
*******************************************************************************/
export default home;