//////// Storage Method ////////

function onGot (item) {
	let {data} = item;
	return data;
}

function onError (error) {
	console.log(error);
}

export function updateStorage (data) {
	// console.log('update storage');
	browser.storage.local.set({data});
}

export function getStorage () {
	// console.log('Get storage');
	let gettingStorage = browser.storage.local.get();
	let data = gettingStorage.then(onGot, onError);
	// console.log(data);
	return data;
}

export function getHostname (str) {
	return new URL(str).hostname;
}