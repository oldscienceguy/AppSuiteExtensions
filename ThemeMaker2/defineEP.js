//Steps
// 1. Set filename to the .js file containing the extension object
// 2. Set developer to your Company/Person
// 3. Update manifest.json.  Make sure filename is specified in web resources
var filename = 'EP-ThemeMaker2.js';
var developer = "Ox_RAL";
var namespace = createNamespace(developer); //Defined in injectScript.js
//Insert EP into Application JS context
//Special case where we need to inject utility files
//We shouldn't have to wait and can inject right away
injectJSFile({filename: 'less-1.3.0.min.js'});
window.setTimeout(function() {
	injectJSFile({filename: filename});
},1000); //end window.settimeout
