var should = require('should');
var bt = require('../../');
var If = bt.If;

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

describe('If Test', function() {
  it('should invoke the action if condition return true', function() {
    var bb = {
      scount: 0, 
      fcount: 0, 
      wcount: 0
    };

    var cond = new bt.True();

    var i = new If({action: new SNode(), cond: cond});

    var res = i.doAction(bb);
    res.should.equal(bt.RES_SUCCESS);
    bb.scount.should.equal(1);
    bb.fcount.should.equal(0);
    bb.wcount.should.equal(0);
  });

  it('should return fail if condition return false', function() {
    var bb = {
      scount: 0, 
      fcount: 0, 
      wcount: 0
    };

    var cond = new bt.False();

    var i = new If({action: new SNode(), cond: cond});

    var res = i.doAction(bb);
    res.should.equal(bt.RES_FAIL);
    bb.scount.should.equal(0);
    bb.fcount.should.equal(0);
    bb.wcount.should.equal(0);
  });

  it('should return fail if action return false', function() {
    var bb = {
      scount: 0, 
      fcount: 0, 
      wcount: 0
    };

    var cond = new bt.True();

    var i = new If({action: new FNode(), cond: cond});

    var res = i.doAction(bb);
    res.should.equal(bt.RES_FAIL);
    bb.scount.should.equal(0);
    bb.fcount.should.equal(1);
    bb.wcount.should.equal(0);
  });

  it('should return wait if the child return wait and reenter the child directly in next tick', function() {
    var bb = {
      scount: 0, 
      fcount: 0, 
      wcount: 0
    };

    var Cond = function() {
      this.count = 0;
    };
    Cond.prototype.evaluate = function(bb)
    {
      this.count++;
      return true;
    };

    var cond = new Cond();

    var i = new If({action: new WNode(), cond: cond});

    var res = i.doAction(bb);
    res.should.equal(bt.RES_WAIT);
    bb.scount.should.equal(0);
    bb.fcount.should.equal(0);
    bb.wcount.should.equal(1);
    cond.count.should.equal(1);

    res = i.doAction(bb);
    res.should.equal(bt.RES_WAIT);
    bb.scount.should.equal(0);
    bb.fcount.should.equal(0);
    bb.wcount.should.equal(2);
    cond.count.should.equal(1);

    res = i.doAction(bb);
    res.should.equal(bt.RES_SUCCESS);
    bb.scount.should.equal(1);
    bb.fcount.should.equal(0);
    bb.wcount.should.equal(2);
    cond.count.should.equal(1);
  });
});
