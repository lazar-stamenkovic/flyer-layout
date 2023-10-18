<template>
	<div class="header-drawer">
		<component
			v-for="(comp, id) in drawerItems"
			:key="id"
			:is="comp.component"
			v-bind="comp.attrs"
		/>
	</div>
</template>

<script>
import {mapState} from "vuex";

export default {
	name: "HeaderDrawer",
	computed:{
		...mapState('header', ['drawerItems'])
	}
}
</script>

<style lang="scss" scoped>
	.header-drawer{
		padding: 1em;
		background-color: #F2F2F2;
		text-align: center;
		box-shadow: 0px 0px 3px 0px #000 inset;
		> * {
			display: inline-flex;
		}
	}
</style>
