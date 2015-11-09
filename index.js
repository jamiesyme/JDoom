
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
Player.setPosition(1.5, 1.5);
Player.setRotation(15.0);
Camera.setFov(60.0, Pixels.width / Pixels.height);



// Load images.

Images.load('stone', 'stone.png');
Images.load('metal', 'metal.png');
Images.load('doomguy', 'doomguy.png');



// Create the tile info.

var stoneTile = {
	texture:      Images.get('stone'),
	reflection:   0.0,
	translucency: 0.0
};

var mirrorTile = {
	texture:      Images.get('metal'),
	reflection:   0.9,
	translucency: 0.0
};

var transTile = {
	texture:      Images.get('metal'),
	reflection:   0.0,
	translucency: 0.7
};



// Load the intial map data.

var initialMapData = [
'           ',
' ###   ### ',
'         # ',
' ###   ! ! ',
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
	
		var setTile = function(tile) {
			Map.set(x, y, tile);
		};
		
		// Surround the map with transparent tiles
		if (x === 0 || x === Map.width - 1 || 
		    y === 0 || y === Map.height - 1) {
		  setTile(stoneTile);
			continue;
		}
		
		// Set the tile based on the intial map data
		//   - Empty
		// # - Stone
		// ! - Metal
		// $ - Transparent
		var val = initialMapData[y - 1][x - 1];
	
		if (val === ' ')
		  setTile(null);
		  
		else if (val === '#')
			setTile(stoneTile);
			
		else if (val === '!')
			setTile(mirrorTile);
			
		else if (val === '$')
			setTile(transTile);
		
	}
}



// Add the player to the map as a sprite
Player.texture = Images.get('doomguy.png');
Map.addSprite( Player );



// Configure the main loop.

var mainLoop = function() {

	// Update our objects
	Ticker.tick();
	
	// Update the camera
	Camera.setPosition( Player.posX, Player.posY );
	Camera.setRotation( Player.getRotation() );
	
	// Render the frame
	Draw.render( Camera, Map );
	
	// Keep the loop going
	requestAnimFrame(mainLoop);
};


// Start the loop.

requestAnimFrame(mainLoop);

