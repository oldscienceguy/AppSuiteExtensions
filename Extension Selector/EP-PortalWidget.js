//Start working on new portal widget example using doc as example
//See http://oxpedia.org/wiki/index.php?title=AppSuite:Writing_a_portal_plugin
//Not working, we need to explore defining a module via Chrome ext
//I think we need to use ext1 = require('io.ox/portal/widgets') and add the module?
PortalWidget = {
	extPoint: 'extensionPoint',
	extId: 'extensionId',
	ext: null,
	loaded: false,
	chromeExtId: '', //Set in execution.js
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
