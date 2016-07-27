var PageCollection = require('../../../src/js/components/Pages/PageCollection');

var PageModel = require('../../../src/js/components/Pages/PageModel');

describe('PageCollection', function () {

	beforeEach(function () {
		this.collection = new PageCollection();
	});

	afterEach(function () {
		this.collection = null;
	});

	it('has the value of the "model" property set to "PageModel"', function () {
		expect(PageCollection.prototype.model).to.equal(PageModel);
	});

});