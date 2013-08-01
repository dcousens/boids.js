// A copy of Two.Vector from two.js, but without Backbone.js
// https://raw.github.com/jonobr1/two.js/master/src/vector.js
function Vector2(x, y) {
	this.x = x || 0;
	this.y = y || 0;

	this.set = function(x, y) {
		this.x = x;
		this.y = y;
		return this;
	}

	this.copy = function(v) {
		this.x = v.x;
		this.y = v.y;
		return this;
	}

	this.clear = function() {
		this.x = 0;
		this.y = 0;
		return this;
	}

	this.clone = function() {
		return new Vector(this.x, this.y);
	}

	this.add = function(v1, v2) {
		this.x = v1.x + v2.x;
		this.y = v1.y + v2.y;
		return this;
	}

	this.addSelf = function(v) {
		this.x += v.x;
		this.y += v.y;
		return this;
	}

	this.sub = function(v1, v2) {
		this.x = v1.x - v2.x;
		this.y = v1.y - v2.y;
		return this;
	}

	this.subSelf = function(v) {
		this.x -= v.x;
		this.y -= v.y;
		return this;
	}

	this.multiplySelf = function(v) {
		this.x *= v.x;
		this.y *= v.y;
		return this;
	}

	this.multiplyScalar = function(s) {
		this.x *= s;
		this.y *= s;
		return this;
	}

	this.divideScalar = function(s) {
		if (s) {
			this.x /= s;
			this.y /= s;
		} else {
			this.set(0, 0);
		}
		return this;
	}

	this.distance = function(v) {
		return Math.sqrt(this.distanceSq(v));
	}

	this.distanceSq = function(v) {
		var dx = this.x - v.x, dy = this.y - v.y;
		return dx * dx + dy * dy;
	}

	this.dot = function(v) {
		return this.x * v.x + this.y * v.y;
	}

	this.equals = function(v) {
		return this.distance(v) < 0.0001; /* almost same position */
	}

	this.lengthSq = function() {
		return this.x * this.x + this.y * this.y;
	}

	this.length = function() {
		return Math.sqrt(this.lengthSq());
	}

	this.lerp = function(v, t) {
		var x = (v.x - this.x) * t + this.x;
		var y = (v.y - this.y) * t + this.y;

		return this.set(x, y);
	}

	this.negate = function() {
		return this.multiplyScalar(-1);
	}

	this.normalize = function() {
		return this.divideScalar(this.length());
	}
}
