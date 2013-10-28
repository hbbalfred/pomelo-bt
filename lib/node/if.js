var BTNode = require('./node');
var Condition = require('./condition');
var util = require('util');
var Sequence = require('./sequence');

/**
 * If node: invoke the action if the condition is true
 * 
 * @param opts {Object}
 *        opts.action {BTNode} action that would be invoked if cond return true
 *        opts.cond(blackboard) {Cond} condition callback, return true or false.
 */
var Node = function(opts) {
  BTNode.call(this);

  this.action = new Sequence();

  var condition = new Condition({
    cond: opts.cond
  });

  this.action.addChild(condition);
  this.action.addChild(opts.action);
};
util.inherits(Node, BTNode);

module.exports = Node;

var pro = Node.prototype;

/**
 * Move the current mob into patrol module and remove it from ai module.
 *
 * @param {Object} blackboard shared data
 *
 * @return {Number} ai.RES_SUCCESS if everything ok;
 *                  ai.RES_FAIL if any error.
 */
pro.doAction = function(blackboard) {
  return this.action.doAction(blackboard);
};
