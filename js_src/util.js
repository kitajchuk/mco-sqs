import $ from "js_libs/jquery/dist/jquery";
import dom from "./dom";
import config from "./config";
import Hammer from "hammerjs";
import Controller from "properjs-controller";
import ScrollController from "properjs-scrollcontroller";
import ResizeController from "properjs-resizecontroller";
import ImageLoader from "properjs-imageloader";


const preNoop = function ( e ) {
    e.preventDefault();
    return false;
};


const px = function ( str ) {
    return `${str}px`;
};


const translate3d = function ( el, x, y, z ) {
    el.style[ Hammer.prefixed( el.style, "transform" ) ] = `translate3d( ${x}, ${y}, ${z} )`;
};


const emitter = new Controller();


const scroller = new ScrollController();


const resizer = new ResizeController();


const isElementLoadable = function ( el ) {
    const bounds = el.getBoundingClientRect();

    return ( bounds.top < (window.innerHeight * 2) );
};


const isElementInViewport = function ( el ) {
    const bounds = el.getBoundingClientRect();

    return ( bounds.top < window.innerHeight && bounds.bottom > 0 );
};


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


const updateImages = function () {
/*
    const $loaded = $( "[data-imageloader]" );

    $loaded.removeAttr( "data-imageloader" );

    loadImages( $loaded, noop );
*/
};


const loadImages = function ( images, handler, useVariant ) {
    const map = function ( vnt ) {
        return parseInt( vnt, 10 );
    };
    let $img = null;
    let data = null;
    let vars = null;
    let width = null;
    let variant = null;
    let i = null;

    // Normalize the handler
    handler = (handler || isElementLoadable);

    // Normalize the images
    images = (images || $( config.lazyImageSelector ));

    // Normalize the `useVariant` flag
    useVariant = (useVariant || false);

    // Get the right size image from Squarespace
    // http://developers.squarespace.com/using-the-imageloader/
    // Depending on the original upload size, we have these variants
    // {original, 1500w, 1000w, 750w, 500w, 300w, 100w}
    i = images.length;

    for ( i; i--; ) {
        $img = images.eq( i );
        data = $img.data();
        width = ($img.parent()[ 0 ].clientWidth || config.sqsMaxImgWidth);

        if ( useVariant && data.variants ) {
            vars = data.variants.split( "," ).map( map );
            variant = getClosestValue( vars, width );

            $img.attr( config.lazyImageAttr, `${data.imgSrc}?format=${variant}w` );

        } else {
            $img.attr( config.lazyImageAttr, `${data.imgSrc}?format=original` );
        }
    }

    return new ImageLoader({
        elements: images,
        property: config.lazyImageAttr,
        transitionDelay: 0

    }).on( "data", handler );
};


const disableMouseWheel = function ( enable ) {
    if ( enable ) {
        dom.doc.on( "DOMMouseScroll mousewheel", preNoop );

    } else {
        dom.doc.off( "DOMMouseScroll mousewheel" );
    }
};


const disableTouchMove = function ( enable ) {
    if ( enable ) {
        dom.doc.on( "touchmove", preNoop );

    } else {
        dom.doc.off( "touchmove" );
    }
};


const resizeElems = function ( elems ) {
    elems = (elems || $( config.resizeSelector ));

    let i = elems.length;

    for ( i; i--; ) {
        const data = elems[ i ].dataset;

        if ( data.resize === "square" ) {
            elems[ i ].style.height = px( elems[ i ].clientWidth );
        }

        if ( data.resize === "blog-image" ) {
            if ( elems[ i ].naturalHeight > elems[ i ].naturalWidth ) {
                elems[ i ].style.height = px( elems.eq( i ).closest( ".js-blog-item" )[ 0 ].clientHeight * 0.8 );
                elems[ i ].style.width = "auto";

            } else {
                elems[ i ].style.height = "auto";
                elems[ i ].style.width = "100%";
            }
        }
    }
};


const getTransitionDuration = function ( el ) {
    if ( !el ) {
        return 0;
    }

    const duration = getComputedStyle( el )[ Hammer.prefixed( el.style, "transition-duration" ) ];
    const isSeconds = duration.indexOf( "ms" ) === -1;
    const multiplyBy = isSeconds ? 1000 : 1;

    return parseFloat( duration ) * multiplyBy;
};


const noop = function () {
    return true;
};


const shuffle = function ( array ) {
    let i = array.length - 1;

    for ( i; i > 0; i-- ) {
        const j = Math.floor( Math.random() * (i + 1) );
        const temp = array[ i ];

        array[ i ] = array[ j ];
        array[ j ] = temp;
    }

    return array;
};


const random = function ( min, max ) {
    return Math.floor( Math.random() * (max - min + 1) ) + min;
};


/******************************************************************************
 * Export
*******************************************************************************/
export {
    // Classes
    emitter,
    scroller,
    resizer,

    // Loading
    loadImages,
    updateImages,
    isElementLoadable,
    isElementInViewport,

    // Disabling
    disableMouseWheel,
    disableTouchMove,

    // Random
    px,
    noop,
    random,
    shuffle,
    resizeElems,
    translate3d,
    getTransitionDuration
};