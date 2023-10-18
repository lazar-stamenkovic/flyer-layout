import ParentComms from "@/classes/ParentComms";

const MODE_INTERNAL = 'internal';
const MODE_EXTERNAL = 'external';

import ObjPropParser from "@/classes/ObjPropParser";


const state = {
	isVisible: false,
	product: null
}

const getters = {
	config(state, getters, rootState, rootGetters) {
		const config = rootGetters["config/features"];
		return config?.pdp;
	},
	enabled(state, getters) {
		const config = getters.config;
		return config && config?.enabled !== false;
	},
	mode(state, getters) {
		return getters.config?.mode;
	}
}

const actions = {
	open({ commit, dispatch, getters }, product){
		commit('SET_PRODUCT', product);
		switch(getters.mode) {
			case MODE_INTERNAL:
				commit('SET_VISIBILITY', true);
			break;
			case MODE_EXTERNAL:
				dispatch('sendPost');
			break;
		}
	},
	close( {commit} ) {
		commit('SET_PRODUCT', null);
		commit('SET_VISIBILITY', false);
	},
	sendPost({ state, getters, rootGetters, rootState }){
		const flyer = rootGetters['landingPage/currentFlyer'];
		ParentComms.SendData(ObjPropParser.Parse(getters?.config?.post, {__product: state.product, __flyer:flyer, __root:rootState}));
	}
}

const mutations = {
	SET_VISIBILITY(state, value) {
		state.isVisible = value;
	},
	SET_PRODUCT(state, product){
		state.product = product;
	}
}

export default {
	namespaced: true,
	state,
	getters,
	actions,
	mutations
};
