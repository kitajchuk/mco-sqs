/*!
 *
 * App Controller: resizes
 *
 * A nice description of what this controller does...
 *
 *
 */
import { emitter, resizer, resizeElems } from "app/util";


/**
 *
 * @public
 *
 */
var resizes = {
    init: function () {
        resizer.on( "resize", onResizer );
        emitter.on( "app--do-resize", onResizer );

        onResizer();

        console.log( "resizes initialized" );
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

    emitter.fire( "app--resize" );
};


/******************************************************************************
 * Export
*******************************************************************************/
export default resizes;