

var Map = new function(){
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
		
		/*
				Idea for collision: if moving right, for example, scan the
				rightmost column of the pixels of the movers "collisioncapsule"
				image. if the pixel is black, check the pixel to its right. if
				that pixel is also black, then we have a collision, and the move
				should be interrupted.
		*/
		
		// Load the example map (hardcoded for now)
		var img = new Image();
		img.onload = function(){
			var loadContext = canvas ? canvas.getContext('2d') : false;
			if (loadContext)
			{
				loadContext.drawImage(img,0,0);
				Map.collisionMap.imageData = loadContext.getImageData(0, 0, canvas.width, canvas.height);
				Map.collisionMap.blackAtXY = function(x,y) {
					// #rob i'd rather find somewhere better/elsewhere to define this, but w.e. refactor later
					// Check R
					if ( Map.collisionMap.imageData.data[((y*(imageData.width*4)) + (x*4)) + 0] > 0.0)
						return false;
					
					// Check G
					if ( Map.collisionMap.imageData.data[((y*(imageData.width*4)) + (x*4)) + 1] > 0.0)
						return false;
					
					// Check B
					if ( Map.collisionMap.imageData.data[((y*(imageData.width*4)) + (x*4)) + 2] > 0.0)
						return false;
					
					// Check A
					if ( Map.collisionMap.imageData.data[((y*(imageData.width*4)) + (x*4)) + 3] < 1.0)
						return false;
					
					return true;
				};
				Map.collisionMap.loaded = true;
			}
		};
		img.src = 'assets/maptest.png'; // Note this will throw a CORS error without a server
	};
	
	this.buffer = function(bufferContext){
		// For now, just print the collision map. this will be a useful debugging tool later too
		if (Map.collisionMap.loaded)
			bufferContext.putImageData( Map.collisionMap.imageData, 0, 0);
	}
}