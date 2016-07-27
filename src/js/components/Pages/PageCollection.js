var Backbone = require('backbone');

var PageModel = require('./PageModel');

var auth = require('../Auth/authController');

var PageCollection = Backbone.Collection.extend({

	model: PageModel,

	url: function () {
		return 'users/' + auth.userModel.get('id') + '/pages';
	}

});

module.exports = PageCollection;