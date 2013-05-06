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

MessageAdvertising = {
	extPoint: 'io.ox/mail/detail/header',
	extId: 'ad',
	ext: null,
	url: null,
	adToDisp: -1,
	//web-banner-gallery has good examples of different image sizes and href's
	//This doesn't really belong here, but it's the easiest way to get the data to 
	//simulate auto-rotation of an ad server
	ads: [{
		img: 'http://web-banner-gallery.com/wp-content/uploads/2010/11/YMG-125x125-banner.gif',
		href: 'http://www.be-yellow.com/'
		},
		{
		img: 'http://web-banner-gallery.com/wp-content/uploads/2010/11/lynda-125x125-banner.jpg',
		href: 'http://www.lynda.com/'
		},
		{
		img: 'http://web-banner-gallery.com/wp-content/uploads/2010/09/mailchimp-125x125-banner.png',
		href: 'http://www.mailchimp.com/'
		},
		{
		img: 'http://web-banner-gallery.com/wp-content/uploads/2010/10/tophosts-125x125-banner.jpg',
		href: 'http://www.tophosts.com/top25-web-hosts.html'
		}
	],
	ad: null,

	install: function(url) {
		this.url = url;
		var self = this;

		require(["io.ox/core/extensions"],function(ext) {
			self.ext = ext;
			ext.point(self.extPoint).extend({
		  		index: 'first',
		  		id: self.extId,
		  		draw: function (data) {
		  			//Pick an ad as if server were rotating it
		  			self.adToDisp = ++self.adToDisp % 4;
		  			self.ad = self.ads[self.adToDisp];
		  			//'this' refers to the window in the draw context, not the object
		  			//Use 'self'
		  			// IAB standard ad sizes http://www.iab.net/guidelines/508676/508767/displayguidelines
		  			this.append(
		  				//Create new jQuery object and set html
		  				
		  				//Use this for iframe and ad-server that returns HTML
		  				/*
		  				$('<iframe />>')
			  				.css({
			        			width: '125', height: '125',
			        			margin: '0px 0px 40px 10px',
			      			})
			      			.attr({
			      				class: 'pull-right', 
			      				src: 'http://web-banner-gallery.com/2010/ymg-125x125-banner.html'
			      			})
						*/
			      		$('<a>')
			      			.attr({
			      				href: self.ad.href,
			      				target: '_blank'
			      			})
			      			.html(
			      				$('<img>')
			      					.css({
			        				width: '125px', height: '125px',
			        				margin: '0px 0px 40px 10px'
			      					})
			      					.attr({
			      						class: 'pull-right',
			      						src: self.ad.img
			      					})

		        			) //end html		      		
		      		); //end append
		  		} //end draw
			}); //end extend
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

//Sample Dropbox integration: 
//Make a function "Save to Dropbox" available in eMail and Files 
//Todo: Actually integrate with Dropbox
//Todo: Make the dropbox web application available as an app in app suite launcher. 

AddDropboxMenu = {
	extPoint1: 'io.ox/files/links/inline', //Add to Files More... menu
	extPoint2: 'io.ox/mail/links/inline', //Add to Mail More ... menu
	extId: 'sendToDropbox',
	ext: null,
	opt1: null, //Optional data
	linkAction: 'io.ox/mail/actions/sendToDropbox',
	install: function() {
		var self = this;
		require(['io.ox/core/extensions', 'io.ox/core/extPatterns/links'], function (ext, links) {
			self.ext = ext;
			//links.Action(...) must match links.Link(ref:) to be triggered
			//See actions.js in source for additional action examples
			new links.Action( self.linkAction, {
		       id: self.extId,
		       requires: 'one',
		       	//Use action: if single use
				// or
				//Use multiple: if can be reused
    			//multiple: function (baton) {
      			//	console.log(baton);
    			//}

		       action: function (baton) {
		           console.log("Save to DropBox", baton);
					// Whatever you want to do goes here
		       }
			});
			ext.point(self.extPoint1).extend(new links.Link({
		        //after: 'reminder',
		        prio: 'lo',	//Not sure how used
		        //index: 400, //Not sure how used
		        id: self.extId,
		        label: "Save to DropBox",
		        //ref: has to be same as links.Action() above
		        ref: self.linkAction
		    }));
		    ext.point(self.extPoint2).extend(new links.Link({
		        //after: 'reminder', //Explicit positioning in menu
		        prio: 'lo',
		        id: self.extId,
		        label: "Save to DropBox",
		        //ref: has to be same as links.Action() above
		        ref: self.linkAction	//Reuses action
		    }));

		});
	},
	enableExt: function() {
		//If not installed, ext will be undefined
		if (this.ext)
			this.ext.point(this.extPoint1).enable(this.extId);	
			this.ext.point(this.extPoint2).enable(this.extId);	
	},
	disableExt: function() {
		if (this.ext)
			this.ext.point(this.extPoint1).disable(this.extId);
			this.ext.point(this.extPoint2).disable(this.extId);
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
*/


