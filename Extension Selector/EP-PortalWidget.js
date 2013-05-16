//Start working on new portal widget example using doc as example
//See http://oxpedia.org/wiki/index.php?title=AppSuite:Writing_a_portal_plugin
//Not working, we need to explore defining a module via Chrome ext
//I think we need to use ext1 = require('io.ox/portal/widgets') and add the module?
OxEpNamespace.PortalWidget = {
	extPoint: 'extensionPoint',
	extId: 'extensionId',
	ext: null,
	loaded: false,
	chromeExtId: '', //Set in execution.js
	install: function(callWhenInstalled) {
		var self = this; //For use where this doesn't reference object
		window.setTimeout(function() {
			define("plugins/portal/myAd/register", ['io.ox/core/extensions'], function (ext) {

			    "use strict";

			    ext.point('io.ox/portal/widget/myAd').extend({
			        title: "My Advertisement",

			        load: function (baton) {
			        	console.log('In PortalWidget load');
			            var def = $.Deferred();
			            def.resolve("It's like solid happiness.").done(function (data) {
			                baton.data = {
			                    teaser: 'Buy stuff',
			                    fullText: 'Buy stuff. It is like solid happiness.'
			                };
			            });
			            return def;
			        },

			        preview: function (baton) {
			        	console.log('In PortalWidget preview');
			            var content = $('<div class="content pointer">')
			                .text(baton.data.teaser);
			            this.append(content);
			        },

			        draw: function (baton) {
			        	console.log('In PortalWidget draw');
			            var content = $('<div class="myAdd">')
			                .text(baton.data.fullText);
			            this.append(content);
			        }
			    });

			    ext.point('io.ox/portal/widget/myAd/settings').extend({
			        title: 'My advertisement',
			        type: 'myAd'
			    });
			});

		},1000); //end window.settimeout
	},
	enableExt: function() {
		if (!this.loaded)
			this.install(function(){
				ox.launch('plugins/portal/myAd/register');
				//this.ext.point(this.extPoint).enable(this.extId);
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
