/**
 *
 * @public
 * @namespace util
 * @memberof core
 * @description Houses app-wide utility methods.
 *
 */


import $ from "js_libs/jquery/dist/jquery";
import Hammer from "hammerjs";
import ImageLoader from "properjs-imageloader";
import dom from "./dom";
import config from "./config";
import detect from "./detect";


/**
 *
 * @description Noop a preventDefault() for event handlers
 * @method preNoop
 * @memberof core.util
 * @param {object} e The event object
 * @returns {boolean}
 *
 */
const preNoop = function ( e ) {
    e.preventDefault();
    return false;
};


/**
 *
 * @description Add pixel units when inline styling
 * @method px
 * @param {string} str The value to pixel-ify
 * @memberof core.util
 * @returns {string}
 *
 */
const px = function ( str ) {
    return `${str}px`;
};


/**
 *
 * @description Apply a translate3d transform
 * @method translate3d
 * @param {object} el The element to transform
 * @param {string|number} x The x value
 * @param {string|number} y The y value
 * @param {string|number} z The z value
 * @memberof core.util
 *
 */
const translate3d = function ( el, x, y, z ) {
    el.style[ Hammer.prefixed( el.style, "transform" ) ] = `translate3d( ${x}, ${y}, ${z} )`;
};


/**
 *
 * @description Module onImageLoadHander method, handles event
 * @method isElementLoadable
 * @param {object} el The DOMElement to check the offset of
 * @memberof core.util
 * @returns {boolean}
 *
 */
const isElementLoadable = function ( el ) {
    if ( el ) {
        const bounds = el.getBoundingClientRect();

        return ( bounds.top < (window.innerHeight * 2) );
    }
};


/**
 *
 * @description Module isElementVisibleVert method, handles element boundaries
 * @method isElementVisibleVert
 * @param {object} el The DOMElement to check the offsets of
 * @memberof core.util
 * @returns {boolean}
 *
 */
const isElementVisibleVert = function ( el ) {
    if ( el ) {
        const bounds = el.getBoundingClientRect();

        return ( bounds.top < window.innerHeight && bounds.bottom > 0 );
    }
};


/**
 *
 * @description Module isElementVisibleHorz method, handles element boundaries
 * @method isElementVisibleHorz
 * @param {object} el The DOMElement to check the offsets of
 * @memberof core.util
 * @returns {boolean}
 *
 */
const isElementVisibleHorz = function ( el ) {
    if ( el ) {
        const bounds = el.getBoundingClientRect();

        return ( bounds.left < window.innerWidth && bounds.right > 0 );
    }
};


/**
 *
 * @method getClosestValue
 * @memberof core.util
 * @param {array} arr The array to process
 * @param {number} closestTo The number to get close to
 * @description Get closest number value without going under
 * @returns {number}
 *
 */
const getClosestValue = function ( arr, closestTo ) {
    // Get the highest number in arr in case it matches nothing.
    let close = Math.max.apply( null, arr );
    let i = arr.length;

    for ( i; i--; ) {
        // Check if it's higher than your number, but lower than your closest value
        if ( arr[ i ] >= closestTo && arr[ i ] < close ) {
            close = arr[ i ];
        }
    }

    return close;
};


/**
 *
 * @description Update images that have already been loaded
 * @method updateImages
 * @param {jQuery} images The optional argument passed collection to reload
 * @memberof core.util
 *
 */
const updateImages = function ( images ) {
    images = (images || $( `[${config.imageLoaderAttr}]` ));

    if ( images.length ) {
        images.removeAttr( config.imageLoaderAttr );

        loadImages( images, noop );
    }
};


/**
 *
 * @private
 * @method onImageLoadHandler
 * @memberof core.util
 * @param {element} image The image element that was just loaded
 * @description Method Handles the `load` event from ImageLoader.
 *
 */
const onImageLoadHandler = function ( image ) {
    if ( image.naturalHeight > image.naturalWidth ) {
        image.className += " image--portrait";

    } else {
        image.className += " image--landscape";
    }
};


/**
 *
 * @description Fresh query to lazyload images on page
 * @method loadImages
 * @param {object} images Optional collection of images to load
 * @param {function} handler Optional handler for load conditions
 * @param {boolean} useVariant Optional flag to skip loading size variants
 * @memberof core.util
 * @returns {ImageLoader}
 *
 */
const loadImages = function ( images, handler, useVariant ) {
    const rQuery = /\?(.*)$/;
    const map = function ( vnt ) {
        return parseInt( vnt, 10 );
    };
    let $img = null;
    let data = null;
    let vars = null;
    let width = null;
    let variant = null;
    let source = null;
    let i = null;

    // Normalize the handler
    handler = (handler || isElementLoadable);

    // Normalize the images
    images = (images || $( config.lazyImageSelector ));

    // Normalize the `useVariant` flag
    if ( !useVariant && useVariant !== false ) {
        useVariant = true;
    }

    // Get the right size image from Squarespace
    // http://developers.squarespace.com/using-the-imageloader/
    // Depending on the original upload size, we have these variants
    // {original, 1500w, 1000w, 750w, 500w, 300w, 100w}
    i = images.length;

    for ( i; i--; ) {
        $img = images.eq( i );
        data = $img.data();
        width = ($img.parent()[ 0 ].clientWidth || window.innerWidth || config.sqsMaxImgWidth);
        source = data.imgSrc.replace( rQuery, "" );

        if ( useVariant && data.variants ) {
            vars = data.variants.split( "," ).map( map );
            variant = getClosestValue( vars, width );

            // If the pixel density is higher, use a larger image ?
            if ( window.devicePixelRatio > 1 ) {
                // Splice off the variant that was matched
                vars.splice( vars.indexOf( variant, 1 ) );

                // Apply the new, larger variant as the format
                variant = getClosestValue( vars, variant );
            }

            $img.attr( config.lazyImageAttr, `${source}?format=${variant}w` );

        } else {
            $img.attr( config.lazyImageAttr, `${source}?format=original` );
        }
    }

    return new ImageLoader({
        elements: images,
        property: config.lazyImageAttr,
        transitionDelay: 0

    }).on( "data", handler ).on( "load", onImageLoadHandler );
};


/**
 *
 * @description Toggle on/off scrollability
 * @method disableMouseWheel
 * @param {boolean} enable Flag to enable/disable
 * @memberof core.util
 *
 */
const disableMouseWheel = function ( enable ) {
    if ( enable ) {
        dom.doc.on( "DOMMouseScroll mousewheel", preNoop );

    } else {
        dom.doc.off( "DOMMouseScroll mousewheel" );
    }
};


/**
 *
 * @description Toggle on/off touch movement
 * @method disableTouchMove
 * @param {boolean} enable Flag to enable/disable
 * @memberof core.util
 *
 */
const disableTouchMove = function ( enable ) {
    if ( enable ) {
        dom.doc.on( "touchmove", preNoop );

    } else {
        dom.doc.off( "touchmove" );
    }
};


/**
 *
 * @description Get the applied transition duration from CSS
 * @method getTransitionDuration
 * @param {object} el The DOMElement
 * @memberof core.util
 * @returns {number}
 *
 */
const getTransitionDuration = function ( el ) {
    let ret = 0;
    let duration = null;
    let isSeconds = false;
    let multiplyBy = 1000;

    if ( el ) {
        duration = getComputedStyle( el )[ Hammer.prefixed( el.style, "transition-duration" ) ];
        isSeconds = String( duration ).indexOf( "ms" ) === -1;
        multiplyBy = isSeconds ? 1000 : 1;

        ret = parseFloat( duration ) * multiplyBy;
    }

    return ret;
};


/**
 *
 * @description All true all the time
 * @method noop
 * @memberof core.util
 * @returns {boolean}
 *
 */
const noop = function () {
    return true;
};


/**
 *
 * @description Randomize array element order in-place.
 * Using Fisher-Yates shuffle algorithm.
 * @method shuffle
 * @param {object} arr The array to shuffle
 * @memberof core.util
 * @returns {array}
 *
 */
const shuffle = function ( arr ) {
    let i = arr.length - 1;
    let j = 0;
    let temp = arr[ i ];

    for ( i; i > 0; i-- ) {
        j = Math.floor( Math.random() * (i + 1) );
        temp = arr[ i ];

        arr[ i ] = arr[ j ];
        arr[ j ] = temp;
    }

    return arr;
};


/**
 *
 * @method getDefaultHammerOptions
 * @memberof core.util
 * @description The default options for Hammer JS.
 *              Disables cssProps for non-touch experiences.
 * @returns {object}
 *
 */
const getDefaultHammerOptions = function () {
    return detect.isDevice() ? {} : {
        cssProps: {
            contentZoomingString: false,
            tapHighlightColorString: false,
            touchCalloutString: false,
            touchSelectString: false,
            userDragString: false,
            userSelectString: false
        }
    };
};


/**
 *
 * @public
 * @method getPageKey
 * @memberof util
 * @description Determine the key for local page cache storage.
 * @returns {string}
 *
 */
const getPageKey = function () {
    return ((window.location.pathname === "/" ? "homepage" : window.location.pathname) + window.location.search);
};


/**
 *
 * @method getElementsInView
 * @memberof core.util
 * @param {jQuery} $nodes The collection to process
 * @param {function} executor Optional method to determin `in view`
 * @description Get elements within a loadable position on the page
 * @returns {jQuery}
 *
 */
const getElementsInView = function ( $nodes, executor ) {
    let i = $nodes.length;
    const $ret = $( [] );

    executor = (executor || isElementLoadable);

    for ( i; i--; ) {
        if ( executor( $nodes[ i ] ) ) {
            $ret.push( $nodes[ i ] );
        }
    }

    return $ret;
};


const fixTitle = function ( titleEl ) {
    const title = titleEl.innerHTML.split( " " );
    const top = title.slice( 0, title.length - 2 );
    const bot = title.slice( title.length - 2, title.length );

    titleEl.innerHTML = `${top.join( "&nbsp;" )}<br />${bot.join( "&nbsp;" )}`;
};



/******************************************************************************
 * Export
*******************************************************************************/
export default {
    // Loading
    loadImages,
    updateImages,
    isElementLoadable,
    isElementVisibleVert,
    isElementVisibleHorz,
    getElementsInView,

    // Disabling
    disableMouseWheel,
    disableTouchMove,

    // Random
    px,
    noop,
    shuffle,
    translate3d,
    getTransitionDuration,
    getDefaultHammerOptions,
    getPageKey,
    fixTitle
};