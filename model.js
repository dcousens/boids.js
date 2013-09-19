function randomPos(w, h) {
	return new Two.Vector(Math.random() * w, Math.random() * h);
}

function Model(world) {
	var self = this;
	this.world = world;

	this.despawn = function() {
		var agent = self.world.agents.pop();

		self.publish('despawn', agent);
	}

	this.spawn = function() {
		var position = randomPos(self.world.width, self.world.height);
		var agent = new Agent(position, self.world);

		self.world.agents.push(agent);
		self.publish('spawn', agent);
	}

	this.step = function(dt) {
		self.world.step(dt);

		self.world.agents.forEach(function(agent) {
			agent.step(dt);
		});

		self.publish('step', dt);
	}

	// pub/sub mechanism
	Mediator(this);
}
