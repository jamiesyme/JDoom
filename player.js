
Player = {};

// Store the player settings

Player.posX = 0.0;
Player.posY = 0.0;
Player.rotRad = 0.0;



// Expose the Player settings through an API

Player.setPosition = function(x, y) {
	this.posX = x;
	this.posY = y;
};

Player.getPosition = function() {
	return {
		x: this.posX,
		y: this.posY
	};
};

Player.setRotation = function(deg) {
	this.rotRad = deg * 3.141592654 / 180.0;
};

Player.getRotation = function() {
	return this.rotRad * 180.0 / 3.141592654;
};



// Control the player

Ticker.add( function(dt) {

	if (Keyboard.isKeyDown('left'))
		this.rotRad -= 3.141592654 * dt;
	if (Keyboard.isKeyDown('right'))
		this.rotRad += 3.141592654 * dt;
	
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
	};
	
	this.posX += m.x * 5.0 * dt;
	this.posY += m.y * 5.0 * dt;
	
}, Player );

