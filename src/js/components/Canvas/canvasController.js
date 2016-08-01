var PageModel = require('../Pages/PageModel');
var EditorView = require('./editorView');

var app = require('../App/appController');
var auth = require('../Auth/authController');
var LineartCollection = require('../Lineart/LineartCollection');

var library = new LineartCollection();
library.fetch();

module.exports = {
	
	showCanvas: function (id) {
		auth.check(function () {
			var page;
			var editorView;

			// If there was an id passed to showCanvas
			if (id) {
				// Create a new PageModel with the id
				page = new PageModel({ id: id });
				// Fetch it
				page.fetch({
					success: function () {
						// Create and render a editorView with the fetched model
						editorView = new EditorView({ 
							page: page,
							library: library
						});
						
						app.showPage(editorView);
					}
				});
			} else {
				// Create a new (blank) PageModel with no id
				page = new PageModel();
				// Create and render a editorView with a new page
				editorView = new EditorView({
					page: page,
					library: library
				});
				
				app.showPage(editorView);
			}
		});
	}

};