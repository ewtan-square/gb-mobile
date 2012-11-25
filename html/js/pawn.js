

function Pawn(name) {
	debug("Initializing " + name);
	this.loaded = false;
	this.simulatingPhysics = false;
    this.setName(name);
	this.x = VIEWPORT_WIDTH / 2.0;
	this.y = VIEWPORT_HEIGHT / 2.0;
	
	// NOTE: velocity, acceleration are still with respect to top-left origin
	// (i.e. positive y velocity will move the actor "downwards" on-screen)
	this.velocity = { x: 0.0, y: -370.0 };
	
	this.collisionImage = new Image();
	
	// load collision bounds image
	var self = this;
	this.collisionImage.onload = function(){
		self.loaded = true;
	};
	this.collisionImage.src = 'assets/pawncollision.png';
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
	this.x += deltaX;
	this.y += deltaY;
	
	return true; // @todo: return collision success
});

Pawn.method('buffer', function(bufferContext){
	if (!this.loaded)
		return;
		
	bufferContext.drawImage( this.collisionImage, this.x, this.y);
});

Pawn.method('tick', function(deltaMilliseconds){
	if (!this.loaded)
		return;
		
	// @todo: use RK4 or something for better physics
	if (Game.bSimulatingPhysics){
		var seconds = deltaMilliseconds / 1000;
		
		// ignore x for now
		this.velocity.y += Config.gravity * seconds;
		var deltaY = this.velocity.y * seconds;
		
		if ( !this.move( 0, deltaY) )
			this.velocity.y = 0; // collided, so zero out velocity
	}
});