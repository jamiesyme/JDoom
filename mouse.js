
Mouse = {};

Mouse.x = 0;
Mouse.y = 0;

Mouse.listeners = [];

Mouse.addMoveListener = function(cb) {
	if (cb)
		this.listeners.push(cb);
};


document.addEventListener('mousemove', function(e) {
	for (var i = 0; i < Mouse.listeners.length; i++)
		Mouse.listeners[i](e.clientX - Mouse.x, e.clientY - Mouse.y);
	Mouse.x = e.clientX;
	Mouse.y = e.clientY;
});
