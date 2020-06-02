// Put all the javascript code here, that you want to execute in background.

function notifyMessage (noti) {
	console.log("background script received message");
	browser.notifications.create({
		"type": "basic",
		"title": "Timer notification",
		"message": `You are spending ${noti} seconds for this website.`
	});
}

function isValidHttpUrl(string) {
	let url;

	try {
		url = new URL(string);
	} catch (_) {
		return false;  
	}

	return url.protocol === "http:" || url.protocol === "https:";
}

function onGot(tabInfo) {
  console.log(tabInfo);
}

function onError(error) {
	console.log(`Error: ${error}`);
}

function getAllInfo () {
	let tabs = browser.tabs.query({});
	tabs.then((tabs) => {
		for(let tab of tabs) {
			console.log(tab);
		}
	});
}

function addTimer () {
	let timer = 0;
	let count;

	let countSecond = function () {
		timer++;
	}

	let test = function () {
		notifyMessage(timer);
	}

	return {
		getTimer: function () {
			return timer;
		},
		start: function () {
			count = setInterval(countSecond, 1000);
		},
		pause: function () {
			if (count) clearInterval(count);
		},
		reset: function () {
			timer = 0;
		},
		test: function () {
			test();
		}
	}
}

function initTabs (tabs) {
	for (let tab of tabs) {
		if (!isValidHttpUrl(tab.url)) continue;

		tab.timer = addTimer();
		tab.timer.start();
		
		console.log(tabs);

		setInterval(() => {
			console.log(tab.timer.getTimer());
		}, 15000);
	}
}

// add timer for all tabs when opening the browser
function init () {
	let tabs = browser.tabs.query({});
	tabs.then((tabs) => {
		initTabs(tabs);
	});
}

init();

// reset timer when tab's url updates
browser.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
	if(changeInfo.url) {
		// console.log(tab);
		// let tabInfo = browser.tabs.get(tabId);
		// tabInfo.then((info) => {
		// 	console.log(info);
		// });

		let tabs = browser.tabs.query({});
		tabs.then((tabs) => {
			for(let tab of tabs) {
				console.log(tab);
			}
		});
	}

	if(tab.status === "complete") {
		console.log(tab);
	}
});