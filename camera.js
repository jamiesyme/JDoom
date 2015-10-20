
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

Camera.onMouseMove = function(dx, dy) {
	Camera.rotRad += dx * degToRad;
	Camera.posY -= dy / 50.0
};
Mouse.addMoveListener( Camera.onMouseMove );

