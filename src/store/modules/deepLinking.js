const state = {
	rawHash: ''
}

const getters = {
	urlHash(state) {
		const rh = state.rawHash.slice(1).split('&');
		let o = {};

		rh.map((i) => {
			const item = i.split('=');
			o[item[0]] = item[1];
		})

		return o;
	}
}

const actions = {
	updateHash({commit}, hash) {
		commit('UPDATE_HASH', hash);
	},

	findPageWithSku({rootState}, sku) {
		const pages = rootState.pages || [];
		return pages.find((page) => {
			return page.blocks.find((block) => {
				return block.products.find((product) => {
					return product.sku === sku;
				})
			})
		})
	}
}

const mutations = {
	UPDATE_HASH(state, hash) {
		state.rawHash = hash
	}
}


export default {
	namespaced: true,
	state,
	actions,
	mutations,
	getters
}
