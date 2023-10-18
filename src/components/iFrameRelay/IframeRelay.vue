<script>
/**
 * Listens for messages from parent container and triggers feature events
 * Parent messages should match
 * {
 *   event:sting -> event name
 *   direction:string -> must equal 'to-iframe'
 *   data:any -> data passed from parent
 * }
 */

import {mapActions} from "vuex";

export default {
	name: "IframeRelay",
	mounted() {
		window.addEventListener("message", this.onMessage);
	},
	beforeDestroy() {
		window.removeEventListener('message', this.onMessage);
	},
	methods:{
		...mapActions('events', ['triggerEvent']),
		onMessage(msg) {
			const { origin, data, source } = msg;
			//console.log("Message:", msg);
			if (data?.event && data?.direction === "to-iframe") {
				console.log('Iframe Message Received:', data);
				const event = data.event;
				this.triggerEvent({
					event: `iframe-event-${event}`,
					data:{ origin, source , data: data?.data }
				})
			}
		}
	}
}
</script>

<template>
	<fragment></fragment>
</template>

<style scoped lang="scss">

</style>
