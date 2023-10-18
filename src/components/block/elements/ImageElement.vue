<template>
	<img v-if="seen" :src="src" :style="style" />
</template>

<script>
import {getClosestDPI} from "@/store/modules/scale";
import {mapGetters} from "vuex";
import blockElementMixin from "@/mixins/blockElementMixin";

export default {
	name: "ImageElement",
	mixins:[blockElementMixin],
	props:{
		constrain:{
			type: Object,
			default: () => {
				return {'width': null, 'height': null}
			}
		}
	},
	computed:{
		...mapGetters('scale', ['imageDPI']),

		resolutions(){
			return this.blockData.images;
		},
		currentResolution(){
			const dpi = this.imageDPI;
			const images = this.resolutions;
			return getClosestDPI(dpi, images);
		},
		src(){
			return this.currentResolution?.image;
		},
		style(){
			let c = {
				visibility:  this.isVisible? 'visible':'hidden'
			}
			for(let p in this.constrain) {
				const cv = this.constrain[p];
				c[p] = cv === null? `${this.block[p] + 1}px`: `${cv}px`;
			}
			return c;
		}
	}
}
</script>

<style scoped>
	img {
		object-fit: cover;
		object-position: center;
	}
</style>
