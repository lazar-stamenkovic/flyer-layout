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
						<span v-if="config.showProductName !== undefined && config.showProductName">
                <h2 v-if="currentProduct.productFr!==null" tabindex="0"> {{ currentProduct.productFr }} </h2>
						    <h2 v-if="currentProduct.productEn && currentProduct.productFr"> | </h2>
						    <h2 v-if="currentProduct.productEn !==null"> {{currentProduct.productEn}} </h2>
            </span>

            <div :class="{productImageContainer:checkClient}">
              <img :src="currentProduct.productImage" class="productImage"/>
            </div>
            <div v-if="language == 'en'" class="price" tabindex="0">
              <h2>
                <span v-if="currentProduct.priceQuantity && is3DaySale"
                >{{ currentProduct.priceQuantity }}
                </span>

                <span v-if="currentProduct.salePricePrefixEn"> {{ currentProduct.salePricePrefixEn }} </span>

                <span v-if="!isBogo && currentProduct.salePrice"> {{ getSalePrice }}</span>

                <span v-if="!isBogo && currentProduct.promoUnitEn && getSalePrice!==''"> {{ currentProduct.promoUnitEn }}  </span>

                <span
                    v-if="currentProduct.alternatePrice"
                    class="alternatePrice"
                >{{ currentProduct.alternatePrice }}</span>
              </h2>
              <span class="limit" v-if="!isBogo && !isSwipeAndSave && is3DaySale && currentProduct.limitQty"> &nbsp;{{ currentProduct.limitQty }}</span>
            </div>

            <div v-else class="price" tabindex="0">
              <h2>
                <span v-if="currentProduct.priceQuantity">{{ currentProduct.priceQuantity }}/</span>

                <span v-if="currentProduct.salePricePrefixFr"> {{ currentProduct.salePricePrefixFr }} </span>

                <span v-if="currentProduct.promoUnitFr"> {{ currentProduct.promoUnitFr }} </span>
                <span v-if="currentProduct.alternatePriceFr"
                      class="alternatePrice">
									{{ currentProduct.alternatePriceFr }}
								</span>
              </h2>
            </div>

            <div class="savings" :class="{limit: isBogo}" v-if="currentProduct.savingsEn && !currentProduct.salePrice">
              <h2>
                {{ currentProduct.savingsPrefix }}
                {{ currentProduct.savingsEn }}
                {{ currentProduct.savingsSuffix }}
              </h2>
            </div>

            <div class="daysOnly" v-if="is3DaySale">
              {{ currentProduct.tierEachPrice}}
            </div>

            <div class="validity">
              <span
              ><strong>{{ content.pdpValidFrom }}</strong></span>
              <div class="date" v-html="flyerDate"></div>
            </div>

            <div v-if="currentProduct.contents || currentProduct.bodyFr || currentProduct.bodyEn" class="detail">
              <span>{{ content.pdpDetails }}</span>
              <p class="detail-content">{{ getContents || currentProduct.bodyFr || currentProduct.bodyEn }}</p>
            </div>

            <p class="disclaimer-content">{{ content.disclaimer }}</p>

            <div class="addtoList-container">
              <button v-if="checkProductInSL(currentProduct)"
                      class="shopOptions removeFromList"
                      tabindex="0"
                      @click="handleRemoveFromList(currentProduct)"
              >
                {{ content.pdpRemoveFromList }}
              </button>

              <button v-else-if="listEnabled"
                      class="shopOptions pdpAddToList"
                      tabindex="0"
                      @click="handleAddToList(currentProduct)"
              >
                {{ content.pdpAddToList }}
              </button>


              <button v-if="config.shopNow && !isBogo && !isSwipeAndSave && currentProduct.url" tabindex="0" class="shopOptions shopNow" @click="gotoInstaCart()">Shop Now</button>
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
import router from "@/router";

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
    ...mapState("shoppingList", ["shoppingListV1"]),
    ...mapGetters("pdp", {pdpEnabled: "enabled"}),
    ...mapState("pdp", {showPdp: "isVisible", currentProduct: "product"}),
    ...mapGetters('shoppingList', {listEnabled: 'enabled'}),

    checkClient(){
      return AppConfig.AppConf?.title.toLowerCase().includes("rexall".toLowerCase()) ?   true :  false;
    },

    isBogo(){
      return this.currentProduct?.tags?.includes('bogo')
    },

    isSwipeAndSave(){
      if(this.currentProduct===null) return;
      return this.currentProduct.tags?.includes('S&S');
    },

    is3DaySale(){
      if(this.currentProduct===null) return;
      const date = router.currentRoute.query['timeTravelDate'] ?? moment();
      //subtracting and adding 1 day because isBetween function from momentJS doesn't consider the actual date (same day) that are passed as parameters
      const startDate= moment(this.currentProduct.validFrom).subtract(1,"days")
      const endDate= moment(this.currentProduct.validTo).add(1,"days")
      if((this.currentProduct.validFrom !== this.currentFlyer.startDate) && (this.currentProduct.validTo !== this.currentFlyer.endDate) ||
          (this.currentProduct.validFromROW !== this.currentFlyer.startDate) && (this.currentProduct.validToROW !== this.currentFlyer.endDate)){
        return  moment(date).isBetween(startDate, endDate);
      }
      else
        return false
    },

    flyerDate(){
      if(this.currentProduct===null) return;
      let startDate,endDate;
      if(this.isSwipeAndSave){
        startDate = moment(this.currentFlyer.startDate)
        endDate = moment(this.currentFlyer.endDate)
      }

      else if(this.is3DaySale){
        startDate = moment(this.currentProduct.validFrom);
        endDate = moment(this.currentProduct.validTo)
      }
      else{
        if(this.currentProduct.validFromROW !== null){
          startDate = moment(this.currentProduct.validFromROW)
          endDate = moment(this.currentProduct.validToROW)
        }
        else{
          startDate = moment(this.currentProduct.validFrom);
          endDate = moment(this.currentProduct.validTo)
        }
      }

      if (this.language === 'en') {
        return `${moment.utc(startDate).locale(this.language).format('MMMM D, YYYY')} to ${moment.utc(endDate).locale(this.language).format('MMMM D, YYYY')}`
      } else {
        return `${startDate.format('D MMMM, YYYY').replace('1er', '1<sup style="vertical-align: top; font-size: 8px;">er</sup>')} jusqu'au ${endDate.format('D MMMM, YYYY').replace('1er', '1<sup style="vertical-align: top; font-size: 8px;">er</sup>')}`;
      }

    },



    getSalePrice(){
      if(this.currentProduct===null) return
      let price
      const date = router.currentRoute.query['timeTravelDate'] ?? moment();
      //subtracting and adding 1 day because isBetween function from momentJS doesn't consider the actual date (same day)
      const startDate= moment(this.currentProduct.validFromROW).subtract(1,"days")
      const endDate= moment(this.currentProduct.validToROW).add(1,"days")
      if(this.isSwipeAndSave ){
        if(this.currentProduct?.savingsEn){
          price = this.currentProduct.savingsPrefix+' '+this.currentProduct.savingsEn
          return price
        }
        else {
          price=this.currentProduct.salePrice
        }
      }

      else if(this.is3DaySale)
        price = this.currentProduct?.salePrice
      else if(this.currentProduct.rowPrice && moment(date).isBetween(startDate, endDate))
        price = this.currentProduct?.rowPrice;
      else
        price = this.currentProduct?.rowPrice ;

      if(price==null)
        return ''


      else{
        if(this.currentProduct?.savingsEn){
          price = this.currentProduct.savingsPrefix+' '+this.currentProduct.savingsEn
          return price
        }
        else {
          if(price.trim() !== '') {
            // do nothing to test
          } else {
            price=this.currentProduct.salePrice;

          }

        }
      }
      return this.currentProduct?.priceSign?.includes('$') ? `${this.currentProduct.priceSign}${(price)} ` : `${price}${this.currentProduct.priceSign}` ;
    },

    getContents(){
      return this.currentProduct?.contents
    },

    columnView() {
      return this.flyerOrientation === "vertical";
    },

    enabled() {
      return this.pdpEnabled && this.config.mode === 'internal';
    }

  },

  methods: {
    ...mapActions(["setPdpDisplay", "setCurrentProduct"]),
    ...mapActions("shoppingList", ["setAddToList", "setRemoveFromList", "handleFlyerDate"]),
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
      const version = 'v1'
      this.handleFlyerDate(this.flyerDate)
      this.setAddToList({product, additionalItemFlag,version});

    },

    handleRemoveFromList(product) {
      const version = 'v1'
      this.setRemoveFromList({product,version});
    },

    checkProductInSL(product) {
      let item = this.shoppingListV1.filter(function (e) {
        return e.sku == product.sku;
      });
      if (item.length > 0) return true;
      else return false;
    },

    gotoInstaCart(){
      window.open(this.currentProduct.url)
    }
  },

  watch: {
    showPdp(val) {
      if (val) {
        this.$nextTick(() => {
          const detailText = document.querySelector('.content .detail-content')
          if(detailText) {
            detailText.innerHTML = detailText.innerHTML
                .replace(/\s\+/g,'<br>+')
                .replace(/\*\*/g, '<br>**')
                .replace(/(?<!\*)\*(?!\*)/g, '<br>*')
                .replace(/-/g, '&#x2011;')
          }
        })
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

.modal-wpr {
  position: absolute;
  margin-top:-1px;
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
    min-width: 300px;
    max-width: 370px;


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
  }

  .productImageContainer{
    background-color:#eee;
    padding: 5px 0;
    margin-bottom: 10px;
    border: 1px solid darkgray;
    display: flex;
    justify-content: center;
  }
  .productImage {
    // max-height: 60%;
    // max-width: 60%;
    display:flex;
    max-height: 200px;
    max-width: 120px;
  }

  .price {
    display: flex;
    color: #ee3124;
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
    color: #ee3124 !important;
    font-size: 18px;
    margin-top:5px;
  }
  .limit{
    font-weight: 900;
    color: #000;
    font-size: 1.5em;
  }

  .detail {
    font-size: 1.3em;
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

  .daysOnly{
    margin-top:10px;
    font-size: 1.5em;
    font-weight: 900;
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
  display: flex;
}

.shopOptions{
  display: flex;
  flex: 1;
  cursor: pointer;
  border-radius: 5px;
  margin: 10px 5px;
  color: #fff;
  padding: 8px;
  justify-content: center;
  font-weight: normal;
  height:55px;

  &.shopNow{
    background-color: var(--secondary-color);
  }

  &.pdpAddToList {
    background-color: var(--tertiary-color);
  }

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

@media only screen and (max-height: 850px) and (min-width: 1024px) {
  .modal-wpr .modal {
    .content {
      .f-half {
        flex-direction: row !important;
      }

      .content-container {
        width: 308px;

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
    width: 308px;
  }
}
</style>