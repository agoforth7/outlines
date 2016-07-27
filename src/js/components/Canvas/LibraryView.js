// Takes a LineartCollection (this.collection) and renders a LibraryItemView for each
// LineartModel.

var Backbone = require('backbone');

var LibraryCategoryView = require('./LibraryCategoryView');

module.exports = Backbone.View.extend({

	tagName: 'ul',

	className: 'library-list',

	initialize: function (options) {
		this.onItemClick = options.onItemClick;
		this.collection.on('update', this.render.bind(this));
	},

	render: function () {
		console.log(this.collection.length);
		// TODO: Create a new LibraryCateogryView for each pre-determined category.
		// 
		// e.g.
		// 

		var beachCategoryView = new LibraryCategoryView({
			category: 'beach',
			collection: this.collection,
			onItemClick: this.onItemClick
		});

		beachCategoryView.render();
		this.$el.append(beachCategoryView.$el);

		var furnitureCategoryView = new LibraryCategoryView({
			category: 'furniture',
			collection: this.collection,
			onItemClick: this.onItemClick
		});

		furnitureCategoryView.render();
		this.$el.append(furnitureCategoryView.$el);
    }

});