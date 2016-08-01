var Backbone = require('backbone');

var LibraryItemView = require('./LibraryItemView');

module.exports = Backbone.View.extend({

	className: 'library-category',

	tagName: 'div',

	events: {
		'click h3': 'onClick'
	},

	initialize: function (options) {
		// shows a LibraryItemView for each LineartModel that has a certain category name
		this.onItemClick = options.onItemClick;
		this.category = options.category;
		this.textMode = options.textMode;
	},

	render: function () {
		var _this = this;

		var title = this.category[0].toUpperCase() + this.category.slice(1);

		this.$el.html(this.template({
			title: title
		}))

		// Display only the lineartModels who's tags contain the category of this LibraryCategoryView.
		var catList = this.collection.filter(function (model) {
			var tags = model.get('tags');
			var category = _this.category;

			if (tags.indexOf(category) > -1) {
				return true;
			}
		});

		var catListItems = catList.map(function (model) {
			return new LibraryItemView({
				model: model,
				onClick: _this.onItemClick,
				textMode: _this.textMode
			});
		});

		catListItems.forEach(function (view) {
			view.render()
			_this.$('.list-region').append(view.$el);
		});
	},

	template: function (data) {
		return `
			<h3>${data.title}</h3>
			<div class="list-region"></div>
		`;
	},

	onClick: function () {
		this.$el.toggleClass('expanded');
	}

});