var BulletCollision = require('lib/ash/ash').Node.create({
    bullet : require('game/components/bullet'),
    position : require('game/components/position')
});

module.exports = BulletCollision;
