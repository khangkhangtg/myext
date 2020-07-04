export default function addTabEvent () {
	// add event 'onUpdated' for checking url
	browser.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
		if (changeInfo.url) {
			const hostname = getHostname(changeInfo.url);
			console.log('Change ' + hostname + ' of tab ' + tabId);

			if (! hostname || isExisted(hostname)) return;

			console.log('Add new hostname');
			arrItem.addNewItem(new Item(hostname, 0));
			getStorage(arrItem);
		}
	});

	// add event 'onRemoved' for closing the tab
	browser.tabs.onRemoved.addListener((tabId, removeInfo) => {
		console.log('Close ' + tabId);
		console.log(removeInfo);
	});
}