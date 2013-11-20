var MotionControl = require('lib/ash/ash').Node.create({
    pad : require('game/components/controlpad'),
    control : require('game/components/motioncontrols'),
    position : require('game/components/position'),
    display : require('game/components/display')
});

module.exports = MotionControl;
