<template>
  <div class="product-list-item">
    <div class="product-image" :style="imgStyle"></div>
    <div class="product-details">
      <div class="product-label">{{ name }}</div>
      <div class="product-sub-details">
        <div class="product-metrics">
          <span>{{ altPrice }}</span>
        </div>
        <div class="product-price highlight">${{ price }}</div>
      </div>
      <div class="product-valid-to">{{ validTo }}</div>
    </div>
  </div>
</template>

<script>
import moment from "moment";

export default {
  name: "ProductListItem",
  props: {
    itemData: {
      type: Object
    }
  },
  computed: {
    price() {
      return this.itemData?.product?.salePrice || this.itemData?.product?.regularPrice;
    },
    altPrice() {
      return this.itemData?.product?.alternatePrice || this.itemData?.product?.alternatePriceFr;
    },
    name() {
      return this.itemData?.product?.product || this.itemData?.product?.productEn;
    },
    imgStyle() {
      return {
        backgroundImage: `url(${this.itemData?.product?.productImage})`
      }
    },
    validTo() {
      const vd = this.itemData?.product?.validTo;
      if(vd) {
        const m = moment(vd);
        return 'Valid until ' + m.format('MMM D, YYYY')
      }
      return null;
    }
  }
}
</script>

<style lang="scss" scoped>
  .product-list-item {
    display: flex;
    column-gap: 1em;
    font-size: 0.9em;
    .product-image {
      width: 5em;
      height: 5em;
      border: solid 1px #aeaeae;
      background-repeat: no-repeat;
      background-size: contain;
      background-position: center;
      flex-basis: 5em;
      flex-grow: 0;
      flex-shrink: 0;
    }
    .product-details {
      flex-grow: 1;
      display: flex;
      flex-direction: column;
      row-gap: 0.3em;
      justify-content: space-evenly;
      .product-sub-details {
        display: flex;
        color: #BBBBBB;
        > *{
          flex-grow: 1;
        }
        .product-price {
          text-align: right;
        }
        .product-metrics {

        }
      }
      .product-valid-to {
        text-align: right;
        font-size: smaller;
      }
    }
    border-bottom: solid 1px #bbbbbb;
    padding-bottom: 0.56em;
  }
</style>