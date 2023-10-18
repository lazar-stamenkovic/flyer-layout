<template>
	<button v-if="enabled" v-tooltip="{ content: content.toggleFullscreen, classes: 'last'}" :aria-label="content.toggleFullscreen"
	        :class="{ selected: isFullscreen }" class="fullscreen-toggle btn"
	        data-tour-item="fullscreen"
	        tabindex="0"
	        @click="handleFullScreen" v-bind="config.attrs">
		<svg v-if="!isFullscreen" height="18" viewBox="0 0 14 14" width="18" xmlns="http://www.w3.org/2000/svg">
			<path d="M2 9H0v5h5v-2H2V9zM0 5h2V2h3V0H0v5zm12 7H9v2h5V9h-2v3zM9 0v2h3v3h2V0H9z" fill="currentColor"
			      fill-rule="nonzero"/>
		</svg>
		<svg v-else height="18" viewBox="0 0 14 14" width="18" xmlns="http://www.w3.org/2000/svg">
			<path d="M3 14h2V9H0v2h3v3zM5 0H3v3H0v2h5V0zm6 11h3V9H9v5h2v-3zm3-6V3h-3V0H9v5h5z" fill="currentColor"/>
		</svg>
	</button>
</template>

<script>
import {mapActions, mapGetters, mapState} from "vuex";
import featureMixin from "@/mixins/featureMixin";

export default {
	name: "ToggleFullscreenButton",
	mixins: [featureMixin],
	data(){
		return {
			featurePath: 'fullScreen'
		}
	},
	mounted() {
		if(this.config?.trigger !== 'internal'){
			document.addEventListener('keydown', this.onEscape)
		}
	},
	beforeDestroy() {
		document.removeEventListener('keydown', this.onEscape);
	},
	computed: {
		...mapGetters(["content"]),
		...mapState('screen', ['fullScreenToggle']),
		...mapGetters('screen', ['isFullscreen'])
	},
	methods: {
		...mapActions('screen', ['toggleFullScreen', "setFullScreenState"]),
		onEscape(e) {
			//console.log('Key Press:', e)
			if(e.key === 'Escape')this.setFullScreenState(false);
		},
		handleFullScreen() {
			this.toggleFullScreen();
			this.$root.$emit('dropdown-hidden-updated', this.$parent.isHidden)
			this.$parent.isHidden = !this.$parent.isHidden
		}
	}
}
</script>

<style scoped>

</style>
