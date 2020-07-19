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
	if (hn === undefined) return;
	if (isExisted(hn)) {
		console.log('update timer 1  ' + hn + ' ' + ti);
		arrItem.updateTimerByHostname(hn, ti);
	} 
	else {
		console.log('update timer 2  ' + hn + ' ' + ti);
		arrItem.addNewItem(hn, ti);
	}
	updateStorage(arrItem);
}

////////// Test method /////////

async function test (ti) {
	console.log('test ' + ti/1000);
	const data = await getStorage();
	setTimeout(() => {
		// Timer.tabTimers.forEach((el, id) => {
		// 	if(el) console.log(id + ' ' + el.getTimer());
		// });
		console.log(tabHostname);
		console.log('data');
		console.log(data);
	}, ti);
}

////////// Tab controller /////
function updateTab(tabId, hn) {
	console.log(tabId + ' ' + hn);
	updateTimer(tabHostname[tabId], Timer.tabTimers[tabId].getTimer());
	tabHostname[tabId] = hn;
}

// init for initializing timer and hostname
function init() {
	let gettingTabs = browser.tabs.query({status: "complete"});
	gettingTabs.then((tabs) => {
		for (let tab of tabs) {
			const hostname = getHostname(tab.url);
			Timer.tabTimers[tab.id] = Timer.addTimer();
			if(hostname){
				tabHostname[tab.id] = hostname;
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

		if (! hostname) return; 
		
		const ti = Timer.tabTimers[tabId].getTimer();
		
		// updateTimer(hostname, ti);
		updateTab(tabId, hostname);

		// reset Tab Timer and start 
		Timer.tabTimers[tabId].reset();
		Timer.tabTimers[tabId].start();

		console.log('Change ' + hostname + ' of tab ' + tabId + ' ' + ti);
		test(5000);
	}
});

// add event 'onCreated' for creating new TabTimer
browser.tabs.onCreated.addListener((tab) => {
	console.log('Create new tab ' + tab.id + ' and add a timer');
	Timer.tabTimers[tab.id] = Timer.addTimer();
	test(5000);
});

// add event 'onRemoved' for closing the tab
browser.tabs.onRemoved.addListener((tabId, removeInfo) => {
	Timer.tabTimers[tabId].pause();
	console.log('Close ' + tabId +', using time: ' + Timer.tabTimers[tabId].getTimer());
	updateTab(tabId, tabHostname[tabId]);
	Timer.removeTimer(tabId);
	test(5000);
});