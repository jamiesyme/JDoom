
Raycaster = {};

//
// Shoot a ray into the map and return the hit faces.
//
//  ray: {
//  	x: start x coord
//  	y: start y coord
//  	dx: normalized direction x
//  	dy: normalized direction y
//  }
//
// Returns an empty array if it didn't hit anything.
//
// Returns the following structure otherwise:
//	[
//	  {
//		 	point:  { x, y },
//	  	normal: { x, y },
//			t,
//	  	texture,
//			height,
//			reflection,
//			translucency
//	  }
//	]
//

Raycaster.shootRay = function(ray) {
	
	var start = {
		x: ray.x,
		y: ray.y	
	};
	
	// Create a new ray (so we don't mess with the given ray
	ray = {
		x:  ray.x,
		y:  ray.y,
		dx: ray.dx,
		dy: ray.dy
	};
		
	// Search until we find the edge of the map or a tile
	var faces = [];
	while(faces.length < 1) {
	
		// Make sure we are within the map
		if (ray.x <= 0.0 && ray.dx < 0.0 ||
		    ray.y <= 0.0 && ray.dy < 0.0 ||
		    ray.x >= Map.width  && ray.dx > 0.0 ||
		    ray.y >= Map.height && ray.dy > 0.0)
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
		tile.info = Map.get(tile.x, tile.y); 
		if (!tile.info)
			continue;
		
		// Get the distance along the face
		var dAlongFace = 0.0;
		if      (normal.x > 0.0) dAlongFace = (ray.y - Math.floor(ray.y));
		else if (normal.x < 0.0) dAlongFace = (Math.floor(ray.y) + 1.0 - ray.y);
		else if (normal.y > 0.0) dAlongFace = (ray.x - Math.floor(ray.x));
		else if (normal.y < 0.0) dAlongFace = (Math.floor(ray.x) + 1.0 - ray.x);
		dAlongFace = Math.max(0.0, Math.min(dAlongFace, 1.0));
		
		// Save this face
		faces.push(
			{
				point: {
					x: ray.x,
					y: ray.y
				},
				normal: {
					x: normal.x,
					y: normal.y
				},
				t:            dAlongFace,
				texture:      tile.info.texture,
				height:       2.0,
				reflection:   tile.info.reflection,
				translucency: tile.info.translucency
			}
		);
	}
	
	
	// Reset the ray position
	ray.x = start.x;
	ray.y = start.y;
	
	
	// Check the sprites
	for (var spriteKey in Map.sprites) {
		
		// Get the sprite
		var sprite = Map.sprites[ spriteKey ];
		
		// Check if the ray is within the sprite
		var diffX = sprite.x - ray.x;
		var diffY = sprite.y - ray.y;
		var dist2 = diffX * diffX + diffY * diffY;
		if (dist2 < sprite.radius * sprite.radius * 0.5)
			continue;
		
		// Collision testing
		var cosRot = Math.cos( sprite.rot );
		var sinRot = Math.sin( sprite.rot );
		var m1 = ray.dy / ray.dx;
		var m2 = sinRot / cosRot;
		var b1 = ray.y - m1 * ray.x;
		var b2 = sprite.y - m2 * sprite.x;
		
		var xInt = (b2 - b1) / (m1 - m2);
		var yInt = m2 * xInt + b2;
		var t = (xInt - sprite.x) / (2.0 * sprite.radius * cosRot) + 0.5;
		if (t >= 0.0 && t <= 1.0) {
			
			// Save the face
			//console.log('Hit');
			faces.push(
				{
					point: {
						x: xInt,
						y: yInt
					},
					normal: { // TODO: Give actual normal
						x: -ray.dx,
						y: -ray.dy
					},
					t:            t,
					texture:      sprite.texture,
					height:       sprite.height,
					reflection:   0.0,
					translucency: 0.0
				}
			);
		}
		/*var m1 = ray.dy / ray.dx;
		var m2 = -ray.dx / ray.dy;
		var b1 = ray.y - m1 * ray.x;
		var b2 = sprite.y - m2 * sprite.x;
		
		var xInt = (b2 - b1) / (m1 - m2);
		var yInt = m1 * xInt + b1;
		var diffXInt = sprite.x - xInt;
		var diffYInt = sprite.y - yInt;
		var dist2Int = diffXInt * diffXInt + diffYInt * diffYInt;
		if (dist2Int <= sprite.radius * sprite.radius) {
			
			// Save the face
			//console.log('Hit');
			faces.push(
				{
					point: {
						x: sprite.x,//sprite.x - sprite.r * ray.dy,
						y: sprite.y//sprite.y + sprite.r * ray.dx
					},
					normal: {
						x: -ray.dx,
						y: -ray.dy
					},
					t:            0.5,
					texture:      sprite.t,
					height:       2.0,
					reflection:   0.0,
					translucency: 0.0
				}
			);
		}*/
		
	}
	
	
	// Return our hits
	return faces;
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
