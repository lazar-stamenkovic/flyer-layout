//import config from "@/flyerConfig.json";
import router from "@/router";
import Rest from "@/api/Rest";
// eslint-disable-next-line no-unused-vars
import {cloneDeep, get, merge, set} from "lodash";
import AppConfig from "@/classes/AppConfig";
//import {findObjectPathsByKey} from "find-object-paths";

//const _configCache = {};

function getContrastYIQ(hexcolor){
  if (!hexcolor) return null;

  if (hexcolor.slice(0, 1) === "#") {
    hexcolor = hexcolor.slice(1);
  }

	var r = parseInt(hexcolor.substr(0,2),16);
	var g = parseInt(hexcolor.substr(2,2),16);
	var b = parseInt(hexcolor.substr(4,2),16);
	var yiq = ((r*299)+(g*587)+(b*114))/1000;
	return (yiq >= 128) ? 'black' : 'white';
}


/**
 * Search object and return a list of objects paths that are a parent of 'key'
 * @param o - Object to search
 * @param key - Property to match
 * @param result - an array of object paths
 * @param depth - how deep to to search
 * @param path
 * @returns null | {*[]}
 */
// eslint-disable-next-line no-unused-vars
function findByKey(o, key, result = [], depth = 10, path = null) {
  if(depth <= 0)return;
  console.log('Depth:', depth);
  //console.log('Result:', o)
  for(let p in o) {
    const pv = o[p];
    if(p === key) {
      result.push(path);
    } else if (typeof pv === 'object') {
        console.log('key:', p)
        findByKey(pv, key, result, depth - 1, Array.isArray(o)? `${path}[${p}]`: (!path)? p: `${path}.${p}`);
    }
  }
  return result;
}


// eslint-disable-next-line no-unused-vars
function parseFeatureDisplay(feature, displayMode) {
  let o = Object.assign({}, feature);
  if (feature._display && feature._display[displayMode]) {
    o = merge(feature, feature._display[displayMode]);
  }
  delete o._display;
  console.log('Parsed Feature Display:', o);
  return o;
}

const state = {
  config: null
};

const getters = {
  // eslint-disable-next-line no-unused-vars
  settings(state, getters, rootState, rootGetters) {
    return state.config || {};
    /*const c = state.config;// JSON.parse(JSON.stringify(state.config));
    const _display = findByKey(c, '_display', []);
    const displayMode = rootGetters['screen/displayMode'];

    _display.map((path) => {
      set(c, path, parseFeatureDisplay(get(c, path), displayMode));
    })

    return c || {};// state.config || {};// flyer?.config || {};*/
  },

  branding(state, getters) {
    return getters.settings.branding || {};
  },

  // eslint-disable-next-line no-unused-vars
  features(state, getters, rootState, rootGetters) {
    return getters.settings.features;
  },

  cssVars(state, getters) {
    const branding = getters.branding;

    return {
      '--primary-color': branding?.primaryColor,
      '--secondary-color': branding?.secondaryColor,
      '--primary-color_opacity': branding?.primaryColor + '20',
      '--primary-text-color': getContrastYIQ(branding?.primaryColor),
      '--secondary-text-color': branding?.secondaryTextColor || getContrastYIQ(branding?.secondaryColor),
      '--tertiary-color': branding?.tertiaryColor,
    }
  },

  rootStyle(state, getters) {
    let style = [];
    for(let [key, value] of Object.entries(getters.cssVars)){
      if(key && value !== null){
        style.push(`${key}:${value}`);
      }
    }
    return `<style>#app{
                ${style.join(';')}
            }</style>`;
  }
};

const actions = {
  async loadConfig({rootGetters, commit}) {
    const path = router.currentRoute.query._fc || '';
    const config = await AppConfig.LoadConfig(`flyer`, path);
    const flyer =  rootGetters['landingPage/currentFlyer'];
    const rewardsButtonTitle = flyer?.config?.branding?.rewardsButtonTitle;
    const mergedConfig = merge({}, config, {branding: {rewardsButtonTitle}});
    if(config) {
      commit('SET_CONFIG', mergedConfig);
    } else {
      await Rest.GotoErrorPage({
        response: {
          data: {
            title: 'invalid config'
          }
        }
      })
    }

    /*try{
      const config = await fetch(`/config/flyer-${path}.json`);
      const json = await config.json();
      console.log('** Loaded Config:', json);
      //_configCache[path] = JSON.stringify(json);
      await commit('SET_CONFIG', json);
    } catch (e) {
      console.log('Config Load Error:', e)
      await Rest.GotoErrorPage({
        response: {
          data: {
            title: 'invalid config'
          }
        }
      })
    }*/

  },

  parseFeature({rootGetters}, feature) {
    let f = cloneDeep(feature);
    const displayMode = rootGetters['screen/displayMode'];
    if (f._display && f._display[displayMode]) {
      f = merge(f, f._display[displayMode]);
    }
    delete f._display;
    return f;
  }
};

const mutations = {
  SET_CONFIG(state, config) {
    state.config = config
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
