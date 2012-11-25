

function Projectile(name, velocityX, velocityY) {
	debug("Initializing Projectile " + name);
	
	// Non-inherited properties
	
	// Initialization
	this.setName(name);
	this.bLoaded = false;
	
	this.fX = VIEWPORT_WIDTH / 2.0;
	this.fY = VIEWPORT_HEIGHT / 2.0;
	
	this.oVelocity = { fX: velocityX, fY: velocityY /*some high number to test phys a bit*/ };
	
	this.oCollisionImage = new Image();
	
	// load collision bounds image
	var self = this;
	this.oCollisionImage.onload = function(){
		self.bLoaded = true;
	};
	this.oCollisionImage.src = 'assets/projectilecollision.png';
}

Projectile.inherits(Pawn);