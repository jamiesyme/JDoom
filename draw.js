
var Draw = {};

// Clear the screen.

Draw.clear = function() {
	for (var y = Pixels.height / 2; y < Pixels.height; y++)
		for (var x = 0; x < Pixels.width; x++)
			Pixels.set(x, y, [0.9, 0.9, 0.9]);
};

// Render the world to the screen.

Draw.render = function() {
	
	// Clear the screen first
	Draw.clear();
	
	// Render the world
	// TODO
	
	// Update the pixels
	Pixels.draw();
};


// TEMP: Render the world once
Draw.render();

