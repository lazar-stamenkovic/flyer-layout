<template>
  <div class="wpr">
    <div class="search-bar">
      <input type="text" placeholder="Search Flyer"
            class="search-input"
            ref="search-input"
            v-model="value"
            @keyup.enter="handleSubmit(value)"
      >
      <span v-if="value" class="clear" @click="clearSearch">
        <svg width="20" height="20" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
          <defs>
            <path id="a" d="M15.83 5.34l-1.17-1.17L10 8.82 5.34 4.17 4.17 5.34 8.82 10l-4.65 4.66 1.17 1.17L10 11.18l4.66 4.65 1.17-1.17L11.18 10z"/>
          </defs>
          <g fill="none" fill-rule="evenodd">
            <mask id="b" fill="#fff">
              <use xlink:href="#a"/>
            </mask>
            <g mask="url(#b)" fill="#80868B">
              <path d="M0 0h20v20H0z"/>
            </g>
          </g>
        </svg>
      </span>
      <button class="search-icon" @click="handleSubmit(value)"></button>
    </div>
    <div class="mobile">
      <TransitionExpand>
        <div class="filters" v-if="showFilters">
          <div class="accordion categories">
            <div class="header">
              <button @click="toggleCategories">
                <span>By Category</span>
                <img :class="{ expand: showCategories }" src="/images/icon-dropdown-arrow.svg" alt="">
              </button>
            </div>
            <TransitionExpand>
              <div v-if="showCategories" class="contents">
                <CategoryItem v-for="category in categories" :key="category.name" :category="category" />
              </div>
            </TransitionExpand>
          </div>
          <div class="accordion savings">
            <div class="header">
              <div>
                <span>By Discount</span>
                <SavingsSlider no-border />
              </div>
            </div>
          </div>
        </div>
      </TransitionExpand>
      <button class="toggle-filters" :class="{ open: showFilters }" @click="toggleFilters">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-chevron-down">
          <path d="M6 9l6 6 6-6"/>
        </svg>
      </button>
    </div>
  </div>
</template>

<script>
import CategoryItem from '@/components/CategoryItem';
import SavingsSlider from '@/components/SavingsSlider'
import TransitionExpand from '@/components/TransitionExpand';
import { mapActions, mapState } from 'vuex';

export default {
  name: "SearchBar",

  components: {
    CategoryItem,
    SavingsSlider,
    TransitionExpand
  },

  data() {
    return {
      value: '',
      showCategories: false,
      showFilters: false
    }
  },

  computed: {
    ...mapState('search', ['query']),
    ...mapState('categories', ['categories']),
  },

  methods:{
    ...mapActions('search', ['updateSearchQuery']),
    
    clearSearch() {
      this.value = '';
      this.updateSearchQuery('')
    },

    handleSubmit(val) {
      this.$refs['search-input'].blur(); 
      this.updateSearchQuery(val);
    },

    toggleCategories() {
      this.showCategories = !this.showCategories;
    },

    toggleFilters() {
      this.showFilters = !this.showFilters;
    }
  },

  watch: {
    query(val) {
      this.value = val;
    }
  }
}
</script>

<style scoped>
  .wpr {
    display: flex;
    flex-direction: column;
  }

  .clear{
    position:absolute;
    right:40px;
    top:51%;
    transform: translateY(-50%);
    line-height: 1em;
    font-family: monospace;
    cursor: pointer;
  }

  .search-bar{
    display: flex;
    flex-grow: 1;
    position:relative;
    max-width: 263px;
  }

  .search-bar input{
    flex-grow: 1;
    border-color: #3A7636;
    border-radius: 3px;
    border-width: 1px;
    text-indent: 1em;
  }

  .search-bar .search-icon{
    width: 30px;
    background-image: url(/images/search.svg);
    background-repeat: no-repeat;
    background-position: center;
    background-size: 64%;

    background-color: #3A7636;

    border: none;
    border-radius: 3px;
    margin-left: -3px;
  }

  .search-bar.mobile input{
    display: none;
  }
  .search-bar.mobile .search-icon{
    background-image: url(/images/search_grey.svg);
    background-color: rgba(0,0,0,0);
    background-size: 100%;
    margin-left:auto;
  }

  .mobile {
    display: none;
  }

  @media (max-width: 1200px) {
    .search-bar {
      max-width: inherit;
      height: 30px;
      margin: 10px !important;
    }

    .mobile {
      display: flex;
      flex-direction: column;
      align-items: stretch;
    }

    .accordion {
      border: 1px solid #AFAFAF;
      border-radius: 4px;
      margin: 10px;
    }

    .accordion .header > * {
      display: flex;
      width: 100%;
      min-height: 34px;
      padding: 0 8px;
      align-items: center;
      justify-content: space-between;
      background: none;
      border: none;
      font-size: 14px;
      font-weight: bold;
    }

    .accordion .contents {
      padding: 5px 10px;
    }

    li li {
      margin-left: 10px;
    }

    .toggle-filters {
      background: none;
      border: none;
      margin: 0 10px;
    }

    .toggle-filters.open svg {
      transform: rotate(180deg);
    }
  }
</style>
