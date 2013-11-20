var SpaceshipMotion = require('lib/ash/ash').Node.create({
	spaceship : require('game/components/spaceship'),
	motion : require('game/components/motion'),
	position : require('game/components/position')
});

module.exports = SpaceshipMotion;

