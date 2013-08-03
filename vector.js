// A copy of Two.Vector from two.js, but without Backbone.js
// https://raw.github.com/jonobr1/two.js/master/src/vector.js
function Vector2(x, y) {
	this.x = x || 0;
	this.y = y || 0;
}

Vector2.prototype = {
	set: function(x, y) {
		this.x = x;
		this.y = y;
		return this;
	},

	copy: function(v) {
		this.x = v.x;
		this.y = v.y;
		return this;
	},

	clear: function() {
		this.x = 0;
		this.y = 0;
		return this;
	},

	clone: function() {
		return new Vector2(this.x, this.y);
	},

	add: function(v1, v2) {
		this.x = v1.x + v2.x;
		this.y = v1.y + v2.y;
		return this;
	},

	addSelf: function(v) {
		this.x += v.x;
		this.y += v.y;
		return this;
	},

	sub: function(v1, v2) {
		this.x = v1.x - v2.x;
		this.y = v1.y - v2.y;
		return this;
	},

	subSelf: function(v) {
		this.x -= v.x;
		this.y -= v.y;
		return this;
	},

	multiplySelf: function(v) {
		this.x *= v.x;
		this.y *= v.y;
		return this;
	},

	multiplyScalar: function(s) {
		this.x *= s;
		this.y *= s;
		return this;
	},

	divideScalar: function(s) {
		if (s) {
			this.x /= s;
			this.y /= s;
		} else {
			this.set(0, 0);
		}
		return this;
	},

	distance: function(v) {
		return Math.sqrt(this.distanceSq(v));
	},

	distanceSq: function(v) {
		var dx = this.x - v.x, dy = this.y - v.y;
		return dx * dx + dy * dy;
	},

	dot: function(v) {
		return this.x * v.x + this.y * v.y;
	},

	equals: function(v) {
		return this.distance(v) < 0.0001; /* almost same position */
	},

	lengthSq: function() {
		return this.x * this.x + this.y * this.y;
	},

	length: function() {
		return Math.sqrt(this.lengthSq());
	},

	lerp: function(v, t) {
		var x = (v.x - this.x) * t + this.x;
		var y = (v.y - this.y) * t + this.y;

		return this.set(x, y);
	},

	negate: function() {
		return this.multiplyScalar(-1);
	},

	normalize: function() {
		return this.divideScalar(this.length());
	}
};
