<template>
	<dropdown :class="`filter filter-dropdown ${config.name}`" v-bind="config.attrs">
		<template #btn>
			<span>{{ buttonCaption }}</span>
			<config-style-injector
					:config="config"
					:root-selector="`.filter-dropdown.${config.name}`"
			/>
		</template>
		<template #body>
			<adv-titled-list
					v-for="section in sections"
					:key="section.title"
					:enable-toggle-all="!!section.enableToggleAll"
					:items="section.items"
					:title="section.title"
					@select="onFilterToggle"
			/>
		</template>

	</dropdown>
</template>

<script>
import Dropdown from "@/components/bp-vuejs-dropdown/Dropdown.vue"
import AdvTitledList from "@/components/lists/AdvTitledList.vue";
import featureMixin from "@/mixins/featureMixin";
import ConfigStyleInjector from "@/components/style-injector/ConfigStyleInjector.vue";
import {mapActions} from "vuex";

function handleFilterType(fType, qo, sid, item, selected = false) {
	switch (fType) {
		case 'boolean':
			qo[item.id || item.label] = selected;
			break;
		case 'single':
			if (selected) {
				qo[sid] = item.value || item.label
			} else {
				qo[sid] = '';
			}
			break;
		default:
			if (!qo[sid]) {
				qo[sid] = [];
			}
			if (selected) qo[sid].push(item.value || item.label)
	}
}

export default {
	name: "FilterDropdown",
	mixins: [featureMixin],
	components: {ConfigStyleInjector, AdvTitledList, Dropdown},
	props: {
		label: {
			type: String
		},
		filterName: {
			type: String,
			default: 'categories'
		}
	},
	data() {
		return {}
	},
	computed: {
		sections() {
			return this._config.sections;
		},
		buttonCaption() {
			return this.config?.label || this.label
		},
		value() {
			const v = {};
			this.sections.forEach((section) => {
				const sid = section.id;
				const format = section?.format ?? 'array';
				section.items.forEach((item) => {
					handleFilterType(format, v, sid, item, item.checkbox.selected);
					/*if (item.checkbox.selected) {
											switch (format) {
												case 'boolean':
													v[item.id || item.label] = true;
												break;
												case 'single':
													v[sid] = item.value || item.label
												break;
												default:
													if(!v[sid]) {
														v[sid] = [];
													}
													v[sid].push(item.value || item.label)
											}
										}*/
				});
			})
			console.log('Filter Value Changed:', v);
			return v;
		}
	},
	methods: {
		...mapActions('events', ['triggerEvent']),
		onFilterToggle(f) {
			this.triggerEvent({
				event: `filter-toggle-event-${this.config.name}`,
				data: f
			});
			console.log('Filter Toggle:', f, ' Value:', this.value);
			//	this.updateQuery(this.value);
		}
	}
}
</script>
<style scoped></style>
<style lang="scss">

[mode='tablet'], [mode='mobile'] {
  .filter-dropdown {
	.bp-dropdown__body {
	  left: calc(10px + 1em) !important;
	  width: calc(100% - (35px + 1em));
	}
  }
}

[mode='mobile'] {
	.filter-dropdown {
		flex:0.5;
	}
}


.filter-dropdown {
  --button-background-hover: #efefef;
  --filter-arrow-color: var(--text-color);
  --filter-arrow-color-hover: var(--filter-arrow-color);
  --filter-label-min-width: auto;
  /*height: 100%;
  width: 100%;
  font-size: 14px;*/

  .filter-style-wrapper {
	display: none;
  }

  svg .dropdown-arrow {
	fill: var(--filter-arrow-color)
  }

  &:hover {
	svg .dropdown-arrow {
	  fill: var(--filter-arrow-color-hover)
	}
  }

  .bp-dropdown__body {
	margin-top: 10px;
	border: var(--button-border);
	border-bottom-left-radius: 4px;
	border-bottom-right-radius: 4px;
	padding: 6px 10px;
	overflow: auto;

	/* width */
	&::-webkit-scrollbar {
	  width: 8px;
	}

	/* Track */
	&::-webkit-scrollbar-track {
	  //background: #f1f1f1;
	  display: none;
	}

	/* Handle */
	&::-webkit-scrollbar-thumb {
	  background: #888;
	  border-radius: 6px;
	}

	/* Handle on hover */
	&::-webkit-scrollbar-thumb:hover {
	  background: #555;
	}
  }

  .bp-dropdown__btn {
	display: flex;
	align-items: center;
	justify-content: space-between;
	background: var(--button-background);
	color: var(--button-text-color);
	border: 1px solid #AFAFAF;
	border-radius: 4px;
	font-size: 1em;
	padding: 5px 5px 5px 10px;
	height: 100%;
	width: 100%;
	column-gap: 5px;

	text-align: left;

	&:hover, &.bp-dropdown__btn--active {
	  background: var(--button-background-hover);
	  color: var(--button-text-color-hover);
	}

	> span {
	  white-space: nowrap;
	  overflow: hidden;
	  min-width: var(--filter-label-min-width);
	}
  }

}


</style>
