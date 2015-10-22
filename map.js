
Map = {};

// Store the sizes

Map.width = 0;
Map.height = 0;

// Store the map data

Map.data = [];

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
	this.data[y * this.width + x] = obj;
};

Map.get = function(x, y) {
	return this.data[y * this.width + x];
};

// Load the intial map data

var initialMapData = [
'           ',
' ###   ### ',
'         # ',
' ###   # # ',
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
		if (x === 0 || x === Map.width - 1 ||
		    y === 0 || y === Map.height - 1 ||
		    initialMapData[y - 1][x - 1] === ' ')
		  Map.set(x, y, null);
		else
			Map.set(x, y, {});
	}
}

