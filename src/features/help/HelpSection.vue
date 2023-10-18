<template>
	<div class="help-section">
		<div v-if="!!title" class="title">
			<hr/>
			<h3 v-html="title" />
			<hr/>
		</div>
		<div :style="listStyle" class="item-list">
			<help-screen-item
					v-for="(item, index) in items"
					:key="`help-section-item-${item.title || index}`"
					:item-data="item"
			/>
		</div>
	</div>
</template>

<script>
import HelpScreenItem from "@/features/help/HelpScreenItem.vue";

export default {
	name: "HelpSection",
	components: {HelpScreenItem},
	props: {
		itemData: {
			type: Object
		}

	},
	computed: {
		title() {
			return this.itemData.title;
		},
		items() {
			return this.itemData.items;
		},
		listStyle() {
			const itemCount = Math.min(this.items.length, 4);
			return {
				gridTemplateColumns: `repeat(${itemCount}, 1fr)`
			}
		}
	}
}
</script>

<style lang="scss">
.help-section {
  > .title {
		display: flex;
		align-items: center;
		padding-bottom: 12px;

		hr {
		  flex-basis: 100%;
		}

		h3 {
		  padding: 0 2em;
		  font-size: 16px;
		  white-space: nowrap;
		  text-transform: uppercase;
		}
  }

  .item-list {
		display: grid;
		column-gap: 40px;
		//row-gap: 24px;
		background-color: #eee;
		padding: 12px;
		[mode='tablet'] &, [mode='mobile'] &{
			display: flex;
		  flex-direction: column;
			background-color: initial;
			> * {
				margin-bottom: 24px;
			}
		}
  }



}
</style>
