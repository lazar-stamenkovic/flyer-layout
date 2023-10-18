<template>
  <div class="adv-list">
	  <div
			  v-for="(item, index) in items"
			  :key="`adv-list-${index}`"
	  >
		  <adv-titled-list
				  class="sub-menu"
				  v-if="item.subItems"
				  :title="item"
				  :items="item.subItems"
				  :collapsable="true"
				  :is-collapsed="true"
				  :enable-toggle-all="true"
				  @select="$emit('select', $event)"
		  />
		  <adv-list-item
				  v-else
				  :item-data="item"
				  @select="$emit('select', $event)"
		  />

	  </div>

  </div>
</template>

<script>
import AdvListItem from "@/components/lists/AdvListItem";
//import AdvTitledList from "@/components/lists/AdvTitledList.vue";
export default {
  name: "AdvList",
  components: {AdvTitledList: () => import("@/components/lists/AdvTitledList.vue"), AdvListItem},
  props: {
    items :{
      type: Array,
      default: () => []
    }
  }
}
</script>

<style lang="scss">
  .adv-list, .adv-list > div {
    display: flex;
    flex-direction: column;
    // row-gap: 8px;
	
    > *:last-child {
      .product-list-item {
        border-bottom: none;
      }
    }
	  .adv-list {
		  margin-left: 1.4em;
	  }
  }
  .adv-list {
	> div {
		margin-top: 8px;
	}
  }
</style>
