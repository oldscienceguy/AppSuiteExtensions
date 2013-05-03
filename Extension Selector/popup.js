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

//Is ready called on each click or only first
//Add a handler for our close button
$(document).ready(function(){
	var foo = false;
    //Inject all our dependent EPs first
    //Note: All arguments to injectScript are passed as quoted string - see var url
    var url = '"http://upload.wikimedia.org/wikipedia/de/thumb/' + 
    'c/cb/Logo_Burger_King.svg/200px-Logo_Burger_King.svg.png"';

    //Testing
    //url: is specific to this EP Object
    var msgObj = injectObject({developer: "RAL", obj: MessageAdvertising, objName: "MessageAdvertising"});
    injectCode(msgObj + ".url = " + url + ";");
    injectCode(msgObj + ".install();");


	storage.get(['CB1','CB2','CB3','CB4'],function(items){
		//This is a callback and gets called asynchronously from rest of code
		//Wait for storage data to be available
		if (items.CB1) {
			$("#checkBox1")[0].checked = items.CB1;
            injectCode(msgObj + ".enableExt();");
        } else {
            injectCode(msgObj + ".disableExt();");            
        }
		if (items.CB2)
			$("#checkBox2")[0].checked = items.CB2;
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
    	saveState();
    	//Turn on EP
    	if ($("#checkBox1")[0].checked) {
            injectCode(msgObj + ".enableExt();");
    	} else {
            injectCode(msgObj + ".disableExt();");
    	}
    });
    $("#checkBox2").click(function(){
    	saveState();
    	//Turn on EP
    });
    $("#checkBox3").click(function(){
    	saveState();
    	//Turn on EP
    });
    $("#checkBox4").click(function(){
    	saveState();
    	//Turn on EP
    });

});