<template>
	<svg class="rotate-chevron"  :class="{[direction]: true}"  viewBox="0 0 256 512">
		<path d="M119.5 326.9L3.5 209.1c-4.7-4.7-4.7-12.3 0-17l7.1-7.1c4.7-4.7 12.3-4.7 17 0L128 287.3l100.4-102.2c4.7-4.7 12.3-4.7 17 0l7.1 7.1c4.7 4.7 4.7 12.3 0 17L136.5 327c-4.7 4.6-12.3 4.6-17-.1z" fill="currentColor"></path>
	</svg>
</template>

<script>
export default {
	name: "RotateChevron",
	props:{
		direction:{
			type: String,
			default: "down"
		}
	}
}
</script>
<style scoped>
  .rotate-chevron {
		width: inherit;
		transition: transform .1s ease;
}
 .bouncy-arrow.left {
			transform: rotate(90deg);
			animation: bounceLeft 1.2s infinite;
		}
		.bouncy-arrow.right {
			transform: rotate(-90deg);
			animation: bounceRight 1.2s infinite;
		}
		.bouncy-arrow.up {
			transform: rotate(180deg);
			animation: bounceUp 1.2s infinite;
		}
		.bouncy-arrow.down {
			transform: rotate(0deg);
			animation: bounceDown 1.2s infinite;
		}
	
  @keyframes bounceLeft {
	0%, 100%{
		transform: rotate(90deg) translateY(-10px);
	}
	50% {
		transform: rotate(90deg) translateY(10px);
	}
  }
	
  @keyframes bounceRight {
	0%, 100%{
		transform: rotate(-90deg) translateY(-10px);
	}
	50% {
		transform: rotate(-90deg) translateY(10px);
	}
  }
  
  @keyframes bounceUp{
	0%, 100%{
		transform: rotate(180deg) translateY(-10px);
	}
	50% {
		transform: rotate(180deg) translateY(10px);
	}
  }
  @keyframes bounceDown{
	0%, 100%{
		transform: rotate(0deg) translateY(-10px);
	}
	50% {
		transform: rotate(0deg) translateY(10px);
	}
  }

		
</style>
<style lang="scss" scoped>
  .rotate-chevron {
		width: inherit;
		transition: transform .1s ease;
		&.left {
			transform: rotate(90deg);
		}
		&.right {
			transform: rotate(-90deg);
		}
		&.up {
			transform: rotate(180deg);
		}
	}
</style>


