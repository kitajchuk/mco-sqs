/*!
 *
 * ProperJS Javascript
 * @author: kitajchuk
 * @url: http://blkpdx.com
 * @git: https://github.com/ProperJS
 *
 *
 * The MIT License (MIT)
 * 
 * Copyright (c) 2014 Brandon Lee Kitajchuk
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 *
 */
(function ( window ) {

    var _modules = {};

    window.require = function ( key ) {
        var module = _modules[ key ] || window[ key ];

        if ( !module ) {
            throw new Error( "Module " + key + " is not defined." );
        }

        return module;
    };

    window.provide = function ( key, val ) {
        if ( !window[ key ] ) {
            window[ key ] = val
        }

        return (_modules[ key ] = val);
    };

})( window );
/*!
 *
 * Adapted from https://gist.github.com/paulirish/1579671 which derived from 
 * http://paulirish.com/2011/requestanimationframe-for-smart-animating/
 * http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating
 * 
 * requestAnimationFrame polyfill by Erik Möller.
 * Fixes from Paul Irish, Tino Zijdel, Andrew Mao, Klemen Slavič, Darius Bacon
 * 
 * MIT license
 *
 * @raf
 *
 */
(function ( window ) {

"use strict";

if ( !Date.now ) {
    Date.now = function () {
        return new Date().getTime();
    };
}

(function() {
    var vendors = ["webkit", "moz", "ms", "o"];

    for ( var i = 0; i < vendors.length && !window.requestAnimationFrame; ++i ) {
        var vp = vendors[i];
        window.requestAnimationFrame = window[vp + "RequestAnimationFrame"];
        window.cancelAnimationFrame = (window[vp + "CancelAnimationFrame"] || window[vp + "CancelRequestAnimationFrame"]);
    }

    if ( /iP(ad|hone|od).*OS 6/.test( window.navigator.userAgent ) || !window.requestAnimationFrame || !window.cancelAnimationFrame ) {
        var lastTime = 0;

        window.requestAnimationFrame = function ( callback ) {
            var now = Date.now(),
                nextTime = Math.max( lastTime + 16, now );

            return setTimeout(function() {
                callback( lastTime = nextTime );

            }, (nextTime - now) );
        };

        window.cancelAnimationFrame = clearTimeout;
    }

    // Expose
    window.raf = window.requestAnimationFrame;
    window.caf = window.cancelAnimationFrame;
}());

})( window );
/*!
 *
 * Event / Animation cycle manager
 *
 * @Controller
 * @author: kitajchuk
 *
 *
 */
(function ( window, undefined ) {


//"use strict";


// Private animation functions
var raf = window.requestAnimationFrame,
    caf = window.cancelAnimationFrame;


/**
 *
 * Event / Animation cycle manager
 * @constructor Controller
 * @requires raf
 * @memberof! <global>
 *
 */
var Controller = function () {
    return this.init.apply( this, arguments );
};

Controller.prototype = {
    constructor: Controller,

    /**
     *
     * Controller constructor method
     * @memberof Controller
     * @method Controller.init
     *
     */
    init: function () {
        /**
         *
         * Controller event handlers object
         * @memberof Controller
         * @member _handlers
         * @private
         *
         */
        this._handlers = {};

        /**
         *
         * Controller unique ID
         * @memberof Controller
         * @member _uid
         * @private
         *
         */
        this._uid = 0;

        /**
         *
         * Started iteration flag
         * @memberof Controller
         * @member _started
         * @private
         *
         */
        this._started = false;

        /**
         *
         * Paused flag
         * @memberof Controller
         * @member _paused
         * @private
         *
         */
        this._paused = false;

        /**
         *
         * Timeout reference
         * @memberof Controller
         * @member _cycle
         * @private
         *
         */
        this._cycle = null;
    },

    /**
     *
     * Controller go method to start frames
     * @memberof Controller
     * @method go
     *
     */
    go: function ( fn ) {
        if ( this._started && this._cycle ) {
            return this;
        }

        this._started = true;

        var self = this,
            anim = function () {
                self._cycle = raf( anim );

                if ( self._started ) {
                    if ( typeof fn === "function" ) {
                        fn();
                    }
                }
            };

        anim();
    },

    /**
     *
     * Pause the cycle
     * @memberof Controller
     * @method pause
     *
     */
    pause: function () {
        this._paused = true;

        return this;
    },

    /**
     *
     * Play the cycle
     * @memberof Controller
     * @method play
     *
     */
    play: function () {
        this._paused = false;

        return this;
    },

    /**
     *
     * Stop the cycle
     * @memberof Controller
     * @method stop
     *
     */
    stop: function () {
        caf( this._cycle );

        this._paused = false;
        this._started = false;
        this._cycle = null;

        return this;
    },

    /**
     *
     * Controller add event handler
     * @memberof Controller
     * @method on
     * @param {string} event the event to listen for
     * @param {function} handler the handler to call
     *
     */
    on: function ( event, handler ) {
        var events = event.split( " " );

        // One unique ID per handler
        handler._jsControllerID = this.getUID();

        for ( var i = events.length; i--; ) {
            if ( typeof handler === "function" ) {
                if ( !this._handlers[ events[ i ] ] ) {
                    this._handlers[ events[ i ] ] = [];
                }

                // Handler can be stored with multiple events
                this._handlers[ events[ i ] ].push( handler );
            }
        }

        return this;
    },

    /**
     *
     * Controller remove event handler
     * @memberof Controller
     * @method off
     * @param {string} event the event to remove handler for
     * @param {function} handler the handler to remove
     *
     */
    off: function ( event, handler ) {
        if ( !this._handlers[ event ] ) {
            return this;
        }

        // Remove a single handler
        if ( handler ) {
            this._off( event, handler );

        // Remove all handlers for event
        } else {
            this._offed( event );
        }

        return this;
    },

    /**
     *
     * Controller fire an event
     * @memberof Controller
     * @method fire
     * @param {string} event the event to fire
     *
     */
    fire: function ( event ) {
        if ( !this._handlers[ event ] ) {
            return this;
        }

        var args = [].slice.call( arguments, 1 );

        for ( var i = this._handlers[ event ].length; i--; ) {
            this._handlers[ event ][ i ].apply( this, args );
        }

        return this;
    },

    /**
     *
     * Get a unique ID
     * @memberof Controller
     * @method getUID
     * @returns number
     *
     */
    getUID: function () {
        this._uid = (this._uid + 1);

        return this._uid;
    },

    /**
     *
     * Controller internal off method assumes event AND handler are good
     * @memberof Controller
     * @method _off
     * @param {string} event the event to remove handler for
     * @param {function} handler the handler to remove
     * @private
     *
     */
    _off: function ( event, handler ) {
        for ( var i = 0, len = this._handlers[ event ].length; i < len; i++ ) {
            if ( handler._jsControllerID === this._handlers[ event ][ i ]._jsControllerID ) {
                this._handlers[ event ].splice( i, 1 );

                break;
            }
        }
    },

    /**
     *
     * Controller completely remove all handlers and an event type
     * @memberof Controller
     * @method _offed
     * @param {string} event the event to remove handler for
     * @private
     *
     */
    _offed: function ( event ) {
        for ( var i = this._handlers[ event ].length; i--; ) {
            this._handlers[ event ][ i ] = null;
        }

        delete this._handlers[ event ];
    }
};


// Expose
window.provide( "Controller", Controller );

})( window );
/*!
 *
 * Debounce methods
 * Sourced from here:
 * http://unscriptable.com/2009/03/20/debouncing-javascript-methods/
 *
 * @debounce
 * @author: kitajchuk
 *
 */
(function ( window, undefined ) {


"use strict";


/**
 *
 * Limit method calls
 * @memberof! <global>
 * @method debounce
 * @param {function} callback The method handler
 * @param {number} threshold The timeout delay in ms
 * @param {boolean} execAsap Call function at beginning or end of detection period
 *
 */
var debounce = function ( callback, threshold, execAsap ) {
    var timeout = null;
    
    return function debounced() {
        var args = arguments,
            context = this;
        
        function delayed() {
            if ( !execAsap ) {
                callback.apply( context, args );
            }
            
            timeout = null;
        }
        
        if ( timeout ) {
            clearTimeout( timeout );
            
        } else if ( execAsap ) {
            callback.apply( context, args );
        }
        
        timeout = setTimeout( delayed, (threshold || 100) );
    };
};


// Expose
window.provide( "debounce", debounce );


})( window );
/*!
 *
 * A base set of easing methods
 * Most of which were found here:
 * https://gist.github.com/gre/1650294
 *
 * @Easing
 * @author: kitajchuk
 *
 */
(function ( window, undefined ) {


"use strict";


/**
 *
 * Easing functions
 * @namespace Easing
 * @memberof! <global>
 *
 */
var Easing = {
    /**
     *
     * Produce a linear ease
     * @method linear
     * @param {number} t Difference in time
     * @memberof Easing
     * @returns a new t value
     *
     */
    linear: function ( t ) { return t; },
    
    /**
     *
     * Produce a swing ease like in jQuery
     * @method swing
     * @param {number} t Difference in time
     * @memberof Easing
     * @returns a new t value
     *
     */
    swing: function ( t ) { return (1-Math.cos( t*Math.PI ))/2; },
    
    /**
     *
     * Accelerating from zero velocity
     * @method easeInQuad
     * @param {number} t Difference in time
     * @memberof Easing
     * @returns a new t value
     *
     */
    easeInQuad: function ( t ) { return t*t; },
    
    /**
     *
     * Decelerating to zero velocity
     * @method easeOutQuad
     * @param {number} t Difference in time
     * @memberof Easing
     * @returns a new t value
     *
     */
    easeOutQuad: function ( t ) { return t*(2-t); },
    
    /**
     *
     * Acceleration until halfway, then deceleration
     * @method easeInOutQuad
     * @param {number} t Difference in time
     * @memberof Easing
     * @returns a new t value
     *
     */
    easeInOutQuad: function ( t ) { return t<0.5 ? 2*t*t : -1+(4-2*t)*t; },
    
    /**
     *
     * Accelerating from zero velocity
     * @method easeInCubic
     * @param {number} t Difference in time
     * @memberof Easing
     * @returns a new t value
     *
     */
    easeInCubic: function ( t ) { return t*t*t; },
    
    /**
     *
     * Decelerating to zero velocity
     * @method easeOutCubic
     * @param {number} t Difference in time
     * @memberof Easing
     * @returns a new t value
     *
     */
    easeOutCubic: function ( t ) { return (--t)*t*t+1; },
    
    /**
     *
     * Acceleration until halfway, then deceleration
     * @method easeInOutCubic
     * @param {number} t Difference in time
     * @memberof Easing
     * @returns a new t value
     *
     */
    easeInOutCubic: function ( t ) { return t<0.5 ? 4*t*t*t : (t-1)*(2*t-2)*(2*t-2)+1; },
    
    /**
     *
     * Accelerating from zero velocity
     * @method easeInQuart
     * @param {number} t Difference in time
     * @memberof Easing
     * @returns a new t value
     *
     */
    easeInQuart: function ( t ) { return t*t*t*t; },
    
    /**
     *
     * Decelerating to zero velocity
     * @method easeOutQuart
     * @param {number} t Difference in time
     * @memberof Easing
     * @returns a new t value
     *
     */
    easeOutQuart: function ( t ) { return 1-(--t)*t*t*t; },
    
    /**
     *
     * Acceleration until halfway, then deceleration
     * @method easeInOutQuart
     * @param {number} t Difference in time
     * @memberof Easing
     * @returns a new t value
     *
     */
    easeInOutQuart: function ( t ) { return t<0.5 ? 8*t*t*t*t : 1-8*(--t)*t*t*t; },
    
    /**
     *
     * Accelerating from zero velocity
     * @method easeInQuint
     * @param {number} t Difference in time
     * @memberof Easing
     * @returns a new t value
     *
     */
    easeInQuint: function ( t ) { return t*t*t*t*t; },
    
    /**
     *
     * Decelerating to zero velocity
     * @method easeOutQuint
     * @param {number} t Difference in time
     * @memberof Easing
     * @returns a new t value
     *
     */
    easeOutQuint: function ( t ) { return 1+(--t)*t*t*t*t; },
    
    /**
     *
     * Acceleration until halfway, then deceleration
     * @method easeInOutQuint
     * @param {number} t Difference in time
     * @memberof Easing
     * @returns a new t value
     *
     */
    easeInOutQuint: function ( t ) { return t<0.5 ? 16*t*t*t*t*t : 1+16*(--t)*t*t*t*t; }
};


// Expose
window.provide( "Easing", Easing );


})( window );
/*!
 *
 * A simple tween class using requestAnimationFrame
 *
 * @Tween
 * @author: kitajchuk
 *
 */
(function ( window, Easing, undefined ) {


"use strict";


var defaults = {
    ease: Easing.linear,
    duration: 600,
    from: 0,
    to: 0,
    delay: 0,
    update: function () {},
    complete: function () {}
};


/**
 *
 * Tween function
 * @constructor Tween
 * @requires raf
 * @requires Easing
 * @param {object} options Tween animation settings
 * <ul>
 * <li>duration - How long the tween will last</li>
 * <li>from - Where to start the tween</li>
 * <li>to - When to end the tween</li>
 * <li>update - The callback on each iteration</li>
 * <li>complete - The callback on end of animation</li>
 * <li>ease - The easing function to use</li>
 * <li>delay - How long to wait before animation</li>
 * </ul>
 * @memberof! <global>
 *
 */
var Tween = function ( options ) {
    // Normalize options
    options = (options || {});

    // Normalize options
    for ( var i in defaults ) {
        if ( options[ i ] === undefined ) {
            options[ i ] = defaults[ i ];
        }
    }

    var tweenDiff = (options.to - options.from),
        startTime = null,
        rafTimer = null,
        isStopped = false;

    function animate( rafTimeStamp ) {
        if ( isStopped ) {
            return;
        }

        if ( startTime === null ) {
            startTime = rafTimeStamp;
        }

        var animDiff = (rafTimeStamp - startTime),
            tweenTo = (tweenDiff * options.ease( animDiff / options.duration )) + options.from;

        if ( typeof options.update === "function" ) {
            options.update( tweenTo );
        }

        if ( animDiff > options.duration ) {
            if ( typeof options.complete === "function" ) {
                options.complete( options.to );
            }

            cancelAnimationFrame( rafTimer );

            rafTimer = null;

            return false;
        }

        rafTimer = requestAnimationFrame( animate );
    }

    setTimeout(function () {
        rafTimer = requestAnimationFrame( animate );

    }, options.delay );

    this.stop = function () {
        isStopped = true;

        cancelAnimationFrame( rafTimer );

        rafTimer = null;
    };
};


// Expose
window.provide( "Tween", Tween );

})( window, window.require( "Easing" ) );
/*!
 *
 * A basic scrollto function without all the fuss
 *
 * @scroll2
 * @author: kitajchuk
 *
 */
(function ( window, Tween, Easing, undefined ) {


"use strict";


/**
 *
 * Window scroll2 function
 * @method scroll2
 * @requires Tween
 * @param {object} options Tween animation settings
 * <ul>
 * <li>duration - How long the tween will last</li>
 * <li>complete - The callback on end of animation</li>
 * <li>ease - The easing function to use</li>
 * <li>x/y - The axis to tween, where its going to land</li>
 * </ul>
 * @memberof! <global>
 *
 */
var scroll2 = function ( options ) {
    // Get current window positions
    var position = {
        x: (window.scrollX || document.documentElement.scrollLeft),
        y: (window.scrollY || document.documentElement.scrollTop)
    };

    // Normalize options
    options = (options || {});

    // Normalize easing method
    options.ease = (options.ease || Easing.swing);

    // Normalize duration
    options.duration = (options.duration || 600);

    // Normalize from
    options.from = ( options.y !== undefined ) ? position.y : position.x;

    // Normalize to
    options.to = ( options.y !== undefined ) ? options.y : options.x;

    // Apply update method
    options.update = function ( t ) {
        // Vertical scroll
        if ( options.y !== undefined ) {
            window.scrollTo( position.x, t );

        // Horizontal scroll
        } else if ( options.x !== undefined ) {
            window.scrollTo( t, position.y );
        }
    };

    return new Tween( options );
};


// Expose
window.provide( "scroll2", scroll2 );

})( window, window.require( "Tween" ), window.require( "Easing" ) );
/*!
 *
 * Window scroll event controller
 *
 * @ScrollController
 * @author: kitajchuk
 *
 *
 */
(function ( window, Controller, undefined ) {


"use strict";


// Current scroll position
var _currentY = null,

    // Singleton
    _instance = null;

/**
 *
 * Window scroll event controller
 * @constructor ScrollController
 * @augments Controller
 * @requires Controller
 * @memberof! <global>
 *
 * @fires scroll
 * @fires scrolldown
 * @fires scrollup
 * @fires scrollmax
 * @fires scrollmin
 *
 */
var ScrollController = function () {
    // Singleton
    if ( !_instance ) {
        _instance = this;

        // Call on parent cycle
        this.go(function () {
            var currentY = _instance.getScrollY(),
                isStill = (currentY === _currentY),
                isScroll = (currentY !== _currentY),
                isScrollUp = (currentY < _currentY),
                isScrollDown = (currentY > _currentY),
                isScrollMax = (currentY !== _currentY && _instance.isScrollMax()),
                isScrollMin = (currentY !== _currentY && _instance.isScrollMin());

            // Fire blanket scroll event
            if ( isScroll ) {
                /**
                 *
                 * @event scroll
                 *
                 */
                _instance.fire( "scroll" );
            }

            // Fire scrollup and scrolldown
            if ( isScrollDown ) {
                /**
                 *
                 * @event scrolldown
                 *
                 */
                _instance.fire( "scrolldown" );

            } else if ( isScrollUp ) {
                /**
                 *
                 * @event scrollup
                 *
                 */
                _instance.fire( "scrollup" );
            }

            // Fire scrollmax and scrollmin
            if ( isScrollMax ) {
                /**
                 *
                 * @event scrollmax
                 *
                 */
                _instance.fire( "scrollmax" );

            } else if ( isScrollMin ) {
                /**
                 *
                 * @event scrollmin
                 *
                 */
                _instance.fire( "scrollmin" );
            }

            _currentY = currentY;
        });
    }

    return _instance;
};

ScrollController.prototype = new Controller();

/**
 *
 * Returns the current window vertical scroll position
 * @memberof ScrollController
 * @method getScrollY
 * @returns number
 *
 */
ScrollController.prototype.getScrollY = function () {
    return (window.scrollY || document.documentElement.scrollTop);
};

/**
 *
 * Get the max document scrollable height
 * @memberof ScrollController
 * @method getScrollMax
 * @returns number
 *
 */
ScrollController.prototype.getScrollMax = function () {
    return (document.documentElement.offsetHeight - window.innerHeight);
};

/**
 *
 * Determines if scroll position is at maximum for document
 * @memberof ScrollController
 * @method isScrollMax
 * @returns boolean
 *
 */
ScrollController.prototype.isScrollMax = function () {
    return (this.getScrollY() >= (document.documentElement.offsetHeight - window.innerHeight));
};

/**
 *
 * Determines if scroll position is at minimum for document
 * @memberof ScrollController
 * @method isScrollMin
 * @returns boolean
 *
 */
ScrollController.prototype.isScrollMin = function () {
    return (this.getScrollY() <= 0);
};


// Expose
window.provide( "ScrollController", ScrollController );

})( window, window.require( "Controller" ) );
/*!
 *
 * Window resize / orientationchange event controller
 *
 * @ResizeController
 * @author: kitajchuk
 *
 *
 */
(function ( window, Controller, undefined ) {


"use strict";


// Current window viewport
var _currentView = {
        width: null,
        height: null,
        orient: null
    },

    // Singleton
    _instance = null;

/**
 *
 * Window resize / orientationchange event controller
 * @constructor ResizeController
 * @augments Controller
 * @requires Controller
 * @memberof! <global>
 *
 * @fires resize
 * @fires resizedown
 * @fires resizeup
 * @fires orientationchange
 * @fires orientationportrait
 * @fires orientationlandscape
 *
 */
var ResizeController = function () {
    // Singleton
    if ( !_instance ) {
        _instance = this;

        // Call on parent cycle
        this.go(function () {
            var currentView = _instance.getViewport(),
                isStill = (currentView.width === _currentView.width && currentView.height === _currentView.height),
                isResize = (currentView.width !== _currentView.width || currentView.height !== _currentView.height),
                isResizeUp = (currentView.width > _currentView.width || currentView.height > _currentView.height),
                isResizeDown = (currentView.width < _currentView.width || currentView.height < _currentView.height),
                isOrientation = (currentView.orient !== _currentView.orient),
                isOrientationPortrait = (currentView.orient !== _currentView.orient && currentView.orient !== 90),
                isOrientationLandscape = (currentView.orient !== _currentView.orient && currentView.orient === 90);

            // Fire blanket resize event
            if ( isResize ) {
                /**
                 *
                 * @event resize
                 *
                 */
                _instance.fire( "resize" );
            }

            // Fire resizeup and resizedown
            if ( isResizeDown ) {
                /**
                 *
                 * @event resizedown
                 *
                 */
                _instance.fire( "resizedown" );

            } else if ( isResizeUp ) {
                /**
                 *
                 * @event resizeup
                 *
                 */
                _instance.fire( "resizeup" );
            }

            // Fire blanket orientationchange event
            if ( isOrientation ) {
                /**
                 *
                 * @event orientationchange
                 *
                 */
                _instance.fire( "orientationchange" );
            }

            // Fire orientationportrait and orientationlandscape
            if ( isOrientationPortrait ) {
                /**
                 *
                 * @event orientationportrait
                 *
                 */
                _instance.fire( "orientationportrait" );

            } else if ( isOrientationLandscape ) {
                /**
                 *
                 * @event orientationlandscape
                 *
                 */
                _instance.fire( "orientationlandscape" );
            }

            _currentView = currentView;
        });
    }

    return _instance;
};

ResizeController.prototype = new Controller();

/**
 *
 * Returns the current window viewport specs
 * @memberof ResizeController
 * @method getViewport
 * @returns object
 *
 */
ResizeController.prototype.getViewport = function () {
    return {
        width: window.innerWidth,
        height: window.innerHeight,
        orient: ("orientation" in window) ? Math.abs( window.orientation ) : null
    };
};

/**
 *
 * Tells if the viewport is in protrait mode
 * @memberof ResizeController
 * @method isPortrait
 * @returns boolean
 *
 */
ResizeController.prototype.isPortrait = function () {
    return (this.getViewport().orient !== 90);
};

/**
 *
 * Tells if the viewport is in landscape mode
 * @memberof ResizeController
 * @method isLandscape
 * @returns boolean
 *
 */
ResizeController.prototype.isLandscape = function () {
    return (this.getViewport().orient === 90);
};


// Expose
window.provide( "ResizeController", ResizeController );

})( window, window.require( "Controller" ) );
/*!
 *
 * Handles history pushstate/popstate with async option
 * If history is not supported, falls back to hashbang!
 *
 * @PushState
 * @author: kitajchuk
 *
 */
(function ( window, undefined ) {


"use strict";


/**
 *
 * A simple pushState Class
 * Supported events with .on():
 * <ul>
 * <li>popstate</li>
 * <li>beforestate</li>
 * <li>afterstate</li>
 * </ul>
 * @constructor PushState
 * @memberof! <global>
 *
 */
var PushState = function () {
    return this.init.apply( this, arguments );
};

PushState.prototype = {
    constructor: PushState,
    
    /**
     *
     * Expression match #
     * @memberof PushState
     * @member _rHash
     * @private
     *
     */
    _rHash: /#/,
    
    /**
     *
     * Expression match http/https
     * @memberof PushState
     * @member _rHTTPs
     * @private
     *
     */
    _rHTTPs: /^http[s]?:\/\/.*?\//,
    
    /**
     *
     * Flag whether pushState is enabled
     * @memberof PushState
     * @member _pushable
     * @private
     *
     */
    _pushable: ("history" in window && "pushState" in window.history),
    
    /**
     *
     * Fallback to hashchange if needed. Support:
     * <ul>
     * <li>Internet Explorer 8</li>
     * <li>Firefox 3.6</li>
     * <li>Chrome 5</li>
     * <li>Safari 5</li>
     * <li>Opera 10.6</li>
     * </ul>
     * @memberof PushState
     * @member _hashable
     * @private
     *
     */
    _hashable: ("onhashchange" in window),
    
    /**
     *
     * PushState init constructor method
     * @memberof PushState
     * @method PushState.init
     * @param {object} options Settings for PushState
     * <ul>
     * <li>options.async</li>
     * <li>options.caching</li>
     * <li>options.handle404</li>
     * <li>options.handle500</li>
     * </ul>
     *
     */
    init: function ( options ) {
        var url = window.location.href;
        
        /**
         *
         * Flag whether state is enabled
         * @memberof PushState
         * @member _enabled
         * @private
         *
         */
        this._enabled = false;
        
        /**
         *
         * Flag when hash is changed by PushState
         * This allows appropriate replication of popstate
         * @memberof PushState
         * @member _ishashpushed
         * @private
         *
         */
        this._ishashpushed = false;
        
        /**
         *
         * Unique ID ticker
         * @memberof PushState
         * @member _uid
         * @private
         *
         */
        this._uid = 0;
        
        /**
         *
         * Stored state objects
         * @memberof PushState
         * @member _states
         * @private
         *
         */
        this._states = {};
        
        /**
         *
         * Stored response objects
         * @memberof PushState
         * @member _responses
         * @private
         *
         */
        this._responses = {};
        
        /**
         *
         * Event callbacks
         * @memberof PushState
         * @member _callbacks
         * @private
         *
         */
        this._callbacks = {};
        
        /**
         *
         * Flag whether to use ajax
         * @memberof PushState
         * @member _async
         * @private
         *
         */
        this._async = ( options && options.async !== undefined ) ? options.async : true;
        
        /**
         *
         * Flag whether to use cached responses
         * @memberof PushState
         * @member _caching
         * @private
         *
         */
        this._caching = ( options && options.caching !== undefined ) ? options.caching : true;
        
        /**
         *
         * Flag whether to handle 404 pages
         * @memberof PushState
         * @member _handle404
         * @private
         *
         */
        this._handle404 = ( options && options.handle404 !== undefined ) ? options.handle404 : true;
        
        /**
         *
         * Flag whether to handle 500 pages
         * @memberof PushState
         * @member _handle500
         * @private
         *
         */
        this._handle500 = ( options && options.handle500 !== undefined ) ? options.handle500 : true;
        
        // Set initial state
        this._states[ url ] = {
            uid: this.getUID(),
            cached: false
        };

        // Enable the popstate event
        this._stateEnable();
    },
    
    /**
     *
     * Bind a callback to an event
     * @memberof PushState
     * @method on
     * @param {string} event The event to bind to
     * @param {function} callback The function to call
     *
     */
    on: function ( event, callback ) {
        if ( typeof callback === "function" ) {
            if ( !this._callbacks[ event ] ) {
                this._callbacks[ event ] = [];
            }
            
            callback._pushstateID = this.getUID();
            callback._pushstateType = event;
            
            this._callbacks[ event ].push( callback );
        }
    },
    
    /**
     *
     * Push onto the History state
     * @memberof PushState
     * @method push
     * @param {string} url address to push to history
     * @param {function} callback function to call when done
     *
     * @fires beforestate
     * @fires afterstate
     *
     */
    push: function ( url, callback ) {
        var self = this;
        
        // Break on pushing current url
        if ( url === window.location.href && this._stateCached( url ) ) {
            callback( this._responses[ url ], 200 );
            
            return;
        }
        
        this._fire( "beforestate" );
        
        // Break on cached
        if ( this._stateCached( url ) ) {
            this._push( url );
                    
            callback( this._responses[ url ], 200 );
        
        // Push new state    
        } else {
            this._states[ url ] = {
                uid: this.getUID(),
                cached: false
            };
            
            if ( this._async ) {
                this._getUrl( url, function ( response, status ) {
                    self._push( url );
    
                    self._fire( "afterstate", response, status );
                    
                    if ( typeof callback === "function" ) {
                        callback( response, status );
                    }
                });
    
            } else {
                this._push( url );

                this._fire( "afterstate" );
                
                if ( typeof callback === "function" ) {
                    callback();
                }
            }
        }
    },
    
    /**
     *
     * Manually go back in history state
     * @memberof PushState
     * @method goBack
     *
     * @fires backstate
     *
     */
    goBack: function () {
        window.history.back();
        
        this._fire( "backstate" );
    },
    
    /**
     *
     * Manually go forward in history state
     * @memberof PushState
     * @method goForward
     *
     * @fires forwardstate
     *
     */
    goForward: function () {
        window.history.forward();
        
        this._fire( "forwardstate" );
    },
    
    /**
     *
     * Get a unique ID
     * @memberof PushState
     * @method getUID
     * @returns number
     *
     */
    getUID: function () {
        this._uid = (this._uid + 1);
        
        return this._uid;
    },
    
    /**
     *
     * Calls window.history.pushState
     * @memberof PushState
     * @method _push
     * @param {string} url The url to push
     * @private
     *
     */
    _push: function ( url ) {
        if ( this._pushable ) {
            window.history.pushState( this._states[ url ], "", url );
            
        } else {
            this._ishashpushed = true;
            
            window.location.hash = url.replace( this._rHTTPs, "" );
        }
    },
    
    /**
     *
     * Check if state has been cached for a url
     * @memberof PushState
     * @method _stateCached
     * @param {string} url The url to check
     * @private
     *
     */
    _stateCached: function ( url ) {
        var ret = false;
        
        if ( this._caching && this._states[ url ] && this._states[ url ].cached && this._responses[ url ] ) {
            ret = true;
        }
        
        return ret;
    },
    
    /**
     *
     * Cache the response for a url
     * @memberof PushState
     * @method _cacheState
     * @param {string} url The url to cache for
     * @param {object} response The XMLHttpRequest response object
     * @private
     *
     */
    _cacheState: function ( url, response ) {
        if ( this._caching ) {
            this._states[ url ].cached = true;
            this._responses[ url ] = response;
        }
    },
    
    /**
     *
     * Request a url with an XMLHttpRequest
     * @memberof PushState
     * @method _getUrl
     * @param {string} url The url to request
     * @param {function} callback The function to call when done
     * @private
     *
     */
    _getUrl: function ( url, callback ) {
        var handler = function ( res, stat ) {
                try {
                    // Cache if option enabled
                    self._cacheState( url, res );
                    
                    if ( typeof callback === "function" ) {
                        callback( res, (stat ? stat : undefined) );
                    }
                    
                } catch ( error ) {}
            },
            xhr = new XMLHttpRequest(),
            self = this;
        
        xhr.open( "GET", url, true );
        
        xhr.onreadystatechange = function ( e ) {
            if ( this.readyState === 4 ) {
                if ( this.status === 200 ) {
                    handler( this, 200 );
                    
                } else if ( this.status === 404 && self._handle404 ) {
                    handler( this, 404 );
                    
                } else if ( this.status === 500 && self._handle500 ) {
                    handler( this, 500 );
                }
            }
        };
        
        xhr.send();
    },
    
    /**
     *
     * Fire an events callbacks
     * @memberof PushState
     * @method _fire
     * @param {string} event The event to fire
     * @param {string} url The current url
     * @private
     *
     */
    _fire: function ( event, url ) {
        if ( this._callbacks[ event ] ) {
            for ( var i = this._callbacks[ event ].length; i--; ) {
                this._callbacks[ event ][ i ].apply( this, [].slice.call( arguments, 1 ) );
            }
        }
    },
    
    /**
     *
     * Bind this instances state handler
     * @memberof PushState
     * @method _stateEnabled
     * @private
     *
     * @fires popstate
     *
     */
    _stateEnable: function () {
        if ( this._enabled ) {
            return this;
        }

        var self = this,
            handler = function () {
                var url = window.location.href.replace( self._rHash, "/" );
                
                if ( self._stateCached( url ) ) {
                    self._fire( "popstate", url, self._responses[ url ] );
                    
                } else {
                    self._getUrl( url, function ( response, status ) {
                        self._fire( "popstate", url, response, status );
                    });
                }
            };

        this._enabled = true;
        
        if ( this._pushable ) {
            window.addEventListener( "popstate", function ( e ) {
                handler();
                
            }, false );
            
        } else if ( this._hashable ) {
            window.addEventListener( "hashchange", function ( e ) {
                if ( !self._ishashpushed ) {
                    handler();
                    
                } else {
                    self._ishashpushed = false;
                }
                
            }, false );
        }
    }
};


// Expose
window.provide( "PushState", PushState );


})( window );
/*!
 *
 * Parse query string into object literal representation
 *
 * @compat: jQuery, Ender, Zepto
 * @author: @kitajchuk
 *
 *
 */
(function ( context, undefined ) {


"use strict";


/******************************************************************************
 * paramalama
*******************************************************************************/
(function ( factory ) {
    
    if ( typeof define === "function" && define.amd ) {
        define( [ "jquery" ], factory );
        
    } else {
        factory( context.$ );
    }
    
})(function ( $ ) {
    
    var paramalama = function ( str ) {
        var query = decodeURIComponent( str ).match( /[#|?].*$/g ),
            ret = {};
        
        if ( query ) {
            query = query[ 0 ].replace( /^\?|^#|^\/|\/$|\[|\]/g, "" );
            query = query.split( "&" );
            
            for ( var i = query.length; i--; ) {
                var pair = query[ i ].split( "=" ),
                    key = pair[ 0 ],
                    val = pair[ 1 ];
                
                if ( ret[ key ] ) {
                    // #2 https://github.com/kitajchuk/paramalama/issues/2
                    // This supposedly will work as of ECMA-262
                    // This works since we are not passing objects across frame boundaries
                    // and we are not considering Array-like objects. This WILL be an Array.
                    if ( {}.toString.call( ret[ key ] ) !== "[object Array]" ) {
                        ret[ key ] = [ ret[ key ] ];
                    }
                    
                    ret[ key ].push( val );
                    
                } else {
                    ret[ key ] = val;
                }
            }
        }
        
        return ret;
    };
    
    if ( typeof module === "object" && module && typeof module.exports === "object" ) {
        module.exports = paramalama;
        
    } else {
        context.paramalama = paramalama;

        if ( $ !== undefined ) {
            $.paramalama = paramalama;
        }
    }
    
});


})( this );

/*!
 *
 * Handles wildcard route matching against urls with !num and !slug condition testing
 *
 * @MatchRoute
 * @author: kitajchuk
 *
 */
(function ( window, paramalama, undefined ) {


"use strict";


/**
 *
 * Handles wildcard route matching against urls with !num and !slug condition testing
 * <ul>
 * <li>route = "/some/random/path/:myvar"</li>
 * <li>route = "/some/random/path/:myvar!num"</li>
 * <li>route = "/some/random/path/:myvar!slug"</li>
 * </ul>
 * @constructor MatchRoute
 * @memberof! <global>
 * @requires paramalama
 *
 */
var MatchRoute = function () {
    return this.init.apply( this, arguments );
};

MatchRoute.prototype = {
    constructor: MatchRoute,
    
    /**
     *
     * Expression match http/https
     * @memberof MatchRoute
     * @member _rHTTPs
     * @private
     *
     */
    _rHTTPs: /^http[s]?:\/\/.*?\//,
    
    /**
     *
     * Expression match trail slashes
     * @memberof MatchRoute
     * @member _rTrails
     * @private
     *
     */
    _rTrails: /^\/|\/$/g,
    
    /**
     *
     * Expression match hashbang/querystring
     * @memberof MatchRoute
     * @member _rHashQuery
     * @private
     *
     */
    _rHashQuery: /#.*$|\?.*$/g,
    
    /**
     *
     * Expression match wildcards
     * @memberof MatchRoute
     * @member _rWild
     * @private
     *
     */
    _rWild: /^:/,
    
    /**
     *
     * Expressions to match wildcards with supported conditions
     * @memberof MatchRoute
     * @member _wilders
     * @private
     *
     */
    _wilders: {
        num: /^[0-9]+$/,
        slug: /^[A-Za-z]+[A-Za-z0-9-_.]*$/
    },
    
    
    /**
     *
     * MatchRoute init constructor method
     * @memberof MatchRoute
     * @method init
     * @param {array} routes Config routes can be passed on instantiation
     *
     */
    init: function ( routes ) {
        /**
         *
         * The routes config array
         * @memberof MatchRoute
         * @member _routes
         * @private
         *
         */
        this._routes = ( routes ) ? this._cleanRoutes( routes ) : [];
    },

    /**
     *
     * Get the internal route array
     * @memberof MatchRoute
     * @method MatchRoute.getRoutes
     * @returns {array}
     *
     */
    getRoutes: function () {
        return this._routes;
    },
    
    /**
     *
     * Update routes config array
     * @memberof MatchRoute
     * @method config
     * @param {array} routes to match against
     *
     */
    config: function ( routes ) {
        // Force array on routes
        routes = ( typeof routes === "string" ) ? [ routes ] : routes;

        this._routes = this._routes.concat( this._cleanRoutes( routes ) );
        
        return this;
    },
    
    /**
     *
     * Test a url against a routes config for match validation
     * @memberof MatchRoute
     * @method test
     * @param {string} url to test against routes
     * @returns True or False
     *
     */
    test: function ( url ) {
        return this.parse( url, this._routes ).matched;
    },
    
    /**
     *
     * Match a url against a routes config for matches
     * @memberof MatchRoute
     * @method params
     * @param {string} url to test against routes
     * @returns Array of matching routes
     *
     */
    params: function ( url ) {
        return this.parse( url, this._routes ).params;
    },
    
    /**
     *
     * Compare a url against a specific route
     * @memberof MatchRoute
     * @method compare
     * @param {string} route compare route
     * @param {string} url compare url
     * @returns MatchRoute.parse()
     *
     */
    compare: function ( route, url ) {
        return this.parse( url, [route] );
    },
    
    /**
     *
     * Parse a url for matches against config array
     * @memberof MatchRoute
     * @method parse
     * @param {string} url to test against routes
     * @param {array} routes The routes to test against
     * @returns Object witch match bool and matches array
     *
     */
    parse: function ( url, routes ) {
        var segMatches,
            isStar,
            params,
            match,
            route = this._cleanRoute( url ),
            ruris,
            regex,
            cond,
            uris = route.split( "/" ),
            uLen = uris.length,
            iLen = routes.length,
            ret;
        
        for ( var i = 0; i < iLen; i++ ) {
            // Flag "*" route
            isStar = (routes[ i ] === "*");
            
            // Start fresh each iteration
            // Only one matched route allowed
            ret = {
                matched: false,
                route: null,
                uri: [],
                params: {},
                query: paramalama( url )
            };
            
            ruris = routes[ i ].split( "/" );
            
            // Handle route === "/"
            if ( route === "/" && routes[ i ] === "/" ) {
                ret.matched = true;
                ret.route = routes[ i ];
                ret.uri = "/";
                
                break;
            }
            
            // If the actual url doesn't match the route in segment length,
            // it cannot possibly be considered for matching so just skip it
            if ( ruris.length !== uris.length && !isStar ) {
                continue;
            }
            
            segMatches = 0;
            
            for ( var j = 0; j < uLen; j++ ) {
                // Matched a variable uri segment
                if ( this._rWild.test( ruris[ j ] ) ) {
                    // Try to split on conditions
                    params = ruris[ j ].split( "!" );
                    
                    // The variable segment
                    match = params[ 0 ];
                    
                    // The match condition
                    cond = params[ 1 ];
                    
                    // With conditions
                    if ( cond ) {
                        // We support this condition
                        if ( this._wilders[ cond ] ) {
                            regex = this._wilders[ cond ];
                        }
                        
                        // Test against the condition
                        if ( regex && regex.test( uris[ j ] ) ) {
                            segMatches++;
                            
                            // Add the match to the config data
                            ret.params[ match.replace( this._rWild, "" ) ] = uris[ j ];
                            ret.uri.push( uris[ j ] );
                        }
                    
                    // No conditions, anything goes   
                    } else {
                        segMatches++;
                        
                        // Add the match to the config data
                        ret.params[ match.replace( this._rWild, "" ) ] = uris[ j ];
                        ret.uri.push( uris[ j ] );
                    }
                
                // Defined segment always goes   
                } else {
                    if ( uris[ j ] === ruris[ j ] ) {
                        segMatches++;
                        
                        ret.uri.push( uris[ j ] );
                    }
                }
            }
            
            // Handle a uri segment match OR "*" wildcard everything
            if ( segMatches === uris.length || isStar ) {
                ret.matched = true;
                ret.route = routes[ i ];
                ret.uri = ( isStar ) ? route : ret.uri.join( "/" );
                
                break;
            }
        }
        
        return ret;
    },
    
    /**
     *
     * Clean a route string
     * If the route === "/" then it is returned as is
     * @memberof MatchRoute
     * @method _cleanRoute
     * @param {string} route the route to clean
     * @returns cleaned route string
     * @private
     *
     */
    _cleanRoute: function ( route ) {
        if ( route !== "/" ) {
            route = route.replace( this._rHTTPs, "" );
            route = route.replace( this._rTrails, "" );
            route = route.replace( this._rHashQuery, "" );
            route = route.replace( this._rTrails, "" );
        }
        
        if ( route === "" ) {
            route = "/";
        }
        
        return route;
    },
    
    /**
     *
     * Clean an array of route strings
     * @memberof MatchRoute
     * @method _cleanRoutes
     * @param {array} routes the routes to clean
     * @returns cleaned routes array
     * @private
     *
     */
    _cleanRoutes: function ( routes ) {
        for ( var i = routes.length; i--; ) {
            routes[ i ] = this._cleanRoute( routes[ i ] );
        }
        
        return routes;
    }
};


// Expose
window.provide( "MatchRoute", MatchRoute );


})( window, window.paramalama );
/*!
 *
 * Use native element selector matching
 *
 * @matchElement
 * @author: kitajchuk
 *
 */
(function ( window, undefined ) {


"use strict";


/**
 *
 * Use native element selector matching
 * @memberof! <global>
 * @method matchElement
 * @param {object} el the element
 * @param {string} selector the selector to match
 * @returns element OR null
 *
 */
var matchElement = function ( el, selector ) {
    var method = ( el.matches ) ? "matches" : ( el.webkitMatchesSelector ) ? 
                                  "webkitMatchesSelector" : ( el.mozMatchesSelector ) ? 
                                  "mozMatchesSelector" : ( el.msMatchesSelector ) ? 
                                  "msMatchesSelector" : ( el.oMatchesSelector ) ? 
                                  "oMatchesSelector" : null;
    
    // Try testing the element agains the selector
    if ( method && el[ method ].call( el, selector ) ) {
        return el;
    
    // Keep walking up the DOM if we can
    } else if ( el !== document.documentElement && el.parentNode ) {
        return matchElement( el.parentNode, selector );
    
    // Otherwise we should not execute an event
    } else {
        return null;
    }
};


// Expose
window.provide( "matchElement", matchElement );


})( window );
/*!
 *
 * Handles basic get routing
 *
 * @Router
 * @author: kitajchuk
 *
 */
(function ( window, PushState, MatchRoute, matchElement, undefined ) {


"use strict";


var _rSameDomain = new RegExp( document.domain ),
    _initDelay = 200,
    _triggerEl;


/**
 *
 * A simple router Class
 * @constructor Router
 * @requires PushState
 * @requires MatchRoute
 * @requires matchElement
 * @memberof! <global>
 *
 */
var Router = function () {
    return this.init.apply( this, arguments );
};

Router.prototype = {
    constructor: Router,
    
    /**
     *
     * Router init constructor method
     * @memberof Router
     * @method init
     * @param {object} options Settings for PushState
     * <ul>
     * <li>options.async</li>
     * <li>options.caching</li>
     * </ul>
     *
     * @fires beforeget
     * @fires afterget
     * @fires get
     *
     */
    init: function ( options ) {
        /**
         *
         * Internal MatchRoute instance
         * @memberof Router
         * @member _matcher
         * @private
         *
         */
        this._matcher = new MatchRoute();
        
        /**
         *
         * Internal PushState instance
         * @memberof Router
         * @member _pusher
         * @private
         *
         */
        this._pusher = null;
        
        /**
         *
         * Event handling callbacks
         * @memberof Router
         * @member _callbacks
         * @private
         *
         */
        this._callbacks = {};
        
        /**
         *
         * Router Store user options
         * @memberof Router
         * @member _options
         * @private
         *
         */
        this._options = options;
        
        /**
         *
         * Router unique ID
         * @memberof Router
         * @member _uid
         * @private
         *
         */
        this._uid = 0;
    },
    
    /**
     *
     * Create PushState instance and add event listener
     * @memberof Router
     * @method bind
     *
     */
    bind: function () {
        var self = this,
            isReady = false;
        
        // Bind GET requests to links
        if ( document.addEventListener ) {
            document.addEventListener( "click", function ( e ) {
                self._handler( this, e );
                
            }, false );
            
        } else if ( document.attachEvent ) {
            document.attachEvent( "onclick", function ( e ) {
                self._handler( this, e );
            });
        }
        
        /**
         *
         * Instantiate PushState
         *
         */
        this._pusher = new PushState( this._options );
        
        /**
         *
         * @event popstate
         *
         */
        this._pusher.on( "popstate", function ( url, data, status ) {
            // Hook around browsers firing popstate on pageload
            if ( isReady ) {
                for ( var i = self._callbacks.get.length; i--; ) {
                    var dat = self._matcher.parse( url, self._callbacks.get[ i ]._routerRoutes );
                    
                    if ( dat.matched ) {
                        break;
                    }
                }
                
                data = {
                    route: self._matcher._cleanRoute( url ),
                    response: data,
                    request: dat,
                    status: status || data.status
                };
                
                self._fire( "popget", url, data, status );
                
            } else {
                isReady = true;
            }
        });
        
        // Manually fire first GET
        // Async this in order to allow .get() to work after instantiation
        setTimeout(function () {
            self._pusher.push( window.location.href, function ( response, status ) {
                self._fire( "get", window.location.href, response, status );
                
                isReady = true;
            });
            
        }, _initDelay );
    },
    
    /**
     *
     * Add an event listener
     * Binding "beforeget" and "afterget" is a wrapper
     * to hook into the PushState classes "beforestate" and "afterstate".
     * @memberof Router
     * @method on
     * @param {string} event The event to bind to
     * @param {function} callback The function to call
     *
     */
    on: function ( event, callback ) {
        this._bind( event, callback );
    },

    /**
     *
     * Remove an event listener
     * @memberof Router
     * @method off
     * @param {string} event The event to unbind
     * @param {function} callback The function to reference
     *
     */
    off: function ( event, callback ) {
        this._unbind( event, callback );
    },

    /**
     *
     * Support router triggers by url
     * @memberof Router
     * @method trigger
     * @param {string} url The url to route to
     *
     */
    trigger: function ( url ) {
        if ( !_triggerEl ) {
            _triggerEl = document.createElement( "a" );
        }

        _triggerEl.href = url;

        this._handler( _triggerEl, {
            target: _triggerEl
        });
    },
    
    /**
     *
     * Bind a GET request route
     * @memberof Router
     * @method get
     * @param {string} route route to match
     * @param {function} callback function to call when route is requested
     *
     */
    get: function ( route, callback ) {
        // Add route to matcher
        this._matcher.config( [route] );
        
        // Bind the route to the callback
        if ( callback._routerRoutes ) {
            callback._routerRoutes.push( route );
            
        } else {
            callback._routerRoutes = [route];
        }
        
        // When binding multiple routes to a single
        // callback, we need to make sure the callbacks
        // routes array is updated above but the callback
        // only gets added to the list once.
        if ( callback._routerRoutes.length === 1 ) {
            this._bind( "get", callback );
        }
    },

    /**
     *
     * Get a sanitized route for a url
     * @memberof Router
     * @method getRouteForUrl
     * @param {string} url The url to use
     * @returns {string}
     *
     */
    getRouteForUrl: function ( url ) {
        return this._matcher._cleanRoute( url );
    },

    /**
     *
     * Get the match data for a url against the routes config
     * @memberof Router
     * @method getRouteDataForUrl
     * @param {string} url The url to use
     * @returns {object}
     *
     */
    getRouteDataForUrl: function ( url ) {
        return this._matcher.parse( url, this._matcher.getRoutes() ).params;
    },
    
    /**
     *
     * Get a unique ID
     * @memberof Router
     * @method getUID
     * @returns number
     *
     */
    getUID: function () {
        this._uid = (this._uid + 1);
        
        return this._uid;
    },
    
    /**
     * Compatible event preventDefault
     * @memberof Router
     * @method _preventDefault
     * @param {object} e The event object
     * @private
     *
     */
    _preventDefault: function ( e ) {
        if ( !this._options.preventDefault ) {
            return this;
        }
        
        if ( e.preventDefault ) {
            e.preventDefault();
            
        } else {
            e.returnValue = false;
        }
    },
    
    /**
     * GET click event handler
     * @memberof Router
     * @method _handler
     * @param {object} el The event context element
     * @param {object} e The event object
     * @private
     *
     * @fires get
     *
     */
    _handler: function ( el, e ) {
        var self = this,
            elem = (matchElement( el, "a" ) || matchElement( e.target, "a" ));
        
        if ( elem ) {
            if ( _rSameDomain.test( elem.href ) && elem.href.indexOf( "#" ) === -1 && this._matcher.test( elem.href ) ) {
                this._preventDefault( e );
                
                for ( var i = this._callbacks.get.length; i--; ) {
                    var data = this._matcher.parse( elem.href, this._callbacks.get[ i ]._routerRoutes );
                    
                    if ( data.matched ) {
                        this._fire( "preget", elem.href, data );
                        break;
                    }
                }
                
                this._pusher.push( elem.href, function ( response, status ) {
                    self._fire( "get", elem.href, response, status );
                });
            }
        }
    },
    
    /**
     *
     * Bind an event to a callback
     * @memberof Router
     * @method _bind
     * @param {string} event what to bind on
     * @param {function} callback fired on event
     * @private
     *
     */
    _bind: function ( event, callback ) {
        if ( typeof callback === "function" ) {
            if ( !this._callbacks[ event ] ) {
                this._callbacks[ event ] = [];
            }
            
            callback._jsRouterID = this.getUID();
            
            this._callbacks[ event ].push( callback );
        }
    },

    /**
     *
     * Unbind an event to a callback(s)
     * @memberof Router
     * @method _bind
     * @param {string} event what to bind on
     * @param {function} callback fired on event
     * @private
     *
     */
    _unbind: function ( event, callback ) {
        if ( !this._callbacks[ event ] ) {
            return this;
        }

        // Remove a single callback
        if ( callback ) {
            for ( var i = 0, len = this._callbacks[ event ].length; i < len; i++ ) {
                if ( callback._jsRouterID === this._callbacks[ event ][ i ]._jsRouterID ) {
                    this._callbacks[ event ].splice( i, 1 );
    
                    break;
                }
            }

        // Remove all callbacks for event
        } else {
            for ( var j = this._callbacks[ event ].length; j--; ) {
                this._callbacks[ event ][ j ] = null;
            }
    
            delete this._callbacks[ event ];
        }
    },
    
    /**
     *
     * Fire an event to a callback
     * @memberof Router
     * @method _fire
     * @param {string} event what to bind on
     * @param {string} url fired on event
     * @param {string} response html from responseText
     * @param {number} status The request status
     * @private
     *
     */
    _fire: function ( event, url, response, status ) {
        var i;
        
        // GET events have routes and are special ;-P
        if ( event === "get" ) {
            for ( i = this._callbacks[ event ].length; i--; ) {
                var data = this._matcher.parse( url, this._callbacks[ event ][ i ]._routerRoutes );
                
                if ( data.matched ) {
                    this._callbacks[ event ][ i ].call( this, {
                        route: this._matcher._cleanRoute( url ),
                        response: response,
                        request: data,
                        status: status
                    });
                }
            }
        
        // Fires basic timing events "beforeget" / "afterget"    
        } else if ( this._callbacks[ event ] ) {
            for ( i = this._callbacks[ event ].length; i--; ) {
                this._callbacks[ event ][ i ].call( this, response );
            }
        }
    }
};


// Expose
window.provide( "Router", Router );


})( window, window.PushState, window.MatchRoute, window.matchElement );
/*!
 *
 * Asynchronous webpage transitioning with pushstate management.
 *
 * @PageController
 * @author: kitajchuk
 *
 * @module
 * - init
 * - isActive
 * - isLoaded
 * - onload
 * - unload
 *
 *
 */
(function ( window, Controller, Router, undefined ) {


"use strict";


// Useful stuff
var _router = null,
    _config = [],
    _modules = [],
    _initialized = false,
    _timeBefore = null,
    _timeDelay = 600,
    _timeToIdle = 30000,
    _timeStamp = null,
    _eventPrefix = "page-controller-",
    _currentRoute = null,
    _isFirstRoute = true,
    _currentQuery = null,
    _currentToString = null,
    _isSamePage = false,

    // Singleton
    _instance = null,


// Private functions
isFunction = function ( fn ) {
    return (typeof fn === "function");
},


isSameObject = function ( o1, o2 ) {
    return (JSON.stringify( o1 ) === JSON.stringify( o2 ));
},


exec = function ( method ) {
    for ( var i = _modules.length; i--; ) {
        if ( _modules[ i ].__registered && isFunction( _modules[ i ][ method ] ) ) {
            _modules[ i ][ method ].call( _modules[ i ] );
        }
    }
},


onRouterResponse = function ( data ) {
    function __route() {
        //console.log( "[PageController : routing]" );

        if ( (Date.now() - _timeStamp) >= _instance._transitionTime ) {
            _instance.stop();

            //console.log( "[PageController : routed]" );

            handleRouterResponse( data );
        }
    }

    _instance.go( __route );
},


syncModules = function ( callback ) {
    var synced = [],
        module;

    //console.log( "[PageController : syncing]" );

    function __sync() {
        for ( var i = _modules.length; i--; ) {
            module = _modules[ i ];

            if ( isFunction( module.isActive ) && isFunction( module.isLoaded ) && synced.indexOf( module ) === -1 ) {
                // Must be active AND loaded
                if ( module.isActive() && module.isLoaded() ) {
                    synced.push( module );

                // Inactive modules just push stack to clear the sync process
                } else {
                    synced.push( module );
                }
            }
        }

        // When all modules are resolved, fire the callback
        if ( synced.length === _modules.length ) {
            _instance.stop();

            if ( isFunction( callback ) ) {
                callback();
            }

            //console.log( "[PageController : synced]" );
        }
    }

    _instance.go( __sync );
},


getRouteDataToString = function ( data ) {
    var ret = data.uri,
        i;

    for ( i in data.query ) {
        ret += "-" + i + "-" + data.query[ i ];
    }

    for ( i in data.params ) {
        ret += "-" + i + "-" + data.params[ i ];
    }

    return ret;
},


onPopGetRouter = function ( data ) {
    onPreGetRouter( data.request );

    setTimeout( function () {
        handleRouterResponse( data );

    }, _instance._transitionTime );
},


/**
 * @fires page-controller-transition-out
 */
onPreGetRouter = function ( data ) {
    var isSameRequest = (_currentToString === getRouteDataToString( data ));

    if ( isSameRequest ) {
        //console.log( "PageController : same page" );
        _instance.fire( (_eventPrefix + "router-samepage"), data );
        _isSamePage = true;
        return;
    }

    if ( _instance._anchorTop ) {
        window.scrollTo( 0, 0 );
    }

    _timeBefore = Date.now();

    //console.log( "[PageController : before-router]" );

    if ( !_isFirstRoute ) {
        // @update: Fire transition out before request cycle begins with Router
        _instance.fire( (_eventPrefix + "router-transition-out"), data );

        //console.log( "[PageController : router-transition-out]" );
    }
},


/**
 * @fires page-controller-router-transition-in
 * @fires page-controller-router-idle
 */
handleRouterResponse = function ( res ) {
    if ( _isSamePage ) {
        _isSamePage = false;
        return;
    }

    var data = {
        response: res.response.responseText,
        request: res.request,
        status: res.status
    };

    _currentRoute = data.request.uri;
    _currentQuery = data.request.query;
    _currentToString = getRouteDataToString( data.request );

    if ( _isFirstRoute ) {
        _isFirstRoute = false;
        exec( "unload" );
        exec( "onload" );
        return;
    }

    // Sync all modules - they must all respond to proceed
    syncModules(function () {
        // Stage time before transition back in
        setTimeout(function () {
            if ( _instance._anchorTop ) {
                window.scrollTo( 0, 0 );
            }

            _instance.fire( (_eventPrefix + "router-transition-in"), data );

            //console.log( "[PageController : router-transition-in]" );

            // Perform hooked module updates
            exec( "unload" );
            exec( "onload" );

            setTimeout(function () {
                 //console.log( "[PageController : router-transition-cleanup]" );

                // Idle state
                setTimeout(function () {
                    _instance.fire( (_eventPrefix + "router-idle"), data );

                    //console.log( "[PageController : router-idle]" );

                }, _timeToIdle );

            }, _instance._transitionTime );

        }, _instance._transitionTime );
    });
},


getModulesByState = function ( state ) {
    var modules = [];

    for ( var i = _modules.length; i--; ) {
        if ( isFunction( _modules[ i ][ state ] ) && _modules[ i ][ state ].call( _modules[ i ] ) ) {
            modules.push( _modules[ i ] );
        }
    }

    return modules;
};


/**
 *
 * Page transition manager
 * @constructor PageController
 * @augments Controller
 * @requires Controller
 * @requires Router
 * @memberof! <global>
 * @param {object} options Settings for control features
 * <ul>
 * <li>anchorTop - True / False</li>
 * </ul>
 *
 */
var PageController = function ( options ) {
    // Singleton
    if ( !_instance ) {
        _instance = this;

        options = (options || {});

        /**
         *
         * The flag to anchor to top of page on transitions
         * @memberof PageController
         * @member _anchorTop
         * @private
         *
         */
        this._anchorTop = (options.anchorTop !== undefined) ? options.anchorTop : true;

        /**
         *
         * The duration of your transition for page content
         * @memberof PageController
         * @member _transitionTime
         * @private
         *
         */
        this._transitionTime = (options.transitionTime || _timeDelay);
    }

    return _instance;
};

PageController.prototype = new Controller();

/**
 *
 * Initialize controller on page
 * @memberof PageController
 * @method initPage
 *
 */
PageController.prototype.initPage = function () {
    if ( _initialized ) {
        return;
    }

    _initialized = true;

    /**
     *
     * Instance of Router
     * @private
     *
     */
    _router = new Router({
        async: true,
        caching: true,
        preventDefault: true
    });

    if ( !_router._matcher.parse( window.location.href, _config ).matched ) {
        //console.log( "[PageController : page not in routes]" );
        
    } else {
        _router.bind();
        
        for ( var i = _config.length; i--; ) {
            _router.get( _config[ i ], onRouterResponse );
        }
    
        _router.on( "preget", onPreGetRouter );
        _router.on( "popget", onPopGetRouter );
    
        exec( "init" );
    }
};

/**
 *
 * Set the Router configuration
 * @memberof PageController
 * @method setConfig
 * @param {object} config The config for MatchRoute
 *
 */
PageController.prototype.setConfig = function ( config ) {
    _config = config;
};

/**
 *
 * Set the module configuration
 * @memberof PageController
 * @method setModules
 * @param {object} modules The array of module objects
 *
 */
PageController.prototype.setModules = function ( modules ) {
    if ( !modules ) {
        return;
    }

    for ( var i = modules.length; i--; ) {
        this.addModule( modules[ i ] );
    }
};

/**
 *
 * Add to the module configuration
 * @memberof PageController
 * @method addModule
 * @param {object} module The module object to add
 *
 */
PageController.prototype.addModule = function ( module ) {
    if ( _modules.indexOf( module ) === -1 ) {
        module.__registered = true;

        _modules.push( module );
    }
};

/**
 *
 * Add to the module configuration
 * @memberof PageController
 * @method unregisterModule
 * @param {object} module The module object to unregister
 *
 */
PageController.prototype.unregisterModule = function ( module ) {
    for ( var i = _modules.length; i--; ) {
        if ( _modules[ i ] === module ) {
            _modules[ i ].__registered = false;
        }
    }
};

/**
 *
 * Returns the array of active modules
 * @memberof PageController
 * @method getActiveModules
 * @returns array
 *
 */
PageController.prototype.getActiveModules = function () {
    return getModulesByState( "isActive" );
};

/**
 *
 * Returns the array of loaded modules
 * @memberof PageController
 * @method getLoadedModules
 * @returns array
 *
 */
PageController.prototype.getLoadedModules = function () {
    return getModulesByState( "isLoaded" );
};

/**
 *
 * Returns the array of modules
 * @memberof PageController
 * @method getModules
 * @returns array
 *
 */
PageController.prototype.getModules = function () {
    return _modules;
};

/**
 *
 * Returns the MatchRoute config
 * @memberof PageController
 * @method getConfig
 * @returns array
 *
 */
PageController.prototype.getConfig = function () {
    return _config;
};

/**
 *
 * Returns the instances Router
 * @memberof PageController
 * @method getRouter
 * @returns Router
 *
 */
PageController.prototype.getRouter = function () {
    return _router;
};


/**
 *
 * Returns the current route pathed
 * @memberof PageController
 * @method getRoute
 * @returns string
 *
 */
PageController.prototype.getRoute = function () {
    return _currentRoute;
};


/**
 *
 * Returns the current query params object
 * @memberof PageController
 * @method getQuery
 * @returns string
 *
 */
PageController.prototype.getQuery = function () {
    return _currentQuery;
};


/**
 *
 * Returns true if current page path equals slug
 * Loose match if no second parameter is passed
 * @memberof PageController
 * @method is
 * @param {string} slug The page slug to check
 * @param {boolean} looseMatch Perform a less strict match
 * @returns boolean
 *
 */
PageController.prototype.is = function ( slug, looseMatch ) {
    var ret = false,
        reg;

    reg = new RegExp( looseMatch ? ("^" + slug) : ("^" + slug + "$") );
    ret = reg.test( _currentRoute );

    return ret;
};


// Expose
window.provide( "PageController", PageController );

})( window, window.require( "Controller" ), window.require( "Router" ) );
/*!
 *
 * Handle lazy-loading images with contextual load conditions.
 *
 * @ImageLoader
 * @author: kitajchuk
 *
 *
 */
(function ( window, document, undefined ) {


"use strict";


var raf = window.requestAnimationFrame,
    caf = window.cancelAnimationFrame,

    _i,
    _all = 0,
    _num = 0,
    _raf = null,
    _ini = false,

    // Holds all "instances"
    // This way we can use a single animator
    _instances = [];


// Should support elements as null, undefined, DOMElement, HTMLCollection, string selector
function setElements( elements ) {
    // Handles string selector
    if ( typeof elements === "string" ) {
        elements = document.querySelectorAll( elements );

    // Handles DOMElement
    } else if ( elements && elements.nodeType === 1 ) {
        elements = [ elements ];
    
    } else if ( !elements ) {
        elements = [];
    }

    // Default:
    // HTMLCollection / Array
    return elements;
}


// Called when instances are created
function initializer( instance ) {
    // Increment ALL
    _all = _all + instance._num2Load;

    // Private instances array
    _instances.push( instance );

    // One stop shopping
    if ( !_ini ) {
        _ini = true;
        animate();
    }
}


// Called on each iteration of the animation cycle
function animate() {
    if ( _num !== _all ) {
        _raf = raf( animate );

        for ( _i = _instances.length; _i--; ) {
            if ( _instances[ _i ]._numLoaded !== _instances[ _i ]._num2Load && _instances[ _i ]._loadType === "async" ) {
                _instances[ _i ].handle();
            }
        }

    } else {
        caf( _raf );

        _raf = null;
        _ini = false;
    }
}


// Simple add class polyfill
function addClass( el, str ) {
    var newClass = str.split( " " ),
        elsClass = el.className.split( " " );

    for ( var i = 0, len = newClass.length; i < len; i++ ) {
        if ( elsClass.indexOf( newClass[ i ] ) === -1 ) {
            elsClass.push( newClass[ i ] );
        }
    }

    el.className = elsClass.join( " " );
}


// Simple remove class polyfill
function removeClass( el, str ) {
    var oldClass = str.split( " " ),
        elsClass = el.className.split( " " );

    for ( var i = 0, len = oldClass.length; i < len; i++ ) {
        if ( elsClass.indexOf( oldClass[ i ] ) !== -1 ) {
            elsClass.splice( elsClass.indexOf( oldClass[ i ] ), 1 );
        }
    }

    el.className = elsClass.join( " " );
}


/**
 *
 * Handle lazy-loading images with unique callback conditions
 * @memberof! <global>
 * @requires raf
 * @constructor ImageLoader
 * @param {object} options Controller settings
 * <ul>
 * <li>elements - The collection of elements to load against</li>
 * <li>property - The property to pull the image source from</li>
 * <li>transitionDelay - The timeout before transition starts</li>
 * <li>transitionDuration - The length of the animation</li>
 * </ul>
 *
 */
var ImageLoader = function () {
    return this.init.apply( this, arguments );
};


/**
 *
 * ClassName for the element loading state
 * @member IS_LOADING
 * @memberof ImageLoader
 *
 */
ImageLoader.IS_LOADING = "-is-lazy-loading";


/**
 *
 * ClassName for the element transitioning state
 * @member IS_TRANSITION
 * @memberof ImageLoader
 *
 */
ImageLoader.IS_TRANSITION = "-is-lazy-transition";


/**
 *
 * ClassName for the elements loaded state
 * @member IS_LOADED
 * @memberof ImageLoader
 *
 */
ImageLoader.IS_LOADED = "-is-lazy-loaded";


/**
 *
 * ClassName to define the element as having been loaded
 * @member IS_HANDLED
 * @memberof ImageLoader
 *
 */
ImageLoader.IS_HANDLED = "-is-lazy-handled";


ImageLoader.prototype = {
    constructor: ImageLoader,

    init: function ( options ) {
        var self = this;

        if ( !options ) {
            throw new Error( "ImageLoader Class requires options to be passed" );
        }

        /**
         *
         * The Collection to load against
         * @memberof ImageLoader
         * @member _elements
         * @private
         *
         */
        this._elements = setElements( options.elements );

        /**
         *
         * The property to get image source from
         * @memberof ImageLoader
         * @member _property
         * @private
         *
         */
        this._property = (options.property || "data-src");

        /**
         *
         * The way to load, async or sync
         * Using "sync" loading requires calling .start() on the instance
         * and the "handle" event will not be utilized, rather each image
         * will be loaded in succession as the previous finishes loading
         * @memberof ImageLoader
         * @member _loadType
         * @private
         *
         */
        this._loadType = (options.loadType || "async");

        /**
         *
         * The current amount of elements lazy loaded
         * @memberof ImageLoader
         * @member _numLoaded
         * @private
         *
         */
        this._numLoaded = 0;

        /**
         *
         * The total amount of elements to lazy load
         * @memberof ImageLoader
         * @member _num2Load
         * @private
         *
         */
        this._num2Load = (this._elements ? this._elements.length : 0);

        /**
         *
         * The delay to execute lazy loading on an element in ms
         * @memberof ImageLoader
         * @member _transitionDelay
         * @default 100
         * @private
         *
         */
        this._transitionDelay = (options.transitionDelay || 100);

        /**
         *
         * The duration on a lazy loaded elements fade in in ms
         * @memberof ImageLoader
         * @member _transitionDuration
         * @default 600
         * @private
         *
         */
        this._transitionDuration = (options.transitionDuration || 600);

        /**
         *
         * This flags that all elements have been loaded
         * @memberof ImageLoader
         * @member _resolved
         * @private
         *
         */
        this._resolved = false;

        /**
         *
         * Defined event namespaced handlers
         * @memberof ImageLoader
         * @member _handlers
         * @private
         *
         */
        this._handlers = {
            data: null,
            load: null,
            done: null,
            error: null,
            update: null
        };

        // Break out if no elements in collection
        if ( !this._elements.length ) {
            return this;
        }

        // Only run animation frame for async loading
        if ( this._loadType === "async" ) {
            initializer( this );

        } else {
            this._syncLoad();
        }
    },

    /**
     *
     * Add a callback handler for the specified event name
     * @memberof ImageLoader
     * @method on
     * @param {string} event The event name to listen for
     * @param {function} handler The handler callback to be fired
     *
     */
    on: function ( event, handler ) {
        this._handlers[ event ] = handler;

        return this;
    },
    
    /**
     *
     * Fire the given event for the loaded element
     * @memberof ImageLoader
     * @method fire
     * @returns bool
     *
     */
    fire: function ( event, element ) {
        var ret = false;

        if ( typeof this._handlers[ event ] === "function" ) {
            ret = this._handlers[ event ].call( this, element );
        }

        return ret;
    },

    /**
     *
     * Iterate over elements and fire the update handler
     * @memberof ImageLoader
     * @method update
     *
     * @fires update
     *
     */
    update: function () {
        var self = this;

        for ( var i = 0, len = this._elements.length; i < len; i++ ) {
            var element = this._elements[ i ];

            this.fire( "update", element );
        }
    },
    
    /**
     *
     * Perform the image loading and set correct values on element
     * @method load
     * @memberof ImageLoader
     * @param {object} $elem element object
     * @param {function} callback optional callback for each load
     *
     * @fires done
     *
     */
    load: function ( element, callback ) {
        var self = this,
            image = null,
            timeout = null,
            isImage = (element.nodeName.toLowerCase() === "img"),
            source = element.getAttribute( this._property );

        element.setAttribute( "data-imageloader", true );

        addClass( element, ImageLoader.IS_LOADING );

        if ( isImage ) {
            image = element;

        } else {
            image = new Image();
        }

        timeout = setTimeout(function () {
            clearTimeout( timeout );

            addClass( element, ImageLoader.IS_TRANSITION );

            image.onload = function () {
                self.fire( "load", element );

                if ( !isImage ) {
                    element.style.backgroundImage = ("url(" + source + ")");

                    image = null;
                }

                addClass( element, ImageLoader.IS_LOADED );

                timeout = setTimeout(function () {
                    clearTimeout( timeout );

                    removeClass( element, ImageLoader.IS_LOADING + " " + ImageLoader.IS_TRANSITION + " " + ImageLoader.IS_LOADED )
                    addClass( element, ImageLoader.IS_HANDLED );

                    if ( (self._numLoaded === self._num2Load) && !self._resolved ) {
                        self._resolved = true;

                        // Fires the predefined "done" event
                        self.fire( "done" );

                    } else if ( typeof callback === "function" ) {
                        // Errors first
                        callback( false );
                    }

                }, self._transitionDuration );
            };

            image.onerror = function () {
                self.fire( "error", element );

                if ( (self._numLoaded === self._num2Load) && !self._resolved ) {
                    self._resolved = true;

                    // Fires the predefined "done" event
                    self.fire( "done" );

                } else if ( typeof callback === "function" ) {
                    // Errors first
                    callback( true );
                }
            };

            image.src = source;

        }, this._transitionDelay );

        return this;
    },

    /**
     *
     * Handles element iterations and loading based on callbacks
     * @memberof ImageLoader
     * @method handle
     *
     * @fires handle
     *
     */
    handle: function () {
        var elems = this._getNotLoaded(),
            self = this;

        for ( var i = 0, len = elems.length; i < len; i++ ) {
            var elem = elems[ i ];

            // Fires the predefined "data" event
            if ( self.fire( "data", elem ) ) {
                _num++;

                self._numLoaded++;

                self.load( elem );
            }
        }
    },

    /**
     *
     * Get all images in the set that have yet to be loaded
     * @memberof ImageLoader
     * @method _getNotLoaded
     * @private
     *
     */
    _getNotLoaded: function () {
        var elems = [];

        for ( var i = 0, len = this._elements.length; i < len; i++ ) {
            if ( !this._elements[ i ].getAttribute( "data-imageloader" ) ) {
                elems.push( this._elements[ i ] );
            }
        }

        return elems;
    },

    /**
     *
     * Support batch synchronous loading of a set of images
     * @memberof ImageLoader
     * @method _syncLoad
     * @private
     *
     */
    _syncLoad: function () {
        var self = this;

        function syncLoad() {
            var elem = self._elements[ self._numLoaded ];

            self._numLoaded++;

            self.load( elem, function ( error ) {
                if ( !error && !self._resolved ) {
                    syncLoad();
                }
            });
        }

        syncLoad();
    }
};


// Expose
window.provide( "ImageLoader", ImageLoader );

})( window,  window.document );
/*!
 *
 * A complete management tool for html5 video and audio context
 *
 * @MediaBox
 * @singleton
 * @author: kitajchuk
 *
 */
(function ( window, document, Easing, Tween, undefined ) {


"use strict";


/******************************************************************************
 * @Private API
*******************************************************************************/

/**
 *
 * Expression match hashbang/querystring
 * @member rHashQuery
 * @private
 *
 */
var rHashQuery = /[#|?].*$/g,

/**
 *
 * Replace "no" in canPlayType strings
 * @member rNos
 * @private
 *
 */
rNos = /^no$/,

/**
 *
 * Clean up all those typeof's
 * @method isFunction
 * @returns boolean
 * @private
 *
 */
isFunction = function ( fn ) {
    return (typeof fn === "function");
},

/**
 *
 * Test that an object is an Element
 * @method isElement
 * @returns boolean
 * @private
 *
 */
isElement = function ( el ) {
    return (el instanceof HTMLElement);
},

/**
 *
 * Borrowed(ish)
 * Modernizr v2.7.1
 * www.modernizr.com
 * Copyright (c) Faruk Ates, Paul Irish, Alex Sexton
 * Available under the BSD and MIT licenses: www.modernizr.com/license/
 * @method getAudioSupport
 * @returns object
 * @private
 *
 */
getAudioSupport = function () {
    var elem = document.createElement( "audio" ),
        ret = {};

    try {
        if ( elem.canPlayType ) {
            ret.ogg = elem.canPlayType( 'audio/ogg; codecs="vorbis"' ).replace( rNos, "" );
            ret.mp3 = elem.canPlayType( 'audio/mpeg;' ).replace( rNos, "" );
            ret.wav = elem.canPlayType( 'audio/wav; codecs="1"').replace( rNos, "" );
            ret.m4a = (elem.canPlayType( 'audio/x-m4a;' ) || elem.canPlayType( 'audio/aac;' )).replace( rNos, "" );
        }

    } catch ( e ) {}

    return ret;
},

/**
 *
 * Borrowed(ish)
 * Modernizr v2.7.1
 * www.modernizr.com
 * Copyright (c) Faruk Ates, Paul Irish, Alex Sexton
 * Available under the BSD and MIT licenses: www.modernizr.com/license/
 * @method getVideoSupport
 * @returns object
 * @private
 *
 */
getVideoSupport = function () {
    var elem = document.createElement( "video" ),
        ret = {};

    try {
        if ( elem.canPlayType ) {
            ret.mpeg4 = elem.canPlayType( 'video/mp4; codecs="mp4v.20.8"' ).replace( rNos, "" );
            ret.ogg = elem.canPlayType( 'video/ogg; codecs="theora"' ).replace( rNos, "" );
            ret.h264 = elem.canPlayType( 'video/mp4; codecs="avc1.42E01E"' ).replace( rNos, "" );
            ret.webm = elem.canPlayType( 'video/webm; codecs="vp8, vorbis"' ).replace( rNos, "" );
        }

    } catch ( e ) {}

    return ret;
},

/**
 *
 * Play an audio context
 * @method sourceStart
 * @param {string} track audio object to play
 * @private
 *
 */
sourceStart = function ( track ) {
    if ( !track.source.start ) {
        track.source.noteOn( 0, track.startOffset % track.buffer.duration );

    } else {
        track.source.start( 0, track.startOffset % track.buffer.duration );
    }
},

/**
 *
 * Stop an audio context
 * @method sourceStop
 * @param {string} track audio object to stop
 * @private
 *
 */
sourceStop = function ( track ) {
    // Since we create/destroy the audio context
    // we have to check that the source is valid
    // otherwise this will throw an Uncaught TypeError:
    // "Cannot read property 'stop' of null"
    if ( !track.source ) {
        return;
    }

    if ( !track.source.stop ) {
        track.source.noteOff( 0 );

    } else {
        track.source.stop( 0 );
    }
},

/**
 *
 * Get mimetype string from media source
 * @method getMimeFromMedia
 * @param {string} src media file source
 * @private
 *
 */
getMimeFromMedia = function ( src ) {
    var ret;

    switch ( src.split( "." ).pop().toLowerCase().replace( rHashQuery, "" ) ) {
        // Audio mimes
        case "ogg":
            ret = "audio/ogg";
            break;
        case "mp3":
            ret = "audio/mpeg";
            break;

        // Video mimes
        case "webm":
            ret = "video/webm";
            break;
        case "mp4":
            ret = "video/mp4";
            break;
        case "ogv":
            ret = "video/ogg";
            break;
    }

    return ret;
},

/**
 *
 * Get the audio source that should be used
 * @method getCanPlaySource
 * @param {string} media the media type to check
 * @param {array} sources Array of media sources
 * @returns object
 * @private
 *
 */
getCanPlaySource = function ( media, sources ) {
    var source, canPlay;

    for ( var i = sources.length; i--; ) {
        var src = sources[ i ].split( "." ).pop().toLowerCase().replace( rHashQuery, "" );

        if ( media === "video" && src === "mp4" ) {
            if ( (MediaBox.support.video.mpeg4 === "probably" || MediaBox.support.video.h264 === "probably") ) {
                source = sources[ i ];

                canPlay = "probably";

            } else if ( (MediaBox.support.video.mpeg4 === "maybe" || MediaBox.support.video.h264 === "maybe") ) {
                source = sources[ i ];

                canPlay = "maybe";
            }

        } else if ( MediaBox.support[ media ][ src ] === "probably" ) {
            source = sources[ i ];

            canPlay = "probably";

        } else if ( MediaBox.support[ media ][ src ] === "maybe" ) {
            source = sources[ i ];

            canPlay = "maybe";
        }

        if ( source ) {
            break;
        }
    }

    return {
        source: source,
        canPlay: canPlay
    };
},


/**
 *
 * Process load data each time a request fulfills
 * @method _processLoaded
 * @private
 *
 */
processLoaded = function () {
    _mediaLoads++;
    
    if ( isFunction( _progressHandler ) ) {
        _progressHandler({
            total: _mediaCount,
            loaded: _mediaLoads,
            decimalPercent: (_mediaLoads / _mediaCount),
            wholePercent: (_mediaLoads / _mediaCount) * 100
        });
    }

    // Reset the media counters after this batch is loaded
    if ( _mediaLoads === _mediaCount ) {
        _mediaCount = 0;
        _mediaLoads = 0;
    }
},


/**
 *
 * MediaBox crossbrowser create audio context
 * @method createAudioContext
 * @returns instance of audio context
 *
 */
createAudioContext = function () {
    var AudioContext;

    if ( window.AudioContext ) {
        AudioContext = window.AudioContext;

    } else if ( window.webkitAudioContext ) {
        AudioContext = window.webkitAudioContext;
    }

    return ( AudioContext ) ? new AudioContext() : AudioContext;
},


/**
 *
 * MediaBox crossbrowser create gain node
 * @method createGainNode
 * @param {object} context The AudioContext
 * @returns audio context gain node
 *
 */
createGainNode = function ( context ) {
    var gainNode;

    if ( !context.createGain ) {
        gainNode = context.createGainNode();

    } else {
        gainNode = context.createGain();
    }

    return gainNode;
},


/**
 *
 * MediaBox clear a timeupdate interval for audio/video tracks
 * @method clearPlaybackUpdate
 * @param {object} track The media object
 *
 */
clearPlaybackUpdate = function ( track ) {
    try {
        clearInterval( track._update );

        track._update = null;

    } catch ( error ) {}
},


/**
 *
 * MediaBox init constructor for singleton
 * @method init
 * @private
 *
 */
init = function () {
    _instance = this;
},


/**
 *
 * MediaBox information for each channel.
 * These are default channels you can use.
 * <ul>
 * <li>bgm - background music channel</li>
 * <li>sfx - sound effects channel</li>
 * <li>vid - video channel</li>
 * </ul>
 * @member _channels
 * @private
 *
 */
_channels = {
    bgm: {
        volume: 1
    },
    sfx: {
        volume: 1
    },
    vid: {
        volume: 1
    }
},

/**
 *
 * MediaBox holds all loaded source urls
 * @member _urls
 * @private
 *
 */
_urls = [],

/**
 *
 * MediaBox holds all audio tracks
 * @member _audio
 * @private
 *
 */
_audio = {},

/**
 *
 * MediaBox holds all video tracks
 * @member _video
 * @private
 *
 */
_video = {},

/**
 *
 * Total number of media objects to load
 * @member _mediaCount
 * @private
 *
 */
_mediaCount = 0,

/**
 *
 * Total number of media objects loaded in progress
 * @member _mediaLoads
 * @private
 *
 */
_mediaLoads = 0,

/**
 *
 * The progress event handler
 * @member _progressHandler
 * @private
 *
 */
_progressHandler = null,


/**
 *
 * The singleton instance for MediaBox
 * @member _instance
 * @private
 *
 */
_instance = null,


/**
 *
 * Use a single audio context to avoid issues
 * @member _audioContext
 * @private
 *
 */
_audioContext = null,


/**
 *
 * Store value for running intervals at 60fps
 * @member _audioContext
 * @private
 *
 */
_60FPS = (1000 / 60),


/******************************************************************************
 * @Public API
*******************************************************************************/

/**
 *
 * A complete management tool for html5 video and audio context
 * @constructor MediaBox
 * @requires Tween
 * @memberof! <global>
 *
 */
MediaBox = function () {
    return (_instance || init.apply( this, arguments ));
};

/**
 *
 * MediaBox support object
 * @memberof MediaBox
 * @member support
 *
 */
MediaBox.support = {
    audio: getAudioSupport(),
    video: getVideoSupport()
};

/**
 *
 * MediaBox stopped state constant
 * @memberof MediaBox
 * @member STATE_STOPPED
 *
 */
MediaBox.STATE_STOPPED = 0;

/**
 *
 * MediaBox stopping state constant
 * @memberof MediaBox
 * @member STATE_STOPPING
 *
 */
MediaBox.STATE_STOPPING = 1;

/**
 *
 * MediaBox paused state constant
 * @memberof MediaBox
 * @member STATE_PAUSED
 *
 */
MediaBox.STATE_PAUSED = 2;

/**
 *
 * MediaBox playing state constant
 * @memberof MediaBox
 * @member STATE_PLAYING
 *
 */
MediaBox.STATE_PLAYING = 3;

/**
 *
 * MediaBox prototype
 *
 */
MediaBox.prototype = {
    constructor: MediaBox,

    /**
     *
     * MediaBox check if media is loaded via ajax
     * @memberof MediaBox
     * @method isLoaded
     * @param {string} id reference id for media
     * @returns boolean
     *
     */
    isLoaded: function ( id ) {
        var obj = _video[ id ] ? _video[ id ] : _audio[ id ];

        return (obj.loaded === true);
    },

    /**
     *
     * MediaBox check stopped/paused status for audio/video
     * @memberof MediaBox
     * @method isStopped
     * @param {string} id reference id for media
     * @returns boolean
     *
     */
    isStopped: function ( id ) {
        var obj = _video[ id ] ? _video[ id ] : _audio[ id ];

        return (obj.state === MediaBox.STATE_STOPPED);
    },

    /**
     *
     * MediaBox check stopped/paused status for audio/video
     * @memberof MediaBox
     * @method isPaused
     * @param {string} id reference id for media
     * @returns boolean
     *
     */
    isPaused: function ( id ) {
        var obj = _video[ id ] ? _video[ id ] : _audio[ id ];

        return (obj.state === MediaBox.STATE_PAUSED);
    },

    /**
     *
     * MediaBox check playing status for audio/video
     * @memberof MediaBox
     * @method isPlaying
     * @param {string} id reference id for media
     * @returns boolean
     *
     */
    isPlaying: function ( id ) {
        var obj = _video[ id ] ? _video[ id ] : _audio[ id ];

        return (obj.state === MediaBox.STATE_PLAYING || obj.state === MediaBox.STATE_STOPPING);
    },

    /**
     *
     * MediaBox set volume for audio OR video
     * @memberof MediaBox
     * @method setVolume
     * @param {string} id reference id for media
     * @param {number} volume the volume to set to
     *
     */
    setVolume: function ( id, volume ) {
        var obj = _video[ id ] ? _video[ id ] : _audio[ id ];

        // Audio
        if ( obj.type === "audio" ) {
            obj.gainNode.gain.value = volume;

        // Video
        } else {
            obj.element.volume = volume;
        }
    },

    /**
     *
     * MediaBox set volume for audio OR video
     * @memberof MediaBox
     * @method getVolume
     * @param {string} id reference id for media
     * @returns number
     *
     */
    getVolume: function ( id ) {
        var obj = _video[ id ] ? _video[ id ] : _audio[ id ];

        return ( obj.type === "audio" ) ? obj.gainNode.gain.value : obj.element.volume;
    },

    /**
     *
     * MediaBox play a media object abstractly
     * @memberof MediaBox
     * @method playObject
     * @param {string} id reference id for media
     * @param {function} callback optional callback to fire on decodeAudioData
     *
     */
    playObject: function ( id, callback ) {
        var obj = _video[ id ] ? _video[ id ] : _audio[ id ];

        // Audio
        if ( obj.type === "audio" ) {
            this.playAudio( id, callback );

        // Video
        } else {
            this.playVideo( id );
        }
    },

    /**
     *
     * MediaBox stop a media object abstractly
     * @memberof MediaBox
     * @method stopObject
     * @param {string} id reference id for media
     *
     */
    stopObject: function ( id ) {
        var obj = _video[ id ] ? _video[ id ] : _audio[ id ];

        // Audio
        if ( obj.type === "audio" ) {
            this.stopAudio( id );

        // Video
        } else {
            this.stopVideo( id );
        }
    },

    /**
     *
     * MediaBox kill a media object abstractly
     * @memberof MediaBox
     * @method destroyObject
     * @param {string} id reference id for media
     *
     */
    destroyObject: function ( id ) {
        // First stop the media playback abstractly
        this.stopObject( id );

        _video[ id ] = null;
        _audio[ id ] = null;

        delete _video[ id ];
        delete _audio[ id ];
    },

    /**
     *
     * MediaBox load media config JSON formatted in Akihabara bundle style
     * @memberof MediaBox
     * @method loadMedia
     * @param {string} url The url to the JSON config
     * @param {function} callback Fired when all media is loaded
     * @example Akihabara bundle format
     * "addAudio": [
     *     [
     *         "{id}",
     *         [
     *             "{file}.mp3",
     *             "{file}.ogg"
     *         ],
     *         {
     *             "channel": "bgm",
     *             "loop": true
     *         }
     *     ]
     * ]
     *
     */
    loadMedia: function ( url, callback ) {
        var xhr = new XMLHttpRequest(),
            self = this;

        xhr.open( "GET", url, true );
        xhr.onreadystatechange = function ( e ) {
            if ( this.readyState === 4 ) {
                if ( this.status === 200 ) {
                    var response;

                    try {
                        response = JSON.parse( this.responseText );

                    } catch ( error ) {}

                    if ( response ) {
                        self.addMedia( response, callback );
                    }
                }
            }
        };
        xhr.send();
    },

    /**
     *
     * MediaBox add media from bundle json
     * @memberof MediaBox
     * @method addMedia
     * @param {object} json Akihabara formatted media bundle object
     * @param {function} callback function fired on XMLHttpRequest.onload
     *
     */
    addMedia: function ( json, callback ) {
        var current = 0,
            total = 0,
            func = function () {
                current++;

                if ( isFunction( callback ) && (current === total) ) {
                    callback();
                }
            };

        for ( var m in json ) {
            total = total + json[ m ].length;

            _mediaCount = total;

            for ( var i = json[ m ].length; i--; ) {
                // Reference to this.addVideo / this.addAudio
                this[ m ]( json[ m ][ i ], func );
            }
        }
    },

    /**
     *
     * Bind the progress handler for a given batch of media
     * @memberof MediaBox
     * @method addProgress
     * @param {function} callback function fired on progress processing
     *
     */
    addProgress: function ( callback ) {
        _progressHandler = callback;
    },

    /**
     *
     * MediaBox add a video element
     * @memberof MediaBox
     * @method addVideo
     * @param {array} obj Akihabara formatted media bundle
     * @param {function} callback function fired on XMLHttpRequest.onload
     * @example Video object
     * {
     *      type:           string,
     *      channel:        string,
     *      sources:        array,
     *      element:        DOMElement
     *      state:          number
     *      loaded:         boolean
     *      _source:        object {source:string, canPlay:string},
     *      _events:        object
     * }
     *
     */
    addVideo: function ( obj, callback ) {
        var id = obj.id,
            src = obj.src,
            props = {
                element: obj.element,
                channel: obj.channel,
                CORS: (obj.CORS || false)
            },
            mediaObj = {},

            // Handle the loaded video
            handler = function () {
                var source = document.createElement( "source" );
                    source.src = mediaObj._source.source;
                    source.type = getMimeFromMedia( mediaObj._source.source );

                processLoaded();

                mediaObj.loaded = true;
                mediaObj.element.appendChild( source );

                _video[ id ] = mediaObj;

                if ( isFunction( callback ) ) {
                    callback();
                }
            },
            xhr;

        // Disallow overrides
        if ( _video[ id ] || !id || !src ) {
            //console.log( "@MediaBox:addVideo Already added " + id );
            return;
        }

        // Allow new channels to exist
        if ( !_channels[ props.channel ] ) {
            _channels[ props.channel ] = {};
        }

        // Create video object
        mediaObj.type = "video";
        mediaObj.state = MediaBox.STATE_STOPPED;
        mediaObj.loaded = false;
        mediaObj.element = (props.element || document.createElement( "video" ));
        mediaObj.channel = props.channel;
        mediaObj.sources = src;
        mediaObj._source = getCanPlaySource( "video", src );
        mediaObj._events = {};
        mediaObj._update = null;

        // Check if we have loaded this url before
        // If so, we don't want to make another request for it
        // but we still need to create the video object out of it
        if ( _urls.indexOf( mediaObj._source.source ) !== -1 ) {
            if ( isFunction( callback ) ) {
                handler();
                return;
            }
        }

        // Push the source onto the loaded url stack
        _urls.push( mediaObj._source.source );

        // Bypass the preload process with xhr if CORS
        // Currently, we don't support doing this request type
        if ( props.CORS ) {
            handler();
            return;
        }

        xhr = new XMLHttpRequest();
        xhr.open( "GET", mediaObj._source.source, true );
        xhr.onload = function ( e ) {
            handler();
        };
        xhr.send();
    },

    /**
     *
     * MediaBox append the video element to another element
     * @memberof MediaBox
     * @method appendVideoTo
     * @param {string} id Video id to add event for
     * @param {object} element The element to append to
     *
     */
    appendVideoTo: function ( id, element ) {
        if ( _video[ id ] && isElement( element ) ) {
            element.appendChild( _video[ id ].element );
        }
    },

    /**
     *
     * MediaBox prepend the video element to another element
     * @memberof MediaBox
     * @method appendVideoTo
     * @param {string} id Video id
     * @param {object} element The element to pepend to
     *
     */
    prependVideoTo: function ( id, element ) {
        if ( _video[ id ] && isElement( element ) ) {
            if ( element.hasChildNodes() ) {
                element.insertBefore( _video[ id ].element, element.firstChild );
                
            } else {
                this.appendVideoTo( id, element );
            }
        }
    },

    /**
     *
     * MediaBox replace an existing element with the mediabox video element
     * @memberof MediaBox
     * @method replaceAsVideo
     * @param {string} id Video id
     * @param {object} element The element to be replaced
     *
     */
    replaceAsVideo: function ( id, element ) {
        if ( _video[ id ] && isElement( element ) ) {
            element.parentNode.replaceChild( _video[ id ].element, element );
        }
    },

    /**
     *
     * MediaBox get a video element property/attribute
     * @memberof MediaBox
     * @method getVideoProp
     * @param {string} id Video id
     * @param {string} prop The property to access
     *
     */
    getVideoProp: function ( id, prop ) {
        if ( _video[ id ] ) {
            return (_video[ id ].element[ prop ] || _video[ id ].element.getAttribute( prop ));
        }
    },

    /**
     *
     * MediaBox set a video element property/attribute
     * @memberof MediaBox
     * @method setVideoProp
     * @param {string} id Video id
     * @param {string} prop The property to set
     * @param {mixed} value The value to assign
     *
     */
    setVideoProp: function ( id, prop, value ) {
        if ( _video[ id ] ) {
            _video[ id ].element[ prop ] = value;
        }
    },

    /**
     *
     * MediaBox set a video element attribute
     * @memberof MediaBox
     * @method setVideoAttr
     * @param {string} id Video id
     * @param {string} prop The property to set
     * @param {mixed} value The value to assign
     *
     */
    setVideoAttr: function ( id, prop, value ) {
        if ( _video[ id ] ) {
            _video[ id ].element.setAttribute( prop, value );
        }
    },

    /**
     *
     * MediaBox add a video element event listener
     * @memberof MediaBox
     * @method addVideoEvent
     * @param {string} id Video id to add event for
     * @param {string} event Event to add
     * @param {function} callback The event handler to call
     *
     */
    addVideoEvent: function ( id, event, callback ) {
        if ( _video[ id ] ) {
            // Capture timeupdate to run at 60fps instead
            if ( event === "timeupdate" ) {
                _video[ id ]._events.timeupdate = callback;
                return;
            }

            _video[ id ]._events[ event ] = function () {
                if ( isFunction( callback ) ) {
                    callback.apply( this, arguments );
                }
            };

            _video[ id ].element.addEventListener( event, _video[ id ]._events[ event ], false );
        }
    },

    /**
     *
     * MediaBox remove a video element event listener
     * @memberof MediaBox
     * @method addVideoEvent
     * @param {string} id Video id to remove event for
     * @param {string} event Event to remove
     *
     */
    removeVideoEvent: function ( id, event ) {
        if ( _video[ id ] ) {
            // Capture timeupdate to run at 60fps instead
            if ( event === "timeupdate" ) {
                clearPlaybackUpdate( _video[ id ] );
            }

            _video[ id ].element.removeEventListener( event, _video[ id ]._events[ event ], false );

            _video[ id ]._events[ event ] = null;
        }
    },

    /**
     *
     * MediaBox get video object by id
     * @memberof MediaBox
     * @method getVideo
     * @param {string} id reference id for media
     * @returns object
     *
     */
    getVideo: function ( id ) {
        if ( _video[ id ] ) {
            return _video[ id ];
        }
    },

    /**
     *
     * MediaBox get all video objects
     * @memberof MediaBox
     * @method getVideos
     * @returns object
     *
     */
    getVideos: function () {
        return _video;
    },

    /**
     *
     * MediaBox play video element by id
     * @memberof MediaBox
     * @method playVideo
     * @param {string} id reference id for media
     *
     */
    playVideo: function ( id ) {
        if ( _video[ id ] && this.isLoaded( id ) && (this.isStopped( id ) || this.isPaused( id )) ) {
            _video[ id ].element.volume = _channels[ _video[ id ].channel ].volume;
            _video[ id ].element.play();
            _video[ id ].state = MediaBox.STATE_PLAYING;

            if ( !_video[ id ]._update ) {
                _video[ id ]._update = setInterval(function () {
                    if ( isFunction( _video[ id ]._events.timeupdate ) ) {
                        _video[ id ]._events.timeupdate.call( _video[ id ].element, null );
                    }

                }, _60FPS );
            }
        }
    },

    /**
     *
     * MediaBox stop video element by id with a paused state
     * @memberof MediaBox
     * @method pauseVideo
     * @param {string} id reference id for media
     *
     */
    pauseVideo: function ( id ) {
        if ( _video[ id ] && this.isLoaded( id ) && this.isPlaying( id ) ) {
            _video[ id ].element.pause();
            _video[ id ].state = MediaBox.STATE_PAUSED;

            clearPlaybackUpdate( _video[ id ] );
        }
    },

    /**
     *
     * MediaBox stop video element by id with a stopped state
     * @memberof MediaBox
     * @method playVideo
     * @param {string} id reference id for media
     *
     */
    stopVideo: function ( id ) {
        if ( _video[ id ] && this.isLoaded( id ) && this.isPlaying( id ) ) {
            _video[ id ].element.pause();
            _video[ id ].state = MediaBox.STATE_STOPPED;

            clearPlaybackUpdate( _video[ id ] );
        }
    },

    /**
     *
     * MediaBox add an audio context
     * @memberof MediaBox
     * @method addAudio
     * @param {array} obj Akihabara formatted media bundle
     * @param {function} callback function fired on XMLHttpRequest.onload
     * @example Audio object
     * {
     *      type:           string,
     *      channel:        string,
     *      loop:           boolean
     *      sources:        array,
     *      context:        AudioContext
     *      state:          number
     *      loaded:         boolean
     *      startTime:      number,
     *      startOffset:    number,
     *      buffer:         ArrayBuffer,
     *      gainNode:       GainNode,
     *      _source:    object {source:string, canPlay:string},
     * }
     *
     * ISSUE: Chrome limits to 6 audio contexts at a time
     * SOLVE: Create and destroy the context, buffer and gainNode on play and stop
     * LINKS:
     * https://code.google.com/p/chromium/issues/detail?id=308784
     * https://gitorious.org/blink/blink/commit/18292eb255a9aa50d3b1b372bb74d34fda55d217
     *
     */
    addAudio: function ( obj, callback ) {
        var id = obj.id,
            src = obj.src,
            props = {
                loop: obj.loop,
                channel: obj.channel,
                CORS: (obj.CORS || false)
            },
            mediaObj = {},
            xhr;

        // Create single audio context
        if ( !_audioContext ) {
            _audioContext = createAudioContext();
        }

        // Disallow overrides
        if ( _audio[ id ] || !id || !src ) {
            //console.log( "@MediaBox:addAudio Already added " + id );
            return;
        }
        
        // Allow new channels to exist
        if ( !_channels[ props.channel ] ) {
            _channels[ props.channel ] = {};
        }

        // Create audio object
        mediaObj.type = "audio";
        mediaObj.channel = props.channel;
        mediaObj.loop = (props.loop || false);
        mediaObj.sources = src;
        mediaObj.state = MediaBox.STATE_STOPPED;
        mediaObj.loaded = false;
        mediaObj._source = getCanPlaySource( "audio", src );
        mediaObj._events = {};
        mediaObj._update = null;

        // Track the audio position
        mediaObj.startTime = 0;
        mediaObj.startOffset = 0;

        // The context, buffer and gainNode will create/destroy on play/stop
        mediaObj.context = _audioContext;
        mediaObj.buffer = null;
        mediaObj.gainNode = null;
        mediaObj.source = null;

        xhr = new XMLHttpRequest();
        xhr.open( "GET", mediaObj._source.source, true );
        xhr.responseType = "arraybuffer";
        xhr.onload = function ( e ) {
            _audioContext.decodeAudioData( xhr.response, function ( buffer ) {
                processLoaded();

                mediaObj.loaded = true;
                mediaObj.buffer = buffer;

                _audio[ id ] = mediaObj;

                if ( isFunction( callback ) ) {
                    callback();
                }
            });
        };
        xhr.send();
    },

    /**
     *
     * MediaBox add an event listener for audio callbacks to match video ones
     * Supports adding "ended", "timeupdate", "play" and "pause"
     * @memberof MediaBox
     * @method addAudioEvent
     * @param {string} id Audio id to add event for
     * @param {string} event Event to add
     * @param {function} callback The event handler to call
     *
     */
    addAudioEvent: function ( id, event, callback ) {
        if ( _audio[ id ] ) {
            _audio[ id ]._events[ event ] = function () {
                if ( isFunction( callback ) ) {
                    callback.apply( this, arguments );
                }
            };
        }
    },

    /**
     *
     * MediaBox remove an event listener for audio callbacks
     * @memberof MediaBox
     * @method removeAudioEvent
     * @param {string} id Audio id to remove event for
     * @param {string} event Event to remove
     *
     */
    removeAudioEvent: function ( id, event ) {
        if ( _audio[ id ] ) {
            _audio[ id ]._events[ event ] = null;
        }
    },

    /**
     *
     * MediaBox get audio object by id
     * @memberof MediaBox
     * @method getAudio
     * @param {string} id reference id for media
     * @returns object
     *
     */
    getAudio: function ( id ) {
        if ( _audio[ id ] ) {
            return _audio[ id ];
        }
    },

    /**
     *
     * MediaBox get all audio objects
     * @memberof MediaBox
     * @method getAudios
     * @returns object
     *
     */
    getAudios: function () {
        return _audio;
    },

    /**
     *
     * MediaBox get the duration of an audio object
     * @memberof MediaBox
     * @method getAudioDuration
     * @param {string} id string reference id for audio
     * @returns number
     *
     */
    getAudioDuration: function ( id ) {
        if ( _audio[ id ] && _audio[ id ].buffer ) {
            return _audio[ id ].buffer.duration;
        }
    },

    /**
     *
     * MediaBox set the current time of an audio object
     * @memberof MediaBox
     * @method setAudioCurrentTime
     * @param {string} id string reference id for audio
     * @param {number} time The time to set the audio playback to
     * @returns object
     *
     */
    setAudioCurrentTime: function ( id, time ) {
        if ( _audio[ id ] && _audio[ id ].source ) {
            _audio[ id ].startOffset = time;
        }
    },

    /**
     *
     * MediaBox play audio context
     * @memberof MediaBox
     * @method playAudio
     * @param {string} id string reference id for audio
     * @param {function} callback optional callback to fire on decodeAudioData
     *
     */
    playAudio: function ( id, callback ) {
        var self = this;

        if ( _audio[ id ] ) {
            _audio[ id ].startTime = _audioContext.currentTime;
            _audio[ id ].source = _audioContext.createBufferSource();
            _audio[ id ].source.buffer = _audio[ id ].buffer;
            _audio[ id ].gainNode = createGainNode( _audioContext );
            _audio[ id ].analyser = _audioContext.createAnalyser();
            _audio[ id ].source.connect( _audio[ id ].analyser );
            _audio[ id ].source.connect( _audio[ id ].gainNode );
            _audio[ id ].analyser.connect( _audioContext.destination );
            _audio[ id ].gainNode.connect( _audioContext.destination );
            _audio[ id ].gainNode.gain.value = (_channels[ _audio[ id ].channel ].volume || 1.0);

            //_audio[ id ].source.onended
            if ( !_audio[ id ]._update ) {
                _audio[ id ]._update = setInterval(function () {
                    if ( isFunction( _audio[ id ]._events.timeupdate ) ) {
                        var duration = (_audio[ id ].buffer.duration),
                            ellapsed = (_audio[ id ].startOffset + (_audioContext.currentTime - _audio[ id ].startTime));

                        _audio[ id ]._events.timeupdate( duration, ellapsed );

                        if ( ellapsed >= duration ) {
                            self.stopAudio( id );

                            if ( isFunction( _audio[ id ]._events.ended ) ) {
                                _audio[ id ]._events.ended();
                            }
                        }
                    }

                }, _60FPS );
            }

            if ( _audio[ id ].loop ) {
                _audio[ id ].source.loop = true;
            }

            sourceStart( _audio[ id ] );

            _audio[ id ].state = MediaBox.STATE_PLAYING;

            // @fire audio-play
            if ( isFunction( _audio[ id ]._events.play ) ) {
                _audio[ id ]._events.play();
            }
        }
    },

    /**
     *
     * MediaBox simply a wrapper for playAudio
     * @memberof MediaBox
     * @method hitAudio
     * @param {string} id string reference id for audio
     *
     */
    hitAudio: function ( id ) {
        this.playAudio( id );
    },

    /**
     *
     * MediaBox stop playing an audio context
     * @memberof MediaBox
     * @method stopAudio
     * @param {string} id string reference id for audio
     *
     */
    stopAudio: function ( id ) {
        if ( _audio[ id ] && _audio[ id ].source ) {
            _audio[ id ].startTime = 0;
            _audio[ id ].startOffset = 0;
            _audio[ id ].state = MediaBox.STATE_STOPPED;

            sourceStop( _audio[ id ] );

            // Disconnect
            _audio[ id ].gainNode.disconnect();
            _audio[ id ].source.disconnect();

            // Trash the gainNode and source
            _audio[ id ].gainNode = null;
            _audio[ id ].source = null;

            clearPlaybackUpdate( _audio[ id ] );
        }
    },

    /**
     *
     * MediaBox pause playing audio, calls sourceStop
     * @memberof MediaBox
     * @method pauseAudio
     * @param {string} id id of audio to pause
     *
     */
    pauseAudio: function ( id ) {
        if ( _audio[ id ] && _audio[ id ].source ) {
            _audio[ id ].startOffset += (_audioContext.currentTime - _audio[ id ].startTime);
            _audio[ id ].state = MediaBox.STATE_PAUSED;

            sourceStop( _audio[ id ] );

            clearPlaybackUpdate( _audio[ id ] );

            // @fire audio-pause
            if ( isFunction( _audio[ id ]._events.pause ) ) {
                _audio[ id ]._events.pause();
            }
        }
    },

    /**
     *
     * MediaBox fade in audio/video volume
     * @memberof MediaBox
     * @method fadeVolumeIn
     * @param {string} id string reference id for audio
     * @param {number} duration tween time in ms
     * @param {function} easing optional easing to use
     *
     */
    fadeVolumeIn: function ( id, duration, easing ) {
        var obj = _video[ id ] ? _video[ id ] : _audio[ id ],
            self = this,
            volume;

        if ( obj && obj.state === MediaBox.STATE_PLAYING ) {
            //console.log( "@MediaBox:fadeVolumeIn Already playing " + id );
            return this;
        }

        if ( obj ) {
            volume = _channels[ obj.channel ].volume;

            // Only reset volume and play if object is stopped
            // Object state could be STATE_STOPPING at this point
            if ( obj.state === MediaBox.STATE_STOPPED ) {
                this.playObject( id );
                this.setVolume( id, 0 );

            } else if ( obj.state === MediaBox.STATE_STOPPING ) {
                obj.state = MediaBox.STATE_PLAYING;
            }

            new Tween({
                to: volume,
                from: 0,
                ease: ( isFunction( easing ) ) ? easing : Easing.linear,
                duration: (duration || 1000),
                update: function ( v ) {
                    self.setVolume( id, v );
                },
                complete: function () {
                    self.setVolume( id, volume );
                }
            });
        }
    },

    /**
     *
     * MediaBox fade out audio/video volume
     * @memberof MediaBox
     * @method fadeVolumeOut
     * @param {string} id string reference id for audio
     * @param {number} duration tween time in ms
     * @param {function} easing optional easing to use
     *
     */
    fadeVolumeOut: function ( id, duration, easing ) {
        var obj = _video[ id ] ? _video[ id ] : _audio[ id ];

        if ( obj && obj.state === MediaBox.STATE_STOPPING ) {
            //console.log( "@MediaBox:fadeVolumeOut Already stopping " + id );
            return this;
        }

        var self = this,
            handler = function ( v ) {
                // Check audio state on fadeout in case it is started again
                // before the duration of the fadeout is complete.
                if ( obj.state === MediaBox.STATE_STOPPING ) {
                    self.setVolume( id, (v < 0) ? 0 : v );

                    if ( self.getVolume( id ) === 0 ) {
                        self.stopObject( id );
                    }
                }
            };

        if ( obj ) {
            obj.state = MediaBox.STATE_STOPPING;

            new Tween({
                to: 0,
                from: self.getVolume( id ),
                ease: ( isFunction( easing ) ) ? easing : Easing.linear,
                duration: (duration || 1000),
                update: handler,
                complete: handler
            });
        }
    },

    /**
     *
     * MediaBox pause all playing audio for a given channel id
     * @memberof MediaBox
     * @method stopChannel
     * @param {string} channel string reference id for channel
     *
     */
    stopChannel: function ( channel ) {
        var id;

        // Look at video index
        for ( id in _video ) {
            if ( _video[ id ].channel === channel && _video[ id ].state === MediaBox.STATE_PLAYING ) {
                this.pauseVideo( id );
            }
        }

        // Look at audio index
        for ( id in _audio ) {
            if ( _audio[ id ].channel === channel && _audio[ id ].state === MediaBox.STATE_PLAYING ) {
                this.pauseAudio( id );
            }
        }
    },

    /**
     *
     * MediaBox resume all playing audio for a given channel id
     * @memberof MediaBox
     * @method playChannel
     * @param {string} channel string reference id for channel
     *
     */
    playChannel: function ( channel ) {
        var id;

        // Look at video index
        for ( id in _video ) {
            if ( _video[ id ].channel === channel && _video[ id ].state === MediaBox.STATE_PAUSED ) {
                this.playVideo( id );
            }
        }

        // Look at audio index
        for ( id in _audio ) {
            if ( _audio[ id ].channel === channel && _audio[ id ].state === MediaBox.STATE_PAUSED ) {
                this.playAudio( id );
            }
        }
    },

    /**
     *
     * MediaBox fade out all playing audio/video for a given channel id
     * @memberof MediaBox
     * @method fadeChannelOut
     * @param {string} channel string reference id for channel
     * @param {number} duration tween time in ms
     *
     */
    fadeChannelOut: function ( channel, duration ) {
        var id;

        // Look at video index
        for ( id in _video ) {
            if ( _video[ id ].channel === channel && _video[ id ].state === MediaBox.STATE_PLAYING ) {
                this.fadeVolumeOut( id, duration );
            }
        }

        // Look at audio index
        for ( id in _audio ) {
            if ( _audio[ id ].channel === channel && _audio[ id ].state === MediaBox.STATE_PLAYING ) {
                this.fadeVolumeOut( id, duration );
            }
        }
    },

    /**
     *
     * MediaBox fade in all playing audio/video for a given channel id
     * @memberof MediaBox
     * @method fadeChannelIn
     * @param {string} channel string reference id for channel
     * @param {number} duration tween time in ms
     *
     */
    fadeChannelIn: function ( channel, duration ) {
        var id;

        // Look at video index
        for ( id in _video ) {
            if ( _video[ id ].channel === channel && _video[ id ].state === MediaBox.STATE_STOPPED ) {
                this.fadeVolumeIn( id, duration );
            }
        }

        // Look at audio index
        for ( id in _audio ) {
            if ( _audio[ id ].channel === channel && _audio[ id ].state === MediaBox.STATE_STOPPED ) {
                this.fadeVolumeIn( id, duration );
            }
        }
    },

    /**
     *
     * MediaBox crossfade volume between multiple channels
     * @memberof MediaBox
     * @method crossFadeChannel
     * @param {string} channel string reference id for channel
     * @param {string} objId string reference id for object to fade in
     * @param {number} duration tween time in ms
     *
     */
    crossFadeChannel: function ( channel, objId, duration ) {
        var id;
        
        // Look at video index
        for ( id in _video ) {
            if ( _video[ id ].channel === channel && _video[ id ].state === MediaBox.STATE_PLAYING ) {
                this.fadeVolumeOut( id, duration );
            }
        }

        // Look at audio index
        for ( id in _audio ) {
            if ( _audio[ id ].channel === channel && _audio[ id ].state === MediaBox.STATE_PLAYING ) {
                this.fadeVolumeOut( id, duration );
            }
        }

        this.fadeVolumeIn( objId, duration );
    },

    /**
     *
     * MediaBox set the property for a channel
     * @memberof MediaBox
     * @method setChannelProp
     * @param {string} id string id reference to channel
     * @param {string} key string prop key
     * @param {string} val prop val
     *
     */
    setChannelProp: function ( id, key, val ) {
        if ( _channels[ id ] ) {
            _channels[ id ][ key ] = val;
        }
    },

    /**
     *
     * MediaBox get the property for a channel
     * @memberof MediaBox
     * @method getChannelProp
     * @param {string} id string id reference to channel
     * @param {string} key string prop key
     *
     */
    getChannelProp: function ( id, key ) {
        if ( _channels[ id ] ) {
            return _channels[ id ][ key ];
        }
    }
};


// Expose
window.provide( "MediaBox", MediaBox );


})( window, window.document, window.Easing, window.Tween );

/*!
 *
 * A stepped timeout manager
 *
 * @Stagger
 * @author: kitajchuk
 *
 */
(function ( window, undefined ) {


"use strict";


/**
 *
 * A stepped timeout manager
 * @constructor Stagger
 * @memberof! <global>
 *
 */
var Stagger = function () {
    return this.init.apply( this, arguments );
};

Stagger.prototype = {
    constructor: Stagger,
    
    /**
     *
     * Stagger init constructor method
     * @memberof Stagger
     * @method Stagger.init
     * @param {object} options The staggering options
     * <ul>
     * <li>options.delay</li>
     * <li>options.steps</li>
     * </ul>
     *
     */
    init: function ( options ) {
        /**
         *
         * Step callback
         * @memberof Stagger
         * @member Stagger._step
         *
         */
        this._step = null;
        
        /**
         *
         * When iteration callbacks
         * @memberof Stagger
         * @member Stagger._when
         *
         */
        this._when = {};
        
        /**
         *
         * Done callback
         * @memberof Stagger
         * @member Stagger._done
         *
         */
        this._done = null;
        
        /**
         *
         * Timeout delay
         * @memberof Stagger
         * @member Stagger._delay
         *
         */
        this._delay = options.delay || 250;
        
        /**
         *
         * Current step iteration
         * @memberof Stagger
         * @member Stagger._current
         *
         */
        this._current = 0;
        
        /**
         *
         * Number of step occurrences
         * @memberof Stagger
         * @member Stagger._steps
         *
         */
        this._occurrences = options.steps || 0;
        
        /**
         *
         * Timeout reference
         * @memberof Stagger
         * @member Stagger._timeout
         *
         */
        this._timeout = null;
        
        /**
         *
         * Paused flag
         * @memberof Stagger
         * @member Stagger._paused
         *
         */
        this._paused = false;
        
        /**
         *
         * Started iteration flag
         * @memberof Stagger
         * @member Stagger._started
         *
         */
        this._started = false;
        
        /**
         *
         * Resolved iteration flag
         * @memberof Stagger
         * @member Stagger._resolved
         *
         */
        this._resolved = false;
    },
    
    /**
     *
     * Apply the step callback
     * @memberof Stagger
     * @method Stagger.step
     * @param {function} fn The callback to fire
     *
     */
    step: function ( fn ) {
        if ( typeof fn === "function" ) {
            this._step = fn;
        }
        
        return this;
    },
    
    /**
     *
     * Apply a when callback
     * @memberof Stagger
     * @method Stagger.when
     * @param {number} i The iteration to fire on
     * @param {function} fn The callback to fire
     *
     */
    when: function ( i, fn ) {
        if ( typeof fn === "function" ) {
            this._when[ i ] = fn;
        }

        return this;
    },
    
    /**
     *
     * Apply the done callback
     * @memberof Stagger
     * @method Stagger.done
     * @param {function} fn The callback to fire
     *
     */
    done: function ( fn ) {
        if ( typeof fn === "function" ) {
            this._done = fn;
        }
        
        return this;
    },
    
    /**
     *
     * Pause the iteration
     * @memberof Stagger
     * @method Stagger.pause
     *
     */
    pause: function () {
        this._paused = true;
        
        return this;
    },
    
    /**
     *
     * Play the iteration
     * @memberof Stagger
     * @method Stagger.play
     *
     */
    play: function () {
        this._paused = false;
        
        return this;
    },
    
    /**
     *
     * Start the iteration
     * @memberof Stagger
     * @method Stagger.start
     *
     */
    start: function () {
        this.play()._stagger();
        
        return this;
    },
    
    /**
     *
     * Resolve the iteration state
     * @memberof Stagger
     * @method Stagger._resolve
     *
     */
    _resolve: function () {
        this._resolved = true;
        this._timeout = null;
        
        return this;
    },
    
    /**
     *
     * Initialize the iteration loop
     * @memberof Stagger
     * @method Stagger._stagger
     *
     */
    _stagger: function () {
        if ( this._started ) {
            return this;
        }
        
        this._started = true;
        
        var self = this,
            stagger = function () {
                self._timeout = setTimeout(function () {
                    clearTimeout( self._timeout );
                    
                    // If resolved, stop timeout loop
                    if ( self._resolved ) {
                        self._timeout = null;
                        
                        return;
                    
                    // If paused, keep loop going but wait    
                    } else if ( self._paused ) {
                        stagger();
                        
                        return;
                    }
                    
                    if ( typeof self._step === "function" ) {
                        self._step( self._current );
                    }
                    
                    if ( typeof self._when[ self._current ] === "function" ) {
                        self._when[ self._current ]( self._current );
                    }
                    
                    self._current++;
                    
                    if ( self._current === self._occurrences ) {
                        self._resolve();
                        
                        if ( typeof self._done === "function" ) {
                            self._done();
                        }
                        
                    } else {
                        stagger();
                    }
                                
                }, self._delay );
            };
        
        stagger();
    }
};


// Expose
window.provide( "Stagger", Stagger );


})( window );
/*!
 *
 * Hammerjs event delegation wrapper
 * http://eightmedia.github.io/hammer.js/
 *
 * @Hammered
 * @author: kitajchuk
 *
 *
 */
(function ( window, Hammer, matchElement ) {


"use strict";


// Break on no Hammer
if ( !Hammer ) {
    throw new Error( "Hammered Class requires Hammerjs!" );
}


/**
 *
 * Single instanceof Hammer
 *
 */
var _instance = null;


/**
 *
 * Hammerjs event delegation wrapper
 * @constructor Hammered
 * @requires matchElement
 * @memberof! <global>
 *
 */
var Hammered = function () {
    return (_instance || this.init.apply( this, arguments ));
};


Hammered.prototype = {
    constructor: Hammered,

    /**
     *
     * Hammered constructor method
     * {@link https://github.com/EightMedia/hammer.js/wiki/Getting-Started#gesture-options}
     * @memberof Hammered
     * @param {object} element DOMElement to delegate from, default is document.body
     * @param {object} options Hammerjs options to be passed to instance
     * @method init
     *
     */
    init: function ( element, options ) {
        _instance = this;

        /**
         *
         * Match version of hammerjs for compatibility
         * @member _version
         * @memberof Hammered
         * @private
         *
         */
        this._version = "1.1.2";
    
        /**
         *
         * The stored handlers
         * @member _handlers
         * @memberof Hammered
         * @private
         *
         */
        this._handlers = {};

        /**
         *
         * The stored Hammer instance
         * @member _hammer
         * @memberof Hammered
         * @private
         *
         */
        this._hammer = new Hammer( (element || document.body), options );
    },

    /**
     *
     * Retrieve the original Hammer instance
     * @method getInstance
     * @memberof Hammered
     * @returns instanceof Hammer
     *
     */
    getInstance: function () {
        return this._hammer;
    },

    /**
     *
     * Retrieve the handlers reference object
     * @method getHandlers
     * @memberof Hammered
     * @returns object
     *
     */
    getHandlers: function () {
        return this._handlers;
    },

    /**
     *
     * Allow binding hammer event via delegation
     * @method on
     * @param {string} event The Hammer event
     * @param {string} selector The delegated selector to match
     * @param {function} callback The handler to call
     * @memberof Hammered
     *
     */
    on: function ( event, selector, callback ) {
        var uid = ("Hammered" + ((this._version + Math.random()) + (event + "-" + selector)).replace( /\W/g, "" )),
            handler = function ( e ) {
                var element = matchElement( e.target, selector );

                // Either match target element
                // or walk up to match ancestral element.
                // If the target is not desired, exit
                if ( element ) {
                    // Call the handler with normalized context
                    callback.call( element, e );
                }
            };

        // Bind the methods on ID
        handler._hammerUID = uid;
        callback._hammerUID = uid;

        // Apply the event via Hammerjs
        this._hammer.on( event, handler );

        // Push the wrapper handler onto the stack
        this._handlers[ uid ] = handler;
    },

    /**
     *
     * Effectively off an event wrapped with Hammered
     * @method off
     * @param {string} event The Hammer event
     * @param {function} callback The handler to remove
     * @memberof Hammered
     *
     */
    off: function ( event, callback ) {
        var i;

        for ( i in this._handlers ) {
            if ( i === callback._hammerUID && this._handlers[ i ]._hammerUID === callback._hammerUID ) {
                this._hammer.off( event, this._handlers[ i ] );

                delete this._handlers[ i ];

                break;
            }
        }
    },

    /**
     *
     * Effectively trigger an event through Hammer-js
     * @method trigger
     * @param {string} event The Hammer event
     * @param {object} element The DOMElement to invoke event on
     * @memberof Hammered
     *
     */
    trigger: function ( event, element ) {
        element = ( typeof element === "object" && element.nodeType === 1 ) ? element : null;

        // Only proceed if the element is legit
        if ( element ) {
            var eventObject = document.createEvent( "CustomEvent" ),
                eventData = Hammer.event.collectEventData(
                    element,
                    Hammer.EVENT_END,
                    Hammer.event.getTouchList( eventObject, Hammer.EVENT_END ),
                    eventObject
                );

            eventData.target = element;

            this._hammer.trigger( event, eventData );
        }
    }
};


// Expose
window.provide( "Hammered", Hammered );

})( window, window.require( "Hammer" ), window.require( "matchElement" ) );