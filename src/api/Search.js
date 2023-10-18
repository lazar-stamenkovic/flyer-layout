import Rest from './Rest';

export default class SearchApi {
  static async Post(deal, storeId, lang, data, highlightMode) {
    const mode = highlightMode? 'searchforotherpubs': 'search';
    const res = await Rest.Post(`/Pages/${deal}/${storeId}/${lang === 'fr' ? 'bil' : 'en'}/${mode}`, data);
    return res && res.data;
  }
}
