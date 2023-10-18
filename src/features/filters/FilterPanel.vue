<template>
  <div class="filter-panel" v-bind="config.attrs">
	  <config-style-injector :root-selector="`.filter-panel`" :config="config" />
    <slot name="left" />

    <component
	    v-for="filter in filters"
	    :key="filter.name"
      :is="filter.component"
	    :feature-config="filter.config"
    />

    <clear-filter-button v-if="showClearFilterButton"/>
    <toggle-filter-button :class="{active: mobileDropdown}" @click="mobileDropdown = !mobileDropdown"/>

<!--    <transition name="fade">
      <div v-if="mobileDropdown" class="filter-mobile-dropdown">
        <filter-dropdown
            v-for="filter in dropdowns"
            :key="filter.name"
            :featureConfig="filter"
        />
        <clear-filter-button @click="clearFilters" :disabled="!hasFilters"/>
      </div>
    </transition>-->

  </div>
</template>

<script>
import {mapActions, mapGetters} from "vuex";
import ClearFilterButton from "@/features/filters/buttons/ClearFilterButton.vue";
import ToggleFilterButton from "@/components/buttons/ToggleFilterButton.vue";
import ToggleButtonFilter from "@/features/filters/ToggleButtonFilter.vue";
import featureMixin from "@/mixins/featureMixin";
import {filterDict} from "@/features/FeatureHelper";
import ConfigStyleInjector from "@/components/style-injector/ConfigStyleInjector.vue";


export default {
  name: "FilterPanel",
	mixins:[featureMixin],
  components: {ConfigStyleInjector, ToggleButtonFilter, ToggleFilterButton, ClearFilterButton},
  data() {
    return {
      mobileDropdown: false,
	    featurePath: 'filterPanel'
    }
  },
  computed: {
    ...mapGetters('filters', ["searchQuery", "hasFilters", "filtersByType", "filtersByName"]),
	  filters() {
			const o = [];
			const filterNames = this.config.filters;
			const filters = this.filtersByName;
		  const dict = filterDict;
			for(let i = 0; i < filterNames.length; i++){
				const name = filterNames[i];
				if(filters[name] && dict[filters[name]?.type]) {
					o.push({name, component: dict[filters[name].type], config: filters[name]});
				}
			}
			return o;
	  },
	  showClearFilterButton() {
			return this.config?.showClearButton;
	  }
  },
  methods: {
    ...mapActions('search', ['filterProducts']),
    ...mapActions('filters', ["clearFilters"]),
  },
  /*watch: {
    searchQuery(val) {
      //this.filterProducts(val);
    }
  }*/
}
</script>


<style lang="scss">

/*[mode='tablet'], [mode='mobile'] {
  .filter-panel {
    flex-wrap: wrap;
    padding: 10px;
    background-color: #F2F2F2;

    > .desktop-only {
      display: none;
    }

    > .clear-filter-button {
      display: none;
    }

    .btn.toggle-filter-button {
      display: flex;
    }

    .filter-mobile-dropdown {
      display: flex;
    }
  }
}*/

.filter-panel {
  display: flex;
  //column-gap: 5px;
  position: relative;
  font-size: 14px;
  flex-grow: 1;
	justify-content: center;
   > * {
    margin-right: 5px;
   }

	.header-drawer & {
		width: 100%;
		[mode='mobile'] &, [mode='tablet'] & {
			.filter {
				width: 100%;
			}
		}

	}

  .filter-mobile-dropdown {
    display: none;
    width: 100%;
    top: 100%;
    z-index: 1000;
    background-color: #fff;
    column-gap: 5px;
    padding: 1em;
    flex-wrap: wrap;
    row-gap: 15px;
    box-shadow: 0px 2px 6px 0px rgb(0 0 0 / 20%);
    margin-top: 0.7em;
    border-radius: 4px;

    > * {
      flex-grow: 1;
      flex-basis: 40%;
      height: 2.5em;
    }

    .clear-filter-button {
      flex-basis: 35px;
    }

  }

  .btn.toggle-filter-button {
    display: none;
  }

  /*.btn {
    background: none;
    border: 1px solid #BBB;
    border-radius: 4px;
    padding: 5px;
    !*margin: 0 4px;*!
    display: flex;
    align-items: center;
    justify-content: center;
    height: calc(2.5em + 1px);
    min-width: calc(2.5em + 1px);

    transition: none;

    &[disabled] {
      pointer-events: none;
      opacity: 0.5;
    }

  }

  .btn * {
    transition: none;
  }

  .btn:hover {
    background-color: #EEE;
  }*/

  .fade-enter-active, .fade-leave-active {
    transform-origin: top;
    transition: opacity .1s, transform .1s;
  }

  .fade-enter {
    opacity: 0;
    transform: scaleY(0);
  }


  .fade-leave-to {
    opacity: 0;
    transform: scaleY(0);
  }

}

.drawer-container.header {
  .filter-panel {
	 > * {
		margin-bottom: 10px;
	 }
   }
}
</style>
