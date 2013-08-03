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
			if (agent === other) continue;

			// ignore agents beyond 200pixels
			if (world.vectorDiff(agent.position, other.position, vec).lengthSq() > 20000) continue;

			// alignment is the average of all nearby agent headings
			alignment.addSelf(other.heading);

			// cohesion is just the centroid of nearby agents
			vec = world.vectorDiff(other.position, agent.position, vec);
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
	force.normalize();

	return force;
}

function Agent(position, world) {
	var self = this;

	this.boidWeights = { alignment: 1, cohesion: 4, random: 3, separation: 3.6 };
	this.heading = new Vector2();
	this.maxspeed = 100;
	this.position = position;
	this.speed = 10;
	this.velocity = new Vector2();

	this.step = function(dt) {
		// calculate acceleration
		var accel = boids(self, world, self.boidWeights);
		accel.multiplyScalar(self.speed);

		// apply forces
		self.velocity.addSelf(accel);

		// apply dampener
		self.velocity.multiplyScalar(0.995);

		// clamp velocity
		self.velocity.x = Math.max(-self.maxspeed, Math.min(self.velocity.x, self.maxspeed));
		self.velocity.y = Math.max(-self.maxspeed, Math.min(self.velocity.y, self.maxspeed));

		// update heading
		self.heading.copy(self.velocity);
		self.heading.normalize();

		// multiply by dt
		var dv = new Two.Vector().copy(self.velocity);
		dv.multiplyScalar(dt);

		// update position
		self.position.addSelf(dv);
	}
}
