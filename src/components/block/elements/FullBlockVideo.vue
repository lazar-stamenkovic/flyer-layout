<template>
	<div class="full-block-video" :class="{ 'pop-video': !isPop }">
		<video ref="video" :autoplay="isAutoplay"  @ended="handleDelay"  :poster="posterSource" muted playsinline>
			<source :src="source" type="video/mp4" />
		</video>
        <div class="buttons_set" :class="{ customMetro: isMetro }">
				<img :src="playBtnIcon" tabindex="0" @click="toggleVideoPlay" alt="">
				<img v-if="hasAudio" :src="muteBtnIcon" tabindex="0" @click="toggleVideoMute"
					alt="">
			    <img class="closeBtn" src="/icons/in-block-video/close.svg" tabindex="0"
					@click="closeInBlockVideo" alt="close">
		</div>
    </div>
</template>

<script>
import featureMixin from "@/mixins/featureMixin";
import blockElementMixin from "@/mixins/blockElementMixin";
import { mapGetters } from "vuex";
import AppConfig from "@/classes/AppConfig";

export default {
	mixins: [featureMixin, blockElementMixin],
	data() {
		return {
			videoPlaying: true,
			videoMuted: false,
			featurePath: 'blockVideos.fullBlock'
		}
	},
	props: {
		posterSource: String,
	},
	mounted() {
		const video = this.$refs.video;
		video.addEventListener('play', this.onVideoEvent);
		this.videoMuted = video.muted;
		if (this.blockData.inblockAutoplay || this.videoPlaying ) {
			
           video.play();
           this.videoMuted = video.muted;
		}


	},
	beforeDestroy() {
		const video = this.$refs.video; 
		video.removeEventListener('play', this.onVideoEvent)
	},
	computed: {
		...mapGetters('config', ['branding']),
		isVideo() {
			const products = this.blockData?.products || [];
			const prod = products.find((prod) => {
				return ((prod?.sku || '').toLowerCase() === 'inblock' || (prod?.sku || '').toLowerCase() === 'inblocktc');
			})
			return prod;

		},
		isMetro(){
            if(AppConfig.AppConf?.title.toLowerCase().includes("metro".toLowerCase())){
                return true
            }
            else return false
        },
		hasAudio() {
			return this.isVideo?.inblockAudio ?? false;

		},
		source() {
			return `${this.isVideo.url}${this.config?.accessKey || ''}`;

		},
		isAutoplay() {
			//return this.isMetro ? true : this.isVideo?.inblockAutoplay ?? true;
			return this.isVideo?.inblockAutoplay ?? true;

		}, 
		isLoop() {
			return this.isVideo?.inblockLoop ?? true;

		},
		isPop() {
			return this.isVideo?.noPop ?? false;

		},
		muteBtnIcon() {
			return this.videoMuted ? '/icons/in-block-video/unmute.svg' : "/icons/in-block-video/mute.svg";
		},
		playBtnIcon() {
			return this.videoPlaying ? "/icons/in-block-video/pause.svg" : "/icons/in-block-video/play.svg";
		}
	},
	methods: {
		play() {
			this.$refs.video.play();
		},
		pause() {
			this.$refs.video.pause();
		},
		onVideoEvent() {
			const video = this.$refs.video;
			this.videoPlaying = !video.paused;

		},
		toggleVideoPlay() {
			const isPlaying = !this.$refs.video.paused;
			this.videoPlaying = !isPlaying;
			if (isPlaying) {
				this.pause();
			}
			else
				this.play();
		},
		toggleVideoMute() {
			const video = this.$refs.video;
			this.videoMuted = !video.muted;
			video.muted = !video.muted;
			/*let vid = document.getElementById(`${this.id}`);
						!this.videoMuted ?  vid.muted=true : vid.muted=false*/
		},
		closeInBlockVideo() {
			this.$emit('handleUserClose')
		},
		handleDelay() {
			if (this.isLoop) {
				this.videoPlaying = false;
				const video = this.$refs.video;
				this.$emit('videoClosed')
				setTimeout(() => {
					this.videoPlaying = true;
					video.play();
				}, this.isVideo?.inblockDelay * 1000);
				// this.loopEnabled = true;
				// this.$refs.currentTime = 0;
			} else {
				this.videoPlaying =  false;
				this.$emit('handleUserClose')
			}

		}
	}


}
</script>

<style lang="scss" scoped>
.full-block-video {
	position: relative;


	>.buttons_set {
		bottom: 2px;
		width: 100%;
		z-index: 1005;
		display: flex;
		justify-content: flex-start;
		align-items: center;
		position: absolute;
		height: 10%;
		padding: 0 10px;
		background: rgba(0, 0, 0, 0.5);
		transition: opacity 300ms;
		//transition-delay: 2s;
		opacity: 0;
		font-size: 16px;

		//&:hover{
		//  transition-delay: unset;
		//  opacity: 1;
		//}
			img {
				width: 1.8em;
				max-width: 100%;
				height: auto
			}
		
       
	}

	&:hover>.buttons_set {
		transition-delay: unset;
		opacity: 1;
	}

	.buttons_set img {
		cursor: pointer;
		left: 10%;
		margin-left: 10px;
		pointer-events: all;
	}
	.buttons_set.customMetro img {
		margin-left: 16px;
		pointer-events: all;
	}

	.closeBtn {
		border-radius: 50px;
		// background-color: red;\
		margin-right: 10px;
		border: none;
		margin-left: auto !important;
		right: 5% !important
	}

	video {
		width: 100%;
		height: 100%;
		background: transparent;
		object-fit: fill !important;
		transition: border-color 0.2s, box-shadow 0.2s, transform 0.2s;
	}
}
.full-block-video.pop-video {
	    &:hover,
	    &:focus {
		transform: scale(1.02);
		box-shadow: 0 0px 50px rgba(0, 0, 0, 0.3);
		z-index: 9999;
		outline: none;
	}
}
</style>
