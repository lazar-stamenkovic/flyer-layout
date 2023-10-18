<template>
	<div class="carousel in-block" v-if="isCarousel">
		<carousel
				:perPage=1
				:navigation-enabled="true"
				:navigationClickTargetSize=15.4
				:pagination-size=18
				:pagination-padding="6"
				:autoplay="false"
				:loop="true"
				:mouse-drag="false"
				v-on:pageChange="pageChange"
				aria-label="carousel"
		>
			<slide><product-element v-bind="$props" /></slide>
			<slide v-for="(slide,i) in slideBlocks" :key="i" @slideclick="handleSlideClick">
				<product-element :block-data="slide" v-bind="$props" />

			</slide>

		</carousel>
	</div>
</template>

<script>
import blockElementMixin from "@/mixins/blockElementMixin";
import ProductElement from "@/components/block/elements/ProductElement.vue";
import { Carousel, Slide } from 'vue-carousel';
import {mapActions} from "vuex";

export default {
	name: "ProductCarousel",
	components: {ProductElement, Carousel, Slide},
	mixins:[blockElementMixin],
	data(){
		return {
			currentSlide: 0
		}
	},
	mounted() {
		setTimeout(() => {
			// gotta work on this
			const containers = document.getElementsByClassName('VueCarousel-dot-container');
			containers.forEach( container => {
				const dots = container.getElementsByClassName('VueCarousel-dot');
				dots.forEach((dot, index) => {
					dot['title'] = ``;
					dot['value'] = `Slide ${index+1}`;
					dot.setAttribute('aria-label', `Slide ${index+1}`);
				});
			});
		}, 1000)
	},
	computed:{
		slideBlocks(){
			return this.blockData?.carouselBlocks;
		},
		isCarousel() {
			return (this.blockData?.carouselBlocks?.length ?? 0) >= 1;
		}
	},
	methods:{
		...mapActions('events', ['triggerEvent']),
		handleSlideClick (dataset) {
			console.log("Slide click info ",dataset.index, dataset.name)
		},
		navigationHandler(direction){
			return direction
		},
		pageChange(i)
		{

			if(i)
				this.currentSlide = i
			else
				this.currentSlide = 0
			// console.log('current Index', i);
			// console.log('current Slide',this.currentSlide)
			this.triggerEvent( {
				event: 'carouselInteraction',
				data: {
				    frame: i + 1,
				},
				
			})
			return this.currentSlide

		},
	}
}
</script>

<style lang="scss">
.ProductCarousel {
	display: initial !important;
	.carousel {
		.VueCarousel {
			position:inherit;

			.VueCarousel-navigation {
				position: relative;
				bottom:45px;
				margin:0 auto;

				.VueCarousel-navigation-button {
					cursor: pointer;
					background: none;
					height: 45px;
					width: 45px;
					background-size: contain;
					background-position: center;
					border-radius: 50%;
					font-size: 0;
					opacity: .7;
					transition: opacity 200ms, filter 100ms;
					z-index: 1100;
					margin:0 -80px;

					&:hover {
						opacity: 1;
					}
					&.VueCarousel-navigation-prev {
						background-image: url("/images/moveleft-arrow-desktop.png");
						//left: 36% !important;
					}
					&.VueCarousel-navigation-next {
						background-image: url("/images/moveright-arrow-desktop.png");
						//right: 36% !important;
					}
					&.VueCarousel-navigation--disabled {
						opacity: 0.3 !important;
					}
					&:focus:not(:focus-visible) {
						outline: none;
					}
				}
			}

			.VueCarousel-pagination {
				z-index: 1000;
				margin-top: -85px !important;

				.VueCarousel-dot-container {
					-webkit-backface-visibility: hidden;
					-ms-transform: translateZ(0); /* IE 9 */
					-webkit-transform: translateZ(0); /* Chrome, Safari, Opera */
					opacity: 0.9;
					background: none;

					&:hover {
						opacity: 1;

						.VueCarousel-dot--active{
							background: rgba(0, 0, 0) !important;
						}
					}
					.VueCarousel-dot {
						min-height: unset;
						min-width: unset;
						margin: 18px 6px !important;
						padding: 0 !important;
						border: 2px solid rgb(0, 0, 0);
						background: rgb(255, 255, 255) !important;

					}
					.VueCarousel-dot--active{
						background: rgba(0, 0, 0, 0.7) !important;
					}

				}
			}
		}
	}
}

/*Mobile*/
@media (min-width: 280px ) and (max-width: 844px) {
	.carousel {
		.VueCarousel {
			.VueCarousel-navigation {
				.VueCarousel-navigation-button {
					height: 50px;
					width: 50px;
					font-size: 0;
				}
			}

			.VueCarousel-pagination {
				.VueCarousel-dot-container {
					.VueCarousel-dot {
						width: 22px !important;
						height: 22px !important;
					}
				}
			}
		}
	}
}
</style>


<style scoped>
.block {
	/*cursor: pointer;*/
	transition: border-color 0.2s, box-shadow 0.2s, transform 0.2s;
	transform-origin: top left;
	overflow: visible;
}

.block.clickable {
	cursor: pointer;
}

.block > div {
	position: relative;
}
/* .block:before {
  content: "";
  display: block;
  height: 0;
  width: 0;
  padding-bottom: 100%;
} */
.overlay {
	top: 0;
	bottom: 0;
	right: 0;
	left: 0;
	position: absolute;
	will-change: transform, opacity;
}

.overlay.shadow {
	background-color: rgba(0, 0, 0, 0.7) !important;
}

.block .image {
	transition: all 300ms;
	display: block;
	image-rendering: -webkit-optimize-contrast;
}

.block .image.ad {
	height: 100%;
	width: auto;
}
.block .image.ad.vertical {
	height: auto;
	width: 100%;
}

.block:hover,
.block:focus {
	transform: scale(1.02);
	box-shadow: 0 0px 50px rgba(0, 0, 0, 0.3);
}

.block:focus {
	outline: none;
}

.block:hover .overlay {
	/* background: linear-gradient(145deg, rgba(255,255,255,0.0), rgba(0, 0, 0, 0.5)); */
	background: linear-gradient(
			-35deg,
			rgba(0, 0, 0, 0.1) 0%,
			rgba(194, 189, 86, 0) 61%,
			rgba(0, 0, 0, 0) 100%
	);
	/* box-shadow: 0 0px 50px rgba(0, 0, 0, 0.3); */
}
.block:hover {
	z-index: 200;
	/* box-shadow: 0px 3px 15px rgba(0, 0, 0, 0.5); */
	/* box-shadow: 0px 3px 15px 15px rgba(0, 0, 0, 0.4); */
}
.blockBasebar {
	transition: border-color 0.2s, box-shadow 0.2s;
	position: absolute;
	transform-origin: bottom;
	background-color: white;
	overflow: hidden;
}
.blockMasthead {
	transition: border-color 0.2s, box-shadow 0.2s;
	position: absolute;
	transform-origin: top left;
	background-color: white;
	overflow: hidden;
}
video {
	position: absolute;
	width: 100%;
	height: 100%;
	background-image: linear gradient(315deg, #d3d3d3 0%, #7f8c8d 74%);
	object-fit: cover;
	z-index: 5000;
}
video:hover {
	transform: scale(1.02);
}
.stop {
	/* cursor: pointer; */
	border-radius: 50%;
	background: url("/images/download.png") no-repeat center;
	background-size: 13px 13px;
	/* transform: rotate(45deg); */
	width: 25px;
	height: 25px;
	border-radius: 50%;
	background-size: contain;
	cursor: pointer;
	margin-top: 5px;
	right: 5px;
	position: absolute;
	z-index: 5001;
}

.block img,
.block .overlay {
	transition: filter 0.3s, background-color 0.3s;
}

@supports (-webkit-touch-callout: none) {
	.block:hover {
		transform: none;
	}
}
</style>