// namespace Game
var Game = new function(){
	this.canvasBuffer;
	this.canvasBufferContext;
	
	this.init = function(){
		debug("Initializing Game");
		
		// Create buffer (reduce flickering)
		this.loadCanvasBuffer();
		if (!this.canvasBufferContext)
			return;

		// Bind the keyup handler
		var self = this;
		var keyupHandler = function (key) {
			self.onKeyUp(key);
			self.draw();
		};
		$(document).bind('keyup', keyupHandler);
		
		// Initialize game properties
		var players = [];
		var currentPlayerIndex = 0; // whose turn is it?
		
		var projectiles = [];
		
		// The "game loop" will probably only be executed once a players turn ends.
		// this will simulate and render projectiles and such
		
		// Render
		this.draw();
	};
	
	this.loadCanvasBuffer = function(){
		if (ctx) {
			this.canvasBuffer = document.createElement('canvas');
			this.canvasBuffer.width = VIEWPORT_WIDTH;
			this.canvasBuffer.height = VIEWPORT_HEIGHT;
			this.canvasBufferContext = this.canvasBuffer.getContext('2d');
		}
	};
	
	this.onKeyUp = function(key){
		var KeyID = event.keyCode;
		
		// key presses proly not so relevant on mobile, but could be useful for development.
		// Later someone can be assigned the "input" module (implement mouse controls: tapping
		// to move, sliding to adjust firing arc etc)
		
		switch (KeyID) {
			case 87: // W
			case 38: // Up
				break;

			case 65: // A
			case 37: // Left
				break;

			case 68: // D
			case 39: // Down
				break;

			case 83: // S
			case 40: // Right
				break;
		}
	
		// Do stuff
	};

	this.draw = function(){
		// background.buffer(this.canvasBufferContext);
		
		for (var i = 0; i < this.players; ++i) {
			// players[i].sprite.buffer(this.canvasBufferContext);
		}
		
		for (var i = 0; i < this.projectiles; ++i) {
			// projectiles[i].buffer(this.canvasBufferContext);
		}
		
		ctx.drawImage(this.canvasBuffer, 0, 0);
	};
};