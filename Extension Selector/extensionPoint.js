//Updated ExtensionPoint examples from  Matthias Biggeleben, wrapped in Chrome Extension by Rich Landsman

//WARNING:  Function name gets replaced with namespace specific function during injection
//	DO NOT USE Function Name anywhere other than definition or it will be replaced

//Disable extensions
function DisableExtension(extPoint,id) { 
	// Disable participants
	var ext = require("io.ox/core/extensions");
	//ext.point("io.ox/calendar/detail").disable("participants");
	ext.point(extPoint).disable(id);
}

//Enable extensions
function EnableExtension(extPoint,id) { 
	// Re-enable participants
	var ext = require("io.ox/core/extensions");
	//ext.point("io.ox/calendar/detail").enable("participants");
	ext.point(extPoint).enable(id);
}

//Add advertisement banner to mail detail view
//Example url
//var url = "http://upload.wikimedia.org/wikipedia/de/thumb/" + 
//    "c/cb/Logo_Burger_King.svg/200px-Logo_Burger_King.svg.png"

function AddAdvertisementBanner(url) {
	var ext = require("io.ox/core/extensions");
	ext.point('io.ox/mail/detail/header').extend({
	  index: 'first',
	  id: 'ad',
	  draw: function (data) {
	    this.append(
	      $('<div class="pull-right">')
	      .css({
	        backgroundImage: "url(" + url + ")",
	        backgroundSize: '100px 100px',
	        width: '100px', height: '100px',
	        margin: '0px 0px 40px 10px',
	      })
	    );
	  }
	});
}

//Add your own extension
function AddYourOwnExtension() { 
	// calendar detail view
	var ext = require("io.ox/core/extensions");
	ext.point("io.ox/calendar/detail").extend({
	  index: 10,
	  id: "strange",
	  draw: function (appointment) {
	    var strangeTitle = appointment.title.replace(/[aeiou]/g, "o"),
	        $titleNode = $("<h2>").text(strangeTitle);
	    return this.append($titleNode);
	  }
	});
}


//Customize existing extension
function CustomizeExistingExtension() { 
	ext.point("io.ox/calendar/detail/date").extend({
	  id: "highlight",
	  index: 'last',
	  draw: function () {
	    this.css({
	      backgroundColor: "yellow",
	      padding: "3px",
	      border: "1px solid #fc0"
	    });
	  }
	});
}

//Replace existing extension
function ReplaceExistingExtension () { 
	var ext = require("io.ox/core/extensions");
	ext.point("io.ox/calendar/detail").replace({
	  id: "title",
	  draw: function (data) {
	    this.append(
	      $('<div class="title">').css('color', '#a00').text("Hello World! " + data.title)
	    );
	  }
	});
}

//Change order of existing extensions
function ChangeExtensionOrder () { 
// Shuffle extension order
	var ext = require("io.ox/core/extensions");
	ext.point("io.ox/calendar/detail").each(function (e) {
	  e.index = Math.random() * 1000 >> 0;
	}).sort();
}

//Adds SaveToDropBox to More menu for attachments
//Adds same in Files application More menu
function AddSaveToDropBoxMenu () {

}

function BrandedLook () {

}

/* 
From Raf
Todo: 1. Skinning
Switch to a different looking skin, with Ad-Support, to show simlpe skinning / CSS capabilities
2. Upsell Layer
"Downgrade" system to mail & contacts only. Clicking on the other modules or on one of the functions inside mail 
that connects to those other modules brings up simple upsell dialog with a Buy button. 
If clicked, the system reloads with all features enabled
3. Extension Points
Sample Dropbox integration: Make a function "Save to Dropbox" available in eMail and Files, 
extending the menus or providing a button where feasible (see mockups attached). 
Make the dropbox web application available as an app in app suite launcher. 
If we want to get funky create a Dropbox widget that shows the latest files added / changed. 
And if we want to be really really funky display the dropbox folder list available in files - 
but I assume this requires backend work, so forget it if it does,.
*/
