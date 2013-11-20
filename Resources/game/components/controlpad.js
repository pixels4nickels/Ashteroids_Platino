var ControlPad = require('lib/ash/ash').Class.extend({
    constructor: function (type) {
	    this.type = type;
	    this.active = false;
	    return this;
    }
});

module.exports = ControlPad;

