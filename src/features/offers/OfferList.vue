<template>
  <div class="offer-list">
    <slot />
    <offer-list-item
        v-for="item in items"
        :key="item.sku"
        :item-data="item"
    />
  </div>
</template>

<script>

import OfferListItem from "@/features/offers/OfferListItem.vue";

export default {
  name: "OfferList",
  components: {OfferListItem},
  props: {
    items: {
      type: Array,
      default:  () => []
    }
  }
}
</script>

<style lang="scss" scoped>
  .offer-list {
    display: flex;
    flex-wrap: wrap;
    column-gap: 0.5em;
    row-gap: 0.5em;

    .offer-list-item{
      transition: transform 0.2s, box-shadow 0.2s;
      &:hover{
        transform: scale3d(1.1,1.1,1);
        z-index: 100;
        box-shadow: 0 0 50px rgb(0 0 0 / 30%);
      }
    }

    &.disabled .offer-list-item {
      filter: blur(1.5em);
      pointer-events: none;
    }

  }
</style>
