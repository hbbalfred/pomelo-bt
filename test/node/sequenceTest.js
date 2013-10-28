var should = require('should');
var bt = require('../../');
var Sequence = bt.Sequence;

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

describe('Sequence Test', function() {
  it('should invoke the children one by one', function() {
    var bb = {
      scount: 0, 
      fcount: 0, 
      wcount: 0
    };
    var sq = new Sequence({});
    sq.addChild(new SNode());
    sq.addChild(new SNode());
    sq.addChild(new SNode());

    var res = sq.doAction(bb);
    res.should.equal(bt.RES_SUCCESS);
    bb.scount.should.equal(3);
    bb.fcount.should.equal(0);
    bb.wcount.should.equal(0);

    res = sq.doAction(bb);
    res.should.equal(bt.RES_SUCCESS);
    bb.scount.should.equal(6);
    bb.fcount.should.equal(0);
    bb.wcount.should.equal(0);
  });

  it('should fail if any child fail', function() {
    var bb = {
      scount: 0, 
      fcount: 0, 
      wcount: 0
    };
    var sq = new Sequence({});
    sq.addChild(new SNode());
    sq.addChild(new FNode());
    sq.addChild(new SNode());

    var res = sq.doAction(bb);
    res.should.equal(bt.RES_FAIL);
    bb.scount.should.equal(1);
    bb.fcount.should.equal(1);
    bb.wcount.should.equal(0);

    res = sq.doAction(bb);
    res.should.equal(bt.RES_FAIL);
    bb.scount.should.equal(2);
    bb.fcount.should.equal(2);
    bb.wcount.should.equal(0);

  });

  it('should wait if any child wait and reenter the waiting child directly on next tick', function() {
    var bb = {
      scount: 0, 
      fcount: 0, 
      wcount: 0
    };
    var sq = new Sequence({});
    sq.addChild(new SNode());
    sq.addChild(new WNode());
    sq.addChild(new SNode());

    var res = sq.doAction(bb);
    res.should.equal(bt.RES_WAIT);
    bb.scount.should.equal(1);
    bb.fcount.should.equal(0);
    bb.wcount.should.equal(1);

    res = sq.doAction(bb);
    res.should.equal(bt.RES_WAIT);
    bb.scount.should.equal(1);
    bb.fcount.should.equal(0);
    bb.wcount.should.equal(2);

    res = sq.doAction(bb);
    res.should.equal(bt.RES_SUCCESS);
    bb.scount.should.equal(3);
    bb.fcount.should.equal(0);
    bb.wcount.should.equal(2);
  });
});
