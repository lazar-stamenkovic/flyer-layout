import axios from "axios";
import AppConfig from "@/classes/AppConfig";

let api = null;

export default class PersonalizationApi {
	/**
	 *
	 * @returns Axios
	 */
	static get api(){
		if(!api) {
			api = axios.create({
				baseURL: AppConfig.AppConf?.offers_api?.url || process.env.VUE_APP_PERSONALIZATION_API_URL,
				headers: {
					'Content-Type': 'application/json',
					'ApiKey': AppConfig.AppConf?.offers_api?.key || process.env.VUE_APP_PERSONALIZATION_API_KEY
				}
			})
		}
		return api;
	}
	static async GetOffers(customerId, deal, storeId, lang = 'en') {
		//const { data } = await api.get('offers',  { params: {deal, customerId, storeId, lang}});
		// console.log('Get Offers:', this.api)

		const { data } = await this.api.get(`offers/${customerId}/${deal}/${storeId}/${lang}/getOffers`);

		// console.log('Personalization Data:', data);
		return data;
	}
}
