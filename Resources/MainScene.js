
var platino = require('co.lanica.platino');

var MainScene = function(window, game) {
	var scene = platino.createScene();
	var width = 0;
	var height = 0;
	var engine = null;
	var previousTime = 0;
	var SystemPriorities = null;
	var Signal = require('lib/ash/ash').Signals.Signal;
	var touchSignal = new Signal();

	var onSceneActivated = function(e) {
		SystemPriorities = require('game/systems/systempriorities');
		var EntityCreator = require('game/entitycreator');
		var GameManager = require('game/systems/gamemanager');
		var GameState = require('game/components/gamestate');
		var CollisionSystem = require('game/systems/collisionsystem');
		var MovementSystem = require('game/systems/movementsystem');
		var RenderSystem = require('game/systems/rendersystem');
		var BulletAgeSystem = require('game/systems/bulletagesystem');
		var MotionControlSystem = require('game/systems/motioncontrolsystem');
		var GunControlSystem = require('game/systems/guncontrolsystem');
		var InputSystem = require('game/systems/inputsystem');
		var Engine = require('lib/ash/ash').Engine;

		width = game.screen.width;
		height = game.screen.height;

		engine = new Engine();

		var gameState = new GameState(
			width,
			height
		);
		var creator = new EntityCreator(engine, scene, gameState);

		var gameManager = new GameManager(
			gameState,
			creator
		);

		engine.addSystem(
			gameManager,
			SystemPriorities.preUpdate
		);
		engine.addSystem(
			new InputSystem(touchSignal),
			SystemPriorities.input
		);
		engine.addSystem(
			new MotionControlSystem(game),
			SystemPriorities.update
		);
		engine.addSystem(
			new GunControlSystem(creator    ),
			SystemPriorities.update
		);
		engine.addSystem(
			new BulletAgeSystem(creator),
			SystemPriorities.update
		);
		engine.addSystem(
			new MovementSystem(gameState),
			SystemPriorities.move
		);
		engine.addSystem(
			new CollisionSystem(creator),
			SystemPriorities.resolveCollisions
		);
		engine.addSystem(
			new RenderSystem(scene),
			SystemPriorities.render
		);

		game.enableOnDrawFrameEvent = true;
		game.addEventListener("enterframe", handleFrame);
		game.addEventListener('touchstart', onTouch);
		game.addEventListener('touchend', onTouch);
		game.addEventListener('touchmove', onTouch);

		game.startCurrentScene();
	};

	var onSceneDeactivated = function(e) {
		game.enableOnDrawFrameEvent = false;
		game.removeEventListener("enterframe", handleFrame);
		game.removeEventListener('touchstart', onTouch);
		game.removeEventListener('touchend', onTouch);
		game.removeEventListener('touchmove', onTouch);
	};


	function onTouch(event) {
		event.x *= game.touchScaleX;
		event.y *= game.touchScaleY;
		touchSignal.dispatch(event);
	}


	var handleFrame = function(e) {
		timestamp = Date.now();
		var tmp = previousTime || timestamp;
		previousTime = timestamp;
		var delta = (timestamp - tmp) * 0.001;
		if(engine)
		{
			engine.update(delta);
		}else{
			Ti.API.info("MainScene.handleFrame:no engine!!!");
		}
	};

	scene.addEventListener('activated', onSceneActivated);
	scene.addEventListener('deactivated', onSceneDeactivated);
	return scene;
};

module.exports = MainScene;