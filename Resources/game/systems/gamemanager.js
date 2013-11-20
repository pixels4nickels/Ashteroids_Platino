var GameManager = require('lib/ash/ash').System.extend({
    gameState: null,
    creator: null,
    spaceships: null,
    asteroids: null,
    bullets: null,
	UIControls: null,

    constructor: function (gameState, creator){
        this.gameState = gameState;
	    this.gameState.level = 0;
	    this.gameState.lives = 3;
	    this.gameState.points = 0;
        this.creator = creator;
	    Ti.API.info("GameManager.constructor:done");
	    return this;
    },

    addToEngine: function (game) {
	    this.UIControls = game.getNodeList(require('game/nodes/motioncontrol'));
	    this.spaceships = game.getNodeList(require('game/nodes/spaceshipcollision'));
        this.asteroids = game.getNodeList(require('game/nodes/asteroidcollision'));
        this.bullets = game.getNodeList(require('game/nodes/bulletcollision'));
    },

    update: function (time) {
	    var Point = require('lib/ash/ash').Point;

        if(this.UIControls.empty()){
	        this.creator.createControls();  // add ship control entities
        }

	    if(this.spaceships.empty())
        {
            if(this.gameState.lives > 0)
            {
                var newSpaceshipPosition = new Point(this.gameState.width * 0.5, this.gameState.height * 0.5);
                var clearToAddSpaceship = true;
                for(var asteroid = this.asteroids.head; asteroid; asteroid = asteroid.next)
                {
                    if(asteroid.position.position.distanceTo(newSpaceshipPosition) <= asteroid.position.collisionRadius + 50)
                    {
                        clearToAddSpaceship = false;
                        break;
                    }
                }
                if(clearToAddSpaceship)
                {
                    this.creator.createSpaceship();
                    this.gameState.lives--;
                }
            }
            else
            {
                // game over
            }
        }

        if(this.asteroids.empty() && this.bullets.empty() && !this.spaceships.empty())
        {
            var position;

            // next level
            var spaceship = this.spaceships.head;
            this.gameState.level++;
            var asteroidCount = 2 + this.gameState.level;

            for(var i = 0; i < asteroidCount; ++i)
            {
                // check not on top of spaceship
                do
                {
                    position = new Point(
                        Math.random() * this.gameState.width,
                        Math.random() * this.gameState.height
                   );
                }
                while (position.distanceTo(spaceship.position.position) <= 80);
                this.creator.createAsteroid(30, position.x, position.y);
            }
        }
    },

    removeFromEngine: function (game) {
        this.spaceships = null;
        this.asteroids = null;
        this.bullets = null;
    }
});

module.exports = GameManager;
