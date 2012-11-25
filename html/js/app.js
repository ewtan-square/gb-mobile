var include = function(path){ document.write('<script type="text/javascript" src="'+path+'"></script>'); };

/* Libraries */
include(USE_LOCAL_LIBS ? "js/lib/jquery.min.js" : "http://ajax.googleapis.com/ajax/libs/jquery/1.8.2/jquery.min.js");
include("js/lib/inheritance.js");

/* Configuration */
include("js/config.js");

/* Classes */
include("js/pawn.js");

/* Singletons */
include("js/game.js");
include("js/map.js");

var ctx;

// Colors
var CORNFLOWER_BLUE = "#6495ED";

// Prints a debug message if the debug flag is set
var debug = function(s) {
	if (DEBUG) {
		console.log(s);
	}
}

// Spins for n milliseconds, used to view canvas animation (or w.e) frame-by-frame for debugging
// @todo: anything that isnt spinning
var debugWait = function(milliseconds) {
	var date = new Date();
	var curDate = null;
	do { curDate = new Date(); }
	while(curDate-date < milliseconds);
}

// Setup the HTML of the viewport for use
// Does not perform any canvas interaction
var setup = function() {
	var vp = document.getElementById("viewport");
	debug("Setup viewport(" + VIEWPORT_WIDTH + " x " + VIEWPORT_HEIGHT + ")");

	vp.width = VIEWPORT_WIDTH;
	vp.height = VIEWPORT_HEIGHT;
};


// Initialize
var init = function() {
	// Canvas functions for the viewport
	debug("Initializing the canvas");
	var vp = document.getElementById("viewport");
	ctx = vp.getContext("2d");
	
	// Game modules 
	Game.init();
	Map.init();
	// Sprite.init();    something for characters
	// Projectile.init    something for bullets. Physics.init? or build this into Projectile?
};


// Blank the entire canvas to a given color
var blank = function(color) {
	ctx.fillStyle = color;
	ctx.fillRect(0, 0, VIEWPORT_WIDTH, VIEWPORT_HEIGHT);
}

// Call setup and init when content is loaded
var addListener = function(obj, eventName, listener) {
	if(obj.addEventListener) {
		obj.addEventListener(eventName, listener, false);
	} else {
		obj.attachEvent("on" + eventName, listener);
	}
}

if(!window.addEventListener) {
	document.getElementById('DCL').innerHTML = "(not supported)";
}

// addListener(window, "load", function() { // might want to use this if we're waiting for images to load
addListener(document, "DOMContentLoaded", function() {
	setup();
	init();
});


    