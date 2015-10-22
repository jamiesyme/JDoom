
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

Images.load('stone', 'stone.png');


// Load the intial map data

var initialMapData = [
'           ',
' ###   ### ',
'         # ',
' ###   # # ',
' #       # ',
'           ',
'           ',
'   #   #   ',
' ###   ### ',
' ###   ### ',
'           '];

Map.setSize(initialMapData[0].length + 2, initialMapData.length + 2);

for (var y = 0; y < Map.height; y++) {
	for (var x = 0; x < Map.width; x++) {
		if (x === 0 || x === Map.width - 1 ||
		    y === 0 || y === Map.height - 1 ||
		    initialMapData[y - 1][x - 1] === ' ')
		  Map.set(x, y, null);
		else
			Map.set(x, y, {
				texture: Images.get('stone')
			});
	}
}


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

