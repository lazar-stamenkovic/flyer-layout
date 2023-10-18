<template>
	<div class="flyer-thumb-button" :class="{active: isActive, preview: isPreview}" @click="gotoFlyer">
		<aspect-img class="thumbnail" :src="thumbnail" aspect-ratio="96:72" />
		<div class="details">
			<div class="title">{{ title }}</div>
			<div class="dates">{{ `${valid} ${startDate} - ${endDate}`}}</div>		</div>
		<button class="btn goto-flyer">{{ buttonCaption }}</button>
	</div>
</template>

<script>
import featureMixin from "@/mixins/featureMixin";
import moment from "moment";
import {mapGetters} from "vuex";
import AspectImg from "@/components/image/AspectImg.vue";
import Rest from "@/api/Rest";

export default {
	name: "FlyerThumbButton",
	components: {AspectImg},
	mixins:[featureMixin],
	props:{
		flyerData:{
			type: Object
		}
	},
	data(){
		return {
			featurePath: 'flyerSelector.flyerThumb'
		}
	},
	computed:{
		...mapGetters('landingPage', ['currentFlyer']),
		...mapGetters(['language', 'content']),
		dateFormat(){
			return this.config?.dateFormat || '';
		},
		startDate() {
			return this.formatDate(this.flyerData.startDate);
		},
		endDate() {
			return this.formatDate(this.flyerData.endDate);
		},
		flyerId(){
			return this.flyerData.title;
		},
		isActive(){
			return this.flyerId === this.currentFlyer.title;
		},
		thumbnail() {
			return this.flyerData?.thumbnail;
		},
		valid() {
			return this.content.landing.valid;
		},
		title(){
			return this.flyerData?.flyerTitle;
		},
		flyerType() {
			return this.flyerData?.flyerType;
		},
		isPreview(){
			return this.flyerType === 'preview';
		},
		buttonCaption(){
			return this.isPreview? this.content?.flyerSelector?.previewFlyer: this.content?.flyerSelector?.viewFlyer;
		}

	},
	methods:{
		formatDate(d) {
			return moment.utc(d).locale(this.language).format(this.dateFormat);
		},
		gotoFlyer(){
			if(!this.isActive)Rest.NavigateToFlyer(this.flyerId);
		}
	}

}
</script>

<style lang="scss">
	.flyer-thumb-button {
		padding: 0.5em;
		color: #000;
		font-size: 0.7em;
		display: flex;
		flex-direction: column;
		row-gap: 0.5em;
		border: solid 2px #aeaeae;
		justify-content: space-between;
		cursor: pointer;
		&.active{
			box-shadow: 0px 0px 6px 0px rgb(0 0 0 / 50%);
		}
		&.active{
			border: solid 2px var(--secondary-color);
		}
		&:hover{
			button {
				text-decoration: underline;
			}
		}
		.dates{
			font-weight: bold;
		}
		img {
			width: 100%;
			border: solid 1px #aeaeae
		}

		&.preview{
			button.goto-flyer{
				background-color: #aeaeae;
			}
		}

		button.goto-flyer{
			color: #fff;
			width: 100%;
			background-color: var(--secondary-color);
			border: none;
			border-radius: 0;
			font-size: 1em;
			height: 2.4em;
		}
		.title{
			font-size: 0.9em;
		}
	}
</style>
