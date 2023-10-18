const postMessage = (message, targetOrigin = '*') => {
    window.parent.postMessage( JSON.stringify(message), targetOrigin );
    console.log('postMessage:', message);
}

/**
 * Controls to communicate with Super-C parent window.
 */
export default class IFrameComm {



    static FullScreenState( isFullScreen ) {
        postMessage({ fullscreen: isFullScreen });
    }

    static ShowPDP(sku, extra = {}) {
        postMessage({
            type: 'ITEM_POP',
            item: {
                sku: sku,
                flyerTypeNameIdentifier: 'flyer'
            },
            ...extra
        });
    }

}