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
		// const li = this.list;
		console.log('get id by hostname ' + hostname);
		return this.list.map(el => el.hostname).indexOf(hostname);
	}

	getItemByHostName (hostname) {
		const li = this.list;
		const id = this.getIdByHostname(hostname);
		return id === -1 ? null : li[id];
	}

	updateTimerByHostname (hostname, time) {
		console.log('update timer by ' + hostname + ' ' + time);
		console.log(this);
		const id = this.list.map(el => el.hostname).indexOf(hostname);
		console.log(id);
		this.list[id].timer += time;
	}
}