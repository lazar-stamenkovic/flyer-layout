import SearchApi from '../../api/Search'

const state = {
  query: '',
  showMobileSearchBar: false,
  showSubHeader: false,
  filteredItems: [],
  showSearchResults: false
};

const getters = {
  filteredItems(state) {
    return state.filteredItems
  },

  showSearchResults(state) {
    return state.showSearchResults
  }
};

const actions = {

  async filterProducts({ commit, rootGetters, rootState }, filterQuery) {
    // console.log('Filter Products:', filterQuery)
    const currentFlyer = rootGetters["landingPage/currentFlyer"];

    const showResults = !!Object.keys(filterQuery).length;

    if(!showResults) {
      commit("SHOW_SEARCH_RESULTS", false);
      return;
    }

    //dispatch('setLoadingState', true, {root:true});
    const products = await SearchApi.Post(currentFlyer.title, rootState.currentStore, rootGetters.language, filterQuery, rootGetters.highlightResults);
    commit("SHOW_SEARCH_RESULTS", true);
    commit("UPDATE_FILTERED_ITEMS", products);
   // dispatch('setLoadingState', false, {root:true});
  },


  async updateSearchQuery({ commit, dispatch }, query) {
    commit("UPDATE_SEARCH_QUERY", query);
    dispatch("searchProducts");
    if (query) {
      window.parent.postMessage(
          window.JSON.stringify({
            type: "SEARCH_TERM",
            searchTerm: query
          }),
          '*'
      )
    }
  },

  setSubHeaderState({ commit }, val) {
    commit('SET_SUB_HEADER_STATE', val);
  },

  toggleMobileSearchBar({ commit }) {
    commit("TOGGLE_MOBILE_SEARCH_BAR");
  },

  closeMobileSearchBar({ commit }) {
    commit("CLOSE_MOBILE_SEARCH_BAR");
  },

};

const mutations = {

  UPDATE_SEARCH_QUERY(state, query) {
    state.query = query;
  },

  UPDATE_FILTERED_ITEMS(state, filteredItems) {
    state.filteredItems = filteredItems
  },

  SHOW_SEARCH_RESULTS(state, value) {
    state.showSearchResults = value
  },

  TOGGLE_MOBILE_SEARCH_BAR(state) {
    state.showMobileSearchBar = !state.showMobileSearchBar;
  },

  CLOSE_MOBILE_SEARCH_BAR(state) {
    state.showMobileSearchBar = false;
  },

  SET_SUB_HEADER_STATE(state, val) {
    state.showSubHeader = val;
  }

};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
