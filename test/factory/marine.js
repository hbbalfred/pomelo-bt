var bt = require('../../');

var A_Walk = function ()
{
	bt.Node.call(this);
};
utils.inherits(A_Walk, bt.Node);
A_Walk.prototype.doAction = function(bb)
{
	return bt.RES_WAIT;
};


var A_Beep = function ()
{
	bt.Node.call(this);
};
utils.inherits(A_Beep, bt.Node);
A_Beep.prototype.doAction = function(bb)
{
	return bt.RES_SUCCESS;
};


var A_MoveToTarget = function ()
{
	bt.Node.call(this);
	this._step = 0;
};
utils.inherits(A_MoveToTarget, bt.Node);
A_MoveToTarget.prototype.doAction = function(bb)
{
	++this._step;
	if (this._step === 2)
	{
		this._step = 0;
		return bt.RES_SUCCESS;
	}
	return bt.RES_WAIT;
};


var A_LookAround = function ()
{
	bt.Node.call(this);
	this._step = 0;
};
utils.inherits(A_LookAround, bt.Node);
A_LookAround.prototype.doAction = function(bb)
{
	++this._step;
	if (this._step === 3)
	{
		this._step = 0;
		return bt.RES_SUCCESS;
	}
	return bt.RES_WAIT;
};


var A_Smooking = function ()
{
	bt.Node.call(this);
};
utils.inherits(A_Smooking, bt.Node);
A_Smooking.prototype.doAction = function(bb)
{
	return bt.RES_WAIT;
};


var A_Cough = function ()
{
	bt.Node.call(this);
	this._times = 0;
};
utils.inherits(A_Cough, bt.Node);
A_Cough.prototype.doAction = function(bb)
{
	if (++this._times === 2)
	{
		this._times = 0;
		return bt.RES_SUCCESS;
	}
	return bt.RES_WAIT;
};


var C_HasBeep = function ()
{
};
C_HasBeep.prototype.evaluate = function(bb)
{
	return bb.beep > 0;
};


var C_IsBeepChanged : function ()
{
	return bb.beep
};
C_IsBeepChanged.prototype.evaluate = function(bb)
{
	return bb.beep > 0;
};


var C_IsChoke = function ()
{
	bt.Node.call(this, opts);
};
C_IsChoke.prototype.evaluate = function(bb)
{
	return bb.beep > 0;
};


var C_IsBeepChanged = function ()
{
	return bb.curBeep !== bb.beep;
};
C_IsBeepChanged.prototype.evaluate = function(bb)
{
	return bb.beep > 0;
};


var Map = {
	"A_Walk" : A_Walk
,	"A_Beep" : A_Beep
,	"A_MoveToTarget" : A_MoveToTarget
,	"A_LookAround" : A_LookAround
,	"A_Smooking" : A_Smooking
,	"A_Cough" : A_Cough
,	"C_HasBeep" : C_HasBeep
,	"C_IsBeepChanged" : C_IsBeepChanged
,	"C_IsChoke" : C_IsChoke
,	"C_IsBeepChanged" : C_IsBeepChanged
};

var blackboard = {
	beep : 0,
	curBeep : 0,
};


var cough = new bt.If({
	cond : C_IsChoke,
	action : new A_Cough(),
});
var smooking = new bt.SequenceNode();
smooking.addChild( cough );
smooking.addChild( new A_Smooking() );

var walk = new bt.ParallelNode();
walk.addChild( new A_Walk() );
walk.addChild( smooking );
var patrol = new bt.ConditionNode({
	cond : Not(C_HasBeep),
	action : walk
});


var move = new bt.SequenceNode();
move.addChild( new A_MoveToTarget() );
move.addChild( new A_LookAround() );
var alert = new bt.ConditionNode({
	cond : Not(C_IsBeepChanged),
	action : move
});

var loop = new bt.Loop({
	cond : C_HasBeep,
	action : alert
});


var marine = new bt.Select();
marine.addChild( patrol );
marine.addChild( alert );
