var platino = require('co.lanica.platino');

(function()
{
	var ApplicationWindow = function()
	{
		var window = Ti.UI.createWindow({
			backgroundColor: 'black',
			orientationModes: [Ti.UI.PORTRAIT, Ti.UI.UPSIDE_PORTRAIT], //others: Ti.UI.LANDSCAPE_LEFT, Ti.UI.LANDSCAPE_RIGHT
			fullscreen: true,
			navBarHidden: true
		});

		var game = platino.createGameView();
		game.fps = 30;
		game.color(0, 0, 0);
		game.debug = false; // disables debug logs (not to be used for production)

		var screenHeight = Ti.Platform.displayCaps.platformHeight;
		if (screenHeight >= 568) {
			screenHeight = 568;
		} else {
			screenHeight = 480;
		}

		game.TARGET_SCREEN = {
			width: 320,
			height: screenHeight,
			density: Ti.Platform.displayCaps.density
		}

		game.touchScaleX = 1;
		game.touchScaleY = 1;



		// Loads MainScene.js as starting point to the app
		game.addEventListener('onload', function(e) {
			// set screen size for your game (TARGET_SCREEN size)
			var screenScale = game.size.height / game.TARGET_SCREEN.height;
			game.screen = {width:game.size.width / screenScale, height:game.size.height / screenScale};

			// Your game screen size is set here if you did not specifiy game width and height using screen property.
			// Note: game.size.width and height may be changed due to the parent layout so check them here.
			Ti.API.info("view size: " + game.size.width + "x" + game.size.height);
			Ti.API.info("game screen size: " + game.screen.width + "x" + game.screen.height);

			game.touchScaleX = game.screen.width  / game.size.width;
			game.touchScaleY = game.screen.height / game.size.height;

			game.screenScale = game.screen.height / game.TARGET_SCREEN.height;
			game.screenScaleX = game.screen.width / game.TARGET_SCREEN.width;
			var MainScene  = require("MainScene");
			game.currentScene = new MainScene(window, game);

			// push loading scene and start the game
			game.pushScene(game.currentScene);
			game.start();
		});

		game.addEventListener('onsurfacechanged', function(e) {
			game.orientation = e.orientation;

		});

		// Convenience function to convert Titanium coordinate from a Platino coordinate
		game.getTiScale = function(x, y) {
			return {
				x: (x / game.touchScaleX),
				y:(y / game.touchScaleY) }
		}

		// Free up game resources when window is closed
		window.addEventListener('close', function(e) {
			game = null;
		});

		window.add(game);
		return window;
	};

	module.exports = ApplicationWindow;
})();