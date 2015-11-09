
var Draw = {};



// Clear the screen.

Draw.clear = function() {
	for (var x = 0; x < Pixels.width; x++) {
		for (var y = 0; y < Pixels.height / 2; y++)
			Pixels.set(x, y, [1.0, 1.0, 1.0]);
		for (var y = Pixels.height / 2; y < Pixels.width; y++)
			Pixels.set(x, y, [0.9, 0.9, 0.9]);
	}
};



//
// Calculate pixel column.
//

Draw.calculatePixelColumn = function(hit, maxPixelHeight, tanVFov) {
	
	// Calculate the lighting dot product
	var lighting = (-hit.normal.x * hit.point.dx) + (-hit.normal.y * hit.point.dy);
	
	// Calculate the texture coords
	var texX = 0;
	var texCoordX = 0.0;
	if (hit.normal.x > 0.0)
		texCoordX = (hit.point.y - Math.floor(hit.point.y));
		
	else if (hit.normal.x < 0.0) 
		texCoordX = (Math.floor(hit.point.y) + 1.0 - hit.point.y);
		
	else if (hit.normal.y > 0.0) 
		texCoordX = (hit.point.x - Math.floor(hit.point.x));
		
	else if (hit.normal.y < 0.0) 
		texCoordX = (Math.floor(hit.point.x) + 1.0 - hit.point.x);
		
	texCoordX = Math.max(0.0, Math.min(texCoordX, 1.0));
	texX = Math.floor(texCoordX * hit.tile.info.texture.width);
	texX = Math.min(hit.tile.info.texture.width - 1, texX);

	// Calculate the pixel height based on the distance
	// : BlockHeight      = 2.0
	// : NormalizedHeight = (BlockHeight / 2) / (tan * distance)
	// : DrawHeight       = (PixelHeight / 2) * NormalizedHeight;
	var height = (maxPixelHeight / 2) / (tanVFov * hit.point.dist);
	
	// Calculate Ys
	var y1 = Math.floor(maxPixelHeight / 2 - height / 2);
	var y2 = Math.floor(maxPixelHeight  / 2 + height / 2);
	var cy1 = Math.max(y1, 0);
	var cy2 = Math.min(y2, maxPixelHeight);
	
	// Calculate the pixel line
	var pixelColumn = {
		y1: cy1,
		y2: cy2,
		pixels: []
	};
	var texture = hit.tile.info.texture;
	var texCoordY, texY, texColor;
	for (var y = cy1; y < cy2; y++) {
		texCoordY = (y - y1) / height;
		texY = Math.min(
			texture.height - 1,
			Math.floor(texCoordY * texture.height)	
		);
		texColor = texture.get(texX, texY);
		pixelColumn.pixels[y - cy1] = [
			texColor[0] * (lighting * 0.5 + 0.5),
			texColor[1] * (lighting * 0.5 + 0.5),
			texColor[2] * (lighting * 0.5 + 0.5)
		];
	}
	
	return pixelColumn;
		
};



// Render the world to the screen.

Draw.render = function(camera, map) {
	
	// Clear the screen first
	Draw.clear();
	
	// Prepare rendering variables
	var e        = 0.001;
	var tanVFov  = Math.tan(camera.vFovRad / 2);
	var adjacent = (Pixels.width / 2) / Math.tan(camera.hFovRad / 2);
	
	// Shoot rays for every x-axis pixel
	for (var x = 0; x < Pixels.width; x++) {
	
		// Calculate opposite value
		var opposite = (x - Pixels.width / 2) + 0.5;
		
		// Calculate the ray
		var ray = {};
		ray.angleOffset = Math.atan(opposite / adjacent);
		ray.angle       = ray.angleOffset + camera.rotRad;
		ray.dx          = Math.sin(ray.angle);
		ray.dy          = Math.cos(ray.angle);
		ray.x           = camera.posX;
		ray.y           = camera.posY;
		
		// Shoot the ray
		var hit = Raycaster.shootRay(ray, map);
		if (!hit)
			continue;
			
		// This function is to draw a single ray
		// Does NOT handle reflections, etc.
		var adjustDist = Math.cos(ray.angleOffset);
		var drawHit = function(hit, alpha) {
			
			// If the alpha is too low, it has no effect on the final image
			if (alpha <= 0.0)
				return;
			
			// Adjust the distance to the camera to fix the fisheye effect
			hit.point.dist *= adjustDist;
			
			// Calculate the pixel columns(s)
			var pc = Draw.calculatePixelColumn(hit, Pixels.height, tanVFov);
			
			// Render the pixel column
			for (var y = pc.y1; y < pc.y2; y++) {
		
				// Get the color of the hit tile
				var col = pc.pixels[y - pc.y1];
				
				// Set the alpha
				col[3] = alpha;
			
				// Draw the pixel
				Pixels.set(x, y, col);
			}
		};
		
		// Process all the hits
		// DOES handle reflections, etc.
		var maxHits = 50;
		var processHit = function(hit, maxAlpha) {
			
			// Limit the recursion
			if (maxHits > 0)
				maxHits--;
			else
				return;
			
			// Make sure we have a valid hit
			if (!hit || maxAlpha <= 0.0)
				return;
				
			// Save the distance (the draw function adjusts it)
			var hitDist = hit.point.dist;
			
			// Draw the hit
			var reflection   = hit.tile.info.reflect;
			var transparency = hit.tile.info.transparent;
			var alpha        = (1.0 - reflection - transparency) * maxAlpha;
			drawHit( hit, alpha );
			
			// Handle reflections
			if (reflection > 0.0) {
			
				ray.x = hit.point.x;
				ray.y = hit.point.y;
				ray.dx = hit.point.dx * (1.0 - Math.abs(hit.normal.x) * 2);
				ray.dy = hit.point.dy * (1.0 - Math.abs(hit.normal.y) * 2);
				
				var newHit = Raycaster.shootRay(ray, map);
				if (newHit) {
					newHit.point.dist += hitDist;
					processHit( newHit, reflection );
				}
			}
			
			// Handle transparency
			if (transparency > 0.0) {
			
				ray.x = hit.point.x;
				ray.y = hit.point.y;
				ray.dx = hit.point.dx;
				ray.dy = hit.point.dy;
				
				var newHit = Raycaster.shootRay(ray, map);
				if (newHit) {
					newHit.point.dist += hitDist;
					processHit( newHit, transparency );
				}
			}
		};
		
		processHit( hit, 1.0 );
	}
	
	// Update the pixels
	Pixels.draw();
};

