var should = require('should');
var bt = require('../../');

var NumGT = function (num)
{
	this._num = num;
};
NumGT.prototype.evaluate = function(blackboard)
{
	return blackboard.num > this._num;
};

var NumLT = function (num)
{
	this._num = num;
};
NumLT.prototype.evaluate = function(blackboard)
{
	return blackboard.num < this._num;
};


describe('Not Test', function() {
	it('should return true', function () {

		var blackboard = {
			num : 2
		};

		var cond = new bt.Condition({
			cond : new bt.Not( new NumGT(5) )
		});

		var res = cond.doAction( blackboard );

		res.should.equal(bt.RES_SUCCESS);
	});
});
describe('And Test', function() {
	it('should return true', function () {

		var blackboard = {
			num : 6
		};

		var cond = new bt.Condition({
			cond : new bt.And( new NumGT(5), new NumLT(8) )
		});

		var res = cond.doAction( blackboard );

		res.should.equal(bt.RES_SUCCESS);
	});
});
describe('Or Test', function() {
	it('should return true', function () {

		var blackboard = {
			num : 2
		};

		var cond = new bt.Condition({
			cond : new bt.Or( new NumGT(5), new NumLT(3) )
		});

		var res = cond.doAction( blackboard );

		res.should.equal(bt.RES_SUCCESS);
	});
});
describe('True Test', function() {
	it('should return true', function () {

		var blackboard = {
			num : 2
		};

		var cond = new bt.Condition({
			cond : new bt.True( new NumGT(5) )
		});

		var res = cond.doAction( blackboard );

		res.should.equal(bt.RES_SUCCESS);
	});
});
describe('False Test', function() {
	it('should return false', function () {

		var blackboard = {
			num : 99
		};

		var cond = new bt.Condition({
			cond : new bt.False( new NumGT(5) )
		});

		var res = cond.doAction( blackboard );

		res.should.equal(bt.RES_FAIL);
	});
});