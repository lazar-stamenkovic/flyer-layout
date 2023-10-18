import Page from "@/classes/Page";
import ParentComms from "@/classes/ParentComms";

const state = {
	zoomLevel: 0.0,
	zoomMin: -0.75,
	zoomMax: 1.5,
	zoomIncrement: 0.25,
	minScale: 0.125,
	baseScale: 1,
	flyerHeight: null,
	transformOrigin: 0,
	scrollOffset: 0,
	currentScale: 1
}

// eslint-disable-next-line no-unused-vars
// const dpiDim = {
// 	96: {
// 		w: 187,
// 		h: 172
// 	},
// 	150: {
// 		w: 293,
// 		h: 269
// 	},
// 	200: {
// 		w: 390,
// 		h: 359
// 	},
// 	250: {
// 		w: 488,
// 		h: 449
// 	},
// 	300: {
// 		w: 585,
// 		h: 538
// 	}
// }

/*const dpiDim = {
	72: {
		w: 140,
		h: 182
	},
	144: {
		w: 280,
		h: 364
	},
	216: {
		w: 420,
		h: 546
	},
	288: {
		w: 560,
		h: 728
	}
}*/

const getZoomDPI = (currentScale, dpiDim, dpiNorm) => {
	let zoomDpi = (currentScale * dpiNorm) * window.devicePixelRatio;
	// console.log("current scale is " + currentScale)
	// console.log("zoom DPI is " + zoomDpi)

	if(window.visualViewport){
		zoomDpi = zoomDpi * window.visualViewport.scale;
		// console.log("window.visualViewport true or false " + window.visualViewport.scale)
		// console.log("window.visualViewport " + zoomDpi)
	}

	const dpis = Object.keys(dpiDim).sort((a,b) => {
		return parseInt(a, 10) - parseInt(b, 10);
	});

	// console.log('DPIs:', dpis);
	// console.log('zoomDPI:', zoomDpi);

	for(let i = 0; i < dpis.length; i++){
		const dpi = dpis[i];
		if(zoomDpi <= dpi)return dpi;
	}

	/*for(let dpi in dpiDim){
		if(zoomDpi <= dpi)return dpi;
		// console.log("for loop dpi in dpiDIM is " + dpi)
	}*/

	return dpis.pop();
}

const getters = {

	defPage(state, getters, rootState) {
		const pages = rootState.pages;
		const dp =  pages.find((page) => {
			return page.isAdPage === false;
		})

		Page.SetDefPage(dp);

		return dp;

	},

	defPageGrid(state, getters, rootState, rootGetters){
		if(getters.defPage){
			return getters.defPage.grids[rootGetters["screen/displayMode"]];
		}
		return null;
	},

	unitWidth(state, getters){
		const pages = getters.defPage;
		if(pages){
			return pages.unitWidth;
		}
		return 0;
	},

	unitHeight(state, getters){
		const pages = getters.defPage;
		if(pages){
			return pages.unitHeight;
		}
		return 0;
	},

	DPIs(state, getters) {
		const d = {};
		const avc = {};
		const blocks = getters.defPage.blocks;
		blocks.forEach((block) => {
			const colSpan = block.colSpan;
			const rowSpan = block.rowSpan;
			block.images.forEach((image) => {
				const res = image.resolution;
				if(!d[res]) {
					d[res] = {
						h:0,
						w:0
					};
					avc[res] = 0;
				}
				avc[res]++;
				d[res].h += image.height / rowSpan;
				d[res].w += image.width / colSpan;
			})
		})
		for(let p in d){
			d[p].h = d[p].h / avc[p];
			d[p].w = d[p].w / avc[p];
		}
		return d;
	},

	DPINormal(state, getters) {
		const dpis = getters.DPIs;
		const uw = getters.unitWidth;
		const uh = getters.unitHeight;
		let closest = null;
		for(let p in dpis) {
			if(!closest) {
				closest = p;
				continue;
			}
			const dpi = dpis[p];
			const ldpi = dpis[closest];
			const delta = Math.abs(uw - dpi.w) + Math.abs(uh - dpi.h);
			const ldelta = Math.abs(uw - ldpi.w) + Math.abs(uh - ldpi.h);
			if(delta < ldelta)closest = p;
		}
		return closest;
	},

	/*currentScale(state){
		return Math.max(state.baseScale + (state.zoomLevel * state.baseScale), state.minScale);
	},*/
	imageDPI(state, getters){
		//const fo = rootGetters["screen/flyerOrientation"];
		const dpi = getZoomDPI(state.currentScale, getters.DPIs, getters.DPINormal);
		// console.log("dpi returned from imageDPI() " + dpi)
		return dpi;

		/*if(fo == 'horizontal' || dpi == 300){
			return dpi;
		} else {
			if (!rootState.screen.gridBounds) return dpi;
			const sw = rootState.screen.gridBounds.width;
			const cols = 5;
			const tWidth = dpiDim[getZoomDPI(1)].w * cols;
			const cs = (sw / tWidth) * state.currentScale;
			return getZoomDPI(cs);
		}*/
	}
}

const actions = {
	// eslint-disable-next-line no-unused-vars
	setZoomLevel({ commit, getters }, val){
		commit("SET_ZOOM_LEVEL", val);
	},
	zoomIn({ dispatch, state }){
		// console.log("called store > zoomIn");
		dispatch("setZoomLevel", state.zoomLevel + state.zoomIncrement);
	},
	zoomOut({ dispatch, state }){
		// console.log("called store > zoom out");
		dispatch("setZoomLevel", state.zoomLevel - state.zoomIncrement);
	},
	zoomNormal( {dispatch }){
		dispatch("setZoomLevel", 0);
	},
	updateScale( { commit }, val ){
		//console.log('Update Scale:', val);
		commit('SET_CURRENT_SCALE', val);
	}
}

const mutations = {
	SET_CURRENT_SCALE(state, val){
		state.currentScale = val;
		// console.log("mutation of current scale is " + state.currentScale)
	},

	SET_ZOOM_LEVEL(state, val){
		let newZoom = val;
		const zoomMin = state.zoomMin;
		const zoomMax = state.zoomMax;

		//console.log(`SET_ZOOM_LEVEL - \n\tzoomMin = ${zoomMin} \n\tzoomMax = ${zoomMax}\n\tnewZoom = ${newZoom}`);

		if(newZoom < zoomMin)newZoom = zoomMin;
		if(newZoom > zoomMax)newZoom = zoomMax;

		state.zoomLevel = newZoom;
		ParentComms.SendEvent('zoom', {scale: newZoom});
	}
}

export default {
	namespaced: true,
	state,
	getters,
	actions,
	mutations,
};

/**
 * Gets the image object (with resolution property) that is closest to provided dpi. Resolves to higher dpi if equal not found
 * @param dpi
 * @param images
 * @returns {*}
 */
export function getClosestDPI(dpi, images) {
	const img = Object.assign([], images);
	img.sort((a, b) => {
		return a.resolution - b.resolution;
	})

	for (let i = 0; i < img.length; i++) {
		if (img[i].resolution >= dpi) return img[i];
	}
}
