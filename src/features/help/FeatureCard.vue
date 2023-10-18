<template>
<div class="feature-card">
	<img class="icon" :src="feature.icon" />
	<div class="label">{{ feature.label }}</div>
	<div class="desc">{{ feature.desc }}</div>
</div>
</template>

<script>
export default {
	name: "FeatureCard",
	props:{
		feature: {
			type: Object
		}
	}
}
</script>

<style lang="scss" scoped>
	.feature-card{
		display: flex;
		flex-direction: column;
	}
</style>
