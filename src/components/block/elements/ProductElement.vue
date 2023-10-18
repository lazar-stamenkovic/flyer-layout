<template>
    <div :class="{'filler-block': isFillerBlock}" class="product-block" @[linkUrlEvent]="handleClick">
        <product-mask-overlay v-if="highlightResults && !isAdPage" v-bind="$props"/>
        <image-element v-else class="product-block-image" v-bind="$props" ref="imageElement"/>
		<div class="overlay"></div>
        <div v-if="isVisible">
            <product-click-regions
                    v-for="(product, index) in products"
                    :key="product.sku + index"
                    :block-data="blockData"
                    :is-visible="isVisible"
                    :product="product"
                    :block="block"
                    v-on="$listeners"
            />
        </div>

    </div>
</template>

<script>
import ImageElement from "@/components/block/elements/ImageElement.vue";
import ProductClickRegions from "@/components/block/elements/ProductClickRegions.vue";
import ProductMaskOverlay from "@/components/ProductMaskOverlay.vue";
import {mapGetters} from "vuex";
import blockElementMixin from "@/mixins/blockElementMixin";


export default {
	name: "ProductElement",
	components: {ProductMaskOverlay, ProductClickRegions, ImageElement},
	mixins: [blockElementMixin],
	mounted(){
		if (this.$parent.$options.name === "ProductBlockVideoElement") {
			this.getImageSrc();
		}
    },
	computed: {
		...mapGetters(['highlightResults']),
		products() {
			return this.blockData.products;
		},
		isAdPage() {
			return this.page.isAdPage;
		},
		isCarousel() {
			return (this.blockData?.carouselBlocks?.length ?? 0) >= 1;
		},
		isFillerBlock() {
			return this.blockData?.name?.includes('filler');
		},
		linkUrlEvent() {
			return this.blockData.linkUrl ? 'click' : 'null'
		}
	},
	methods: {
		handleClick() {
			if (this.blockData.linkUrl) window.open(this.blockData.linkUrl)
		},
	   async getImageSrc() {
		
		  await this.$nextTick();
		  const src = this.$refs.imageElement.src;
		  this.$emit("srcFromProduct", src);
	    }
	}
}
</script>

<style lang="scss">
.product-block {
  position: relative;

  &.filler-block {
	cursor: pointer;
  }
}

.flyer-block.ProductElement:not(.flyer-block.ProductElement.inblock) {
  transition: border-color 0.2s, box-shadow 0.2s, transform 0.2s;

  &:hover, &:focus {
	transform: scale(1.02);
	box-shadow: 0 0px 50px rgba(0, 0, 0, 0.3);
	z-index: 9999;
	outline: none;
  }
}
.overlay {
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
  position: absolute;
}
</style>
