<template>
	<div v-if="config" class="style-injector" v-html="style"/>
</template>

<script>
//import sass from 'sass'

const less = require('less');
export default {
	name: "ConfigStyleInjector",
	props: {
		config: {
			type: Object
		},
		rootSelector: {
			type: String
		}
	},
	data() {
		return {
			style: null
		}
	},
	computed: {
		styles() {
			return this.config?.styles;
		},
		css() {
			return this.config?.css;
		}
		/*style() {
			if (this.config?.styles) {


				const id = this.rootSelector;
				const styles = this.config.styles;
				let s = [];
				for (let p in styles) {
					s.push(`${p}:${styles[p]}`);
				}

				//console.log('Sass Compile:', sass.compileString(s.join(';')));

				return `<style>
                    ${id} {
                        ${s.join(';')}
                    }
                </style>`;
			}
			return '';
		}*/
	},
	mounted() {
		this.updateStyles()
	},
	methods: {
		async updateStyles() {
			const id = this.rootSelector;
			let css = [];
			if (this.styles) {
				const styles = this.styles;
				let s = [];
				for (let p in styles) {
					s.push(`${p}:${styles[p]}`);
				}
				css.push(s.join(';'));
			}

			if(this.css){
				css.push(this.css);
			}



			const s = `${id} {${css.join(';')}}`.trim();

			// console.log(`CSS Styles (${id}) :`, s);

			const style = await less.render(s);

			// console.log("Less Style:", style);

			this.style = `<style>${style.css}</style>`;
		}
	},
	watch: {
		styles() {
			this.updateStyles();
		},
		css() {
			this.updateStyles()
		}
	}
}
</script>

<style scoped>
.style-injector {
	display: none;
}
</style>


