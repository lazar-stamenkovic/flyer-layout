<template>
    <div class="product-container" tabindex="0" @keypress.enter="productClicked">
      <p class="sr-only">{{ getProductVersion }}</p>
      <p class="sr-only">
        <span v-if="product.priceQuantity">{{ product.priceQuantity || '' }}/</span>
        <span v-if="product.salePrice">{{ product.salePrice | currency }}</span>
        <span v-if="product.promoUnitFr">{{ product.promoUnitFr }}</span>
      </p>
      <div
          class="click-region"
          v-for="r in product.clickRegions"
          :key="r.sku"
          :style="getRegionStyle(r)"
          @click.stop="productClicked"
          :aria-label="r.contents"
      >
        <img src="/images/play_button.svg" :class="sku === 'playtc' || sku === 'play' ? 'front' : ''" v-if="sku === 'playtc' || sku === 'play'">

      </div>
    </div>
</template>
<script>
import { mapActions, mapGetters, mapState } from "vuex";
//import SuperCParent from "@/classes/SuperCParent";
import Lytics from "@/classes/Lytics";
import moment from "moment";
//import { getUrlParameter } from "../utils";

export default {
	name:"productComponentOverlay",
  props: {
    product: {
      type: Object,
      default: () => {
        return {};
      }
    },
    block: {
      type: Object
    },
    isCarousel: {
      type: Boolean
    }
  },
  computed:{
    ...mapGetters('config', ['features','branding']),
    ...mapGetters('landingPage', ['currentFlyer']),
    ...mapState(['currentProduct','currentPageNumber']),
    ...mapState('shoppingList',['shoppingList']),
    ...mapGetters(['currentZone', "language"]),
    zones() {
      return this.block.zones || [];
    },
    sku (){
      return (this.product.sku || '').toLowerCase().trim();
    },
    getProductVersion(){
      return this.$route.query['language'] === 'en' ? this.product.productEn : this.product.productFr;
    }
  },
  methods: {
    ...mapActions(['setCurrentVideo', 'toggleHamburgerMenu','toggleSideBarState']),
    ...mapActions(['setPdpDisplay','setCurrentProduct']),
	  ...mapActions("pdp",{openPDP:"open", closePDP:"close"}),
    getRegionStyle: function (r) {
      if(!this.isCarousel)
      return {
        left: `${r.left - 1}%`,
        top: `${r.top - 1}%`,
        width: `${r.width + 2}%`,
        height: `${r.height + 2}%`,
        display: 'flex',
        alignItems : 'center',
        justifyContent: 'center',
      };
      else{

        return {
          left: `${r.left - 1}%`,
          top: `${r.top - 1}%`,
          width: `${r.width + 2}%`,
          height: `${r.height - 9 > 0 ? r.height-9 : 2}%`,
        };
      }
    },
    productClicked() {
      //  console.log('Product Clicked!', this.product)
      const sku = this.sku;// (this.product.sku || "").trim();
      Lytics.TriggerTileClick(
        sku,
        this.product.productEn || this.product.productFr,
        this.product.bodyEn ||
          this.product.bodyFr ||
          this.product.description ||
          this.product.productEn ||
          this.product.productFr,
        this.product.productBlockId,
        {
          zone: this.currentZone,
        }
      );
      if (sku && sku === "playtc") {
        this.setCurrentVideo(`${this.product.url}${this.branding.accessKey}`);
        return;
      }
      if (sku && sku === "play") {
        this.setCurrentVideo(this.product.url);
        return;
      }

      if (this.features.pdp && sku !== "play" && sku !== "url") {
        //this.setCurrentProduct(this.product);
        //this.setPdpDisplay(false);
        this.toggleSideBarState(false);
				this.openPDP(this.product);
        /*SuperCParent.ShowPDP(sku, {
          publicationId: this.currentFlyer.id,
          flyerId: this.currentFlyer.flyerId,
          dealNumber: this.currentFlyer.title,
          productBlockId: this.product.productBlockId,
          offerType: "Generic",
          productEn: this.product.productEn,
          productFr: this.product.productFr,
          mainCategoryEn: this.product.mainCategoryEn,
          mainCategoryFr: this.product.mainCategoryFr,
          subCategoryEn: this.product.subCategoryEn,
          subCategoryFr: this.product.subCategoryFr,
          description: this.product.description,
          productImage: this.product.productImage,
          salePrice: this.product.salePrice,
          regularPrice: this.product.regularPrice,
          alternatePriceFr: this.product.alternatePriceFr,
          alternatePrice: this.product.alternatePrice,
          promoUnitFr: this.product.promoUnitFr,
          priceQuantity: this.product.priceQuantity,
          pageNumber: this.currentPageNumber,
          savingsFr: this.product.savingsFr,
          savingsPrefix: this.product.savingsPrefix,
          savingsSuffix: this.product.savingsSuffix,
          bodyEn: this.product.bodyEn,
          bodyFr: this.product.bodyFr,
          content: this.product.contents,
          validFrom: this.validity("from"),
          validTo: this.validity("to"),
          itemInSL: this.checkProductInSL(sku),
        });*/

        return;
      } else if (sku && sku !== "url") {
	      this.openPDP(this.product);
        /*SuperCParent.ShowPDP(sku, {
          publicationId: this.currentFlyer.id,
          flyerId: this.currentFlyer.flyerId,
          dealNumber: this.currentFlyer.title,
          productBlockId: this.product.productBlockId,
          offerType: "Generic",
          productEn: this.product.productEn,
          productFr: this.product.productFr,
          mainCategoryEn: this.product.mainCategoryEn,
          mainCategoryFr: this.product.mainCategoryFr,
          subCategoryEn: this.product.subCategoryEn,
          subCategoryFr: this.product.subCategoryFr,
          description: this.product.description,
          productImage: this.product.productImage,
          salePrice: this.product.salePrice,
          regularPrice: this.product.regularPrice,
          alternatePrice: this.product.alternatePriceFr,
          promoUnitFr: this.product.promoUnitFr,
          priceQuantity: this.product.priceQuantity,
          savingsFr: this.product.savingsFr,
          savingsPrefix: this.product.savingsPrefix,
          savingsSuffix: this.product.savingsSuffix,
          bodyEn: this.product.bodyEn,
          bodyFr: this.product.bodyFr,
          content: this.product.contents,
          validFrom: this.validity("from"),
          validTo: this.validity("to"),
          itemInSL: this.checkProductInSL(sku),
        });*/

        /* eslint-disable */
        if (typeof applicationInterface !== "undefined") {
          applicationInterface.callFromMobileApplication(sku);
          return;
        }
        if (typeof webkit !== "undefined") {
          webkit.messageHandlers.callFromMobileApplication.postMessage(sku);
        }
        /* eslint-enable */
      }
      if (this.product.url && sku !== 'play') {
        window.open(this.product.url)
        Lytics.TriggerExternalAdClick({
          linkURL: this.product.url,
          flyerID: this.currentFlyer.flyerId,
          category: "FlyerClicks",
        })
        this.setPdpDisplay(false)
        this.toggleHamburgerMenu(false)
        return
      }
    },
    validity(param) {
      const date =
        param == "from"
          ? moment.utc(this.currentFlyer.startDate)
          : moment.utc(this.currentFlyer.endDate);
      if (this.language === "en") {
        // return `${date.format('MMMM D, YYYY')}`;
        return `${date.format("YYYY-MM-DD")}`;
      } else {
        return `${date
          .format("YYYY-MM-DD")
          .replace(
            "1er",
            '1<sup style="vertical-align: top; font-size: 8px;">er</sup>'
          )}`;
      }
    },
    checkProductInSL(sku) {
      return this.shoppingList.some((listItem) => listItem.sku == sku);
    },
  },
};
</script>
<style scoped>
.product-container {
  /* position: absolute; */
  z-index: 99;
  /* top:0;
    left:0;
    right:0;
    bottom:0;
    pointer-events: none; */
  overflow: hidden;
}

.product-container.debug .click-region {
  border: dashed orange 2px;
  box-shadow: 1px 1px 4px 2px;
}

.product-container .click-region {
  cursor: pointer;
}

.product-container:hover .click-region,
.product-container:focus .click-region {
  background-color: rgba(0, 0, 0, 0.1);
  outline: none;
  /* background-color: rgba(255,255,255,0.3); */
}

.click-region {
  /* background-color: rgba(255,255,255,0.5); */
  cursor: pointer;
  position: absolute;
  z-index: 999;
  border-radius: 3px;
  transition: 0.2s all;
  /* mix-blend-mode: soft-light; */
}

.click-region .front{
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
</style>
