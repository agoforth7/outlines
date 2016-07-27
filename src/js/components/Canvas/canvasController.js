var PageModel = require('../Pages/PageModel');
var CanvasView = require('./CanvasView');

var app = require('../App/appController');
var auth = require('../Auth/authController');
var LineartCollection = require('../Lineart/LineartCollection');

var library = new LineartCollection();
library.fetch();

module.exports = {
	
	showCanvas: function (id) {
		auth.check(function () {
			var page;
			var canvasView;

			// If there was an id passed to showCanvas
			if (id) {
				// Create a new PageModel with the id
				page = new PageModel({ id: id });
				// Fetch it
				page.fetch({
					success: function () {
						// Create and render a CanvasView with the fetched model
						canvasView = new CanvasView({ 
							page: page,
							library: library
						});
						
						app.showPage(canvasView);
					}
				});
			} else {
				// Create a new (blank) PageModel with no id
				page = new PageModel();
				// Create and render a CanvasView with a new page
				canvasView = new CanvasView({
					page: page,
					library: library
				});
				
				app.showPage(canvasView);
			}
		});
	}

};