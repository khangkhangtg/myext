// Put all the javascript code here, that you want to execute in background.

let tabsTimer = [], testT = [];

function addTimer () {
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
			this.start();
		}
	}
}

function removeTimer (tabId) {
	const tmpTimer = timer.splice(tabsTimer.indexOf(tabId), 1);
	tabsTimer = tmpTimer;
}

function testTimer () {
	tabsTimer.forEach( function(timer, index) {
		// console.log(timer);
		// console.log(index);
		testT[index] = setInterval(() => {console.log(timer.getTimer());}, 10000);
	});
}

function resetTestTimer (id) {
	clearInterval(testT[id]);
	testT[id] = setInterval(() => {console.log(tabsTimer[id].getTimer());}, 10000);
}

function initTimer() {
	let gettingTabs = browser.tabs.query({});
	gettingTabs.then((tabs) => {
		tabs.map(tab => tab.id).forEach((id) => {
			tabsTimer[id] = addTimer();
			tabsTimer[id].start();
		});
		testTimer();
		// console.log(tabsTimer);
	});

}

initTimer();

// add event 'onUpdated' for checking url
browser.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
	if (changeInfo.url) {
		tabsTimer[tabId].reset();
		// resetTestTimer(tabId);
	}
});

// add event 'onCreated' for creating new tab
browser.tabs.onCreated.addListener()

// add event 'onRemoved' for closing the tab
browser.tabs.onRemoved.addListener()