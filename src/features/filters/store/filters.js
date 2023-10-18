/* eslint-disable no-case-declarations */
import router from "@/router";
import Service from "@/api/Service";
import FilterPanel from "@/features/filters/FilterPanel.vue";
//import Vue from "vue";
//import {isEmpty} from "lodash";


//import config from "@/flyerConfig.json";

//Search debounce timeout id;
let sdid = null;

function convertApiDataToListItem(apiFilters) {
    return apiFilters.map((item) => {
        if(!!item?.label && !!item?.checkbox) return item;
        const label = (typeof item === 'string') ? item : item?.titleEn;
        let subItems = (Array.isArray(item?.subcategories) ? convertApiDataToListItem(item.subcategories): []).filter((item) => {
            return !!item.label;
        });

        subItems = subItems.length? subItems: null;

        return {
            label,
            subItems,
            checkbox: {
                selected: false
            }
        };
    })
}

function setDropDownItemsSelectState(items, state) {
    for(let i =0; i < items.length; i++){
        const item = items[i];
        item.checkbox.selected = state;
        if(item.subItems) {
            setDropDownItemsSelectState(item.subItems, state);
        }
    }
}

function parseFilterItemValue(items, v, format, sid) {
    items.forEach((item) => {
        if (item.checkbox.selected) {
            switch (format) {
                case 'boolean':
                    //Vue.set(v, item.id || item.label, true);
                    v[item.id || item.label] = true;
                    break;
                case 'single':
                    //Vue.set(v, sid, item.value || item.label)
                    v[sid] = item.value || item.label
                    break;
                default:
                    if (!v[sid]) {
                        //Vue.set(v, sid, [])
                        v[sid] = [];
                    }
                    v[sid].push(item.value || item.label)
            }
        }
        if(Array.isArray(item.subItems) && sid === 'category') {
            parseFilterItemValue(item.subItems, v, format, 'subCategory')
        }
    })
}


const state = {
    filterData: [],
    filterPanelDrawer: 'header'
}
const getters = {
    config(state, getters, rootState, rootGetters) {
        const features = rootGetters['config/features'];
        return features?.filters || [];// JSON.parse(JSON.stringify(features.filters));
    },

    filters(state, getters) {
        const fd = state.filterData;
        const config = getters.config;
        // console.log('***** Updating Filters')
        return config.map((fc) => {
            if (fc?.sections) {
                fc.sections = fc.sections.map((section) => {
                    const rdProp = section?.loadFrom || section?.name;
                    /*if(!section._items) {
                        section._items = cloneDeep(section.items);
                    }*/
                    if (fd[rdProp]) {
                        /*Vue.set(section, 'items', (section?.customItems || []).concat(convertApiDataToListItem(fd[rdProp])).sort((a, b) => {
                            return a.label.localeCompare(b.label);
                        }))*/
                        section.items = (section?.customItems || []).concat(convertApiDataToListItem(fd[rdProp])).sort((a, b) => {
                            return a.label.localeCompare(b.label);
                        });
                    }
                    return section;
                })
            }
            return fc;
        })
    },
    filtersByType(state, getters) {
        const f = {};
        getters.filters.forEach((filter) => {
            if(!filter?.type)return;
            const type = filter.type;
            if(!f[type]) {
                f[type] = [];
            }
            f[type].push(filter);
        })
        return f;
    },
    filtersByName(state, getters){
      const f = {};
      getters.filters.forEach((filter) => {
          if(!filter?.name)return;
          f[filter.name] = filter;
      })
        return f;
    },

    searchQuery(state, getters) {
        const filters = getters.filters;

        if(!filters)return [];

        const v = {};

        filters.forEach((filter) => {
            const sections = filter?.sections;
            switch(filter.type) {
                case 'dropdown':
                    if(!sections)return;
                    sections.forEach((section) => {
                        const sid = section.id;
                        const format = section?.format ?? 'array';
                        parseFilterItemValue(section.items, v, format, sid);
                        /*section.items.forEach((item) => {
                            if (item.checkbox.selected) {
                                switch (format) {
                                    case 'boolean':
                                        //Vue.set(v, item.id || item.label, true);
                                        v[item.id || item.label] = true;
                                        break;
                                    case 'single':
                                        //Vue.set(v, sid, item.value || item.label)
                                        v[sid] = item.value || item.label
                                        break;
                                    default:
                                        if (!v[sid]) {
                                            //Vue.set(v, sid, [])
                                            v[sid] = [];
                                        }
                                        v[sid].push(item.value || item.label)
                                }
                            }
                        });*/
                    })
                break;
                case 'toggle-button':
                case 'searchbar':
                    if(filter.value){
                        //Vue.set(v, filter.name, filter.value);
                        v[filter.name] = filter.value;
                    }
                break;
                case 'rangeList':
                    const items = filter.items;
                    let selected = null;
                    for(let i=0; i < items.length; i++){
                        const item = items[i];
                        if(item.selected) selected = item;
                    }
                    if(selected){
                        v[filter.name] = selected.value;
                    }
                break;
            }
        })

        return v;
    },
    hasFilters(state, getters) {
        return !!Object.keys(getters.searchQuery).length;
    },
    drawerItems(state, getters, rootState) {
        return rootState.drawer.drawerItems;
    },
    isFilterPanelOpen(state, getters){
        const items = getters.drawerItems[state.filterPanelDrawer];
        return !!items['filters'];
    }
}
const actions = {
    async loadFlyerFilters({commit}) {
        const flyerId = router.currentRoute.params.flyerId;
        const storeId = parseInt(router.currentRoute.query?.storeId || '', 10);
        const lang = router.currentRoute.query.language === 'fr' ? 'bil' : 'en';

        const filters = await Service.GetAllFilters(flyerId, storeId, lang);
        commit('SET_FILTER_DATA', filters);
    },
    clearFilters({ getters }) {
        const filters = getters.filters;

        if(!filters)return;
        filters.forEach((filter) => {
            const sections = filter?.sections;

            switch(filter.type) {
                case 'dropdown':
                    if(!sections)return;
                    sections.forEach((section) => {
                        setDropDownItemsSelectState(section.items, false);
                        /*section.items.forEach((item) => {
                            item.checkbox.selected = false;
                        });*/
                    })
                break;
                case 'toggle-button':
                    filter.value = false;
                break;
                case 'searchbar':
                    filter.value = '';
                break;
                case 'rangeList':
                    filter.items.forEach((item) => {
                        item.selected = false;
                    })
                break;
            }

        })
    },

    setFilterPanelState({dispatch, state}, fs) {
        if(!fs){
            dispatch('drawer/removeFromDrawer', {id: 'filters', drawer: state.filterPanelDrawer}, {root: true})
        } else {
            dispatch('drawer/addToDrawer', {id: 'filters', component: FilterPanel, drawer: state.filterPanelDrawer}, {root: true})
        }

    },

    executeFilter({ getters , dispatch }) {
        if(sdid)return;

        sdid = setTimeout(() => {
            dispatch('search/filterProducts', getters.searchQuery, {root:true} )
            sdid = null;
        }, 1);

    }
}
const mutations = {
    SET_FILTER_DATA(state, filters) {
        state.filterData = filters;
    }
}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations,
};
