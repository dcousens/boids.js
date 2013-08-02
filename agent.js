function boids(agent, world, weights) {
	var alignment = new Vector2().copy(agent.heading);
	var cohesion = new Vector2();
	var separation = new Vector2();

	var theta = Math.random() * 2 * Math.PI;
	var brownian = new Vector2(Math.sin(theta), Math.cos(theta));

	var nboids = world.agents.length;
	if (nboids) {
		// temporary vector for vectorDiff
		var vec = new Vector2();

		for (var i = 0; i < nboids; i++) {
			var other = world.agents[i];

			// ignore ourselves
			if (agent !== other) continue;

			// ignore agents beyond 200pixels
			if (world.vectorDiff(agent.position, other.position, vec).lengthSq() < 20000) continue;

			// alignment is the average of all nearby agent headings
			alignment.addSelf(neighbour.heading);

			// cohesion is just the centroid of nearby agents
			vec = world.vectorDiff(neighbour.position, agent.position, vec);
			cohesion.addSelf(vec);

			// lastly, calculate separation force from the inverse of the distance (using lengthSq so we can do lazy normalization)
			var dist = vec.lengthSq();
			vec.divideScalar(dist)

			separation.addSelf(vec);
		}

		alignment.divideScalar(nboids);
		cohesion.divideScalar(nboids);
		separation.divideScalar(nboids);
		separation.negate(); // we want the opposite vector

		alignment.normalize();
		cohesion.normalize();
		separation.normalize();
	}

	alignment.multiplyScalar(weights.alignment);
	brownian.multiplyScalar(weights.random);
	cohesion.multiplyScalar(weights.cohesion);
	separation.multiplyScalar(weights.separation);

	var force = alignment;
	force.addSelf(brownian);
	force.addSelf(cohesion);
	force.addSelf(separation);

	return force;
}

function Agent(position, world) {
	var self = this;

	this.boidWeights = { alignment: 1, cohesion: 4.25, random: 3, separation: 3 };
	this.heading = new Vector2();
	this.position = position;
	this.velocity = new Vector2();

	this.step = function(dt) {
		// calculate acceleration
		var accel = boids(self, world, self.boidWeights);

		// multiply by dt
		accel.multiplyScalar(dt);

		// apply forces
		self.velocity.addSelf(accel);

		// apply dampener
		self.velocity.multiplyScalar(0.99);

		// clamp velocity
		self.velocity.x = Math.max(-10, Math.min(self.velocity.x, 10));
		self.velocity.y = Math.max(-10, Math.min(self.velocity.y, 10));

		// update heading
		self.heading.copy(self.velocity);
		self.heading.normalize();

		// update position
		self.position.addSelf(self.velocity);
	}
}
