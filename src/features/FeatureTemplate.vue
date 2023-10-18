<template>
	<div :class="`feature-${config.name}`" v-bind="config.attrs"></div>
</template>

<script>
import featureMixin from "@/mixins/featureMixin";

export default {
	name: "FeatureTemplate",
	mixins:[featureMixin]
}
</script>

<style scoped>

</style>
