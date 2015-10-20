
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

// Configure the main loop.

var mainLoop = function() {
	
	// Render the frame
	Draw.render( Camera );
	
	// Keep the loop going
	requestAnimFrame(mainLoop);
};

// Start the loop.

requestAnimFrame(mainLoop);
