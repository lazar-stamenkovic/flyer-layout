import { getUrlParameter } from "../utils";
import Vue from "vue";
import Vuex from "vuex";

import categories from "./modules/categories";
import search from "./modules/search";
import scale from "./modules/scale";
import screen from "./modules/screen";
import toast from "./modules/toast";
import landingPage from "./modules/landingPage";
import config from "./modules/config";
import shoppingList from "../features/shopping-list/store/shoppingList";
import deepLinking from "@/store/modules/deepLinking";
import Lytics from "@/classes/Lytics";
import filters from "../features/filters/store/filters";
import en from "@/lang/en.json";
import fr from "@/lang/fr.json";
import {merge} from "lodash";
import router from "@/router";
import pdp from "@/features/pdp/store/pdp";
import Service from "@/api/Service";
import Rest from "@/api/Rest";
import header from "@/store/modules/header";
import drawer from "@/store/modules/drawer";
import ctUser from "@/features/offers/store/ctUser";
import events from "@/store/modules/events";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    loading: 0,
    pageData: null,
    pages: [],
    totalPages: 0,
    columnView: false,
    /*highlightResults: false,*/
    language: "en",
    currentStore: null,
    currentPageNumber:1,
    zonesArray: null,
    pdf: null,
    apiUrl: process.env.VUE_APP_API_URL,
    subscriptionKey: process.env.VUE_APP_API_KEY,
    banner: process.env.VUE_APP_BANNER,
    searchInputFocused: false,
    showPdp: false,
    showHamburgerMenu:false,
    showSideBar:false,
    currentProduct:null,
    currentVideo: null,
    showFilters: false,
  },

  getters: {
    language() {
      return router.currentRoute.query.language || 'en';
    },
    storeId() {
      return parseInt(router.currentRoute.query.storeId || '', 10);
    },

    filterableItems(state) {
      return state.pages.map((page) => page.blocks).flat();
    },

    hasBaseBars(state) {
      return state.pages.some((page) => !!page.basebars)
    },

    currentZone(state) {
      let l = -1;
      let z = "";
      const pages = state.pages;
      pages.map((page) => {
        page.blocks.map((block) => {
          if (block.zones?.length > l) {
            l = block.zones.length;
            z = block.zones[0];
          }
        });
      });
      return z;
    },

    // eslint-disable-next-line no-unused-vars
    content(state, getters) {
      return getters.lang;
    },

    lang(state, getters, rootState, rootGetters) {
      const dict = {en, fr};
      const config = rootGetters['config/settings'];
      return merge(dict[getters.language], (config?.lang || {})[getters.language]);
    },

    highlightResults(state, getters, rootState, rootGetters) {
      const currentFlyer = rootGetters["landingPage/currentFlyer"];
      return !currentFlyer?.blockedFlyer;
    },
    isSearchInputFocused(state) {
       return state.searchInputFocused;
    }

  },

  actions: {

    setLoadingState({commit}, ls) {
      commit("UPDATE_LOADING", ls?1:-1);
    },

    async setPages({ commit, getters, dispatch }, flyerId) {
      // console.log("** setPages:", flyerId)
      commit("UPDATE_LOADING", 1);

      await dispatch('config/loadConfig');


      const storeId = getters.storeId;
      const lang = getters.language === 'fr' ? 'bil' : 'en'; //  getUrlParameter("language") === 'fr' ? 'bil' : 'en';


     try {
        const  data = await Service.GetFlyerPage(flyerId, storeId, lang);// await Rest.Get(`pages/${flyerId}/${storeId}/${lang}/`);

        commit("SET_PAGES", data);

      } catch (error) {
        await Rest.GotoErrorPage(error);
      }

      commit("UPDATE_LOADING", -1);
      //router.push({ name: 'DefaultFlyer', params: { flyerId: flyerId,...router.currentRoute.params }, query: router.currentRoute.query })
    },

    updatePages({ commit }, pages) {
      commit("SET_PAGES", pages);
    },

    setTotalPages({ commit }, value) {
      commit("SET_TOTAL_PAGES", value);
    },

    setColumnView({commit, dispatch, state}, isColumnView) {
      if(state.columnView !== isColumnView) {
        commit("SET_COLUMN_VIEW", isColumnView);
        Lytics.TriggerScreenOrientationChange();
        dispatch("screen/handleWindowResize");
      }
    },

    toggleColumnView({ commit, dispatch }) {
      commit("TOGGLE_COLUMN_VIEW");
      Lytics.TriggerScreenOrientationChange();
      dispatch("screen/handleWindowResize");
    },
    toggleMobileFilters({commit}){
      commit("TOGGLE_MOBILE_FILTERS")
    },

   /* setHighlightResults({ commit }, val) {
      commit("SET_HIGHLIGHT_RESULTS", val);
    },*/

    setLanguage({ commit }) {
      const lang = getUrlParameter("language");
      commit("SET_LANGUAGE", lang);
    },

    setCurrentStore({ commit }, store) {
      commit("SET_CURRENT_STORE", parseInt(store));
    },

    setZonesArray({ commit }, zones) {
      commit("SET_ZONES_ARRAY", zones);
    },

    setPdf({ commit }, pdf) {
      commit("SET_PDF", pdf);
    },

    setSearchInputFocusState({ commit }, s) {
      commit("SET_SEARCH_INPUT_FOCUSED", s);
    },

    setPdpDisplay({ commit }, value) {
      commit("SET_PDP_DISPLAY", value);
    },
    setCurrentProduct({ commit }, e) {
      commit("SET_CURRENT_PRODUCT", e);
    },

    setCurrentVideo({ commit }, url) {
      commit("SET_CURRENT_VIDEO", url);
    },

    toggleHamburgerMenu({ commit }, value) {
      commit("SHOW_HAMBURGER_MENU", value);
    },

    toggleSideBarState({commit}, value){
      commit('TOGGLE_SIDEBAR',value)
    },


    setCurrentPageNumber({commit},val){
      commit("SET_CURRENT_PAGE_NUMBER",val)
    }
  },

  mutations: {
    UPDATE_LOADING(state, val) {
      state.loading += val;
    },

    SET_PAGE_DATA(state, data) {
      state.pageData = data;
    },

    SET_PAGES(state, pages) {
      state.pages = pages;
    },

    SET_TOTAL_PAGES(state, value) {
      state.totalPages = value;
    },

    SET_COLUMN_VIEW(state, isColumnView) {
      state.columnView = isColumnView;
    },

    TOGGLE_COLUMN_VIEW(state) {
      state.columnView = !state.columnView;
      // state.showPdp = false
    },

    /*SET_HIGHLIGHT_RESULTS(state, val) {
      state.highlightResults = val;
    },*/

    SET_LANGUAGE(state, lang) {
      state.language = lang;
    },

    SET_CURRENT_STORE(state, store) {
      state.currentStore = store;
    },

    SET_ZONES_ARRAY(state, zones) {
      state.zonesArray = zones;
    },

    SET_PDF(state, pdf) {
      state.pdf = pdf;
    },

    SET_SEARCH_INPUT_FOCUSED(state, s) {
      state.searchInputFocused = s;
      state.showHamburgerMenu=false;
      state.showSideBar=false;
      state.showPdp = false

    },

    SET_PDP_DISPLAY(state, value) {
      state.showPdp = value;
    },

    SET_CURRENT_PRODUCT(state, e) {
      state.currentProduct = e;
    },

    SET_CURRENT_VIDEO(state, url) {
      state.currentVideo = url;
    },

    SET_CURRENT_PAGE_NUMBER(state,val){
      state.currentPageNumber=val
    },

    SHOW_HAMBURGER_MENU(state, value) {
      state.showHamburgerMenu = value;
    },
    TOGGLE_SIDEBAR(state,value){
      state.showSideBar=value;
    },
    TOGGLE_MOBILE_FILTERS(state){
      state.showFilters = !state.showFilters;
    }
  },

  modules: {
    categories,
    search,
    scale,
    screen,
    toast,
    landingPage,
    config,
    shoppingList,
    deepLinking,
    filters,
    pdp,
    header,
    drawer,
    ctUser,
    events
  },
});
