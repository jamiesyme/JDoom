
Raycaster = {};

//
// Shoot a ray into the map.
//
//  ray: {
//  	x: start x coord
//  	y: start y coord
//  	dx: normalized direction x
//  	dy: normalized direction y
//  }
//  map: {
//  	width: dur
//  	height: dur
//  	get: function(x, y)
//  		Should return falsey if empty.
//  		Should return tile info otherwise.
//  }
//
// Returns null if it didn't hit anything.
//
// Returns the following structure otherwise:
//  {
//  	point: { x, y, dx, dy, dist },
//  	normal: { x, y },
//  	tile: { x, y, info }
//  }
//

Raycaster.shootRay = function(ray, map) {
	
	var start = {
		x: ray.x,
		y: ray.y	
	};
		
	// Search until we find the edge of the map or a tile
	while(true) {
	
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
		if (ray.dx < 0) {
			tx = (Math.floor(ray.x) - ray.x) / ray.dx;
			if (tx === 0.0)
				tx = -1.0 / ray.dx;
		}
		if (ray.dy > 0)
			ty = (Math.floor(ray.y + 1.0) - ray.y) / ray.dy;
		else 
		if (ray.dy < 0) {
			ty = (Math.floor(ray.y) - ray.y) / ray.dy;
			if (ty === 0.0)
				ty = -1.0 / ray.dy;
		}
		
		var tBest = null;
		if (tx >= 0.0 && ty >= 0.0) {
			tBest = (tx < ty ? tx : ty);
		} else if (tx >= 0.0) {
			tBest = tx;
		} else if (ty >= 0.0) {
			tBest = ty;
		}else
			break;
			
		// Move the ray
		ray.x += ray.dx * tBest;
		ray.y += ray.dy * tBest;
		
		// Calculate the hit normal
		var normal = {x: 0.0, y: 0.0};
		if (tx === tBest) {
			if (ray.dx < 0.0) normal.x =  1.0;
			if (ray.dx > 0.0) normal.x = -1.0;
		} else {
			if (ray.dy < 0.0) normal.y =  1.0;
			if (ray.dy > 0.0) normal.y = -1.0;
		}
		
		// Calculate the tile we're at
		var tile = {};
		if (normal.x > 0.0) {
			tile.x = Math.round(ray.x) - 1.0;
			tile.y = Math.floor(ray.y);
		} else if (normal.x < 0.0) {
			tile.x = Math.round(ray.x);
			tile.y = Math.floor(ray.y);
		} else if (normal.y > 0.0) {
			tile.x = Math.floor(ray.x);
			tile.y = Math.round(ray.y) - 1.0;
		} else if (normal.y < 0.0) {
			tile.x = Math.floor(ray.x);
			tile.y = Math.round(ray.y);
		}
		
		// If it's empty, we can keep moving
		tile.info = map.get(tile.x, tile.y); 
		if (!tile.info)
			continue;
		
		// We hit!
		var dx2 = (ray.x - start.x) * (ray.x - start.x);
		var dy2 = (ray.y - start.y) * (ray.y - start.y);
		return {
			point: {
				x: ray.x,
				y: ray.y,
				dx: ray.dx,
				dy: ray.dy,
				dist: Math.sqrt(dx2 + dy2)
			},
			normal: {
				x: normal.x,
				y: normal.y
			},
			tile: {
				x: tile.x,
				y: tile.y,
				info: tile.info
			}
		}
	}
	
	// We didn't hit a thing	
	return null;
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
Raycaster.testRayAABB = function(ray, aabb) {
	
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
