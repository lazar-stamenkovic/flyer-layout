<template>
	<button v-if="enabled" v-tooltip="{ content: content.toggleView}" :aria-label="content.toggleView"
	        :class="flyerOrientation === 'vertical' ? 'rotate selected' : ''" class="column-toggle btn"
	        data-tour-item="orientation" tabindex="0"
	        @click="toggleColumnView" v-bind="config.attrs">
		<svg height="20" width="16" xmlns="http://www.w3.org/2000/svg">
			<path
					d="M12.57 15.57v-7.8H10.3v7.8H6.86L11.43 20 16 15.57h-3.43zM4.57 0L0 4.43h3.43v7.8H5.7v-7.8h3.43L4.57 0z"
					fill="currentColor" fill-rule="nonzero"/>
		</svg>
	</button>
</template>

<script>
import {mapActions, mapGetters} from "vuex";
import featureMixin from "@/mixins/featureMixin";

export default {
	name: "ToggleFlyerOrientationButton",
	mixins: [featureMixin],
	data(){
		return {
			featurePath: 'toggleView'
		}
	},
	computed: {
		...mapGetters(['content']),
		...mapGetters('screen', ["flyerOrientation"]),
		...mapGetters('config', ['features'])
	},
	methods: {
		...mapActions(["toggleColumnView"])
	}
}
</script>

<style scoped>
.rotate svg {
	transform: rotate(90deg);
}
</style>
