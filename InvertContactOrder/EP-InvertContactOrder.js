
//OxEpNamespace is a var created by createNamespace()
//From documentation, reverses contact
OxEpNamespace.InvertContactOrder = {
	//We need extId and ext for enable/disable
	extId: 'com-example-contact-reversename',
	ext: null,
	loaded: false,
	install: function(callWhenInstalled) {
		var self = this; //For use where this doesn't reference object
		require(['io.ox/core/extensions'], function(ext){
			self.ext = ext;
			self.loaded = true;
			//Extension point code goes here
	        ext.point('io.ox/contacts/detail').extend({
	            id: self.extId,
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
	},
	enableExt: function() {
		if (!this.loaded)
			//Install, then call enable
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
OxEpNamespace.InvertContactOrder.install();

