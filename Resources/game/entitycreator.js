var ash = require('lib/ash/ash');
var platino = require('co.lanica.platino');
var EntityCreator = ash.Class.extend({
	engine: null,
	scene:null,
	constructor: function (engine, scene, gameState) {
		this.engine = engine;
		this.gameState = gameState;
		this.scene = scene;
		this.initializeBulletPool(scene,30);
		Ti.API.info("EntityCreator.constructor:done");
		return this;
	},

	createControls: function() {
		var padLeftSprite = platino.createSprite({
			image: 'graphics/leftpad.png',
			width: 50,
			height: 50,
		    anchorPoint:{
				x:0.5,
				y:0.5
		    }
		});
		//padLeftSprite.scale(0.5, 0.5);
		padLeftSprite.tag = "LEFT";

		var padRightSprite = platino.createSprite({
			image: 'graphics/rightpad.png',
			width: 50,
			height: 50,
			anchorPoint:{
				x:0.5,
				y:0.5
			}
		});
		//padRightSprite.scale(0.5, 0.5);
		padRightSprite.tag = "RIGHT";

		var padAccelSprite = platino.createSprite({
			image: 'graphics/accelpad.png',
			width: 50,
			height: 50,
			anchorPoint:{
				x:0.5,
				y:0.5
			}
		});
		//padAccelSprite.scale(0.5, 0.5);
		padAccelSprite.tag = "ACCEL";

		var padShootSprite = platino.createSprite({
			image: 'graphics/shootpad.png',
			width: 50,
			height: 50,
			anchorPoint:{
				x:0.5,
				y:0.5
			}
		});
		//padShootSprite.scale(0.5, 0.5);
		padShootSprite.tag = "SHOOT";

		var ControlPad = require('game/components/controlpad');
		var Position = require('game/components/position');
		var GunControls = require('game/components/motion');
		var MotionControls = require('game/components/motioncontrols');
		var Display = require('game/components/display');


		var movePadLeftEntity = new ash.Entity()
			.add(new ControlPad(padLeftSprite.tag))
			.add(new Position(0, 0, 0, 0))
			.add(new MotionControls(0, 80))
			.add(new Display(padLeftSprite));
		this.engine.addEntity(movePadLeftEntity);

		var movePadRightEntity = new ash.Entity()
			.add(new ControlPad(padRightSprite.tag))
			.add(new Position(50, 0, 0, 0))
			.add(new MotionControls(0, 80))
			.add(new Display(padRightSprite));
		this.engine.addEntity(movePadRightEntity);

		var accelPadEntity = new ash.Entity()
			.add(new ControlPad(padAccelSprite.tag))
			.add(new Position(100, 0, 0, 0))
			.add(new MotionControls(140, 0))
			.add(new Display(padAccelSprite));
		this.engine.addEntity(accelPadEntity);

		var shootPadEntity = new ash.Entity()
			.add(new ControlPad(padShootSprite.tag))
			.add(new Position(150, 0, 0, 0))
			.add(new Display(padShootSprite));
		this.engine.addEntity(shootPadEntity);

		return [movePadLeftEntity, movePadRightEntity, accelPadEntity];
	},

	createAsteroid: function(radius, x, y) {
		var Asteroid = require('game/components/asteroid');
		var Position = require('game/components/position');
		var Motion = require('game/components/motion');
		var Display = require('game/components/display');
		var asteroidView = platino.createSprite({
			image: 'graphics/asteroid.png',
			width: radius,
			height: radius,
			angle:Math.random()*360,
			anchorPoint:{
				x:0.5,
				y:0.5
			}
		});

		var asteroid = new ash.Entity()
			.add(new Asteroid())
			.add(new Position(x, y, 0, radius))
			.add(
				new Motion(
					(Math.random() - 0.5) * 4 * (50 - radius),
					(Math.random() - 0.5) * 4 * (50 - radius),
					Math.random() * 2 - 1,
					0
				)
			)
			.add(new Display( asteroidView ));
		this.engine.addEntity(asteroid);
		return asteroid;
	},

	createSpaceship: function() {
		var Spaceship = require('game/components/spaceship');
		var Position = require('game/components/position');
		var Motion = require('game/components/motion');
		var Display = require('game/components/display');
		var Gun = require('game/components/gun');

		var spaceshipView = platino.createSprite({
			image: 'graphics/ship.png',
			width: 30,
			height: 30,
			anchorPoint:{
				x:0.5,
				y:0.5
			}
		});
		var spaceship = new ash.Entity()
			.add(new Spaceship())
			.add(new Position(this.gameState.width*0.5, this.gameState.height*0.5, 0, 6))
			.add(new Motion(0, 0, 0, 15))
			.add(new Gun(15, 15, 0.3, 2))
			.add(new Display(spaceshipView));
		this.engine.addEntity(spaceship);
		return spaceship;
	},

	createUserBullet: function(spaceship) {
		var r = spaceship.position.rotation * Math.PI / 180.0;
		var cos = Math.cos(r);
		var sin = Math.sin(r);

		var Bullet = require('game/components/bullet');
		var Position = require('game/components/position');
		var Motion = require('game/components/motion');
		var Display = require('game/components/display');


		var bulletPosition = new Position(
			spaceship.position.position.x + spaceship.gun.offsetFromParent.x - 2.5,
			spaceship.position.position.y + spaceship.gun.offsetFromParent.y - 2.5, 0, 0);

		var bulletView =  this.getBullet();
//			platino.createSprite({
//			image: 'graphics/bullet.png',
//			width: 5,
//			height: 5,
//			center:{
//				x:bulletPosition.x,
//				y:bulletPosition.y
//			},
//			anchorPoint:{
//				x:0.5,
//				y:0.5
//			}
//		});
		var bullet;
		if(bulletView){
			bullet = new ash.Entity()
				.add(new Bullet(spaceship.gun.bulletLifetime))
				.add(bulletPosition)
				.add(new Motion(
					cos * 250 + spaceship.motion.velocity.x,
					sin * 250 + spaceship.motion.velocity.y,
					spaceship.motion.angularVelocity,
					0
				))
				.add(new Display(bulletView));
			this.engine.addEntity(bullet);
			Ti.API.info("EntityCreator.update:"+spaceship.position.rotation);
		}
		return bullet;
	},

	destroyEntity: function(entity) {
		this.engine.removeEntity(entity);
	},

	bulletObjectPool: null,
	bulletsInUseObjectPool: null,

	initializeBulletPool: function(view, num){
		var bulletNum = num?num:10;
		this.bulletObjectPool = new Array();
		this.bulletsInUseObjectPool = new Array();
		for (var i=0;i<bulletNum;i++){
			var bullet = platino.createSprite(
				{
					image:'graphics/bullet.png',
					width:5,
					height:5
				}
			);
			this.bulletObjectPool.push(bullet);
			view.add(bullet);
		}
	},

	getBullet: function(){
		var bullet = this.bulletObjectPool.pop();
		this.bulletsInUseObjectPool.push(bullet);
		Ti.API.info("AssetFactory:getBullet  AVAILABLE->" + this.bulletObjectPool.length);
		Ti.API.info("AssetFactory:getBullet     IN USE->" + this.bulletsInUseObjectPool.length);
		return bullet;
	},

	returnBulletToPool: function(item){
		var index = this.bulletsInUseObjectPool.indexOf(item);
		var bullet =  this.bulletsInUseObjectPool.splice(index, 1)[0];
		if(bullet && index > -1){
			this.bulletObjectPool.push(bullet);
			Ti.API.info("AssetFactory:returnBulletToPool AVAILABLE->" + this.bulletObjectPool.length);
			Ti.API.info("AssetFactory:returnBulletToPool    IN USE->" + this.bulletsInUseObjectPool.length);
		}else{
			Ti.API.info("AssetFactory:returnBulletToPool no item found in bulletsInUseObjectPool--------------------------------------------------!!!!!!!!!!");
		}

	}
});

module.exports = EntityCreator;

//card        888-2214299
//checking    877-767-9383
