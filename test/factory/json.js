var should = require('should');
var bt = require('../../');
var marine = require('./marine');
var factory = require('../../factory/json');

var json = {
	"type" : ""
};

describe('JSON Factory test', function() {
	it('should return true', function () {

		factory.parse( json, marine );
	});
});