import { getHostname } from './url';

////////// Timer //////////////

export let tabTimers = [];

export function addTimer () {
	let timer = 0, count;

	const countSecond = function () {
		timer++;
	}

	return {
		getTimer: function () {
			return timer;
		},
		start: function () {
			count = setInterval(countSecond, 1000);
		},
		pause: function () {
			if(count) clearInterval(count);
		},
		reset: function () {
			this.pause();
			timer = 0;
		}
	}
}

export function removeTimer (tabId) {
	console.log('removeTimer ' + tabId);
	tabTimers[tabId] = null;
}

export function getAllTabTimers() {
	console.log(tabTimers);
}

export function initTimer() {
	let gettingTabs = browser.tabs.query({});
	gettingTabs.then((tabs) => {
		for (let tab of tabs) {		
			if(getHostname(tab.url)){
				tabTimers[tab.id] = addTimer();
				tabTimers[tab.id].start();
			}
		}
	});
	console.log('Timer initialized');
}

/////////// Test Timer ///////////////

function initTestTimer () {
	tabTimers.forEach( function(timer, index) {
		// console.log(timer);
		// console.log(index);
		addTestTimer(index);
	});
}

function addTestTimer (id) {
	testT[id] = setInterval(() => {console.log(id + ' ' + timer.getTimer());}, 10000);
}

function removeTestTimer (id) {
	clearInterval(testT[id]);
}

function resetTestTimer (id) {
	clearInterval(testT[id]);
	testT[id] = setInterval(() => {console.log(id + ' ' + tabTimers[id].getTimer());}, 10000);
}

////////// Main ////////////////

// initTimer();