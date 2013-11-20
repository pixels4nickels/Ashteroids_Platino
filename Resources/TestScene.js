
var platino = require('co.lanica.platino');

var TestScene = function(window, game) {
	var scene = platino.createScene();
	var width = 0;
	var height = 0;
	var signals = require('lib/ash/ash').Signals;
	var testSignal = new signals.Signal();
	var TestSystem = require('TestSystem');
	var testSystem = new TestSystem(testSignal);


	function doTouch(event) {
		Ti.API.info("TestScene.doTouch:event source-> " + event.source);
		testSignal.dispatch(event);
		Ti.API.info("TestScene.doTouch:this-> " +this);
	}

	function onTouchStart(event) {
		testSignal.dispatch(event);
		//doTouch(event);
		Ti.API.info("TestScene.onTouchStart:this-> " +this);
	}


	var onSceneActivated = function(e) {

		//testSignal.dispatch(e);


		width = game.screen.width;
		height = game.screen.height;

		var padLeftSprite = platino.createSprite({
			image: 'graphics/accelpad.png',
			width: 50,
			height: 50,
			anchorPoint:{
				x:0.5,
				y:0.5
			},
			center:{
				x:160,
				y:0
			}
		});
		scene.add(padLeftSprite);
		game.startCurrentScene();
		game.enableOnDrawFrameEvent = false;
//		game.addEventListener("enterframe", handleFrame);
		game.addEventListener('touchstart', onTouchStart);
//			game.addEventListener('touchend', onTouchEnd);

		//game.addEventListener('touchmove', onTouchMove);
	};

	var onSceneDeactivated = function(e) {
		game.enableOnDrawFrameEvent = false;
		//game.removeEventListener("enterframe", handleFrame);
		game.removeEventListener('touchstart', onTouchStart);
		//game.removeEventListener('touchend', onTouchEnd);
		//game.removeEventListener('touchmove', onTouchMove);
	};


	scene.addEventListener('activated', onSceneActivated);
	scene.addEventListener('deactivated', onSceneDeactivated);
	return scene;
};

module.exports = TestScene;