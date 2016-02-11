import $ from "js_libs/jquery/dist/jquery";


/**
 *
 * @public
 * @namespace dom
 * @memberof core
 * @description Holds high-level cached Nodes.
 *
 */
const dom = {
    /**
     *
     * @public
     * @member doc
     * @memberof core.dom
     * @description The cached document node.
     *
     */
    doc: $( document ),


    /**
     *
     * @public
     * @member html
     * @memberof core.dom
     * @description The cached documentElement node.
     *
     */
    html: $( document.documentElement ),


    /**
     *
     * @public
     * @member body
     * @memberof core.dom
     * @description The cached body node.
     *
     */
    body: $( document.body ),


    /**
     *
     * @public
     * @member page
     * @memberof core.dom
     * @description The cached page container node.
     *
     */
    page: $( ".js-page" ),


    /**
     *
     * @public
     * @member footerbar
     * @memberof core.dom
     * @description The cached footerbar node.
     *
     */
    footerbar: $( ".js-footerbar" ),


    /**
     *
     * @public
     * @member navbar
     * @memberof core.dom
     * @description The cached navbar node.
     *
     */
    navbar: $( ".js-navbar" ),


    /**
     *
     * @public
     * @member navmenu
     * @memberof core.dom
     * @description The cached navmenu node.
     *
     */
    navmenu: $( ".js-navmenu" )
};



/******************************************************************************
 * Export
*******************************************************************************/
export default dom;