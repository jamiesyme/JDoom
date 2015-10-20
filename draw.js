
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
Draw.testRayAABB = function(ray, aabb) {
	
	//
	// Given tx1, tx2, ty1, ty2, return the intercept or null.
	//
	function getIntercept(tx1, tx2, ty1, ty2) {
		// Calculate the max t
		// This will be used to "throw out" values
		// ie. if t > tMax, it's considered invalid
		var tMax  = Math.max(tx1, tx2, ty1, ty2);
		
		// Throw out negative values (those hits are behind us)
		if (tx1 < 0) tx1 = tMax + 1;
		if (tx2 < 0) tx2 = tMax + 1;
		if (ty1 < 0) ty1 = tMax + 1;
		if (ty2 < 0) ty2 = tMax + 1;
		
		// Check tx1 bounds
		if (ray.y + ray.dy * tx1 < aabb.y ||
			  ray.y + ray.dy * tx1 > aabb.y + aabb.h)
			tx1 = tMax + 1;
	
		// Check tx2 bounds
		if (ray.y + ray.dy * tx2 < aabb.y ||
			  ray.y + ray.dy * tx2 > aabb.y + aabb.h)
			tx2 = tMax + 1;
			
		// Check ty1 bounds
		if (ray.x + ray.dx * ty1 < aabb.x ||
			  ray.x + ray.dx * ty1 > aabb.x + aabb.w)
			ty1 = tMax + 1;
	
		// Check ty2 bounds
		if (ray.x + ray.dx * ty2 < aabb.x ||
			  ray.x + ray.dx * ty2 > aabb.x + aabb.w)
			ty2 = tMax + 1;
			
		// Return the closest hit (if exists)
		var tHit = Math.min(tx1, tx2, ty1, ty2);
		if (tHit > tMax)
			return null;
		return {
			x: ray.x + ray.dx * tHit,
			y: ray.y + ray.dy * tHit
		};
	}
	
	// Handle vertical line
	if (ray.dx === 0 && Math.abs(ray.dy) === 1) {
	
		// Check X bounds
		if (ray.x < aabb.x || ray.x > aabb.x + aabb.w)
			return null;
			
		// Calculate y intercepts
		var ty1 = (aabb.y - ray.y) / ray.dy;
		var ty2 = (aabb.y + aabb.h - ray.y) / ray.dy;
		
		// Find the hit
		return getIntercept(-1, -1, ty1, ty2);
	}
	
	// Handle horizontal line
	if (Math.abs(ray.dx) === 1 && ray.dy === 0) {
	
		// Check Y bounds
		if (ray.y < aabb.y || ray.y > aabb.y + aabb.h)
			return null;
			
		// Calculate x intercepts
		var tx1 = (aabb.x - ray.x) / ray.dx;
		var tx2 = (aabb.x + aabb.w - ray.x) / ray.dx;
		
		// Find the hit
		return getIntercept(tx1, tx2, -1, -1);
	}
	
	// Handle every other line
	// Calculate intercepts
	var tx1 = (aabb.x - ray.x) / ray.dx;
	var tx2 = (aabb.x + aabb.w - ray.x) / ray.dx;
	var ty1 = (aabb.y - ray.y) / ray.dy;
	var ty2 = (aabb.y + aabb.h - ray.y) / ray.dy;
	
	// Find the hit
	return getIntercept(tx1, tx2, ty1, ty2);
};

// Render the world to the screen.

Draw.render = function(camera) {

	// TEMP: set the camera
	camera = camera || Camera;
	
	// Clear the screen first
	Draw.clear();
	
	// Render the world
	var posX     = camera.posX;
	var posY     = camera.posY;
	var rot      = camera.rotRad;
	var vFov     = camera.vFovRad;
	var hFov     = camera.hFovRad;
	var tanVFov  = Math.tan(vFov / 2);
	var adjacent = (Pixels.width / 2) / Math.tan(hFov / 2);
	
	for (var x = 0; x < Pixels.width; x++) {
	
		// Calculate opposite value
		var opposite = (x - Pixels.width / 2) + 0.5;
		
		// Calculate the ray angle(s)
		var rayAngleOffset = Math.atan(opposite / adjacent);
	
		// Calculate the normalized ray
		//var rayAngleRaw = (x / (Pixels.width - 1) - 0.5) * hFov;
		var rayAngle = rayAngleOffset + rot;
		var rayDirX  = Math.sin(rayAngle);
		var rayDirY  = Math.cos(rayAngle);
		
		// Check if the ray hit a box
		var hit = Draw.testRayAABB(
			{
				x:  posX, 
				y:  posY, 
				dx: rayDirX, 
				dy: rayDirY
			},
			{
				x: 0.5,
				y: 2,
				w: 1,
				h: 1
			}
		) || Draw.testRayAABB(
			{
				x:  posX, 
				y:  posY, 
				dx: rayDirX, 
				dy: rayDirY
			},
			{
				x: -2.5,
				y: 1,
				w: 2,
				h: 1
			}
		);
		if (hit != null) {
			// Distance = dist between hit & cam * Math.cos(rayAngle)
			var diffX = (hit.x - posX);
			var diffY = (hit.y - posY);
			var dist   = Math.sqrt(diffX * diffX + diffY * diffY) * Math.cos(rayAngleOffset);
			
			// BlockHeight      = 2.0
			// NormalizedHeight = (BlockHeight / 2) / (tan * distance)
			// DrawHeight       = (PixelHeight / 2) * NormalizedHeight;
			var height = (Pixels.height / 2) / (tanVFov * dist);
			
			// Draw the pixel line
			var y1 = Pixels.height / 2 - height / 2;
			var y2 = Pixels.height / 2 + height / 2;
			for (var y = y1; y < y2; y++)
				Pixels.set(x, Math.floor(y), [0, 0, 0]);
		}
	}
	
	// Update the pixels
	Pixels.draw();
};


// TEMP: Render the world 60 times per second
setInterval(Draw.render, 16);

