function boids(agent, neighbours, world, weights) {
	var alignment = new Vector2().copy(agent.heading);
	var cohesion = new Vector2();
	var separation = new Vector2();

	var theta = Math.random() * 2 * Math.PI;
	var brownian = new Vector2(Math.sin(theta), Math.cos(theta));

	if (neighbours.length) {
		var vec = new Vector2();

		_.each(neighbours, function(neighbour) {
			// alignment is the average of all neighbouring headings
			alignment.addSelf(neighbour.heading);

			// cohesion is just the centroid of all neighbours
			vec = world.vectorDiff(neighbour.position, agent.position, vec);
			cohesion.addSelf(vec);

			// influence by inverse of the distance (squared for normalization)
			var dist = vec.lengthSq();
			vec.divideScalar(dist)

			separation.addSelf(vec);
		});

		alignment.divideScalar(neighbours.length);
		cohesion.divideScalar(neighbours.length);
		separation.divideScalar(neighbours.length);
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
		// temporary vector for vectorDiff
		var vec = new Vector2();

		// only agents within 200pixels are neighbours
		var neighbours = _.filter(world.agents, function(agent) {
			return (self !== agent)	&& (world.vectorDiff(self.position, agent.position, vec).lengthSq() < 20000);
		});

		// calculate acceleration
		var accel = boids(self, neighbours, world, self.boidWeights);

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
