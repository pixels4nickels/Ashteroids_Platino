var Bullet = require('lib/ash/ash').Class.extend({
    constructor: function (lifeTime) {
        this.lifeRemaining = lifeTime;
	    return this;
    }
});

module.exports = Bullet;

