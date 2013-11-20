var Motion = require('lib/ash/ash').Class.extend({
    constructor: function (velocityX, velocityY, angularVelocity, damping) {
	    var Point = require('lib/ash/ash').Point;
        this.velocity = new Point(velocityX, velocityY);
        this.angularVelocity = angularVelocity;
        this.damping = damping;
	    return this;
    }
});

module.exports = Motion;

