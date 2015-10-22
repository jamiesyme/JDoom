
Camera = {};

// Store the camera settings.

Camera.posX = 0.0;
Camera.posY = 0.0;
Camera.rotRad = 0.0;
Camera.hFovRad = 0.0;
Camera.vFovRad = 0.0;

// Expose some camera settings through an API.

var degToRad = 3.141592654 / 180.0;

Camera.setFov = function(vFovDeg, aspect) {
	this.setVerticalFov(vFovDeg);
	this.setHorizontalFov(vFovDeg * aspect);
};

Camera.setVerticalFov = function(fovDeg) {
	this.vFovRad = fovDeg * degToRad;
};

Camera.setHorizontalFov = function(fovDeg) {
	this.hFovRad = fovDeg * degToRad;
};

Camera.getVerticalFov = function() {
	return this.vFovRad / degToRad;
};

Camera.getHorizontalFov = function() {
	return this.hFovRad / degToRad;
};

Camera.setPosition = function(x, y) {
	this.posX = x;
	this.posY = y;
};

Camera.setRotation = function(deg) {
	this.rotRad = deg * degToRad;
};

Camera.getRotation = function() {
	return this.rotRad / degToRad;
};

// Set the intial FOVs
Camera.setFov(60.0, 800.0 / 600.0);



// TEMP

Mouse.addMoveListener( (function(dx, dy) {

	this.rotRad += dx * degToRad;
	//this.posY   -= dy / 20.0;
	
}).bind(Camera) );

Ticker.add( function(dt) {
	
	if (Keyboard.isKeyDown('l')) {
		console.log('Camera pos: (', this.posX, ',', this.posY, ')');
	}
	
	var m = {x: 0.0, y: 0.0};
	if (Keyboard.isKeyDown('w')) m.y += 1.0;
	if (Keyboard.isKeyDown('s')) m.y -= 1.0;
	if (Keyboard.isKeyDown('d')) m.x += 1.0;
	if (Keyboard.isKeyDown('a')) m.x -= 1.0;
	
	var mag = m.x * m.x + m.y * m.y;
	if (mag === 0.0)
		return;
	m.x /= mag;
	m.y /= mag;
	
	m = {
		x: m.x * Math.cos(this.rotRad) + m.y * Math.sin(this.rotRad),
		y: m.y * Math.cos(this.rotRad) - m.x * Math.sin(this.rotRad)
		//x: ,// - m.y * Math.sin(this.rotRad),
		//y: //m.x * Math.sin(this.rotRad) + m.y * Math.cos(this.rotRad)
	};
	
	//console.log('Movement before: ', {x: this.posX, y: this.posY});
	
	this.posX += m.x * 5.0 * dt;
	this.posY += m.y * 5.0 * dt;
	
	//console.log('Movement after: ', {x: this.posX, y: this.posY});
	
}, Camera );

