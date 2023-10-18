//import axios from "axios";
import Rest from "@/api/Rest";
import Lytics from "@/classes/Lytics";
import moment from "moment";
import router from "@/router";

const state = {
	showShoppingList: false,
	showShoppingListV1:false,
	shoppingList: [],
	shoppingListV1:[],
	emailError: false,
	additionalItemInputFocus: false,
	emailInputFocus: false,
	additionalItemCount: 0,
	flyerDate: null
};

const getters = {
	config(state, getters, rootState, rootGetters) {
		const settings = rootGetters['config/features'];
		return settings.shoppingList;
	},
	enabled(state, getters) {
		return getters.config?.enabled;
	},
	getVersion(state, getters) {
		return getters.config.component || ''
	}
};

const actions = {
	toggleShoppingList({commit}, value) {
		commit('SHOW_SHOPPING_LIST', value);
	},
	toggleShoppingListV1({commit}, value) {
		commit('SHOW_SHOPPING_LISTV1', value);
	},

	skuAddToList({dispatch, rootGetters}, sku) {
		let product = null;

		rootGetters.filterableItems.some(item => {
			product = item.products.find(product => product.sku == sku);
			return product;
		});

		if (!product) return;

		const additionalItemFlag = false;
		const prod = state.shoppingList.filter(product => product.sku === sku);
		if(prod.length==0){
			dispatch('setAddToList', {product, additionalItemFlag});
			return true
		}
		else
			return false;
	},
	setAddToList({commit, rootState, rootGetters}, payload) {

		commit('ADD_ITEM_SHOPPING_LIST', {payload, rootState, rootGetters});
	},
	setRemoveFromList({commit, rootState, rootGetters}, payload) {
		//Lytics.TriggerShoppingListProduct('remove', payload.product);
		commit('REMOVE_ITEM_SHOPPING_LIST', {payload, rootState, rootGetters})
		return true;
	},
	quantityChange({commit, rootState, rootGetters}, payload) {
		//Lytics.TriggerShoppingListProduct('change_count', payload)
		commit('HANDLE_QTY_CHANGE', {payload, rootState, rootGetters})
	},
	clearAll({commit, rootState, rootGetters}) {
		Lytics.TriggerShoppingList("clear");
		commit('CLEAR_SHOPPING_LIST', {rootState, rootGetters})
	}, // eslint-disable-next-line no-unused-vars
	async sendEmail({dispatch, rootState}, payload) {
		try {
			await Rest.Post('products/email', payload);
			Lytics.TriggerShoppingList("email");
			/*await axios.post(`${rootState.apiUrl}/products/email`,
					payload,
			  {
			   headers: {
				   'Ocp-Apim-Subscription-Key':`${rootState.subscriptionKey}`,
				   'content-type':'application/json;charset=UTF-8',
			   }
		   })*/
		} catch (error) {
			if (error.response.status != 200) dispatch('setEmailError', true)
			console.log(error);
		}
	},
	handleFlyerDate({commit}, value) {
		commit("SET_FLYER_DATE", value)
	},
	setShoppingList({commit}, payload) {
		commit('SET_SHOPPING_LIST', payload)
	},
	setEmailError({commit}, val) {
		commit('EMAIL_ERROR', val)
	},
	setAdditionalItemInputFocus({commit}, val) {
		commit('SET_ADDITIONAL_ITEM_FOCUS', val)
	},
	setEmailInputFocus({commit}, val) {
		commit('SET_EMAIL_INPUT_FOCUS', val)
	},
	handleLocalStorage({rootGetters, dispatch}) {

		const currentFlyer = rootGetters["landingPage/currentFlyer"]
		let data;
		try {
			data = JSON.parse(localStorage[`data_${currentFlyer.title}`])
		} catch (e) {
			dispatch('setShoppingList', [])
			return true;
		}
		var today = moment().format('YYYY-MM-DD');
		var endDate = moment(data.endDate).format('YYYY-MM-DD');

		if (today > endDate) {
			window.localStorage.removeItem(`data_${currentFlyer.title}`);
			dispatch('setShoppingList', [])

		} else {
			dispatch('setShoppingList', data.shoppingList)
		}
	}
};

const mutations = {
	SET_SHOPPING_LIST(state, value) {
		state.shoppingList = value
	},
	SHOW_SHOPPING_LIST(state, value) {
		state.showShoppingList = value;
	},
	SHOW_SHOPPING_LISTV1(state, value) {
		state.showShoppingListV1 = value;
	},
	SET_FLYER_DATE(state, val) {
		state.flyerDate = val;
	},

	ADD_ITEM_SHOPPING_LIST(state, {payload, rootGetters}) {
		const currentFlyer = rootGetters["landingPage/currentFlyer"]
		let newElement, sp, price;
		if(payload.version==="v1") {
			const date = router.currentRoute.query['timeTravelDate'] ?? moment();
			//subtracting and adding 1 day because isBetween function from momentJS doesn't consider the actual date (same day)
			const startDate = moment(payload.product?.validFrom).subtract(1, "days")
			const endDate = moment(payload.product?.validTo).add(1, "days")
			let isTodayBetweenValidity = moment(date).isBetween(startDate, endDate);
			if (payload.product?.tags?.includes('S&S')) {
				price = payload.product?.salePrice
			} else {
				if (payload.product?.savingsEn)
					price = payload.product.savingsPrefix + ' ' + payload.product.savingsEn
				else price = isTodayBetweenValidity === true ? payload.product?.salePrice : payload.product?.rowPrice || '';
			}
			if (price !== '' && price !== null && !payload.product?.savingsEn)
				sp = payload.product?.priceSign?.includes('$') ? `${payload.product.priceSign}${(price)} ` : `${price}${payload.product?.priceSign}`;
			else sp = price
			if (sp === '' || sp === null) {
				sp = payload.product?.savingsEn ? payload.product.savingsPrefix + ' ' + payload.product.savingsEn : ''
			}
			if (payload.additionalItemFlag === false) {
				newElement = {
					productEn: payload.product.productEn,
					productFr: payload.product.productFr,
					productImage: payload.product.productImage, //salePrice: rootGetters.language=='en' ? '$'+parseFloat(payload.product.salePrice).toFixed(2) : parseFloat(payload.product.salePrice).toFixed(2).replace(".",",")+'$',
					//salePrice: (rootGetters.language == 'en' && (payload.product.salePriceFr === 'NaN' || payload.product.salePriceFr === '' || payload.product.salePriceFr == null)) ? '' : (rootGetters.language == 'en' && (isNaN(payload.product.salePriceFr))) ? (payload.product.salePriceFr) : (rootGetters.language == 'en' && (payload.product.salePriceFr.includes('à'))) ? '$' + (payload.product.salePriceFr) : (rootGetters.language == 'en' && (payload.product.salePriceFr !== 'NaN' || payload.product.salePriceFr !== '' || payload.product.salePriceFr !== null || !payload.product.salePriceFr.includes('à'))) ? '$' + (parseFloat(payload.product.salePriceFr).toFixed(2))

					//	: (rootGetters.language !== 'en' && (payload.product.salePriceFr === 'NaN' || payload.product.salePriceFr === '' || payload.product.salePriceFr == null)) ? '' : (rootGetters.language !== 'en' && (isNaN(payload.product.salePrice))) ? (payload.product.salePriceFr) : (rootGetters.language !== 'en' && (payload.product.salePriceFr.includes('à'))) ? (payload.product.salePriceFr.replaceAll(".", ",")) + '$' : (rootGetters.language !== 'en' && (payload.product.salePriceFr !== 'NaN' || payload.product.salePriceFr !== '' || payload.product.salePriceFr !== null || !payload.product.salePriceFr.includes('à'))) ? (parseFloat(payload.product.salePriceFr).toFixed(2)).replace(".", ",") + '$' : '$' + payload.product.salePriceFr,
					salePrice: payload.product.tags?.includes("bogo") ? payload.product.savingsEn : sp,
					limitQty: isTodayBetweenValidity === true && !payload.product.tags.includes('S&S') ? payload.product.limitQty : '',
					regularPrice: payload.product.regularPrice,
					item: '',
					contents: payload.product.contents,
					sku: payload.product.sku,
					quantity: 1,
					validFrom: payload.product.validFrom,
					validTo: payload.product.validTo,
					flyerDate: state.flyerDate,
					priceQuantity: isTodayBetweenValidity === true ? payload.product.priceQuantity : '',
					salePricePrefix: (rootGetters.language === 'en') ? payload.product.salePricePrefixEn : payload.product.salePricePrefixFr
				}
			} else {
				state.additionalItemCount += 1
				newElement = {
					productEn: '',
					productFr: payload.additionalItem,
					productImage: '/images/icon-generic-product.svg',
					salePrice: payload.additionalItem,
					limitQty: null,
					regularPrice: '',
					item: payload.additionalItem,
					sku: state.additionalItemCount.toString(),
					contents: '',
					quantity: 1,
					validFrom: '',
					validTo: '',
					flyerDate: '',
					priceQuantity: '',
					salePricePrefix: ''
				}
			}
			state.shoppingListV1.push(newElement);
			localStorage[`data_${currentFlyer.title}`] = JSON.stringify({
				shoppingList: state.shoppingListV1, lang: rootGetters.language, content: rootGetters.content, startDate: currentFlyer.startDate, endDate: currentFlyer.endDate, currentDeal: currentFlyer.title
			});
		}
		else {
			if (payload.additionalItemFlag == false) {
				newElement = {
					productEn: payload.product.productEn,
					productFr: payload.product.productFr,
					productImage: payload.product.productImage, //salePrice: rootGetters.language=='en' ? '$'+parseFloat(payload.product.salePrice).toFixed(2) : parseFloat(payload.product.salePrice).toFixed(2).replace(".",",")+'$',
					salePrice: (rootGetters.language == 'en' && (payload.product.salePriceFr === 'NaN' || payload.product.salePriceFr === '' || payload.product.salePriceFr == null)) ? '' : (rootGetters.language == 'en' && (isNaN(payload.product.salePriceFr))) ? (payload.product.salePriceFr) : (rootGetters.language == 'en' && (payload.product.salePriceFr.includes('à'))) ? '$' + (payload.product.salePriceFr) : (rootGetters.language == 'en' && (payload.product.salePriceFr !== 'NaN' || payload.product.salePriceFr !== '' || payload.product.salePriceFr !== null || !payload.product.salePriceFr.includes('à'))) ? '$' + (parseFloat(payload.product.salePriceFr).toFixed(2))

						: (rootGetters.language !== 'en' && (payload.product.salePriceFr === 'NaN' || payload.product.salePriceFr === '' || payload.product.salePriceFr == null)) ? '' : (rootGetters.language !== 'en' && (isNaN(payload.product.salePrice))) ? (payload.product.salePriceFr) : (rootGetters.language !== 'en' && (payload.product.salePriceFr.includes('à'))) ? (payload.product.salePriceFr.replaceAll(".", ",")) + '$' : (rootGetters.language !== 'en' && (payload.product.salePriceFr !== 'NaN' || payload.product.salePriceFr !== '' || payload.product.salePriceFr !== null || !payload.product.salePriceFr.includes('à'))) ? (parseFloat(payload.product.salePriceFr).toFixed(2)).replace(".", ",") + '$' : '$' + payload.product.salePriceFr,
					regularPrice: payload.product.regularPrice,
					item: '',
					sku: payload.product.sku,
					quantity: 1,
					validFrom: payload.product.validFrom,
					validTo: payload.product.validTo,
					priceQuantity: payload.product.priceQuantity,
					salePricePrefix: (rootGetters.language == 'en') ? payload.product.salePricePrefixEn : payload.product.salePricePrefixFr
				}
			}
			else {
				state.additionalItemCount += 1
				newElement = {
					productEn: '',
					productFr: payload.additionalItem,
					productImage: '/images/icon-generic-product.svg',
					salePrice: '',
					regularPrice: '',
					item: payload.additionalItem,
					sku: state.additionalItemCount.toString(),
					quantity: 1,
					validFrom: '',
					validTo: '',
					priceQuantity: '',
					salePricePrefix: ''
				}
				console.log(newElement)

			}
			state.shoppingList.push(newElement);
			localStorage[`data_${currentFlyer.title}`] = JSON.stringify({
				shoppingList: state.shoppingList, lang: rootGetters.language, content: rootGetters.content, startDate: currentFlyer.startDate, endDate: currentFlyer.endDate, currentDeal: currentFlyer.title
			});
		}
		Lytics.TriggerShoppingListProduct("add", newElement.productEn || newElement.productFr, newElement);

	},

	REMOVE_ITEM_SHOPPING_LIST(state, {payload, rootGetters}) {
		const version = payload?.version
		const product =  version==='v1' ? state.shoppingListV1.filter(p=>p.sku===payload.product.sku) : state.shoppingList.filter(p=>p.sku===payload.product.sku)
		if(version==='v1') state.shoppingListV1 = state.shoppingListV1.filter(product => product.sku !== payload.product.sku);
		else state.shoppingList = state.shoppingList.filter(product => product.sku !== payload.product.sku);

		Lytics.TriggerShoppingListProduct("remove", product.productEn || product.productFr, product);
		const currentFlyer = rootGetters["landingPage/currentFlyer"]
		localStorage[`data_${currentFlyer.title}`] = JSON.stringify({
			shoppingList: version=='v1' ? state.shoppingListV1 : state.shoppingList, lang: rootGetters.language, content: rootGetters.content, startDate: currentFlyer.startDate, endDate: currentFlyer.endDate, currentDeal: currentFlyer.title
		});
	},

	HANDLE_QTY_CHANGE(state, {payload, rootGetters}) {
		let item;
		const version = payload?.version;
		item = version=='v1' ? state.shoppingListV1.filter(product => product.sku === payload.sku) : state.shoppingList.filter(product => product.sku === payload.sku) ;
		Lytics.TriggerShoppingListProduct("change_count", payload.productEn || payload.productFr, payload);
		if (payload.operation == 'plus') item[0].quantity = item[0].quantity + 1;


		else if (payload.operation == 'minus') item[0].quantity = item[0].quantity - 1;

		const currentFlyer = rootGetters["landingPage/currentFlyer"]
		localStorage[`data_${currentFlyer.title}`] = JSON.stringify({
			shoppingList: version=='v1' ? state.shoppingListV1 : state.shoppingList, lang: rootGetters.language, content: rootGetters.content, startDate: currentFlyer.startDate, endDate: currentFlyer.endDate, currentDeal: currentFlyer.title
		});

	}, CLEAR_SHOPPING_LIST(state, {rootGetters}) {
		state.shoppingList = []
		state.shoppingListV1 = []
		const currentFlyer = rootGetters["landingPage/currentFlyer"]
		localStorage[`data_${currentFlyer.title}`] = JSON.stringify({
			shoppingList: state.shoppingList, lang: rootGetters.language, content: rootGetters.content, startDate: currentFlyer.startDate, endDate: currentFlyer.endDate, currentDeal: currentFlyer.title
		});
	},

	EMAIL_ERROR(state, val) {
		state.emailError = val;
	}, SET_ADDITIONAL_ITEM_FOCUS(state, val) {
		state.additionalItemInputFocus = val
	}, SET_EMAIL_INPUT_FOCUS(state, val) {
		state.emailInputFocus = val
	},

};

export default {
	namespaced: true, state, getters, actions, mutations,
};