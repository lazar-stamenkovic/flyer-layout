<template>
	<bp-vuejs-dropdown class="hamburger-menu-button" :initialIsHidden="isHidden">
		<template #btn>
			<button class="btn">
				<svg height="17px" version="1.1" viewBox="0 0 18 17" width="18px" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
					<title>icon-hamburger</title>
					<g id="TransCon-Direction" fill="none" fill-rule="evenodd" stroke="none" stroke-width="1">
						<g id="SuperC---Mobile---4-Column---FR" class="hamburger-lines" fill="#545454" transform="translate(-24.000000, -137.000000)">
							<path
									id="icon-hamburger"
									d="M40.5,151 C41.3284271,151 42,151.671573 42,152.5 C42,153.328427 41.3284271,154 40.5,154 L25.5,154 C24.6715729,154 24,153.328427 24,152.5 C24,151.671573 24.6715729,151 25.5,151 L40.5,151 Z M40.5,144 C41.3284271,144 42,144.671573 42,145.5 C42,146.328427 41.3284271,147 40.5,147 L25.5,147 C24.6715729,147 24,146.328427 24,145.5 C24,144.671573 24.6715729,144 25.5,144 L40.5,144 Z M40.5,137 C41.3284271,137 42,137.671573 42,138.5 C42,139.328427 41.3284271,140 40.5,140 L25.5,140 C24.6715729,140 24,139.328427 24,138.5 C24,137.671573 24.6715729,137 25.5,137 L40.5,137 Z"></path>
						</g>
					</g>
				</svg>
			</button>
		</template>
		<template #body>
			<div v-for="comp in listItems"
			     :key="comp.name"
			     class="comp-list-item"
			>
				<component
						:is="comp.component"
				/>
				<span class="desc">{{ comp.desc }}</span>
			</div>

		</template>
		<template #icon><span></span></template>
	</bp-vuejs-dropdown>

</template>

<script>
import BpVuejsDropdown from "@/components/bp-vuejs-dropdown/Dropdown.vue";
import featureMixin from "@/mixins/featureMixin";
import {controlDict} from "@/features/FeatureHelper";

export default {
	name: "HamburgerMenuButton",
	mixins: [featureMixin],
	components: {BpVuejsDropdown},
	data() {
		return {
			isHidden: true,
			featurePath: 'header.controls.hamburgerMenu'
		}
	},
	computed: {
		listItems() {
			const items = this.config.items;
			const o = [];

			for (let item of items) {
				if (controlDict[item.component]) {
					o.push({name: item.component, component: controlDict[item.component], desc: item.desc});
				}
			}

			return o;

		}
	}
}
</script>

<style lang="scss">
[mode='tablet'], [mode='mobile'] {
	.hamburger-menu-button {
		.bp-dropdown__body {
			left: 1em !important;
			width: calc(100% - 2em);
			display: flex;
			flex-direction: column;
		}
	}
}

.hamburger-menu-button {

	.hamburger-lines {
		fill: #545454
	}

	.bp-dropdown__body {
		border-radius: 4px;
	}

	.bp-dropdown__btn {
		padding: 0px;
		border: none;

		&.bp-dropdown__btn--active {
			background-color: #545454;
			.hamburger-lines {
				fill: #E5E5E5;
			}
			.btn:hover{
				background-color: inherit;
			}
		}
	}

	.comp-list-item {
		display: flex;
		//column-gap: 1em;
		align-items: center;
		padding: 0.5em 1em;
		
		> * {
			margin-right: 1em;
		}
	}


}
</style>
