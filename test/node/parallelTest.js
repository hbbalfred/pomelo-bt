var should = require('should');
var bt = require('../../');
var Parallel = bt.Parallel;

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

describe('Parallel Test', function() {
  it('should invoke the children in parallel', function() {
    var bb = {
      scount: 0, 
      fcount: 0, 
      wcount: 0
    };
    var pl = new Parallel();
    pl.addChild(new SNode());
    pl.addChild(new SNode());
    pl.addChild(new SNode());

    var res = pl.doAction(bb);
    res.should.equal(bt.RES_SUCCESS);
    bb.scount.should.equal(3);
    bb.fcount.should.equal(0);
    bb.wcount.should.equal(0);

    res = pl.doAction(bb);
    res.should.equal(bt.RES_SUCCESS);
    bb.scount.should.equal(6);
    bb.fcount.should.equal(0);
    bb.wcount.should.equal(0);
  });

  it('should fail if any child fail in fail on one policy', function() {
    var bb = {
      scount: 0, 
      fcount: 0, 
      wcount: 0
    };
    var pl = new Parallel({blackboard: bb, policy: Parallel.POLICY_FAIL_ON_ONE});
    pl.addChild(new SNode());
    pl.addChild(new FNode());
    pl.addChild(new SNode());

    var res = pl.doAction(bb);
    res.should.equal(bt.RES_FAIL);
    bb.scount.should.equal(2);
    bb.fcount.should.equal(1);
    bb.wcount.should.equal(0);

    res = pl.doAction(bb);
    res.should.equal(bt.RES_FAIL);
    bb.scount.should.equal(4);
    bb.fcount.should.equal(2);
    bb.wcount.should.equal(0);
  });

  it('should fail if and only if all children fail in fail on all policy', function() {
    var bb = {
      scount: 0, 
      fcount: 0, 
      wcount: 0
    };
    var pl = new Parallel({blackboard: bb, policy: Parallel.POLICY_FAIL_ON_ALL});
    pl.addChild(new FNode());
    pl.addChild(new FNode());
    pl.addChild(new FNode());

    var res = pl.doAction(bb);
    res.should.equal(bt.RES_FAIL);
    bb.scount.should.equal(0);
    bb.fcount.should.equal(3);
    bb.wcount.should.equal(0);

    bb.fcount = 0;
    pl.addChild(new SNode());
    res = pl.doAction(bb);
    res.should.equal(bt.RES_SUCCESS);
    bb.scount.should.equal(1);
    bb.fcount.should.equal(3);
    bb.wcount.should.equal(0);
  });

  it('should wait if any child wait and reenter the wating child directly on next tick', function() {
    var bb = {
      scount: 0, 
      fcount: 0, 
      wcount: 0
    };
    var pl = new Parallel();
    pl.addChild(new SNode());
    pl.addChild(new WNode());
    pl.addChild(new SNode());

    var res = pl.doAction(bb);
    res.should.equal(bt.RES_WAIT);
    bb.scount.should.equal(2);
    bb.fcount.should.equal(0);
    bb.wcount.should.equal(1);

    res = pl.doAction(bb);
    res.should.equal(bt.RES_WAIT);
    bb.scount.should.equal(2);
    bb.fcount.should.equal(0);
    bb.wcount.should.equal(2);

    res = pl.doAction(bb);
    res.should.equal(bt.RES_SUCCESS);
    bb.scount.should.equal(3);
    bb.fcount.should.equal(0);
    bb.wcount.should.equal(2);
  });
});
