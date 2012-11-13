var include = function(path){ document.write('<script type="text/javascript" src="'+path+'"></script>'); };
include("js/game.js");

var ctx;

// Colors
var CORNFLOWER_BLUE = "#6495ED";

// Prints a debug message if the debug flag is set
var debug = function(s) {
	if (DEBUG) {
		console.log(s);
	}
}

// Setup the HTML of the viewport for use
// Does not perform any canvas interaction
var setup = function() {
	var $vp = $("#viewport");
	debug("Setup viewport(" + VIEWPORT_WIDTH + " x " + VIEWPORT_HEIGHT + ")");

	$vp.width(VIEWPORT_WIDTH);
	$vp.height(VIEWPORT_HEIGHT);
};


// Initialize
var init = function() {
	// Canvas functions for the viewport
	debug("Initializing the canvas");
	var vp = document.getElementById("viewport");
	ctx = vp.getContext("2d");
	
	// Game modules 
	Game.init();
	// Sprite.init();    something for characters
	// Projectile.init    something for bullets. Physics.init? or build this into Projectile?
	
	blank(CORNFLOWER_BLUE);
};


// Blank the entire canvas to a given color
var blank = function(color) {
	ctx.fillStyle = color;
	ctx.fillRect(0, 0, VIEWPORT_WIDTH, VIEWPORT_HEIGHT);
}

$("document").ready(function() {
	
	setup();

	init();

});