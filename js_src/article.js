import dom from "./dom";
import sqs from "squarespace-yui-block-initializers";


let $_jsElement = null;


/**
 *
 * @public
 * @module article
 * @description This module is a stub for right now.
 *
 */
const article = {
    /**
     *
     * @public
     * @method init
     * @memberof article
     * @description Method runs once when window loads.
     *
     */
    init () {
        console.log( "article initialized" );
    },


    /**
     *
     * @public
     * @method isActive
     * @memberof article
     * @description Method informs PageController of active status.
     * @returns {boolean}
     *
     */
    isActive () {
        return (this.getElements() > 0);
    },


    /**
     *
     * @public
     * @method onload
     * @memberof article
     * @description Method performs onloading actions for this module.
     *
     */
    onload () {
        sqs.initGallery();
        sqs.initVideo();
        sqs.initAudio();

        dom.html.addClass( "is-article-detail" );
    },


    /**
     *
     * @public
     * @method unload
     * @memberof article
     * @description Method performs unloading actions for this module.
     *
     */
    unload () {
        this.teardown();
    },


    /**
     *
     * @public
     * @method teardown
     * @memberof article
     * @description Method performs cleanup after this module. Remmoves events, null vars etc...
     *
     */
    teardown () {
        $_jsElement = null;

        dom.html.removeClass( "is-article-detail" );
    },


    /**
     *
     * @public
     * @method getElements
     * @memberof article
     * @description Method queries DOM for this modules node.
     * @returns {number}
     *
     */
    getElements () {
        $_jsElement = dom.page.find( ".js-article" );

        return ( $_jsElement.length );
    }
};


/******************************************************************************
 * Export
*******************************************************************************/
export default article;