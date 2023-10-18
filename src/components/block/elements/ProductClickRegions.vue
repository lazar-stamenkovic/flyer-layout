<template>
	<div v-if="isVisible" :aria-label="product.contents" class="product-click-regions">
		<div
				v-for="(region, i) in regions"
				:key="`${i}_${sku}-${region.height}-${region.width}-${region.top}-${region.left}`"
				:aria-label="region.contents"
				:style="getRegionStyle(region)"
				class="product-click-region"
				@click.stop="onClick"
		>
		<img v-if="isVideo" class="front" src="/images/play_button.svg" alt="play">
		</div>
	</div>
</template>

<script>
import {mapActions, mapGetters, mapState} from "vuex";
import blockElementMixin from "@/mixins/blockElementMixin";
//import AppConfig from "@/classes/AppConfig";

export default {
	name: "ProductClickRegions",
	mixins: [blockElementMixin],
	props: {
		product: {
			type: Object,
			default: () => {
				return {}
			}
		}
	},
	computed: {
		...mapGetters('config', ["settings", "branding"]),
		...mapGetters('landingPage', ["currentFlyer"]),
		...mapGetters(['storeId', 'language']),
		...mapState(['currentPageNumber']),
		...mapState('shoppingList',['shoppingList']),
		regions() {
			return this.product.clickRegions;
		},
		sku() {
			return (this.product.sku || '').toLowerCase().trim();
		},
		isVideo() {
			const sku = this.sku;
			return sku === 'inblock' || sku === 'playtc' || sku === 'play' || sku === 'inblocktc';
		},
		checkProductInSL() {
			return this.shoppingList.some((listItem) => listItem.sku == this.sku);
		},
		isCarousel() {
            return (this.blockData?.carouselBlocks?.length ?? 0 >= 1) || (this.blockData.slideNumber !== undefined)
		}
	},
	methods: {
		...mapActions(['setCurrentVideo']),
		...mapActions('events', ['triggerEvent']),
		onClick() {
			const clickRegionWithUrl = this.product.clickRegions.find(clickRegion => clickRegion.url)
			if (clickRegionWithUrl) {
				this.triggerEvent({'event': 'productRegionsWithSku', data: this})
				window.open(clickRegionWithUrl.url)
				return
			}
			if (this.isVideo) {
				switch(this.sku) {
					case 'inblock':
						this.triggerEvent({'event': 'productRegionInBlockVideoClick', data: this});	
					break;
					case 'inblocktc':
						this.triggerEvent({'event': 'productRegionInBlockVideoClick', data: this});
					break;
                    case 'playtc':
					     this.triggerEvent({'event': 'productRegionVideoClick', data: this})
					     this.setCurrentVideo(`${this.product.url}${this.branding.accessKey}`);
					break;
					default:
						this.triggerEvent({'event': 'productRegionVideoClick', data: this})
						this.setCurrentVideo(this.product.url);
				}

			} else if (this.sku === 'url' && !this.isVideo) {
				this.triggerEvent({'event': 'productRegionExternalLinkClick', data: this})
				window.open(this.product.url)
			} else {
				this.triggerEvent({'event': 'productRegionClick', data: this})
				
			}
            if (this.isCarousel) {
				const carouselFrame = this.blockData?.slideNumber
				this.triggerEvent( { event: 'carouselInteraction',
				data: {
				  sku: this.sku,
				  productName: this.product.productEn,
				  frame: (carouselFrame !== undefined) ? carouselFrame + 2 : 1,
				},
				})
			}
			this.$emit('onRegionClick', this);
			
			/*if(this.settings.events?.productRegionClick) {
				AppConfig.ParseEvent(this.settings.events?.productRegionClick, {__self: this});
			}*/
		},
		getRegionStyle(r) {
			return {
				left: `${r.left - 1}%`,
				top: `${r.top - 1}%`,
				width: `${r.width + 2}%`,
				height: `${r.height + 2}%`,
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
			}
		},
	}
}
</script>

<style lang="scss">
.product-click-regions {
  cursor: pointer;

  &:hover {
	.product-click-region {
	  background-color: rgba(0, 0, 0, 0.1);
	}
  }

  .product-click-region {
	position: absolute;
	outline: none;
  }

  .front {
	width: 90%;
	height: auto;
	background-size: cover;
	background-repeat: no-repeat;
	background-position: center;

	z-index: 9999;
	background: transparent;
	border-radius: 50%;
	box-shadow: 0 0 0 0 rgba(255, 82, 82, 1);
	margin: 0px;
	transform: scale(1);
	animation: pulse-red 2s infinite;
  }
  @keyframes pulse-red {
	0% {
	  transform: scale(0.95);
	  box-shadow: 0 0 0 0 rgba(255, 82, 82, 0.9);
	}

	70% {
	  transform: scale(1);
	  box-shadow: 0 0 0 10px rgba(255, 82, 82, 0);
	}

	100% {
	  transform: scale(0.95);
	  box-shadow: 0 0 0 0 rgba(255, 82, 82, 0);
	}
  }
}

</style>
