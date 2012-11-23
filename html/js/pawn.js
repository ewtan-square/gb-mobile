

function Pawn(name) {
    this.setName(name);
	this.x = VIEWPORT_WIDTH / 2.0;
	this.y = VIEWPORT_HEIGHT / 2.0;
	// this.collisionCapsuleImage; // this will have a black outline of
	// the colliding outline of the sprite, for collision checks with the
	// map
}

Pawn.method('setName', function(name){
    this.name = name;
    return this;
});

Pawn.method('getName', function(){
    return this.name;
});

Pawn.method('whatsMyName', function(){
    return 'Champion bad-ass, ' + this.getName();
});

Pawn.method('tryMove', function(deltaX, deltaY){
    // @todo: check for collision with the map
	this.x += deltaX;
	this.y += deltaY;
});

Pawn.method('buffer', function(bufferContext){
	bufferContext.beginPath();
	var x              = Game.testPlayer.x; //Math.floor();
	var y              = Game.testPlayer.y; //Math.floor();
	var radius         = 20;
	var startAngle     = 0;
	var endAngle       = 2*Math.PI;
	var anticlockwise  = false;
	
	bufferContext.arc(this.x,this.y,radius,startAngle,endAngle, anticlockwise);
	bufferContext.closePath();
	bufferContext.stroke();
});

function Config(shit) {
    this._movePixelsPerTick = 1.0;
}

Config.method('movePixelsPerTick', function () {
    return this._movePixelsPerTick;
});