import dom from "./dom";
import resizes from "./resizes";
import * as util from "./util";


const $_jsMco = dom.footerbar.find( ".js-footerbar-mco" );


const footerbar = {
    init: function () {
        util.emitter.on( "app--resize", onResizer );

        $_jsMco.data({
            $prev: $_jsMco.prev(),
            $parent: $_jsMco.parent()
        });

        onResizer();

        console.log( "footerbar initialized" );
    }
};


const onResizer = function () {
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