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

	
	
	//js is what will go in the inject.text element
	var js = '';
	//js += 'console.log("Executing in application context");';

	//Create namespace
	js += "if (typeof OxEp == 'undefined' || OxEp == null) OxEp = function(){};\n";
	js += "if (typeof OxEp." + developer +" == 'undefined' || OxEp." + developer + "== null) OxEp." + developer +" = function(){};\n";
	//Define function in our namespace
	js += functionName + " = ";
	//This is way easier than trying to create script by continued string concat
	//We create a function with all the injected code and then call it
	var temp = eval(functionNameToInject + ".toString();");
	temp = temp.replace(functionNameToInject,""); //Gets rid of original function name
	js += temp;
	js += ";";
	//Execute function after short delay to allow post load require.js patching by boot.js
	//If delay is too short, we may get errors in require() statements
	//If delay is too long, user may not see extension if they look right away
	js += "window.setTimeout(function() {";
	js += functionName + "();";
	js += "},1000);";
	//Here be dragons: Be very careful if you need to change escape logic, easy to introduce hard-to-find errors
	js = js.replace(/\"/g, '\\"'); //escape double quotes
	js = js.replace(/\'/g, "\'"); //escape single quotes
	//This was hard, \n is not allowed as control char in script text (inserted by ().toString())
	//Replace with escaped \n so it appears as '\n' in text
	js = js.replace(/\n/g, "\\n"); //No more \n

	console.log(js);

	var inject = document.createElement('script');
	inject.type = 'text/javascript';
	inject.text = "";
	inject.text += 'var ep = document.createElement("script");';
	inject.text += 'ep.type = "text/javascript";';
	inject.text += 'ep.text = "' + js + '";';
	//This code works if we're called with programatic injection or content_script injection
	//If we're called programatically from chrome context (popup.js) we need to use executeScript
	if (chrome && chrome.tabs) {
		//Programatic injection
		inject.text += 'document.head.appendChild(ep);';
		chrome.tabs.executeScript(null, {"code": inject.text});
	} else {
		//Content_script injection
		document.head.appendChild(inject);
	}
}
