import ObjPropParser from "@/classes/ObjPropParser";
import ParentComms from "@/classes/ParentComms";
import Lytics from "@/classes/Lytics";

const config = {};

export default class {
	static async LoadConfig(conf, arg = '') {
		try{
			if(arg)arg = `-${arg}`
			const _config = await fetch(`/config/${conf}${arg}.json`);
			const json = await _config.json();
			config[conf] = json;
			return json;
		} catch (e) {
			console.log(`Config File '${conf} failed to load.`, e);
		}
	}
	static get AppConf() {
		return config['app'];
	}

	static ParseEvent(events = {}, data = null) {
		for(let p in events) {
			const eventData = ObjPropParser.Parse(events[p] , data);
			switch(p) {
				case 'postMessage':
					ParentComms.SendData(eventData);
				break;
				case 'analytic':
					Lytics.TriggerEvent(eventData.event, eventData.data)
				break;
			}
		}

	}
}
