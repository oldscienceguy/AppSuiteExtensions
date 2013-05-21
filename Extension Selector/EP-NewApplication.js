//Example from http://oxpedia.org/wiki/index.php?title=AppSuite:Writing_a_simple_application
//Look at main.js (multiple copies, one for each app) for additional examples
OxEpNamespace.NewApplication = {
	extPoint: 'extensionPoint',
	extId: 'extensionId',
	ext: null,
	loaded: false,
	chromeExtId: '', //Set in execution.js
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
/*
//Trying example from widgetbox.com, not working
			        win.nodes.main.append($().html('<script type="text/javascript" src="http://cdn.widgetserver.com/syndication/subscriber/InsertWidget.js"></script><script type="text/javascript">if (WIDGETBOX) WIDGETBOX.renderWidget("1b2fd4c7-cea1-435d-a38e-2ac32305b03d");</script>'\
'<noscript>Get the <a href="http://www.widgetbox.com/widget/last-fm-music-charts">last.fm Music Charts</a> widget and many other <a href="http://www.widgetbox.com/">great free widgets</a> at <a href="http://www.widgetbox.com">Widgetbox</a>! Not seeing a widget? (<a href="http://support.widgetbox.com/">More info</a>)</noscript>'
));
*/
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