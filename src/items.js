export class Item {
	constructor (hostname, timer) {
		this.hostname = hostname;
		this.timer = timer;
	}
}

export class ItemList {
	constructor (list = []) {
		this.list = list;
	}

	getAllItems () {
		return this.list;
	}

	getCount () {
		return this.list.length;
	}

	addNewItem (hostname, timer = 0) {
		this.list.push(new Item(hostname, timer));
	}

	getIdByHostname (hostname) {
		const li = this.list;
		return li.map(el => el.hostname).indexOf(hostname);
	}

	getItemByHostName (hostname) {
		const li = this.list;
		return li[this.getIdByHostname(hostname)];
	}

	updateTimerByHostname (hostname, time) {
		const id = this.getIdByHostName(hostname);
		this.list[id].timer += time;
	}
}