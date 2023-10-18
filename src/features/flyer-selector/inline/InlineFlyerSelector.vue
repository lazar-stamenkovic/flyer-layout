<template>
	<div class="inline-flyer-selector" :class="config.position" v-bind="config.attrs" v-click-outside="autoClose">
		<config-style-injector :root-selector="`.inline-flyer-selector`" :config="config" />
		<div class="flyer-list" :class="{ open: showList }">
			<flyer-thumb-list />
		</div>
		<template v-if="isCTC">
			<div class="toggle-tab" @click="toggle">
				<rotate-chevron :direction="chevronDirection" class="bouncy-arrow"/>
			    <img src="/images/icon-flyer.svg" class="flyer-book" width="22px" height="22px"  alt=""/>
			    <span class="caption" data-tour-item="flyer-selector">{{ tabCaption }}</span>
		    </div>
		</template>
		<template v-else>
			<div class="toggle-tab" @click="toggle">
			    <img src="/images/icon-flyer.svg" class="flyer-book" width="22px" height="22px"  alt=""/>
			    <span class="caption" data-tour-item="flyer-selector">{{ tabCaption }}</span>
			    <rotate-chevron :direction="chevronDirection" />
		    </div>
		</template>
	</div>
</template>

<script>
import featureMixin from "@/mixins/featureMixin";
import ConfigStyleInjector from "@/components/style-injector/ConfigStyleInjector.vue";
import RotateChevron from "@/components/buttons/RotateChevron.vue";
import FlyerThumbList from "@/features/flyer-selector/FlyerThumbList.vue";
import AppConfig from "@/classes/AppConfig";
import {mapGetters} from "vuex";


export default {
	name: "InlineFlyerSelector",
	components: {FlyerThumbList, RotateChevron, ConfigStyleInjector},
	mixins:[featureMixin],
	data(){
		return {
			featurePath: 'flyerSelector'
		}
	},
	created() {
   if(this.config.position==='top' && this.config._flyerOrientation['+vertical'].defaultVisibility !== undefined)
     this._config.isVisible = this.config._flyerOrientation['+vertical']?.defaultVisibility;
   else
     this._config.isVisible = true

    if(this.config.defaultVisibility !== undefined && !this._config.__hasLoaded) {
			this._config.isVisible = this.config.defaultVisibility;
		}
		this._config.__hasLoaded = true;
	},
	computed:{
		...mapGetters(['content']),
		chevronDirection(){
			const cd = {
				'left': this.showList? 'left': 'right',
				'right': this.showList? 'right': 'left',
				'top': this.showList? 'up': 'down',
				'bottom': this.showList? 'down': 'up'
			}
			return cd[this.config.position];
		},
		tabCaption(){
			return this.showList? this.content?.flyerSelector?.hideFlyers: this.content?.flyerSelector?.showFlyers
		},
		showList(){
			return !!this._config.isVisible;
		},
		isCTC(){
            if(AppConfig.AppConf?.title.toLowerCase().includes("ct".toLowerCase())){
                return true
            }
            else return false
        }
	},
	methods:{
		toggle(){
			this._config.isVisible = !this._config.isVisible;
		},
		autoClose(){
			if(this.config.autoClose)this._config.isVisible = false;
		}
	}
}
</script>

<style lang="scss">
	.inline-flyer-selector {
		--drawer-open-width: 10em;
		display: flex;
		color: #fff;
		.toggle-tab {
			position: relative;
			background-color: #333333;
			display: flex;
			writing-mode: vertical-rl;
			//column-gap: 0.5em;
			cursor: pointer;
			align-items: center;
			.caption {
				rotate: 180deg;
				font-size: 0.8em;
			}
			.rotate-chevron {
				width: 0.6em;
			}
			
		}

		.flyer-list{
			::-webkit-scrollbar{
				width: 8px;
				height: 8px;
				border-radius: 3px;
			}
			::-webkit-scrollbar-thumb{
				border-radius: 4px;
			}
			::-webkit-scrollbar-track {
				width: 8px;
				height: 8px;
			}
			::-webkit-scrollbar-track-piece{
				width: 8px;
			}
		}

		&.left{
			.toggle-tab {
				padding: 1em 0;
				width: 38px;
				border-radius: 0 4px 4px 0;
				> * {
				margin-bottom: 0.5em;
			}
			}
			.flyer-list{
				width: 0px;
				&.open{
					width: var(--drawer-open-width);
				}
			}
		}
		&.top{
			flex-direction: column;
			.toggle-tab {
				writing-mode: initial;
				justify-content: center;
				padding: 0.5em;
				border-radius: 0 0 4px 4px;
				.caption {
					rotate: 0deg;
				}
				> * {
				margin-right: 0.5em;
			   }  
			}
			.flyer-list{
				height: 0;
				&.open{
					height: 12em;
				}
			}
			.flyer-thumb-list {
				display: flex;
				//column-gap: 0.6em;
				padding: 0.5em;
				align-items: center;
				>* {
					margin-right: 1em !important;
				}
				.flyer-thumb-button {
					width: 12em;
					flex: none;
					margin: 0;
					height: fit-content;
				}
			}
		}

		.flyer-list {
			transition: width 0.3s cubic-bezier(0.4, 0.0, 0.2, 1), height 0.3s cubic-bezier(0.4, 0.0, 0.2, 1);
			position: relative;
			.flyer-thumb-list {
				position:absolute;
				top:0;
				bottom:0;
				left:0;
				right:0;
				overflow: auto;
				.top &{
					bottom: 0;
				}
				.left &{
					right: 0;
				}
			}

		}
		.flyer-thumb-button {
			margin: 1em;
		}
	}

</style>
