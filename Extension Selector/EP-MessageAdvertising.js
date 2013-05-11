//Add advertisement banner to mail detail view
OxEpNamespace.MessageAdvertising = {
	extPoint: 'io.ox/mail/detail/header',
	extId: 'ad',
	ext: null,
	loaded: false,
	chromeExtId: '', //Set in execution.js
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
