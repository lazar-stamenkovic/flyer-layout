import axios from 'axios';
import router from "@/router";
import VueRouter from "vue-router";
import AppConfig from "@/classes/AppConfig";

// console.log('Rest Class Config:', AppConfig.AppConf)

let rest;

export default class Rest {
	/*static Create() {
		rest = axios.create({
			baseURL: AppConfig?.AppConf?.api || process.env.VUE_APP_API_URL,
			headers: {
				'Ocp-Apim-Subscription-Key': AppConfig?.AppConf?.apikey || process.env.VUE_APP_API_KEY,
				'Banner': AppConfig?.AppConf?.banner_id || process.env.VUE_APP_BANNER,
				'content-type': 'application/json;charset=UTF-8',
				'x-api-version': process.env.VUE_APP_API_VERSION,
			}
		});

		rest.interceptors.response.use(response => {
			return response;
		}, error => {
			//console.log('Rest Error:', error);
			return Promise.reject(error);
		});
	}*/

	static get rest() {
		if(!rest) {
			rest = axios.create({
				
				baseURL: AppConfig?.AppConf?.api || process.env.VUE_APP_API_URL,
				headers: {
					'Ocp-Apim-Subscription-Key': AppConfig?.AppConf?.apikey || process.env.VUE_APP_API_KEY,
					'Banner': AppConfig?.AppConf?.banner_id || process.env.VUE_APP_BANNER,
					'content-type': 'application/json;charset=UTF-8',
					'x-api-version': AppConfig?.AppConf?.api_version || process.env.VUE_APP_API_VERSION,
				}
			});

			rest.interceptors.response.use(response => {
				return response;
			}, error => {
				//console.log('Rest Error:', error);
				return Promise.reject(error);
			});
		}
		return rest;
	}

	static async Get(url, config) {
		return this.rest.get(url, config);
	}

	static async Post(url, data, config) {
		return this.rest.post(url, data, config);
	}

	static async Put(url, data, config) {
		return this.rest.put(url, data, config);
	}

	static async Delete(url, config) {
		return this.rest.delete(url, config);
	}

	static GetInstance() {
		return this.rest;
	}

	static NavigateToFlyer(flyerId) {
		return router.push({...router.currentRoute, name: 'DefaultFlyer', params: {flyerId}}).catch((err) => {
			if (VueRouter.isNavigationFailure(err)) {
				return err
			}
			return Promise.reject(err)
		})
	}

	static async GotoErrorPage(error) {
		let errType = 'unknown'
		//No publication found for store-language
		//No content found for deal: D037
		console.log('GotoPage Error:', error?.response);

		switch (error?.response?.status) {
			case 417:
				errType = 'date'
				break;
		}
		console.log("Error Title: ", error?.response?.data)
		const errTxt = (error?.response?.data?.title || error?.response?.data || '').toLowerCase();
		if (errTxt.includes('store-language')) {
			errType = 'lang'
		} else if (errTxt.includes('not found')) {
			errType = 'nodeal'
		} else if (errTxt.includes('config')) {
			errType = 'config'
		}
		await router.push({
			...router.currentRoute,
			name: 'ErrorPage',
			params: {type: errType, ...router.currentRoute.params}
		})
	}

}
