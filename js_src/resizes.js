import config from "./config";
import * as util from "./util";
import debounce from "properjs-debounce";


let _isSmallOn = false;
let _isSmall = (window.innerWidth <= config.mobileWidth);


const resizes = {
    init () {
        util.resizer.on( "resize", onResizer );
        util.resizer.on( "resize", onDebounced );
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


const onDebounced = debounce(function () {
    util.resizeElems();
    util.updateImages();

}, 300 );


const onResizer = function () {
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