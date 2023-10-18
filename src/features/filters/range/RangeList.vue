<template>
	<div class="range-list">
		<div
		     v-for="(item, index) in items"
		     :key="item.name"
		     :class="{'list-item': true, selected:item.selected, active: index === selected}"
		     @click="selectItem(index)"
		>{{ item.label }}</div>
	</div>
</template>

<script>
export default {
	name: "RangeList",
	props:{
		'items':{
			type: Array
		}
	},
	computed:{
		selected(){
			const items = this.items;
			let selected = null;
			for(let i=0; i < items.length; i++){
				const item = items[i];
				if(item.selected) selected = i;
			}
			return selected;
		}
	},
	methods:{
		selectItem(index) {
			const items = this.items;
			for(let i=0; i < items.length; i++){
				const item = items[i];
				item.selected = i <= index;
			}
			this.$emit('select', items[index]);
		}
	}
}
</script>

<style lang="scss">
	.range-list{
		.list-item {
			display: flex;
			justify-content: center;
			align-content: center;
			flex-wrap: wrap;
			height: 35px;
			padding: 0px 8px;
			background-color: #fff;
			cursor: pointer;
			user-select: none;
			&.selected {
				background-color: #d5d5d5;
				&.active{
					background-color: red;
					color: #fff;
				}
			}
		}
	}
</style>
