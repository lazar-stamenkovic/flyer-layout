import { getUrlParameter } from "../../utils";

const state = {
  tourVisible: false,
  showToast: true,
  showHelp: false
};

const getters = {};

const actions = {
  dismissTour({ commit, state }, remember) {
    if (state.tourVisible && remember) {
      try {
        window.localStorage.setItem("wed", "true");
      } catch (e) {
        console.log(e);
      }
    }
    commit("SET_TOUR_VISIBILITY", false);
  },

  viewTour({ commit }) {
    commit("SET_TOUR_VISIBILITY", true);
  },

  checkTourState({ commit }) {
    const viewed = () => {
      try {
        return window.localStorage.getItem("wed");
      } catch (e) {
        return true;
      }
    };
    if (
      viewed() == "true" ||
      getUrlParameter("skipWalkthrough") ||
      // window.innerWidth < 1200
      window.innerWidth < 1023
    ) {
      commit("SET_TOUR_VISIBILITY", false);
    } else {
      commit("SET_TOUR_VISIBILITY", true);
    }
  },

  toggleHelp({ commit, state } ) {
     commit("SET_HELP", !state.showHelp);
  }
};

const mutations = {
  SET_HELP(state, val) {
    state.showHelp = val;
  },
  SET_TOUR_VISIBILITY(state, val) {
    state.tourVisible = val;
    if (val) {
      state.showHelp = false;
    }
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
