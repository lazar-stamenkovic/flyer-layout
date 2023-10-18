import ParentComms from "@/classes/ParentComms";

const state = {};
const actions = {
	triggerIFrameEvent({dispatch}, {event, data}) {
		dispatch('events/triggerEvent', {event: `iframe-event-${event}`, data}, {root:true} )
	},
	sendMessage({}, {event, data}) {
		ParentComms.SendData({
			direction: 'from-iframe',
			event,
			data
		})
	}
};

export default {
	namespaced: true,
	state,
	actions
}
