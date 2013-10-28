var BehaviorTree = require("../ref");

/*
Node Structure
{
	"type" : "sl|sq|pa|co|lo|if",
	"node" : "Custom|Array|Object",
	"cond" : {},
	"opts" : {},
}
Condition Structure
{
	"type" : "not|and|or|true|false",
	"node" : "Custom|Array|Object"
}
*/

/**
 * BehaviorTree Map
 * {key} is type
 * {value} is class
 */
var Class = {
	"sl" : BehaviorTree.Select,
	"sq" : BehaviorTree.Sequence,
	"pa" : BehaviorTree.Parallel,
	"co" : BehaviorTree.Condition,
	"lo" : BehaviorTree.Loop,
	"if" : BehaviorTree.If,

	"not"   : BehaviorTree.Not,
	"and"   : BehaviorTree.And,
	"or"    : BehaviorTree.Or,
	"true"  : BehaviorTree.True,
	"false" : BehaviorTree.False
};

/**
 * Parser Map
 * {key} is type
 * {value} is parse function
 */
var Parser = {};

/**
 * Select, Sequence, Parallel node parser
 */
Parser["sl"] = Parser["sq"] = Parser["pa"] = function (cls, data, factory)
{
	var node = new cls( data.opts );

	for (var i = 0, n = data.node.length; i < n; ++i)
	{
		node.addChild( parse( data.node, factory ) );
	}

	return node;
};

/**
 * Condition, Loop, If node parser
 */
Parser["co"] = Parser["lo"] = Parser["if"] = function (cls, data, factory)
{
	var opts = {
		cond : parse( data.cond, factory ),
		action : parse( data.node, factory ),
	};

	var node = new cls( opts );

	return node;
};

/**
 * True, False condition parser
 */
Parser["true"] = Parser["false"] = function (cls, data, factory)
{
	return new cls();
};

/**
 * Not condition parser
 */
Parser["not"] = function (cls, data, factory)
{
	return new cls( parse(data.cond, factory) );
};

/**
 * And, Or condition parser
 */
Parser["and"] = Parser["or"] = function (cls, data, factory)
{
	return New( cls, data.cond, factory );
};

/**
 * parse json
 * @param  {Object} data    json config
 * @param  {Function} factory custom node/condition generator
 * @return {bt}
 */
function parse(data, factory)
{
	var type = data.type.toLowerCase();

	var fn = Parser[ type ];

	if (fn)
	{
		return fn( Class[type], data, factory );
	}

	return factory.create( data.node );
}

/**
 * Helper
 * @param {Class} clazz
 * @param {Array} a, parameters
 * @return {Object} instance of class
 */
function New(clazz, a)
{
	if (! a)
		throw new Error("invalid arguments");

	switch(a.length)
	{
		case 0 : return new clazz();
		case 1 : return new clazz( a[0] );
		case 2 : return new clazz( a[0], a[1] );
		case 3 : return new clazz( a[0], a[1], a[2] );
		case 4 : return new clazz( a[0], a[1], a[2], a[3] );
		case 5 : return new clazz( a[0], a[1], a[2], a[3], a[4] );
		default : throw new Error("more arguments than 5");
	}
}
