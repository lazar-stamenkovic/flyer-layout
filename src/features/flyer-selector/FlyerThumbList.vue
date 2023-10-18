<template>
    <div class="flyer-thumb-list">
        <flyer-thumb-button
                v-for="flyer in thumbs"
                :key="flyer.title"
                :flyer-data="flyer"
        />
    </div>
</template>

<script>
import FlyerThumbButton from "@/features/flyer-selector/FlyerThumbButton.vue";
import {mapGetters} from "vuex";

export default {
	name: "FlyerThumbList",
	components: {FlyerThumbButton},
	computed: {
		...mapGetters('landingPage', ['sortedFlyers']),
		thumbs() {
        return this.sortedFlyers;
		}
	}
}
</script>

<style scoped>

</style>
