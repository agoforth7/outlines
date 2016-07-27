var Backbone = require('backbone');
var DashboardView = require('./DashboardView');

var app = require('../App/appController');
var auth = require('../Auth/authController');

var PageCollection = require('../Pages/PageCollection');

module.exports = {

    showDashboard: function () {
		auth.check(function () {
			var pages = new PageCollection();
			
			pages.fetch();

			var dashboardView = new DashboardView({
				user: auth.userModel,
				pages: pages
			});

			app.showPage(dashboardView);
		});
    }

};