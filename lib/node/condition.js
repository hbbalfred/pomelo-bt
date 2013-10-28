var bt = require('../bt');
var util = require('util');
var BTNode = require('./node');

/**
 * Condition node.
 *
 * @param opts {Object} 
 *        opts.cond(blackboard) {Cond} condition callback. Return true or false to decide the node return success or fail.
 * @return {Number} 
 *          bt.RES_SUCCESS if cond callback return true;
 *          bt.RES_FAIL if cond undefined or return false.
 */
var Node = function(opts) {
  BTNode.call(this);
  this.cond = opts.cond;
};
util.inherits(Node, BTNode);

module.exports = Node;

var pro = Node.prototype;

/**
 * condition node to evaluate
 * 
 * @param {Object} blackboard shared data
 *
 * @return {Number} ai.RES_SUCCESS if everything ok;
 *                  ai.RES_FAIL if any error.
 */
pro.doAction = function(blackboard) {
	if (this.cond && this.cond.evaluate(blackboard))
    return bt.RES_SUCCESS;

  return bt.RES_FAIL;
};
