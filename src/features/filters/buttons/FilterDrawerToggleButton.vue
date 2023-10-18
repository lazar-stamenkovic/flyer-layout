<template>
	<button v-tooltip="{ content: lang.toggleSearch}" :class="{selected: isOpen}" class="btn filter-drawer-toggle-button" v-bind="config.attrs" @click="toggleFilters" v-html="caption">
		<config-style-injector
				:config="config"
				:root-selector="`.filter-drawer-toggle-button`"
		/>
	</button>
</template>

<script>
import {mapActions, mapGetters, mapState} from "vuex";
import featureMixin from "@/mixins/featureMixin";
//import FilterPanel from "@/features/filters/FilterPanel.vue";
import ConfigStyleInjector from "@/components/style-injector/ConfigStyleInjector.vue";

export default {
	name: "FilterDrawerToggleButton",
	components: {ConfigStyleInjector},
	mixins: [featureMixin],
	data() {
		return {
			featurePath: 'filterToggleButton',
			drawer: 'header'
		}
	},
	computed: {
		...mapState('drawer', ['drawerItems']),
		...mapGetters('filters', ["isFilterPanelOpen"]),
		isOpen() {
			return this.isFilterPanelOpen;
		},
		caption() {
			return this.config.label || 'Search'
		}
	},
	methods: {
		...mapActions('filters', ["setFilterPanelState"]),
		toggleFilters() {
			this.setFilterPanelState(!this.isOpen);
		}
	},
	beforeDestroy() {
		this.setFilterPanelState(false);
		//this.removeFromDrawer( {id: 'filters', drawer: this.drawer});
	}
}
</script>

<style lang="scss" scoped>

.filter-drawer-toggle-button {
	background: var(--button-background);
	color: var(--button-text-color);

	/*&:hover {
		background: var(--button-background-hover);
		background-repeat: no-repeat;
		background-position: center;
		background-size: 64%;
	}*/
}


/*@media (max-width: 1365px) {
	.filter-drawer-toggle-button {
		width: 33px;
		background-image: url(/images/search.svg);
		background-repeat: no-repeat;
		background-position: center;
		background-size: 64%;
		background-color: var(--tertiary-color);
		!*border: none;*!
		border-radius: 3px;

		> span {
			display: none;
		}
	}
}*/

/*[mode='tablet'], [mode='mobile'] {
	.filter-drawer-toggle-button {
		background-image: url(/images/icon-filter.svg);
		background-color: initial;
		> span {
			display: none;
		}
	}
}*/


</style>
