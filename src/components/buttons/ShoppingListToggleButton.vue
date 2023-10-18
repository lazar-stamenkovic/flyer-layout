<template>
	<button :class="{active: isActive}" v-if="enabled" class="btn has-tooltip" v-tooltip="{ content: content.shoppingListToolTip, classes: 'last'}" :aria-label="content.toggleFullscreen" v-bind="config.attrs" @click="toggle">
	<svg width="22px" height="20px" viewBox="5 10 24 14" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
		<g id="-Symbols" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
			<g id="SuperC-header---English" transform="translate(-1868.000000, -23.000000)">
				<g id="icon---list" transform="translate(1868.000000, 23.000000)">
					<g class="line-fill" id="Group" transform="translate(7.000000, 9.000000)">
						<rect id="Rectangle-Copy-34" x="6" y="0" width="14" height="3" rx="1.5"></rect>
						<rect id="Rectangle-Copy-37" x="0" y="0" width="3" height="3" rx="1.5"></rect>
						<rect id="Rectangle-Copy-35" x="6" y="7" width="14" height="3" rx="1.5"></rect>
						<rect id="Rectangle-Copy-38" x="0" y="7" width="3" height="3" rx="1.5"></rect>
						<rect id="Rectangle-Copy-36" x="6" y="14" width="14" height="3" rx="1.5"></rect>
						<rect id="Rectangle-Copy-39" x="0" y="14" width="3" height="3" rx="1.5"></rect>
					</g>
				</g>
			</g>
		</g>
	</svg>
	<div v-if="count" class="count-badge">{{ count }}</div>
</button>
</template>

<script>
import {mapActions, mapGetters, mapState} from "vuex";
import featureMixin from "@/mixins/featureMixin";

export default {
	name: "ShoppingListToggleButton",
	mixins: [featureMixin],
	data(){
		return {
			featurePath: 'shoppingList'
		}
	},
	computed:{
		...mapGetters('config', ['features']),
		...mapState('shoppingList', ['showShoppingList', 'showShoppingListV1','shoppingList','shoppingListV1']),
    ...mapGetters('shoppingList',['getVersion']),
		count() {
			return this.getVersion==='v1' ? this.shoppingListV1.length : this.shoppingList.length;
		},
    isActive(){
      return this.getVersion==='v1' ? this.showShoppingListV1 : this.showShoppingList
    }
	},
	methods: {
		...mapActions('shoppingList', ['toggleShoppingList','toggleShoppingListV1']),
		toggle() {
      this.getVersion==='v1' ? this.toggleShoppingListV1(!this.showShoppingListV1) : this.toggleShoppingList(!this.showShoppingList);
		}
	}
}
</script>

<style lang="scss" scoped>
	button {
		&.active{
			background-color: rgb(84, 84, 84) !important;
			svg {
				.line-fill {
					fill: #fff;
				}
			}
		}

		svg {
			.line-fill {
				fill: #545454;
			}
		}
	}


	.btn {
		position: relative;
	}
	.count-badge{
		display: flex;
		justify-content: center;
		align-items: center;
		position: absolute;
		background-color: red;
		top: -0.9em;
		right: -0.9em;
		border-radius: 50%;
		height: 1.8em;
		min-width: 1.8em;
		font-size: 0.8em;
		color: #fff;
	}
</style>
