// WormBound
//
/*

	This first prototype of our worms clone is hotseat multiplayer (in one browser).
	Each player, in turn, goes through their squad of pawns, issuing moves and firing.
	
	Game.tick is the main game loop. This checks input, updates actors, and renders
	depending on which phase we're in (should totally have a matinee roll in announcing that)

	Configuration and design notes
	- global constants (and game tuning values eventually) are in index.html
	
	- var Classname   at the top of a file indicates a singleton class, a manager (Game, Map..)
	- function Classname(param1[, param2]*)   at the top of a file indicates a class (see
	  http://www.crockford.com/javascript/inheritance.html for the design pattern )
	  
	- collision is documented in the map class
*/


var Game = new function(){
	this.currentPlayerIndex = 0;
	this.players = [];
	this.keyDown = [];
	this.buffer = {};
	this.bufferContext = {};
	
	this.init = function(){
		debug("Initializing Game");
		
		// Create buffer (reduce flickering)
		this.loadbuffer();
		if (!this.bufferContext)
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
		for (var i = 0; i < 1; ++i) {
			Game.players.push( new Pawn( "player_"+i ) );
			console.log(Game.players[i].getName() + " created");
;		}
		
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
	
	this.loadbuffer = function(){
		if (ctx) {
			Game.buffer = document.createElement('canvas');
			Game.buffer.width = VIEWPORT_WIDTH;
			Game.buffer.height = VIEWPORT_HEIGHT;
			Game.bufferContext = Game.buffer.getContext('2d');
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
		Map.buffer(Game.bufferContext);
		
		for (var i = 0; i < Game.players.length; ++i) {
			Game.players[i].buffer(Game.bufferContext);
;		}
		
		for (var i = 0; i < Game.projectiles; ++i) {
			// projectiles[i].buffer(this.bufferContext);
		}
		ctx.drawImage(Game.buffer, 0, 0);
	};
	
	this.tick = function(){
		var deltaX = 0.0, deltaY = 0.0;
		if (Game.input.left)
			deltaX -= 2; //Config.movePixelsPerTick();
		if (Game.input.right)
			deltaX += 2; //Config.movePixelsPerTick();
		if (Game.input.up)
			deltaY -= 2; //Config.movePixelsPerTick();
		if (Game.input.down)
			deltaY += 2; //Config.movePixelsPerTick();
			
		Game.players[Game.currentPlayerIndex].tryMove(deltaX, deltaY);
		

		// Map.tick; // @TODO: for gravity with collision checks
		
		
		// Render
		Game.draw();
	}
};