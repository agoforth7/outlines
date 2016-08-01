// LibraryItemView takes a LineartModel (this.model) and displays a small thumnbail (SVG) of the lineart.
var Backbone = require('backbone');

module.exports = Backbone.View.extend({

	className: 'library-item',

	events: {
		'click': 'handleClick'
	},

	initialize: function (options) {
		this.onClick = options.onClick;
		this.textMode = options.textMode;
	},

	render: function () {
		if (this.textMode) {
			this.$el.html(this.textTemplate({
				title: this.model.get('title')
			}));
		} else {
			this.$el.html(this.template({
				img: this.model.get('img')
			}));
		}
	},

	template: function (data) {
		return `${data.img}`;
	},


	textTemplate: function (data) {
		return `${data.title}`;
	},

	handleClick: function () {
		this.onClick(this.model);
	}

});