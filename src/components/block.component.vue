<template>
  <div
    v-if="ready"
    :style="style"
    :class="blockClass"
    :data-savings="savings"
    @click="handleBlockClick"
    @keydown.enter="handleBlockClick"
    tabindex="0"
    v-observe-visibility="{
      callback: visibilityChanged,
      throttle: 50,
      intersection: getObserverOptions(),
    }"
  >
    <div
      v-if="loadImage || isAdPage || isCached"
      :style="{ display: loadImage || isAdPage ? 'block' : 'none' }"
      style="width:inherit; height:inherit"
    >


      <div class="carousel in-block" v-if="isCarousel">
        <carousel
            :perPage=1
            :navigation-enabled="true"
            :navigationClickTargetSize=15.4
            :pagination-size=9
            :pagination-padding="6"
            :autoplay="false"
            :loop="true"
            :mouse-drag="false"
            @navigation-click="navigationHandler"
            v-on:pageChange="pageChange"
            aria-label="carousel"
        >
          <slide> <img :src="productIMG" :width="imgW" :height="imgH" /></slide>
          <slide v-for="(slide,i) in element.carouselBlocks" :key="i" @slideclick="handleSlideClick">
            <img :src="carouselSrc" :width="imgW" :height="imgH" />
          </slide>
        </carousel>
      </div>

      <div
        v-if="isVideo"
        v-show="active"
        style="width:100%;height:100%; background-image:linear gradient(315deg, #d3d3d3 0%, #7f8c8d 74%);"
      >
        <span>
          <video controls autoplay playsinline muted loop id="videoId">
            <source src="videos/Yardworks.mp4" type="video/mp4" />
          </video>
        </span>
      </div>

	    <component v-else-if="isComponent" :is="element.component" :data="element" />
      <!-- img v-if="isAdPage" :src="productIMG" class="image ad" :class="flyerOrientation === 'vertical' ? 'vertical' : ''" / -->
      <product-mask-overlay
        v-else
        :products="element.products"
        :image="imgSrc"
        :isAdPage="isAdPage"
        :width="imgW"
        :height="imgH"
      >
        <img
          v-if="!isCarousel"
          :src="imgSrc"
          :style="imgStyle"
          :alt="ariaLabel"
          :class="{ image: true, ad: isAdPage }"
        />
        <!-- <img v-bind:src="imgSrc" :style="imgStyle" :class="{'image': true, 'ad':isAdPage}" /> -->
      </product-mask-overlay>
      <div class="overlay"></div>
      <div
        v-if="showZoneLabels"
        style="position:absolute;margin:auto;z-index:999;left:0;top:15px;background-color:rgba(0,0,0,0.5);color:white;border:none;font-size:8px;padding:1px;"
      >
        <!-- {{element.id}} -->
        <!-- <span v-for="(z, i) in fileZones()" :key="i">{{z}}</span> -->
        <span>{{ fileZone() }}</span>
        <div v-for="(p, i) in element.products" :key="i">
          [{{ p.sku }} {{ p.mainCategory }} {{ p.subcategory }} {{ p.save }}]
        </div>
      </div>

     <!-- click regions logic for carousels-->
      <div v-if="element.products.length > 0 && !isCarousel">
        <product-component
          :class="showZoneLabels ? 'debug' : ''"
          v-for="(p, i) in element.products"
          :product="p"
          :block="element"
          :key="p.sku + searchResults ? `-search${i}` : `-${i}`"
          :isCarousel="false"
        />
      </div>
      <div v-else>
        <product-component
            :class="showZoneLabels ? 'debug' : ''"
            :product="currentSlide == 0 ? element.products[0] : element.carouselBlocks[currentSlide-1].products[0]"
            :block="element"
            :isCarousel="true"
        />
      </div>
    </div>
  </div>
</template>

<script>
import Velocity from "velocity-animate";
import ProductComponent from "./product.component.vue";
import { mapActions, mapGetters, mapState } from "vuex";
import ProductMaskOverlay from "@/components/ProductMaskOverlay";
import Lytics from "@/classes/Lytics";
import { Carousel, Slide } from 'vue-carousel';
import {getClosestDPI} from "@/store/modules/scale";

// TODO - Move Image, video and carousel block types to their own vue components.

export default {
  components: {
    ProductMaskOverlay,
    ProductComponent,
    Carousel,
    Slide
  },
  props: [
    "element",
    "display",
    "index",
    "unitWidth",
    "unitHeight",
    "device",
    "parent",
    "searchResults",
    "isAdPage",
    "rootScrollContainer",
    "parentColCount",
  ],
  data: function() {
    return {
      active: false,
      hide: 0,
      loadImage: false,
      ready: false,
      isCached: false,
      imgSrc: null,
      pendingImgSrc: null,
      slides:[],
      currentSlide:0
    };
  },
  computed: {
    ...mapGetters('search', ['filteredItems']),
    ...mapGetters('config', ['features']),
    ...mapState(['currentStore', 'apiUrl']),
    ...mapGetters('scale', ['imageDPI']),
    ...mapGetters('screen', ['flyerOrientation', 'displayMode']),
	  ...mapGetters(['highlightResults']),

	  isComponent() {
		  return this.element.type === 'component'
	  },

	  blockClass() {
		  const c = [];
		  if (this.element.image === "pngs/P01S01.png" || this.element.image === "pngs/masthead.png" )c.push("blockMasthead");
		  if (!this.element.isBasebar) c.push("block");
		  if (this.element.isBasebar) c.push("blockBasebar");

		  if(this.element.linkUrl){
			  c.push('clickable');
		  }

		  if(this.isComponent && !this.element.hasOffers && this.element.id === 'triangleRewards_card') {
			  c.push('noOffers');
		  }

		  if (this.useLegalExpansion) c.push('no-pop')

		  return c;
	  },

    ariaLabel(){
	    return this.element.products.reduce((string, product) => {
		    if (product.contents?.length) string += `${product.contents}. `
		    return string
	    }, '')
    },
    isCarousel(){
      return this.element?.carouselBlocks?.length>1 ? true : false;
    },

    showZoneLabels() {
      return window.location.search.includes("zonelabels=1");
    },

    blockWidth() {
      let w = this.unitWidth * this.element.colSpan;

      if (this.isAdPage && this.flyerOrientation == "horizontal") {
        let h = this.unitHeight * this.element.rowSpan;
        let ratio = h / w;
        w = (h + 27) / ratio;
      }
      return w;
    },

    blockHeight() {
      let h = this.unitHeight * this.element.rowSpan;
      if (this.isAdPage && this.flyerOrientation == "horizontal") {
        h += 27;
      }
      return h;
    },

    imgStyle() {
      let w = this.unitWidth * this.element.colSpan;
      let h = this.unitHeight * this.element.rowSpan;

      if (this.highlightResults) {
        if (this.flyerOrientation === "horizontal") {
          w = "auto";
          h = this.parent.flyerDim.height + "px";
        } else {
          w = this.parent.flyerDim.width + "px";
          h = "auto";
        }
      } else if (this.isAdPage) {
				// TODO - Get more definitive height must include real height of base bars if possible (currently a hardcoded value of 27px)
        if (this.flyerOrientation === "horizontal") {
          w = "auto";
          h = `${this.blockHeight}px`;// "100%";
          //h = (h + 27) + 'px';
        } else {
          if (this.displayMode === "mobile") {
            w = this.unitWidth * Math.min(this.parentColCount, this.element.colSpan);
          }
          w = `${w}px`;
          h = "auto";
        }
      } else {
        w = 'calc(100% + 2px)';// `${w}px`;
        h = 'calc(100% + 2px)';
      }

      return {
        width: w,
        height: h,
      };
    },

    carouselSrc(){

      const dpi = this.imageDPI;
      // console.log("DPI is ",dpi)
      const carouselBlocks = this.element.carouselBlocks;
      // console.log("carousel blocks are :", carouselBlocks)
      // console.log("current slide is ",this.currentSlide)
      let images = this.currentSlide == 0 ? this.element.images : carouselBlocks[this.currentSlide-1].images
      // console.log("images are ",images)
      let src = images.find((image)=>{
        return image.resolution == dpi
      })
      if(!src)
        src = images.find((image) => image.resolution > dpi);
       // console.log('returned path is ',src.image)
      return src.image;

    },

	  elementImage(){
		  const dpi = this.imageDPI;
		  const images = this.element.images;
		  return getClosestDPI(dpi, images);
	  },

    productIMG() {
			const ei = this.elementImage;
			return ei?.image || this.element.image;
      /*const images = Object.assign([], this.element.images);

      let src = images.find((item) => {
        return item.resolution == dpi;
      });
      if (!src) {
        src = images.find((image) => image.resolution > dpi);
      }
      return src.image || this.element.image;*/
    },

    isVideo() {
      return this.element.inDesignId == 136337;
    },
    isInTiresCategory() {
      return this.element.products.some(
        (product) =>
          product.subcategory && product.subcategory.toUpperCase() === "TIRES"
      );
    },
    savings() {
      const text = this.element.text;

      if (!text) return null;

      const saving = text.match(/save[0-9]\w+/g);
      if (saving) {
        let val = parseInt(saving[0].match(/[0-9]\w+/g)[0], 10);

        //Snap savings value to increments of 10 to make it easier on saving filter styles
        const isSnap = val % 10;
        if (isSnap) {
          val = val - isSnap;
        }

        return val;
      }
      return null;
    },
    canShowAd() {
      // if(this.flyerOrientation == 'vertical' && this.displayMode != 'mobile'){
      //   return this.element.placement['desktop'].visible && this.element.placement['tablet'].visible;
      // }
      return true;// this.element.placement[this.displayMode].visible;
    },
    imgW() {
      return this.unitWidth * this.element.colSpan;
    },

    imgH() {
      return this.unitHeight * this.element.rowSpan;
    },

	  placement() {
			let pm = this.element.placement[this.displayMode];
			if(this.displayMode === 'desktop' && this.flyerOrientation === 'vertical') {
				pm = this.element.placement['tablet'];
			}
			return pm;
	  },

	  placementOrder: function() {
			return this.placement?.order || 'initial';
		/*  let pl = this.element.placement;
		  // console.log("placement", this.element.image, this.device, pl);
		  if (pl && pl[this.device]) return pl[this.device].order;
		  return "initial";*/
	  },

    style() {
      let s = {
        gridColumn: `span ${this.element.colSpan}`,
        gridRow: `span ${this.element.rowSpan}`,
        order: `${this.placementOrder}`,
        display: 'block'// `${this.canShowAd ? "block" : "none"}`,
      };

      if (this.parent.name === "search_results") {
        delete s.order;
      }

      if (!this.isAdPage) {
        s.width = `${this.blockWidth}px`;
	      s.height = `${this.blockHeight}px`;
      }

      return s;
    },
  },

  mounted() {
    this.ready = true;
    this.updateImage();
    //this.element.moveTo = this.moveElementTo;
    //this.element.hide = this.hideElement;
    //this.element.show = this.showElement;
    //this.element.hide1 = () => this.hide++;
    //this.element.show1 = () => this.hide--;
    //Test Auto Build #2
  },
  methods: {
    ...mapActions([
      "setPdpDisplay",
      "setCurrentProduct",
      "toggleHamburgerMenu",
    ]),

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
      return this.currentSlide

    },


    getObserverOptions() {
      return {
        root: document.getElementById(this.rootScrollContainer),
        rootMargin: "100%",
      };
    },

    getProdImg(dpi) {
      const images = this.element.images;
      let src = images.find((item) => {
        return item.resolution == dpi;
      });
      if (!src) {
        src = images.find((image) => image.resolution > dpi);
      }
      return `pngs/${src.image || this.element.image}`;
    },

    handleSlideClick (dataset) {
      console.log("Slide click info ",dataset.index, dataset.name)
    },

    updateImage() {
      if(this.isCarousel){
        this.imgSrc = this.carouselSrc
        return
      }

      if (this.loadImage) {
        this.imgSrc = this.productIMG;
      } else {
        this.pendingImgSrc = this.productIMG;
      }
    },

    /*imgStyle: function () {
      var s = { width: "100%", height: "100%", transition: "0.2s all" };
      if (this.element.isBasebar)
        s = { ...s, objectFit: "contain", objectPosition: "top", top: "5px" };
      return s;
    },*/
    heightForBasebar: function() {
      if (this.element.isBasebar) return { height: "20px" };
    },
    fileZone: function() {
      var n = this.element.name;
      if (!n) return "[Zone]";
      var matched = n.match(/(\[.*\]+)/);
      if (!matched) return "[Zone]";
      return matched[1];
    },
    visibilityChanged: function(isVisible) {
      //let currentElement = this.element

      this.loadImage = isVisible;
      //let productList = currentElement.products

      // called whenever the block is intercepted with the browser's viewport
      if (isVisible) {
        this.isCached = true;
        if (this.pendingImgSrc && this.imgSrc != this.pendingImgSrc) {
          this.imgSrc = this.pendingImgSrc;
          this.pendingImgSrc = null;
        }
        if (process.env.NODE_ENV === "development") {
          //console.log('element impression:', currentElement.id)
        }
        /* TODO: uncomment when analytics is ready
          // check if this is a particular product impression (TODO: make this a computed property or method we can call since it happens elsewhere)
          if ( Array.isArray(productList) && productList.length > 0 ) {
            let currentProduct = productList[0]

            window.rudderanalytics.track('ProductImpression', {
              productCategory: currentProduct.mainCategory || null,
              prodctSubcategory: currentProduct.subcategory || null,
              sku: currentProduct.sku || null,
              regularPrice: currentProduct.regularPrice || null,
              salePrice: currentProduct.salePrice || null,
              discountRate: currentProduct.save || null,
              flyerID: currentElement.flyerId,
              promotionID: currentElement.id,
              category: 'FlyerImpressions'
            })
          } else {
            console.log('MiscFlyerBlockImpression', {
              flyerID: currentElement.flyerId,
              promotionID: currentElement.id,
              category: 'FlyerImpressions'
            })
          }
*/
      }
    },

    handleBlockClickOld: function() {
      // ad link clicked
      if (this.element.linkUrl) {
        // record the event for analytics
        /*
        window.rudderanalytics.track('ExternalAdClick', {
          linkURL: this.element.linkUrl,
          flyerID: this.element.flyerId,
          promotionID: this.element.id,
          category: 'FlyerClicks'
        })
        */

        // open the link
        window.open(this.element.linkUrl);

        // TODO: this condition needs to be refactored. temporarily in place for super c pdp development
      } else if (!this.features.pdp) {
        // this code block is for super C
        this.setCurrentProduct(this.element.products[0]);
        this.toggleHamburgerMenu(false);
      } else if (!this.isVideo) {
        // ecomm clicked
        //I don't believe this is still done here....
        if (this.isInTiresCategory) {
          let automotiveURL = `http://www.canadiantire.ca/${
            this.currentStore.bilingual ? "fr" : "en"
          }/automotive/tires-wheels/tires.html`;

          // record the event for analytics
          /*
          window.rudderanalytics.track('TireAdClick', {
            linkURL: automotiveURL,
            flyerID: this.element.flyerID,
            promotionID: this.element.id,
            category: 'FlyerClicks'
          })
          */

          // the actual business logic to perform here
          window.parent.postMessage(
            window.JSON.stringify({
              type: "ITEM_POP",
              item: {
                url: automotiveURL,
                flyerTypeNameIdentifier: "flyer",
              },
            }),
            "*"
          );
          // click on a specific flyer box
        } else {
          // reference to the thing that was clicked on (if it was a product)
          let productList = this.element.products;

          // make sure it is an array that is not empty
          if (Array.isArray(productList) && productList.length > 0) {
            let currentProduct = productList[0];
            // handle case where this is actually an ad for a product for analytics
            /*
            window.rudderanalytics.track('FlyerClick', {
              productCategory: currentProduct.mainCategory || null,
              prodctSubcategory: currentProduct.subcategory || null,
              sku: currentProduct.sku || null,
              regularPrice: currentProduct.regularPrice || null,
              salePrice: currentProduct.salePrice || null,
              discountRate: currentProduct.save || null,
              flyerID: this.element.flyerId,
              promotionID: this.element.id,
              category: 'FlyerClicks'
            })
            */

            // this is the actual business logic that needs to be performed here
            if (currentProduct.sku) {
              window.parent.postMessage(
                window.JSON.stringify({
                  type: "ITEM_POP",
                  item: {
                    sku: currentProduct.sku,
                    flyerTypeNameIdentifier: "flyer",
                  },
                }),
                "*"
              );
            }
            /* eslint-disable */
            if (typeof applicationInterface !== "undefined") {
              applicationInterface.callFromMobileApplication(
                currentProduct.sku
              );
            }
            if (typeof webkit !== "undefined") {
              webkit.messageHandlers.callFromMobileApplication.postMessage(
                currentProduct.sku
              );
            }
            /* eslint-enable */
            // handle clicks of other weird stuff that isn't directly related to a product
          } else {
            // click of an unknown type for analytics, remove if it is useless/noisy to track
            /*
            window.rudderanalytics.track('MiscPromotionClick', {
              flyerID: this.element.flyerId,
              promotionID: this.element.id,
              category: 'FlyerClicks'
            })
           */
          }
        }
      } else {
        // video is clicked
        /*
        window.rudderanalytics.track('VideoClick', {
          flyerID: this.element.flyerId,
          promotionID: this.element.id
        })
        */
        document.getElementById("videoId").play();
        this.active = !this.active;
      }
    },

    // TODO: refactor this to more cleanly separate the analytics handling from business logic
    handleBlockClick: function() {
      // ad link clicked
      if (this.element.linkUrl) {
        Lytics.TriggerExternalAdClick({
          linkURL: this.element.linkUrl,
          flyerID: this.element.flyerId,
          promotionID: this.element.id,
          category: "FlyerClicks",
        });
        window.open(this.element.linkUrl);
      } else if (this.features.pdp) {
        // this code block is for super C
        //  console.log("inside block", this.element.products[0])

        if (this.element.products[0].sku && !this.isCarousel) {
          this.setCurrentProduct(this.element.products[0]);
          // this.setPdpDisplay(true);
        }
      }
    },
    stopVideo: function() {
      if (!this.isVideo) return;
      document.getElementById("videoId").play();
      this.active = !this.active;
    },
    mouseleave: function() {
      this.active = !this.active;
      this.$refs.active.focus();
    },
    getClass: function() {
      if (this.isCarousel) return 'block no-scale'
      if (this.element.image === "pngs/P01S01.png" || this.element.image === "pngs/masthead.png")
        return "blockMasthead";
      if (!this.element.isBasebar) return "block";
      if (this.element.isBasebar) return "blockBasebar";

    },
    getImagePath: function() {
      return `pngs/${this.element.image}`;
    },
    moveElementTo: function(x, y, animate) {
      let that = this;
      // console.log("move element to");
      if (!animate) {
        this.element.left = x;
        this.element.top = y;
        this.style.left = `${x}px`;
        this.style.top = `${y}px`;
        return Promise.resolve({ element: this.element, left: x, top: y });
      }
      return new Promise((res) => {
        Velocity(
          this.$el,
          { left: `${x}px`, top: `${y}px` },
          {
            complete: function() {
              that.element.left = x;
              that.element.top = y;
              // console.log(`block left and top ${x} ${y}`);
              res({ element: that.element, left: x, top: y });
            },
          }
        );
      });
    },
    hideElement: function(animate) {
      this.hide++;
      //  console.log('element hide',this.element,this.hide);
      // if(this.hide<0)
      //   return Promise.resolve(true);
      return this.toggleVisibilityWithPromise(
        this.$el,
        { opacity: 0 },
        animate,
        false,
        true
      );
    },

    showElement: function(animate) {
      // let transform = `translate(0,0) scale(${this.element.widthAdjustment},${this.element.heightAdjustment})`;
      this.hide--;
      // console.log('element show',this.element,this.hide);
      // if(this.hide>0)
      //   return Promise.resolve(false);
      return this.toggleVisibilityWithPromise(
        this.$el,
        { opacity: 1 },
        animate,
        true,
        false
      );
    },
    toggleVisibilityWithPromise: function(
      el,
      prop,
      animate,
      completionValue,
      post
    ) {
      //   console.log('toggleVisibility',this.index);
      if (!animate) {
        //console.log('without animation',this.index);
        this.style = { ...this.style, ...prop };
        this.element.visible = completionValue;
        this.$set(this.style, "display", completionValue ? "block" : "none");
        return Promise.resolve(this.element);
      }
      console.log("this shouldnt execute");
      return new Promise((res) => {
        console.log("toggleVisibility Promise", this.index);
        if (!post)
          this.$set(this.style, "display", completionValue ? "block" : "none");
        try {
          Velocity(el, prop, {
            easing: "easeInCubic",
            complete: () => {
              console.log("complete callback for: ", this.index);
              this.element.visible = completionValue;
              if (post)
                this.$set(
                  this.style,
                  "display",
                  completionValue ? "block" : "none"
                );
              res(null);
            },
          });
        } catch (ex) {
          console.error(ex);
        }

        //console.log(rej);
      });
    },
  },
  watch: {

    productIMG() {
      this.updateImage();
    },
  },
};
</script>

<style lang="scss">
.carousel {
  .VueCarousel {
    .VueCarousel-pagination {
      z-index: 1000;
      margin-top: -50px !important;
      position: relative !important;
    }
  }
}

.carousel {
  .VueCarousel {
    .VueCarousel-navigation {
      .VueCarousel-navigation-prev{
        margin-top: 135px !important;
        margin-left: 25px !important;
        z-index:1100;
        opacity : 0.4;
        font-size: 0;
        padding:15.4px !important;
        -webkit-backface-visibility: hidden;
        -ms-transform: translateZ(0); /* IE 9 */
        -webkit-transform: translateZ(0); /* Chrome, Safari, Opera */

        &:hover {
          opacity: 1;
        }

      }
      .VueCarousel-navigation-next{
        margin-top: 135px !important;
        margin-right: 25px !important;
        z-index:1100;
        opacity: 0.4;
        font-size: 0;
        padding:15.4px !important;
        -webkit-backface-visibility: hidden;
        -ms-transform: translateZ(0); /* IE 9 */
        -webkit-transform: translateZ(0); /* Chrome, Safari, Opera */



        &:hover {
          opacity: 1;
        }
      }
    }
    .VueCarousel-pagination{
      .VueCarousel-dot-container{
        -webkit-backface-visibility: hidden;
        -ms-transform: translateZ(0); /* IE 9 */
        -webkit-transform: translateZ(0); /* Chrome, Safari, Opera */
      opacity:0.4;

          &:hover {
          opacity: 1;
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
        .VueCarousel-navigation-prev {
          margin-top: 120px !important;
          margin-left: 25px !important;
          padding:24px !important;
        }
        .VueCarousel-navigation-next {
          margin-top: 120px !important;
          margin-right: 25px !important;
          padding:24px !important;
        }
      }
      .VueCarousel-pagination{
        .VueCarousel-dot-container{
          .VueCarousel-dot{
            width: 12px !important;
            height:12px !important;
          }
        }
      }
    }
  }
}
</style>

<style scoped lang="scss">
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
	width: 100%;
	height: 100%;
	object-fit: cover;
}


.carousel {
  z-index: 100;
  position: absolute;
  touch-action: none;
}


.carousel.in-block,
.carousel.in-block > *,
.carousel.in-block > * > * {
  width: 100%;
  height: 100%;
}

.block .image.ad {
  height: 100%;
  width: auto;
}
.block .image.ad.vertical {
  height: auto;
  width: 100%;
}

//.block:not(.no-scale):hover,
//.block:not(.no-scale):focus{
//  transform: scale(1.02);
//  box-shadow: 0 0px 50px rgba(0, 0, 0, 0.3);
//}

.block:hover,
.block:focus{
  transform: scale(1.02);
  box-shadow: 0 0px 50px rgba(0, 0, 0, 0.3);
}

.block:focus {
  outline: none;
}

.block:hover .image {
  /* transform: scale(1.02); */
  /* box-shadow: 0 0px 50px rgba(0, 0, 0, 0.3); */
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
.block:hover .overlay {
  /* transform: scale(1.02); */
}
.block:hover {
  z-index: 99;
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
