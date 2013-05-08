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
	loaded: false, //Strangeness: when I called this installed: it couldn't be set from install()
	install: function(callWhenInstalled) {
		var self = this; //For use where this doesn't reference object
		//If this is called while appsuite is loading, we will get an error
		//To be safe, we add a short delay to allow appsuite to finish loading
		window.setTimeout(function() {

			require(["io.ox/core/extensions"], function(ext){
				self.ext = ext;
				self.loaded = true;

				//Extension point code goes here

				//End Extension point code
				//Call success func if defined
				if (callWhenInstalled != null)
					callWhenInstalled();	
			});
		},1000); //end window.settimeout
	},
	enableExt: function() {
		if (!this.loaded)
			this.install(function(){
				this.ext.point(this.extPoint).enable(this.extId);
			});
		else
			this.ext.point(this.extPoint).enable(this.extId);			
	},
	disableExt: function() {
		if (this.loaded)
			this.ext.point(this.extPoint).disable(this.extId);
	},	removeExt: function () {

	}
		
}

//Add advertisement banner to mail detail view

MessageAdvertising = {
	extPoint: 'io.ox/mail/detail/header',
	extId: 'ad',
	ext: null,
	loaded: false,
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

	install: function(callWhenInstalled) {
		//If this is called while appsuite is loading, we will get an error
		//To be safe, we add a short delay to allow appsuite to finish loading
		var self = this;
		window.setTimeout(function() {

			require(["io.ox/core/extensions"],function(ext) {
				self.ext = ext;
				self.loaded = true;
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
			//Call success func if defined
			if (callWhenInstalled != null)
				callWhenInstalled();
			}); //end require
		},1000); //end window.settimeout
	},
	//We can't call this method same name as ext.point... or it will be replaced in injectObj
	enableExt: function() {
		if (!this.loaded)
			this.install(function(){
				this.ext.point(this.extPoint).enable(this.extId);
			});
		else
			this.ext.point(this.extPoint).enable(this.extId);			
	},
	disableExt: function() {
		if (this.loaded)
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
	loaded: false,
	install: function(callWhenInstalled) {
		var self = this; //For use where this doesn't reference object
		window.setTimeout(function() {

			require(["io.ox/core/extensions"], function(ext){
				self.ext = ext;
				self.loaded = true;
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
				//End Extension point code
				//Call success func if defined
				if (callWhenInstalled != null)
					callWhenInstalled();			        
	        });
		},1000); //end window.settimeout
	},
	enableExt: function() {
		if (!this.loaded)
			this.install(function(){
				this.ext.point(this.extPoint).enable(this.extId);
			});
		else
			this.ext.point(this.extPoint).enable(this.extId);			
	},
	disableExt: function() {
		if (this.loaded)
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
	extPoint3: 'io.ox/mail/links/toolbar', //Add to left icon toolbar in mail
	extId: 'sendToDropbox',
	ext: null,
	loaded: false,
	loaded:false,
	linkAction: 'io.ox/mail/actions/sendToDropbox',
	install: function(callWhenInstalled) {
		var self = this;
		window.setTimeout(function() {

			require(['io.ox/core/extensions', 'io.ox/core/extPatterns/links'], function (ext, links) {
				self.ext = ext;
				self.loaded = true;
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
				//End Extension point code
				//Call success func if defined
				if (callWhenInstalled != null)
					callWhenInstalled();	
			});
		},1000); //end window.settimeout
	},
	enableExt: function() {
		if (!this.loaded)
			this.install(function(){
				this.ext.point(this.extPoint1).enable(this.extId);	
				this.ext.point(this.extPoint2).enable(this.extId);	
			});
		else
			this.ext.point(this.extPoint).enable(this.extId);			
	},
	disableExt: function() {
		if (this.loaded) {
			this.ext.point(this.extPoint1).disable(this.extId);
			this.ext.point(this.extPoint2).disable(this.extId);
		}
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
	loaded: false,
	install: function(callWhenInstalled) {
		var self = this; //For use where this doesn't reference object
		window.setTimeout(function() {

			require(['io.ox/core/extensions/myAd'], function(ext){
				self.ext = ext;
				self.loaded = true;
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
				//End Extension point code
				//Call success func if defined
				if (callWhenInstalled != null)
					callWhenInstalled();	
		    });
		},1000); //end window.settimeout
	},
	enableExt: function() {
		if (!this.loaded)
			this.install(function(){
				this.ext.point(this.extPoint).enable(this.extId);
			});
		else
			this.ext.point(this.extPoint).enable(this.extId);			
	},
	disableExt: function() {
		if (this.loaded)
			this.ext.point(this.extPoint).disable(this.extId);
	},
	removeExt: function () {

	}
		
}

//Derived from Stephan's work for Charter
Branding = {
	extPoint: 'extensionPoint',
	extId: 'extensionId',
	ext: null,
	loaded: false,
	install: function(callWhenInstalled) {
		var self = this; //For use where this doesn't reference object
		window.setTimeout(function() {

			require(["io.ox/core/extensions"], function(ext){
				self.ext = ext;
				self.loaded = true;
				//Extension point code goes here
				//This overrides the top location for entire AppSuite and creates space at top
				$('#io-ox-core') 
					.css ({top: '30px'});

				$('body')
					.prepend(
	        			$('<div>')
	        				//.addClass('charter-header')
	        				.css({
	        					//height: '98px'
	    						//background: url('http://www.open-xchange.com/fileadmin/user_upload/open-xchange/image/landing/partner/25_portal_1u1.png')
	        				})
	        				.html('Branded header goes here')
			        		.append(
			    				$('<img>') 
			    					.attr ({
			    						//src: 'http://www.open-xchange.com/fileadmin/user_upload/open-xchange/image/landing/partner/25_portal_1u1.png'
			    					})
			    			)
	        		) //End prepend
				//End Extension point code
				//Call success func if defined
				if (callWhenInstalled != null)
					callWhenInstalled();	
			});
		},1000); //end window.settimeout
	},
	enableExt: function() {
		if (!this.loaded)
			this.install(function(){
				this.ext.point(this.extPoint).enable(this.extId);
			});
		else
			this.ext.point(this.extPoint).enable(this.extId);			
	},
	disableExt: function() {
		//No way to disable this yet
		if (this.loaded)
			this.ext.point(this.extPoint).disable(this.extId);
	},
	removeExt: function () {

	}
		
}

//From Lessons
FloatingWidget = {
	extPoint: 'extensionPoint',
	extId: 'extensionId',
	ext: null,
	loaded: false,
	install: function(callWhenInstalled) {
		var self = this; //For use where this doesn't reference object
		window.setTimeout(function() {

			require(["io.ox/core/extensions"], function(ext){
				self.ext = ext;
				self.loaded = true;
				//Extension point code goes here
				 var point = ext.point("io.ox/lessons/floatingWidget");
			    // Now, let's extend that extension point. Every extension point
			    // has some kind of contract about what it expects its extensions to provide.
			    // In this case, the extension is supposed to provide a #draw method
			    // and is passed the node to draw into as the 'this' variable
			    point.extend({
			        id: 'example1', // Every extension is supposed to have an id
			        index: 100, // Extensions are ordered based on their indexes
			        draw: function () {
			            // This function is called by the part of the code that
			            // offers this extension point
			            this.append($("<h3>").text("Hello, Traveller!"));
			        }
			    });
				//End Extension point code
				//Call success func if defined
				if (callWhenInstalled != null)
					callWhenInstalled();				 
			});
		},1000); //end window.settimeout
	},
	enableExt: function() {
		if (!this.loaded)
			this.install(function(){
				this.ext.point(this.extPoint).enable(this.extId);
			});
		else
			this.ext.point(this.extPoint).enable(this.extId);			
	},
	disableExt: function() {
		if (this.loaded)
			this.ext.point(this.extPoint).disable(this.extId);
	},
	removeExt: function () {

	}
		
}

//Example from http://oxpedia.org/wiki/index.php?title=AppSuite:Writing_a_simple_application
//Look at main.js (multiple copies, one for each app) for additional examples
NewApplication = {
	extPoint: 'extensionPoint',
	extId: 'extensionId',
	ext: null,
	loaded: false,
	install: function(callWhenInstalled) {
		var self = this; //For use where this doesn't reference object
		window.setTimeout(function() {
		    //Todo: When is an app 'loaded'?
			self.loaded = true;

			//First example of installing a full module
			define('com.example/helloWorld/main', [], function () {

			    'use strict';

			    // this is just code. loading this does not imply to launch the application

			    // application object. 'name' is mandatory!
			    var app = ox.ui.createApp({ 
			    	//Properties here would normally go in manifest.json for app
			    	path: 'com.example/helloWorld/main' , //Name of the module definition above
			    	name: 'com.example/helloWorld' ,
			    	title: 'My App', //This is label for menu bar
			    	//Experimenting getting content from extension
			    	//icon: 'chrome-extension://opfldcmdjmbhgphjjaflchmppcbkmanl/appsuite.png',
			    	icon: 'https://appsuite-sprint.open-xchange.com/appsuite/v=7.2.1-1.20130422.131943/apps/io.ox/core/images/tasks.png',
			    	company: 'RAL',
			    	category: 'Productivity',
			    	settings: false,
			    	requires: 'mail', //Set if app depends on appsuite features like mail, calendar, etc
			    	index: 100,
			    	userContent: false	//Displays edit icon next to title if true
			    });

			    // by using setLauncher this way, we register a callback function
			    // that is called when the application is really launched
				// Called by ox.launch('com.example/helloWorld/main');
			    app.setLauncher(function () {
			        // application window (some applications don't have a window)
			        var win = ox.ui.createWindow({
			            name: 'com.example/helloWorld',
			            //chromeless: true, //Uses full application area with no left icon space etc
			            toolbar: true, //Not sure what this does, doesn't seem to make a difference
			            //close: true,
			            title: 'Hello World'
			        });

			        app.setWindow(win);

			        // Add css class with your namespace
			        win.addClass('com-example-helloWorld');
			        /*
			        Styles are usually defined in .less file, where do we defined it?
			        .com-example-helloWorld {
					    h1 {
					        color: red;
					    }
					    ...
					}
			        */

			        // add something on 'main' node
			        win.nodes.main
			            .css({ 
			            	padding: '13px', 
			            	textAlign: 'center' 
			            })
			            .append($('<h1>').text('Hello World!'));

		            //Begin optional dialog example
				    win.nodes.main.append($('<a class="btn">').text('Open Modal Dialog')
				        .on('click', function (e) {
				            e.preventDefault();
				            require(['io.ox/core/tk/dialogs'],
				                function (dialogs) {
				                    new dialogs.ModalDialog({
				                            width: 600,
				                            easyOut: true
				                        })
				                        .append($('<p>').text('Hello world'))
				                        .addButton('close', 'Close')
				                        .show();
				                } //end func dialogs
				            ) //end require
				        }) //end on click
				    ); //end append
				    //End optional dialog example

					//Begin optional notifications example
					require(['io.ox/core/notifications'],
					    function (notifications) {
					        win.nodes.main
					            .append(
					                $('<a class="btn">').text('Display success notfication')
					                    .on('click', function () {
					                        notifications.yell('success', 'Ah success!');
					                    }),
					                $('<a class="btn">').text('Display error notfication')
					                    .on('click', function () {
					                        notifications.yell('error', 'Oh failed!');
					                    })
					            );
						}); //end require

					//End optional notifications example

					//Begin optional halo example
					//For internal users
					win.nodes.main.append(
					    $('<a href="#" class="btn halo-link">')
					    .data({ internal_userid: ox.user_id })       
					    .text('Open Halo')
					);
					//For external users
					win.nodes.main.append(
					    $('<a class="btn halo-link">')
					    .data({ email1: "test@example.com" })
					    .text('Open Halo from Email')
					);
					//End optional halo example

					//Begin optional settings example
						//Todo: Pick up from doc
					//End optional settings example

					//Call win.show if we want app to be displayed as soon as it is created
				    //win.show();

	        	}); //end set app launcher
			    // show the window

			    return {
			        getApp: app.getInstance
			    };
			});	//end define

			//End Extension point code
			//Call success func if defined
			if (callWhenInstalled != null)
				callWhenInstalled();				    

		},1000); //end window.settimeout		

		//App is not being added to menu bar until we call ox.launch in enableExt()
		//Calling ox.launch here doesn't work
		//So how do we get app in menu bar after install()?

	}, //end install
	enableExt: function() {
		//Todo
		if (!this.loaded)
			this.install(function(){
				ox.launch('com.example/helloWorld/main');
				//this.ext.point(this.extPoint).enable(this.extId);
			});
		else
			ox.launch('com.example/helloWorld/main');
			//this.ext.point(this.extPoint).enable(this.extId);			
	},
	disableExt: function() {
		if (this.loaded)
			ox.launch('io.ox/mail/main');
		return;
		if (this.loaded)
			this.ext.point(this.extPoint).disable(this.extId);
	},
	removeExt: function () {

	}
		
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


