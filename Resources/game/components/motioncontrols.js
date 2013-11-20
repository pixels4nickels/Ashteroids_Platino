var MotionControls =  require('lib/ash/ash').Class.extend({
    constructor: function (accelerationRate, rotationRate) {
        this.active = false;
        this.accelerationRate = accelerationRate;
        this.rotationRate = rotationRate;
	    return this;
    }
});

module.exports = MotionControls;
