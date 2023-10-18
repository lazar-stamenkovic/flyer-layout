<template>
	<div class="modal-wpr">
		<div v-click-outside="closeVideo" class="modal">
			<div class="modal-header">
				<button aria-label="Close" class="closeBtn" data-dismiss="modal" type="button" @click="closeVideo">
					<img src="/images/icon-close-white.svg" alt="" />
				</button>
			</div>
			<video ref="video" :src="videoSrc" autoplay controls @keyup.esc="closeVideo"></video>
		</div>
	</div>
</template>

<script>
import { mapActions, mapGetters, mapState } from 'vuex'
import Lytics from "@/classes/Lytics";
import ClickOutside from 'vue-click-outside'
import featureMixin from "@/mixins/featureMixin";

export default {
	directives: {
		ClickOutside
	},
	mixins: [featureMixin],
	data() {
		return {
			featurePath: "videoModal"
		}
	},
	computed: {
		...mapState(['currentVideo']),
		...mapGetters('config', ['branding']),
		accessKey() {
			return this?.config?.accessKey || '';
		},
		videoSrc() {
			return `${this.currentVideo}`;
		}
	},


	methods: {
		...mapActions(['setCurrentVideo']),

		closeVideo() {
			this.setCurrentVideo(null);
		},

		videoLoadedLytics() {
			console.log('video length', this.$refs.video.duration)
			Lytics.TriggerVideoLength({
				length: this.$refs.video.duration
			})
		},
	},

	mounted() {
		this.$refs.video.focus();
		this.$refs.video.addEventListener('loadeddata', this.videoLoadedLytics, false)
	},

	beforeDestroy() {
		this.$refs.video.removeEventListener('loadeddata', this.videoLoadedLytics)
	}
}
</script>

<style lang="scss" scoped>
.modal-header {
	display: flex !important;
	flex-flow: row-reverse !important;
}

.closeBtn {
	width: 25px;
	height: 25px;
	position: absolute;
	z-index: 99;
	border-radius: 50px;
	background-color: red;
	border: none;
	margin: 10px;
}

.modal-wpr {
	position: absolute;
	top: 0;
	right: 0;
	bottom: 0;
	left: 0;
	background-color: rgba(0, 0, 0, 0.75);
	z-index: 99;
	display: flex;
	justify-content: center;
	align-items: center;
	flex-flow: column;

	.modal {
		max-width: 100%;

		video {
			width: 100%;
			max-height: calc(100vh - 2em);
			max-width: calc(100vw - 2em);
		}
	}
}
</style>
