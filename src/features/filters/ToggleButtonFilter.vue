<template>
	<fragment>
		<config-style-injector :config="config" :root-selector="`.toggle-button-filter.${config.name}`" />
		<button id='toggleButton' @click="toggle" @dblclick="handleDoubleClick" @click.middle="handleTripleClick" :class="`btn toggle-button-filter ${config.name} ${buttonClass}`" v-if="enabled" v-bind="config.attrs" :toggle="featureConfig.value? 'on':'off'">{{ buttonLabel }}</button>
	</fragment>
</template>

<script>
import featureMixin from "@/mixins/featureMixin";
import ConfigStyleInjector from "@/components/style-injector/ConfigStyleInjector.vue";
import {mapActions, mapGetters} from "vuex";


export default {
	name: "ToggleButtonFilter",
	components: {ConfigStyleInjector},
	mixins:[featureMixin],
	methods:{
		...mapActions('events', ['triggerEvent']),
		toggle() {
		        this.featureConfig.value = !this.featureConfig.value;

				this.triggerEvent({
				event: `filter-toggle-event-${this.config.name}`,
				data: { selected: !!this.featureConfig.value, label: this.config.label }
			});
		},
		handleDoubleClick() {
			 setTimeout(() => {
				this.featureConfig.value = !this.featureConfig.value;
			 }, 200)
		}
	},
	computed: {
		
		...mapGetters('config', ['branding']),

      buttonLabel() {
		if( this.branding.rewardsButtonTitle === "Thunder Bucks") {
			return 'ThunderBucks';
		} else if (this.branding.rewardsButtonTitle === "Air Miles") {
			return 'AIR MILES';
		} else {
			return this.config.label;
		}
	  },
	  buttonClass() {
		return this.buttonLabel === 'ThunderBucks' ? 'thunderbucks-button' : '';
	  }
  }
}
</script>

<style scope>
   .toggle-button-filter.Points.thunderbucks-button {
	font-family: unset;
	font-size: 1em;
	color: red;
	padding: 0 28px;
	background: unset;
	background-color: white;
	background-image: url("/images/Thunderbucks-Button-container-new.svg");
	background-repeat: no-repeat;
	background-position: center center;
	background-size: cover;
   }
   .toggle-button-filter.Points.thunderbucks-button[toggle='on'] {
	background-color: white;
	color: red;
   }
</style>
