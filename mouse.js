
Mouse = {};

Mouse.x = 0;
Mouse.y = 0;

Mouse.listeners = [];

Mouse.addMoveListener = function(cb) {
	if (cb)
		this.listeners.push(cb);
};


document.addEventListener('mousemove', (function(e) {
	for (var i = 0; i < this.listeners.length; i++)
		this.listeners[i](e.clientX - this.x, e.clientY - this.y);
	this.x = e.clientX;
	this.y = e.clientY;
}).bind(Mouse));
