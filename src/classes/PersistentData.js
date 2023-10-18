/* eslint-disable */
const storage = window.localStorage;

export default class PersistentData {
	constructor(id) {
		this.storageId = id;
	}

	set storageId(id) {
		this.pathId = (id || 'global');
		this.savePath = "PersistentData:" + this.pathId;
	}

	get storageId() {
		return this.pathId;
	}

	get dataPath() {
		return this.pathId;
	}

	get rootPath() {
		return this.pathId;
	}

	/**
	 *
	 * @param key
	 * @param value
	 * @param lifeSpan - How long in milliseconds the data should exist. If a Date object is used that will be the expiry date of the data
	 */
	setData(key, value, lifeSpan) {
		if (key === undefined) return;
		let dataObject = {
			data: value,
			type: typeof (value)
		};
		if(lifeSpan instanceof Date){
			dataObject.expire = lifeSpan.getTime();
		} else if (!isNaN(lifeSpan)) {
			let expire = (new Date()).getTime() + Number(lifeSpan);
			dataObject.expire = expire;
		}
		storage.setItem(this.savePath + "/" + key, JSON.stringify(dataObject));
	}

	hasData(key) {
		return this.getData(key) != null;
	}

	getData(key) {
		let dataString = storage.getItem(this.savePath + "/" + key);
		if (dataString) {
			let data = JSON.parse(dataString);
			if (!isNaN(data.expire)) {
				let expiry = new Date(data.expire);
				if ((new Date()).getTime() >= expiry.getTime()) {
					this.removeData(key);
					return null;
				}
			}
			return data.data;
		}
		return null;
	}

	removeData(key) {
		//console.log('Sotrage Deleting Key:', key);
		storage.removeItem(this.savePath + "/" + key);
	}

	getAll(path, includeSubs) {

		let items = [];
		let p = (path) ? '/' + path + '/' : '';
		let rootPath = this.savePath + p;
		let rootPathDepth = rootPath.split('/').length;

		let maxPathDepth = (includeSubs) ? null : 1;

		for (let i = 0; i < storage.length; i++) {
			let key = storage.key(i);
			if (key.indexOf(rootPath) === 0) {
				if (maxPathDepth == null) {
					items.push(JSON.parse(storage.getItem(key)).data);
				} else {
					//console.log("*********** key:", key, " rootPath:", rootPath, "  maxPathDepth:", maxPathDepth, "   Depth:", (key.split('/').length - rootPathDepth) );
					if ((key.split('/').length - rootPathDepth) <= maxPathDepth) {

						items.push(JSON.parse(storage.getItem(key)).data);
					}
				}
			}
		}

		return items;
	}

	clear() {

		let removeKeys = [];

		for (let i = 0; i < storage.length; i++) {
			let key = storage.key(i);
			if (key.indexOf(this.savePath + '/') === 0) {
				removeKeys.push(key);
			}
		}

		for (let i = 0; i < removeKeys.length; i++) {
			storage.removeItem(removeKeys[i]);
		}

	}

	static clearStorage() {

		let removeKeys = [];

		for (let i = 0; i < storage.length; i++) {
			let key = storage.key(i);
			if (key.indexOf('PersistentData:') === 0) {
				removeKeys.push(key);
			}
		}

		for (let i = 0; i < removeKeys.length; i++) {
			storage.removeItem(removeKeys[i]);
		}

	}

}
