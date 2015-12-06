import dom from "./dom";
import * as util from "./util";
import config from "./config";


let $_images = null;
let $_visible = null;
let _imgLoader = null;


/**
 *
 * @public
 * @module preload
 * @description Handles separation of image pre-loading and image lazy-loading.
 *
 */
const preload = {
    /**
     *
     * @public
     * @method init
     * @memberof preload
     * @description Method runs once when window loads.
     *
     */
    init () {
        console.log( "preload initialized" );

        util.emitter.on( "app--pushed-route", this.doPreload );
    },


    /**
     *
     * @public
     * @method isActive
     * @memberof preload
     * @description Method informs PageController of active status.
     * @returns {boolean}
     *
     */
    isActive: util.noop,


    /**
     *
     * @public
     * @method onload
     * @memberof preload
     * @description Method performs onloading actions for this module.
     *
     */
    onload () {
        this.doPreload();
    },


    /**
     *
     * @public
     * @method unload
     * @memberof preload
     * @description Method performs unloading actions for this module.
     *
     */
    unload () {
        $_images = null;
        $_visible = null;

        _imgLoader = null;
    },


    /**
     *
     * @public
     * @method doPreload
     * @memberof preload
     * @param {object} $images Optionally, the image collection to load
     * @param {function} callback Optionally, a callback to fire when loading is done
     * @description Method handles separation of pre-load and lazy-load.
     *
     */
    doPreload ( $images, callback ) {
        $_images = ($images || dom.page.find( config.lazyImageSelector ));
        $_visible = util.getElementsInView( $_images );

        let done = 0;

        if ( !$_visible.length ) {
            delayedLoad( callback );

        } else {
            console.log( "preload will load", $_visible.length, "out of", $_images.length, "images" );

            _imgLoader = util.loadImages( $_visible, () => {
                done++;

                util.emitter.fire( "app--preload-data", {
                    total: $_visible.length,
                    done
                });

                return true;

            }, true );
            _imgLoader
                .on( "load", onImageLoad )
                .on( "done", () => {
                    console.log( "preloaded", $_visible.length, "images" );

                    delayedLoad( callback );
                });
        }
    }
};


/**
 *
 * @private
 * @method onImageLoad
 * @memberof preload
 * @param {element} img The image node
 * @description Apply `orientation` classNames to images.
 *
 */
const onImageLoad = function ( img ) {
    if ( img.naturalHeight > img.naturalWidth ) {
        img.className += " image--portrait";

    } else {
        img.className += " image--landscape";
    }
};


/**
 *
 * @private
 * @method delayedLoad
 * @memberof preload
 * @param {function} callback Optionally, a callback to fire when loading is done
 * @description Method performs the delayed, or lazy-load, loading sequence.
 *
 */
const delayedLoad = function ( callback ) {
    const $notVisible = $_images.not( $_visible );

    if ( $notVisible.length ) {
        _imgLoader = null;
        _imgLoader = util.loadImages( $notVisible, util.isElementLoadable, true );
        _imgLoader
            .on( "load", onImageLoad )
            .on( "done", () => console.log( "lazyloaded", $notVisible.length, "images" ) );
    }

    util.emitter.fire( "app--preload-done" );

    if ( typeof callback === "function" ) {
        callback();
    }
};



/******************************************************************************
 * Export
*******************************************************************************/
export default preload;