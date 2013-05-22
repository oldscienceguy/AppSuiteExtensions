//Use this for creating new EP objects
OxEpNamespace.Template = {
	extPoint: 'extensionPoint',
	extId: 'extensionId',
	ext: null,
	loaded: false, //Strangeness: when I called this installed: it couldn't be set from install()
	install: function(callWhenInstalled) {
		var self = this; //For use where this doesn't reference object
		//If this is called while appsuite is loading, we will get an error
		//To be safe, we add a short delay to allow appsuite to finish loading
		require(["io.ox/core/extensions"], function(ext){
			self.ext = ext;
			self.loaded = true;

			//Extension point code goes here

			//End Extension point code
			//Call success func if defined
			if (callWhenInstalled != null)
				callWhenInstalled();	
		});
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
OxEpNamespace.Template.enableExt();
