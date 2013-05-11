//From documentation, reverses contact
OxEpNamespace.InvertContactOrder = {
	extPoint: 'io.ox/contacts/detail',
	extId: 'com-example-contact-reversename',
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
