
Images = {};

Images.images = {};

Images.ctx = null;

Images.load = function(imgId, imgName) {
	
	// Create the loading canvas
	if (!this.ctx)
		this.ctx = document.createElement('canvas').getContext('2d');
	
	// Grab the html image
	var imgTag = document.getElementById(imgId);
	
	// Extract the image data
	var imgWidth  = imgTag.naturalWidth;
	var imgHeight = imgTag.naturalHeight;
	this.ctx.canvas.width  = imgWidth;
	this.ctx.canvas.height = imgHeight;
	this.ctx.clearRect(0, 0, imgWidth, imgHeight);
	this.ctx.drawImage(imgTag, 0, 0, imgWidth, imgHeight);
	var imgData = this.ctx.getImageData(0, 0, imgWidth, imgHeight);
	
	// Create and save the image
	this.images[imgName] = {
		data:   imgData,
		width:  imgWidth,
		height: imgHeight,
		get:    function(x, y) {
			var i = (y * this.width + x) * 4;
			return [
				this.data.data[i + 0] / 255,
				this.data.data[i + 1] / 255,
				this.data.data[i + 2] / 255
			];
		}
	};
	
	return this.images[imgName];
};

Images.get = function(imgName) {
	return this.images[imgName];
};

