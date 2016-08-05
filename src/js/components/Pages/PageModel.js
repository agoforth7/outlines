var Backbone = require('backbone');

var auth = require('../Auth/authController');

var PageModel = Backbone.Model.extend({

	defaults: {
		title: 'New Page',
		mode: 'simple',
		objects: []
	},

	initialize: function () {
		if (this.isNew()) {
			this.set('date', new Date().getTime());
		}
	},
	
	urlRoot: function () {
		return 'users/' + auth.userModel.get('id') + '/pages';
	}

});

module.exports = PageModel;