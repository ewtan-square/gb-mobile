

function Pawn(name) {
	debug("Initializing " + name);
	
	// Properties
	this.bLoaded;
	this.fX;
	this.fY;
	this.oVelocity;
	this.oCollisionImage;
	
	// Initialization
	this.setName(name);
	
	this.bLoaded = false;
	this.fX = VIEWPORT_WIDTH / 2.0;
	this.fY = VIEWPORT_HEIGHT / 2.0;
	
	// NOTE: velocity, acceleration are still with respect to top-left origin
	// (i.e. positive y velocity will move the actor "downwards" on-screen)
	this.oVelocity = { fX: 0.0, fY: -370.0 };
	
	this.oCollisionImage = new Image();
	
	// load collision bounds image
	var self = this;
	this.oCollisionImage.onload = function(){
		self.bLoaded = true;
	};
	this.oCollisionImage.src = 'assets/pawncollision.png';
}

Pawn.method('setName', function(name){
    this.name = name;
    return this;
});

Pawn.method('getName', function(){
    return this.name;
});

// Returns true if the move succeeded, else false
Pawn.method('move', function(deltaX, deltaY){
    // @todo: check for collision with the map
	this.fX += deltaX;
	this.fY += deltaY;
	
	return true; // @todo: return collision success
});

Pawn.method('buffer', function(bufferContext){
	if (!this.bLoaded)
		return;
		
	bufferContext.drawImage( this.oCollisionImage, this.fX, this.fY);
});

Pawn.method('tick', function(deltaMilliseconds){
	if (!this.bLoaded)
		return;
		
	// @todo: use RK4 or something for better physics
	if (Game.bSimulatingPhysics){
		var seconds = deltaMilliseconds / 1000;
		
		// ignore x for now
		this.oVelocity.fY += Config.gravity * seconds;
		var deltaY = this.oVelocity.fY * seconds;
		
		if ( !this.move( 0, deltaY) )
			this.oVelocity.fY = 0; // collided, so zero out velocity
	}
});