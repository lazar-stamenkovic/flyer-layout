import isItMobile from 'is-mobile';
//import IFrameComm from "../../classes/IFrameComm";
//import events from "@/store/modules/events";
//import Lytics from "@/classes/Lytics";
//import ResizeObserverPolyfill from "resize-observer-polyfill";

/*top.addEventListener('fullscreenchange', (e) => {
    console.log('FullScreen Change:', e);
    state.fullScreenToggle = !!document.fullscreenElement
})*/

const hasFullscreenSupport = typeof document.documentElement.requestFullscreen === 'function';


const state = {
    size: {
        innerWidth: window.innerWidth,
        outerWidth: window.outerWidth,
        innerHeight: window.innerHeight,
        outerHeight: window.outerHeight
    },
    fullScreenToggle: false,
}

const modes = [{
        // adjusted breakpoints so end result is 600 and 800... not sure why there's a difference. something to do with "transform: scale()"?
        breakpoint: 698,
        mode: 'mobile'
    },
    {
        breakpoint: 1024,
        mode: 'tablet'
    }
]

const getters = {

    isMobile() {
        return isItMobile();
    },

    totalPages(state, getters, rootState) {
        return rootState.pages.filter(page => page.blocks.length && !page.isAdPage).length;
    },

    displayMode(state) {
        // column view just spoofs the tablet mode so displayMode needs to be set to 'tablet'
        //const mobileBreakpoint = modes.find(mode => mode.mode === 'mobile').breakpoint;
        const currentWidth = state.size.innerWidth;

        //if (rootState.columnView && currentWidth >= mobileBreakpoint) return 'tablet'; // Seems to be what is expected when in column mode... weird but ok..

        for (let i = 0; i < modes.length; i++) {
            if (modes[i].breakpoint >= currentWidth) return modes[i].mode;
        }
        return 'desktop'
    },

    flyerOrientation(state, getters, rootState) {
        if (getters.displayMode !== 'desktop') return 'vertical';
        return rootState.columnView ? 'vertical' : 'horizontal';
    },

    fullScreenConfig(state, getters, rootState, rootGetters) {
        return rootGetters?.["config/features"]?.fullScreen || {};
    },

    isFullscreen(state, getters) {
        const config = getters.fullScreenConfig;
        if(config?.detectMode === 'auto') {
            return (state.size?.innerWidth === screen.width && state.size?.innerHeight === screen.height) || document?.fullscreenElement;
        }
        return state.fullScreenToggle;
    }
}

const actions = {

    async toggleFullScreen({ dispatch, getters }) {
        await dispatch('setFullScreenState', !getters.isFullscreen);
        /*const ts = !state.fullScreenToggle;
        commit('SET_FULLSCREEN_STATE', ts);
        dispatch('events/triggerEvent', {event: 'fullscreen-toggle', data: { state: ts }}, {root:true} )*/
        //events.actions.triggerEvent('fullscreen-toggle', { state: ts });
        //Lytics.TriggerFullScreenToggle();
        /*window.rudderanalytics.track('ToggleFullScreen', { category: 'ScreenSizeChange' });*/
        //IFrameComm.FullScreenState(ts);
        // window.parent.postMessage(JSON.stringify({ fullscreen: ts }), "*");
    },

    async setFullScreenState({commit, getters, dispatch}, isFullScreen) {
        const config = getters.fullScreenConfig;
        if(config?.trigger === 'internal' && hasFullscreenSupport) {
            if(isFullScreen) {
                await document.documentElement.requestFullscreen({ navigationUI: 'hide' });
            } else {
                await document.exitFullscreen();
            }
        }
        commit('SET_FULLSCREEN_STATE', isFullScreen);
        dispatch('events/triggerEvent', {event: 'fullscreen-toggle', data: { state: isFullScreen }}, {root:true} )
    },

    async setFullScreen({ dispatch }, isFullScreen) {
        await dispatch('setFullScreenState', isFullScreen);
        //commit('SET_FULLSCREEN_STATE', isFullScreen);
        /*window.rudderanalytics.track("ToggleFullScreen", {
          category: "ScreenSizeChange",
        });*/
        //Lytics.TriggerFullScreenToggle();
        //IFrameComm.FullScreenState(isFullScreen)
        // window.parent.postMessage(JSON.stringify({ fullscreen: isFullScreen }), "*");
    },

    async exitFullScreen({ dispatch }) {
        await dispatch('setFullScreenState', false);
        //commit('EXIT_FULLSCREEN_STATE');
        /*window.rudderanalytics.track("ToggleFullScreen", { category: "ScreenOrientationChange", });*/
        //Lytics.TriggerFullScreenToggle();
        //IFrameComm.FullScreenState(false)
        //window.parent.postMessage(JSON.stringify({ fullscreen: false }), "*");
    },

    handleWindowResize({ commit }) {
        commit("REFRESH_WINDOW_SIZE")
    }
}

const mutations = {

    REFRESH_WINDOW_SIZE(state) {
        state.size = {
            innerWidth: window.innerWidth,
            outerWidth: window.outerWidth,
            innerHeight: window.innerHeight,
            outerHeight: window.outerHeight
        };
    },

    SET_FULLSCREEN_STATE(state, val) {
        state.fullScreenToggle = val;
    },

    EXIT_FULLSCREEN_STATE(state) {
        state.fullScreenToggle = false;
    }
}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
};

