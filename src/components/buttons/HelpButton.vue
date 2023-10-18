<template>
	<button v-tooltip.bottom-center="{ content: content.helpToolTip}" class="btn help" data-tour-item="help" tabindex="0" @click="toggleHelpComponent" v-bind="config.attrs">
		<img v-if="!showHelp" alt="help" src="/images/icon-help-grey1-withoutborder.svg"/>
		<svg v-else height="34px" version="1.1" viewBox="0 0 34 34" width="34px" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
			<g id="Tutorial---Tool-tips" fill="none" fill-rule="evenodd" stroke="none" stroke-width="1">
				<g id="Help---Vertical-Scrolling" transform="translate(-1179.000000, -23.000000)">
					<g id="icon-help-red" transform="translate(1179.000000, 23.000000)">
						<rect id="Rectangle-Copy-5" fill="currentColor" height="33" rx="4" stroke="" width="33" x="0.5" y="0.5"></rect>
						<path
								id="icon-help"
								d="M17,9 C12.584,9 9,12.584 9,17 C9,21.416 12.584,25 17,25 C21.416,25 25,21.416 25,17 C25,12.584 21.416,9 17,9 Z M17.8,22.6 L16.2,22.6 L16.2,21 L17.8,21 L17.8,22.6 Z M19.456,16.4 L18.736,17.136 C18.16,17.72 17.8,18.2 17.8,19.4 L16.2,19.4 L16.2,19 C16.2,18.12 16.56,17.32 17.136,16.736 L18.128,15.728 C18.424,15.44 18.6,15.04 18.6,14.6 C18.6,13.72 17.88,13 17,13 C16.12,13 15.4,13.72 15.4,14.6 L13.8,14.6 C13.8,12.832 15.232,11.4 17,11.4 C18.768,11.4 20.2,12.832 20.2,14.6 C20.2,15.304 19.912,15.944 19.456,16.4 Z" fill="#FFFFFF" fill-rule="nonzero"></path>
					</g>
				</g>
			</g>
		</svg>
	</button>
</template>

<script>
import {mapActions, mapGetters, mapState} from "vuex";
import featureMixin from "@/mixins/featureMixin";

export default {
	name: "HelpButton",
	mixins: [featureMixin],
	data(){
		return {
			featurePath: 'helpScreen.toggleButton'
		}
	},
	computed: {
		...mapGetters(['content']),
		...mapState('toast', ['showHelp'])
	},
	methods: {
		...mapActions('toast', ['toggleHelp']),

		toggleHelpComponent() {
			console.log('Toggle Help');
			this.toggleHelp();
			this.$parent.isHidden = !this.$parent.isHidden
		}
	}
}
</script>

<style scoped>
.btn.help {
	padding: 0;
	width: 35px;
	cursor: pointer;
}
</style>
