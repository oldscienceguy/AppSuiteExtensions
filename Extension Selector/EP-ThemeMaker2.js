//Derived from Matthias Biggeleben theme-maker

ThemeMaker2 = {
	extPoint: 'extensionPoint',
	extId: 'extensionId',
	ext: null,
	loaded: false, //Strangeness: when I called this installed: it couldn't be set from install()
	chromeExtId: '', //Set in execution.js
	install: function(callWhenInstalled) {
		var self = this; //For use where this doesn't reference object

		var colorPicker = function () {
			console.log('colorPicker');
			return;

		    var colors = [
		        // grey
		        '#FFFFFF', '#EEEEEE', '#DDDDDD', '#CCCCCC', '#BBBBBB', '#AAAAAA', '#888888', '#555555', '#333333', '#000000',
		        // blue
		        '#0B3861', '#084B8A', '#045FB4', '#0174DF', '#2E9AFE', '#81BEF7', '#A9D0F5', '#CEE3F6', '#E0ECF8', '#EFF5FB',
		        // green
		        '#38610B', '#4B8A08', '#5FB404', '#74DF00', '#80FF00', '#9AFE2E', '#ACFA58', '#BEF781', '#D0F5A9', '#E3F6CE',
		        // yellow
		        '#AEB404', '#D7DF01', '#FFFF00', '#F7FE2E', '#F4FA58', '#F3F781', '#F2F5A9', '#F5F6CE', '#F5F6CE', '#F7F8E0',
		        // red
		        '#3B0B0B', '#610B0B', '#8A0808', '#B40404', '#DF0101', '#FF0000', '#FE2E2E', '#FA5858', '#F78181', '#F5A9A9',
		        // pink
		        '#610B21', '#8A0829', '#B40431', '#DF013A', '#FF0040', '#FE2E64', '#FA5882', '#F7819F', '#F5A9BC', '#F6CED8',
		        // viollet
		        '#610B5E', '#8A0886', '#B404AE', '#DF01D7', '#FF00FF', '#FE2EF7', '#F781F3', '#F5A9F2', '#F6CEF5', '#F6CEF5'
		    ];

	    //$.fn.simpleColorPicker = function () {

	        var node, self, preview;

	        function set(e) {
	            var color = e.data.color + '';
	            e.preventDefault();
	            preview.css('backgroundColor', color).insertAfter(self);
	            self.val(color).trigger('change');
	        }

	        function focus(e) {
	            var node = e.data.node;
	            node.empty();
	            _.each(colors, function (color, index) {
	                node.append(
	                    $('<div>').css({
	                        display: 'inline-block',
	                        width: '16px',
	                        height: '16px',
	                        margin: '0 1px 1px 0',
	                        backgroundColor: color
	                    })
	                    .on('mousedown', { color: color }, set)
	                );
	                if (index % 10 === 9) {
	                    node.append('<br>');
	                }
	            });
	            node.insertAfter(this);
	        }

	        function blur(e) {
	            var val = $.trim($(this).val());
	            e.data.node.detach();
	            if (/^#([0-9A-F]{3}|[0-9A-F]{6})$/.test(val)) {
	                preview.css('backgroundColor', val).insertAfter(self);
	            }
	        }

	        if (this.get(0).tagName === 'INPUT') {

	            self = this.attr({ maxLength: 7 }).addClass('nice-input');

	            node = $('<div>').css({
	                lineHeight: '8px',
	                margin: '0.5em 0 1em 0'
	            });

	            preview = $('<div>').css({
	                    width: '16px',
	                    height: '16px',
	                    margin: '3px 0 3px 8px',
	                    backgroundColor: 'transparent',
	                    display: 'inline-block',
	                    verticalAlign: 'top'
	                });

	            this.on('focus', { node: node }, focus);
	            this.on('blur', { node: node }, blur);
	        }

	        return this;
	    };

		//If this is called while appsuite is loading, we will get an error
		//To be safe, we add a short delay to allow appsuite to finish loading
		window.setTimeout(function() {
		    //Todo: When is an app 'loaded'?
			self.loaded = true;

			define("io.ox/dev/themeMaker2/main", ["themes", "io.ox/core/tk/simple-colorpicker"], function (themes, pick) {

		    'use strict';

		    // application object
		    var app = ox.ui.createApp({
		            name: 'io.ox/dev/themeMaker2',
		            title: 'Theme maker 2'
		        }),
		        // app window
		        win,
		        // nodes
		        left,
		        right,
		        out;

		    function update(e) {
		        var obj = {};
		        obj[e.data.id + ''] = $(this).val();
		        //Need to do a direct update, not use themes which are broken
		        //themes.alter(obj);
		        //!!Throwing exception currentTheme not defined
		        //out.val(themes.getDefinitions());
		    }

		    function createSection(title) {
		        return $('<div>').css({
		            fontSize: '14px',
		            padding: '4px 10px 4px 10px',
		            color: '#000'
		        }).text(title + '');
		    }

		    //Creates the common UI to change color of each element
		    function createPicker(title, id) {
		    	preview = $('<div>').css({
                    width: '16px',
                    height: '16px',
                    margin: '3px 0 3px 8px',
                    backgroundColor: 'transparent',
                    display: 'inline-block',
                    verticalAlign: 'top'
                });

		        return $('<div>').css({
		                padding: '2px',
		                height: '22px',
		                borderRadius: '5px',
		                margin: '3px 3px 6px 3px',
		                backgroundColor: 'rgba(255, 255, 255, 0.90)'
		            })
		            .append(
		                $('<label>').css({
		                	marginLeft: '4px',
		                	fontSize: '12px',
		                    //lineHeight: '1.5em',
		                    fontWeight: 'bold',
		                    color: 'black',
		                    width: '150px',
		                    display: 'Inline'
		                }).text(title + '')
		            )
		            .append($('<span>').css({
		            	padding: '1px',
		            	float: 'right'
		            	})
			            .append(
			                $('<input>', { type: 'text' })
				                .css({
				                	//Theres a global style for <input> somewhere that we have to overide
				                	padding: '0px',
				                    fontFamily: 'monospace',
				                    fontSize: '12px',
				                    width: '7em',
				                    height: '12px',
				                    //float: 'right'
				                    marginLeft: 'auto',
				                    marginRight: '0px'
				                })
			                .val('')
			                //.colorPicker()
			                //Handle user type directly
			                .on('change', { id: id }, update)
			            )
			            //Bring up color picker if needed
			            .append(preview)
			            //    .on('click', {}, colorPicker)

			            ); //end append span
		    }
		    // launcher
		    app.setLauncher(function () {

		        // get window
		        win = ox.ui.createWindow({
		            name: 'io.ox/dev/themeMaker2',
		            title: "Theme maker 2",
		            toolbar: true
		        });

		        app.setWindow(win);

		        // left panel
		        left = $("<div>")
		            .addClass("leftside")
		            .css({
		                backgroundColor: 'transparent'
		            })
		            .appendTo(win.nodes.main);

		        // right panel
		        right = $("<div>")
		            .addClass("rightside")
		            .css({
		                backgroundColor: 'transparent'
		            })
		            .append(
		                out = $('<textarea>').css({
		                    fontFamily: 'monospace',
		                    fontSize: '14px',
		                    border: '0px none',
		                    width: '50%',
		                    height: '50%',
		                    padding: '13px',
		                    margin: '1em',
		                    'float': 'right',
		                    resize: 'none'
		                })
		            )
		            .appendTo(win.nodes.main);

		        win.nodes.main.css({
		            backgroundColor: 'transparent'
		        });

		        left.css({
		                overflow: 'auto'
		            })

		            .append(createSection('Topbar...'))
		            .append(createPicker('...background', 'topbar-background'))
		            .append(createPicker('...app background active', 'topbar-launcher-background-active'))
		            .append(createPicker('...app background hover', 'topbar-launcher-background-hover'))
		            .append(createPicker('...app color', 'topbar-launcher-color'))
		            .append(createPicker('...app color active', 'topbar-launcher-color-active'))
		            .append(createPicker('...app color hover', 'topbar-launcher-color-hover'))

		            .append(createSection('Wallpaper...'))
		            .append(createPicker('...color #1', 'wallpaper-color1'))
		            .append(createPicker('...color #2', 'wallpaper-color2'))
		            .append(createPicker('...color #3', 'wallpaper-color3'))

		            .append(createSection('Window...'))
		            .append(createPicker('...title color', 'window-title-color'))
		            .append(createPicker('...link color', 'toolbar-link-color'))

		            .append(createSection('General'))
		            .append(createPicker('Link color', 'link-color'))
		            .append(createPicker('Inline link color', 'inline-link-color'))
		            .append(createPicker('Person link color', 'person-link-color'))
		            .append(createPicker('Selection background', 'selected-background'));

		        //win.show(function () {
		        	//!! Throwing exceptions
		            //out.val(themes.getDefinitions());
		        //});
		    });

		    return {
		        getApp: app.getInstance
		    };
		});
			//Call success func if defined
			if (callWhenInstalled != null)
				callWhenInstalled();	
		},1000); //end window.settimeout
	},
	enableExt: function() {
		if (!this.loaded)
			this.install(function(){
				ox.launch('io.ox/dev/themeMaker2/main');
				//this.ext.point(this.extPoint).enable(this.extId);
			});
		else
			ox.launch('io.ox/dev/themeMaker2/main');
			//this.ext.point(this.extPoint).enable(this.extId);			
	},
	disableExt: function() {
		if (this.loaded)
			ox.launch('io.ox/mail/main');
		return;
			//this.ext.point(this.extPoint).disable(this.extId);
	},	
	removeExt: function () {

	}
		
}