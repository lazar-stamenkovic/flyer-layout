<template>
	<dropdown class="range-dropdown filter-dropdown">
		<template #btn>
			<span>{{ label }}</span>
		</template>
		<template #body>
			<range-list :items="items" @select="$emit('select', $event)"/>
		</template>
	</dropdown>
</template>

<script>
import Dropdown from "@/components/bp-vuejs-dropdown/Dropdown.vue";
import RangeList from "@/features/filters/range/RangeList.vue";

export default {
	name: "RangeDropdown",
	components: {RangeList, Dropdown},
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
	.range-dropdown{
		height: 35px;
	}
</style>
