
var Draw = {};

// Clear the screen.

Draw.clear = function() {
	for (var y = Pixels.height / 2; y < Pixels.height; y++)
		for (var x = 0; x < Pixels.width; x++)
			Pixels.set(x, y, [0.9, 0.9, 0.9]);
};

// Test ray-vs-box.
//
// Parameters:
//	ray = {
//		x: 0,
//		y: 0,
//		dx: 0,
//		dy: 0
//	};
//	aabb = {
//		x: 0,
//		y: 0,
//		w: 0,
//		h: 0 
//	};
//
// Returns:
//	null OR
//	{
//		x:    0, // Intersection x
//		y:    0  // Intersection y
//	};
//
Draw.testLineAABB = function(ray, aabb) {
	
	// Handle vertical line
	if (ray.dx === 0 && Math.abs(ray.dy) === 1) {
	
		// Check X bounds
		if (ray.x < aabb.x || ray.x > aabb.x + aabb.w)
			return null;
			
		// Calculate y intercepts
		var tyMin = (aabb.y - ray.y) / ray.dy;
		var tyMax = (aabb.y + aabb.h - ray.y) / ray.dy;
		if (tyMin < 0 && tyMax < 0)
			return null;
			
		// Return the best intercept
		if (tyMin < tyMax || tyMax < 0) {
			return {
				x: ray.x + ray.dx * tyMin,
				y: ray.y + ray.dy * tyMin
			};
		} else {
			return {
				x: ray.x + ray.dx * tyMax,
				y: ray.y + ray.dy * tyMax
			};
		}
	}
	
	// Handle horizontal line
	if (Math.abs(ray.dx) === 1 && ray.dy === 0) {
	
		// Check Y bounds
		if (ray.y < aabb.y || ray.y > aabb.y + aabb.h)
			return null;
			
		// Calculate x intercepts
		var txMin = (aabb.x - ray.x) / ray.dx;
		var txMax = (aabb.x + aabb.w - ray.x) / ray.dx;
		if (txMin < 0 && txMax < 0)
			return null;
			
		// Return the best intercept
		if (txMin < txMax || txMax < 0) {
			return {
				x: ray.x + ray.dx * txMin,
				y: ray.y + ray.dy * txMin
			};
		} else {
			return {
				x: ray.x + ray.dx * txMax,
				y: ray.y + ray.dy * txMax
			};
		}
	}
	
	// Handle every other line
	// Calculate intercepts
	var txMin = (aabb.x - ray.x) / ray.dx;
	var txMax = (aabb.x + aabb.w - ray.x) / ray.dx;
	var tyMin = (aabb.y - ray.y) / ray.dy;
	var tyMax = (aabb.y + aabb.h - ray.y) / ray.dy;
	
	// 
};

// Render the world to the screen.

Draw.render = function() {
	
	// Clear the screen first
	Draw.clear();
	
	// Render the world
	var degToRad = 3.141592654 / 180.0;
	var vFov = 90.0 * degToRad;
	var hFov = vFov * Pixels.width / Pixels.height;
	for (var x = 0; x < Pixels.width; x++) {
	
		// Calculate the ray
		var rayAngle = (x - Pixels.width / 2) / (Pixels.width - 1) * hFov / 2.0;
		var rayDirX  = Math.cos(rayAngle);
		var rayDirY  = Math.sqrt(1.0 - rayDirX);
		
		// 
	}
	
	// Update the pixels
	Pixels.draw();
};


// TEMP: Render the world once
Draw.render();

