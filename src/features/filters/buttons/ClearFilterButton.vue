<template>
  <button class="btn clear-filter-button" @click="clearFilters" :disabled="!hasFilters" >
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none"
         stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
         class="icon feather feather-refresh-ccw">
      <path d="M1 4v6h6M23 20v-6h-6"/>
      <path d="M20.49 9A9 9 0 005.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 013.51 15"/>
    </svg>
  </button>
</template>

<script>
import {mapActions, mapGetters} from "vuex";

export default {
  name: "ClearFilterButton",
	methods: {
		...mapActions('filters', ['clearFilters'])
	},
	computed:{
		...mapGetters('filters', ['hasFilters'])
	}
}
</script>

<style scoped>

</style>
<style lang="scss">
[mode='mobile'] {
  .clear-filter-button{
    margin-left: auto;
  }

}</style>
