/*!
 *
 * App Controller: resizes
 *
 * A nice description of what this controller does...
 *
 *
 */
import "app/config";
import { emitter, resizer, resizeElems } from "app/util";


var _isSmallOn = false,
    _isSmall = (window.innerWidth <= config.mobileWidth),


/**
 *
 * @public
 *
 */
resizes = {
    init: function () {
        resizer.on( "resize", onResizer );
        emitter.on( "app--do-resize", onResizer );

        onResizer();

        console.log( "resizes initialized" );
    },


    isSmall: function () {
        return _isSmall;
    },


    teardown: function () {
        resizer.off( "resize", onResizer );
        emitter.off( "app--do-resize", onResizer );
    }
},


/**
 *
 * @private
 *
 */
onResizer = function () {
    resizeElems();

    _isSmall = (window.innerWidth <= config.mobileWidth);

    if ( _isSmall && !_isSmallOn ) {
        _isSmallOn = true;

        emitter.fire( "app--resize-small" );

    } else if ( !_isSmall && _isSmallOn ) {
        _isSmallOn = false;

        emitter.fire( "app--resize-normal" );
    }

    emitter.fire( "app--resize" );
};


/******************************************************************************
 * Export
*******************************************************************************/
export default resizes;