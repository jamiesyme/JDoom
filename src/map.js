
Map = {};

// Store the sizes

Map.width = 0;
Map.height = 0;

// Store the map data

Map.data = [];
Map.sprites = [];


// Expose map access through an API.

Map.setSize = function(w, h) {
	this.width = Math.max(w, 0);
	this.height = Math.max(h, 0);
	this.data = [];
	for (var y = 0; y < h; y++)
		for (var x = 0; x < w; x++)
			Map.set(x, y, null);
};

Map.set = function(x, y, obj) {
	if (x < 0 || x >= this.width || y < 0 || y >= this.height)
		return;
	this.data[y * this.width + x] = obj;
};

Map.get = function(x, y) {
	if (x < 0 || x >= this.width || y < 0 || y >= this.height)
		return null;
	return this.data[y * this.width + x];
};

Map.addSprite = function(sprite) {
	this.sprites.push(sprite);
};

Map.getSprites = function() {
	return this.sprites;
};

