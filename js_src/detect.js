import dom from "./dom";


const detect = {
    init () {
        checkTouch();

        console.log( "detect initialized" );
    },


    isTouch () {
        return ("ontouchstart" in window) || (window.DocumentTouch && document instanceof window.DocumentTouch);
    },


    teardown () {
        dom.html.removeClass( "is-touchable is-hoverable" );
    }
};


const checkTouch = function () {
    if ( detect.isTouch() ) {
        dom.html.addClass( "is-touchable" );

    } else {
        dom.html.addClass( "is-hoverable" );
    }
};


/******************************************************************************
 * Export
*******************************************************************************/
export default detect;