//This is executing in the content_script sandbox

//This is an exception to content script sandbox.
//We have access to storage objects and can use it to share data across sessions with background and popup
var storage = chrome.storage.local;

//Inject all our dependent EPs first
//Note: All arguments to injectScript are passed as quoted string - see var url
var url = '"http://upload.wikimedia.org/wikipedia/de/thumb/' + 
'c/cb/Logo_Burger_King.svg/200px-Logo_Burger_King.svg.png"';

//url: is specific to this EP Object
var developer = "RAL";
var EP1, EP2, EP3, EP4 = null;
EP1 = {};
EP1.funcName = "MessageAdvertising";
EP1.func = MessageAdvertising;
EP1.objName = injectObject({developer: developer, obj: EP1.func, objName: EP1.funcName, arg1: url});
storage.set({'CB1': true},function(){});

EP2 = {};
EP2.funcName = "InvertContactOrder";
EP2.func = InvertContactOrder;
EP2.objName = injectObject({developer: developer, obj: EP2.func, objName: EP2.funcName});
storage.set({'CB2': true},function(){});

storage.set({'CB3': false},function(){});
storage.set({'CB4': false},function(){});


//Popup page will send us messages
chrome.extension.onRequest.addListener(function(request, sender, sendResponse) {
	console.log(request);
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
    console.log(request, sender);
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