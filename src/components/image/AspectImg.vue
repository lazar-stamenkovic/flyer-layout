<template>
	<img :src="imgSrc" class="aspect-img" :style="style" v-bind="$attrs" />
</template>

<script>
export default {
	name: "AspectImg",
	props: {
		aspectRatio: {
			type: String,
			default: null
		},
		src: {
			type: String,
			default: null
		}
	},
	computed: {
		style() {
			const style = {};
			if(this.aspectRatio) {
				const ratios = this.aspectRatio.split(':');
				const r = (Number(ratios[1]) / Number(ratios[0])) * 100;
				style.paddingTop = `${r}%`;
				style.backgroundImage = `url('${this.src}')`;
			}
			return style;
		},

		imgSrc() {
			if(this.aspectRatio) {
				return null;
			}
			return this.src;
		}

	}
}
</script>

<style scoped>
	.aspect-img {
		background-repeat: no-repeat;
		background-position: center;
		background-size: cover;

	}
</style>
