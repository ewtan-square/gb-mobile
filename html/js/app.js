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


// Initialize canvas functions for the viewport
var init = function() {
	debug("Initializing the canvas");
	var vp = document.getElementById("viewport");
	ctx = vp.getContext("2d");
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