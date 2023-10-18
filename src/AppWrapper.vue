<template>
  <div id="app">
    <router-view v-if="ready || $route.name === 'ErrorPage' " />
  </div>
</template>

<script>
import {mapActions, mapGetters, mapState} from 'vuex'
import Rest from "@/api/Rest";

export default {
	data() {
		return {
			ready: false
		}
	},
  computed:{
    ...mapGetters('landingPage', ['currentFlyer']),
    ...mapState('landingPage', ['flyers'])
  },
  methods: {
    ...mapActions('landingPage', ['getFlyersData','setCurrentFlyer']),
    ...mapActions(['setLanguage','setPages','setCurrentStore']),
	  ...mapActions('screen', ['handleWindowResize'])
  },

  async created() {
		// console.log("** Wrapper Created")
    await this.getFlyersData();
    if(!this.flyers.find( flyer => flyer.title === this.$route.params.flyerId )) {
      await Rest.NavigateToFlyer(this.currentFlyer.title);
    }
	  this.ready = true;
	  window.addEventListener("resize", this.handleWindowResize);
    //this.setCurrentStore(this.$route.query.storeId);
    //const flyerId = this.$route.params.flyerId ? this.$route.params.flyerId : null;
		//await this.setCurrentFlyer(this.$route.params.flyerId);

    //await this.setPages(this.currentFlyer.title);
    //this.setLanguage()
  },
	beforeDestroy() {
		window.removeEventListener('resize', this.handleWindowResize)
	}
}
</script>
