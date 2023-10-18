<script>
import featureMixin from "@/mixins/featureMixin";
import ParentComms from "@/classes/ParentComms";

export default {
	name: "favsButton",
	mixins:[featureMixin],
	data(){
		return {
			featurePath: 'favs',
			featureEvents: ['iframe-event-favs'],
			isFav: false
		}
	},
	mounted() {
		ParentComms.SendEvent('favs', { action: 'getState'});
	},
	methods: {
		handleClick() {
			ParentComms.SendEvent('favs', {action: 'toggle'});
		},
		onFeatureEvent(event, data) {
			console.log('Faves Event:' + event, data);
			const { state } = data?.data;
			this.isFav = state;
		}
	}
}
</script>

<template>
	<button class="btn" :class="{'is-fav':isFav}" @click="handleClick">
		<svg id="heart" viewBox="0 0 512 512">
			<path d="m255 90c-23-28-62-64-116-64-76 0-139 64-139 145 0 18 4 37 11 54 12 32 73 95 157 180 31 31 58 58 70 74 5 5 11 7 18 7 7 0 13-3 18-7 12-16 39-42 70-74 84-85 145-148 157-180 7-18 11-36 11-54-1-81-64-145-140-145-54 0-93 36-117 64z m209 81c0 12-2 24-7 36-10 25-96 111-147 164-21 21-40 41-55 56-14-16-33-35-55-56-51-53-137-139-146-164-5-12-7-24-7-36 0-54 41-97 93-97 33 0 64 23 97 70 4 7 11 11 19 11 8 0 15-4 19-11 32-47 63-70 97-70 51 0 92 43 92 97z"/>
		</svg>
	</button>
</template>

<style scoped lang="scss">
button {
  &.is-fav {
    background-color: red;
    fill: #fff;
  }
}
svg {
  width: 1rem;
  height: 1rem;
}
</style>
