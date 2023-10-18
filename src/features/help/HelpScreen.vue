<template>
	<div class="help-screen">
	  <config-style-injector :root-selector="`.help-screen`" :config="config" />
		<help-section
				v-for="(section, index) in sections"
				:key="`help-screen-section-${index}`"
				:item-data="section"
		/>
	</div>
</template>

<script>
import featureMixin from "@/mixins/featureMixin";
import HelpSection from "@/features/help/HelpSection.vue";
import {mapGetters} from "vuex";
import ConfigStyleInjector from "@/components/style-injector/ConfigStyleInjector.vue";

export default {
	name: "HelpScreen",
	components: {ConfigStyleInjector, HelpSection},
	mixins: [featureMixin],
	data() {
		return {
			featurePath: 'helpScreen'
		}
	},
	computed: {
		...mapGetters(['content']),
		sections() {
			return this.config.sections;
		}
	}
}
</script>

<style lang="scss">
.help-screen {
  row-gap: 12px;
  display: flex;
  flex-direction: column;
}
</style>
