<template>
  <div :class="`checkbox-label-list-item ${selected? 'selected': ''}`">
    <check-box :selected="checkbox.selected" /> <label-list-item :item-data="itemData" />
  </div>
</template>

<script>
import CheckBox from "@/components/lists/item-types/CheckBox";
import LabelListItem from "@/components/lists/item-types/LabelListItem";
export default {
  name: "CheckBoxLabelListItem",
  components: {LabelListItem, CheckBox},
  props: {
    itemData: {
      type: Object
    }
  },
  computed: {
    selected() {
      //console.log('Item Selected Change:', this.itemData)
      return !!this.itemData?.checkbox?.selected;
    },
	  checkbox(){
			return this.itemData?.checkbox;
	  }
  }
}
</script>

<style lang="scss" scoped>
  .checkbox-label-list-item {
    display: flex;
    //column-gap: 0.5em;
    align-items: center;
    cursor: pointer;
      >* {
        margin-right: 0.5em;
      }
    &.selected {
      color: var(--list-item-select-color)
    }
  }
</style>
