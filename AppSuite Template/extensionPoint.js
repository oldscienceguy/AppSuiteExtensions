//This file contains the actual AppSuite extension point script, wrapped in a function
//It is used in browserAction.js injectScript()

function ExtensionPoint() {
	console.log("Executing in application JS context");
	//Rest of AppSuite exention point goes here
}

//Inject the function into the app, and call it
injectScript("RAL", "AppSuiteTemplate", "ExtensionPoint");
