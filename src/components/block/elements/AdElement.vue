<template>
	<div class="ad-element" @click="onClick" @keydown.enter="onClick">
		<ExpandingDisclaimer v-if="useLegalExpansion" :add-collapsible="true" :containerWidth="setContainerWidth">
			<image-element :constrain="constraint" :class="[{ ad: !!linkUrl }, 'ad-class-element']" v-bind="$props" :style="{ width: imgWidth }" ref="imageElement" />
		</ExpandingDisclaimer>
		<template v-else>
			<image-element :constrain="constraint" :class="{ ad: !!linkUrl }" v-bind="$props"  />
		</template>
		
		<div v-if="isVisible">
			<product-click-regions v-for="(product, index) in products" :key="product.sku + index" :block-data="blockData"
				:is-visible="isVisible" :product="product" />
		</div>
	</div>
</template>

<script>
import ImageElement from "@/components/block/elements/ImageElement.vue";
import blockElementMixin from "@/mixins/blockElementMixin";
import { mapGetters } from "vuex";
import ProductClickRegions from "@/components/block/elements/ProductClickRegions.vue";
import ExpandingDisclaimer from "@/components/ExpandingDisclaimer";

export default {
	name: "AdElement",
	components: { ProductClickRegions, ImageElement, ExpandingDisclaimer },
	mixins: [blockElementMixin],
	data() {
		return {
			containerWidth: ''
		}
	},
	computed: {
		...mapGetters('screen', ['displayMode', 'flyerOrientation']),
		...mapGetters(['hasBaseBars']),
		pageHeight() {
			let ph = this.page.pageHeight;
			if (this.hasBaseBars) {
				ph += 31;
			}
			return ph;
		},
		pageWidth() {
			return this.page.pageWidth;
		},
		constraint() {
			if (this.flyerOrientation === 'vertical') {
				return { 'width': this.pageWidth }
			}
			return { 'height': this.pageHeight }
		},
		products() {
			return this.blockData.products;
		},
		linkUrl() {
			return this.blockData.linkUrl;
		},
		useLegalExpansion() {
			return this.page.name.substr(0, 6) === "Legal_" && this.displayMode === "mobile";
		},
		imgWidth() {
			return parseFloat(this.page?.pageWidth) - 42;
		},
		setContainerWidth() {
			return  `${this.page.pageWidth}px`;
		}
	},
	methods: {
		onClick() {
			console.log('Ad Click')
			if (this.blockData.linkUrl) window.open(this.blockData.linkUrl)
		}
	},
}
</script>

<style scoped>
.ad-element {
	position: relative;
	cursor: pointer;
}

.ad {
	cursor: pointer;
}
.overlay {
	top: 0;
	bottom: 0;
	right: 0;
	left: 0;
	position: absolute;
	will-change: transform, opacity;
}

.ad-element .overlay {
	transition: filter 0.3s;
}

.ad-element:hover .overlay {
	pointer-events: auto;
}
</style>
