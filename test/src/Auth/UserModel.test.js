var UserModel = require('../../../src/js/components/Auth/UserModel');

describe('UserModel', function () {

	beforeEach(function () {
		this.model = new UserModel();
	});

	afterEach(function () {
		this.model = null;
	});

	it('has the"username" attribute default to an empty string', function () {
		expect(this.model.get('username')).to.equal('');
	});

});