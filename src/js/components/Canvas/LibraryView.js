// Takes a LineartCollection (this.collection) and renders a LibraryCategoryView for each category

var Backbone = require('backbone');

var LibraryCategoryView = require('./LibraryCategoryView');

module.exports = Backbone.View.extend({

	className: 'library',

	initialize: function (options) {
		this.onItemClick = options.onItemClick;
		this.collection.on('update', this.render.bind(this));
	},

	render: function () {
		this.$el.empty();

		var backgroundsCategoryView = new LibraryCategoryView({
			category: 'backgrounds',
			collection: this.collection,
			onItemClick: this.onItemClick,
			textMode: true
		});

		backgroundsCategoryView.render();
		this.$el.append(backgroundsCategoryView.$el);

		var weatherCategoryView = new LibraryCategoryView({
			category: 'weather',
			collection: this.collection,
			onItemClick: this.onItemClick
		});

		weatherCategoryView.render();
		this.$el.append(weatherCategoryView.$el);

		var animalsCategoryView = new LibraryCategoryView({
			category: 'animals',
			collection: this.collection,
			onItemClick: this.onItemClick
		});

		animalsCategoryView.render();
		this.$el.append(animalsCategoryView.$el);

		var birdsCategoryView = new LibraryCategoryView({
			category: 'birds',
			collection: this.collection,
			onItemClick: this.onItemClick
		});

		birdsCategoryView.render();
		this.$el.append(birdsCategoryView.$el);

		var fishCategoryView = new LibraryCategoryView({
			category: 'fish',
			collection: this.collection,
			onItemClick: this.onItemClick
		});

		fishCategoryView.render();
		this.$el.append(fishCategoryView.$el);

		var plantsCategoryView = new LibraryCategoryView({
			category: 'plants',
			collection: this.collection,
			onItemClick: this.onItemClick
		});

		plantsCategoryView.render();
		this.$el.append(plantsCategoryView.$el);

		var objectsCategoryView = new LibraryCategoryView({
			category: 'objects',
			collection: this.collection,
			onItemClick: this.onItemClick
		});

		objectsCategoryView.render();
		this.$el.append(objectsCategoryView.$el);
    }

});