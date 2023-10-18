<template>
	<div class="range-filter" v-bind="config.attrs">
		<range-inline v-if="config.mode === 'inline'" :items="_config.items" :label="config.label" @select="onSelect" />
		<range-dropdown v-else-if="config.mode === 'dropdown'" :label="config.label" :items="_config.items" @select="onSelect" />
	</div>
</template>

<script>
import featureMixin from "@/mixins/featureMixin";
import RangeDropdown from "@/features/filters/range/RangeDropdown.vue";
import RangeInline from "@/features/filters/range/RangeInline.vue";
import {mapActions} from "vuex";

export default {
	name: "RangeFilter",
	components: {RangeInline, RangeDropdown},
	mixins:[featureMixin],
	methods:{
		...mapActions('events', ['triggerEvent']),
		onSelect(item) {
			this.triggerEvent({
				event: `filter-toggle-event-${this.config.name}`,
				data: item
			})
			//console.log('RangeFilter Select:', item)
		}
	}
}
</script>

<style lang="scss" scoped>
	.range-filter{

	}
</style>
