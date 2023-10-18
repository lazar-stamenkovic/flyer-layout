<template>
	<div class="control-panel" v-bind="config.attrs">
	  <config-style-injector
			  :root-selector="`.control-panel`"
			  :config="config"
	  />
		<component
				v-for="control in controls"
				:is="control.component"
				:key="control.name"
		/>
	</div>
</template>

<script>
import featureMixin from "@/mixins/featureMixin";
import {controlDict} from "@/features/FeatureHelper";
import ConfigStyleInjector from "@/components/style-injector/ConfigStyleInjector.vue";


export default {
	name: "ControlPanel",
	components: {ConfigStyleInjector},
	mixins: [featureMixin],
	data() {
		return {
			featurePath: 'header.controls'
		}
	},
	computed: {
		controls() {
			const o = [];
			const dict = controlDict
			// console.log('Controls Dict:', dict)
			for (const name of this.config.items) {
				if (dict[name]) {
					o.push({name, component: dict[name]});
				}
			}
			return o;
		}
	}
}
</script>

<style lang="scss" scoped>
.control-panel {
	display: flex;
	align-items: center;
	/*justify-content: flex-end;
	flex-grow: 1;*/
	/*column-gap: 0.5em;*/

  & > * {
		margin-right: 0.5em
  }

  & > *:last-child {
		margin-right: 0;
  }

}
/*.btn {
	background: none;
	border: 1px solid #BBB;
	border-radius: 4px;
	padding: 5px;
	!*margin: 0 4px;*!
	display: flex;
	align-items: center;
	justify-content: center;
	height: 34px;
	min-width: 34px;
	color: #333;
	transition: none;
}*/

/*.btn * {
	transition: none;
}

.btn:hover {
	background-color: #EEE;
}*/

/*.btn.selected {
	background-color: var(--primary-color);
	color: var(--primary-text-color);
}

.btn.selected:hover {
	background-color: var(--primary-color);
}*/
</style>
