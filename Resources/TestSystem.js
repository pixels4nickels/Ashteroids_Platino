var TestSystem = require('lib/ash/ash').System.extend({
	isTouching: "me", /* System */
	constructor: function (trigger) {
		trigger.add(this.handeTrigger, this);
		Ti.API.info("TestSystem.constructor:trigger-> " + trigger);
	},

	handeTrigger: function (event) {
		Ti.API.info("TestSystem.handleTrigger:this-> " + this.isTouching);
		Ti.API.info("TestSystem.handleTrigger:x-> " + event.x);
		Ti.API.info("TestSystem.handleTrigger:y-> " + event.y);
	}
});
module.exports = TestSystem;