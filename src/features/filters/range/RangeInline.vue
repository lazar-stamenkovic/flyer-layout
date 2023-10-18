<template>
	<div class="range-inline">
		{{label}} <range-list :items="items" @select="$emit('select', $event)"/>
	</div>
</template>

<script>
import RangeList from "@/features/filters/range/RangeList.vue";

export default {
	name: "RangeInline",
	components: {RangeList},
	props:{
		items:{
			type:Array
		},
		label:{
			type: String
		}
	}
}
</script>

<style lang="scss">
	.range-inline {
		display: flex;
		column-gap: 1em;
		flex-wrap: wrap;
		align-items: center;
		margin-left: 2em;
		.range-list{
			display: flex;
			overflow: hidden;
			border-radius: 4px;
			border: 1px solid #aeaeae;
			.list-item {
				border-right: 1px solid #aeaeae;
				&:last-child{
					border-right: none;
				}
			}
		}
	}
</style>
