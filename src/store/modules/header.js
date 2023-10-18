const state = {
	drawerItems: {}
}

const getters = {
	drawerIsOpen(state) {
		return Object.keys(state.drawerItems).length > 0;
	}
}

const actions = {
	addToDrawer({commit}, {id, component, attrs = {}}) {
		console.log('addToDrawer: id:',id, '  Component:', component, '   attrs:', attrs)
		commit("ADD_TO_DRAWER", {id, component, attrs})
	},

	removeFromDrawer({commit}, id) {
		commit("REMOVE_FROM_DRAWER", id);
	}
}

const mutations = {
	ADD_TO_DRAWER(state, {id, component, attrs}) {
		state.drawerItems = Object.assign({}, state.drawerItems,  {[id]: {component, attrs}});
	},
	REMOVE_FROM_DRAWER(state, id) {
		const items = state.drawerItems;
		delete items[id];
		state.drawerItems = Object.assign({}, items);
	}
}

export default {
	namespaced: true,
	state,
	getters,
	actions,
	mutations,
};
