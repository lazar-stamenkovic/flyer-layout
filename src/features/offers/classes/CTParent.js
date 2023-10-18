import store from "@/store";

const postMessage = (message, targetOrigin = '*') => {
	window.parent.postMessage( JSON.stringify(message), targetOrigin );
	console.log('postMessage:', message);
}

/**
 * Controls to communicate with Canadian Tire parent window.
 */
export default class CTParent {
	/**
	 * Show CanadianTire login dialog
	 * @constructor
	 */
	static ShowCTLogin(deal) {
		console.log('Show Canadian Tire Sign-in Dialog');
		// console.log('dealNo  is ' + deal);
		postMessage({
			type: 'SIGN_IN',
			currentDirectory: deal,
			item: {}
		});
	}

	/**
	 * Show Triangle Link popup, To link triangle account to to currently logged in user
	 * @constructor
	 */
	static ShowTriangleLink() {
		window.open("https://triangle.com/merge")
		// postMessage({
		// 	type: 'TRIANGLE_LINK',
		// 	item: {}
		// });
	}

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
			location: Object.assign({
				page: store.state.currentPageNumber,
				flyerId: store.getters["landingPage/currentFlyer"].title,
				storeId: store.getters.storeId,
				language: store.getters.language
			}),
			...extra
		});

		localStorage.setItem(
      "sku",
      JSON.stringify({ flyerId: store.getters["landingPage/currentFlyer"].title, val: sku })
    );
	}

	static ShowEmailSignup(extra = {}) {
		postMessage({
			type: 'EMAIL_POP',
			...extra
		});
	}

}
