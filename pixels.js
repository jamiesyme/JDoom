
Pixels = {};

// Store the screen size.

Pixels.width = 0;
Pixels.height = 0;

// Store the canvas data.

Pixels.canvas = document.getElementsByTagName('canvas')[0];
Pixels.ctx    = Pixels.canvas.getContext('2d', {alpha: false});

// Store the pixel data.

Pixels.pixels = null;

// Expose pixel access through an API.

Pixels.setSize = function(w, h) {
	this.width = w;
	this.height = h;
	this.canvas.width = w;
	this.canvas.height = h;
	this.pixels = this.ctx.createImageData(w, h);
	for (var y = 0; y < h; y++)
		for (var x = 0; x < w; x++)
			this.set(x, y, [1, 1, 1]);
};

Pixels.set = function (x, y, color) {
	var i = (y * this.width + x) * 4;
	this.pixels.data[i + 0] = color[0] * 255;
	this.pixels.data[i + 1] = color[1] * 255;
	this.pixels.data[i + 2] = color[2] * 255;
	this.pixels.data[i + 3] = 255;
};

Pixels.get = function (x, y) {
	var i = (y * this.width + x) * 3;
	return [
		this.pixels.data[i + 0] / 255,
		this.pixels.data[i + 1] / 255,
		this.pixels.data[i + 2] / 255
	];
};

Pixels.draw = function () {
	this.ctx.putImageData(this.pixels, 0, 0);
};

