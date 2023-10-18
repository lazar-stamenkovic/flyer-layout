<template>
	<div
			v-if="ready"
			v-observe-visibility="{
				callback: onVisibilityChange,
				throttle: 50,
				intersection: getObserverOptions()
			}"
			:class="classes"
			:style="style"
			tabindex="0"
	>
		<component
				:is="blockComponent"
				:block="blockRef"
				:block-data="blockData"
				:is-visible="isVisible"
				:page="page"
				:seen="seen"
		/>
	</div>
</template>

<script>

import {mapGetters} from "vuex";
import ProductElement from "@/components/block/elements/ProductElement.vue";
import ProductCarousel from "@/components/block/elements/ProductCarousel.vue";
import AdElement from "@/components/block/elements/AdElement.vue";
import ProductBlockVideoElement from "@/components/block/elements/ProductBlockVideoElement.vue";

export default {
	name: "FlyerBlock",
	props: {
		page: {
			type: Object,
			default: () => {
				return {};
			}
		},
		blockData: {
			type: Object
		},
		rootScrollContainer: {
			type: String || Object
		}
	},
	data() {
		return {
			isVisible: false,
			seen: false,
			ready: false,
			classes: {
				'flyer-block': true
			},
			inBlockVisibleState: false
		}
	},
	mounted() {
		this.ready = true;
		this.classes[this.blockComponent.name] = true;
	},
	methods: {
		getObserverOptions() {
			return {
				root: document.getElementById(this.rootScrollContainer),
				rootMargin: "100%",
			};
		},
		onVisibilityChange(isVisible) {
			this.isVisible = isVisible;
			if (isVisible && !this.seen) {
				this.seen = true;
			}
		}
	},
	computed: {
		...mapGetters('screen', ['displayMode', 'flyerOrientation']),
		...mapGetters('config', ['features']),
		unitWidth() {
			return this.page.unitWidth;
		},
		unitHeight() {
			return this.page.unitHeight;
		},
		rowSpan() {
			return this.blockData.rowSpan;
		},
		colSpan() {
			return this.blockData.colSpan;
		},
		width() {
			return this.unitWidth * this.colSpan;
		},
		height() {
			return this.unitHeight * this.rowSpan;
		},
		isCarousel() {
			return (this.blockData?.carouselBlocks?.length ?? 0) >= 1;
		},
		isAdPage() {
			return this.page.isAdPage;
		},
		isSearchResult() {
			return this.page.name === "search_results"
		},
		hasInBlockVideo() {
			const products = this.blockData?.products || [];
			return products.some((prod) => {
				return ((prod?.sku || '').toLowerCase() === 'inblock' || (prod?.sku || '').toLowerCase() === 'inblocktc');
			})
		},
		blockComponent() {
			if (this.blockData?.type === 'component') return this.blockData.component;
			if (this.isCarousel) return ProductCarousel;
			if (this.isAdPage) return AdElement;
			if (this.hasInBlockVideo) return ProductBlockVideoElement;
			return ProductElement;
		},
		placement() {
			let pm = this.blockData.placement[this.displayMode];
			if (this.displayMode === 'desktop' && this.flyerOrientation === 'vertical') {
				pm = this.blockData.placement['tablet'];
			}
			return pm;
		},
		hasPlacement() {
			return this.placement?.visible;
		},
		style() {
			const order = this.placement?.order || 'initial';
			let s = {
				gridColumn: `span ${this.blockData.colSpan}`,
				gridRow: `span ${this.blockData.rowSpan}`,
				order: order,
				display: 'grid'// `${this.canShowAd ? "block" : "none"}`,
			};

			if (this.isSearchResult) {
				delete s.order;
			}

			/*if (!this.isAdPage) {
				s.width = `${this.blockWidth}px`;
				s.height = `${this.blockHeight}px`;
			}*/

			return s;
		},
		blockRef() {
			return this;
		}
	}
}
</script>

<style scoped>

</style>
