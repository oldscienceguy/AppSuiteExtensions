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

//Inject all our dependent EPs first
//Note: All arguments to injectScript are passed as quoted string - see var url

var developer = "RAL";
var EP1, EP2, EP3, EP4, EP5 = null;
EP1 = {
  funcName: "MessageAdvertising",
  func: MessageAdvertising
};  
EP1.objName = injectObject({chromeExtId: chromeExtId, developer: developer, obj: EP1.func, objName: EP1.funcName})
storage.set({'CB1': false},function(){});

EP2 = {
  funcName: "Branding",
  func: Branding
};
EP2.objName = injectObject({chromeExtId: chromeExtId, developer: developer, obj: EP2.func, objName: EP2.funcName});
storage.set({'CB2': false},function(){});

EP3 = {
  funcName: "AddDropboxMenu",
  func: AddDropboxMenu
};
EP3.objName = injectObject({chromeExtId: chromeExtId, developer: developer, obj: EP3.func, objName: EP3.funcName});
storage.set({'CB3': false},function(){});

EP4 = {
  funcName: "NewApplication",
  func: NewApplication
};
EP4.objName = injectObject({chromeExtId: chromeExtId, developer: developer, obj: EP4.func, objName: EP4.funcName});
storage.set({'CB4': false},function(){});

EP5 = {
  funcName: "ThemeMaker2",
  func: ThemeMaker2
};
EP5.objName = injectObject({chromeExtId: chromeExtId, developer: developer, obj: EP5.func, objName: EP5.funcName});
storage.set({'CB5': false},function(){});

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
      case "enable": 
        //Better to send message directly to application, but can only do so via windows message passing
        injectCode(request.objName + ".enableExt();");
        break;
      case "disable":
        injectCode(request.objName + ".disableExt();");
        break;
      case "info":
        switch (request.objName) {
          case "EP1":
            if (EP1) 
              sendResponse(EP1);
            break;
          case "EP2":
            if (EP2)
              sendResponse(EP2);
            break;
          case "EP3":
            if (EP3)
              sendResponse(EP3);
            break;
          case "EP4":
            if (EP4)
              sendResponse(EP4);
            break;
          case "EP5":
            if (EP5)
              sendResponse(EP5);
            break;
        }
        break;
    }
    /*
    console.log(sender.tab ?
                "from a content script:" + sender.tab.url :
                "from the extension");
    if (request.greeting == "hello")
      sendResponse({farewell: "goodbye"});
    */
  });