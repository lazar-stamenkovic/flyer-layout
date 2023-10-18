<script>
import featureMixin from "@/mixins/featureMixin";
import {mapActions} from "vuex";

export default {
	name: "ShareButton",
	mixins:[featureMixin],
	data(){
		return {
			featurePath: 'share',
			featureEvents: ['iframe-event-share']
		}
	},
	methods:{
		...mapActions('events', ['triggerEvent']),
		handleClick(){
			this.triggerEvent({event: 'share-button-click', data: this})
		}/*,
		onFeatureEvent(event, data){

		}*/
	}
}
</script>

<template>
	<button class="btn" @click="handleClick">
		<svg viewBox="0 0 512 512">
				<path d="m420 329c-28 0-54 13-71 35l-170-84c2-8 4-16 4-24 0-8-2-16-4-24l170-84c17 22 43 35 71 35 51 0 92-41 92-92 0-50-41-91-92-91-50 0-91 41-91 91 0 8 1 16 3 24l-169 85c-17-22-44-35-72-35-50 0-91 41-91 91 0 50 41 91 91 91 28 0 55-13 72-35l169 85c-10 38 5 78 38 100 33 21 75 20 106-4 31-24 44-65 31-102-13-37-48-62-87-62z m0-292c31 0 55 24 55 54 0 31-24 55-55 55-30 0-55-24-55-55 0-30 25-54 55-54z m-329 274c-30 0-54-25-54-55 0-30 24-55 54-55 31 0 55 25 55 55 0 30-24 55-55 55z m329 164c-30 0-55-24-55-54 0-31 25-55 55-55 31 0 55 24 55 55 0 30-24 54-55 54z"/>
		</svg>
	</button>
</template>

<style scoped lang="scss">
	svg {
	  width: 1rem;
	  height: 1rem;
	}
</style>
