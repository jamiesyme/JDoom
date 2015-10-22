
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
		
		// Shoot the ray through the map
		while (true) {
			
			// Try and move the ray off of any integer boundaries 
			ray.x += ray.dx * e;
			ray.y += ray.dy * e;
			
			// Make sure we are within the map
			if (ray.x <= 0.0 && ray.dx < 0.0 ||
			    ray.y <= 0.0 && ray.dy < 0.0 ||
			    ray.x >= map.width  && ray.dx > 0.0 ||
			    ray.y >= map.height && ray.dy > 0.0)
			  break;
			
			// Calculate distance to next integer boundary
			var tx = -1.0, ty = -1.0;
			if (ray.dx > 0)
				tx = (Math.floor(ray.x + 1.0) - ray.x) / ray.dx;
			else 
			if (ray.dx < 0)
				tx = (Math.floor(ray.x) - ray.x) / ray.dx;
			if (ray.dy > 0)
				ty = (Math.floor(ray.y + 1.0) - ray.y) / ray.dy;
			else 
			if (ray.dy < 0)
				ty = (Math.floor(ray.y) - ray.y) / ray.dy;
			
			var tBest = null;
			if (tx >= 0.0 && ty >= 0.0) {
				tBest = (tx < ty ? tx : ty);
				//if (tx < ty) {
				//	tBest = tx;
				//} else {
				//	tBest = ty;
				//}
			} else if (tx >= 0.0) {
				tBest = tx;
			} else if (ty >= 0.0) {
				tBest = ty;
			}else
				break;
				
			// Move the ray
			ray.x += ray.dx * tBest;
			ray.y += ray.dy * tBest;
				
			// Calculate the tile we're at
			var tileX = Math.floor(ray.x + ray.dx * e);
			var tileY = Math.floor(ray.y + ray.dy * e);
			
			// If it's empty, we can keep moving
			if ( !map.get(tileX, tileY) )
				continue;
			
			// Calculate color based on face normal
			var color = [0.5, 0.5, 0.5];
			if (tx === tBest) {
				//color = [1, 0, 0];
				if (ray.dx < 0.0) color = [0, 1, 0];
				if (ray.dx > 0.0) color = [0, 0, 0];
			} else {
				//color = [0, 0, 1];
				if (ray.dy < 0.0) color = [1, 0, 0];
				if (ray.dy > 0.0) color = [0, 0, 1];
			}
			
			
			// We hit! Calculate the distance between the hit and the camera
			var diffX = (ray.x - camera.posX);
			var diffY = (ray.y - camera.posY);
			var dist  = Math.sqrt(diffX * diffX + diffY * diffY) * Math.cos(ray.angleOffset);
		
			// Calculate the pixel height based on the distance
			// : BlockHeight      = 2.0
			// : NormalizedHeight = (BlockHeight / 2) / (tan * distance)
			// : DrawHeight       = (PixelHeight / 2) * NormalizedHeight;
			var height = (Pixels.height / 2) / (tanVFov * dist);
			var height = Math.min(height, Pixels.height);
			
			// Draw the pixel line
			var y1 = Pixels.height / 2 - height / 2;
			var y2 = Pixels.height / 2 + height / 2;
			for (var y = y1; y < y2; y++)
				Pixels.set(x, Math.floor(y), color);
				
			if (Keyboard.isKeyDown('p'))
				console.log('Wall hit: (', tileX, ',', tileY, ')');
				
			// We're done here
			break;
		}
		
		// Reset the ray position
		ray.x = camera.posX;
		ray.y = camera.posY;
		
		// Shoot the ray at sprites
		/*var hit = Draw.testRayAABB( ray,
			{
				x: 0.5,
				y: 2,
				w: 1,
				h: 1
			}
		) || Draw.testRayAABB( ray,
			{
				x: -2.5,
				y: 1,
				w: 2,
				h: 1
			}
		);
		if (hit != null) {
			// Distance = dist between hit & cam * Math.cos(rayAngle)
			var diffX = (hit.x - ray.x);
			var diffY = (hit.y - ray.y);
			var dist   = Math.sqrt(diffX * diffX + diffY * diffY) * Math.cos(ray.angleOffset);
			
			// : BlockHeight      = 2.0
			// : NormalizedHeight = (BlockHeight / 2) / (tan * distance)
			// : DrawHeight       = (PixelHeight / 2) * NormalizedHeight;
			var height = (Pixels.height / 2) / (tanVFov * dist);
			
			// Draw the pixel line
			var y1 = Pixels.height / 2 - height / 2;
			var y2 = Pixels.height / 2 + height / 2;
			for (var y = y1; y < y2; y++)
				Pixels.set(x, Math.floor(y), [0, 0, 0]);
		}*/
	}
	
	// Update the pixels
	Pixels.draw();
};

