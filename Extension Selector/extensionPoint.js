//Updated ExtensionPoint examples from  Matthias Biggeleben, wrapped in Chrome Extension by Rich Landsman

//WARNING:  Function name gets replaced with namespace specific function during injection
//	DO NOT USE Function Name anywhere other than definition or it will be replaced

console.log("extensionPoint.js loading");

//Disable extensions
function DisableExtension(extPoint,id) { 
	require(["io.ox/core/extensions"], function(ext) {
		//ext.point("io.ox/calendar/detail").disable("participants");
		ext.point(extPoint).disable(id);
	});
}

//Enable extensions
function EnableExtension(extPoint,id) { 
	require(["io.ox/core/extensions"], function (ext){
		//ext.point("io.ox/calendar/detail").enable("participants");
		ext.point(extPoint).enable(id);
	});
}

//Use this for creating new EP objects
Template = {
	extPoint: 'extensionPoint',
	extId: 'extensionId',
	ext: null,
	opt1: null, //Optional data
	install: function() {
		var self = this; //For use where this doesn't reference object
		require(["io.ox/core/extensions"], function(ext){
			self.ext = ext;
			//Extension point code goes here
		});
	},
	enableExt: function() {
		//If not installed, ext will be undefined
		if (this.ext)
			this.ext.point(this.extPoint).enable(this.extId);	
	},
	disableExt: function() {
		if (this.ext)
			this.ext.point(this.extPoint).disable(this.extId);
	},
	removeExt: function () {

	}
		
}

//Add advertisement banner to mail detail view
//Example url
//var url = "http://upload.wikimedia.org/wikipedia/de/thumb/" + 
//    "c/cb/Logo_Burger_King.svg/200px-Logo_Burger_King.svg.png"

MessageAdvertising = {
	extPoint: 'io.ox/mail/detail/header',
	extId: 'ad',
	ext: null,
	url: null,
	install: function(url) {
		this.url = url;
		var self = this;
		require(["io.ox/core/extensions"],function(ext) {
			self.ext = ext;
			ext.point(self.extPoint).extend({
		  		index: 'first',
		  		id: self.extId,
		  		draw: function (data) {
		  			//this refers to the window in the draw context, not the object
		  			//Use 'self'
		    		this.append(
		      			$('<div class="pull-right">')
		      				.css({
	        				backgroundImage: "url(" + self.url + ")",
		        			backgroundSize: '100px 100px',
		        			width: '100px', height: '100px',
		        			margin: '0px 0px 40px 10px',
		      			})
		    		);
		  		}
			});
		});
	},
	//We can't call this method same name as ext.point... or it will be replaced in injectObj
	enableExt: function() {
		//If not installed, ext will be undefined
		if (this.ext)
			this.ext.point(this.extPoint).enable(this.extId);
	},
	disableExt: function() {
		if (this.ext)
			this.ext.point(this.extPoint).disable(this.extId);
	},
	removeExt: function () {

	}
}

//Add your own extension
function AddYourOwnExtension() { 
	// calendar detail view
	require(["io.ox/core/extensions"], function(ext){
		ext.point("io.ox/calendar/detail").extend({
		  index: 10,
		  id: "strange",
		  draw: function (appointment) {
		    var strangeTitle = appointment.title.replace(/[aeiou]/g, "o"),
		        $titleNode = $("<h2>").text(strangeTitle);
		    return this.append($titleNode);
		  }
		});
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
	require(["io.ox/core/extensions"], function(ext){
		ext.point("io.ox/calendar/detail").replace({
		  id: "title",
		  draw: function (data) {
		    this.append(
		      $('<div class="title">').css('color', '#a00').text("Hello World! " + data.title)
		    );
		  }
		});
	});
}

//Change order of existing extensions
function ChangeExtensionOrder () { 
// Shuffle extension order
	require(["io.ox/core/extensions"], function(ext){
		ext.point("io.ox/calendar/detail").each(function (e) {
		  e.index = Math.random() * 1000 >> 0;
		}).sort();
	});
}

//From documentation, reverses contact
InvertContactOrder = {
	extPoint: 'io.ox/contacts/detail',
	extId: 'com-example-contact-reversename',
	ext: null,
	opt1: null, //Optional data
	install: function() {
		var self = this; //For use where this doesn't reference object
		require(["io.ox/core/extensions"], function(ext){
			self.ext = ext;
			//Extension point code goes here
	        this.ext.point(this.extPoint).extend({
	            id: this.extId,
	            after: 'contact-details',
	            draw: function (baton) {

	                var name = baton.data.display_name;
	                var rev = name.split("").reverse().join("");
	                //Adds reversed name below UI
	                this.append(
	                    $("<h1>").text(rev)
	                );
	            }
	        });
        });
	},
	enableExt: function() {
		//If not installed, ext will be undefined
		if (this.ext)
			this.ext.point(this.extPoint).enable(this.extId);	
	},
	disableExt: function() {
		if (this.ext)
			this.ext.point(this.extPoint).disable(this.extId);
	},
	removeExt: function () {

	}		
}

//Add menu item to File detail 'more' menu
//Extracted from documentation
AddFileLinks = {
	extPoint: 'io.ox/files/links/inline',
	extId: 'testlink',
	ext: null,
	opt1: null, //Optional data
	install: function() {
		//this.ext = require("io.ox/core/extensions");
		var self = this; //For use where this doesn't reference object
		//Extension point code goes here
		require(['io.ox/core/extensions', 'io.ox/core/extPatterns/links'], function (ext, links) {
			self.ext = ext;
  			new links.Action('io.ox/files/actions/testlink', {
  				//Removed from example, capabilities not recognized
  				/*
				requires: function (e) {
      				e.collection.has('some') && capabilities.has('webmail');
				},
				*/
				//Use action: if single use
				//Use multiple: if can be reused
    			multiple: function (baton) {
      				console.log(baton);
    			}
  			}); //End Action def

  			ext.point(this.extPoint).extend(new links.Link({
   				id: this.extId, //Must be unique
    			index: 400,	//Order of link 
    			label: 'labelname', //What the user sees
    			ref: 'io.ox/files/actions/testlink' //Reference to action
  			})); //End ext.point
		}); //End require
	},
	enableExt: function() {
		//If not installed, ext will be undefined
		if (this.ext)
			this.ext.point(this.extPoint).enable(this.extId);	
	},
	disableExt: function() {
		if (this.ext)
			this.ext.point(this.extPoint).disable(this.extId);
	},
	removeExt: function () {

	}
		
}

//Start working on new portal widget example using doc as example
//See http://oxpedia.org/wiki/index.php?title=AppSuite:Writing_a_portal_plugin
//Not working, we need to explore defining a module via Chrome ext
//I think we need to use ext1 = require('io.ox/portal/widgets') and add the module?
PortalWidget = {
	extPoint: 'extensionPoint',
	extId: 'extensionId',
	ext: null,
	opt1: null, //Optional data
	install: function() {
		var self = this; //For use where this doesn't reference object
		require(['io.ox/core/extensions/myAd'], function(ext){
			self.ext = ext;
			//Extension point code goes here
			ext.point('io.ox/portal/widget').extend({
				//Preview is what we see on the portal page
	        	preview: function () {
	            	var content = $('<div class="content">')
	                .text("Buy stuff. It's like solid happiness.");
	            	this.append(content);
	        	}
	        });
			//This adds the widget to the settings page so user can select
		    ext.point('io.ox/portal/widget/myAd/settings').extend({
		        title: 'My advertisement',
		        type: 'myAd'
		    });
	    });
	},
	enableExt: function() {
		//If not installed, ext will be undefined
		if (this.ext)
			this.ext.point(this.extPoint).enable(this.extId);	
	},
	disableExt: function() {
		if (this.ext)
			this.ext.point(this.extPoint).disable(this.extId);
	},
	removeExt: function () {

	}
		
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


