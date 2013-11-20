var GunControl = require('lib/ash/ash').Node.create({
    gun : require('game/components/gun'),
    position : require('game/components/position')
});

module.exports = GunControl;

