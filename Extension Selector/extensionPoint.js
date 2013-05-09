//Updated ExtensionPoint examples from  Matthias Biggeleben, wrapped in Chrome Extension by Rich Landsman

//WARNING:  Function name gets replaced with namespace specific function during injection
//	DO NOT USE Function Name anywhere other than definition or it will be replaced

console.log("extensionPoint.js loading");

//Disable extensions
function DisableExtension(extPoint,id) { 
	require(["io.ox/core/extensions"], function(ext) {
		//ext.point("io.ox/calendar/detail").disable("participants");
		ext.point(extPoint).disable(id);
	});
}

//Enable extensions
function EnableExtension(extPoint,id) { 
	require(["io.ox/core/extensions"], function (ext){
		//ext.point("io.ox/calendar/detail").enable("participants");
		ext.point(extPoint).enable(id);
	});
}



//Add your own extension
function AddYourOwnExtension() { 
	// calendar detail view
	require(["io.ox/core/extensions"], function(ext){
		ext.point("io.ox/calendar/detail").extend({
		  index: 10,
		  id: "strange",
		  draw: function (appointment) {
		    var strangeTitle = appointment.title.replace(/[aeiou]/g, "o"),
		        $titleNode = $("<h2>").text(strangeTitle);
		    return this.append($titleNode);
		  }
		});
	});
}


//Customize existing extension
function CustomizeExistingExtension() { 
	ext.point("io.ox/calendar/detail/date").extend({
	  id: "highlight",
	  index: 'last',
	  draw: function () {
	    this.css({
	      backgroundColor: "yellow",
	      padding: "3px",
	      border: "1px solid #fc0"
	    });
	  }
	});
}

//Replace existing extension
function ReplaceExistingExtension () { 
	require(["io.ox/core/extensions"], function(ext){
		ext.point("io.ox/calendar/detail").replace({
		  id: "title",
		  draw: function (data) {
		    this.append(
		      $('<div class="title">').css('color', '#a00').text("Hello World! " + data.title)
		    );
		  }
		});
	});
}

//Change order of existing extensions
function ChangeExtensionOrder () { 
// Shuffle extension order
	require(["io.ox/core/extensions"], function(ext){
		ext.point("io.ox/calendar/detail").each(function (e) {
		  e.index = Math.random() * 1000 >> 0;
		}).sort();
	});
}

/* 
From Raf
Todo: 1. Skinning
Switch to a different looking skin, with Ad-Support, to show simlpe skinning / CSS capabilities
2. Upsell Layer
"Downgrade" system to mail & contacts only. Clicking on the other modules or on one of the functions inside mail 
that connects to those other modules brings up simple upsell dialog with a Buy button. 
If clicked, the system reloads with all features enabled
3. Extension Points
*/


