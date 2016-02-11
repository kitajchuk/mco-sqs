/**
 *
 * @public
 * @namespace env
 * @memberof core
 * @description Set the app environment.
 *
 */
const env = {
    /**
     *
     * @member DEV
     * @memberof core.env
     * @description The `production` development ref.
     *
     */
    DEV: "development",


    /**
     *
     * @member PROD
     * @memberof core.env
     * @description The `production` environment ref.
     *
     */
    PROD: "production",


    /**
     *
     * @method get
     * @memberof core.env
     * @description Returns the active code `environment`.
     * @returns {boolean}
     *
     */
    get () {
        return (/^localhost|squarespace\.com$|^[0-9]{0,3}\.[0-9]{0,3}\.[0-9]{0,3}\.[0-9]{0,3}/g.test( document.domain ) ? this.DEV : this.PROD);
    },


    /**
     *
     * @method isConfig
     * @memberof core.env
     * @description Determine whether we are in Squarespace /config land or not.
     * @returns {boolean}
     *
     */
    isConfig () {
        return (window.parent.location.pathname.indexOf( "/config" ) !== -1);
    }
};



/******************************************************************************
 * Export
*******************************************************************************/
export default env;