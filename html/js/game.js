// class Game

//
// Systems
/*
	@TODO document input, tick, rendering system

*/


var Game = new function(){
	this.canvasBuffer;
	this.canvasBufferContext;
	this.players;
	this.currentPlayerIndex; // whose turn is it?
	this.keyDown;
	this.testPlayer;
	this.consts_movePixelsPerTick;
	
	this.init = function(){
		debug("Initializing Game");
		
		// Create buffer (reduce flickering)
		this.loadCanvasBuffer();
		if (!this.canvasBufferContext)
			return;

		// Bind the input handlers
		var keyupHandler = function (key) {
			Game.onKeyUp(key);
		};
		var keydownHandler = function (key) {
			Game.onKeyDown(key);
		};
		$(document).bind('keyup', keyupHandler);
		$(document).bind('keydown', keydownHandler);
		
		// Initialize game properties
		Game.currentPlayerIndex = 0;
		Game.players = [];
		Game.projectiles = [];
		Game.input = {
			// these correspond to triangular quarters of the screen (on mobile)
			// (on pc, WASD and arrow keys map to the tri they point to)
			left : false,
			right : false,
			top : false,
			bottom : false
		};
		Game.testPlayer = {
			x: VIEWPORT_WIDTH / 2.0,
			y: VIEWPORT_HEIGHT / 2.0
		}
		Game.consts_movePixelsPerTick = (function(){ return 1.0; })();
		
		// CPU-efficient render loop http://nokarma.org/2011/02/02/javascript-game 
		// -development-the-game-loop/index.html (must.. wrap.. lines)
		var onEachFrame;
		if (window.webkitRequestAnimationFrame) {
			onEachFrame = function(cb) {
				var _cb = function() { cb(); webkitRequestAnimationFrame(_cb); }
				_cb();
			};
		} else if (window.mozRequestAnimationFrame) {
			onEachFrame = function(cb) {
				var _cb = function() { cb(); mozRequestAnimationFrame(_cb); }
				_cb();
			};
		} else {
			onEachFrame = function(cb) {
				setInterval(cb, 1000 / 60);
			}
		}
		
		// Start the game loop
		onEachFrame(Game.tick);
	};
	
	this.loadCanvasBuffer = function(){
		if (ctx) {
			Game.canvasBuffer = document.createElement('canvas');
			Game.canvasBuffer.width = VIEWPORT_WIDTH;
			Game.canvasBuffer.height = VIEWPORT_HEIGHT;
			Game.canvasBufferContext = Game.canvasBuffer.getContext('2d');
		}
	};
	
	this.onKeyDown = function(key){
		// key presses proly not so relevant on mobile, but could be useful for development.
		// Later someone can be assigned the "input" module (implement mouse controls: tapping
		// to move, sliding to adjust firing arc etc)
		
		switch (event.keyCode) {
			case 87: // W
			case 38: // Up
				// @TODO add another onPress handler for "clicks"
				Game.input.up = true;
				break;

			case 65: // A
			case 37: // Left
				Game.input.left = true;
				break;

			case 68: // D
			case 39: // Right
				Game.input.right = true;
				break;

			case 83: // S
			case 40: // Down
				Game.input.down = true;
				break;
		}
	};
	
	this.onKeyUp = function(key){
		switch (event.keyCode) {
			case 87: // W
			case 38: // Up
				Game.input.up = false;
				break;

			case 65: // A
			case 37: // Left
				Game.input.left = false;
				break;

			case 68: // D
			case 39: // Right
				Game.input.right = false;
				break;

			case 83: // S
			case 40: // Down
				Game.input.down = false;
				break;
		}
	};

	this.draw = function(){
		Map.buffer(Game.canvasBufferContext);
		
		for (var i = 0; i < Game.players; ++i) {
			// players[i].sprite.buffer(this.canvasBufferContext);
		}
		
		for (var i = 0; i < Game.projectiles; ++i) {
			// projectiles[i].buffer(this.canvasBufferContext);
		}
		
		// render stand-in player
		Game.canvasBufferContext.beginPath();
		var x              = Game.testPlayer.x; //Math.floor();
		var y              = Game.testPlayer.y; //Math.floor();
		var radius         = 20;
		var startAngle     = 0;
		var endAngle       = 2*Math.PI;
		var anticlockwise  = false;
		
		Game.canvasBufferContext.arc(x,y,radius,startAngle,endAngle, anticlockwise);
		Game.canvasBufferContext.closePath();
		Game.canvasBufferContext.stroke();
		
		ctx.drawImage(Game.canvasBuffer, 0, 0);
	};
	
	this.tick = function(){
		//@TODO: check with the Map to see if we can move there. maybe encapsulate that
		//       in a player class or something.
		if (Game.input.left)
			Game.testPlayer.x -= Game.consts_movePixelsPerTick;
		if (Game.input.right)
			Game.testPlayer.x += Game.consts_movePixelsPerTick;
		if (Game.input.up)
			Game.testPlayer.y -= Game.consts_movePixelsPerTick;
		if (Game.input.down)
			Game.testPlayer.y += Game.consts_movePixelsPerTick;

		// Map.tick; // @TODO: for gravity with collision checks
		
		
		// Render
		Game.draw();
	}
};