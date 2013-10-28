var should = require('should');
var bt = require('../../');
var Loop = bt.Loop;

var SNode = function() {
};
SNode.prototype = {
  doAction: function(bb) {
    bb.scount++;
    return bt.RES_SUCCESS;
  }
};

var FNode = function() {
};
FNode.prototype = {
  doAction: function(bb) {
    bb.fcount++;
    return bt.RES_FAIL;
  }
};

var WNode = function() {
};
WNode.prototype = {
  doAction: function(bb) {
    if(bb.wcount < 2) {
      bb.wcount++;
      return bt.RES_WAIT;
    } else {
      bb.scount++;
      return bt.RES_SUCCESS;
    }
  }
};

describe('Loop Test', function() {
  it('should invoke the child in loop', function() {
    var bb = {
      scount: 0, 
      fcount: 0, 
      wcount: 0
    };

    var LoopCondition = function ()
    {
      this.count = 0;
    };
    LoopCondition.prototype.evaluate = function(bb)
    {
      this.count++;
      return bb.scount <= 2;
    };

    var lc = new LoopCondition();

    var loop = new Loop({action: new SNode(), cond: lc});

    var res = loop.doAction(bb);
    res.should.equal(bt.RES_WAIT);
    bb.scount.should.equal(1);
    bb.fcount.should.equal(0);
    bb.wcount.should.equal(0);
    lc.count.should.equal(1);

    res = loop.doAction(bb);
    res.should.equal(bt.RES_WAIT);
    bb.scount.should.equal(2);
    bb.fcount.should.equal(0);
    bb.wcount.should.equal(0);
    lc.count.should.equal(2);

    res = loop.doAction(bb);
    res.should.equal(bt.RES_SUCCESS);
    bb.scount.should.equal(3);
    bb.fcount.should.equal(0);
    bb.wcount.should.equal(0);
    lc.count.should.equal(3);
  });

  it('should return fail and break loop if child return fail', function() {
    var bb = {
      scount: 0, 
      fcount: 0, 
      wcount: 0
    };
    
    var LoopCondition = function ()
    {
      this.count = 0;
    };
    LoopCondition.prototype.evaluate = function(bb)
    {
      //should never enter here
      this.count++;
      return true;
    };

    var lc = new LoopCondition();

    var loop = new Loop({action: new FNode(), cond: lc});

    var res = loop.doAction(bb);
    res.should.equal(bt.RES_FAIL);
    bb.scount.should.equal(0);
    bb.fcount.should.equal(1);
    bb.wcount.should.equal(0);
    lc.count.should.equal(0);

    res = loop.doAction(bb);
    res.should.equal(bt.RES_FAIL);
    bb.scount.should.equal(0);
    bb.fcount.should.equal(2);
    bb.wcount.should.equal(0);
    lc.count.should.equal(0);
  });

  it('should return wait when the child return wait', function() {
    var bb = {
      scount: 0, 
      fcount: 0, 
      wcount: 0
    };

    var LoopCondition = function ()
    {
      this.count = 0;
    };
    LoopCondition.prototype.evaluate = function(bb)
    {
      this.count++;
      return false;
    };

    var lc = new LoopCondition();

    var loop = new Loop({action: new WNode(), cond: lc});
    var res = loop.doAction(bb);
    res.should.equal(bt.RES_WAIT);
    bb.scount.should.equal(0);
    bb.fcount.should.equal(0);
    bb.wcount.should.equal(1);
    lc.count.should.equal(0);

    res = loop.doAction(bb);
    res.should.equal(bt.RES_WAIT);
    bb.scount.should.equal(0);
    bb.fcount.should.equal(0);
    bb.wcount.should.equal(2);
    lc.count.should.equal(0);

    res = loop.doAction(bb);
    res.should.equal(bt.RES_SUCCESS);
    bb.scount.should.equal(1);
    bb.fcount.should.equal(0);
    bb.wcount.should.equal(2);
    lc.count.should.equal(1);
  });
});
