
// Use requestAnimationFrame() to power the main loop.

var requestAnimFrame = 
	window.requestAnimationFrame       || 
	window.webkitRequestAnimationFrame || 
	window.mozRequestAnimationFrame    || 
	window.oRequestAnimationFrame      || 
	window.msRequestAnimationFrame     || 
	function(cb) {
		window.setTimeout(cb, 1000 / 60);
	};


// Configure the settings.
Pixels.setSize(400, 300);
Camera.setPosition(1.5, 1.5);
Camera.setRotation(-30.0);
Camera.setFov(60.0, Pixels.width / Pixels.height);


// Configure the main loop.

var mainLoop = function() {

	// Update our objects
	Ticker.tick();
	
	// Render the frame
	Draw.render( Camera, Map );
	
	// Keep the loop going
	requestAnimFrame(mainLoop);
};


// Start the loop.
requestAnimFrame(mainLoop);
