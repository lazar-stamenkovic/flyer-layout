<template>
	<div class="adv-titled-list">
		<div v-if="title" class="title">
			<adv-list-item :item-data="titleData" @select="onTitleSelect"/>
			<span v-if="collapsable" class="collapse-icon" @click="toggleCollapse">{{ collapseIcon }}</span></div>
		<div :class="collapsed? 'collapsed':null">
			<adv-list :items="filteredItems" @select="$emit('select', $event)"/>
			<div v-if="hasMore" class="has-more highlight" @click="showAll = true">See more {{ title }}</div>
			<slot/>
		</div>
	</div>
</template>

<script>
import AdvList from "@/components/lists/AdvList";
import AdvListItem from "@/components/lists/AdvListItem";

export default {
	name: "AdvTitledList",
	components: {AdvListItem, AdvList},
	props: {
		title: {
			type: [String, Object]
		},
		items: {
			type: Array,
			default: () => []
		},
		maxVisible: {
			type: Number,
			default: null
		},
		collapsable: {
			type: Boolean,
			default: false
		},
		isCollapsed: {
			type: Boolean,
			default: false
		},
		enableToggleAll: {
			type: Boolean,
			default: false
		}
	},
	data() {
		return {
			showAll: false,
			collapsed: false
		}
	},
	created() {
		if (this.collapsable) {
			if (this.someSelected && !this.allSelected) {
				this.collapsed = false;
			} else {
				this.collapsed = this.isCollapsed
			}
		}
	},
	computed: {
		filteredItems() {
			if (!this.maxVisible) return this.items;
			const e = this.showAll ? this.items.length : this.maxVisible;
			return this.items.slice(0, e);
		},
		hasMore() {
			return this.items.length > this.filteredItems.length;
		},
		collapseIcon() {
			return this.collapsed ? '+' : '-';
		},
		someSelected() {
			return this.items.some((item) => {
				return item.checkbox.selected;
			})
		},

		allSelected() {
			const ts = this.items.reduce((pv, item) => {
				let val = item.checkbox.selected ? 1 : 0;
				if (typeof pv === 'object') {
					val += pv.checkbox.selected ? 1 : 0;
				} else {
					val += pv;
				}
				return val;
			});

			return ts === this.items.length;
		},

		titleData() {

			const d = typeof (this.title) === 'object' ? this.title : {
				label: this.title
			}

			if (this.enableToggleAll && !d.checkbox) {
				d.checkbox = {
					selected: this.allSelected
				}
			}
			return d;
		},
		titleSelected() {
			return this.titleData?.checkbox?.selected;
		}
	},
	methods: {
		toggleCollapse() {
			this.collapsed = !this.collapsed;
			this.$emit('toggleCollapse', this.titleData);
		},
		onTitleSelect(d) {
			console.log('on Filter Title select:', d)
			if (this.enableToggleAll) {
				this.items.forEach((item) => {
					if (item.checkbox) {
						item.checkbox.selected = d.checkbox?.selected;
					}
				})
			}
			this.$emit('select', d);
		}
	},
	watch: {
		allSelected(v) {
			if (this.enableToggleAll) this.titleData.checkbox.selected = v;
		},
		titleSelected(v) {
			//console.log('titleSelec Toggled:', v)
			if (this.enableToggleAll) {
				if ((v && !this.allSelected) || (!v && this.allSelected)) {
					this.onTitleSelect(this.titleData);
				}
			}

		}
	}
}
</script>

<style lang="scss" scoped>
.adv-titled-list {
  .title {
	padding: 0.65em 0;
	display: flex;
	justify-content: space-between;
	border-bottom: solid 1px #afafaf;
	margin-bottom: 0.8em;
	text-transform: capitalize;

	.collapse-icon {
	  cursor: pointer;
	  flex-grow: 1;
	  text-align: right;
	}

	.adv-list-item {
	  margin-right: 1em;
	}
  }

  .has-more {
	font-size: smaller;
	margin-top: 1em;
	cursor: pointer;
  }

  .collapsed {
	display: none;
  }

  &.sub-menu {
	display: flex;
	flex-direction: column;
	// row-gap: 8px;

	.title {
	  padding: 0px;
	  border-bottom: none;
	  margin-bottom: 0px;
	}
  }
}
</style>
