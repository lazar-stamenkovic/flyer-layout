<template>
	<fragment>
		<sidebar v-if="!isInline && enabled" />
		<div class="flyer-selector-controller"></div>
	</fragment>

</template>

<script>
import featureMixin from "@/mixins/featureMixin";
import {mapActions} from "vuex";
import {appDict} from "@/features/FeatureHelper";
import Sidebar from "@/features/other-flyers/Sidebar.vue";

export default {
	name: "FlyerSelectorController",
	components: {Sidebar},
	mixins:[featureMixin],
	data(){
		return {
			featurePath: 'flyerSelector'
		}
	},
	mounted() {
		this.move(this.position);
	},
	computed:{
		isInline(){
			return this.mode === 'inline';
		},
		mode(){
			return this.config.mode;
		},
		position() {
			return this.config.position;
		}
	},
	methods:{
		...mapActions('drawer', ['addToDrawer', 'removeFromDrawer']),
		move(to, from = null){
			if(!this.isInline)return;
			if(from){
				this.removeFromDrawer({id: this.featurePath, drawer: from});
			}
			if(this.enabled)this.addToDrawer({id: this.featurePath, component: appDict.inlineFlyerSelector, drawer: to, attrs: this.config.attrs})
		}
	},
	watch:{
		position(to, from) {
			this.move(to, from);
		}
	}
}
</script>

<style scoped>
	.flyer-selector-controller {
		display: none;
	}
</style>
