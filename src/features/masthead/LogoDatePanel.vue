<template>
	<div class="mast-head logo-wpr">
		<div class="logo-masthead" @click="handleLogoClick">
			<img v-bind="config.logo">
		</div>
		<flyer-validity-dates />
	</div>
</template>

<script>
import {mapGetters} from "vuex";
import moment from "moment";
import 'moment/locale/fr-ca';
import featureMixin from "@/mixins/featureMixin";
import FlyerValidityDates from "@/features/masthead/FlyerValidityDates.vue";

export default {
	name: "LogoDatePanel",
	components: {FlyerValidityDates},
	mixins:[featureMixin],
	data(){
		return {
			featurePath: 'mastHead'
		}
	},
	computed: {
		...mapGetters('config', ['branding', 'features']),
		...mapGetters(['content', 'language']),
		...mapGetters('landingPage', ['currentFlyer', 'previewDate']),
		...mapGetters('screen', ['displayMode']),

	},
	methods: {
		handleLogoClick(){
			this.$emit('to-top');
			if(this.config?.logo?.href){
				window.open(this.config?.logo?.href, this.config?.logo?.target || '_self');
			}
		},
		formatDate(date) {
			const m = moment.utc(date);
			m.locale(this.language);
			return `<span style='color:#000; font-weight: 500;'>${m.format('dddd')}</span> <span style='color:#EE3124'>${m.format('MMMM D')}</span>`;
		}
	}
}
</script>

<style lang="scss" scoped>
.logo-wpr {
	display: flex;
	align-items: center;
	justify-self: flex-start;
	flex-grow: 1;
	//column-gap: 0.5em;
}

.logo-masthead {
	cursor: pointer;
	img {
		height: 66px;
	}
}

.date-container {
	font-size: 15px;
	margin-left: 1.5em !important;

}

.date {
	// font-weight: 700;
	font-family: inherit;
	margin-right: 10px;
	//color: var(--primary-color);
}

</style>
