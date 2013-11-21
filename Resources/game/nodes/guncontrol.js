var GunControl = require('lib/ash/ash').Node.create({
    gun : require('game/components/gun'),
    motion : require('game/components/motion'),
    position : require('game/components/position')
});

module.exports = GunControl;

