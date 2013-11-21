var Gun = require('lib/ash/ash').Class.extend({
    constructor: function (offsetX, offsetY, minimumShotInterval, bulletLifetime) {
        var Point = require('lib/ash/ash').Point;
        this.shooting = false;
         this.timeSinceLastShot = 0;
        this.offsetFromParent = new Point(offsetX, offsetY);
        this.minimumShotInterval = minimumShotInterval;
        this.bulletLifetime = bulletLifetime;
	    return this;
    }
});

module.exports = Gun;
