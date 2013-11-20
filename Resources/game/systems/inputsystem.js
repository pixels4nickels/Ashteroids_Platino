var InputSystem = require('lib/ash/ash').System.extend({

    constructor: function (touchSignal) {
	    this.touchEvent = null;
	    touchSignal.add(this.handleTouch, this);
	    return this;
    },

	handleTouch: function (event) {
		if(event.type == "touchstart" || event.type == "touchmove"){
			this.touchEvent = event;
		}
		if(event.type == "touchend"){
			this.touchEvent = null;
		}
	},

    addToEngine: function (engine) {
        this.nodeList = engine.getNodeList(require('game/nodes/inputcontrol'));
    },

    removeFromEngine: function (engine) {
        this.nodeList = null;
    },

    update: function (time) {
	    if(this.touchEvent){
		    for(var node = this.nodeList.head; node; node = node.next) { // go through the ui control entities
			    if (node.display.view.contains(this.touchEvent.x, this.touchEvent.y)) {
				    node.pad.active = true;
					//Ti.API.info("InputSystem.update:touched: " + padType);
				}else{
				    node.pad.active = false;
			    }
		    }
		}else{
		    for(var node = this.nodeList.head; node; node = node.next) {
			    node.pad.active = false;
		    }
	    }
	}
});

module.exports = InputSystem;

