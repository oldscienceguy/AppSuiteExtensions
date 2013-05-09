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
	chromeExtId: '', //Set in execution.js
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
