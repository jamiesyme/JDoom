
Images = {};

Images.images = {};

Images.ctx = null;

Images.load = function(imgName, imgPath) {
	
	// Create the loading canvas
	if (!this.ctx)
		this.ctx = document.createElement('canvas').getContext('2d');
	
	// Create the image reference
	var img = {
		data:   null,
		width:  0,
		height: 0,
		get: function(x, y) {
			if (!this.data)
				return [0, 0, 0];
			var i = (y * this.width + x) * 4;
			return [
				this.data.data[i + 0] / 255,
				this.data.data[i + 1] / 255,
				this.data.data[i + 2] / 255
			];
		}
	};
	Images.images[imgName] = img;
	
	// Load the image
	var imgObj = new Image();
	imgObj.onload = function() {
	
		// Extract the image data
		img.width  = this.naturalWidth;
		img.height = this.naturalHeight;
		Images.ctx.canvas.width  = img.width;
		Images.ctx.canvas.height = img.height;
		Images.ctx.clearRect(0, 0, img.width, img.height);
		Images.ctx.drawImage(this, 0, 0, img.width, img.height);
		img.data = Images.ctx.getImageData(0, 0, img.width, img.height);
	};
	imgObj.src = imgName + '.png';
	
	// Return the image
	return imgObj;
};

Images.get = function(imgName) {
	return this.images[imgName];
};

