import config from "./config";
import * as util from "./util";


let _isSmallOn = false;
let _isSmall = (window.innerWidth <= config.mobileWidth);


const resizes = {
    init () {
        util.resizer.on( "resize", onResizer );
        util.emitter.on( "app--do-resize", onResizer );

        onResizer();

        console.log( "resizes initialized" );
    },


    isSmall () {
        return _isSmall;
    },


    teardown () {
        util.resizer.off( "resize", onResizer );
        util.emitter.off( "app--do-resize", onResizer );
    }
};


const onResizer = function () {
    util.resizeElems();

    _isSmall = (window.innerWidth <= config.mobileWidth);

    if ( _isSmall && !_isSmallOn ) {
        _isSmallOn = true;

        util.emitter.fire( "app--resize-small" );

    } else if ( !_isSmall && _isSmallOn ) {
        _isSmallOn = false;

        util.emitter.fire( "app--resize-normal" );
    }

    util.emitter.fire( "app--resize" );
};


/******************************************************************************
 * Export
*******************************************************************************/
export default resizes;