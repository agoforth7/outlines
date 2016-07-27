// Takes a PageCollection and renders each model in the collection as a 
// PageListItemView.

var $ = require('jquery');
var Backbone = require('backbone');

var PageListItemView = require('./PageListItemView');

module.exports = Backbone.View.extend({

	events: {
		'click .create': 'onCreateClick'
	},

    initialize: function () {
		this.childViews = [];
        this.listenTo(this.collection, 'update', this.render);
    },

    render: function () {
		var _this = this;

		this.$el.html(this.template());

		// Remove any previous views.
		this.childViews.forEach(function (view) {
			view.remove();
		});

		// Set this.childViews to the next set of child views.
		this.childViews = this.collection.map(function (model) {
			return new PageListItemView({
				model: model
			});
		});

		// Render each child view and append it to the PageListView.
		this.childViews.forEach(function (view) {
			view.render();
			_this.$el.prepend(view.el);
		});
    },

    template: function () {
    	return `<button class="create">Create</button>`;
    },

    onCreateClick: function () {
		Backbone.history.navigate('canvas', { trigger: true });
    }

});