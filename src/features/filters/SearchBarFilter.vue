<template>
	<div class="filter search-bar" v-bind="config.attrs">
		<config-style-injector :config="config" :root-selector="`.search-bar`"/>
		<input ref="search-input" v-model="value"
		       :aria-label="content.searchFlyer"
		       :placeholder="content.searchFlyer"
		       class="search-input"
		       tabindex="0"
		       type="text"
		       @blur="setSearchFocusState(false)"
		       @focus="setSearchFocusState(true)"
		       @keyup.enter="handleSubmit(value)"
		/>
		<span v-if="value" class="clear" @click="clearSearch">
      <img alt="clear" src="/images/icon-close.svg">
    </span>
		<button aria-label="search" class="search-icon" @click="handleSubmit(value)">
			<svg viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
				<g>
					<path d="M495,466.2L377.2,348.4c29.2-35.6,46.8-81.2,46.8-130.9C424,103.5,331.5,11,217.5,11C103.4,11,11,103.5,11,217.5   S103.4,424,217.5,424c49.7,0,95.2-17.5,130.8-46.7L466.1,495c8,8,20.9,8,28.9,0C503,487.1,503,474.1,495,466.2z M217.5,382.9   C126.2,382.9,52,308.7,52,217.5S126.2,52,217.5,52C308.7,52,383,126.3,383,217.5S308.7,382.9,217.5,382.9z"
					      fill="currentColor"/>
				</g>
			</svg>
		</button>
	</div>
</template>

<script>
import {mapActions, mapGetters} from 'vuex';
import Lytics from "@/classes/Lytics";
import featureMixin from "@/mixins/featureMixin";
import ConfigStyleInjector from "@/components/style-injector/ConfigStyleInjector.vue";

export default {
	name: "SearchBarFilter",
	components: {ConfigStyleInjector},

	mixins: [featureMixin],

	data() {
		return {
			value: ''
		}
	},

	props: {
		hidden: {
			type: Boolean,
			default: false
		}
	},

	mounted() {
		this.value = this._config.value;
	},

	computed: {
		...mapGetters(['content', 'highlightResults']),
		...mapGetters('filters', ["searchQuery"])
	},

	methods: {
		...mapActions(['setSearchInputFocusState', 'toggleSideBarState']),
		...mapActions('events', ['triggerEvent']),
		clearSearch() {
			this.value = '';
			this._config.value = '';
		},

		handleSubmit(val) {
			this.$refs['search-input'].blur();
			this._config.value = val;
			console.log('Search Query', val);
			Lytics.TriggerSearch(val);
			this.triggerEvent({
				event: `filter-event-${this.config.name}`,
				data: val
			});
		},
		setSearchFocusState(val) {
			this.setSearchInputFocusState(val)
			this.toggleSideBarState(false);
		}
	},
	watch: {
		searchQuery(val) {
			console.log('search query update:', val)
			this.value = this.config.value;
		}
	}
}
</script>

<style lang="scss" scoped>

.clear {
  position: absolute;
  right: 40px;
  top: 51%;
  transform: translateY(-50%);
  line-height: 1em;
  font-family: monospace;
  cursor: pointer;
}

.search-bar {
  display: flex;
  position: relative;
  min-width: 130px;
  flex-grow: 1;
  min-height: 34px;
}

.search-bar input {
  flex-basis: 100%;
  border: 1px solid #AFAFAF;
  border-radius: 4px;;
  /* border-color: var(--tertiary-color); */
  font-size: 16px;
  /*height: 35px;*/
  text-overflow: ellipsis;
  padding-left: 1em;
  padding-right: 1em;
  width: 100%;
}

.search-bar .search-icon {
  width: 30px;
  color: #fff;
  /*background-image: url(/images/search.svg);
  background-repeat: no-repeat;
  background-position: center;
  background-size: 64%;*/

  background-color: var(--secondary-color);

  border: none;
  border-radius: 4px;
  position: absolute;
  right: 3px;
  height: auto; /*calc(100% - 7px);*/
  min-height: auto;
  top: 3px;
  bottom: 3px;

  svg {
	width: 80%
  }

}

.search-bar .search-icon:hover {
  background-color: #A90000 !important;
}

</style>
