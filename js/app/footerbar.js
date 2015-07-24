/*!
 *
 * App Controller: footerbar
 *
 * A nice description of what this controller does...
 *
 *
 */
import "app/dom";
import "app/resizes";
import { emitter } from "app/util";


var $_jsMco = dom.footerbar.find( ".js-footerbar-mco" ),


footerbar = {
    init: function () {
        emitter.on( "app--resize", onResizer );

        $_jsMco.data({
            $prev: $_jsMco.prev(),
            $parent: $_jsMco.parent()
        });

        onResizer();

        console.log( "footerbar initialized" );
    }
},


onResizer = function () {
    if ( resizes.isSmall() ) {
        $_jsMco.prependTo( $_jsMco.data( "$parent" ) );

    } else {
        $_jsMco.insertAfter( $_jsMco.data( "$prev" ) );
    }
};


/******************************************************************************
 * Export
*******************************************************************************/
export default footerbar;