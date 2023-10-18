import FlyerBlock from "@/components/block/FlyerBlock.vue";

export default {
	props:{
		page:{
			type: Object,
			default: () => {
				return {};
			}
		},
		blockData:{
			type: Object,
			default: () => {
				return {}
			}
		},
		block:{
			type: FlyerBlock,
			default: () => {
				return {};
			}
		},
		isVisible:{
			type: Boolean,
			default: false
		},
		seen:{
			type: Boolean,
			default: false
		}
	}
}
