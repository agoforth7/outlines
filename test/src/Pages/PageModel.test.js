var PageModel = require('../../../src/js/components/Pages/PageModel');

describe('PageModel', function () {

	beforeEach(function () {
		this.model = new PageModel();
	});

	afterEach(function () {
		this.model = null;
	});

	it('has the "title" attribute default to "New Page"', function () {
		expect(this.model.get('title')).to.equal('New Page');
	});

	it('has the "objects" attribute default to an empty array', function () {
		expect(this.model.get('objects').length).to.equal(0);
	});

});