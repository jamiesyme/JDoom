
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
