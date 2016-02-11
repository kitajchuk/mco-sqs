import dom from "./dom";
import log from "./log";


/**
 *
 * @public
 * @namespace detect
 * @memberof core
 * @description Handles basic detection of touch devices.
 *
 */
const detect = {
    /**
     *
     * @public
     * @method init
     * @memberof core.detect
     * @description Initializes the detect module.
     *
     */
    init () {
        this._isTouch = (("ontouchstart" in window) || (window.DocumentTouch && document instanceof window.DocumentTouch));
        this._isMobile = (/Android|BlackBerry|iPhone|iPad|iPod|IEMobile|Opera Mini/gi.test( window.navigator.userAgent ));
        this._isSurface = ("onmouseover" in document) && (/Windows NT/.test( window.navigator.userAgent ) && /Touch/.test( window.navigator.userAgent ));

        // iOS Standalone mode
        if ( "standalone" in window ) {
            dom.html.addClass( "is-standalone" );
        }

        // Windows Surface mode
        if ( this._isSurface ) {
            dom.html.addClass( "is-surface" );
        }

        // Touch support mode
        if ( this._isTouch ) {
            dom.html.addClass( "is-touchable" );

        // Mouse support mode
        } else {
            dom.html.addClass( "is-hoverable" );
        }

        // IE 10 Specific cruft
        // @issue #24: https://github.com/Instrument/instrument-sqs-v2/issues/24
        if ( /MSIE 10\.0/.test( window.navigator.userAgent ) ) {
            dom.html.addClass( "is-ie-10" );
        }

        log( "detect initialized" );
    },


    /**
     *
     * @public
     * @method isMobile
     * @memberof core.detect
     * @description Check for high-end mobile device user agents.
     * @returns {boolean}
     *
     */
    isMobile () {
        return this._isMobile;
    },


    /**
     *
     * @public
     * @method isTouch
     * @memberof core.detect
     * @description Check whether this is a touch device or not.
     * [See Modernizr]{@link https://github.com/Modernizr/Modernizr/blob/master/feature-detects/touchevents.js}
     * @returns {boolean}
     *
     */
    isTouch () {
        return this._isTouch;
    },


    /**
     *
     * @public
     * @method isDevice
     * @memberof core.detect
     * @description Must be `isMobile` and `isTouch`.
     * @returns {boolean}
     *
     */
    isDevice () {
        return (this._isTouch && this._isMobile);
    },


    /**
     *
     * @public
     * @method isStandalone
     * @memberof core.detect
     * @description Must be window.standalone.
     * @returns {boolean}
     *
     */
    isStandalone () {
        return this._isStandalone;
    }
};



/******************************************************************************
 * Export
*******************************************************************************/
export default detect;