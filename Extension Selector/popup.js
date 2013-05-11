//If we're called from popup.html, we can set up event handlers for html object
//Inline script is not allowed in Chrome extension .html. So everything must be done in .js

//console.log() and debugger; only work when you open the context menu on the Chrome Ext Icon 
// and select 'Inspect Popup'.  console.log data will output here.
//To trigger a breakpoint, set it, then execute location.reload(true) in the console window
console.log("In popup.js, but you won't see this unless you have 'Inspect Popup' window open");

//Persistent storage can be local or sync
//If sync, Chrome will attempt to set/restore across different devices
var storage = chrome.storage.local;

function sendMessage(objName, action, response) {
    //Send to current tab
    chrome.tabs.getSelected(null, function(tab) {
        chrome.tabs.sendMessage(tab.id, {
            objName: objName,
            action: action
        }, response);
    });
}

function enableDisable(event){
    //event.data has any optional args passed in {}
    var ep = event.data.ep;
    var cb = event.target;
    //Save state across sessions
    var o = {};
    o[ep]=cb.checked; //Ugly way to create an object member from a variable
    storage.set(o);
    if (cb.checked) {
        sendMessage(ep,"enable",function(){});
    } else {
        sendMessage(ep,"disable",function(){});
    }     

}
//Is ready called on each click or only first
//Add a handler for our close button
$(document).ready(function(){
    //Get info for each extension point from content_script
    //TODO: Make the whole UI dynamic based on number of IPs created in execution.js
    // Get count and loop to create UI with JQuery
    var numExtensions = 0;
    var ui = $('#AppSuiteExtensions');
    var checked = false;
    sendMessage(null,'numExtensions',function(response){
        numExtensions = response;
        for (i=0; i<numExtensions; i++) {

            sendMessage(i,'info',function(response){
                //Get last state of checkbox
                storage.get(response.objName,function(items){
                    checked = false;
                    if (items[response.objName])
                        checked = items[response.objName];

                    ui.append($('<input>', {
                        type: 'checkbox',
                        id: 'checkbox' + response.pos,
                        checked: checked
                        })
                        .on('click', {ep: response.objName}, enableDisable)
                    )
                    .append($('<label>', {
                        text: response.label
                    }))
                    .append($('<br>'))
                }); //end storage get

            }); //end info
        };

    });  //End numExtensions

	//Save when popup closes

	$("#closeButton").click(function(){
        window.close();
    });

});