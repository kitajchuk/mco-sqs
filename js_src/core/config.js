import Easing from "properjs-easing";


/**
 *
 * @public
 * @namespace config
 * @memberof core
 * @description Stores app-wide config values.
 *
 */
const config = {
    /**
     *
     * @public
     * @member mobileWidth
     * @memberof core.config
     * @description The breakpoint for mobile(ish).
     *
     */
    mobileWidth: 640,


    /**
     *
     * @public
     * @member sqsMaxImgWidth
     * @memberof core.config
     * @description The max width Squarespace allows for images.
     *
     */
    sqsMaxImgWidth: 2500,


    /**
     *
     * @public
     * @member defaultEasing
     * @memberof core.config
     * @description The default easing function for javascript Tweens.
     *
     */
    defaultEasing: Easing.easeInOutCubic,


    /**
     *
     * @public
     * @member defaultDuration
     * @memberof core.config
     * @description The default duration for javascript Tweens.
     *
     */
    defaultDuration: 400,


    /**
     *
     * @public
     * @member lazyImageSelector
     * @memberof core.config
     * @description The string selector used for images deemed lazy-loadable.
     *
     */
    lazyImageSelector: ".js-lazy-image",


    /**
     *
     * @public
     * @member lazyImageAttr
     * @memberof core.config
     * @description The string attribute for lazy image source URLs.
     *
     */
    lazyImageAttr: "data-img-src",


    /**
     *
     * @public
     * @member imageLoaderAttr
     * @memberof core.config
     * @description The string attribute ImageLoader gives loaded images.
     *
     */
    imageLoaderAttr: "data-imageloader",


    /**
     *
     * @public
     * @member resizeSelector
     * @memberof core.config
     * @description The string attribute for resizing elements.
     *
     */
    resizeSelector: ".js-resize"
};



/******************************************************************************
 * Export
*******************************************************************************/
export default config;