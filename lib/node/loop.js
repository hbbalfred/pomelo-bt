var bt = require('../bt');
var util = require('util');
var Decorator = require('./decorator');

/**
 * Loop node: a decorator node that invoke child in loop.
 *
 * @param opts {Object} 
 *        opts.action {Object} origin action that is decorated
 *        opts.cond(blackboard) {Cond} loop condition callback. Return true to continue the loop.
 * @return {Number} 
 *          bt.RES_SUCCESS if loop finished successfully;
 *          bt.RES_FAIL and break loop if child return fail;
 *          bt.RES_WAIT if child return wait or loop is continue.
 */
var Node = function(opts) {
  Decorator.call(this, opts.action);
  this.cond = opts.cond;
};

util.inherits(Node, Decorator);

module.exports = Node;

var pro = Node.prototype;

pro.doAction = function(blackboard) {
  var res = this.child.doAction(blackboard);
  if(res !== bt.RES_SUCCESS) {
    return res;
  }

  if(this.cond && this.cond.evaluate(blackboard)) {
    //wait next tick
    return bt.RES_WAIT;
  }

  return bt.RES_SUCCESS;
};
