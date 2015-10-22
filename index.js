
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

// Load images.
Images.load('leatherImg', 'leather');


// Configure the main loop.

var mainLoop = function() {

	// Update our objects
	Ticker.tick();
	
	// Render the frame
	Draw.render( Camera, Map );
	
	// Draw the image
	var leatherImg = Images.get('leather');
	var minW = Math.min(leatherImg.width, Pixels.width);
	var minH = Math.min(leatherImg.height, Pixels.height);
	for (var x = 0; x < minW; x++) {
		for (var y = 0; y < minH; y++) {
			Pixels.set(x, y, leatherImg.get(x, y));
		}
	}
	Pixels.draw();
	
	// Keep the loop going
	requestAnimFrame(mainLoop);
};


// Start the loop.
requestAnimFrame(mainLoop);

