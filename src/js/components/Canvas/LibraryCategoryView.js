var Backbone = require('backbone');

var LibraryItemView = require('./LibraryItemView');

module.exports = Backbone.View.extend({

	className: 'library-category',

	tagName: 'ul',

	initialize: function (options) {
		// shows a LibraryItemView for each LineartModel that has a certain category name
		this.onItemClick = options.onItemClick;
		this.category = options.category;
	},

	render: function () {
		var _this = this;
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
				onClick: _this.onItemClick
			});
		});

		catListItems.forEach(function (view) {
			view.render()
			_this.$el.append(view.$el);
		});
	}

});