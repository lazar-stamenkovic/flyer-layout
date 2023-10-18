<template>
	<div
			v-if="enabled && showPdp"
			ref="pdpPopup"
			class="modal-wpr"
			@click="closePdp"
	>
		<div v-click-outside="closePdp" @click.stop="" :class="`modal ${flyerOrientation}`">
			<h2 class="header">
				<span class="pdpTitle">{{ content.pdpTitle }}</span>
				<button :aria-label="content.pdpClose" class="close-btn" tabindex="0" @click="closePdp" @keydown.esc="closePdp">
					<img src="/images/icon-close-white.svg" alt="Close" />
				</button>
			</h2>

			<div ref="toastContent" class="content">
				<div :class="`content-container ${flyerOrientation}`">
					<div class="pdpContainer">
						<template v-if="isAdonis">
							<h2> {{ currentProduct.productDescription}} </h2>
						</template>
						<template v-else>
						   <h2 v-if="currentProduct.productFr!==null" tabindex="0">{{ currentProduct.productFr }}</h2>
						   <h2 v-if="currentProduct.productEn && currentProduct.productFr"> | </h2>
						   <h2 v-if="currentProduct.productEn !==null"> {{currentProduct.productEn}} </h2>
						</template>
						

						<img :src="currentProduct.productImage" class="productImage"/>
						<div v-if="language == 'en'" class="price" tabindex="0">
							<h2>
                <span v-if="currentProduct.priceQuantity"
                >{{ currentProduct.priceQuantity }}/
                </span>

								<span v-if="currentProduct.salePricePrefixEn"> {{ currentProduct.salePricePrefixEn }} </span>
								<!-- <span> ${{ parseFloat(currentProduct.salePrice).toFixed(2) }}</span> -->
								<span
										v-if="
                    currentProduct.salePrice == null ||
                      currentProduct.salePrice === '' ||
                      currentProduct.salePrice === '$NaN' ||
                      currentProduct.salePrice === 'NaN$'
                  "
								></span>
								<span v-if="currentProduct.salePrice === null && currentProduct.salePriceFr !== null">${{ currentProduct.salePriceFr}}</span>
								<span v-else-if="currentProduct.salePrice==='3.99 à 7.99'">
                  $3.99 à $7.99</span>
								<span v-else-if="isNaN(currentProduct.salePrice)">
                  {{ currentProduct.salePrice }}
                </span>

								<span v-else-if="currentProduct.salePrice.includes('à')">
                  ${{ currentProduct.salePrice }}
                </span>

								<span v-else>
                  ${{ parseFloat(currentProduct.salePrice).toFixed(2) }}</span
								>
								<!-- <span v-else> ${{currentProduct.salePrice}}</span> -->

								<span v-if="currentProduct.promoUnitEn">
                  {{ currentProduct.promoUnitEn }}
                </span>
								<span
										v-if="currentProduct.alternatePrice"
										class="alternatePrice"
								>{{ currentProduct.alternatePrice }}</span
								>
							</h2>
						</div>

						<div v-else class="price" tabindex="0">
							<h2>
                <span v-if="currentProduct.priceQuantity"
                >{{ currentProduct.priceQuantity }}/
                </span>
								<!-- <span v-html="showPriceFr(currentProduct.salePrice)"> $ </span> -->

								<span v-if="currentProduct.salePricePrefixFr"> {{ currentProduct.salePricePrefixFr }} </span>
								<span
										v-if="
                    currentProduct.salePrice == null ||
                      currentProduct.salePrice === '' ||
                      currentProduct.salePrice === '$NaN' ||
                      currentProduct.salePrice === 'NaN$'
                  "
								></span>
								<span v-if="currentProduct.salePrice === null && currentProduct.salePriceFr !== null">{{ currentProduct.salePriceFr.replaceAll(".", ",")}}$</span>
								<span v-else-if="currentProduct.salePrice==='3.99 à 7.99'">
                  3,99$ à 7,99$</span>
								<span v-else-if="isNaN(currentProduct.salePrice)">
                  {{ currentProduct.salePrice }}
                </span>
								<span v-else-if="currentProduct.salePrice.includes('à')">
                  {{ currentProduct.salePrice.replaceAll(".", ",") }}$</span>
								<span v-else>
                  {{
										parseFloat(currentProduct.salePrice)
												.toFixed(2)
												.replace(".", ",")
									}}$</span
								>
								<span v-if="currentProduct.promoUnitFr">
                  {{ currentProduct.promoUnitFr }}
                </span>
								<span
										v-if="currentProduct.alternatePriceFr"
										class="alternatePrice">{{ currentProduct.alternatePriceFr }}</span>
							</h2>
						</div>

						<div class="savings" v-if="currentProduct.savingsEn">
              <span>
                {{ currentProduct.savingsPrefix }}
                 {{ currentProduct.savingsEn }}
                {{ currentProduct.savingsSuffix }}</span
              >
						</div>
						<div class="validity">
              <span
              ><strong>{{ content.pdpValidFrom }}</strong></span>
							<div class="date" v-html="flyerDate(currentProduct.validFrom, currentProduct.validTo)"></div>
						</div>

						<div v-if="currentProduct.bodyFr || currentProduct.bodyEn" class="detail">
							<span>{{ content.pdpDetails }}</span>
							<p class="detail-content">
								{{ currentProduct.bodyFr && currentProduct.bodyEn 
								    ? `${currentProduct.bodyFr} |  ${currentProduct.bodyEn}` 
									: currentProduct.bodyFr || currentProduct.bodyEn
							    }}
							</p>
						</div>

						<p class="disclaimer-content">{{ content.disclaimer }}</p>

						<div class="addtoList-container">
							<button v-if="checkProductInSL(currentProduct)"
							        class="pdpAddToList removeFromList"
							        tabindex="0"
							        @click="handleRemoveFromList(currentProduct)"
							>
								<span> {{ content.pdpRemoveFromList }} </span>
							</button>

							<button v-else-if="listEnabled"
							        class="pdpAddToList"
							        tabindex="0"
							        @click="handleAddToList(currentProduct)"
							>
								<span> {{ content.pdpAddToList }} </span>
							</button>
						</div>

					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import ClickOutside from "vue-click-outside";
import {mapActions, mapGetters, mapState} from "vuex";
import moment from "moment";
import featureMixin from "@/mixins/featureMixin";
import AppConfig from "@/classes/AppConfig";

export default {
	directives: {
		ClickOutside,
	},
	mixins: [featureMixin],

	data() {
		return {
			toastContent: null,
			ready: false,
			featurePath: 'pdp',
			featureEvents: ['productRegionClick']
		};
	},
	mounted() {
		// console.log(this.$refs.pdpPopup);
		/*if(this.enabled){
				const pdpFocus = this.$refs.pdpPopup;
				pdpFocus.focus();
			}*/

	},
	computed: {
		...mapGetters(["content", "language"]),
		...mapGetters("screen", ["flyerOrientation"]),
		...mapGetters("landingPage", ["currentFlyer"]),
		...mapState("shoppingList", ["shoppingList"]),
		...mapGetters("pdp", {pdpEnabled: "enabled"}),
		...mapState("pdp", {showPdp: "isVisible", currentProduct: "product"}),
		...mapGetters('shoppingList', {listEnabled: 'enabled'}),

		columnView() {
			return this.flyerOrientation === "vertical";
		},

		enabled() {
			return this.pdpEnabled && this.config.mode === 'internal';
		},
		isAdonis(){
            if(AppConfig.AppConf?.title.toLowerCase().includes("adonis".toLowerCase())){
                return true
            }
            else return false
        },

	},

	methods: {
		...mapActions(["setPdpDisplay", "setCurrentProduct"]),
		...mapActions("shoppingList", ["setAddToList", "setRemoveFromList"]),
		...mapActions("pdp", ["close", "open"]),

		onFeatureEvent(event, data) {
			if (this.config.enabled) {
				// console.log('PDP Event:', data.product)
				if (this.config.mode === 'internal' && data.sku !== 'url' && !data.isVideo) {
					this.open(data.product);
				}
			}
		},

		closePdp() {
			if (this.ready) {
				this.close();
			}
		},
		handleAddToList(product) {
			// console.log("Handle add to list", product)
			const additionalItemFlag = false;
			this.setAddToList({product, additionalItemFlag});
		},

		handleRemoveFromList(product) {
			this.setRemoveFromList(product);
		},

		checkProductInSL(product) {
			let item = this.shoppingList.filter(function (e) {
				return e.sku == product.sku;
			});
			if (item.length > 0) return true;
			else return false;
		},
		showPriceFr(price) {
			if (!price) return;

			return (
				parseFloat(price)
					.toFixed(2)
					.replace(".", ",") + " $"
			); //adds zeros
			// return(frPrice+" $")
			// console.log('price is' + (price.toFixed(2)))
			// return((price).replace(".",",")+" $")
		},
		showPriceEn(price) {
			if (!price) return;
			// let enPrice = price.replace(",",".")
			else if (price.includes("$")) {
				let priceWith$ = price.replace("$", "");
				if (priceWith$.includes(",")) {
					let enPrice = priceWith$.replaceAll(",", ".");
					return "$" + enPrice;
				}
				return "$" + priceWith$;
			}
			return "$" + price.replace(",", ".");
		},
		flyerDate(validFrom, validTo) {
			const start = validFrom ? moment.utc(validFrom) : moment.utc(this.currentFlyer.startDate);
			const endDate = validFrom ? moment.utc(validTo) : moment.utc(this.currentFlyer.endDate);
			if (this.language === "en") {
				if (this.currentProduct.sku === "10024392") {
					// console.log("roses");
					return `${moment("2022-02-12").format("MMMM D, YYYY")} to ${moment("2022-02-14").format("MMMM D,YYYY")}`;
				} else
				return `${start.locale('en').format("MMMM D, YYYY")} to ${endDate.locale('en').format("MMMM D, YYYY")}`;
			} else {
				if (this.currentProduct.sku === "10024392")
					return `${moment("2022-02-12").format("D MMMM, YYYY").replace("1er", '1<sup style="vertical-align: top; font-size: 8px;">er</sup>')} jusqu'au ${moment("2022-02-14").format("D MMMM, YYYY").replace("1er", '1<sup style="vertical-align: top; font-size: 8px;">er</sup>')}`;
				else
					return `${start.format("D MMMM, YYYY").replace("1er", '1<sup style="vertical-align: top; font-size: 8px;">er</sup>')} jusqu'au ${endDate.format("D MMMM, YYYY").replace("1er", '1<sup style="vertical-align: top; font-size: 8px;">er</sup>'
					)}`;
			}
		}
	},

	watch: {
		showPdp(val) {
			if (val) {
				setTimeout(() => {
					this.ready = true;
					const pdpFocus = this.$refs.pdpPopup;
					pdpFocus.focus();
				}, 100);
			}
			this.ready = false;
		},
	},
};
</script>

<style lang="scss" scoped>
.mobile {
  display: none !important;
  flex-flow: column;
  row-gap: 2em;
  padding: 1.5em;

  .description {
	display: flex;
	flex-flow: row;
	text-align: left;
	align-items: flex-end;

	> :first-child {
	  width: calc(55px + 1em);
	}

	.mobile-content {
	  flex-basis: 100%;
	}
  }
}

.modal-wpr {
  position: absolute;
  top: 0px;
  right: 0;
  bottom: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.75);
  z-index: 20;
  display: flex;
  justify-content: flex-start;
  align-items: flex-end;
  flex-flow: column;

  .modal {
	background-color: var(--secondary-color);
	/*margin-top: 75px;*/
	border: 1px solid #bbbbbb;
	/* overflow: auto;*/
	max-height: calc(100% - 1em);
	box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.5);
	display: flex;
	flex-flow: column;
	max-width: calc(100% - 4em);

	.header {
	  background-color: var(--secondary-color);
	  color: var(--primary-text-color);
	  display: flex;
	  justify-content: space-between;
	  padding: 10px;

	  h2 {
		font-size: 18px;
		text-transform: uppercase;
		font-weight: 400;
	  }

	  .close-btn {
		cursor: pointer;
			&:hover{
				background: none;
				filter: unset;
			}
	  }
	}

	.subtitle {
	  padding-top: 6px;
	  font-size: 12px;
	}

	.content {
	  padding: 8px;
	  background-color: #fff;
	  color: #545454;
	  position: relative;
	  flex: 1 0 auto;
	  overflow: auto;
	  // margin:0px 10px 10px 10px;
	  margin: 10px 10px 17px;
	  min-height: 250px;
	  max-height: calc(100% - 4em);
	  /*.scroll-container{
					position: absolute;
					top:0px;
					bottom:0px;
					left:0px;
					right:0px;
				}*/
	  .content-container {
		text-align: left;
		//width:300px;
	  }

	  .f-half {
		display: flex;
		column-gap: 1em;

		flex-direction: column;

		> div {
		  flex-basis: 100%;
		  display: flex;
		  flex-flow: column;
		}
	  }

	  .content-container {
		// width: 350px;
	  }

	  .feature {
		background: #eee;
		margin: 12px 0;
		display: flex;
		justify-content: center;
		flex: 1;

		.description {
		  display: flex;
		  font-size: 14px;
		  padding: 15px 0;

		  .button-preview {
			display: flex;
			flex-direction: column;
			align-items: center;
			padding: 0 20px;

			h4 {
			  text-transform: uppercase;
			  padding-top: 16px;
			  white-space: nowrap;
			}

			.subtitle {
			  text-align: center;
			}
		  }
		}
	  }
	}
  }
}

.pdpTitle {
  font-size: 18px;
  font-weight: bold;
}

.pdpContainer {
  //margin-left: 10px;
  max-width: calc(100vw - 5em);

  h2 {
	font-size: 18px;
	line-height: 1.1em;
  }

  .productImage {
	// max-height: 60%;
	// max-width: 60%;
	max-height: 200px;
	max-width: 120px;
	width: auto;
	height: auto;
	top: 0;
	bottom: 0;
	left: 0;
	right: 0;
	margin: auto;
  }

  .price {
	display: flex;
	color: #ee3124;
	font-weight: 900;
  }

  span.alternatePrice {
	display: inline-block;
  }

  .alternatePrice {
	color: #000;
	font-size: 13px;
	font-weight: normal;
	margin-left: 5px;
  }

  .savings {
	color: #ee3124;
	font-size: 12px;
  }

  .detail {
	font-size: 15px;
	margin-top: 10px;
	font-weight: 900;

	.detail-content {
	  font-size: 12px;
	  font-weight: normal;
	}
  }

  .disclaimer-content {
	font-size: 9px;
	font-weight: normal;
	margin-top: 10px;
	font-style: italic;
  }

  & .validity {
	font-size: 13px;
	margin-top: 10px;
  }
}

button {
  background: transparent;
  // border: 1px solid #ccc;
  text-transform: uppercase;
  font-weight: 600;
  color: #666;
  border-radius: 4px;
  border: none;
}

button.button {
  background: #fff;
  border: 1px solid #ccc;
  text-transform: uppercase;
  font-weight: 600;
  color: #666;
  padding: 8px 12px;
  border-radius: 4px;
  margin-top: 16px;
}

button.button:hover {
  background: #eee;
  color: #000;
}

.btn {
  background: #fff;
  border: 1px solid #bbb;
  border-radius: 4px;
  padding: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 34px;
  width: 34px;
  color: #333;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.5);
  cursor: auto;
  pointer-events: none;
}

.addtoList-container {
  margin: 0px 10px 0px 10px;
}

.pdpAddToList {
  display: flex;
  flex-grow: 0.7;
  cursor: pointer;
  width: 100%;
  border-radius: 5px;
  // margin-top:15px;
  // margin-bottom:15px;
  // margin-right: 10px;
  margin: 15px 0px 10px 0px;
  background-color: var(--tertiary-color);
  color: #fff;
  padding: 8px;
  justify-content: center;
  max-width: calc(100vw - 7em);
  font-weight: normal;

  &.removeFromList {
	background-color: #EE3124;
  }
}

/* width */
::-webkit-scrollbar {
  width: 15px;
}

/* Track */
::-webkit-scrollbar-track {
  //background: #f1f1f1;
  display: none;
}

/* Handle */
::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 10px;
}

/* Handle on hover */
::-webkit-scrollbar-thumb:hover {
  background: #555;
}

.btn.page {
  width: 100%;
  height: 28px;
  justify-content: flex-start;
  padding-left: 3%;
  margin-bottom: 8px;

  & + .subtitle {
	text-align: left !important;
  }
}

.page-num {
  background-color: var(--primary-color);
  color: var(--primary-text-color);
  border-radius: 4px;
  font-size: 12px;
  padding: 7px;
}

/*@media only screen and (max-width: 1024px){
    .modal-wpr .modal{
      .content {
        .f-half {
          flex-direction: column !important;
        }
        .content-container{
          width: 925px;
        }
      }
    }
  }*/

.navigation {
  .description {
	flex-basis: 50%;
	justify-content: center;
  }
}

@media only screen and (max-height: 850px) and (min-width: 1024px) {
  .modal-wpr .modal {
	.content {
	  .f-half {
		flex-direction: row !important;
	  }

	  .content-container {
		width: 300px;
	  }
	}
  }
}

@media only screen and (max-width: 700px) and (min-width: 558px) {
  .modal-wpr .modal {
	.content {
	  .content-container {
		// width: 575px;
	  }
	}
  }
}

@media only screen and (max-width: 700px) {
  .modal-wpr .modal {
	.content {
	  .content-container {
		//width: 300px;
		.productImage {
		  // max-height: 50%;
		  // max-width: 50%;
		  max-height: 180px;
		  max-width: 85px;
		}
	  }
	}
  }
}

/* Vertical View Specific */
@media (min-width: 1200px) {
  .modal-wpr .modal.vertical .content .feature.navigation {
	/*.description {
				padding-top: 10px;
				padding-left: 100px;
				padding-bottom: 70px;
				position: relative;
			}*/

	/*.btn.page {
				transform: rotate(90deg);
				width: 146px;
				position: absolute;
				left: 0;
				bottom: 38%;
			}*/

	h4,
	.subtitle {
	  text-align: left;
	  width: 100%;
	}

	.subtitle + .subtitle {
	  margin-top: 1em;
	}
  }
  .content-container {
	width: 300px;
  }
}

@media (max-width: 850px) {
  /*.modal-wpr {
    top: 125px;
  }*/
}

@media (min-width: 850px) and (max-width: 1023px) {
  /*.modal-wpr {
    top: 125px;
  }*/
}

/* Mobile */
@media (min-width: 1024px) and (max-width: 1200px) {
  /*.modal-wpr {
    top: 65px;
  }*/
  .walkthrough {
	display: none;
  }
}

@media (max-width: 1200px) {
  .mobile {
	display: flex !important;
  }
  .desktop {
	display: none !important;
  }

  .modal-wpr .modal {
	/* margin-top: 140px;
			width: 90% !important;*/
	width: 338px;

	.content {
	  .f-half {
		/*flex-direction: row !important;*/
	  }

	  .content-container {
		// width: 400px;
	  }
	}

	.header {
	  padding-bottom: 4px;

	  h2 {
		font-size: 14px;
	  }
	}
  }

  .heading {
	display: none;
  }

  .modal-wpr .modal .content .feature {
	display: block;
	background: none;
	padding: 0 6%;

	.description {
	  padding: 0;
	  margin-bottom: 20px;
	  height: 50px;
	}

	.button-preview {
	  display: block;
	  position: relative;
	  padding-left: 60px;
	  width: 100%;

	  h4 {
		padding: 0;
	  }

	  .subtitle {
		text-align: left;
	  }

	  .btn {
		position: absolute;
		top: 0;
		left: 0;
	  }
	}
  }

  .subtitle.mobile {
	text-align: center;
	margin-bottom: 20px;
  }
}
</style>
