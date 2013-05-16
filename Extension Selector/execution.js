//This is executing in the content_script sandbox

//@@ macros work in CSS
//Can be used in a URL with __MSG__ preffix
//background-image:url('chrome-extension://__MSG_@@extension_id__/background.png');

var chromeExtId = chrome.i18n.getMessage("@@extension_id");
//console.log(myid);
//var myUrl = chrome.extension.getURL('appsuite.png');
//console.log(myUrl);

//This is an exception to content script sandbox.
//We have access to storage objects and can use it to share data across sessions with background and popup
var storage = chrome.storage.local;

//Testing
//injectJSFile({filename:'EP-Template.js'});
//injectCSSFile({filename:'EP-Style.css'});

//Inject all our dependent EPs first
//Note: All arguments to injectScript are passed as quoted string - see var url

var developer = "Ox_RAL";
var namespace = createNamespace(developer);
var numExtensions = 0;
var extensions = [];
function addExtensionPoint(filename,objName) {
  var i = numExtensions++;
  var fullObjName = namespace + '.' + objName;
  extensions[i] = {};
  extensions[i].pos = i;
  extensions[i].label = objName; //What gets displayed in popup UI
  extensions[i].objName = fullObjName;
  injectJSFile({filename: filename});
  var o = {};
  o[fullObjName]=false; //Ugly way to create an object member from a variable
  storage.set(o);
}

//Add as many as we want, popup.js is dynamic and will display whatever we add here
addExtensionPoint('EP-MessageAdvertising.js','MessageAdvertising');
addExtensionPoint('EP-Branding.js','Branding');
addExtensionPoint('EP-AddDropboxMenu.js','AddDropboxMenu');
addExtensionPoint('EP-NewApplication.js','NewApplication');
addExtensionPoint('EP-ThemeMaker2.js','ThemeMaker2');
addExtensionPoint('EP-PortalWidget.js','PortalWidget');

//Popup page will send us messages
chrome.extension.onRequest.addListener(function(request, sender, sendResponse) {
	//console.log(request);
	/*
  if (request.greeting == "hello"){
    var1 = request.var1; // Set variable 1
    var2 = request.var2; // Set variable 2
  }
  else{
    sendResponse({});    // Stop
  }
  */
});
//Handle messages from popup
// request.action
// request.objName
chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    //console.log(request, sender);
    switch (request.action) {
      case 'numExtensions':
        sendResponse(numExtensions);
        break;
      case "enable": 
        //Better to send message directly to application, but can only do so via windows message passing
        injectCode(request.objName + ".enableExt();");
        break;
      case "disable":
        injectCode(request.objName + ".disableExt();");
        break;
      case "info":
        sendResponse(extensions[request.objName]);
        return;

    }
    /*
    console.log(sender.tab ?
                "from a content script:" + sender.tab.url :
                "from the extension");
    if (request.greeting == "hello")
      sendResponse({farewell: "goodbye"});
    */
  });