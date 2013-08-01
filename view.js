function TwoView(domElement, model) {
       // https://gist.github.com/jonobr1/4660204
	var hasWebGL = (function() {
		try {
			return !!window.WebGLRenderingContext && !!(document.createElement('canvas').getContext('webgl') || document.createElement('canvas').getContext('experimental-webgl'));
		} catch(e) {
			return false;
		}
	})();

	var self = this;
	var two = new Two({ autostart: true, fullscreen: true, type: hasWebGL ? Two.Types.webgl : Two.Types.svg }).appendTo(domElement);

	// a basic box for Agents will do
	var agentVerts = [
		new Two.Vector(0, 0),
		new Two.Vector(10, 0),
		new Two.Vector(10, 10),
		new Two.Vector(0, 10)
	];

	// model bindings
	model.on('spawn', function(agent) {
		agent.__2vi = new Two.Polygon(agentVerts, true, false);
		agent.__2vi.fill = '#FF8000';
		agent.__2vi.stroke = 'orangered';
		agent.__2vi.linewidth = 2;
		agent.__2vi.scale = 1; // TODO: scale based on screensize?
		agent.__2vi.translation.copy(agent.position);

		two.add(agent.__2vi);
	});
	model.on('despawn', function(agent) { two.remove(agent.__2vi); });
	model.on('step', function(dt) {
		_.each(model.world.agents, function(agent) {
			agent.__2vi.translation.copy(agent.position);
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
