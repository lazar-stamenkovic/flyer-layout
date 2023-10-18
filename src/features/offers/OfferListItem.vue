<template>
  <div :class="`offer-list-item ${mode} ${priceMode} ${isFake? 'fake':''}`" @click.stop="onClicked">
    <div class="prod-image">
      <div v-if="mode === 'horizontal'">
        <img v-if="brand" class="brand" :src="`/images/test/${brand}.png`" alt=""/>
      </div>
      <div class="image" :style="(isLoaded)?`background-image:url('${imgSrc}')`: null">
        <svg v-if="showLoader" class="image-load-busy" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="20 50 24 28">
            <rect x="20" y="50" width="4" height="10" fill="#fff">
              <animateTransform attributeType="xml"
                                attributeName="transform" type="translate"
                                values="0 0; 0 20; 0 0"
                                begin="0" dur="0.6s" repeatCount="indefinite"/>
            </rect>
          <rect x="30" y="50" width="4" height="10" fill="#fff">
              <animateTransform attributeType="xml"
                                attributeName="transform" type="translate"
                                values="0 0; 0 20; 0 0"
                                begin="0.2s" dur="0.6s" repeatCount="indefinite"/>
            </rect>
          <rect x="40" y="50" width="4" height="10" fill="#fff">
              <animateTransform attributeType="xml"
                                attributeName="transform" type="translate"
                                values="0 0; 0 20; 0 0"
                                begin="0.4s" dur="0.6s" repeatCount="indefinite"/>
            </rect>
        </svg>
      </div>
    </div>
    <div class="details" :mode="priceMode">
      <div v-if="priceMode === 'normal' " class="savings">{{ content.offers.save }}<br/><span>{{ savings }}<sup>%</sup></span></div>
      <div v-if="priceMode === 'special-buy'" class="savings"><img class="red-tag" :src="content.offers.special_buy_img" :alt="content.offers.special_buy" /><span>{{ salePrice | c_dollars }}<sup>{{ salePrice | c_cents }}</sup></span></div>
      <div v-if="priceMode ==='great-value'" class="savings"><img class="red-tag" :src="content.offers.great_value_img" :alt="content.offers.great_value" /><span>{{ salePrice | c_dollars }}<sup>{{ salePrice | c_cents }}</sup></span></div>
      <div class="price-desc">
        <div v-if="priceMode === 'normal'" class="sale-price">{{ content.offers.sale }} {{ salePrice | c_currency }}</div>
        <div v-if="priceMode === 'normal'" class="price">{{ content.offers.reg }} {{ price | c_currency }}</div>
        <div class="desc" >{{ clipDesc }}<img v-if="showMoreIcon" v-tooltip="{content: desc}" class="drop-down-icon"  src="/icons/drop-down-button.svg" alt=""></div>
        <div class="sku">{{ sku }}</div>

      </div>
      <img class="brand" v-if="mode === 'vertical' && brand" :src="`/images/test/${brand}.png`" alt=""/>

    </div>
    <div class="special-buy-tag" v-if="priceMode === 'special-buy'">{{ content.offers.while_quant }}</div>
  </div>
</template>

<script>

import {mapGetters} from "vuex";
import CTParent from "@/features/offers/classes/CTParent";
import blockElementMixin from "@/mixins/blockElementMixin";
//H 30
//V 21

const PM_SPECIAL_BUY = 'special-buy';
const PM_GREAT_VALUE = 'great-value';
const PM_NORMAL = 'normal';
const PM_ABNORMAL = 'abnormal';

const clipText = (txt, maxlen) => {
  let t = (txt || '').trim();
  if(t.length > maxlen) {
    let se = maxlen;
    if(t.charAt(maxlen) !== ' ') {
      se = t.lastIndexOf(' ', maxlen);
    }
    t = t.slice(0, se);
  }
  return t.trim();
}

export default {
  name: "OfferListItem",
  mixins:[blockElementMixin],
  props: {
    blockData: {
      type: Object,
      default: () => {
        return {
          componentData: {
            "sku": "0529349",
            "zone": "0",
            "price": "11",
            "salePrice": "8",
            "savings": "20",
            "desc": "Place holder product",
            "imageUrl": "https://s7d5scene7com/is/image/CanadianTire/TR_A_AutoLubeAndPenetrants_TriApp_ENG?wid=300&qlt=100"
          }
        }
      }
    }
  },
  filters: {
    c_dollars: (value) => {
      if(!value) return '';
      return parseInt(value);
    },
    c_cents: (value) => {
      if(!value) return '';
      return (value % 1).toFixed(2).split('.')[1];
    },
    c_currency: (value) => {
      return Number(value).toFixed(2);
    }
  },
  data() {
    return {
      prodImage: null,
      loadError: false,
      isLoaded: false,
      domImg: new Image()
    }
  },
  created() {
    this.domImg.addEventListener('load', () => {
      this.loadError = false;
      this.isLoaded = true;
      this.prodImage = this.domImg;
    });
    this.domImg.addEventListener('error', () => {
     console.log('Image Load Error:', this.domImg.src);
     this.loadError = true;
     this.isLoaded = true;
   })

   // console.log('Image Props:', this.domImg)
  },
  mounted() {
    if(this.hasImage){
      this.domImg.src = this.imgSrc;
    } else {
      this.loadError = true;
      this.isLoaded = true;
    }

  },
  computed: {
    ...mapGetters(['content']),
    ...mapGetters('scale', ['imageDPI']),
    itemData() {
      return this.blockData.componentData;
    },
    savings() {
      return Number(this.itemData.savings);
    },
    price() {
      return Number(this.itemData.retailPrice);
    },
    salePrice() {
      return Number(this.itemData.promoPrice);
    },
    desc() {
      return (this.itemData.desc || '').trim();
    },
    clipDesc() {
      return clipText(this.desc, this.mode === 'horizontal'? 20:55);
    },
    showMoreIcon() {
      return this.desc.length > this.clipDesc.length;
    },
    sku() {
      return this.itemData.sku
    },
    mode() {
      if (this.prodImage) {
        const {naturalWidth: w, naturalHeight: h} = this.prodImage;
        if (w > h) return 'horizontal';
      }
      return 'vertical';
    },

    brand() {
      return this.itemData.brandLogo;
    },
    imgScale() {
      return this.imageDPI / 150; //setting 150 as base scale
    },

    hasImage() {
      const url = (this.itemData.imageUrl || '');
      return !(url.includes('notfound') || url.includes('no_image'));
    },

    imgSrc() {
      //TODO - Tie imwidth to zoom somehow
      return this.loadError || !this.hasImage ? '/icons/triangle-icon.svg': this.itemData.imageUrl + "?imwidth=200";// + Math.round( 200 * this.imgScale);
    },

    showLoader() {
      return !this.prodImage && !this.loadError;
    },

    isSpecialBuy() {
      return !!this.sku.match(/(^[0-9]99)\w+/g);
    },

    isGreatValue() {
      return !this.savings && !this.isSpecialBuy;
    },

    priceMode() {
      if(this.isSpecialBuy) return PM_SPECIAL_BUY;
      if(this.isGreatValue) return PM_GREAT_VALUE;
      if(parseInt(this.savings, 10) && this.price) return PM_NORMAL;
      return PM_ABNORMAL;
    },

    isFake() {
      return this.itemData.isFake;
    }
  },
  methods: {
    onClicked() {
      CTParent.ShowPDP(this.itemData.sku, {'offerType': 'Triangle Rewards'});
    }
  }/*,
  watch: {
    imageDPI() {
      if(this.hasImage){
        this.prodImage = null;
        this.domImg.src = this.imgSrc;
      }
    }
  }*/
}
</script>

<style lang="scss" scoped>

/*.column-view {
  .offer-list-item {
    flex: 1 0 calc(25% - 0.6em);
    width: auto;
  }
}*/

.offer-list-item {
  background-color: #fff;
  --red-color: #ff2e17;
  font-family: CTEastman;
  display: inline-block;
  /*border: solid 1px #AEAEAE;*/
  padding: 0.5em;
  width: inherit; /*16em;*/
  height: inherit; /*calc(16em * 0.8235);*/
  line-height: 1.2em;
  cursor: pointer;
  position: relative;

  &.fake{
    filter: blur(10px);
    pointer-events: none;
  }


  > * {
    flex: 1 1 0;
  }

  .brand {
    max-height: 1.45em;
  }

  .image {
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center;
    height: 100%;
    position: relative;
    .image-load-busy {
      width: 1.5em;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      filter: drop-shadow(1px 1px 1px black);
      > :first-child {
        fill: #EB2227;
      }
      > :nth-child(2) {
        fill: #83142F;
      }
      > :last-child {
        fill: #78CCC7;
      }
    }
  }

  .details {
    display: flex;
    align-items: flex-end;
    column-gap: 0.35em;
    position: relative;

    .desc {
      position: relative;
      font-family: CTEastmanCondensed-Medium;
      /*white-space: nowrap;
      span {
        display: inline-block;
        white-space: break-spaces;
      }*/
      .drop-down-icon {
        width: 1em;
        margin-left: 0.2em;
        position: absolute;
        bottom: 0.2em;
      }
      /*overflow: hidden;
      text-overflow: ellipsis;
      max-height: 2.4em;*/
    }
  }

  .savings, .sale-price {
    color: var(--red-color);
    font-weight: bold;
    font-family: CTEastmanCompressed-Bold;
  }

  .sale-price {
    font-size: 1.1em;
    font-family: CTEastmanCondensed-Bold;
  }

  .price {
    font-weight: bold;
    color: #4c4c4c;
    font-family: CTEastmanCondensed-Bold;
  }

  .sku {
    font-size: 0.8em;
    font-family: CTEastmanCondensed-Medium;
  }

  .savings {
    font-size: 1.25em;
    text-transform: uppercase;
    > span {
      font-size: 2.5em;
      line-height: 0.35em;
    }
  }

  sup {
    font-size: 0.5em;
  }

  &.horizontal {
    display: flex;
    flex-direction: column;
    row-gap: 0.2em;
    .price, .sale-price {
      display: inline-block;
    }

    .sale-price {
      margin-right: 0.3em;
    }

    .desc {
      white-space: nowrap;
      width: 10.5em;
    }

    .prod-image {
      display: flex;
      flex-direction: column;
      flex-basis: 100%;
    }
  }

  &.vertical {
    display: flex;
    flex-direction: row-reverse;
    column-gap: 0.3em;

    .prod-image .image {
      height: 100%;
    }

    .details {
      flex-direction: column;
      align-items: flex-start;
      justify-content: end;

      .brand {
        position: absolute;
        top: 0;
        left: 0;
      }
    }
  }

  .special-buy, .great-value {
    background-color: var(--red-color);
    color: #fff;
    font-size: 0.7em;
    padding: 0.2em 0.5em;
    margin-bottom: 0.3em;
    text-align: center;
    white-space: nowrap;
    text-transform: uppercase;
    font-style: italic;
    position: relative;
    border: none;
    &:after {
      content:"";
      position: absolute;
      left: 100%;
      top:0px;
      width:0px;
      height:0px;
      border-top:1em solid transparent;
      border-left:1em solid var(--red-color);
      border-bottom:0.8em solid transparent;
    }
  }


  &.special-buy {
    padding-bottom: 1em;
  }
  .special-buy-tag {
    position: absolute;
    width: 100%;
    bottom: 0;
    font-size: 0.8em;
    left: 0;
    text-align: center;
  }

  img.red-tag {
    width: 4em;
    margin-bottom: 0.1em;
  }

}


</style>
