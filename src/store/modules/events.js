import AppConfig from "@/classes/AppConfig";
import { isFunction, isObject} from "lodash";

let _listenerId = 0;

const state = {
	listeners: {}
};
const getters = {
	events(state, getters, rootState, rootGetters) {
		return rootGetters["config/settings"]?.events || {};
	}
};
const actions = {
	triggerEvent({ getters, state } , {event, data}) {
		console.log('Events.triggerEvent:', event, data);
		if(getters.events[event]){
			AppConfig.ParseEvent(getters.events[event], {__self: data});
		}
		const events = state.listeners[event];
		if(isObject(events)) {
			for(let p in events){
				const func = events[p];
				if(isFunction(func))func(event, data);
			}
		}
	},
	addFeatureEventListener({ state }, {event, func}){
		const id = func?._listenerId || ++_listenerId;
		if(!state.listeners[event]) {
			state.listeners[event] = {};
		}
		func._listenerId = id;
		state.listeners[event][id] = func;
		return id;
	},
	removeFeatureEventListener({state}, {event, func}) {
		if(func._listenerId) {
			return delete state.listeners[event][func._listenerId];
		}
	}
};

export default {
	namespaced: true,
	state,
	getters,
	actions
};
