<template>
	<div class="zoom-group" data-tour-item="zoom">
		<button v-tooltip="{ content: content.zoomOut}" :aria-label="content.zoomOut" :disabled="currentZoom === zoomMin" class="zoom-out"
		        tabindex="0" @click="zoomOutComponent"><img
				:alt="content.zoomOut" src="/images/icon-decrease.svg"/></button>
		<div class="zoom-percent">{{ displayedZoomPercentage }}%</div>
		<button v-tooltip="{ content: content.zoomIn}" :aria-label="content.zoomIn" :disabled="currentZoom === zoomMax" class="zoom-in"
		        tabindex="0" @click="zoomInComponent"><img
				:alt="content.zoomIn" src="/images/icon-increase.svg"/></button>
		<button v-tooltip="{ content: content.resetZoom}" :aria-label="content.resetZoom" :disabled="currentZoom === 0"
		        class="zoom-100" @click="zoomNormalComponent">
			<svg height="16" width="22" xmlns="http://www.w3.org/2000/svg">
				<path
						d="M18 4l-4 4h3c0 3.31-2.69 6-6 6a5.87 5.87 0 01-2.8-.7l-1.46 1.46A7.93 7.93 0 0011 16c4.42 0 8-3.58 8-8h3l-4-4zM5 8c0-3.31 2.69-6 6-6 1.01 0 1.97.25 2.8.7l1.46-1.46A7.93 7.93 0 0011 0C6.58 0 3 3.58 3 8H0l4 4 4-4H5z"
						fill="currentColor" fill-rule="nonzero"/>
			</svg>
		</button>
	</div>
</template>

<script>
import {mapActions, mapGetters, mapState} from "vuex";

export default {
	name: "ZoomControls",
	computed: {
		...mapGetters(['content']),
		...mapState('scale', ['zoomMin', 'zoomMax', 'zoomLevel']),
		currentZoom() {
			return this.zoomLevel;
		},
		displayedZoomPercentage() {
			return Math.round(100 + (this.currentZoom * 100));
		}
	},
	methods: {
		...mapActions('scale', ['zoomIn', 'zoomOut', 'zoomNormal']),
		zoomInComponent() {
			this.zoomIn();
			this.$emit('change', this.currentZoom);
		},
		zoomOutComponent() {
			this.zoomOut();
			this.$emit('change', this.currentZoom);
		},
		zoomNormalComponent() {
			this.zoomNormal();
			this.$emit('change', this.currentZoom);
		},
	}
}
</script>

<style scoped>
.zoom-group {
	display: flex;
	justify-self: end;
	/*margin: 0 2px;*/
	border: 1px solid #BBB;
	border-radius: 4px;
	height: 34px;
}

.zoom-group > * {
	background: none;
	border: 0;
}

.zoom-in {
	font-size: 0px;
	line-height: 0;
}

.zoom-in:disabled, .zoom-out:disabled, button:disabled {
	opacity: 0.5;
	cursor: inherit;
	pointer-events: none;
}

.zoom-percent {
	font-size: 14px;
	color: #545454;
	display: flex;
	align-items: center;
	justify-content: center;
	padding-bottom: 1px;
	width: 3em;
}

.zoom-100 {
	font-size: 14px;
	padding: 0 8px;
	border-left: 1px solid #BBB;
}

.zoom-group > button {
	border-radius: 0px;
}

.zoom-out {
	font-size: 0px;
	line-height: 0;
}

.zoom-in, .zoom-out {
	padding: 0px;
	width: 30px;
}

.zoom-out img, .zoom-in img {
	vertical-align: middle;
}

</style>
