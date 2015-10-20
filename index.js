
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
Pixels.setSize(300, 200);
Camera.setPosition(1.5, 1.5);
Camera.setRotation(-30.0);
Camera.setFov(60.0, Pixels.width / Pixels.height);


// Configure the main loop.

var mainLoop = function() {
	
	// Render the frame
	Draw.render( Camera );
	
	// Keep the loop going
	requestAnimFrame(mainLoop);
};


// Start the loop.

requestAnimFrame(mainLoop);