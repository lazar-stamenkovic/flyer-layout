<template>
	<!--    <router-link-->
	<!--        class="flyer"-->
	<!--        :class="{ active: isActiveFlyer }"-->
	<!--        tabindex="0"-->
	<!--        :to="{-->
	<!--      name: 'DefaultFlyer',-->
	<!--      params: { flyerId: flyerId },-->
	<!--      query:  $route.query-->
	<!--    }"-->
	<!--    >-->
	<a
			:class="{active: isActiveFlyer}"
			class="flyer"
			tabindex="0"
			@click="updateFlyer(flyerId)"
			@keydown.enter="updateFlyer(flyerId)"
			ref="preview"
	>


			<div class="img-wpr">
				<!-- img :src="src" alt="" -->
				<aspect-img class="preview-img" :src="src" alt="" aspect-ratio="1:1" />
				<div v-if="preview" class="preview">
					<p>
						<slot class="preview-text" name="preview-text"/>
					</p>
				</div>
			</div>
			<div class="details">
				<div class="left">
					<p class="title">
						<slot name="title"/>
					</p>
					<p class="dates">
						<slot name="content"/>
					</p>
				</div>
				<!--          <div v-if="!preview" class="right">-->
				<!--            {{ content.landing.viewFlyer }}-->
				<!--          </div>-->

			</div>
	</a>

	<!--  </a>-->
	<!--    </router-link>-->

</template>

<script>
import { mapGetters, mapActions} from 'vuex'
import AspectImg from "@/components/image/AspectImg";
import Rest from "@/api/Rest";

export default {
	components: {AspectImg},
	props: {
		preview: {
			type: Boolean,
			default: false
		},

		src: {
			type: String,
			required: true
		},

		flyerId: {
			type: String,
			required: true
		},

		moreThanTwoFlyers: {
			type: Boolean,
			default: false
		},
		isActiveFlyer: {
			type: Boolean,
			default: false
		}
	},

	mounted() {
		if(this.isActiveFlyer)this.focus();
	},

	methods: {
		...mapActions('landingPage', ['setCurrentFlyer']),
		...mapActions(['setPages']),

		async updateFlyer(flyerId) {
			console.log("New flyer requested :", flyerId)
      Rest.NavigateToFlyer(flyerId);
			//await this.setCurrentFlyer(flyerId);
			//await this.setPages(flyerId)
		},
    focus(container) {
      if(!container)return;
      console.log('Publications Preview Focus:', this.$refs.preview)
      const cb = container.getBoundingClientRect();
      const fb = this.$refs.preview.getBoundingClientRect();
     // console.log('cb:', cb, '  fb:', fb)
      container.scrollTo(fb.x - cb.x, fb.y - cb.y)
      //this.$refs.preview.scrollIntoView();
    }
	},

	computed: {
		...mapGetters(['content', "language"]),

		previewClass() {
			if (!this.preview) return '';
			if (this.language === 'en') {
				return 'preview'
			} else {
				return 'apercu'
			}
		},
	}
}
</script>

<style lang="scss" scoped>

.active {
	border: 3px solid #fff;
	border-radius: 10px;
}


	.flyer {
		width: 100%;
		margin: 14px;
		display: flex;
		flex-direction: column;
		padding: 7px;

		text-decoration: inherit;
		color: inherit;
		cursor: pointer;
		flex-shrink: 0;
		column-gap: 5px;

		.preview-img {
			border-radius: 5px;

		}

		.img-wpr {
			position: relative;
			width: 100%;
			overflow: hidden;

			img {
				/*position: absolute;
				left: 0;
				top: 0;*/
				width: 100%;
				//height: auto;
				//transform: rotateZ(360deg);
				//transform: rotate(90deg);
			}
		}

		.details {
			margin-top: 12px;
			display: flex;
			justify-content: space-between;

			.left {
				margin-right: 5px;
				text-align: left;
			}

			.title {
				font-size: 12px;
				color: #FFF;
			}

			.dates {
				font-size: 11px;
				font-weight: 600;
				white-space: nowrap;
			}

			.right {
				background-color: var(--secondary-color);
				color: var(--primary-text-color);
				font-size: 10px;
				padding: 7px;
				width: 112px;
				text-align: center;
				margin: auto;
				// width: 45%;
				margin-right: 0px;
			}
		}

		.preview {
			position: absolute;
			bottom: 0;
			right: 0;
			display: flex;
			flex-shrink: 0;
			align-items: flex-end;
			justify-content: flex-end;
			background: linear-gradient(322deg, var(--tertiary-color) 0%, var(--tertiary-color) 50%, transparent 50%);
			background-position: 0px 20px;
			background-repeat: no-repeat;
			width: 100%;
			height: 100%;
			color: var(--primary-text-color);
			padding-right: 5px;
			padding-bottom: 10px;
			font-size: 10px;
			text-align: right;

			.preview-text {
				font-family: inherit !important;
			}
		}


	}



/*Tablet*/
@media (min-width: 280px) and (max-width: 1023px) {


		.flyer {
			position: relative;
			width: 280px;
			padding: 5px;
			margin: 15px;
			display: flex;
			flex-direction: row;
			align-items: center;


			.img-wpr {
				justify-content: center;
				display: flex;
				/*margin-right: 2px;*/

				/*img {
					width: 160px;
					height: auto;
					transform: rotateZ(360deg);
					position: relative;
					//transform: rotate(90deg)!important;
					object-fit: contain;
				}*/
			}

			.details {
				.dates {
					font-size: 14px;
				}
			}
		}

}

/*Mobile*/
/*@media (min-width: 280px) and (max-width: 844px) {
	.flyer {
		width: 53vw;
		max-width: 350px;
		height: 54vw;
		max-height: 170px;
		margin: 5px;
		padding: 5px 5px;
		display: flex;
		flex-direction: row;
		align-items: center;

		.img-wpr {
			justify-content: center;
			display: flex;
			margin-right: 2px;

			img {
				width: 150px;
				height: auto;
				object-fit: contain;
				transform: rotateZ(360deg);
				position: relative;
				//transform: rotate(90deg) !important;
			}

			.details {
				.dates {
					font-size: 10px;
				}
			}
		}
	}
}*/

/* iPad Pro 12.9" Portrait and Landscape */
//@media only screen
//and (min-device-width: 1024px)
//and (max-device-width: 1199px)
//and (-webkit-min-device-pixel-ratio: 2) {
//  .flyer{
//    width: 50vw;
//    max-width: 250px;
//    height: 54vw;
//    max-height: 170px;
//    display: flex;
//    flex-direction: row;
//    align-items: center;
//
//    .img-wpr {
//      justify-content: center;
//      display: flex;
//      margin-right: 2px;
//
//      img{
//        width: 150px;
//        height: auto;
//        object-fit:contain;
//        transform: rotateZ(360deg);
//        position: relative;
//        //transform: rotate(90deg) !important;
//      }
//    }
//  }
//}

@media (min-width: 1550px) {
	.flyer.xl-responsive {
		width: 17vw;
		height: 15.57009345vw;
	}
}


</style>
