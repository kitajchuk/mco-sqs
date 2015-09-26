/*!
 *
 * App Controller: article
 *
 * A nice description of what this controller does...
 *
 *
 */
import "app/dom";
import "app/resizes";
import { emitter } from "app/util";


var $_jsArticle = null,
    $_jsAnims = null,

    _isActive = false,


/**
 *
 * @public
 *
 */
article = {
    init: function () {
        console.log( "article initialized" );
    },


    isActive: function () {
        return (_isActive = this.getElements() > 0);
    },


    onload: function () {
        emitter.on( "app--resize", onResizer );
        emitter.on( "app--resize-small", unbindAnimateArticle );
        emitter.on( "app--resize-normal", bindAnimateArticle );

        if ( !resizes.isSmall() ) {
            bindAnimateArticle();
        }
    },


    unload: function () {
        this.teardown();
    },


    getElements: function () {
        $_jsArticle = dom.page.find( ".js-article" );
        $_jsAnims = $_jsArticle.find( ".js-anim, .sqs-block-content" );

        return ( $_jsArticle.length );
    },


    teardown: function () {
        unbindAnimateArticle();

        emitter.off( "app--resize", onResizer );
        emitter.off( "app--resize-small", unbindAnimateArticle );
        emitter.off( "app--resize-normal", bindAnimateArticle );

        $_jsArticle = null;
        $_jsAnims = null;

        _isActive = false;
    }
},


/**
 *
 * @private
 *
 */
bindAnimateArticle = function () {
    emitter.on( "app--scroll", onScroller );
    emitter.on( "app--scroll-up", onScrollerUp );
    emitter.on( "app--scroll-down", onScrollerDown );

    onScroller();

    console.log( "bind animate article" );
},


/**
 *
 * @private
 *
 */
unbindAnimateArticle = function () {
    emitter.off( "app--scroll", onScroller );
    emitter.off( "app--scroll-up", onScrollerUp );
    emitter.off( "app--scroll-down", onScrollerDown );

    $_jsAnims.removeClass( "is-above is-below is-entering is-leaving-bottom is-leaving-top" );

    console.log( "unbind animate article" );
},


/**
 *
 * @private
 *
 */
onResizer = function () {
    onScroller();
    onScrollerUp();
    onScrollerDown();
},


/**
 *
 * @private
 *
 */
onScroller = function () {
    var bounds,
        $item,
        i;

    for ( i = $_jsAnims.length; i--; ) {
        $item = $_jsAnims.eq( i );
        bounds = $item[ 0 ].getBoundingClientRect();

        // In the visible viewport
        if ( bounds.top > 0 && bounds.bottom < window.innerHeight ) {
            $item.addClass( "is-entering" ).removeClass( "is-above is-below is-leaving-bottom is-leaving-top" );
        }

        // Out of the visible viewport above
        if ( bounds.top < 0 && bounds.bottom < 0 ) {
            $item.addClass( "is-above" ).removeClass( "is-below is-entering is-leaving-bottom is-leaving-top" );
        }

        // Out of the visible viewport below
        if ( bounds.top > window.innerHeight && bounds.bottom > window.innerHeight ) {
            $item.addClass( "is-below" ).removeClass( "is-above is-entering is-leaving-bottom is-leaving-top" );
        }
    }
},


/**
 *
 * @private
 *
 */
onScrollerDown = function () {
    var bounds,
        $item,
        i;

    for ( i = $_jsAnims.length; i--; ) {
        $item = $_jsAnims.eq( i );
        bounds = $item[ 0 ].getBoundingClientRect();

        // Entering from the bottom
        if ( bounds.top < window.innerHeight && bounds.bottom > window.innerHeight ) {
            $item.addClass( "is-entering" ).removeClass( "is-above is-below is-leaving-bottom is-leaving-top" );
        }

        // Exiting from the top
        if ( (bounds.top + (bounds.height / 2)) < 0 && bounds.bottom > 0 ) {
            $item.addClass( "is-leaving-top" ).removeClass( "is-above is-below is-entering is-leaving-bottom" );
        }
    }
},


/**
 *
 * @private
 *
 */
onScrollerUp = function () {
    var bounds,
        $item,
        i;

    for ( i = $_jsAnims.length; i--; ) {
        $item = $_jsAnims.eq( i );
        bounds = $item[ 0 ].getBoundingClientRect();

        // Entering from the top
        if ( bounds.bottom > 0 && bounds.top < 0 ) {
            $item.addClass( "is-entering" ).removeClass( "is-above is-below is-leaving-bottom is-leaving-top" );
        }

        // Exiting from the bottom
        if ( (bounds.top + (bounds.height / 2)) > window.innerHeight && bounds.top < window.innerHeight ) {
            $item.addClass( "is-leaving-bottom" ).removeClass( "is-above is-below is-entering is-leaving-top" );
        }
    }
};


/******************************************************************************
 * Export
*******************************************************************************/
export default article;