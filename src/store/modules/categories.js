// import axios from "axios";
import {getUrlParameter} from "@/utils";
import router from "@/router";
import Service from "@/api/Service";

const lang = getUrlParameter("language") === 'fr' ? 'bil' : 'en';

const state = {
  categories: [],
  productsOf:[],
  selectedCategory: null,
  showCategoriesDropDown: false,
  expandedCategory: null,
  allCategory: {
    name: lang === "en" ? "ALL" : "TOUT",
    checked: false
  },
  showMobileCategories:false,
  allDropDownsCache: {}
};

const getters = {
  useCategoryFilter(state, getters) {
    const { categories, subCategories } = getters.checkedCategories
    return categories.length > 0 || subCategories.length > 0
  },

  allCategoriesChecked(state) {
    return !state.categories.some(category => {
      if (!category.checked) return true
      else if (category.subcategories) {
        return category.subcategories.some(subcategory => !subcategory.checked)
      }
    })
  },

  noCategoriesChecked(state) {
    return state.categories.every((category) => {
      if (category.checked) return false;
      else if (category.subcategories) {
        return category.subcategories.every(
            subcategory => !subcategory.checked
        );
      }
    });
  },

  checkedCategories(state) {
    const categories = state.categories.filter(c => c.checked)
    const subCategories = state.categories.reduce((acc, category) => {
      return acc.concat(category.subcategories.filter(c => c.checked))
    }, [])
    return { categories, subCategories }
  },
  checkedProductOrigin(state){
    const productOrigin = state.productsOf.filter(c => c.checked)
    return {productOrigin}
  },
}

const actions = {
  toggleShowMobileCategories({commit,state}){
    commit('TOGGLE_SHOWMOBILECATEGORIES', !state.showMobileCategories);
  },

  closeMobileCategories({commit}){
    commit('TOGGLE_SHOWMOBILECATEGORIES', false);

  },

  toggleDropdown({ commit, state }) {
    commit('SET_DROPDOWN', !state.showCategoriesDropDown);
  },

  closeDropdown({ commit }) {
    commit('SET_DROPDOWN', false);
  },

  async getAllDropdownItems( { state } ) {
    const flyerId = router.currentRoute.params.flyerId;
    const storeId = parseInt(router.currentRoute.query?.storeId || '', 10);
    const lang = router.currentRoute.query.language === 'fr' ? 'bil' : 'en';
    const cacheId = `${flyerId}_${storeId}`;

    if(state.allDropDownsCache[cacheId]) {
      return state.allDropDownsCache[cacheId];
    }

    state.allDropDownsCache[cacheId] = await Service.GetAllFilters(flyerId, storeId, lang);
    return state.allDropDownsCache[cacheId];
  },

  async generateCategories({ commit, dispatch }) {
    // const currentFlyer = rootGetters["landingPage/currentFlyer"]

    // const { data } = await axios.get(
    //     `${rootState.apiUrl}/Pages/${currentFlyer.title}/${parseInt(getUrlParameter("storeId"))}/${
    //         getUrlParameter("language") === "fr" ? "bil" : "en"
    //     }/categories`,
    //     {
    //       headers: {
    //         "Ocp-Apim-Subscription-Key": rootState.subscriptionKey
    //       },
    //     }
    // );
    //console.log("categories are :",data);

    // const { data } = await axios.get(
    //   `${rootState.apiUrl}/Pages/${flyerId}/${parseInt(getUrlParameter("storeId"))}/${
    //       getUrlParameter("language") === "fr" ? "bil" : "en"
    //   }/AllDropdownItems`,
    //   {
    //     headers: {
    //       "Ocp-Apim-Subscription-Key": rootState.subscriptionKey
    //     },
    //   }
    // );
    /*const {data} = await Rest.Get(
        `${rootState.apiUrl}Pages/${flyerId}/${parseInt(getUrlParameter("storeId"))}/${lang}/AllDropdownItems`,
    )*/

    const data = await dispatch('getAllDropdownItems')

    // console.log("categories are :",data.categories);

    const categories = [];
    const productOf=[];
    for(let i=0; i<data.productOrigin.length; i++){
      productOf.push({
        name: data.productOrigin[i],
        checked: false
      })
    }

    for(let i=0; i<data.categories.length; i++){
      categories.push({
        name:data.categories[i].titleEn,
        frenchName: data.categories[i].titleEn,
        checked:false,
        subcategories: data.categories[i].subcategories.map((subcategory)=> {
          return{
            name: subcategory.titleEn,
            checked:false,
          }
        })
      })
    }
    /* Logic for sorting French characters with Accents alphabetically */
    for (var i = 0; i < categories.length; i++) {
      categories[i].frenchName = categories[i].frenchName.charAt(0).replace('À','A')+categories[i].frenchName.slice(1)
      categories[i].frenchName = categories[i].frenchName.charAt(0).replace('È','E')+categories[i].frenchName.slice(1)
      categories[i].frenchName = categories[i].frenchName.charAt(0).replace('É','E')+categories[i].frenchName.slice(1)
      categories[i].frenchName = categories[i].frenchName.charAt(0).replace('Ê','E')+categories[i].frenchName.slice(1)
    }

    const sortedCategories = categories.sort((a, b) => {
      if (a.frenchName > b.frenchName) return 1;
      else return -1;
    });

    commit("SET_CATEGORIES", sortedCategories);
    commit("SET_PRODUCTSOF",productOf);
  },

  toggleCategoryChecked({ commit, getters, dispatch }, categoryName) {
    commit("TOGGLE_CATEGORY_CHECKED", categoryName);
    commit("SET_ALL_CATEGORY_CHECKED", getters.allCategoriesChecked);
    dispatch("search/searchProducts", null, { root: true });
  },
  toggleProductsOfChecked({commit,dispatch},categoryName){
    commit("TOGGLE_PRODUCTSOF_CHECKED",categoryName);
    dispatch("search/searchProducts",null,{root:true});
  },

  toggleCategoryAllChecked({ commit, dispatch }) {
    commit("TOGGLE_CATEGORY_ALL_CHECKED");
    dispatch("search/searchProducts", null, { root: true });
  },

  clearSelectedCategory({ commit }) {
    commit("CLEAR_ALL_CATEGORIES");
  },
  clearProductOrigin({commit}){
    commit("CLEAR_ALL_PRODUCTORIGIN");
  },

  setExpandedCategory({ state, commit }, categoryName) {
    if (state.expandedCategory === categoryName) {
      commit('SET_EXPANDED_CATEGORY', null);
    } else {
      commit('SET_EXPANDED_CATEGORY', categoryName);
    }
  }
};

const mutations = {
  TOGGLE_SHOWMOBILECATEGORIES(state,val){
    state.showMobileCategories = val
  },

  SET_DROPDOWN(state, showCategoriesDropDown) {
    state.showCategoriesDropDown = showCategoriesDropDown;
  },

  SET_SELECTED_CATEGORY(state, cateogry) {
    state.selectedCategory = cateogry;
  },

  SET_ALL_CATEGORY_CHECKED(state, value) {
    state.allCategory.checked = value;
  },

  SET_CATEGORIES(state, categories) {
    state.categories = categories;
    // console.log("categories are :",state.categories)
  },
  SET_PRODUCTSOF(state,productOf){
    state.productsOf = productOf;
  },

  TOGGLE_PRODUCTSOF_CHECKED(state,categoryName){
    state.productsOf.forEach((productOf)=>{
      if(productOf.name === categoryName){
        productOf.checked = !productOf.checked
      }
    })
  },

  TOGGLE_CATEGORY_CHECKED(state, categoryName) {
    state.categories.forEach((category) => {
      if (category.name === categoryName) {
        category.checked = !category.checked;
        if (category.subcategories) {
          // set all category children to same checked state as parent
          category.subcategories.forEach((subcategory) => {
            subcategory.checked = category.checked;
          });
        }
      } else if (category.subcategories) {
        category.subcategories.forEach((subcategory) => {
          if (subcategory.name === categoryName) {
            subcategory.checked = !subcategory.checked;
            if (!subcategory.checked) {
              // uncheck parent category if child is unchecked
              category.checked = false;
            } else {
              // if all siblings are checked, check parent
              if (
                  category.subcategories.every(
                      (subcategory) => subcategory.checked
                  )
              )
                category.checked = true;
            }
          }
        });
      }
    });
  },

  TOGGLE_CATEGORY_ALL_CHECKED(state) {
    state.allCategory.checked = !state.allCategory.checked
    state.categories.forEach((category) => {
      category.checked = state.allCategory.checked;
      category.subcategories.forEach((subcategory) => {
        subcategory.checked = state.allCategory.checked;
      });
    });
  },


  SET_ALL_CATEGORIES_CHECKED(state, checkedState) {
    state.categories.forEach((category) => {
      category.checked = checkedState;
      if (category.subcategories) {
        category.subcategories.forEach(
            (subcategory) => (subcategory.checked = checkedState)
        );
      }
    });
  },

  CLEAR_ALL_CATEGORIES(state) {
    state.selectedCategory = null
    state.expandedCategory = null
    state.allCategory.checked = false
    state.categories.forEach((category) => {
      category.checked = false;
      category.subcategories.forEach((subcategory) => {
        subcategory.checked = false;
      });
    });
  },
  CLEAR_ALL_PRODUCTORIGIN(state){
    state.productsOf.forEach((productOf)=>{
      productOf.checked = false;
    })
  },

  SET_FILTERED_ITEMS(state, items) {
    state.filteredItems = items;
  },

  SET_EXPANDED_CATEGORY(state, categoryName) {
    state.expandedCategory = categoryName;
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};