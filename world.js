function WrappedWorld(width, height) {
	var self = this;
	this.agents = [];
	this.width = width;
	this.height = height;

	this.offset = function(a, b, tmp) {
		var d = tmp || new Two.Vector();
		d.sub(a, b);

		var halfx = self.width / 2;
		var halfy = self.height / 2;

		if (d.x > halfx) {
			d.x -= self.width;
		} else if (d.x < -halfx) {
			d.x += self.width;
		}

		if (d.y > halfy) {
			d.y -= self.height;
		} else if (d.y < -halfy) {
			d.y += self.height;
		}

		return d;
	}

	this.step = function(dt) {
		_.each(self.agents, function(agent) {
			if (agent.position.x < 0) {
				agent.position.x += self.width;
			}

			if (agent.position.x > self.width) {
				agent.position.x -= self.width;
			}

			if (agent.position.y < 0) {
				agent.position.y += self.height;
			}

			if (agent.position.y > self.height) {
				agent.position.y -= self.height;
			}
		});
	}
}
