import {Item, ItemList} from './items';
import * as Timer from './Timer';
import {updateStorage, getHostname, getStorage} from './url';

console.log('Running extention...');

let tabHostname = [];
let {storage} = getStorage();
let arrItem = new ItemList(storage);
// arrItem.addNewItem('ss', 'a');
// console.log(arrItem);

////////// URL method //////////

function isExisted (hn) {
	const arr = arrItem.getAllItems();

	const res = arr.find(el => el.hostname === hn);
	return res === undefined ? false:true;
}

function updateTimer (hn, ti) {
	if (isExisted(hn)) {
		// console.log('update timer 1  ' + hn + ' ' + ti);
		arrItem.updateTimerByHostname(hn, ti);
	} 
	else {
		// console.log('update timer 2  ' + hn + ' ' + ti);
		arrItem.addNewItem(hn, ti);
	}
	updateStorage(arrItem);
}

////////// Test method /////////

async function test (ti) {
	console.log('test ' + ti/1000);
	setTimeout(() => {
		Timer.tabTimers.forEach((el, id) => {
			if(el) console.log(id + ' ' + el.getTimer());
		});
		const data = getStorage();
		console.log(data);
	}, ti);
}

////////// Tab controller /////
function updateTab(tabId, hn) {
	updateTimer(tabHostname[tabId], Timer.tabTimers[tabId].getTimer());
	tabHostname[tabId] = hn;
}

// init for initializing timer and hostname
function init() {
	let gettingTabs = browser.tabs.query({status: "complete"});
	gettingTabs.then((tabs) => {
		for (let tab of tabs) {
			const hostname = getHostname(tab.url);
			if(hostname){
				tabHostname[tab.id] = hostname;
				Timer.tabTimers[tab.id] = Timer.addTimer();
				Timer.tabTimers[tab.id].start();
				updateTab(tab.id, hostname);
			}
		}
	});
	console.log('Timer initialized');
}

init();
test(10000);

////////// Tab event ///////////

// add event 'onUpdated' for checking url
browser.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
	if (changeInfo.url) {
		const hostname = getHostname(changeInfo.url);
		console.log('Change ' + hostname + ' of tab ' + tabId);

		if (! hostname) return; 
		if(isExisted(hostname)) {
			console.log('Add new hostname');
			// arrItem.addNewItem(new Item(hostname, 0));
			// updateStorage(arrItem);
		}

		// updateTab(tabId, hostname);

		// reset Tab Timer and start 
		Timer.tabTimers[tabId].reset();
		Timer.tabTimers[tabId].start();

		test(2000);
	}
});

// add event 'onCreated' for creating new TabTimer
browser.tabs.onCreated.addListener((tab) => {
	console.log('Create new tab ' + tab.id + ' and add a timer');
	Timer.tabTimers[tab.id] = Timer.addTimer();
	test(2000);
});

// add event 'onRemoved' for closing the tab
browser.tabs.onRemoved.addListener((tabId, removeInfo) => {
	Timer.tabTimers[tabId].pause();
	console.log('Close ' + tabId +', using time: ' + Timer.tabTimers[tabId].getTimer());
	// updateTab(tabId, null);
	Timer.removeTimer(tabId);
	test(2000);
});