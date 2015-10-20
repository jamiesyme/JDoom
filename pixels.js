
Pixels = {};

// Store the screen sizes.

Pixels.width  = 300;
Pixels.height = 200;

// Store the canvas data.

Pixels.canvas            = document.getElementsByTagName('canvas')[0];
Pixels.ctx               = Pixels.canvas.getContext('2d', {alpha: false});
Pixels.ctx.canvas.width  = Pixels.width;
Pixels.ctx.canvas.height = Pixels.height;

// Store the pixel data.

Pixels.pixels = Pixels.ctx.createImageData(Pixels.width, Pixels.height);

// Expose pixel access through an API.

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


// Initialize the pixel data

for (var y = 0; y < Pixels.height; y++) {
	for (var x = 0; x < Pixels.width; x++) {
		Pixels.set(x, y, [1, 1, 1]);
	}
}

