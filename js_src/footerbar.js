import * as core from "./core";


const $_jsMco = core.dom.footerbar.find( ".js-footerbar-mco" );


const footerbar = {
    init () {
        core.emitter.on( "app--resize", onResizer );

        $_jsMco.data({
            $prev: $_jsMco.prev(),
            $parent: $_jsMco.parent()
        });

        onResizer();

        core.log( "footerbar initialized" );
    }
};


const onResizer = function () {
    if ( core.resizes.isSmall() ) {
        $_jsMco.prependTo( $_jsMco.data( "$parent" ) );

    } else {
        $_jsMco.insertAfter( $_jsMco.data( "$prev" ) );
    }
};


/******************************************************************************
 * Export
*******************************************************************************/
export default footerbar;