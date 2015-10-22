
Ticker = {};

Ticker.tickers = [];

Ticker.add = function(cb, context) {
	this.tickers.push({ cb: cb, context: context });
};


Ticker.lastTick = null;

Ticker.tick = function() {

	// Set the first value of tick
	if (!this.lastTick)
		this.lastTick = Date.now();
		
	// Calculate the delta time
	var nowTick = Date.now();
	var dt = (nowTick - this.lastTick) / 1000.0;
	this.lastTick = nowTick;
	
	// Call all the tickers
	for (var i = 0; i < this.tickers.length; i++) {
		this.tickers[i].cb.call( this.tickers[i].context, dt );
	}
};
