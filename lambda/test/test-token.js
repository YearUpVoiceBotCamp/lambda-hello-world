var expect  = require('chai').expect;
var index = require('../index.js');
var blah = function(){};
var launch = index.ut.LaunchRequest;
it('test launch', function() {
    expect(launch).to.not.equal(undefined);
});