//Injects script code into application so script can execute in the application's JS context
//Then calls the injected script to execute
//
//Content & Background scripts have full access to page DOM, but NO access to JS variables on the page
//They execute in a JS sandbox
//So we need to insert the entire script into page to get it in the right context
//If we get it wrong, we'll get an error "require is not defined"
//
//Args
//  developer - string with company name or other unique id.  Used to create namespace
//  extensionName - string with extensionName.  Used with developer to create namespace
//  functionNameToInject - string of function that will be injected
function injectScript(developer, extensionName, functionNameToInject) {
	//Everything below is executed in Chrome extension context, so no namespace conflict with other scripts
	console.log("In injectScript");
	//debugger; //break
	var functionName = "OxEp." + developer + "." + extensionName;

	var inject = document.createElement('script');
	inject.type = 'text/javascript';
	inject.text = '';
	//Create namespace
	inject.text += "if (typeof OxEp == 'undefined' || OxEp == null) OxEp = function(){};";
	inject.text += "if (typeof OxEp." + developer +" == 'undefined' || OxEp." + developer + "== null) OxEp." + developer +" = function(){};";
	//Define function in our namespace
	inject.text += functionName + " = ";
	//This is way easier than trying to create script by continued string concat
	//We create a function with all the injected code and then call it
	inject.text += eval(functionNameToInject + ".toString();");
	inject.text += ";";
	//Exectue function after short delay to allow post load require.js patching by boot.js
	//If delay is too short, we may get errors in require() statements
	//If delay is too long, user may not see extension if they look right away
	inject.text += "window.setTimeout(function() {";
	inject.text += functionName + "();";
	inject.text += "}, 1000);"
	//console.log(inject.text);
	document.head.appendChild(inject);
}
