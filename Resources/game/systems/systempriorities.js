var SystemPriorities = function(){
    this.preUpdate = 1;
    this.input = 2;
	this.update = 3;
	this.move = 4;
	this.resolveCollisions = 5;
	this.render = 6;
	return this;
};
module.exports = SystemPriorities;
