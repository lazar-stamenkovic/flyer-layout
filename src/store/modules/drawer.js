const state = {
	drawerItems: {
		header:{},
		top: {},
		left: {},
		bottom:{},
		right:{}
	}
}

const getters = {
	/*drawerIsOpen(state) {
		return Object.keys(state.drawerItems).length > 0;
	}*/
}

const actions = {
	addToDrawer({commit}, {id, component, drawer, attrs = {}}) {
		//console.log('addToDrawer: id:',id, '  Component:', component, '   attrs:', attrs)
		commit("ADD_TO_DRAWER", {id, component,drawer, attrs})
	},
	removeFromDrawer({commit}, {id, drawer}) {
		commit("REMOVE_FROM_DRAWER", {id, drawer});
	},
	hasContent({state}, drawer){
		return Object.keys(state.drawerItems[drawer]).length > 0;
	}
}

const mutations = {
	ADD_TO_DRAWER(state, {id, component, drawer, attrs}) {
		state.drawerItems[drawer] = Object.assign({}, state.drawerItems[drawer],  {[id]: {component, attrs}});
	},
	REMOVE_FROM_DRAWER(state, {id, drawer}) {
		const items = state.drawerItems[drawer];
		delete items[id];
		state.drawerItems[drawer] = Object.assign({}, items);
	}
}

export default {
	namespaced: true,
	state,
	getters,
	actions,
	mutations,
};
