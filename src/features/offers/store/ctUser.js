
import CTParent from "@/features/offers/classes/CTParent";
import PersonalizationApi from "@/features/offers/api/PersonalizationApi";
import TriangleRewardsCard from "@/features/offers/TriangleRewardsCard.vue";
import BlockGen from "@/features/offers/classes/BlockGen";
import offers from "@/features/offers/data/offers.json";
import OfferListItem from "@/features/offers/OfferListItem.vue";
import router from "@/router";

const state = {
/*	isLoggedIn: false,
	triangleID: null,*/
	loadedOffers: null
}

const getters = {
	isLoggedIn() {
		return router.currentRoute?.query?.isCustomerLoggedIn === 'true';
	},
	triangleID() {
		return router.currentRoute?.query?.custID;
	},

	offerViewMode(state, getters, rootState, rootGetters) {
		return rootGetters['landingPage/currentFlyer'].flyerType;
		//return rootState.landingPage.currentFlyer?.flyerType;
	},

	offersPage(state, getters, rootState) {
		return rootState.pages.find((page) => {
			return page.id === 'triangleRewards';
		})
	},

	isSignedIn(state, getters){
		return getters.isLoggedIn && getters.triangleID;
	},

	//Is the user logged into Canadian Tire
	isLoggedIntoCT(state, getters){
		return !!getters.isLoggedIn;
	},

	hasTriangleID(state, getters){
		return !!getters.triangleID;
	},
	canViewTriangleRewards(state, getters) {
		const today = new Date();
		const dayOfWeek = 2; //Tuesday
		return getters.isLoggedIntoCT && getters.hasTriangleID && !(getters.offerViewMode !== 'live' && today.getDay() === dayOfWeek);// && getters.offerViewMode === 'live';
	},
	canViewPreviewText(state, getters) {
		const today = new Date();
		const dayOfWeek = 2; //Tuesday
		const {isLoggedIntoCT, hasTriangleID, offerViewMode} = getters;
        const isTuesday = today.getDay() === dayOfWeek 

		return isLoggedIntoCT && hasTriangleID && ((offerViewMode === 'preview' && isTuesday ) || (offerViewMode === 'preview' || isTuesday ))
		 && !(offerViewMode === 'live' && isTuesday);
	},
	currentDeal(state, getters, rootState, rootGetters) {
		const deal = rootGetters["landingPage/currentFlyer"]?.title; //rootState.landingPage?.currentFlyer?.title  //rootState["landingPage/currentFlyer"]?.title;
		if(deal) {
			return parseInt(deal.match(/([0-9])\w+/g), 10);
		}
	},
	currentStore(state, getters, rootState) {
		return rootState.currentStore;
	},
	language(state, getters, rootState) {
		return rootState.language;
	},
	hasOffers(state) {
		return !!state.loadedOffers;
	},
	triangleOffers(state) {
		if(state.loadedOffers) return state.loadedOffers.products;
		const fake = [];
		for(let i=0; i < 10; i++){
			const ri = Math.round((offers.length - 1) * Math.random());
			const item = offers.splice(ri, 1)[0];
			item.isFake = true;
			fake.push(item);
		}
		return fake;
	},
	isFakeOffers(state) {
		return !state.loadedOffers;
	}
}

const actions = {
	triggerUserDialog({ getters }) {
		console.log('Trigger User Dialog');
		if(getters.isLoggedIn && !getters.triangleID){
			CTParent.ShowTriangleLink();
		} else if(!getters.isLoggedIn) {
			const deal = getters.currentDeal;// rootGetters.landingPage.currentFlyer.title;
			CTParent.ShowCTLogin(deal?deal:null);
			// const lang = getters.language;
			// console.log("language is ",   lang)
			// if(lang=="en")
			// window.open("https://www.canadiantire.ca/en/triangle-registration.html")
			// else
			// window.open("https://www.canadiantire.ca/fr/registre.html")
		}
	},

	async loadOffers( {commit, state, getters, dispatch} ) {
		// console.log('loadOffers')
		const dealNo = getters.currentDeal;
		const storeId = getters.currentStore;
		if((dealNo && storeId && getters.canViewTriangleRewards && !state.loadedOffers) || ( state.loadedOffers && ((state.loadedOffers.dealNo !== dealNo) || (state.loadedOffers.customerId !== getters.triangleID)) && getters.canViewTriangleRewards)) {
			// console.log('Attempt to load offers')
			try {
				const offers = await PersonalizationApi.GetOffers(getters.triangleID, dealNo, storeId, getters.language);
				commit('APPLY_OFFERS', offers);
			} catch (e) {
				commit('APPLY_OFFERS', null);
			}
		}
		dispatch('updateOfferBlocks');
	},

	updateOfferBlocks({ getters }) {
		const page = getters.offersPage;
		const offers = getters.triangleOffers;
		const unitWidth = page.unitWidth;
		const unitHeight = page.unitHeight;
		page.blocks.length = 0;
		
		if (!getters.isLoggedIntoCT || !getters.triangleID || getters.canViewPreviewText){
			page.blocks.push(BlockGen.GenBlock(3, 4, unitWidth, unitHeight, {}, {id:'triangleRewards_card', type: 'component', component: TriangleRewardsCard, hasOffers: getters.hasOffers}));
		} else {
			page.blocks.push(BlockGen.GenBlock(2, 1, unitWidth, unitHeight, {}, {id:'triangleRewards_card', type: 'component', component: TriangleRewardsCard, hasOffers: getters.hasOffers}));
			if(page) {
				for(let i=0; i < offers.length; i++) {
					page.blocks.push(BlockGen.GenBlock(1, 1, unitWidth, unitHeight, {}, {type: 'component', component: OfferListItem, componentData: offers[i], index: i + 1 }));
				}
				//page.blocks = blocks;
			}
		}
		
		
	}
}

const mutations = {
/*	SET_LOGGED_IN_STATE(state, val) {
		state.isLoggedIn = val;
	},

	SET_TRIANGLE_ID(state, val) {
		state.triangleID = val;
	},*/

	APPLY_OFFERS(state, offers) {
		if(offers?.products?.length){
			state.loadedOffers = offers;
		} else {
			state.loadedOffers = null;
		}
	}
}

export default {
	namespaced: true,
	state,
	mutations,
	actions,
	getters
};
