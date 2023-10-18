<template>
	<div :class="{
    'col': columnView,
    'search-open': showMobileSearchBar,
    disabled:tourVisible
  }" class="wpr search-results-wrapper">
		<div v-if="noResults" class="no-results"> {{ content.search.noResultsMessage }} &nbsp;
			<span class="queryMsg">
            <span v-if="getUrlParameter('language')=='en'">"</span>
            <span v-else> &lt;&lt;</span>{{ query }}<span v-if="getUrlParameter('language')=='en'">"</span>
              <span v-else>&gt;&gt;</span>...</span>

			<div class="no-results-suggestions">
				<div v-for="item in content.search.noResults" :key="item.title" class="suggestion-element">
					<span class="no-results-title"> {{ item.title }} </span>
					<p class="no-results-message">
						{{ item.message }}
					</p>
				</div>

			</div>


		</div>
		<!-- p class="no-results" v-else-if="noResults && language === 'fr'">Aucun résultat...</p -->
		<scroll-container
				v-else
				id="search-scroll-container"
				:align="flyerOrientation == 'vertical'? 'center' : 'left'"
				:enable-scroll-buttons="displayMode != 'mobile'"
				:fit-axis="flyerOrientation == 'horizontal' ? 'y' : 'x'"
				:orientation="flyerOrientation"
				:zoom-level="zoomLevel"
				class="search-results"
				@contentResize="onResize"
				@resize="onScrollContainerResize"
		>
			<responsive-grid
					id="resp-grid"
					:search-results="true"
					root-scroll-container="search-scroll-container"
					v-bind:flyer-pages="resultsPage"
			></responsive-grid>
		</scroll-container>
		<!-- FeatureToast  /-->
		<!-- <button @click="resetFilters">Back To<br v-if="!columnView"> Current Flyer</button> -->
	</div>
</template>

<script>
import GridComponent from "@/components/responsiveGrid.component.vue";
import Page from "@/classes/Page";
import {mapActions, mapState, mapGetters} from 'vuex';
import ScrollContainer from "@/components/scroll-container/ScrollContainer";
//import FeatureToast from "@/components/Toasts/FeatureToast";


export default {
	components: {
		ScrollContainer,
		ResponsiveGrid: GridComponent
	},

	props: ['scale'],

	computed: {
		...mapState(['columnView']),
		...mapState('search', ['showMobileSearchBar']),
		...mapGetters('search', ['filteredItems']),
		...mapGetters('screen', ['flyerOrientation', 'displayMode']),
		...mapGetters('scale', ['defPage']),
		...mapState('scale', ['zoomLevel']),
		...mapState('toast', ['tourVisible']),
		...mapGetters(['content', 'language']),
		...mapGetters('filters', ['searchQuery']),

			query(){
				return this.searchQuery?.text;
			},

		resultsPage() {
			const page = Page.GenerateSearchPage(this.filteredItems, this.defPage.type);
			return [page];
		},

		noResults() {
			return !this.resultsPage[0].blocks.length;
		}
	},

	methods: {
		...mapActions('search', ['resetFilters']),
		...mapActions('scale', ['updateScale']),

		onScrollContainerResize(scroller) {
			this.updateScale(scroller._sz.getScale());
		},

		onResize() {
			//scroller.scroll({x: 0, y: 0});
		},

		getUrlParameter(name) {
			name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
			var regex = new RegExp("[\\?&]" + name + "=([^&#]*)");
			var results = regex.exec(window.location.search);
			return results === null
				? ""
				: decodeURIComponent(results[1].replace(/\+/g, " "));
		},

		checkIfScrolling() {
			return document.querySelector('.search-results .section-container')
		}
	}
}
</script>

<style scoped>

.wpr {
	display: flex;
	flex-direction: row;
	align-items: center;
	width: 100%;
	/* z-index: 102; */
	background-color: rgba(0, 0, 0, 0.5);
	position: absolute;
	top: 0px;
	bottom: 0px;
	left: 0px;
	right: 0px;
}

.wpr.search-open {
	top: 201px;
}

.wpr.col {
	flex-direction: column;
}

.queryMsg {
	color: #000000;
}

.queryMsgSubheader {
	font-size: 18px !important;
}


.search-results {
	height: 100%;
	width: 100%;
	background-color: #fff;
	padding-bottom: 26px;
}

.no-results {
	font-size: 21px;
	width: 100%;
	height: 100%;
	align-items: center;
	text-align: center;
	background-color: #fff;
	justify-content: center;
	font-weight: bolder;
	padding-top: 30px;
}


.no-results-suggestions {
	display: flex;
	justify-content: center;
	margin-top: 30px;
	width: 60%;
	margin-left: 20%;
}

.suggestion-element {
	padding: 10px;
	width: 33%;
	border-right: none;

}

.suggestion-element:not(:last-child) {
	border-right: 1px solid lightgrey;
}


.no-results-title {
	color: #000000;
}

.no-results-message {
	font-size: 16px;
	font-weight: normal !important;
	margin-top: 10px;
}

.col .search-results {
	width: 100%;
	max-width: inherit;
	/*overflow-y: scroll;
	overflow-x: hidden;*/
}

.col .search-results > * {
	justify-content: center;
	transform-origin: top;
	margin-bottom: 20px;
}

button {
	background-color: #ED1C24;
	color: #FFF;
	border: 1px solid #AFAFAF;
	border-radius: 4px;
	font-size: 14px;
	font-weight: 700;
	padding: 10px 50px;
	margin: auto;
	white-space: nowrap;
	cursor: pointer;
}

@media (max-width: 1024px) {
	/*.wpr {
		flex-direction: column;
	}

	.wpr.pad-top {
		top: 242px;
	}*/
	.wpr button {
		display: none;
	}

	.queryMsgSubheader {
		font-size: 16px !important;
	}

	.no-results-suggestions {
		display: flex;
		flex-direction: column;
		width: 100%;
		margin: 0px;
	}

	.no-results {
		font-size: 18.5px;
		text-align: left;
		padding: 35px;
	}

	.suggestion-element {
		margin-top: 20px;
		width: 100%;
		border-right: none;
		padding: 0px;
	}

	.suggestion-element:not(:last-child) {
		border-bottom: 1px solid lightgrey !important;
		border-right: none !important;
	}

	.no-results-title {
		color: #000000;
		font-size: 19px;
	}

	.no-results-message {
		font-size: 15px;
		font-weight: normal !important;
		margin-top: 10px;
		margin-bottom: 20px;
	}

	.search-results {
		width: 100%;
		max-width: inherit;
		/* max-height: 80%; */
		/*overflow-y: scroll;
		overflow-x: hidden;*/
	}

}
</style>
