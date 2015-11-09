
var Draw = {};



//
// Clear the screen.
//

Draw.clear = function() {
	for (var x = 0; x < Pixels.width; x++) {
		for (var y = 0; y < Pixels.height / 2; y++)
			Pixels.set(x, y, [1.0, 1.0, 1.0]);
		for (var y = Pixels.height / 2; y < Pixels.width; y++)
			Pixels.set(x, y, [0.9, 0.9, 0.9]);
	}
};



//
// Render the world to the screen.
//

Draw.render = function(camera, map) {
	
	// Clear the screen first
	Draw.clear();
	
	// Prepare rendering variables
	var e        = 0.001;
	var tanVFov  = Math.tan(camera.vFovRad / 2);
	var adjacent = (Pixels.width / 2) / Math.tan(camera.hFovRad / 2);
	
	// Shoot rays for every x-axis pixel
	Draw._faces = 0;
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
		Draw._processRay({
			
			pixelX:     x,
			maxAlpha:   1.0,
			maxRays:    50,
			extraDist:  0.0,
			adjustDist: Math.cos(ray.angleOffset),
			tanFov:     tanVFov,
			ray:        ray
				
		});
	}
	
	
	// Update the pixels
	Pixels.draw();
};



//
// This function calculates the column of pixels to draw for a face.
//

Draw._getPixelsForFace = function(o) {
	
	
	// Calculate the lighting dot product
	var lighting = (-o.face.normal.x * o.ray.dx) + (-o.face.normal.y * o.ray.dy);
	
	
	// Calculate the texture coord-x
	var texture = o.face.texture;
	var coordY = 0;
	var coordX = Math.min(
		
		texture.width - 1,
		Math.floor(o.face.t * texture.width)
		
	);
	
	
	// Calculate the pixel height based on the distance
	// : NormalizedHeight = (FaceHeight / 2) / (tan * distance)
	// : DrawHeight       = (PixelHeight / 2) * NormalizedHeight;
	var height = (Pixels.height / 2) * (o.face.height / 2.0) / (o.tanFov * o.dist);
	
	
	// Calculate Ys
	var y1 = Math.floor(Pixels.height / 2 - height / 2);
	var y2 = Math.floor(Pixels.height / 2 + height / 2);
	var cy1 = Math.max(y1, 0);
	var cy2 = Math.min(y2, Pixels.height);
	
	
	// Calculate the pixel line
	var pixelColumn = {
		y1: cy1,
		y2: cy2,
		pixels: []
	};
	
	
	for (var y = cy1; y < cy2; y++) {
		
		// Get the texture coord-y
		coordY = Math.min(
		
			texture.height - 1,
			Math.floor((y - y1) / height * texture.height)
			
		);
		
		// Get the texture coord
		var texColor = texture.get( coordX, coordY );
		
		// Compute the final color
		pixelColumn.pixels[y - cy1] = [
			texColor[0] * (lighting * 0.5 + 0.5),
			texColor[1] * (lighting * 0.5 + 0.5),
			texColor[2] * (lighting * 0.5 + 0.5)
		];
	}
	
	return pixelColumn;
	
};


//
// This function draws a face.
//

Draw._drawFace = function(o) {
	
	
	// If the alpha is too low, it has no effect on the final image
	if (o.alpha <= 0.0)
		return;
	
	
	// Calculate the pixel columns
	var pc = Draw._getPixelsForFace({
		
		face:   o.face,
		dist:   o.dist,
		tanFov: o.tanFov,
		ray:    o.ray
		
	});
	
	
	// Render the pixel column
	for (var y = pc.y1; y < pc.y2; y++) {

		// Get the color of the hit tile
		var col = pc.pixels[y - pc.y1];
		
		// Set the alpha
		col[3] = o.alpha;
	
		// Draw the pixel
		Pixels.set(o.pixelX, y, col);
	}
};



//
// Process a face, shooting additional rays when needed.
//

Draw._processFace = function(o) {
	Draw._faces += 1;
	
	// Calculate the face distance
	var diffX = (o.face.point.x - o.ray.x);
	var diffY = (o.face.point.y - o.ray.y);
	var distance = Math.sqrt( diffX * diffX + diffY * diffY );
	
	
	// Add the extra distance
	distance += o.extraDist;
	
	
	// Get alphas ready
	var reflection   = o.face.reflection;
	var translucency = o.face.translucency;
	var alpha        = (1.0 - reflection - translucency) * o.maxAlpha;
	
	
	// Handle reflections
	if (reflection > 0.0) {
		
		Draw._processRay({
			
			pixelX:     o.pixelX,
			maxAlpha:   reflection,
			maxRays:    o.maxRays - 1,
			extraDist:  distance,
			adjustDist: o.adjustDist,
			tanFov:     o.tanFov,
			ray: {
				x:  o.face.point.x,
				y:  o.face.point.y,
				dx: o.ray.dx * (1.0 - Math.abs(o.face.normal.x) * 2),
				dy: o.ray.dy * (1.0 - Math.abs(o.face.normal.y) * 2)
			}
			
		});
		
	}
	
	
	// Handle translucency
	if (translucency > 0.0) {
		
		Draw._processRay({
			
			pixelX:     o.pixelX,
			maxAlpha:   translucency,
			maxRays:    o.maxRays - 1,
			extraDist:  distance,
			adjustDist: o.adjustDist,
			tanFov:     o.tanFov,
			ray: {
				x:  o.face.point.x,
				y:  o.face.point.y,
				dx: o.ray.dx,
				dy: o.ray.dy
			}
			
		});
		
	}
	
	
	// Draw that face!
	Draw._drawFace({
		
		face:   o.face,
		pixelX: o.pixelX,
		dist:   distance * o.adjustDist, 
		alpha:  alpha, 
		tanFov: o.tanFov,
		ray:    o.ray
	
	});
	
};



//
// Shoot a ray and process the faces.
//

Draw._processRay = function(o) {
	
	
	// Limit the recursion
	if (o.maxRays <= 0)
		return;
	
	
	// Check our alpha
	if (o.maxAlpha <= 0.0)
		return;
	
	
	// Shoot the ray
	var faces = Raycaster.shootRay( o.ray );
	
	
	// Process each face
	for (var faceKey in faces) {
		
		Draw._processFace({
			
			face:       faces[faceKey],
			pixelX:     o.pixelX,
			maxAlpha:   o.maxAlpha,
			maxRays:    o.maxRays,
			extraDist:  o.extraDist,
			adjustDist: o.adjustDist,
			tanFov:     o.tanFov,
			ray:        o.ray
			
		});
		
	}
	
};
