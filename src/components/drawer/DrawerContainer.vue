<template>
	<div :class="`drawer-container ${drawer}`" v-if="isVisible">
		<component
				v-for="(comp, id) in items"
				:key="id"
				:is="comp.component"
				v-bind="comp.attrs"
		/>
	</div>
</template>

<script>
import {mapActions, mapState} from "vuex";

export default {
	name: "DrawerContainer",
	props:{
		drawer:{
			type: String,
			required: true
		}
	},
	computed:{
		...mapState('drawer', ['drawerItems']),
		isVisible() {
			return Object.keys(this.items).length > 0;
		},
		items() {
			return this.drawerItems[this.drawer];
		}
	},
	methods: {
		...mapActions('drawer', ['hasContent'])
	}
}
</script>

<style scoped>
 .feature-header .drawer-container.header {
   padding: 1em 1em 0.4em;
}
</style>
