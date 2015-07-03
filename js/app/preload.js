/*!
 *
 * App Controller: preload
 *
 * A nice description of what this controller does...
 *
 *
 */
import "app/dom";
import { easeDuration } from "app/config";
import { noop, loadImages, emitter, isImageLoadable } from "app/util";


var $_images = null,
    $_visible = null,

    _isActive = false,
    _imgLoader = null,


/**
 *
 * @public
 *
 */
preload = {
    init: function () {
        console.log( "preload initialized" );
    },


    isActive: noop,


    isLoaded: noop,


    onload: function () {
        this.doPreload();
    },


    unload: function () {
        $_images = null;
        $_visible = null;

        _imgLoader = null;
    },


    triggerEvents: function () {
        emitter.fire( "app--do-scroll" );
        emitter.fire( "app--do-resize" );
    },


    doPreload: function ( $images, callback ) {
        $_images = ($images || dom.page.find( ".js-lazy-image" ));
        $_visible = $( [] );

        for ( var i = 0, len = $_images.length; i < len; i++ ) {
            if ( isImageLoadable( $_images[ i ] ) ) {
                $_visible.push( $_images[ i ] );
            }
        }

        //console.log( $_visible.length, "vs", $_images.length );

        if ( !$_visible.length ) {
            delayedLoad( callback );

        } else {
            _imgLoader = loadImages( $_visible, noop );
            _imgLoader.on( "done", function () {
                delayedLoad( callback );
            });
        }
    }
},


/**
 *
 * @private
 *
 */
delayedLoad = function ( callback ) {
    var $notVisible = $_images.not( $_visible );

    if ( $notVisible.length ) {
        _imgLoader = null;
        _imgLoader = loadImages( $notVisible, isImageLoadable );
        _imgLoader.on( "done", function () {
            console.log( "lazyloaded " + $notVisible.length + " images" );
        });
    }

    console.log( "preloaded " + $_visible.length + " images" );

    emitter.fire( "app--preload" );

    if ( $.isFunction( callback ) ) {
        callback();
    }

    if ( !_isActive ) {
        _isActive = true;

        setTimeout(function () {
            dom.body.addClass( "is-active" );

        }, easeDuration );
    }
};


/******************************************************************************
 * Export
*******************************************************************************/
export default preload;