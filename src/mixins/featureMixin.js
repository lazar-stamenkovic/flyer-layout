import {mapActions, mapGetters, mapState} from "vuex";
import {get, merge} from "lodash";
import ObjPropParser from "@/classes/ObjPropParser";
//import Vue from "vue";


function applyMergedData(p, md, data, target) {
	//If property has + in front mean the object should merge with data rather than replace it.
	if(p.charAt(0) === '+') {
		const cp = p.slice(1);
		target[cp] = merge({}, data, md);
	} else {
		target[p] = md;
	}
}

function expandProp(obj, prop, data) {
	// \[(.*?)\]
	// /\[([^\[\]]+)\]/

	const o = {};
	const m = prop.match(/\[(.*?)\]/);

	if(m) {
		const props = m[1].split(',').map((p) => p.trim()) ;
		props.forEach((p) => {
			const md = merge(o[p], obj[prop]);
			applyMergedData(p, md, data, o);
		})
	} else {
		applyMergedData(prop, obj[prop], data, o);
		//o[prop] = obj[prop];
	}
	return o;
}

function expandObject(obj, data) {
	if(!obj)return null;
	let o = {};
	for(let p in obj) {
		o = merge(o, expandProp(obj, p, data));
	}
	return o;
}

function checkScreenSize(screen, sizes) {
	const ss = Object.keys(screen).sort((a, b) => b.localeCompare(a, undefined, { numeric: true }));
	///console.log('Screen Size Sort:', ss);
	const width = sizes.innerWidth;
	let val = null;
	for(let i=0; i < ss.length; i++){
		const bp = ss[i];
		if(width <= bp ) {
			val = screen[bp];
		} else {
			return val;
		}
	}
	return val;
	/*for(let p in screen) {
		const m = p.toLocaleLowerCase().replaceAll(' ', '').split(/([<=>])/);
		const param = m.shift();
		const value = m.pop();
		const condition = m.join('');
		const cVal = sizes[(param === 'width')? 'innerWidth': 'innerHeight'];

		if(eval(`${cVal} ${condition} ${value}`)){
			return screen[p];
		}

	}*/
}

export default {
	props: {
		featureConfig: {
			type: [String, Object]
		}
	},
	data(){
		return {
			featurePath: null,
			featureEvents: []
		}
	},
	mounted() {
		for(let event of this.featureEvents) {
			this.addFeatureEventListener({event, func: this.onFeatureEvent});
		}
	},
	beforeDestroy() {
		for(let event of this.featureEvents) {
			this.removeFeatureEventListener({event, func: this.onFeatureEvent});
		}
	},
	computed: {
		...mapGetters('screen', ['displayMode', 'flyerOrientation']),
		...mapGetters('config', ["features"]),
		...mapState('screen', ['size']),
		...mapGetters(['lang', 'content', "language"]),
		_config(){
			return ObjPropParser.ApplySelfValues(this.featureConfig ?? (this.featurePath? get(this.features, this.featurePath): null), {__self:this});
		},
		config() {
			let config = this._config;// this.featureConfig ?? (this.featurePath? get(this.features, this.featurePath): null);
			//console.log('Config Start Create:',  config)

			if(typeof config === 'string') {
				config = get(this.features, config);
			}

			if (!config) return {};

			if (typeof config === 'boolean') {
				return {
					enabled: config
				}
			}

			let o = config;
			//console.log('Config Parse String:',  o)

			// Options based on screen size....
			if(o?._screen && this.size) {
				const screen = expandObject(o._screen, o);
				const sv = checkScreenSize(screen, this.size);
				if(sv){
					o = sv;
				}
				//console.log('Config _screen:',  o)
			}


			//If configuration contains display mode specific properties then merge them
			if(o?._display) {
				const disp = expandObject(o._display, o);
				if (disp && disp[this.displayMode]) {
					o = disp[this.displayMode];
				}
				//console.log('Config _display:',  o)
			}


			if(o?._flyerOrientation){
				const fo = expandObject(o._flyerOrientation, o);
				if(fo[this.flyerOrientation]){
					o = fo[this.flyerOrientation];
				}
				//console.log('Config _flyerOrientation:',  o)
			}



			o = ObjPropParser.Parse(o , {__self:this});
			//console.log('Config ObjectParser:',  o)
			//delete o._display;



			// console.log("Feature Config Updted!!!")

			return o;// Vue.observable(o || {});
		},
		enabled() {
			return this.config && this.config?.enabled !== false;
		}
	},
	methods:{
		...mapActions('events', ['addFeatureEventListener', 'removeFeatureEventListener']),
		onFeatureEvent(event, data){
			console.log('onFeatureEvent:', event, data);
		}
	}

}
