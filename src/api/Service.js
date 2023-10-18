import Rest from "@/api/Rest";
import moment from "moment";

export default class Service {
	static async GetAllFilters(flyerId, storeId, lang) {
		lang = lang === 'fr' ? 'bil' : lang;
		const {data} = await Rest.Get(
			`Pages/${flyerId}/${storeId}/${lang}/AllDropdownItems`,
		)
		return data;
	}

	static async GetFlyerData(storeId, lang, date) {
		lang = lang === 'fr' ? 'bil' : lang;
		const {data, error} = await Rest.Get(
			`flyers/${storeId}/${lang}?date=${moment(date).format("YYYY-MM-DD")}`
		);

		if(error) console.log('Landing Page: error:', error);

		return data;
	}

	static async GetFlyerPage(flyerId, storeId, lang) {
		const {data} = await Rest.Get(`pages/${flyerId}/${storeId}/${lang}/`);
		return data;
	}

	static async LoadConfig(path) {
		return await fetch(path);
	}
}
