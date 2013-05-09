//From Lessons
FloatingWidget = {
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