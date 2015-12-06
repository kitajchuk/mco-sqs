import detect from "./detect";


const config = {
    easeDuration: 600,
    mobileWidth: 640,
    tabletWidth: 1280,
    sqsMaxImgWidth: 2500,
    lazyImageSelector: ".js-lazy-image",
    lazyImageAttr: "data-img-src",
    imageLoaderAttr: "data-imageloader",
    defaultHammerOptions: (detect.isTouch() ? null : {
        // Disable cssProps for non-touch experiences
        cssProps: {
            contentZoomingString: false,
            tapHighlightColorString: false,
            touchCalloutString: false,
            touchSelectString: false,
            userDragString: false,
            userSelectString: false
        }
    }),
    homeImageKey: "mco--home-image",
    resizeSelector: ".js-resize"
};


export default config;