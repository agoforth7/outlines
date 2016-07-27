var LineartCollection = require('../../../src/js/components/Lineart/LineartCollection');

var LineartModel = require('../../../src/js/components/Lineart/LineartModel');

describe('LineartCollection', function () {

	beforeEach(function () {
		this.collection = new LineartCollection();
	});

	afterEach(function () {
		this.collection = null;
	});

	it('has the value of the "model" property set to "LineartModel"', function () {
		expect(LineartCollection.prototype.model).to.equal(LineartModel);
	});

	it('has the value of the "url" property set to "/lineart"', function () {
		expect(LineartCollection.prototype.url).to.equal('/lineart');
	});

});