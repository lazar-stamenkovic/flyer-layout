<template>
  <div id="app" :flyer-orientation="flyerOrientation" :is-fullscreen="fullScreenToggle" :is-mobile="isMobile" :mode="displayMode" :tour-mode="tourVisible && !loading">
    <div v-html="rootStyle"></div>
    <div
        v-if="highlightResults"
        v-html="highlightStyle"
    />

    <div v-show="loading" class="loading-indicator">
      <div>
        <svg height="211px" preserveAspectRatio="xMidYMid" style="margin:auto;background:#fff;display:block;" viewBox="0 0 100 100" width="211px" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
          <circle :stroke="branding.secondaryColor" cx="50" cy="50" fill="none" r="26" stroke-dasharray="122.52211349000194 42.840704496667314" stroke-width="3">
            <animateTransform attributeName="transform" dur="1s" keyTimes="0;1" repeatCount="indefinite" type="rotate" values="0 50 50;360 50 50"></animateTransform>
          </circle>
        </svg>
        <p>
          {{ content.loading }}
        </p>
      </div>
    </div>

    <Header
        v-if="isReady"
        v-model="search"
        :class="{disabled:tourVisible}"
        :current-zoom="currentZoom"
        @to-top="toTheTop"
        @show-filters="handleShowFilters"
    />
    <drawer-container v-if="isReady" drawer="top"/>
    <div v-if="isReady" class="main-lr-wrapper">
      <drawer-container drawer="left"/>
      <div :class="{'flyer-content':true, disabled:tourVisible || isDropdownOpen}">
        <flyer-selector-controller/>
        <!--Sidebar / -->
        <component :is="getPdpComponent === 'v1' ? 'pdp-popup-v1' : 'pdp-popup'" />
        <component :is="getSLComponent === 'v1' ? 'shopping-list-v1' : 'shopping-list'" :deal="currentFlyer.title" />

        <SearchResults v-if="searchIsVisible" :scale="currentZoom"/>
        <scroll-container
            v-if="!loading"
            id="main-scroll"
            ref="scrollContainer"
            :class="searchIsVisible ? 'hide-scroll' : ''"
            :enable-scroll-buttons="displayMode != 'mobile'"
            :fit-axis="flyerOrientation == 'horizontal' ? 'y' : 'x'"
            :max-width="900"
            :orientation="flyerOrientation"
            :zoom-level="zoomLevel"
            align="center"
            class="grid-container"
            @change="onScrollChange"
            @ready="onScrollContainerReady"
            @resize="onScrollContainerResize"
            @scrollTransEnd="onScrollChange"
        >
          <responsive-grid
              id="resp-grid"
              :flyer-pages="pages"
              :root-scroll-container="'main-scroll'"
          ></responsive-grid>
          <template v-if="flyerOrientation === 'horizontal'" #scroll-thumb-x>
            <div class="page-num">PAGE {{ currentPage }} OF {{ totalPages }}</div>
          </template>
          <template v-if="flyerOrientation ==='vertical'" #scroll-thumb-y>
            <div class="page-num vertical">PAGE {{ currentPage }} OF {{ totalPages }}</div>
          </template>

        </scroll-container>
      </div>
      <drawer-container drawer="right"/>
    </div>
    <drawer-container v-if="isReady" drawer="bottom"/>

    <VideoModal v-if="currentVideo"/>
    <!--    <PdpPopup :element="pages.block" v-if="currentProduct" />-->
    <!--    <ShoppingList :deal="currentFlyer.title"/>-->
    <FeatureToast/>
    <TourWindow v-if="tourVisible && !loading"/>


    <!-- Walkthrough / -->


    <!-- <HelpModal /> -->
    <!-- FeatureToast / -->

    <!-- testing git merge -->
    <deep-link-controller v-if="isReady"/>
    <iframe-relay />
    <raddar-sync />
  </div>
</template>

<script>
import GridComponent from "./components/responsiveGrid.component.vue";
// import FixedBasebarComponent from './components/fixedBasebar.component.vue';
import Header from "./components/header/AppHeader.vue";
//import PageNumber from './components/pageNumber.component'
//import basebars from '@/basebars.json';
//import Fuse from 'fuse.js';
import SearchResults from "@/components/SearchResults";
import {mapState, mapActions, mapGetters} from 'vuex';
import "scroll-behavior-polyfill";
import ScrollContainer from "@/components/scroll-container/ScrollContainer";
//TODO - Fix basebar zooming issue
import FeatureToast from '@/components/Toasts/FeatureToast'
// import PdpPopup from '@/components/PdpPopup'
//import Walkthrough from '@/components/Toasts/Walkthrough'
import TourWindow from "@/components/Toasts/TourWindow";
import AppConfig from "@/classes/AppConfig";
// import ShoppingList from "./components/ShoppingList";


import VideoModal from "@/features/video-modal/VideoModal.vue";
import Lytics from "@/classes/Lytics";
import PdpPopup from "@/features/pdp/PdpPopup.vue";
import PdpPopupV1 from "@/features/pdp/PdpPopupV1.vue";
import ShoppingList from "@/features/shopping-list/ShoppingList.vue";
import ShoppingListV1 from "@/features/shopping-list/ShoppingListV1.vue";
import DrawerContainer from "@/components/drawer/DrawerContainer.vue";
import FlyerSelectorController from "@/features/flyer-selector/FlyerSelectorController.vue";
import trianglePageGen from "@/features/offers/classes/TrianglePageGen";
import DeepLinkController from "@/features/deeplinking/DeepLinkController.vue";
import IframeRelay from "@/components/iFrameRelay/IframeRelay.vue";
import RaddarSync from "@/features/raddar-sync/RaddarSync.vue";
//import {debounce} from "lodash";

//let pageObserver;


function dist(b1, b2, p = 0.5) {
  const x1 = b1.x + b1.width * p;
  const y1 = b1.y + b1.height * p;
  const x2 = b2.x + b2.width * p;
  const y2 = b2.y + b2.height * p;

  return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
}


//Can be made more efficient by doing bound comparisons spread from startIndex rather than testing all the pages... but meh... feeling lazy...
function findCenterPage(pages, container, threshold) {
  const cRect = container.getBoundingClientRect();
  let d = Infinity;
  let best = null;
  //let dp = startIndex / pages.length;
  for (let i = 0; i < pages.length; i++) {
    const cDist = dist(cRect, pages[i].getBoundingClientRect(), threshold);
    if (cDist < d) {
      d = cDist;
      best = pages[i];
    }
  }

  return best;

}


export default {
  components: {
    RaddarSync,
    IframeRelay,
    DeepLinkController,
    FlyerSelectorController,
    DrawerContainer,
    ShoppingList,
    ShoppingListV1,
    PdpPopup,
    PdpPopupV1,
    TourWindow,
    ScrollContainer,
    "responsive-grid": GridComponent,
    Header,
    // "fixed-basebar": FixedBasebarComponent,
    //PageNumber,
    SearchResults,
    FeatureToast,
    VideoModal

  },

  props: {
    flyerId: {
      type: String,
      required: false
    }
  },

  data() {
    return {
      flyer: {},
      updateStyle: false,
      search: "",
      myflyerbtn: false,
      filteredBlocks: [],
      nearTop: false,
      isHidden: true,
      isDropdownOpen: false,
      currentGrid: {
        direction: 0
      },
      blockSize: {
        width: 281,
        height: 267
      },
      gridContainerStyle: {
        marginBottom: "2px",
        zIndex: `${this.updateStyle ? 1 : 2}`
      },
      showScrollToTop: false,
      showMobileFilters: false,
      leftArrowVisible: false,
      rightArrowVisible: true,
      currentPage: 1,
      flyerLoaded: false
    };
  },
  async created() {
    //await this.loadFlyer();
    // await this.setPages(this.currentFlyer.title);
    window.addEventListener('orientationchange', this.handleOrientationChange);
    // this.setHighlightResults(!this.currentFlyer.blockedFlyer);
    // this.setupPages();
    //this.setCurrentStore(this.$route.query.storeId)
    // this.handleLocalStorage()
  },

  mounted() {

    /* Commented out below code for MTRDF-117 - Client wants flyer drawer to be closed on all devices on flyer load
    //SUPDF-545 Flyer drawer to be open on Desktop, but closed on mobiles & tablets on flyer load.
    if((this.displayMode == 'mobile') || (this.displayMode == 'tablet'))
      this.toggleSideBarState(false)
 */

    // console.log("app mounted successfully");
    this.$store.commit("landingPage/SET_FLYER_BY_ID", this.$route.params.flyerId)
    this.$store.dispatch('deepLinking/updateHash', this.$route.hash);
    Lytics.TriggerPageChange();


    //track analytics event and identify the user with anonymous ID
    // window.rudderanalytics.identify()
    /* TODO: uncomment this when analytics is ready */
    // window.rudderanalytics.page('FlyerPage')

    /*window.rudderanalytics.track('LoadedFlyers', {
      flyerID: this.flyer.id,
      dealID: this.flyer.dealNo,
      startDate: this.flyer.startDate,
      endDate: this.flyer.endDate
    })*/

    //this.currentZoom = 0;
    this.$nextTick(() => {
      this.checkTourState();
    })
    if(AppConfig.AppConf?.title.toLowerCase().includes("metro".toLowerCase())) {
      this.$root.$on('dropdown-hidden-updated', (isHidden) => {
        this.isDropdownOpen = isHidden;
      })


      /*console.log('** App Mounted loadFlyer')*/
      //await this.loadFlyer();
    }
  },

  watch: {
    loading() {
      //this.setCurrentFlyer(this.flyerId);
    },
    urlHash(hash) {
      console.log('urlUpdated:', hash);
      this.processHash();
    },
    currentPage(val) {
      this.setCurrentPageNumber(val)
      // console.log('pageChange: from: ', this.currentPage , '  to:', val)
      if (val != 1)
        this.toggleSideBarState(false)
      Lytics.TriggerFlyerPageChange(val, this.flyerId);
    },

    currentFlyer(flyer, oldFlyer) {
      // console.log('Current Flyer Watch:', flyer, '  olfFlyer:', oldFlyer);
      if (!this.isReady || (flyer.title !== oldFlyer.title)) {

        this.loadFlyer();
        this.close();
        this.toggleShoppingList(false);
        Lytics.TriggerFlyerLoaded({
          flyerID: flyer.id,
          dealID: flyer.title,
          startDate: flyer.startDate,
          endDate: flyer.endDate,
          storeId: this.$route.query.storeId,
          language: this.language
        });


      }

    },

    searchQuery() {
      // console.log('App.vue SearchQuery Update', val)
      this.executeFilter();
    }
  },


  async beforeRouteUpdate(to, from, next) {
    /*console.log('Router Update:', to, this.$store);*/
    this.toggleSideBarState(false);
    this.$store.commit("landingPage/SET_FLYER_BY_ID", to.params.flyerId);
    this.setCurrentStore(to.query.storeId);
    this.setLanguage();

    this.$store.dispatch('deepLinking/updateHash', to.hash);
    next();
  },

  computed: {
    ...mapGetters(['content', 'language', 'highlightResults']),
    ...mapState(['columnView', 'zonesArray', 'currentStore', 'pages', 'loading', 'totalPages', 'currentVideo', 'currentProduct', 'showHamburgerMenu']),
    ...mapGetters('landingPage', ['currentFlyer']),
    ...mapState('scale', ['zoomLevel']),
    ...mapState('screen', ['fullScreenToggle']),
    ...mapGetters('screen', ['displayMode', 'isMobile', 'flyerOrientation']),
    ...mapGetters('search', ['showSearchResults', 'filteredItems', 'filteredItemsIntersection']),
    ...mapState('toast', ['tourVisible', 'showHelp']),
    ...mapGetters('deepLinking', ['urlHash']),
    ...mapGetters('config', ['branding', 'features', "rootStyle"]),
    ...mapState('shoppingList', ['shoppingList']),
    ...mapState('categories', ['showCategoriesDropDown', 'showMobileCategories']),
    ...mapGetters('filters', ['searchQuery']),
    ...mapGetters('config', ['settings', 'features']),

    isReady() {
      return !this.loading && !!this.settings?.features && this.flyerLoaded;
    },

    searchIsVisible() {
      return !this.highlightResults && this.showSearchResults
    },

    highlightStyle() {
      if (!this.highlightResults) return;

      if (!this.showSearchResults) {
        return "<style> svg mask { display: none !important; } </style>";
      }

      // eslint-disable-next-line no-unused-vars
      let style = [];
      this.filteredItems.map((item) => {
        //const sku = item.sku.trim();
        item.products.map((prod) => {
          style.push(`svg mask rect[sku='${(prod.sku || '').trim()}'] { opacity: 1 !important; }`);
        })
        //return `svg mask rect[sku='${(item.sku || '').trim()}'] { opacity: 1 !important; }`
      });

      console.log('Mask Style:', style);


      return '<style>' + style.join("\n") + '</style>';
    },

    currentZoom() {
      return this.zoomLevel;
    },

    /*filteredPages() {
      return this.flyer.pages.filter(page => page.blocks.length);
    },*/

    scrollContainer() {
      return this.$refs.scrollContainer;
    },
    getPdpComponent(){
      return this.features.pdp.component || '';
    },
    getSLComponent(){
      return this.features.shoppingList.component || '';
    }


  },
  methods: {
    ...mapActions(['setPages', 'updatePages', 'setTotalPages', 'setLanguage', 'setCurrentStore', 'setZonesArray', 'setPdf', 'setCurrentPageNumber', 'toggleSideBarState']),
    ...mapActions('screen', ['handleWindowResize']),
    ...mapActions('scale', ['updateScale', 'setZoomLevel']),
    ...mapActions('toast', ['checkTourState']),
    ...mapActions('landingPage', ['setCurrentFlyer']),
    ...mapActions('shoppingList', ['setShoppingList', 'handleLocalStorage', 'toggleShoppingList']),
    ...mapActions('filters', ['loadFlyerFilters', 'executeFilter']),
    ...mapActions('search', ['filterProducts']),
    ...mapActions('pdp', ['close']),


    async loadFlyer() {
      // console.log('** loadFlyer:', this.currentFlyer)
      if (!this.currentFlyer.title) return;

      await this.setPages(this.currentFlyer.title);
      //this.setHighlightResults(!this.currentFlyer.blockedFlyer);
      await this.setupPages();
      await this.loadFlyerFilters();
      this.flyerLoaded = true;
    },

    processHash() {
      const hash = this.urlHash;
      for (let p in hash) {
        switch (p) {
          case 'sku':
            this.scrollToSku(hash[p]);
            break;
          case 'page':
            this.scrollToPage(hash[p])
            break;
        }
      }
    },

    findPageWithSku(sku) {
      const pages = this.pages || [];
      return pages.find((page) => {
        return page.blocks.find((block) => {
          return block.products.find((product) => {
            return product.sku === sku;
          })
        })
      })
    },
    findPageWithIndex(index) {
      const pages = this.pages || [];
      const page = pages[index - 1];
      if(typeof page !== 'undefined') {
        return page;
      }
      return null;
    },

    scrollToDom(dom) {
      if (dom) {
        const dim = dom.getBoundingClientRect();
        const ctr = this.$refs.scrollContainer;
        const tl = ctr.getScroll();
        ctr.scroll({x: -dim.x - tl.x, y: -dim.y - tl.y});
      }
    },
    scrollToIndexDom(dom) {
      if (dom) {
        const dim = dom.getBoundingClientRect();
        const ctr = this.$refs.scrollContainer;
        const tl = ctr.getScroll();
        ctr.scroll({x: -dim.x - tl.x + 210, y: -dim.y - tl.y + 150});
      }
    },

    scrollToSku(sku) {
      const page = this.findPageWithSku(sku);
      console.log('Page Found:', page);
      const pageId = page?.id;
      const dom = document.querySelector(`#main-scroll [page-id="${pageId}"]`);
      console.log('scrollToSku: ', dom)
      this.scrollToDom(dom);
    },

    scrollToPage(pageNum) {
      console.log('scrollToPage:', pageNum, '   scrollContainer:', this.$refs.scrollContainer);
      if (!this.$refs.scrollContainer) return;
      const dom = document.querySelector(`#main-scroll [page-num="${pageNum}"]`);
      console.log('scrollToPage: dom: ', dom)
      this.scrollToDom(dom);
    },
    scrollToIndex(index) {
      if (!this.$refs.scrollContainer) return;
      const page = this.findPageWithIndex(index);
      const pageId = page?.id;
      const dom = document.querySelector(`#main-scroll [page-id="${pageId}"]`);
      if( (dom.classList.contains('ad-page') && page?.grids.desktop.colCount === 1) ||
          dom.getAttribute('page-id') === 'triangleRewards') {
        this.scrollToIndexDom(dom);
      } else {
        this.scrollToDom(dom);
      }

    },

    onScrollContainerReady(container) {
      this.updateScale(container._sz.getScale());
      setTimeout(() => {
        // this.processHash();
        setTimeout(this.processHash, 1500);
      },2000);
    },

    onScrollContainerResize(scroller) {
      this.updateScale(scroller._sz.getScale());
    },

    onScrollChange(scroller) {
      const container = document.querySelector('.grid-container');
      const observables = document.querySelectorAll('.grid-container .responsive-grid [page-id][page-num]');
      let threshold = 0.5;

      if (this.flyerOrientation === 'horizontal') {
        threshold = scroller.scrollX / scroller.maxScrollX;
      } else {
        threshold = scroller.scrollY / scroller.maxScrollY;
      }


      const pageEntry = findCenterPage(observables, container, threshold);

      if (pageEntry) this.currentPage = pageEntry.getAttribute('page-num');

    },

    setupPages() {
      let pageCount = 0;
      this.currentPage = 1;
      const flyerDim = {width: 0, height: 0};
      const pagesIndex = {};
      let unitHeight = 0;
      let unitWidth = 0;
      const updatedPages = this.pages.map((page, index) => {
        const isPage = (page.countTowardsPageCount != undefined) ? page.countTowardsPageCount : !page.isAdPage;

        if (isPage && page.blocks.length) {
          page.page_num = ++pageCount;
          pagesIndex[page.page_num] = index;
        }

        unitHeight = Math.max(page.unitHeight, unitHeight);
        unitWidth = Math.max(page.unitWidth, unitWidth);

        if (!this.highlightResults) return page;

        for (let p in page.grids) {
          const t = page.grids[p];
          t.rowCount = 1;
          t.colCount = 1;
          t.totalBlocks = 1;
        }

        page.unitWidth = unitWidth;// page.blocks[0]?.images[0].width || 0;
        page.unitHeight = unitHeight; // page.blocks[0]?.images[0].height || 0;

        flyerDim.width = unitWidth;// Math.max(page.blocks[0]?.images[0].width || 0, flyerDim.width);
        flyerDim.height = unitHeight; // Math.max(page.blocks[0]?.images[0].height || 0, flyerDim.height);

        page.flyerDim = flyerDim;

        page.blocks = page.blocks.map((block) => {
          block.colSpan = 1;
          block.rowSpan = 1;
          return block;
        });

        return page;
      });

      if (this.features?.ctTriangleRewards?.enabled) {
        const ctConfig = this.features?.ctTriangleRewards;

        if (ctConfig.conditions) {
          let pass = true;
          const cond = ctConfig.conditions;
          for (let p in cond) {
            if (this.currentFlyer[p] !== cond[p]) {
              pass = false;
            }
          }
          if (pass) trianglePageGen(updatedPages, pagesIndex, ctConfig.onPage, unitWidth, unitHeight, this.language);
        }
      }


      this.setTotalPages(pageCount);
      this.updatePages(updatedPages);
    },

    toTheTop: function () {
      // window.scroll({ top: 0, left: 0, behavior: 'smooth' })
      this.scrollContainer.scroll({y: 0, x: 0});
    },

    /*handleWindowScroll() {
      //const scrollTop = document.querySelector('.grid-container').scrollTop;

      const scroll = this.scrollContainer.getScroll();
      const maxScroll = this.scrollContainer.getMaxScroll();

      this.leftArrowVisible = scroll.x > 0;
      this.rightArrowVisible = scroll.x < maxScroll.x;

      if (scroll.y > 0) {
        this.nearTop = true;
      } else {
        this.nearTop = false;
      }
    },*/

    handleShowFilters(val) {
      this.showMobileFilters = val;
    },

    handleOrientationChange(event) {
      const isLandscape = event.target.screen.orientation.type === 'landscape-primary';
      window.parent.postMessage(JSON.stringify({fullscreen: isLandscape}), "*");
    },

  }
};
</script>
<style lang="scss">
@import "scss/styles";
@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@600&display=swap');
@font-face {
  font-family: 'Chalet-NewYorkNineteenEighty';
  src: url("/fonts/Chalet-NewYorkNineteenEighty.otf");
}
</style>


<style scoped>

.page-num {
  text-align: center;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;

}

.page-num.vertical {
  transform: rotate(90deg);
  white-space: nowrap;
  pointer-events: none;
}

</style>

<style lang="scss">
.landing-page {
  .grid-container {
    display: none;
  }
}
</style>

<style>

/*[flyer-orientation = 'vertical'] .section-container.ad-page{
  display: none;
}*/

body {
  overscroll-behavior-x: contain;
}

body.print {
  display: inline !important;
  overflow-y: visible;
}

input {
  font-family: Lato, sans-serif;
}

.grid-scale-clipper[is-horizontal] {
  width: max-content;
  overflow: hidden;
}


@font-face {
  font-family: 'sans-serif';
  src: url("/fonts/AlrightSans-Medium.otf");
}

@font-face {
  font-family: 'Univers LT Std';
  src: url("/fonts/UniversLTStd-BoldCn.otf");
}

img, svg, image {
  -webkit-backface-visibility: hidden;
  -ms-transform: translateZ(0); /* IE 9 */
  -webkit-transform: translateZ(0); /* Chrome, Safari, Opera */
  transform: translateZ(0) scale(1.0, 1.0);
  image-rendering: -webkit-crisp-edges;
  image-rendering: -webkit-optimize-contrast;
  pointer-events: none;
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  color: black;
  font-family: Lato, sans-serif;
}

button {
  font-family: Lato, Arial, sans-serif;
}

button.fancy {
  background: none;
  border: 1px solid #ccc;
  border-radius: 3px;
  font-size: 1em;
  padding: 5px;
}

button.fancy.red {
  background-color: var(--primary-color);
}

button.fancy.green {
  background-color: var(--tertiary-color);
  color: var(--secondary-text-color);
}

#app {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  /* overflow: hidden; */
  width: 100%;
}

#app[tour-mode] {
  background-color: #000;
}

.red {
  color: #ed1c24;
}

.grid {
  display: grid;
  grid-template-columns: repeat(3, 100px);
  grid-template-rows: repeat(3, 100px);
}

.grid > div {
  border: 1px solid black;
  background-color: antiquewhite;
  display: flex;
  justify-content: center;
  align-items: center;
}

.scroll-container.grid-container {
  position: absolute;
  top: 0px;
  bottom: 0px;
  left: 0px;
  right: 0px;
}

.grid-container {
  flex-grow: 1;
  overflow: auto;
  margin-bottom: 2px;
  padding-top: 0px;
  /*scroll-behavior: smooth;*/
}

.grid-container.hide-scroll {
  overflow: hidden;
  position: relative;
  display: none;
}

/*.arrows {
  display: none;
}*/

/*.tooltip {
  z-index: 999;
  top: 5px !important;
  left: 20px !important;
}

.tooltip.last {
  left: -50px !important;
}
*/
.tooltip .tooltip-inner {
  /*background: black;*/
  opacity: 0.8;
  color: white;
  /*border: 1px solid #979797;*/
  padding: 5px 10px 4px;
  font-size: 12px;
}

/*
.toTheTop {
  display: block;
  width: 90px;
  height: 90px;
  background: url('/images/back-tothe-top-mobile.png') no-repeat center 45%;
  background-size: 77% auto;
  position: absolute;
  right: 2px;
  bottom: 20px;
  cursor: pointer;
  filter: drop-shadow(2px 4px 6px black);
  opacity: 0.9;
  cursor: pointer;
  z-index: 5;
}*/

header.disabled {
  pointer-events: none;
}

.flyer-content {
  flex-grow: 1;
  position: relative;
  transition: opacity 300ms, filter 300ms;
}

.flyer-content.disabled, .search-results-wrapper.disabled {
  pointer-events: none;
  opacity: 0.7;
  /*filter: blur(5px);*/
}


button {
  cursor: pointer;
}

::-webkit-scrollbar {
  height: 16px;
}

::-webkit-scrollbar-track:horizontal {
  background-image: url('/images/scroll_track.png');
  background-position-y: center;
  background-repeat: repeat-x;
}

::-webkit-scrollbar-track:vertical {
  background-image: url('/images/scroll_track.png');
  background-position-x: center;
  background-repeat: repeat-y;
}

::-webkit-scrollbar-thumb {
  background-color: rgb(78, 80, 86);
}

/* Buttons */
::-webkit-scrollbar-button:single-button:horizontal {
  background-color: #bbbbbb;
  display: block;
  height: 16px;
  width: 16px;
  background-size: contain;
}

/* Up */
::-webkit-scrollbar-button:single-button:horizontal:decrement {
  background-image: url('/images/leftarrow-desktop.png');
}

/* Down */
::-webkit-scrollbar-button:single-button:horizontal:increment {
  background-image: url('/images/rightarrow-desktop.png');
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.25s ease-out;
}

.fade-enter, .fade-leave-to {
  opacity: 0;
}


@media screen and (min-width: 628px) {
  /*.toTheTop {
    display: none;
  }*/
  #basebar-container {
    display: none;
  }

  /*.arrows {
     display: block;;
     top: calc(100% + 100px);
     z-index: 100;
   }

   .arrows-vertical {
     display: block;
     z-index: 100;
   }

   /* New Arrow */
  /* .arrowleft {
    background-image: url("/images/moveleft-arrow-desktop.png");
    background-size: cover;
    background-position: center;
    width: 80px;
    height: 152px;
    position: absolute;
    z-index: 101;
    left: 0;
    top: calc(50% - 76px);
    cursor: pointer;
  }

  .arrowleft {
    background-image: url("/images/moveleft-arrow-desktop.png");
    background-size: contain;
    background-position: center;
    width: 50px;
    height: 50px;
    border-radius: 50px;
    position: absolute;
    z-index: 101;
    left: 5px;
    top: calc(50% - 76px);
    opacity: 0.8;
    box-shadow: 0px 3px 15px rba(0, 0, 0, 0.5);
    filter: drop-shadow(5px 5px 5px #222);
    cursor: pointer;
  }

  /* New */
  /* .arrowright {
    background-image: url("/images/moveright-arrow-desktop.png");
    background-size: cover;
    background-position: center;
    width: 80px;
    height: 152px;
    position: absolute;
    z-index: 101;
    right: 0;
    top: calc(50% - 76px);
    cursor: pointer;
  }

  .arrowright {
    background-image: url("/images/moveright-arrow-desktop.png");
    background-size: contain;
    background-position: center;
    width: 50px;
    height: 50px;
    border-radius: 50px;
    position: absolute;
    z-index: 101;
    right: 17px;
    top: calc(50% - 76px);
    opacity: 0.8;
    box-shadow: 0px 3px 15px rba(0, 0, 0, 0.5);
    filter: drop-shadow(5px 5px 5px #222);
    cursor: pointer;
  } */
  /* New Arrow */
  /* .arrowup {
    background-image: url("/images/moveleft-arrow-desktop.png");
    background-size: cover;
    background-position: center;
    width: 80px;
    height: 152px;
    position: absolute;
    z-index: 101;
    right: calc(50% - 40px);
    top: 30px;
    cursor: pointer;
    transform: rotate(90deg);
  }

  .arrowup {
    background-image: url("/images/moveleft-arrow-desktop.png");
    background-size: contain;
    background-position: center;
    width: 50px;
    height: 50px;
    border-radius: 50px;
    position: absolute;
    z-index: 101;
    right: calc(50% - 25px);
    top: 83px;
    opacity: 0.8;
    box-shadow: 0px 3px 15px rba(0, 0, 0, 0.5);
    filter: drop-shadow(5px 5px 5px #222);
    cursor: pointer;
    transform: rotate(90deg);
  } */
  /* New Arrow */
  /* .arrowdown {
    background-image: url("/images/moveright-arrow-desktop.png");
    background-size: cover;
    background-position: center;
    width: 80px;
    height: 152px;
    position: absolute;
    z-index: 101;
    right: calc(50% - 40px);
    bottom: -36px;
    cursor: pointer;
    transform: rotate(90deg);
  } */
  /* .arrowdown {
     background-image: url("/images/moveright-arrow-desktop.png");
     background-size: contain;
     background-position: center;
     width: 50px;
     height: 50px;
     border-radius: 50px;
     position: absolute;
     z-index: 101;
     right: calc(50% - 25px);
     bottom: 17px;
     opacity: 0.8;
     box-shadow: 0px 3px 15px rba(0, 0, 0, 0.5);
     filter: drop-shadow(5px 5px 5px #222);
     cursor: pointer;
   }*/
  @media screen and (min-width: 1256px) {
    /*.toTheTop {
      display: none;
    }*/
    #basebar-container {
      display: none;
    }

  }

  @media (max-height: 600px) {
    @media (orientation: landscape) {
      .grid-container.hide-scroll {
        overflow: auto;
        position: static;
        display: none;
      }
    }
  }
}
</style>
<style lang="scss">
.sr-only {
  position: absolute;
  left: -10000px;
  top: auto;
  width: 1px;
  height: 1px;
  overflow: hidden;
}

.loading-indicator {
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;

  p {
    color: var(--secondary-color);
    text-align: center;
  }
}

.tooltip {
  display: block !important;
  z-index: 10000;

  .tooltip-inner {
    background: black;
    color: white;
    border-radius: 16px;
    padding: 5px 10px 4px;
  }

  .tooltip-arrow {
    width: 0;
    height: 0;
    border-style: solid;
    position: absolute;
    margin: 5px;
    border-color: black;
    z-index: 1;
  }

  &[x-placement^="top"] {
    margin-bottom: 5px;

    .tooltip-arrow {
      border-width: 5px 5px 0 5px;
      border-left-color: transparent !important;
      border-right-color: transparent !important;
      border-bottom-color: transparent !important;
      bottom: -5px;
      left: calc(50% - 5px);
      margin-top: 0;
      margin-bottom: 0;
    }
  }

  &[x-placement^="bottom"] {
    margin-top: 5px;

    .tooltip-arrow {
      border-width: 0 5px 5px 5px;
      border-left-color: transparent !important;
      border-right-color: transparent !important;
      border-top-color: transparent !important;
      top: -5px;
      left: calc(50% - 5px);
      margin-top: 0;
      margin-bottom: 0;
    }
  }

  &[x-placement^="right"] {
    margin-left: 5px;

    .tooltip-arrow {
      border-width: 5px 5px 5px 0;
      border-left-color: transparent !important;
      border-top-color: transparent !important;
      border-bottom-color: transparent !important;
      left: -5px;
      top: calc(50% - 5px);
      margin-left: 0;
      margin-right: 0;
    }
  }

  &[x-placement^="left"] {
    margin-right: 5px;

    .tooltip-arrow {
      border-width: 5px 0 5px 5px;
      border-top-color: transparent !important;
      border-right-color: transparent !important;
      border-bottom-color: transparent !important;
      right: -5px;
      top: calc(50% - 5px);
      margin-left: 0;
      margin-right: 0;
    }
  }

  &[aria-hidden='true'] {
    visibility: hidden;
    opacity: 0;
    transition: opacity .15s, visibility .15s;
  }

  &[aria-hidden='false'] {
    visibility: visible;
    opacity: 1;
    transition: opacity .15s;
  }
}
</style>