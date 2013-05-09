//Derived from Stephan's work for Charter
Branding = {
	extPoint: 'extensionPoint',
	extId: 'extensionId',
	ext: null,
	loaded: false,
	chromeExtId: '', //Set in execution.js
	install: function(callWhenInstalled) {
		var self = this; //For use where this doesn't reference object
		window.setTimeout(function() {

			require(["io.ox/core/extensions"], function(ext){
				self.ext = ext;
				self.loaded = true;
				//Extension point code goes here
				//This overrides the top location for entire AppSuite and creates space at top
				//Topbar
				$('#io-ox-topbar').css({ 
					backgroundImage: 'linear-Gradient(to bottom, white, black)'
				});
				//Mail left nav bar
				$('.window-head').css({ 
					backgroundImage: 'linear-Gradient(to bottom, white, black)'
				});
				//Launcher background
				$('#io-ox-core.wallpaper').css({
				    backgroundImage: 'linear-Gradient(to bottom, white, black)'
				});

				/*
				//This is too hacky and slow to customize everything, need a better way!
				$('#io-ox-topbar') 
					.css ({
						//.vertical-gradient is a {less} mixin defined in appsuite definitions.js
						//We'll just set background
						background: '#7ac334' //CharterGreen
					});
				//Side bar
				$('.window-head') 
					.css ({
						//.vertical-gradient is a {less} mixin defined in appsuite definitions.js
						//We'll just set background
						background: '#7ac334' //CharterGreen
					});
				*/

				//Appsuite uses {less} see http://lesscss.org/
				//This compiles server side css with variable replacement
				//There is a way to use {less} browser side, but I don't know how to replace
				//  variables that are defined in definitions.less
				//So we manually change style here as brute force

				//There are jquery plugins to make adding a css class easier
				// look for .cssRule plugin or jss
				//Brute force
				//We could load css file from ext resources with chrome-extension url
				//  but no way to easily add self.chromeExtId as we can with strings below
				$("<style>")
				    .prop("type", "text/css")
				    
				    .html("\
				    	#io-ox-core {\
    						top: 98px;\
						}\
				    	.charter-header {\
						    height: 98px;\
						    background: url(chrome-extension://" + self.chromeExtId + "/images/charter-bg.png);\
						}\
					    .logo {\
					        float: left;\
					        height: 98px;\
					        width: 195px;\
					        background: url(chrome-extension://" + self.chromeExtId + "/images/charter-logo-hl.png);\
					        margin-left: 108px;\
					    }\
					    .google {\
					        position: absolute;\
					        right: 330px;\
					        height: 98px;\
					        .input-append {\
					            position: absolute;\
					            top: 50%;\
					            margin-top: -15px;\
					        }\
					    }\
					")

					.appendTo("head");

			    $('body').prepend(
			        $('<div>').addClass('charter-header')
			        .append(
			            // append the logo container
			            $('<div>').addClass('logo')
			        )
			        .append(
			            // append the google search container
			            $('<div>').addClass('google')
			            .append(
			                // container for input
			                $('<div>').addClass('input-append')
			                .append(
			                    // input field
			                    $('<input>').addClass('span2').attr({ placeholder: 'Google', type: 'text', id: 'google-search-input' }),
			                    // button on right
			                    $('<button>').addClass('btn')
			                    .append(
			                        $('<i>').addClass('icon-search')
			                    )
			                    // catch the click on the 'search' button
			                    .on('click', function (evt) {
			                        // get value of input field and trigger alert
			                        alert('Your search: ' + $('#google-search-input').val());
			                    })
			                )
			            )
			        )
			    );
/*
				$('body')
					.prepend(
	        			$('<div>')
	        				.addClass('charter-header')
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
*/
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
