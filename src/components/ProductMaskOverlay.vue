<template>
  <fragment>
    <svg
        class="image"
        shape-rendering="crispEdges"
        :viewBox="`0 0 ${width} ${height}`">
      <defs>
        <mask :id="id">
          <rect x="0" y="0" fill="rgb(20, 182, 197)" width="100%" height="100%" fill-opacity="50%"></rect>
          <rect
              v-for="(rect, i) in rects"
              :key=" 'mask-rect-'+ rect.sku + i"
              :sku="(rect.sku || '').trim()"
              fill="#ffffff"
              :x="rect.left + '%'"
              :y="rect.top + '%'"
              :width="rect.width + '%'"
              :height="rect.height + '%'"
          >
          </rect>
        </mask>
      </defs>
      <image :mask="`url(#${id})`" xmlns:xlink="http://www.w3.org/1999/xlink"  :xlink:href="image" :width="`${width}px`" :height="`${height}px`" ></image>
    </svg>
  </fragment>

</template>

<script>

import {mapGetters} from "vuex";
import {Fragment} from "vue-fragment"
import {getClosestDPI} from "@/store/modules/scale";

let maskIds = 0;

export default {
  name: "ProductMaskOverlay",
  components:{
    Fragment
  },
  props: {

	  blockData:{
		  type: Object,
		  default: () => {
			  return {}
		  }
	  },
	  block:{
		  type: Object,
		  default: () => {
			  return {};
		  }
	  },

    /*products: {
      type: Array,
      default: () => {
        return [];
      }
    },
    image: {
      type: String,
      default: ''
    },
    width:{
      type: Number,
      default: 1
    },
    height:{
      type:Number,
      default: 1
    },
    isAdPage:{
      type:Boolean,
      default: false
    }*/
  },
  data(){
    return {
      id: "Prod-Mask-" + (++maskIds)
    }
  },
  computed:{
    ...mapGetters(['highlightResults']),
	  ...mapGetters('scale', ['imageDPI']),
	  products() {
			return this.blockData.products;
	  },
    style(){
      return {
        maskImage: `url(#${this.id})`
      }
    },

    rects(){
      return this.parsedRects.rects;
    },
    viewBox(){
      return this.parsedRects.viewBox.join(' ');
    },
	  resolutions(){
		  return this.blockData.images;
	  },
	  currentResolution(){
		  const dpi = this.imageDPI;
		  const images = this.resolutions;
		  return getClosestDPI(dpi, images);
	  },
	  image(){
		  return this.currentResolution?.image;
	  },
	  width(){
			return this.block.width;
	  },
	  height() {
			return this.block.height;
	  },
    parsedRects(){
      let rects = [];
      let vx = 100;
      let vy = 100;
      let vh = 0;
      let vw = 0;
      for(let i=0; i < this.products.length; i++){
        const sku = this.products[i].sku || `sku_${i}`;
        rects = rects.concat(this.products[i].clickRegions.map((region) => {
          region.sku = sku;

          vx = Math.min(vx, region.left);
          vy = Math.min(vy, region.top);

          vh = Math.max(vh, region.height + region.top);
          vw = Math.max(vw, region.width + region.left);
          return region;
        }));
      }

      const viewBox = [
          0,
          0,
          vw - vx,
          vh - vy
      ]
      return {rects, viewBox};
    }
  }
}
</script>

<style scoped lang="scss">
  svg{
    background-color: #000;
    transition: all 300ms;
    height: 100%;
    width:100%;
    display:block;
    image-rendering: -webkit-optimize-contrast;
    object-fit: contain;
    object-position: top left;
    transition: all 300ms;
    mask {
      rect {
        transition: opacity 0.3s;
      }
      rect[sku] {
        opacity: 0;
      }
    }
  }
</style>
