var BulletAgeSystem = require('lib/ash/ash').System.extend({
    creator: null,
    nodeList: null,

    constructor: function (creator) {
        this.creator = creator;
	    return this;
    },

    addToEngine: function (engine) {
        this.nodeList = engine.getNodeList( require('game/nodes/bulletage') );
    },

    removeFromEngine: function (engine) {
        this.nodeList = null;
    },

    update: function (time) {
        for (var node = this.nodeList.head; node; node = node.next) {
            this.updateNode(node, time);
        }
    },

    updateNode: function (node, time) {
        var bullet = node.bullet;
        bullet.lifeRemaining -= time;
        if (bullet.lifeRemaining <= 0) {
	        this.creator.returnBulletToPool(node.display);
            this.creator.destroyEntity(node.entity);
        }
    }
});

module.exports = BulletAgeSystem;

