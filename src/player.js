
Player = {};

// Store the player settings

Player.x = 0.0;
Player.y = 0.0;
Player.radius = 0.4;
Player.height = 1.6;
Player.yOff = 2.0 - Player.height;
Player.rot = 0.0;



// Expose the Player settings through an API

Player.setPosition = function(x, y) {
	this.x = x;
	this.y = y;
};

Player.getPosition = function() {
	return {
		x: this.x,
		y: this.y
	};
};

Player.setRotation = function(deg) {
	this.rot = deg * 3.141592654 / 180.0;
};

Player.getRotation = function() {
	return this.rot * 180.0 / 3.141592654;
};



// Control the player

Ticker.add( function(dt) {

	if (Keyboard.isKeyDown('left'))
		this.rot -= 3.141592654 * dt;
	if (Keyboard.isKeyDown('right'))
		this.rot += 3.141592654 * dt;
	
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
		x: m.x * Math.cos(this.rot) + m.y * Math.sin(this.rot),
		y: m.y * Math.cos(this.rot) - m.x * Math.sin(this.rot)
	};
	
	this.x += m.x * 5.0 * dt;
	this.y += m.y * 5.0 * dt;
	
}, Player );

