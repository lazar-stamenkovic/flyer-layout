<template>
  <search-bar-filter v-if="searchBar"  :featureConfig="searchBar" />
</template>

<script>
import {mapActions, mapGetters} from 'vuex';
import SearchBarFilter from "@/features/filters/SearchBarFilter.vue";

export default {
  name: "SearchBarFilterStandAlone",
	components: {SearchBarFilter},

  computed: {
		...mapGetters('filters', ['filtersByType', 'searchQuery']),
	  searchBar() {
			return this.filtersByType['searchbar'][0];
	  }
  },
	methods:{
		...mapActions('search', ['filterProducts'])
	},
	watch: {
		searchQuery(val) {
			this.filterProducts(val);
		}
	}
}
</script>

<style scoped>

</style>
