<template>
	<div v-observe-visibility="onVisibilityChange">
		<full-block-video v-if="showVideo" v-bind="$props" @videoClosed="onVideoClosed" @handleUserClose="blockVideoState = false" :posterSource="posterSource"/>
	    <product-element v-else v-bind="$props" @onRegionClick="onRegionClick" @srcFromProduct="handleSrcFromProduct"/>
	</div>
	
</template>

<script>
import {defineComponent} from 'vue'
import blockElementMixin from "@/mixins/blockElementMixin";
import FullBlockVideo from "@/components/block/elements/FullBlockVideo.vue";
import ProductElement from "@/components/block/elements/ProductElement.vue";
import featureMixin from "@/mixins/featureMixin";

export default defineComponent({
	name: "ProductBlockVideoElement",
	components: {ProductElement, FullBlockVideo},
	mixins: [featureMixin, blockElementMixin],
	data() {
		return {
			blockVideoState: false,
			posterSource: null,
			featurePath: 'blockVideos.fullBlock'
		}
	},
	computed: {
		showVideo() {
			return this.blockVideoState && this.isVisible;
		}
	},
	created() {
	  // this.handlePlay();
    },
	methods:{
		onRegionClick(region){
			this.blockVideoState = region.isVideo
			console.log('onRegionClick:', region);
		},
		onVisibilityChange(isVisible) {
			if (isVisible) {
				this.handlePlay();
			}
		},
		handlePlay() {
		 const products = this.blockData?.products;
		 const removedRegions = [];
		 const updatedRegions = [];
			products.forEach((prod) => {
                if (((prod?.sku || '').toLowerCase() === 'inblock' || (prod?.sku || '').toLowerCase() === 'inblocktc')) {
					const delay = (prod.inblockDelay) ? prod.inblockDelay : 2
					this.block.classes.inblock = true;
			
					if (prod.inblockAutoplay) {
			          prod.clickRegions.forEach((region, index) => {
			            if (region) {
					        removedRegions.push(region);
				        } else {
					        updatedRegions.push(prod.clickRegions[index])
				        }
				        prod.clickRegions = updatedRegions;
				    })
						setTimeout(() => {
						  this.blockVideoState = prod.inblockAutoplay;
						  removedRegions.forEach((region) => {
					       prod.clickRegions.push(region)
				          })
		                }, delay * 1000)
					} 
				}
				this.blockVideoState = false;
				
			})
		},
		onVideoClosed(){
			if(this.blockVideoState) {
				this.handlePlay();
				return true
			} 
			return false;
		},
		handleSrcFromProduct(imageSrc) {
		    this.posterSource = imageSrc;
		}
	}
})
</script>


<style lang="scss" scoped>
.flyer-block.ProductBlockVideoElement .product-block{
  transition: border-color 0.2s, box-shadow 0.2s, transform 0.2s;

  &:hover, &:focus {
	transform: scale(1.02);
	box-shadow: 0 0px 50px rgba(0, 0, 0, 0.3);
	z-index: 9999;
	outline: none;
  }
}
</style>
