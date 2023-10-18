
<template>
	<div class="triangle-rewards-card">
		<template v-if="handleOffersView">
			<div class="content">

				<!-- <br/> -->

				<img :alt="content.offers.rewards" :src="`/images/triangle/triRewards_logo_${this.language}.svg`"
					class="logo" />
				<div>
					<div class="message">
						<span v-if="hasOffers">{{ content.offers.this_weeks_deals }}</span>
						<span v-else>{{ content.offers.were_working_on }}</span>
					</div>
					<!-- <div v-else class="message">{{ content.offers.comeback }}</div> -->
					<!--br/>
				<div class="fine-print">Prices are subject to change based on product specifications and/or region</div -->
				</div>

			</div>
			<div class="bands">
				<div></div>
				<div></div>
				<div></div>
			</div>
		</template>
		<template v-else-if="handleDisplayRewardsView">
			<div class="content rewards_signin">
				<div class="message-box">
					<div :class="` ${language}`">
						<h2 class="">{{ content.offers.rewards_header }}</h2>
						<div v-if="isPreviewFlyer && isTuesday" class="preview-message">{{ content.offers.comeback }}</div>
						<div v-else-if="isPreviewFlyer && !isTuesday" class="preview-message">{{ content.offers.were_working_on }}
						</div>
						<div v-else>
							<p v-html="isLoggedIntoCT ? content.offers.linkRewardsToReveal : content.offers.rewards_body">
							</p>
							<button v-on:click="triggerUserDialog">{{ isLoggedIntoCT ? content.offers.link :
								content.offers.signin }}</button>
							<span class="message-join">{{ content.offers.rewards_join_pre }} <b>{{ content.offers.rewards
							}}</b>{{ content.offers.rewards_join_post }}
								<a :href="(language === 'en') ? 'https://www.canadiantire.ca/en/triangle-registration.html' : 'https://www.canadiantire.ca/fr/registre.html'"
									target="_blank"></a>
							</span>
						</div>
					</div>

				</div>
			</div>
			<div class="bands">
				<div></div>
				<div></div>
				<div></div>
			</div>
			<div class=" content rewards_box">
				<img :alt="content.offers.rewards" :src="`/images/triangle/triRewards_logo_${this.language}.svg`" />
				<p>{{ content.offers.rewards_text }}<sup>{{ content.offers.registered_trademark }}</sup>{{
					content.offers.rewards_text_a }}</p>
				<img :alt="content.offers.rewards" :src="`/images/triangle/1_1_Graphic_EN_Desktop.png`"
					class="rewards_graphic" />
				<div class="overlay"></div>
				<span>{{ content.offers.click_to_join }}
					<a :href="(language === 'en') ? 'https://www.canadiantire.ca/en/triangle-registration.html' : 'https://www.canadiantire.ca/fr/registre.html'"
						target="_blank"> {{ content.offers.join }}</a>.
				</span>
			</div>
		</template>




	</div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import blockElementMixin from "@/mixins/blockElementMixin";


export default {
	name: "TriangleRewardsCard",
	mixins: [blockElementMixin],
	data() {
		return {
			shouldApplyStyle: false
		}
	},
	created() {
		this.loadOffers();
		this.updateBlockClass();

		//window.addEventListener("resize", this.handleResize());
	},
	computed: {
		...mapGetters('ctUser', ['canViewTriangleRewards', 'isSignedIn', 'offerViewMode', 'hasOffers', 'isLoggedIntoCT', 'hasTriangleID']),
		...mapGetters(['content', 'language']),
		isTuesday() {
			const today = new Date();
			const dayOfWeek = 2;
			return today.getDay() === dayOfWeek;
		},
		isPreviewFlyer() {
			return this.isLoggedIntoCT && this.hasTriangleID && this.offerViewMode === 'preview';
		},
		handleOffersView() {
			return this.isLoggedIntoCT && this.hasTriangleID && this.offerViewMode === 'live';
		},
		handleDisplayRewardsView() {
			return (!this.isLoggedIntoCT && !this.hasTriangleID) || (this.isLoggedIntoCT && !this.hasTriangleID) ||
				(this.isPreviewFlyer) || (this.isPreviewFlyer && this.isTuesday)
        }
	},
	mounted() {
		this.handleResize();
		window.addEventListener("resize", this.handleResize);
	},
	beforeUnmount() {
		window.removeEventListener("resize", this.handleResize);
	},
	methods: {
		...mapActions('ctUser', ['triggerUserDialog', 'updateOfferBlocks', 'loadOffers']),
		getUrlParameter(name) {
			name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
			var regex = new RegExp("[\\?&]" + name + "=([^&#]*)");
			var results = regex.exec(window.location.search);
			return results === null
				? ""
				: decodeURIComponent(results[1].replace(/\+/g, " "));
		},
		updateBlockClass() {
			this.block.classes['noOffers'] = !this.hasOffers;
		},
		handleResize() {
			const noOffersRewards = document.querySelector(".noOffers");
			const parent = noOffersRewards?.closest(" [mode=mobile]  [page-id=triangleRewards].section-container");
			if (parent) {
				parent.style.gridTemplateRows = "repeat(3, 193.5px) ";
			}
		}
	},
	watch: {
		hasOffers() {
			this.updateBlockClass();
			//window.addEventListener("resize", this.handleResize());
		}
	}
}
</script>

<style lang="scss" scoped>
.triangle-rewards-card {
	display: flex;
	flex-direction: column;
	background-color: #fff;
	width: inherit;
	height: inherit;
	/* calc(16em * 0.8235);*/
	text-rendering: optimizeLegibility;
	-webkit-font-smoothing: antialiased;
	z-index: 999;

	/*border: solid 1px #AEAEAE;*/
	.content {
		position: relative;
		display: flex;
		flex-direction: column;
		flex-basis: 100%;
		justify-content: center;
		align-items: center;
		padding: 0.4em 2em 0 2em;
		text-align: center;

		button {
			border: none;
			background-color: #8bf3eb;
			width: 80%;
			// padding:3px;
			padding: 2px;
			margin: 5px;
			font-size: 1.2em;
		}

		.overlay {
			top: 0;
			bottom: 0;
			right: 0;
			left: 0;
			position: absolute;
		}
	}

	.rewards_signin {
		border: solid 1px #AEAEAE;
		max-height: 30%;

		h2 {
			color: var(--secondary-color)
		}

		button {
			background-color: var(--secondary-color);
			color: #fff;
			width: unset;
			min-height: unset;
			padding: 2.5px 15px 4px;
			font-size: 1em;
		}

		p {
			margin: 1em 7em;
		}

		.preview-message {
			margin: 1em 10em;
		}

		.message-join {
			font-weight: unset;
		}

		+.bands {
			height: 50px;
		}

	}

	.rewards_box {
		border: solid 1px #AEAEAE;
		padding-top: 2em;

		img {
			width: 55%;
			height: auto;
		}

		p {
			margin: 1em 6.5em;
		}

		.rewards_graphic,
		span {
			transform: translateY(-35px);

		}
	}

	.logo {
		width: 90%;
		padding-bottom: 3px;
	}

	.message-box {
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.message {
		text-align: center;
		font-size: 1.2em;
		font-weight: 500;
	}

	.message-reveal {
		text-align: center;
		font-size: 1em;
		font-weight: 900;

		.fr {
			font-size: .9em;
		}
	}

	.message-reveal-fr {
		text-align: center;
		font-size: .9em;
		font-weight: 900;
	}

	.message-join {
		text-align: center;
		font-size: .7em;
		font-weight: 900;
		padding-bottom: 3px;
	}

	.fine-print {
		font-size: 0.4em;
	}

	.bands {
		display: flex;
		flex-direction: column;
		justify-content: space-evenly;
		width: 100%;
		height: 1.3em;

		> :first-child {
			background-color: #EB2227;
		}

		> :nth-child(2) {
			background-color: #83142F;
		}

		> :last-child {
			background-color: #78CCC7;
		}

		>* {
			flex-grow: 1;
		}
	}
}
</style>
<style lang="scss">
[mode='mobile'] [page-id='triangleRewards'].section-container {
	position: relative;

	&>.flyer-block.noOffers {
		// position: absolute;
		// z-index: 100;
		// top: 50%;
		// transform: translateY(-50%);
		// box-shadow: 0px 0px 16px 4px #20202042;
		grid-area: span 3 / span 2 / auto / auto !important;

	}

	@-moz-document url-prefix() {
		.block.noOffers {
			position: absolute;
			bottom: 100%;
			transform: translateY(-300%);
		}
	}
}</style>
