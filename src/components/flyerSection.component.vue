<template>
  <div
      v-if="searchResults || this.displayPage"
      class="section-container"
      :class="{
        'mar-b': page.id.includes('adpage') && (this.flyerOrientation == 'vertical'),
        'bg-red': redPages.includes(page.id),
        'ad-page': page.isAdPage,
        'search-page': page.name === 'search_results' && this.flyerOrientation == 'horizontal',
        'search-page-vertical': page.name === 'search_results' && this.flyerOrientation == 'vertical'
      }"
      :page-id="page.id"
      :page-num="page.page_num"
      :style="currentSectionStyle"
      ref="container"
  >
<!--    <block
        v-for="(b, index) in blocks"
        :key="page.id + '_block_' + index"
        :element="b"
        :device="device"
        :parent="page"
        :parent-col-count="colCount"
        :searchResults="searchResults"
        :unit-width="unitWidth"
        :unit-height=.unitHeight"
        :isAdPage="page.isAdPage"
        :root-scroll-container="rootScrollContainer"
    />-->
	  <flyer-block
			  v-for="(b, index) in blocks"
			  :key="page.id + '_block_' + index"
			  :block-data="b"
			  :page="{pageHeight, pageWidth, ...page, unitWidth, unitHeight}"
			  :root-scroll-container="rootScrollContainer"
	  />
    <div v-if="page.name !== 'search_results'" class="basebar" :class="{ clickable: basebarLink }" :style="basebarStyle" @click="handleBasebarClick">
      
          <img alt="Basebar Ad" v-if="basebarImagePath" :src="basebarImagePath" loading="lazy"/>
          <!-- <div class="overlay"></div> -->
            <ExpandingDisclaimer v-if="this.page.disclaimer && this.displayMode === 'mobile'" :disclaimer="this.page.disclaimer" />
            <p v-else-if="this.page.disclaimer">{{ this.page.disclaimer }}</p>
       
     <!-- <div class="basebar" :class="{ clickable: basebarLink }" :style="basebarStyle" @click="handleBasebarClick"> -->
    </div>
     <!-- <div >
      <p>{{ zonedDisclaimer }} 123</p>
    </div> -->
  </div>
</template>
<script>
//import Block from "./block.component";
import {mapState, mapGetters} from 'vuex';
import {getClosestDPI} from "@/store/modules/scale";
import FlyerBlock from "@/components/block/FlyerBlock.vue";
import ExpandingDisclaimer from "@/components/ExpandingDisclaimer";
//import FlyerPage from "@/classes/FlyerPage";

let bbcount = 0;

export default {
  props: ["page", "device", "index", "searchResults", "prevDocumentName", "rootScrollContainer"],
  components: {
	  FlyerBlock,
    ExpandingDisclaimer
  },
  computed: {
		...mapGetters(["language"]),
    ...mapState(['columnView', 'zonesArray', 'apiUrl']),
    ...mapGetters('screen', ['displayMode', 'flyerOrientation']),
    ...mapGetters('scale', ['imageDPI']),

	  /**
	   *
	   * @returns number
	   */
	  unitWidth(){
		  if(this.grid['fitCols']){
			  const fc = this.grid['fitCols'];
			  const cols = this.colCount;
			  return this.page.unitWidth * (fc / cols);
		  }
		 /* const fp = new FlyerPage(this.page);
		  return fp.getModeUnitWidth(this.virtualDisplayMode);*/
		  return this.page.unitWidth;
	  },

	  /**
	   *
	   * @returns number
	   */
	  unitHeight(){
	    if(this.grid['fitCols']){
		    const fc = this.grid['fitCols'];
		    const cols = this.colCount;
		    return this.page.unitHeight * (fc / cols);
	    }
		  /*const fp = new FlyerPage(this.page);
		  return fp.getModeUnitHeight(this.virtualDisplayMode);*/
		  return this.page.unitHeight;
	  },

    displayPage() {
      return this.page.blocks.some(block => block.placement[this.displayMode].visible)
    },

	  blocks() {
			const dm = this.flyerOrientation === 'vertical' && this.displayMode === 'desktop'? 'tablet': this.displayMode;
			return this.page.blocks.filter(block => block.placement[dm].visible);
	  },

    pageDom(){
      return this.$refs.container;
    },

    showImages(){
      return true;
    },

	  isAdPage() {
			return this.page.isAdPage;
	  },

	  grid() {
		  return this.page.grids[this.virtualDisplayMode];
/*		  if (this.flyerOrientation === 'vertical' && this.displayMode === 'desktop') {
			  return this.page.grids['tablet'];
		  } else {
			  return this.page.grids[this.device];
		  }*/
	  },

	  virtualDisplayMode() {
		  if (this.flyerOrientation === 'vertical' && this.displayMode !== 'mobile') {
			  return 'tablet';
		  }
		  return this.displayMode;
	  },

	  colCount() {
		  return this.grid.colCount;

		  /*const fp = new FlyerPage(this.page);
	    return fp.getModeCols(this.virtualDisplayMode);*/
	    //if ((this.columnView || window.innerWidth < 800) && this.searchResults && this.device !== 'mobile') {
		  /*if (this.flyerOrientation === 'vertical' && this.displayMode !== 'mobile') {
			  return fp.getModeCols('tablet'); //  this.page.grids['tablet'].colCount;
		  } else {
			  return fp.getModeCols(this.displayMode); // this.page.grids[this.device].colCount;
		  }*/
	  },

	  rowCount() {
	    return this.grid.rowCount;
		  /*const fp = new FlyerPage(this.page);
		  return fp.getModeRows(this.virtualDisplayMode);*/
	  },
	  pageHeight(){
			return this.rowCount * this.unitHeight;
	  },
	  pageWidth() {
			return this.colCount * this.unitWidth;
	  },
	  grids(){
		  return this.page.grids;
	  },

    currentSectionStyle: function () {
      return {
	      ...this.grid['style'],
        gridTemplateColumns: `repeat(${this.colCount},${(this.unitWidth) + "px"})`,
        ...this.gridRowTemplate
      };
    },
    gridRowTemplate: function () {
     /* if (this.flyerOrientation === 'horizontal') {
        return {gridTemplateRows: `repeat(${this.rowCount},${this.unitHeight}px)`}
      }*/
      return {gridTemplateRows: `repeat(${this.rowCount},${this.unitHeight}px)`}
    },
    basebarObj() {
      if (!this.page.basebars || this.page.name === 'search_results') return null;
      let images = this.page.basebars[this.displayMode] || this.page.basebars['desktop']; //Missing tablet basebar object...

      if (images.length) {
				const obj = getClosestDPI(this.imageDPI, images);
        /*let obj = images.find((item) => {
          // console.log("basebar resolution finding ", this.imageDPI)
          return item.resolution == this.imageDPI;
        });

        if (!obj) {
          obj = images.find(image => image.resolution > this.imageDPI);
        }*/

        return obj;
      }
      return null;
    },
    basebarImagePath() {
      if (this.basebarObj) {
        return this.basebarObj.image;
      }
      return null;
    },
    basebarLink() {
      return this.basebarObj?.url || null;
    },
    basebarStyle: function () {
      return {
        gridColumn: `span ${this.grid.colCount}`,
        // display: `${this.page.basebars ? "block" : "none"}` //are we forcing basebars all the time ignoring json?
      };
    }
  },
  data() {
    return {
      bbid: bbcount++,
      redPages: [
        '5f73e3bd87768b4b119a0d81',
        '5f73e54b87768b4b119a0f39'
      ]
    };
  },
  methods: {

    hasBasebar: function () {
      return this.page.basebars[this.device].visible;
    },

    handleBasebarClick() {
      if (this.basebarLink) {
        window.open(this.basebarLink);
      }
    }
  }
};
</script>
<style scoped>

.section-container.ad-page {
  display: block;
  height: 100%;
  margin-bottom: 10px;
}

.section-container.ad-page > .block {
  grid-area: unset !important;
  display: block;
  /* height: 100%; */
}

.section-container.ad-page > .block > .image {
  width: auto !important;
  height: available !important;

}

.section-container {
  display: grid;
  grid-auto-flow: dense;

}

.section-container.search-page {
  grid-auto-flow: column dense;
}

.section-container.search-page-vertical {
  /* grid-auto-flow: column dense; */
  /*grid-template-columns: repeat(4, 287px) !important;*/ /* /*Commented since it creates a gap btwn block in category search in vertical mode.*/
}


.section-container.bg-red {
  background-color: #ED1C24;
}

.section-container.bg-red .basebar {
  background-color: #FFF;
  margin: 0 -1px;
  width: calc(100% + 2px);
  height: calc(100% + 2px);
}

.basebar {
  width: 100%;
  order: 999;
  padding-top: 5px;
  display: block;
}

.basebar img {
  width: 100%;
}

.basebar p {
  font-size: 6px;
  text-align: center;
  padding: 0 5px;
  line-height: 1.2;
}

.basebar.clickable {
  cursor: pointer;
}

[mode='tablet'] .basebar, [mode='mobile'] .basebar, .column-view .basebar {
  padding-bottom: 5px;
}

.section-container.mar-b {
  margin-bottom: 10px;
}
.overlay {
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
  position: absolute;
}
.basebar {
  
  position: relative;
}
</style>
