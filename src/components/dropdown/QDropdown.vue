<template>
	<bp-vuejs-dropdown v-bind="$attrs">
		<template #btn>
			<slot />
		</template>
		<template #body>
			<div
					v-for="(item, index) in items"
					:key="index"
			>
				<adv-titled-list
						:items="item.items"
						:title="item.title"
						:enable-toggle-all="!!item.enableToggleAll"
				/>
				<div class="sub-items" v-if="item.subItems">
					<q-dropdown
						:items="item.subItems"
					/>
				</div>
			</div>

		</template>
	</bp-vuejs-dropdown>
</template>

<script>
import BpVuejsDropdown from "@/components/bp-vuejs-dropdown/Dropdown.vue";
import AdvTitledList from "@/components/lists/AdvTitledList.vue";

export default {
	name: "QDropdown",
	components: {AdvTitledList, BpVuejsDropdown},
	props:{
		items:{
			type: Array,
			default: () => []
		}
	}
}
</script>

<style scoped>

</style>
