var Backbone = require('backbone');

var auth = require('../Auth/authController');

var PageModel = Backbone.Model.extend({

	defaults: {

		title: 'New Page',
		objects: []

	},
	
	urlRoot: function () {
		return 'users/' + auth.userModel.get('id') + '/pages';
	}

});

module.exports = PageModel;