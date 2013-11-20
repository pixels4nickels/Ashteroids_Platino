var MotionControlSystem = require('lib/ash/ash').System.extend({

    constructor: function (game) {
	    return this;
    },

    addToEngine: function (engine) {
        this.spaceships = engine.getNodeList(require('game/nodes/spaceshipmotion'));
        this.nodeList = engine.getNodeList(require('game/nodes/motioncontrol'));
    },

    removeFromEngine: function (engine) {
        this.nodeList = null;
    },

    update: function (time) {
	    if(this.spaceships.head){
		    var spaceship = this.spaceships.head;
		    for(var node = this.nodeList.head; node; node = node.next) { // go through the ui control entities
			    var control = node.control,
				    position = node.position,
				    motion = node.motion,
				    pad = node.pad;
			    if (pad.active) {
				    Ti.API.info("MotionControlSystem.update:"+spaceship.position.rotation);
				    if(pad.type == "LEFT"){
					    spaceship.position.rotation -= control.rotationRate * time;
					    if(spaceship.position.rotation <= 0){
						    spaceship.position.rotation += 360;
					    }

				    }
				    else if(pad.type == "RIGHT"){
					    spaceship.position.rotation += control.rotationRate * time;
					    if(spaceship.position.rotation >= 360){
						    spaceship.position.rotation -= 360;
					    }
				    }
				    else if(pad.type == "ACCEL"){
					    var r = spaceship.position.rotation * Math.PI / 180.0;
					    spaceship.motion.velocity.x += Math.cos(r) * control.accelerationRate * time;
					    spaceship.motion.velocity.y += Math.sin(r) * control.accelerationRate * time;
				    }
				}else{
				    control.active = false;
			    }
		    }
		}
	}

});

module.exports = MotionControlSystem;

