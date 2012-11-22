// class Map
var Map = new function(){
	var self = this;
	this.collisionMap = { loaded: false, blackAtXY: function(x,y) {} };
	
	this.init = function(){
		debug("Initializing Map");
		
		// Initialize game properties
		this.loadCollisionMap();
	};
	
	this.loadCollisionMap = function(){
		// Create an invisible canvas to hold our collision map
		var canvas = document.createElement("canvas");
		canvas.width = VIEWPORT_WIDTH;
		canvas.height = VIEWPORT_HEIGHT;
		
		// Load the example map (hardcoded for now)
		var img = new Image();
		img.onload = function(){
			var loadContext = canvas ? canvas.getContext('2d') : false;
			if (loadContext)
			{
				loadContext.drawImage(img,0,0);
				self.collisionMap.imageData = loadContext.getImageData(0, 0, canvas.width, canvas.height);
				self.collisionMap.blackAtXY = function(x,y) {
					// #rob i'd rather find somewhere better/elsewhere to define this, but w.e. refactor later
					// Check R
					if ( self.collisionMap.imageData.data[((y*(imageData.width*4)) + (x*4)) + 0] > 0)
						return false;
					
					// Check G
					if ( self.collisionMap.imageData.data[((y*(imageData.width*4)) + (x*4)) + 1] > 0)
						return false;
					
					// Check B
					if ( self.collisionMap.imageData.data[((y*(imageData.width*4)) + (x*4)) + 2] > 0)
						return false;
					
					// Check A
					//if ( self.collisionMap.imageData.data[((y*(imageData.width*4)) + (x*4)) + 3] > 0)
					//	return whatever;
					
					return true;
				};
				self.collisionMap.loaded = true;
			}
		};
		img.src = 'assets/maptest.png';
		// Note for the above line to succeed, you must be running a local server
	};
	
	this.buffer = function(canvasBufferContext){
		// For now, just print the collision map. this will be a useful debugging tool later too
		if (this.collisionMap.loaded)
			canvasBufferContext.putImageData( self.collisionMap.imageData, 0, 0);
	}
}