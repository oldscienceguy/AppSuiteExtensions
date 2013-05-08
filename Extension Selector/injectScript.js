//Injects script code into application so script can execute in the application's JS context
//Then calls the injected script to execute
//
//Content & Background scripts have full access to page DOM, but NO access to JS variables on the page
//They execute in a JS sandbox
//So we need to insert the entire script into page to get it in the right context
//If we get it wrong, we'll get an error "require is not defined"
//
/*
		|---------------------------|					|---------------------------|
		|Chrome Extension context 	|					|PopUp context				|
		|	Background.js        	|					|	popup.html popup.js 	|
		|							|					|	debug with icon menu	|
		|---------------------------|					|---------------------------|
					V 												V
		chrome.tabs.executeScript 						chrome.tabs.executeScript
		manifest content_script 									|
					V 												V
		|---------------------------|  <-----------------------------
		|Sandboxed App context 		|
		|	Content_script 			|
		|	Access App DOM 			|
		|	No Access APP JS 		|
		|	console.log(where?)		|
		|	debugger (where?) 		|
		|							|
		|---------------------------|
					V
			Append Script Object
					V
		|---------------------------|
		|Application context 		|
		|	App DOM 				|
		|	App JS 					|
		|	AppSuite 				|
		|							|
		|---------------------------|


*/
console.log("injectScript.js loading");

//Args
//  developer: - string with company name or other unique id.  Used to create namespace
//  obj: - Object to be inserted (not a string name for object)
//	objName: - Name we want to use for object in application code in order to call methods
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
	//Define global (no var) function name in our namespace
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
	injectCode(js);
}

//Injects a string containing executable code
function injectCode(js){
	//Here be dragons: Be very careful if you need to change escape logic, easy to introduce hard-to-find errors
	js = js.replace(/\"/g, '\\"'); //escape double quotes
	js = js.replace(/\'/g, "\'"); //escape single quotes
	//This was hard, \n is not allowed as control char in script text (inserted by ().toString())
	//Replace with escaped \n so it appears as '\n' in text
	js = js.replace(/\n/g, "\\n"); //No more \n

	//This code works if we're called with programatic injection or content_script injection
	var inject = document.createElement("script");
	inject.type = "text/javascript";
	inject.text = "";
	inject.text += 'var ep = document.createElement("script");';
	inject.text += 'ep.type = "text/javascript";';
	inject.text += 'ep.text = "' + js + '";';
	inject.text += 'document.head.appendChild(ep);';
	//console.log(inject.text);

	if (chrome && chrome.tabs) {
		//Programatic injection
		//console.log("Inject via chrome.tabs.executeScript");
		chrome.tabs.executeScript(null, {"code": inject.text});
	} else {
		//Content_script sandbox
		//console.log("Inject via document.head.appendChild()");
		document.head.appendChild(inject);
	}

}

//Injects an object with standard methods we can call
//returns the namespace and objectname
function injectObject(context) {
	if (!context.obj) {
		console.log("obj: is a required context member");
		return;
	} 
	if (!context.objName) {
		console.log("objName: is a required context member");
		return;
	} 

	var obj = context.obj;
	//If no developer: passed, default to Ox
	var developer = context.developer || "Ox";
	//This is pre-pended to functionName to create namespace to avoid collision with other developers
	var nameSpace = "OxEp." + developer + ".";
	var objName = nameSpace + context.objName;

	//Everything below is executed in Chrome extension context, so no namespace conflict with other scripts
	//console.log("In injectObject");
	//debugger; //break

	//js is what will go in the inject.text element
	var js = '';
	//js += 'console.log("Executing in application context");';

	//Create namespace
	js += "if (typeof OxEp == 'undefined' || OxEp == null) OxEp = {};\n";
	js += "if (typeof OxEp." + developer +" == 'undefined' || OxEp." + developer + "== null) OxEp." + developer +" = {};\n";
	//Define global (no var) function name in our namespace
	//Creates object and data members (not functions)
	js += objName + " = ";
	js += JSON.stringify(obj);
	js += ";";

	//If optional arguments, add them
	if (context.arg1)
		js += 'arg1:' + context.arg1 + ',';
	if (context.arg2)
		js += 'arg2:' + context.arg2 + ',';
	if (context.arg3)
		js += 'arg3:' + context.arg3 + ',';
	
	//Create function member code.  No way to do this automatically in js, but we know member names
	js += objName + ".install = ";
	var temp = obj.install.toString();
	temp = temp.replace("install",""); //Puts functioName in namespace
	js += temp;
	js += ";";

	js += objName + ".enableExt = ";
	var temp = obj.enableExt.toString();
	temp = temp.replace("enableExt",""); //Puts functioName in namespace
	js += temp;
	js += ";";

	js += objName + ".disableExt = ";
	var temp = obj.disableExt.toString();
	temp = temp.replace("disableExt",""); //Puts functioName in namespace
	js += temp;
	js += ";";

	js += objName + ".removeExt = ";
	var temp = obj.removeExt.toString();
	temp = temp.replace("removeExt",""); //Puts functioName in namespace
	js += temp;
	js += ";";

	injectCode(js);
	return objName;
}