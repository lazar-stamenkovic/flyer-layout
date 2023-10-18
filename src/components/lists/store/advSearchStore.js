import {filters, popSearch, products, suggest} from "@/data/searchData";

const state = {
    suggest: suggest,
    popSearch: popSearch,
    products: products,
    filters: filters,
    visible: true
};
const getters = {
    categories(state, getters, rootState){
        const cats = rootState.categories.categories;
        return cats.map((item) => {
            return {
                label: item.name,
                category: item,
                checkbox: {
                    selected: item.checked,
                    onChange: (v) => item.checked = v
                }
            }
        })
    }
};
const actions = {
    setVisibility({commit}, visible) {
        commit('SET_VISIBILITY', visible);
    }
};
const mutations = {
    SET_VISIBILITY(state, v) {
        state.visible = v;
    }
}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations,
};