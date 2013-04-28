//If we're called from popup.html, we can set up event handlers for html object
//Inline script is not allowed in Chrome extension .html. So everything must be done in .js

//Add a handler for our close button
$(document).ready(function(){
    $("#closeButton").click(function(){
        window.close();
    });
});