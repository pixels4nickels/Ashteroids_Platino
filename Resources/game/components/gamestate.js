var GameState = require('lib/ash/ash').Class.extend({
    constructor: function (width, height) {
        this.lives = 0;
        this.level = 0;
        this.points = 0;
        this.width = width;
        this.height = height;
	    Ti.API.info("GameState.constructor:done");
	    return this;
    }
});
module.exports = GameState;
