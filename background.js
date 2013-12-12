var AppSpace = AppSpace || {}; // namespace object

chrome.runtime.onMessage.addListener(function(passedData, messenger) {
	
	if (messenger === AppSpace.sourceTab) { // if the message is sent from the script injected into the source tab...
		chrome.runtime.sendMessage(passedData); // pass the data on to the popup tab script
	}	
});

AppSpace.buttonFunction = function() { 
	
	// when the browser action button is clicked...
	
	chrome.tabs.executeScript(null, { // runs script in page to collect text data
	    file: "content_script.js"
	  });
	
	chrome.tabs.query( // stores the ID of the current (source) tab in AppSpace.sourceTab
			  {currentWindow: true, active : true},
			  function(tabArray){
				  AppSpace.sourceTab = tabArray[0];
			  }
			);
	
	AppSpace.window = window.open("popup.html"); // opens popup.html in a new tab
};

chrome.browserAction.onClicked.addListener(AppSpace.buttonFunction);