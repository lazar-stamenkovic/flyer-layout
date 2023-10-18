import Vue from 'vue'
import AppWrapper from './AppWrapper.vue'
import store from './store'
import VTooltip from 'v-tooltip'
import VueLazyload from "vue-lazyload";
import VueObserveVisibility from 'vue-observe-visibility';
import router from './router'
import ClickOutside from "vue-click-outside";
import {Fragment} from "vue-fragment";
import AppConfig from "@/classes/AppConfig";
//import Rest from "@/api/Rest";
import {getUrlParameter} from "@/utils";
import VueGTM from 'vue-clean-gtm';
import {isArray} from "lodash";



console.log('*** Iframe URL:', location.href, location);

const start = async () => {

	const tp = getUrlParameter('_fc') || '';

	await AppConfig.LoadConfig('app', tp);
	// console.log("App Config Loaded:", AppConfig.AppConf);

	//Rest.Create();

	const doc = document.getElementById("icon");
	doc.href =  `/icons/favicon/${AppConfig?.AppConf?.favicon}`;
	document.title=`${AppConfig?.AppConf?.title}`;


	Vue.config.productionTip = false;
	let analytics = AppConfig.AppConf?.analytics;

	if(!isArray(analytics)){
		analytics = [analytics];
	}
	analytics.forEach((analytic)=> {
		switch(analytic?.type) {
			case 'GTM':
				if(analytic?.config) {
					Vue.use(VueGTM, analytic?.config);
				}
				break;
			case 'rudder':
				//Don't think this is used anymore
				break;
			case 'QM':
				/*var qtm = document.createElement('script');qtm.type = 'text/javascript';qtm.async = 1;
				qtm.src = analytic.config.src;
				var d = document.getElementsByTagName('script')[0];
				window.QuantumMetricAPI && d.parentNode.insertBefore(qtm, d);*/



				var quantumMetricsScript = document.createElement('script');
				quantumMetricsScript.async=1;
				quantumMetricsScript.src = analytic.config.src ;
				document.body.appendChild(quantumMetricsScript);
				window.QuantumMetricAPI
				break;
		}
	});



	Vue.use(VTooltip);
	Vue.directive('tooltip', VTooltip.VTooltip)
	Vue.directive('close-popover', VTooltip.VClosePopover)
	Vue.component('v-popover', VTooltip.VPopover)
	Vue.component('fragment', Fragment)


	Vue.directive('click-outside', ClickOutside)

	Vue.use(VueLazyload, {
		observer: true
	});
	Vue.use(VueObserveVisibility);

	Vue.filter('localizeCurrency', value => {
		if (typeof Number(value) !== "number") {
			return value;
		}
		let formatter = new Intl.NumberFormat(store.getters.language === 'en' ? "en-US" : "fr-CA", {
			style: "currency",
			currency: "CAD",
		});
		return formatter.format(Number(value));
	})

	Vue.filter('currency', value => {
		if (typeof Number(value) !== "number") {
			return value;
		}
		let formatter = new Intl.NumberFormat(`${store.getters.language}-CA`, {
			style: "currency",
			currency: "CAD",
		});
		return formatter.format(Number(value));
	})

	new Vue({
		store,
		router,
		render: h => h(AppWrapper)
	}).$mount('#app')
}

start();
