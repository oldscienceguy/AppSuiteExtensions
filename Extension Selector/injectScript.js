//Injects script code into application so script can execute in the application's JS context
//Then calls the injected script to execute
//
//Content & Background scripts have full access to page DOM, but NO access to JS variables on the page
//They execute in a JS sandbox
//So we need to insert the entire script into page to get it in the right context
//If we get it wrong, we'll get an error "require is not defined"
//
//Args
//  developer: - string with company name or other unique id.  Used to create namespace
//  functionName: - string of function name that will be injected
//	arg1: - optional args for function
//	arg2:
//	arg3:
//
//function injectScript(developer, extensionName, functionNameToInject) {
function injectScript(context) {
	if (!context.functionName) {
		console.log("functionName: is a required context memeber");
		return;
	} 
	var functionName = context.functionName;
	//If no developer: passed, default to Ox
	var developer = context.developer || "Ox";

	//Everything below is executed in Chrome extension context, so no namespace conflict with other scripts
	console.log("In injectScript");
	//debugger; //break
	//This is pre-pended to functionName to create namespace to avoid collision with other developers
	var nameSpace = "OxEp." + developer + ".";

	//js is what will go in the inject.text element
	var js = '';
	//js += 'console.log("Executing in application context");';

	//Create namespace
	js += "if (typeof OxEp == 'undefined' || OxEp == null) OxEp = {};\n";
	js += "if (typeof OxEp." + developer +" == 'undefined' || OxEp." + developer + "== null) OxEp." + developer +" = {};\n";
	//Define function in our namespace
	js += nameSpace + functionName + " = ";
	//This is way easier than trying to create script by continued string concat
	//We create a function with all the injected code and then call it
	var temp = eval(functionName + ".toString();");
	temp = temp.replace(functionName,""); //Puts functioName in namespace
	js += temp;
	js += ";";
	//Execute function after short delay to allow post load require.js patching by boot.js
	//If delay is too short, we may get errors in require() statements
	//If delay is too long, user may not see extension if they look right away
	js += "window.setTimeout(function() {";
	js += nameSpace + functionName + "(";
	if (context.arg1)
		js += context.arg1;
	if (context.arg2)
		js += "," + context.arg2
	if (context.arg3)
		js += "," + context.arg3
	//Continue if we need more optional args
	js += ");},1000);";
	//Here be dragons: Be very careful if you need to change escape logic, easy to introduce hard-to-find errors
	js = js.replace(/\"/g, '\\"'); //escape double quotes
	js = js.replace(/\'/g, "\'"); //escape single quotes
	//This was hard, \n is not allowed as control char in script text (inserted by ().toString())
	//Replace with escaped \n so it appears as '\n' in text
	js = js.replace(/\n/g, "\\n"); //No more \n

	var inject = document.createElement('script');
	inject.type = 'text/javascript';
	inject.text = "";
	inject.text += 'var ep = document.createElement("script");';
	inject.text += 'ep.type = "text/javascript";';
	inject.text += 'ep.text = "' + js + '";';
	console.log(inject.text); //Check generated script
	//This code works if we're called with programatic injection or content_script injection
	if (chrome && chrome.tabs) {
		//Programatic injection
		inject.text += 'document.head.appendChild(ep);';
		chrome.tabs.executeScript(null, {"code": inject.text});
	} else {
		//Content_script injection
		document.head.appendChild(inject);
	}
}
