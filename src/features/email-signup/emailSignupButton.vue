<template>
	<button class="email-signup btn" v-tooltip="{ content: content.emailSignup.toolTip}" @click="showSignup" data-tour-item="emailSignup" v-bind="config.attrs" v-html="config.label" >
<!--		<span class="signup-text">{{ content.emailSignup }}</span>
		<img class="email-icon" src="/icons/icon-mail.svg" />-->
	</button>
</template>

<script>

import {mapActions, mapGetters} from "vuex";
import featureMixin from "@/mixins/featureMixin";
//import ParentComms from "@/classes/ParentComms";

export default {
	name: "emailSignupButton",
	mixins:[featureMixin],
	data(){
		return {
			featurePath: 'emailSignup'
		}
	},
	computed: {
		...mapGetters(['content'])
	},
	methods: {
		...mapActions('events', ['triggerEvent']),
		showSignup() {
			this.triggerEvent({event: 'emailSignUp'})
		}
	}
}
</script>

<style lang="scss">

.email-signup {
	background-color: var(--secondary-color) !important;
	color: #fff !important;
	text-transform: uppercase;

	.email-icon {
		width: 24px;
	}
	&:hover{
		background-color: #ca1f25 !important;
	}

}
</style>
