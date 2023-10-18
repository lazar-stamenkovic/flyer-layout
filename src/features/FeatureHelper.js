import FilterDropdown from "@/features/filters/FilterDropdown.vue";
import SearchBarFilter from "@/features/filters/SearchBarFilter.vue";
import ToggleButtonFilter from "@/features/filters/ToggleButtonFilter.vue";
import ClearFilterButton from "@/features/filters/buttons/ClearFilterButton.vue";
import Separator from "@/components/header/Separator.vue";
import ControlPanel from "@/features/ControlPanel.vue";
import FilterPanel from "@/features/filters/FilterPanel.vue";
import LogoDatePanel from "@/features/masthead/LogoDatePanel.vue";
import HelpButton from "@/components/buttons/HelpButton.vue";
import ToggleFilterButton from "@/components/buttons/ToggleFilterButton.vue";
import ZoomControls from "@/components/buttons/ZoomControls.vue";
import ToggleFlyerOrientationButton from "@/components/buttons/ToggleFlyerOrientationButton.vue";
import ToggleFullscreenButton from "@/components/buttons/ToggleFullscreenButton.vue";
import pdfDownloadButton from "@/components/buttons/PdfDownloadButton.vue";
import shoppingListToggleButton from "@/components/buttons/ShoppingListToggleButton.vue";
import FilterDrawerToggleButton from "@/features/filters/buttons/FilterDrawerToggleButton.vue";
import SearchBar from "@/features/filters/SearchBarFilterStandAlone.vue";
import HamburgerMenuButton from "@/components/buttons/HamburgerMenuButton.vue";
import InlineFlyerSelector from "@/features/flyer-selector/inline/InlineFlyerSelector.vue";
import EmailSignupButton from "@/features/email-signup/emailSignupButton.vue";
import RangeFilter from "@/features/filters/range/RangeFilter.vue";
import ShareButton from "@/features/share/ShareButton.vue";
import FavsButton from "@/features/favourites/favsButton.vue";

//import vue from "vue";

const compDict = {
	filter: {
		'dropdown': FilterDropdown,
		'searchbar': SearchBarFilter,
		'toggle-button': ToggleButtonFilter,
		'clear-button': ClearFilterButton,
		'rangeList': RangeFilter
	},
	controlPanel: {
		'help': HelpButton,
		'filter-toggle': ToggleFilterButton,
		'zoom': ZoomControls,
		'orientation': ToggleFlyerOrientationButton,
		'fullscreen-toggle': ToggleFullscreenButton,
		'pdf-download': pdfDownloadButton,
		'other-flyers': null,
		'shopping-list': shoppingListToggleButton,
		'filter-drawer-toggle': FilterDrawerToggleButton,
		'search-bar': SearchBar,
		'hamburgerMenu': HamburgerMenuButton,
		'emailSignupButton': EmailSignupButton,
		'separator': Separator,
		'share': ShareButton,
		'favs': FavsButton
	},
	header: {
		filterPanel: FilterPanel,
		separator: Separator,
		controls: ControlPanel,
		mastHead: LogoDatePanel,
		hamburgerMenu: HamburgerMenuButton
	},
	app: {
		inlineFlyerSelector: InlineFlyerSelector
	}
}

/*for(let p in compDict) {
	const sects = compDict[p];
	console.log('CompDict:', sects);
	for(let s in sects) {
		const comp = sects[s];
		if(comp?.name){
			console.log('Register Comp:', comp);
			vue.component(comp.name, comp);
		}
	}
}*/

//export const featureCompDict = compDict;
export const filterDict = compDict.filter;
export const controlDict = compDict.controlPanel;

export const headerDict = compDict.header;

export const appDict = compDict.app;

/**
 * Search object and return a list of objects paths that contain the key
 * @param o - Object to search
 * @param key - Property to match
 * @param result - an array of object paths
 * @param depth - how deep to search
 * @param path
 * @returns null | String[]
 */
export function findPathsByKey(o, key, result = [], depth = 10, path = null) {
	if(depth <= 0)return null;
	for(let p in o) {
		const pv = o[p];
		if(p === key) {
			result.push(path);
		} else if (typeof pv === 'object') {
			findPathsByKey(pv, key, result, depth - 1, Array.isArray(o)? `${path}[${p}]`: (!path)? p: `${path}.${p}`);
		}
	}
	return result;
}


