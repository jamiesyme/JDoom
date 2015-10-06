
//
// Create the pixel data.
//

var windowDiv = document.getElementById('window');

var windowWidth  = 300;
var windowHeight = 200;

var pixelDivs = new Array(windowWidth * windowHeight);
var pixels    = new Array(windowWidth * windowHeight);

for (var y = 0; y < windowHeight; y++) {
	for (var x = 0; x < windowWidth; x++) {
		var pixelDiv = document.createElement('div');
		pixelDiv.className = 'pixel';
		windowDiv.appendChild(pixelDiv);
		pixelDivs[y * windowWidth + x] = pixelDiv;
		pixels[   y * windowWidth + x] = [0, 0, 0];
	}
	windowDiv.appendChild(document.createElement('br'));
}

//
// Expose pixel access through an API.
//

function getWindowWidth() {
	return windowWidth;
}

function getWindowHeight() {
	return windowHeight;
}

function setPixel(x, y, color) {

	function compToHex(c) {
		var hex = c.toString(16);
		return hex.length == 1 ? "0" + hex : hex;
	}
	
	var hex = '#' + compToHex(color[0] * 255) +
	                compToHex(color[1] * 255) +
	                compToHex(color[2] * 255);
	
	pixelDivs[y * windowWidth + x].style.backgroundColor = hex;
	
	pixels[y * windowWidth + x][0] = color[0];
	pixels[y * windowWidth + x][1] = color[1];
	pixels[y * windowWidth + x][2] = color[2];
}

function getPixel(x, y) {
	return pixels[y * windowWidth + x];
}

