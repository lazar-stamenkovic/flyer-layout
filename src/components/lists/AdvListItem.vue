<template>
	<div :class="`adv-list-item ${clickable? 'clickable':''}`" @[clickEvent]="handleClick">
		<label-list-item v-if="autoMode === 'label'" :item-data="itemData"/>
		<check-box-label-list-item v-else-if="autoMode === 'checkboxLabel'" :item-data="itemData"/>
		<product-list-item v-else-if="autoMode === 'product'" :item-data="itemData"/>
	</div>
</template>

<script>
import LabelListItem from "@/components/lists/item-types/LabelListItem";
import CheckBoxLabelListItem from "@/components/lists/item-types/CheckBoxLabelListItem";
import ProductListItem from "@/components/lists/item-types/ProductListItem";

export default {
	name: "AdvListItem",
	components: {ProductListItem, CheckBoxLabelListItem, LabelListItem},
	props: {
		mode: {
			type: String,
			default: null
		},
		itemData: {
			type: Object,
			default: () => {
				return {};
			}
		}
	},
	computed: {
		clickable() {
			return this.itemData?.onClick?.event || this.autoMode === 'checkboxLabel';
		},
		clickEvent() {
			return this.clickable ? 'click' : null;
		},
		autoMode() {
			if (this.itemData.mode) return this.itemData.mode;
			if (this.mode) return this.mode;
			let mode = 'label';
			if (this.itemData?.label) {
				if (this.itemData?.checkbox) {
					mode = 'checkboxLabel'
				}
			}
			if (this.itemData?.product) {
				mode = 'product'
			}
			return mode;
		}
	},
	methods: {
		handleClick(e) {
			console.log('ADVListItem Clicked:', e, 'Automode:', this.autoMode);

			switch (this.autoMode) {
				case 'checkboxLabel':
					console.log('Update checkbox:', this.itemData.checkbox)
					this.itemData.checkbox.selected = !this.itemData?.checkbox?.selected;
					if (typeof (this.itemData.checkbox?.onChange) === 'function') {
						this.itemData.checkbox.onChange(this.itemData.checkbox.selected);
					}

					break;
			}

			this.$emit('select', this.itemData);
		}
	}
}
</script>

<style lang="scss">
.adv-list-item {
  color: #545454;

  &.clickable {
	cursor: pointer;

	&:hover {
	  text-decoration: underline;
	}
  }
}
</style>
