

var Map = new function(){
	this.collisionMap = { loaded: false, blackAtXY: function(x,y) {} };

    this.canMove = function(pawnImageData, x, y, dx, dy) {
        //TODO: Remove this constraint
        if ( dx > 1 || dy > 1 ) {
            alert("Can only move pixel by pixel..for now.");
        }

        //Put the image on the canvas in the original position
        var canvas = document.createElement("canvas");
		canvas.width = VIEWPORT_WIDTH;
		canvas.height = VIEWPORT_HEIGHT;

		var loadContext = canvas ? canvas.getContext('2d') : false;
 
		if (Map.collisionMap.loaded) {
			//Load collision map onto the canvas context
            loadContext.putImageData(Map.collisionMap.imageData, 0, 0);

            //Load pawn onto the canvas context
            loadContext.putImageData(pawnImageData, x, y);

            //Count number of transparent pixels in the original position
            var currentPawnData = loadContext.getImageData(x, y, pawnImageData.width, pawnImageData.height);
            //TODO: Form an array of the boundary pixels rather than the entire image
            var currentPixelCount = this.countPixels(currentPawnData.data);

            loadContext.clearRect(0, 0, VIEWPORT_WIDTH, VIEWPORT_HEIGHT);
            var updatedPawnData = loadContext.getImageData(dx, dy, pawnImageData.width, pawnImageData.height);
            var updatedPixelCount = this.countPixels(updatedPawnData.data);

            if ( updatedPixelCount === currentPixelCount) {
                return true;
            } else {
                return false;
            }
        } else {
            return false;
        }
    }

    this.countPixels = function(imageData) {
        // Count the number of non-transparent pixels
        var count = 0;

        for(var i = 0; i < imageData.length; i+=4) {
            //Access A
            if(imageData[i+3] === 0) {
                count += 1;
            }
        }
    }

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
		if (!Map.collisionMap.loaded)
			return;
			
		// For now, just print the collision map. this will be a useful debugging tool later too
		bufferContext.putImageData( Map.collisionMap.imageData, 0, 0);
	}
}
