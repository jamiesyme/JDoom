
Keyboard = {};

Keyboard.listeners = {
	onPress: [],
	onRelease: []
};

Keyboard.addKeyPressListener = function(cb) {
	if (cb)
		this.listeners.onPress.push(cb);
};

Keyboard.addKeyReleaseListener = function(cb) {
	if (cb)
		this.listeners.onRelease.push(cb);
};


Keyboard.nameToCode = {
	'backspace': 8,
	'tab': 9,
	'enter': 13,
	'shift': 16,
	'ctrl': 17,
	'alt': 18,
	'pause/break': 19,
	'caps lock': 20,
	'escape': 27,
	' ': 32,
	'page up': 33,
	'page down': 34,
	'end': 35,
	'home': 36,
	'left': 37,
	'up': 38,
	'right': 39,
	'down': 40,
	'insert': 45,
	'delete': 46,
	'0': 48,
	'1': 49,
	'2': 50,
	'3': 51,
	'4': 52,
	'5': 53,
	'6': 54,
	'7': 55,
	'8': 56,
	'9': 57,
	'a': 65,
	'b': 66,
	'c': 67,
	'd': 68,
	'e': 69,
	'f': 70,
	'g': 71,
	'h': 72,
	'i': 73,
	'j': 74,
	'k': 75,
	'l': 76,
	'm': 77,
	'n': 78,
	'o': 79,
	'p': 80,
	'q': 81,
	'r': 82,
	's': 83,
	't': 84,
	'u': 85,
	'v': 86,
	'w': 87,
	'x': 88,
	'y': 89,
	'z': 90,
	'lsuper': 91,
	'rsuper': 92,
	'select': 93,
	'num0': 96,
	'num1': 97,
	'num2': 98,
	'num3': 99,
	'num4': 100,
	'num5': 101,
	'num6': 102,
	'num7': 103,
	'num8': 104,
	'num9': 105,
	'*': 106,
	'+': 107,
	'-': 109,
	'decimal': 110,
	'/': 111,
	'f1': 112,
	'f2': 113,
	'f3': 114,
	'f4': 115,
	'f5': 116,
	'f6': 117,
	'f7': 118,
	'f8': 119,
	'f9': 120,
	'f10': 121,
	'f11': 122,
	'f12': 123,
	'num lock': 144,
	'scroll lock': 145,
	';': 186,
	'=': 187,
	',': 188,
	'dash': 189,
	'.': 190,
	'/': 191,
	'`': 192
};

Keyboard.codeToName = {};
for (var k in Keyboard.nameToCode)
	if (Keyboard.nameToCode.hasOwnProperty(k))
		Keyboard.codeToName[ Keyboard.nameToCode[k] ] = k;


Keyboard.keysPressed = {};

Keyboard.onPress = function(keyName) {
	Keyboard.keysPressed[keyName] = true;
};

Keyboard.onRelease = function(keyName) {
	Keyboard.keysPressed[keyName] = false;
};

Keyboard.isKeyDown = function(keyName) {
	return !!this.keysPressed[keyName];
}


Keyboard.addKeyPressListener( Keyboard.onPress );
Keyboard.addKeyReleaseListener( Keyboard.onRelease );


document.addEventListener('keydown', (function(e) {
	for (var i = 0; i < this.listeners.onPress.length; i++)
		this.listeners.onPress[i]( this.codeToName[e.keyCode] );
}).bind(Keyboard));

document.addEventListener('keyup', (function(e) {
	for (var i = 0; i < this.listeners.onRelease.length; i++)
		this.listeners.onRelease[i]( this.codeToName[e.keyCode] );
}).bind(Keyboard));
