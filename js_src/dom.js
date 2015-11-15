import $ from "js_libs/jquery/dist/jquery";


const dom = {
    doc: $( document ),
    html: $( document.documentElement ),
    body: $( document.body ),
    page: $( ".js-page" ),
    footerbar: $( ".js-footerbar" ),
    navbar: $( ".js-navbar" ),
    navmenu: $( ".js-navmenu" )
};


export default dom;