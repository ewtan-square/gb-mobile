// WormBound
//
/*

	This first prototype of our worms clone is hotseat multiplayer (in one browser).
	Each player, in turn, goes through their squad of pawns, issuing moves and firing.
	
	Game.tick is the main game loop. This checks input, updates actors, and renders
	depending on which phase we're in (should totally have a matinee roll in announcing that)

	Notes
	- Global constants (and game tuning values eventually) are in index.html
	
	- Class conventions:
	  - var Classname   at the top of a file indicates a singleton class, a manager (Game, Map..)
	  - function Classname(param1[, param2]*)   at the top of a file indicates a class (see
	  http://www.crockford.com/javascript/inheritance.html for the design pattern )
	  
	- Movement:
	  Everything is done with respect to the top-left origin, and positive y (movement, velocity,
	  acceleration...) means DOWNWARD movement.
	  
	- Variable prefixes:
		b = boolean
		i = integer
		f = float
		at = array of type t, t is another prefix
		o = object (if no more specific identifier exists)
		cvs = canvas
		ctx = (canvas) context
	- Try to use full words in variable names for clarity!
*/


var Game = new function(){
	this.bSimulatingPhysics = false; // leave this off till phys fixed, for the love of god
	this.iCurrentPlayer = 0;
	this.fLastTickTime = 0; // milliseconds
	this.aoPlayers = [];
	this.aoProjectiles = [];
	this.cvsBuffer = {};
	this.ctxBuffer = {};
	this.oInput = {};
	
	this.init = function(){
		debug("Initializing Game");
		
		// Create buffer (reduce flickering)
		this.loadbuffer();
		if (!this.ctxBuffer)
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
		Game.oInput = {
			// these correspond to triangular quarters of the screen (on mobile)
			// (on pc, WASD and arrow keys map to the tri they point to)
			left : false,
			right : false,
			top : false,
			bottom : false
		};
		for (var i = 0; i < 1; ++i){
			Game.aoPlayers.push( new Pawn( "player_"+i ) );
		}
		
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
		
		// @TODO: only start game and rendering loop when all resources loaded
		// Start the game loop
		onEachFrame(Game.tick);
	};
	
	this.loadbuffer = function(){
		if (ctx) {
			Game.cvsBuffer = document.createElement('canvas');
			Game.cvsBuffer.width = VIEWPORT_WIDTH;
			Game.cvsBuffer.height = VIEWPORT_HEIGHT;
			Game.ctxBuffer = Game.cvsBuffer.getContext('2d');
		}
		else {
			console.log("ERROR: failed to load game buffer!");
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
				Game.oInput.up = true;
				break;

			case 65: // A
			case 37: // Left
				Game.oInput.left = true;
				break;

			case 68: // D
			case 39: // Right
				Game.oInput.right = true;
				break;

			case 83: // S
			case 40: // Down
				Game.oInput.down = true;
				break;
		}
	};
	
	this.onKeyUp = function(key){
		switch (event.keyCode) {
			case 87: // W
			case 38: // Up
				Game.oInput.up = false;
				break;

			case 65: // A
			case 37: // Left
				Game.oInput.left = false;
				break;

			case 68: // D
			case 39: // Right
				Game.oInput.right = false;
				break;

			case 83: // S
			case 40: // Down
				Game.oInput.down = false;
				break;
				
			case 80: // P
				this.bSimulatingPhysics = !this.bSimulatingPhysics;
				break;
				
			case 70: // F
				Game.aoProjectiles.push( new Projectile( "testProjectile", -300.0, -200.0 ) );
				
				break;
				
			//default:
			//	alert(event.keyCode);
		}
	};

	this.draw = function(){
		Map.buffer(Game.ctxBuffer);
		
		ctx.drawImage(Game.cvsBuffer, 0, 0); // #rob is this what fixed transparency..?
		
		for (var i = 0; i < Game.aoPlayers.length; ++i){
			Game.aoPlayers[i].buffer(Game.ctxBuffer);
		}
		
		for (var i = 0; i < Game.aoProjectiles.length; ++i) {
			Game.aoProjectiles[i].buffer(Game.ctxBuffer);
		}
		
		ctx.drawImage(Game.cvsBuffer, 0, 0);
	};
	
	this.tick = function(){
		if (this.fLastTickTime == 0){
			// First tick
			this.fLastTickTime = new Date().getTime();
			return;
		}
		
		var newTickTime= new Date().getTime();
		var deltaMilliseconds = newTickTime - this.fLastTickTime;
		this.fLastTickTime = newTickTime;
		
		// @todo: put movement only in a "move phase" or w/e once we have an actual engine going
		var deltaX = 0.0, deltaY = 0.0;
		if (Game.oInput.left)
			deltaX -= Config.movePixelsPerTick;
		if (Game.oInput.right)
			deltaX += Config.movePixelsPerTick;
		if (Game.oInput.up)
			deltaY -= Config.movePixelsPerTick;
		if (Game.oInput.down)
			deltaY += Config.movePixelsPerTick;
			
		var bMoved = Game.aoPlayers[Game.iCurrentPlayer].move(deltaX, deltaY);
		
		for (var i = 0; i < Game.aoPlayers.length; ++i) {
			Game.aoPlayers[i].tick(deltaMilliseconds);
		}
		
		for (var i = 0; i < Game.aoProjectiles.length; ++i) {
			Game.aoProjectiles[i].tick(deltaMilliseconds);
		}

		// Render
		Game.draw();
	}
};