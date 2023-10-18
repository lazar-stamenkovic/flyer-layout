<script>
import featureMixin from "@/mixins/featureMixin";
import {mapActions, mapState} from "vuex";
import ParentComms from "@/classes/ParentComms";

export default {
	name: "RaddarSync",
	mixins:[featureMixin],
	data(){
		return {
			featurePath: 'share',
			featureEvents: ['iframe-event-zoom', 'iframe-event-orientation', 'productRegionClick']
		}
	},
	computed:{
		...mapState('scale',['zoomLevel'])
	},
	methods:{
		...mapActions('scale', ['setZoomLevel']),
		...mapActions(['setColumnView']),
		onFeatureEvent(event, data){
			console.log('!!!Feature Event:', event, data)
			const value = data?.data;
			switch(event){
				case 'iframe-event-zoom':
					if(!isNaN(value?.scale)){
						const scale = (value.scale - 100)/100;
						this.setZoomLevel( scale);
					}
				break;
				case 'iframe-event-orientation':
					this.setColumnView(value?.isColumnView)
				break;
				case 'productRegionClick':
					console.log('RaddarSync Product RegionClick:', data);
					ParentComms.SendEvent('dealClick', data?.product)
				break;
			}
		}
	},
	watch:{
		zoomLevel(val) {
			ParentComms.SendEvent('zoom', {scale: val});
		}
	}

}
</script>

<template>
<fragment></fragment>
</template>

<style scoped lang="scss">

</style>
