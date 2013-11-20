var GunControlSystem = require('lib/ash/ash').System.extend({
    creator: null,
    nodeList: null,

    constructor : function (creator) {
        this.creator = creator;
	    return this;
    },

    addToEngine: function (engine) {
        this.gunNodes = engine.getNodeList(require('game/nodes/guncontrol'));
	    this.controlPads = engine.getNodeList(require('game/nodes/inputcontrol'));
    },

    removeFromEngine: function (engine) {
	    this.gunNodes = null;
	    this.controlPads = null;
    },

    update: function (time) {
	    if(this.gunNodes.head){
		    var spaceship = this.gunNodes.head;
		    var position = spaceship.position,
			    gun = spaceship.gun;
		    for(var controlPad = this.controlPads.head; controlPad; controlPad = controlPad.next) {
			    if(controlPad.pad.type == "SHOOT"){
				    gun.shooting = controlPad.pad.active;
				    break;
			    }
		    }
		    gun.timeSinceLastShot += time;
		    if (gun.shooting && gun.timeSinceLastShot >= gun.minimumShotInterval) {
			    this.creator.createUserBullet(gun, position);
			    gun.timeSinceLastShot = 0;
		    }
	    }

    }
});

module.exports = GunControlSystem;

