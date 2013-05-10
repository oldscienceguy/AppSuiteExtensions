//WARNING: If you try to test this while viewing the Chrome Extensions page - IT WILL FAIL !!!
//	You will get an unknown error.  The Chrome Extension page will not accept injected script


//Documentation for everything we can do in the Chrome Extension script (NOT THE INJECTED PAGE SCRIPT)
//http://developer.chrome.com/extensions/events.html

//console.log("Executing in the Chrome Extension context, not application context.");
//console.log("Application JS objects are NOT accessible for anything that's logged to this window");

//There are several ways to handle events
//  1. chrome.tabs events
//  2. chrome.runtime events
//  3. chrome.webRequest events
//  4. chrome.browserAction events
//  5. Rules

/*
//Rules are only available in Chrome beta as of 5/1/13
//See: http://developer.chrome.com/extensions/declarativeWebRequest.html
function addRules() {
	var rule1 = {
		//Use namespace format to keep rules for each extension separate
		id: "OxEP_RAL_Rule1",
		priority: 100, //Optional defaults to 100
		conditions: [
			// If any of these conditions is fulfilled, the actions are executed.
      		new RequestMatcher({
        		// Both, the url and the resourceType must match.
        		url: {pathSuffix: '.jpg'},
        		resourceType: ['image']
      		}),
      		//We can have multiple conditions below.  If any match, the action is performed
      		new RequestMatcher({
	
      		})
      	],
		actions: [
			//Hides all .jpg resources
			new RedirectToTransparentImage()
		]
	};
	//Continue with other rules

	//Register
	chrome.declarativeWebRequest.onRequest.addRules(
      	[rule1], 
    	function(info) {
    		//Called after addRules has been executed
    		if (chrome.runtime.lastError)
    			console.error("Rules were not added");
    		else
    			console.log("Rules were successfully added")
    	});
}
function removeRules() {
	chrome.declarativeWebRequest.onRequest.removeRules (
		["OxEP_RAL_Rule1"], //if null, removes all rules
		function(info) {
    		//Called after addRules has been executed
    		if (chrome.runtime.lastError)
    			console.error("Rules were not removed");
    		else
    			console.log("Rules were successfully removed")
    	}			
	);

}

//If we need to do something when a Chrome Extension is installed
//WARNING: This Chrome Extension background listeners are active across browser sessions
//So these may NOT be specific to our Chrome Extension
chrome.runtime.onInstalled.addListener(function(details) 
{
	console.log("In Chrome Extension onInstalled handler");
	//Clear any existing rules for our extension
	removeRules();
	//Add any rules for our extension
	addRules();
});

*/


//Using chrome.tabs requires manifest.json to have the right permissions option
//This example will log ALL tab changes, not just for our extension
//So we add an explicit check for URLs we're interested in
function addTabsUpdatedHandler() {
	chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
		//debugger;
		//console.log(tabId,changeInfo,tab);
		if (changeInfo.url && changeInfo.url.indexOf("appsuite")!=-1) {
			console.log(changeInfo.url);
		}
	});
}


//This example can intercept ALL http request and log or modify as needed
//It support the optional filter syntax which makes it much more efficient - don't execute for all requests
//See: https://developer.chrome.com/extensions/webRequest.html
function addWebRequestCompletedHandler() {
	chrome.webRequest.onCompleted.addListener(
		function(info) {
			console.log(info.url);

		},{
			//Optional filters
			urls: ["http://*/*"], //Only log appsuite urls
			types: ["script"] //Only log script requests
		}
	);
}


//Example of handling Chrome extension icon click
//Note: If default_popup is specified in manifest.json, this event WILL NOT be fired
function addBrowserActionClickedHandler() {
	console.log("Setting up browser action handler");
	chrome.browserAction.onClicked.addListener(function(tab) {	
		//Two ways to inject script
		// #1
	  	//var action_url = "javascript:window.print();";
	  	//chrome.tabs.update(tab.id, {url: action_url});

	  	//#2
	  	
		chrome.tabs.executeScript(null, {
			//Either code: or file: NOT both
			//Everthing is injected into app an executes in application context
			//code: "<script src='browserAction.js'></script>"
			code: "console.log('In Application JS context. Browser action clicked');",
			//file: "browserAction.js"
		});


	});
}

//Example of handling custom keyboard shortcuts
function addCommandHandler() {
	console.log("Setting up command handler");
	chrome.commands.onCommand.addListener(function(command) {
  		console.log('onCommand event received for message: ', command);
	});
}

//Easier to wrap each handler setup as a function and call what we need rather than comment/uncomment
//addBrowserActionClickedHandler();
//addCommandHandler();

