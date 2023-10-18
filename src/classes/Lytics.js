if(!window.dataLayer)window.dataLayer = [];
// eslint-disable-next-line no-unused-vars
const pushData = (data) => {
	window.dataLayer.push(data);
}

export default class Lytics {

	/**
	 *
	 * @param event
	 * @param opts
	 * @constructor
	 */
	static TriggerEvent(event, opts = {}) {
		console.log('Event Trigger: ' + event, opts);
		pushData({
				'event': event,
				...opts
			});

		if(window.rudderanalytics) {
			try {
				window.rudderanalytics.track(event, opts);
			} catch (e) {
				console.log('Rudder Analytics Fail:', e);
			}

		}

	}

	/*
	/**
	 *
	 * @param event
	 * @param category
	 * @param action
	 * @param label
	 * @constructor
	static TriggerEvent(event, category, action, label = '') {
		pushData({
			'event' : event,
			'eventCategory' : category,
			'eventAction' : action,
			'eventLabel' : label
		})
	}*/

	/**
	 * Force a page change event
	 * @param url
	 * @param title
	 * @constructor
	 */
	static TriggerPageChange(url, title) {
		this.TriggerEvent('virtualPageview',{
			'pageUrl': url || location.href,
			'pageTitle': title || document.title
		});
	}

	static TriggerFlyerLoaded(details = {}) {
		this.TriggerEvent('LoadedFlyers', details);
	}

	/**
	 *
	 * @param {int} page Page Number
	 * @param {string} flyerName
	 * @constructor
	 */
	static TriggerFlyerPageChange(page, flyerName) {
		this.TriggerEvent('flyer_page_change',
			{
				'eventCategory' : 'flyerPage',
				'eventAction' : page,
				'eventLabel' : flyerName
			}
		);//, 'flyerPage', page, flyerName);
	}

	/**
	 *
	 * @param sku
	 * @param prod_name
	 * @param desc
	 * @param blockId
	 * @param extra
	 * @constructor
	 */
	static TriggerTileClick(sku, prod_name, desc, blockId, extra = {}) {
		this.TriggerEvent('tiles_click',
			{
				'eventCategory' : 'tilesClick',
				'eventAction' : sku,
				'eventLabel': desc,
				'block_id': blockId,
				'product_name': prod_name,
				...extra
			});//, 'tilesClick', sku);
	}

	/**
	 *
	 * @param {('print'|'email'|'clear')} action
	 * @constructor
	 */
	static TriggerShoppingList(action) {
		this.TriggerEvent('Shopping_list_interactions',
			{
				'eventCategory': 'ShoppingListInteractions',
				'eventAction': action
			});//, 'ShoppingListInteractions', action);
	}

	/**
	 *
	 * @param action {('add'|'remove'|'change_count')}
	 * @param productName
	 * @param extra
	 * @constructor
	 */
	static TriggerShoppingListProduct(action, productName, extra = {}) {
		this.TriggerEvent('Shopping_list_interactions_product',
			{
				'eventCategory': 'ProductInteraction',
				'eventAction': action,
				'eventLabel': productName,
				...extra
			});//, 'ProductInteraction', action, productName);
	}

	/**
	 *
	 * @param action
	 * @param discount
	 * @constructor
	 */
	static TriggerFilter(action, discount) {
		this.TriggerEvent('filter_interaction',{
			'eventCategory' : 'filterInteraction',
			'eventAction' : action,
			'eventLabel' : discount
		});//, 'filterInteraction', action, discount);
	}

	/**
	 *
	 * @constructor
	 */
	static TriggerSearch(request) {
		this.TriggerEvent('search_use',{
			'eventCategory' : 'searchUse',
			'eventAction' : request
		});//, 'searchUse', request);
	}

	static TriggerFullScreenToggle() {
		this.TriggerEvent('ToggleFullScreen', {
			category: "ScreenSizeChange"
		})
	}

	static TriggerScreenOrientationChange() {
		this.TriggerEvent('ToggleScreenOrientation', {
			category: "ScreenOrientationChange",
		})
	}

	static TriggerExternalAdClick(details = {}){
		this.TriggerEvent('ExternalAdClick', details);
	}

	static TriggerVideoLength(details = {}) {
    this.TriggerEvent("VideoLength", details);
  }
	
	static TriggerTireAdClick(details = {}) {
		this.TriggerEvent('TireAdClick', details);
	}

	static TriggerGotoLandingPage() {
		this.TriggerEvent('NavigateToLandingPage', { category: 'ButtonPressed'})
	}

}
