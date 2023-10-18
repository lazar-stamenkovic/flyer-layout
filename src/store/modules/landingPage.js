//import { getUrlParameter } from "../../utils";
//import axios from "axios";
import moment from "moment";
import Rest from "@/api/Rest";
import router from "@/router";
import Service from "@/api/Service";


const sortOrder = [
  "IEP",
  "Grand Opening",
  "Weekly Flyer",
  "Dollar Rush",
  "Other Publications - Responsive",
  "Other Publications - Static"
];

function getWeights(sortOrder) {
  const o = {};
  let c = 0;
  sortOrder.forEach((val) => {
    o[val] = c;
    o[`${val} preview`] = ++c;
    c++;
  })
  return o;
}

const weights = getWeights(sortOrder);



// eslint-disable-next-line no-unused-vars
function getFlyerWeight(flyer){
  const id = flyer.flyerType === 'preview'? `${flyer.flyerCategory} preview`: flyer.flyerCategory;
  return weights[id] ?? 99;
}

const state = {
  flyers: [],
  /*currentFlyer: {},*/
  /*previewDate:'',*/
  languageError: false,
  dateError:false,
  flyerId: null
};

const getters = {
  downloadablePDF(state, getters) {
    const pdfId = getters.currentFlyer.pdf;
    if (!pdfId) return null;
    return pdfId;
  },
  currentFlyer(state, getters, rootState) {
    let flyer = null;
    const flyerId = state.flyerId;
    if(!flyerId || !state.flyers.find( flyer => flyer.title === flyerId )){
      flyer = state.flyers.find(flyer => {
        return flyer.flyerCategory.includes('Weekly') && flyer.flyerType==='live' ;
      }) || state.flyers.find(flyer => {
        return flyer.flyerCategory.includes('Weekly') && flyer.flyerType==='preview' ;
      });
    } else {
      flyer = state.flyers.find(flyer => {
        return flyer.title === flyerId ;
      });
    }

    if(flyer) {
      document.title = flyer.title;
    }

    rootState.currentStore = parseInt( router.currentRoute.query.storeId || '' , 10);

    return flyer;
  },
  previewDate(state, getters){
     return moment(getters?.currentFlyer?.startDate).subtract(1,'days').format();
  },
  sortedFlyers(state){
    return state.flyers.sort((a, b) => {
      return getFlyerWeight(a) - getFlyerWeight(b);
    })
  }
};

const actions = {
  async getFlyersData({ commit }) {
    const currentRoute = router.currentRoute;
    const storeId = currentRoute.query['storeId'];
    const lang = currentRoute.query['language'];
    const date = currentRoute.query['timeTravelDate'] ?? moment();

    commit("UPDATE_LOADING", 1, { root: true })
    try {
      const data = await Service.GetFlyerData(storeId, lang, date );
      commit('SET_FLYERS', data.flyers);
    } catch (error) {
      await Rest.GotoErrorPage(error);
    }

    commit("UPDATE_LOADING", -1, { root: true });
    // console.log('getFlyerData complete')
  },

  async setCurrentFlyer({ commit }, flyerId) {
    commit("SET_FLYER_BY_ID", flyerId);
  }
};

const mutations = {
  SET_FLYERS(state, data) {
    state.flyers = data;
  },

  SET_FLYER_BY_ID(state, flyerId) {
    state.flyerId = flyerId;
  },

  SET_CURRENT_FLYER(state, flyer) {
    state.currentFlyer = flyer;
    // alert('called')
    // console.log('current deal is ',state.currentFlyer.title)
    state.previewDate = moment(state.currentFlyer.startDate).subtract(1,'days').format();
  },

  SET_LANGUAGE_ERROR(state, languageError) {
    state.languageError = languageError;
  },
  SET_DATE_ERROR(state, dateError) {
    state.dateError = dateError;
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
