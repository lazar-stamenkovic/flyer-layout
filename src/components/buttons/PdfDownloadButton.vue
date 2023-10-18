<template>
	<a v-if="enabled" v-tooltip="{ content: content.downloadPDF}" :href="downloadablePDF" class="pdf-btn btn" data-tour-item="pdf"
	   download tabindex="0" @click="closeHamburgerMenu">
		<img :alt="content.downloadPDF" src="/images/icon-pdf.svg"/></a>
</template>

<script>
import {mapGetters} from "vuex";
import featureMixin from "@/mixins/featureMixin";

export default {
	name: "PdfDownloadButton",
	mixins:[featureMixin],
	data(){
		return {
			featurePath: 'pdfDownload'
		}
	},
	computed:{
		...mapGetters(["content"]),
		...mapGetters('config', ['features']),
		...mapGetters('landingPage', ['downloadablePDF']),
	},
	methods: {
		closeHamburgerMenu() {
			this.$parent.isHidden = !this.$parent.isHidden
		}
	}
}
</script>

<style scoped>

</style>
