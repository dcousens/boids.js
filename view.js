function TwoView(domElement, model) {
	var self = this;
	var two = new Two({ autostart: true, fullscreen: true, type: Two.Types.svg }).appendTo(domElement);

	var agentVerts = [new Two.Vector(0, 0)];

	// model bindings
	model.on('despawn', function(agent) { two.remove(agent.__2vo); });
	model.on('spawn', function(agent) {
		agent.__2vo = new Two.Polygon(agentVerts, true, false);
		agent.__2vo.stroke = 'white';
		agent.__2vo.scale = 5;
		agent.__2vo.translation.copy(agent.position);

		two.add(agent.__2vo);
	});
	model.on('step', function(dt) {
		_.each(model.world.agents, function(agent) {
			agent.__2vo.translation._x = agent.position.x;
			agent.__2vo.translation._y = agent.position.y;
			agent.__2vo.translation.trigger(Two.Events.change);
		});
	});

	// view bindings
	two.bind('update', function(frame) {
		var dt = (two.timeDelta / 1000.0) || 0;

		self.publish('frame', dt);
	});

	// pub/sub mechanism
	Mediator(this);
}
