

function Pawn(name) {
	debug("Initializing Pawn " + name);
	
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
	
	this.oVelocity = { fX: 0.0, fY: -370.0 /*some high number to test phys a bit*/ };
	
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
    if(Map.canMove(this.oCollisionImage, this.fX, this.fY, deltaX, deltaY) ) {
        this.fX += deltaX;
        this.fY += deltaY;
        return true
    } else {
        console.log("Collision!");
        return false;
    }
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
		
		this.oVelocity.fY += Config.gravity * seconds;
		
		var deltaX = this.oVelocity.fX * seconds;
		var deltaY = this.oVelocity.fY * seconds;
		
		if ( !this.move(deltaX, 0.0) )
			this.oVelocity.fX = 0.0;
		
		if ( !this.move(0.0, deltaY) )
			this.oVelocity.fY = 0.0;
	}
});
