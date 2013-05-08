//If we're called from popup.html, we can set up event handlers for html object
//Inline script is not allowed in Chrome extension .html. So everything must be done in .js

//console.log() and debugger; only work when you open the context menu on the Chrome Ext Icon 
// and select 'Inspect Popup'.  console.log data will output here.
//To trigger a breakpoint, set it, then execute location.reload(true) in the console window
console.log("In popup.js, but you won't see this unless you have 'Inspect Popup' window open");

//Persistent storage can be local or sync
//If sync, Chrome will attempt to set/restore across different devices
var storage = chrome.storage.local;

function saveState() {
    storage.set({
    	'CB1': $("#checkBox1")[0].checked,
    	'CB2': $("#checkBox2")[0].checked,
    	'CB3': $("#checkBox3")[0].checked,
    	'CB4': $("#checkBox4")[0].checked,
    },function(){});
}

function sendMessage(objName, action, response) {
    //Send to current tab
    chrome.tabs.getSelected(null, function(tab) {
        chrome.tabs.sendMessage(tab.id, {
            objName: objName,
            action: action
        }, response);
    });
}



//Is ready called on each click or only first
//Add a handler for our close button
$(document).ready(function(){
    //Get info for each extension point from content_script
    //TODO: Make the whole UI dynamic based on number of IPs created in execution.js
    // Get count and loop to create UI with JQuery

    var EP1, EP2, EP3, EP4;
    sendMessage("EP1","info", function(response) {
        //console.log(response);
        EP1 = response;
        $("#cb1Label").text(EP1.funcName);
    });
    sendMessage("EP2","info", function(response) {
        //console.log(response);
        EP2 = response;
        $("#cb2Label").text(EP2.funcName);
    });
    sendMessage("EP3","info", function(response) {
        //console.log(response);
        EP3 = response;
        $("#cb3Label").text(EP3.funcName);
    });
    sendMessage("EP4","info", function(response) {
        //console.log(response);
        EP4 = response;
        $("#cb4Label").text(EP4.funcName);
    });

	storage.get(['CB1','CB2','CB3','CB4'],function(items){
		//This is a callback and gets called asynchronously from rest of code
		//Wait for storage data to be available
		if (items.CB1) {
			$("#checkBox1")[0].checked = items.CB1;
            //injectCode(msgObj + ".enableExt();");
        } else {
            //injectCode(msgObj + ".disableExt();");            
        }
		if (items.CB2) {
			$("#checkBox2")[0].checked = items.CB2;
            //injectCode(contactObj + ".enableExt();");
        } else {
            //injectCode(contactObj + ".disableExt();");       
        }
		if (items.CB3)
			$("#checkBox3")[0].checked = items.CB3;
		if (items.CB4)
			$("#checkBox4")[0].checked = items.CB4;
	});

	//Save when popup closes

	$("#closeButton").click(function(){
        window.close();
    });

    $("#checkBox1").click(function(){
        if (!EP1)
            return;
    	saveState();
    	//Turn on EP
    	if ($("#checkBox1")[0].checked) {
            sendMessage(EP1.objName,"enable",function(){});
    	} else {
            sendMessage(EP1.objName,"disable",function(){});
    	}
    });
    $("#checkBox2").click(function(){
        if (!EP2)
            return;
    	saveState();
        if ($("#checkBox2")[0].checked) {
            sendMessage(EP2.objName,"enable",function(){});
        } else {
            sendMessage(EP2.objName,"disable",function(){});
        }
    });
    $("#checkBox3").click(function(){
        if (!EP3)
            return;
        saveState();
        if ($("#checkBox3")[0].checked) {
            sendMessage(EP3.objName,"enable",function(){});
        } else {
            sendMessage(EP3.objName,"disable",function(){});
        }    });
    $("#checkBox4").click(function(){
        if (!EP4)
            return;
        saveState();
        if ($("#checkBox4")[0].checked) {
            sendMessage(EP4.objName,"enable",function(){});
        } else {
            sendMessage(EP4.objName,"disable",function(){});
        }    });

});