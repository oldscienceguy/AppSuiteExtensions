//Derived from Matthias Biggeleben theme-maker

ThemeMaker2 = {
	extPoint: 'extensionPoint',
	extId: 'extensionId',
	ext: null,
	loaded: false, //Strangeness: when I called this installed: it couldn't be set from install()
	chromeExtId: '', //Set in execution.js
	install: function(callWhenInstalled) {
		var self = this; //For use where this doesn't reference object
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
		        themes.alter(obj);
		        //Throwing exception currentTheme not defined
		        out.val(themes.getDefinitions());
		    }

		    function createSection(title) {
		        return $('<div>').css({
		            fontSize: '16px',
		            padding: '4px 13px 4px 13px',
		            color: '#000'
		        }).text(title + '');
		    }

		    function createPicker(title, id) {
		        return $('<div>').css({
		                padding: '10px',
		                borderRadius: '5px',
		                margin: '3px 3px 6px 3px',
		                backgroundColor: 'rgba(255, 255, 255, 0.90)'
		            })
		            .append(
		                $('<label>').css({
		                    lineHeight: '1.5em',
		                    fontWeight: 'bold',
		                    color: 'black'
		                }).text(title + '')
		            )
		            .append($('<br>'))
		            .append(
		                $('<input>', { type: 'text' })
		                .css({
		                    fontFamily: 'monospace',
		                    fontSize: '14px',
		                    width: '7em'
		                })
		                .val('')
		                .simpleColorPicker()
		                .on('change', { id: id }, update)
		            );
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

		            .append(createSection('Topbar'))
		            .append(createPicker('Topbar background', 'topbar-background'))
		            .append(createPicker('Topbar app background active', 'topbar-launcher-background-active'))
		            .append(createPicker('Topbar app background hover', 'topbar-launcher-background-hover'))
		            .append(createPicker('Topbar app color', 'topbar-launcher-color'))
		            .append(createPicker('Topbar app color active', 'topbar-launcher-color-active'))
		            .append(createPicker('Topbar app color hover', 'topbar-launcher-color-hover'))

		            .append(createSection('Wallpaper'))
		            .append(createPicker('Wallpaper color #1', 'wallpaper-color1'))
		            .append(createPicker('Wallpaper color #2', 'wallpaper-color2'))
		            .append(createPicker('Wallpaper color #3', 'wallpaper-color3'))

		            .append(createSection('Window'))
		            .append(createPicker('Window title color', 'window-title-color'))
		            .append(createPicker('Toolbar link color', 'toolbar-link-color'))

		            .append(createSection('General'))
		            .append(createPicker('Link color', 'link-color'))
		            .append(createPicker('Inline link color', 'inline-link-color'))
		            .append(createPicker('Person link color', 'person-link-color'))
		            .append(createPicker('Selection background', 'selected-background'));

		        win.show(function () {
		            out.val(themes.getDefinitions());
		        });
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
	},	removeExt: function () {

	}
		
}