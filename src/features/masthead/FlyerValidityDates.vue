<template>
	<span class="date-container" v-html="formatted" v-bind="config.attrs"></span>
</template>
<script>

import featureMixin from "@/mixins/featureMixin";
import {mapGetters} from "vuex";
import moment from "moment";


function parse(str, data) {
	 const m = str.match(/\{(.*?)\}/g);
	 m.forEach((itm) => {
		 // console.log('Parsing:', itm);
		 const d = itm.slice(1, -1).split('|').map((i) => i.trim());
		 if(!data[d[0]]) return;
		 str = str.replace(itm, data[d[0]].format(d[1]));
	 })
	return str;
}

export default {
	name: "FlyerValidityDates",
	mixins:[featureMixin],
	data(){
		return {
			featurePath: 'mastHead.validityDates'
		}
	},
	computed:{
		...mapGetters('landingPage', ['currentFlyer']),
		...mapGetters(['language']),
		startDate() {
			return moment.utc(this.currentFlyer.startDate).locale(this.language);
		},
		endDate() {
			return moment.utc(this.currentFlyer.endDate).locale(this.language);
		},
		formatted(){
			return parse(this.config.format, { startDate: this.startDate, endDate: this.endDate})
		}
	}
}
</script>

<style scoped>

</style>
