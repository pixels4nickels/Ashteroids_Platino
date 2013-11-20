var RenderSystem = require('lib/ash/ash').System.extend({
	scene: null,
    nodes: null,

    constructor: function (scene) {
        this.scene = scene;
        return this;
    },

    addToEngine: function (engine) {
        this.nodes = engine.getNodeList(require('game/nodes/render'));
        for(var node = this.nodes.head; node; node = node.next) {
            this.addToDisplay(node);
        }
        this.nodes.nodeAdded.add(this.addToDisplay, this);
        this.nodes.nodeRemoved.add(this.removeFromDisplay, this);
    },

    removeFromEngine: function (engine) {
        this.nodes = null;
    },

    addToDisplay: function (node) {
	   //Ti.API.info("RenderSystem.addToDisplay:"+node.display.view);
	    this.scene.add(node.display.view);
    },

    removeFromDisplay: function (node) {

	    this.scene.remove(node.display.view);
    },

    update: function (time) {
        var node,
            position,
            display,
            view;

        for (node = this.nodes.head; node; node = node.next) {
            display = node.display;
            view = display.view;
            position = node.position;
	        view.x = position.position.x; //* view.anchorPoint.x;
	        view.y = position.position.y; //* view.anchorPoint.y;
	        view.angle = position.rotation;
        }
    }
});

module.exports = RenderSystem;

