<template>
	<div class="help-screen-item">
		<div v-if="type === 'html'" v-html="itemHtml" />
		<fragment v-else>
			<div v-if="iconHtml" class="icon" v-html="iconHtml"></div>
			<img v-else class="icon" v-bind="icon"/>
			<div class="title-desc">
				<h4 class="title">{{ title }}</h4>
				<div class="desc">{{ desc }}</div>
			</div>
		</fragment>
	</div>
</template>

<script>
export default {
	name: "HelpScreenItem",
	props: {
		itemData: {
			type: Object
		}
	},
	computed: {
		iconHtml() {
			return this?.icon.html;
		},
		icon() {
			return this.itemData.icon
		},
		title() {
			return this.itemData.title;
		},
		desc() {
			return this.itemData.desc;
		},
		type() {
			return this.itemData?.type;
		},
		itemHtml() {
			return this.itemData.html;
		}

	}
}
</script>

<style lang="scss">
.help-screen-item {
  display: flex;
  flex-direction: column;
  align-items: center;

  .title {
	text-transform: uppercase;
	font-size: 14px;
	padding-top: 12px;
	padding-bottom: 6px;
  }

  .icon {
	height: 40px;
  }

  .desc {
	font-size: 12px;
  }

  [mode='tablet'] &, [mode='mobile'] & {
	flex-direction: row;
	//column-gap: 25px;
	align-items: flex-start;

	.title-desc {
	  text-align: left;
	}

	.title {
	  padding: 0;
	}
	> * {
		margin-right: 25px;
	}
  }

}
</style>
