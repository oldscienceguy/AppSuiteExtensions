//If we're called from popup.html, we can set up event handlers for html object
//Inline script is not allowed in Chrome extension .html. So everything must be done in .js

//Add a handler for our close button
$(document).ready(function(){
    $("#closeButton").click(function(){
        window.close();
    });
});

//We can also get and set persistent storage that lasts across browser sessions
//Persistent storage can be local or sync
//If sync, Chrome will attempt to set/restore across different devices
var storage = chrome.storage.local;

storage.set({
	'KeyValue1': "Value of KeyValue1",
	'KeyValue2': "Value of KeyValue2"
},function(){
	//Success
})

storage.get([
	'KeyValue1',
	'KeyValue2'],
	function(items){
		if (items.KeyValue1)
			console.log(items.KeyValue1);
		if (items.KeyValue2)
			console.log(items.KeyValue2);

})

