<!-- eslint-disable no-mixed-spaces-and-tabs  -->
<template>
	<header class="feature-header" v-bind="config.attrs" v-if="!config.hide">
	  <config-style-injector
			  :root-selector="`header.feature-header`"
			  :config="config"
	  />
		<div class="main-header">
			<div class="inline-header">

				<component
					v-for="item in inlineItems"
					:key="item.name"
					:is="item.component"
					v-bind="item.attrs"
				/>
			</div>

			<slot/>
		</div>
		<drawer-container drawer="header" />
		<div class="mobile-landscape">
			<svg fill="none" height="28" stroke="currentColor" viewBox="0 0 24 24" width="28" xmlns="http://www.w3.org/2000/svg">
				<path d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"></path>
			</svg>
			<span>Rotate Device for Menu</span>
		</div>
	</header>
</template>

<script>
//TODO - Find better way to properly bind savings filter value


import {mapActions, mapGetters} from 'vuex';

import featureMixin from "@/mixins/featureMixin";
import {headerDict} from "@/features/FeatureHelper";
import DrawerContainer from "@/components/drawer/DrawerContainer.vue";
import ConfigStyleInjector from "@/components/style-injector/ConfigStyleInjector.vue";


export default {
	name: "AppHeader",
	mixins:[featureMixin],
	components: {
	  ConfigStyleInjector,
		DrawerContainer
	},

	data() {
		return {
			featurePath: 'header',
			showHamburger: false,
			search: '',
		}
	},

	methods: {
		...mapActions('screen', ['setFullScreen', 'exitFullScreen'])
	},
	computed: {
		...mapGetters('landingPage', ['currentFlyer', 'previewDate']),
		inlineItems() {
			const o = [];
			const items = this.config?.inline;
			if(!items) return o;
			const dict = headerDict;// featureCompDict.header;
			// console.log('header dict:', dict);
			for(let p of items) {
				// console.log('inlineITems:', p, dict[p])
				if(dict[p]) {
					const component = dict[p];
					o.push({component, name:p})
				}
			}
			return o;
		}
	},

	beforeMount() {
		// this.setFullScreen(true);
		/*if (this.language === 'fr') {
			moment.locale('fr', {
				months: 'janvier_février_mars_avril_mai_juin_juillet_août_septembre_octobre_novembre_décembre'.split('_'),
				monthsShort: 'janv._févr._mars_avr._mai_juin_juil._août_sept._oct._nov._déc.'.split('_'),
				monthsParseExact: true,
				weekdays: 'dimanche_lundi_mardi_mercredi_jeudi_vendredi_samedi'.split('_'),
				weekdaysShort: 'dim._lun._mar._mer._jeu._ven._sam.'.split('_'),
				weekdaysMin: 'Di_Lu_Ma_Me_Je_Ve_Sa'.split('_'),
				weekdaysParseExact: true,
				longDateFormat: {
					LT: 'HH:mm',
					LTS: 'HH:mm:ss',
					L: 'DD/MM/YYYY',
					LL: 'D MMMM YYYY',
					LLL: 'D MMMM YYYY HH:mm',
					LLLL: 'dddd D MMMM YYYY HH:mm'
				},
				calendar: {
					sameDay: '[Aujourd’hui à] LT',
					nextDay: '[Demain à] LT',
					nextWeek: 'dddd [à] LT',
					lastDay: '[Hier à] LT',
					lastWeek: 'dddd [dernier à] LT',
					sameElse: 'L'
				},
				relativeTime: {
					future: 'dans %s',
					past: 'il y a %s',
					s: 'quelques secondes',
					m: 'une minute',
					mm: '%d minutes',
					h: 'une heure',
					hh: '%d heures',
					d: 'un jour',
					dd: '%d jours',
					M: 'un mois',
					MM: '%d mois',
					y: 'un an',
					yy: '%d ans'
				},
				dayOfMonthOrdinalParse: /\d{1,2}(er|e)/,
				ordinal: function (number) {
					return number + (number === 1 ? 'er' : '');
				},
				meridiemParse: /PD|MD/,
				isPM: function (input) {
					return input.charAt(0) === 'M';
				},
				// In case the meridiem units are not separated around 12, then implement
				// this function (look at locale/id.js for an example).
				// meridiemHour : function (hour, meridiem) {
				//     return /!* 0-23 hour, given meridiem token and hour 1-12 *!/ ;
				// },
				meridiem: function (hours) {
					return hours < 12 ? 'PD' : 'MD';
				},
				week: {
					dow: 1, // Monday is the first day of the week.
					doy: 4  // Used to determine first week of the year.
				}
			});
		}*/
	},

	mounted() {
		// this.exitFullScreen();
		window.parent.postMessage(
				window.JSON.stringify({
					type: 'FLYER-VIEW',
					flyer: {
						id: this.currentFlyer.title,
						publicationId: this.currentFlyer.id,
						storeId: this.$route.query.storeId,
						starDate: this.currentFlyer.startDate,
						endDate: this.currentFlyer.endDate,
						previewDate: this.previewDate
					}
				}),
				'*'
		)
	},

	beforeDestroy() {
		// this.setFullScreen(false);
		//this.resetFilters();
		//this.setSubHeaderState(false);
		//this.showSubHeader=false;

		/*if (this.showHamburgerMenu) {
			this.toggleHamburgerMenu();
		}*/
	}
}
</script>

<style lang="scss">

.separator {
	border-left:1px dotted black;
	/*margin:0px 10px;*/
	height: 35px;
}

header {
	width: 100%;
	z-index: 10;
	background-color: #FFF;
}

.mobile-landscape {
	display: none;
}

.mobile-only {
	display: none;
}

header .inline-header {

	display: flex;
	align-items: center;
	/*padding: 1em;*/
	//height: 66px;
	//height: 67px;
	//padding: 0 18px;
	//border-bottom: 1px solid #BBB; //removed for SUPDF-198
	//margin-bottom: 1px; //added for SUPDF-198
	column-gap: 0.5em;
	min-height: 4em;

	[mode='tablet'] &, [mode='mobile'] & {
		flex-direction: column;
		.control-panel {
			width: 100%;
		}
	}

}



/*header * {
	transition: all 0.5s;
}*/

.inline-header > .header-right {
	display: flex;
	justify-content: flex-end;
	column-gap: 4px;
}




.date-container {
	font-size: 15px;
	margin-left: 5px;
}

.date {
	// font-weight: 700;
	font-family: inherit;
	margin-right: 10px;
	//color: var(--primary-color);
}
/*
.btn {
	background: none;
	border: 1px solid #BBB;
	border-radius: 4px;
	padding: 5px;
	!*margin: 0 4px;*!
	display: flex;
	align-items: center;
	justify-content: center;
	height: 34px;
	min-width: 34px;
	color: #333;
	transition: none;
}

.btn * {
	transition: none;
}

.btn:hover {
	background-color: #EEE;
}

.btn.selected {
	background-color: var(--primary-color);
	color: var(--primary-text-color);
}

.btn.selected:hover {
	background-color: var(--primary-color);
}

.btn.help {
	padding: 0;
	// border: 0;
	width: 35px;
	cursor: pointer;
	// border: 1px solid #BBB;
	// border-radius: 4px;
}*/

.header-btn {
	height: 34px;
	min-width: 34px;
	border: 1px solid #333;
	border-radius: 4px;
	padding: 5px 10px;
	margin: 0 2px;
	text-decoration: none !important;
	background: none;
	white-space: nowrap;
}

.column-toggle {
	padding: 0px;
	width: 30px;
}

.column-toggle.rotate svg {
	transform: rotate(90deg);
}

.search-toggle {
	display: flex;
	align-items: center;
	//background-image: url(/images/search-button.svg);
}

.notify-badge {
	position: absolute;
	right: 5px;
	top: 7px;
	background: red;
	text-align: center;
	border-radius: 30px 30px 30px 30px;
	color: white;
	padding: 5px 8px;
	z-index: 5;
	font-size: 10px;
}

.dropdown .popup {
	position: absolute;
	background-color: #FFF;
	padding: 15px 0;
	border-radius: 4px;
	top: 50px;
	left: 17px;
	right: 17px;
	box-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
	/* z-index: 103; */
	z-index: 9999;
}

.search-toggle {
	background-color: var(--tertiary-color);
	color: var(--secondary-text-color);
	max-width: 154px;
}

.search-toggle:hover, .search-toggle.selected:hover {
	color: initial;
}

.search-toggle.selected:hover {
	color: #fff;
}


.search-toggle > span {
	margin-right: 6px;
	text-transform: uppercase;
}

.pdf-btn {
	padding: 0;
}

.other-btn.desktop-only {
	margin-right: 5px;
}

.mobile-menu {
	display: flex;
	align-items: center;
	margin-right: 7px;
	justify-self: end;
	z-index: 100;
}

.mobile-element {
	display: none;
}

.hamburger {
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	width: 27px;
	height: 25px;
}

.hamburger > div {
	height: 5px;
	background-color: #80868B;

}

.mobile-search-icon {
	display: none;
	margin-left: 40px;
	margin-right: 10px;
	width: 30px;
	justify-self: end;
}

.mobile-search-bar {
	display: none;
}

.break {
	flex-basis: 100%;
	height: 0;
}

.desktop-search-bar {
	flex-basis: 70%;
	margin-right: 5px;
}

.desktop-menu {
	flex-basis: 100%;
}

.mobile.subheader {
	display: none;
}

@media (max-width: 1023px) {
	.desktop-only {
		display: none;
	}

	.mobile-only {
		display: inline;
	}


	.desktop-search-bar {
		display: none;
	}

	.mobile-search-bar {
		display: flex;
		/* margin: 10px 6px 5px 0px; */
	}
	.mobile-search-icon {
		display: initial;
	}
	.desktop-menu {
		display: none;
	}

	.mobile-menu {
		display: flex;
		align-items: center;
	}

	.mobile-element {
		display: initial
	}

	header .inline-header {
		//padding: 0 10px;
	}

	pre.date {
		margin-right: 0;
		font-size: 9px;
	}

	.logo-wpr {
		width: 100%;
		padding-bottom: 0;
		//padding: 5px 0;
	}

	.header-right > :not(.mobile) {
		display: none;
	}

	.mobile.subheader {
		display: flex;
		justify-content: space-between;
		align-items: center;
		width: 100%;
		position: relative;
		padding: 0 12px;
		margin-top: -67px;
		background-color: #F2F2F2;
		border-top: 1px solid #979797;
		border-right: 1px solid #979797;
		border-left: 1px solid #979797;
		border-bottom: 1px solid #979797;
	}

	.mobile.subheader.shadow {
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
	}

	.mobile-left {
		flex-grow: 1;
	}

	.search-bar {
		max-width: 100%;
		height: 100%;
	}
	.shoppingList-border {
		margin: 0 4px;
	}

	.subheader > * {
		display: flex;
		padding: 12px 0;
	}

	.subheader > * > * {
		// margin: 0 5px;
	}
}


/* Mobile Mode */
/*Mobile*/
@media (min-width: 280px) and (max-width: 850px) {
	header {
		position: relative;
	}

	.mobile-only {
		display: inline;
	}

	.desktop-only {
		display: none;
	}

	.desktop-only-date {
		display: none;
	}

	.column-toggle {
		display: none;
	}

	.zoom-navbar {
		align-self: flex-end;
	}
	.zoom-navbar .zoom-out, .zoom-navbar .zoom-in, .zoom-navbar .zoom-100 {
		display: none;
	}

	.zoom-navbar .fullscreen-toggle > span {
		display: none;
	}

	.zoom-navbar .fullscreen-toggle {
		width: 35px;
		border: none;
		background-size: 26px;
		background-position: 0px bottom;
		padding: 0px;
	}

	.logo-wpr .masthead {
		width: 250px;

	}

	.mobile-menu {
		align-self: flex-end;
	}

	.mobile-search-icon {
		align-self: flex-end;
	}
}

//@media (max-width: 558px){
//  .date-container{
//    font-size: 12px;
//  }
//  .date {
//    margin-top: 1vw;
//    white-space: nowrap;
//    margin-right: 0;
//    font-size: 11px;
//  }
//  .mobile-only{
//    display: inline;
//  }
//  .desktop-only{
//    display: none;
//  }
//}

//@media (max-width: 375px){
//  .logo-wpr .logo {
//    width: 10vw !important;
//  }
//  .logo-wpr .masthead{
//    width: 51vw;
//  }
//  .logo-masthead {
//    margin-right: 1px;
//
//    img{
//      // height:92%;
//      height:66px;
//    }
//  }
//  .date-container {
//    margin-left: 1px;
//  }
//  .date {
//    font-size: 10px;
//  }
//  .mobile-only{
//    display: inline;
//  }
//  .desktop-only{
//    display: none;
//  }
//}

//@media (max-width: 330px){
//  .logo-masthead {
//    margin-right: 1px;
//
//    img{
//      height:66px;
//    }
//  }
//}


@media (max-width: 1000px) and (max-height: 500px) and (min-device-aspect-ratio: 1/1) {

	[is-fullscreen] .main-header {
		display: none;
	}

	[is-fullscreen] .mobile-landscape {
		display: flex;
		align-items: center;
		position: fixed;
		top: 20px;
		right: 10px;
		padding: 5px 10px;
		border-radius: 4px;
		font-size: 20px;
		background-color: var(--primary-color);
		color: var(--primary-text-color);
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
	}

	[is-fullscreen] .mobile-landscape span {
		padding-left: 4px;
	}
	.desktop-only {
		display: inline;
	}

	.mobile-only {
		display: none;
	}

}

@media (max-width: 1365px) {
	.search-toggle {
		width: 33px;
		background-image: url(/images/search.svg);
		background-repeat: no-repeat;
		background-position: center;
		background-size: 64%;
		background-color: var(--tertiary-color);
		border: none;
		border-radius: 3px;

		.search-span {
			display: none;
		}
	}
}
</style>
