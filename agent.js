function boids(agent, neighbours, world, weights) {
	var alignment = new Two.Vector().copy(agent.heading);
	var cohesion = new Two.Vector();
	var separation = new Two.Vector();

	if (neighbours.length) {
		var vector = new Two.Vector();

		_.each(neighbours, function(neighbour) {
			// alignment is the average of all neighbouring headings
			alignment.addSelf(neighbour.heading);

			// cohesion is just the centroid of all neighbours
			vector = world.offset(neighbour.position, agent.position, vector);
			cohesion.addSelf(vector);

			// influence by inverse of the distance (squared for normalization)
			var dist = vector.lengthSquared();
			vector.divideScalar(dist)

			separation.addSelf(vector);
		});

		alignment.divideScalar(neighbours.length);
		cohesion.divideScalar(neighbours.length);
		separation.divideScalar(neighbours.length);
		separation.negate(); // we want the vector AWAY, not towards

		alignment.normalize();
		cohesion.normalize();
		separation.normalize();
	}

	alignment.multiplyScalar(weights.alignment);
	cohesion.multiplyScalar(weights.cohesion);
	separation.multiplyScalar(weights.separation);

	var force = alignment;
	force.addSelf(cohesion);
	force.addSelf(separation);

	return force;
}

function randomWalk(agent) {
	var theta = Math.random() * 2 * Math.PI;

	return new Two.Vector(Math.sin(theta), Math.cos(theta));
}

function Agent(position, world) {
	var self = this;

	this.boidWeights = { alignment: 1, cohesion: 4, random: 3, separation: 3 };
	this.heading = new Two.Vector();
	this.position = position;
	this.velocity = new Two.Vector();

	this.step = function(dt) {
		// only agents within 200pixels are neighbours
		var neighbours = _.filter(world.agents, function(agent) {
			return (self !== agent)	&& (world.offset(self.position, agent.position).lengthSquared() < 20000);
		});

		// calculate acceleration forces
		var fboids = boids(self, neighbours, world, self.boidWeights);
		var frandom = randomWalk(self).multiplyScalar(self.boidWeights.random);

		var accel = fboids;
		accel.addSelf(frandom);

		// multiply by dt
		accel.multiplyScalar(dt);

		// apply forces
		self.velocity.addSelf(accel);

		// apply dampener
		self.velocity.multiplyScalar(0.995);

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
