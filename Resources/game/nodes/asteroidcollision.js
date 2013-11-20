var AsteroidCollisionNode = require('lib/ash/ash').Node.create({
    asteroid : require('game/components/asteroid'),
    position : require('game/components/position')
});

module.exports =  AsteroidCollisionNode;
