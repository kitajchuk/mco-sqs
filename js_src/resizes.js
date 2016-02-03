import config from "./config";
import * as util from "./util";
import debounce from "properjs-debounce";
import throttle from "properjs-throttle";
import log from "./log";


const _throttled = 50;
const _debounced = 300;
let _isSmallOn = false;
let _isSmall = (window.innerWidth <= config.mobileWidth);


const resizes = {
    init () {
        util.resizer.on( "resize", throttle( onThrottle, _throttled ) );

        // Hook into resize of `width` only for this handler
        // @bug: iOS window size changes when Safari's chrome switches between full and minimal-ui.
        util.resizer.on( "resizewidth", debounce( onDebounce, _debounced ) );

        log( "resizes initialized" );
    },


    isSmall () {
        return _isSmall;
    }
};


const onDebounce = function () {
    util.updateImages();
};


const onThrottle = function () {
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