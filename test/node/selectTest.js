var should = require('should');
var bt = require('../../');
var Select = bt.Select;

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

describe('Select Test', function() {
  it('should invoke one child only if success', function() {
    var bb = {
      scount: 0, 
      fcount: 0, 
      wcount: 0
    };
    var sl = new Select();
    sl.addChild(new SNode());
    sl.addChild(new SNode());
    sl.addChild(new SNode());

    var res = sl.doAction(bb);
    res.should.equal(bt.RES_SUCCESS);
    bb.scount.should.equal(1);
    bb.fcount.should.equal(0);
    bb.wcount.should.equal(0);

    res = sl.doAction(bb);
    res.should.equal(bt.RES_SUCCESS);
    bb.scount.should.equal(2);
    bb.fcount.should.equal(0);
    bb.wcount.should.equal(0);
  });

  it('should fail if all child fail', function() {
    var bb = {
      scount: 0, 
      fcount: 0, 
      wcount: 0
    };
    var sl = new Select();
    sl.addChild(new FNode());
    sl.addChild(new FNode());
    sl.addChild(new FNode());

    var res = sl.doAction(bb);
    res.should.equal(bt.RES_FAIL);
    bb.scount.should.equal(0);
    bb.fcount.should.equal(3);
    bb.wcount.should.equal(0);

    res = sl.doAction(bb);
    res.should.equal(bt.RES_FAIL);
    bb.scount.should.equal(0);
    bb.fcount.should.equal(6);
    bb.wcount.should.equal(0);
  });

  it('should success if and child success', function() {
    var bb = {
      scount: 0, 
      fcount: 0, 
      wcount: 0
    };
    var sl = new Select();
    sl.addChild(new FNode());
    sl.addChild(new SNode());
    sl.addChild(new FNode());

    var res = sl.doAction(bb);
    res.should.equal(bt.RES_SUCCESS);
    bb.scount.should.equal(1);
    bb.fcount.should.equal(1);
    bb.wcount.should.equal(0);

    res = sl.doAction(bb);
    res.should.equal(bt.RES_SUCCESS);
    bb.scount.should.equal(2);
    bb.fcount.should.equal(2);
    bb.wcount.should.equal(0);
  });

  it('should wait if any child wait and reenter the wating child directly on next tick', function() {
    var bb = {
      scount: 0, 
      fcount: 0, 
      wcount: 0
    };
    var sl = new Select();
    sl.addChild(new FNode());
    sl.addChild(new WNode());
    sl.addChild(new SNode());

    var res = sl.doAction(bb);
    res.should.equal(bt.RES_WAIT);
    bb.scount.should.equal(0);
    bb.fcount.should.equal(1);
    bb.wcount.should.equal(1);

    res = sl.doAction(bb);
    res.should.equal(bt.RES_WAIT);
    bb.scount.should.equal(0);
    bb.fcount.should.equal(1);
    bb.wcount.should.equal(2);

    res = sl.doAction(bb);
    res.should.equal(bt.RES_SUCCESS);
    bb.scount.should.equal(1);
    bb.fcount.should.equal(1);
    bb.wcount.should.equal(2);
  });
});
