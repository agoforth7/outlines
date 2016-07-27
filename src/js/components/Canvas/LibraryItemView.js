// LibraryItemView takes a LineartModel (this.model) and displays a small
// thumnbail (SVG) of the lineart.
var Backbone = require('backbone');

module.exports = Backbone.View.extend({

	className: 'library-item',

	tagName: 'li',

	events: {
		'click': 'handleClick'
	},

	initialize: function (options) {
		this.onClick = options.onClick;
	},

	render: function () {
		this.$el.html(this.template({
			img: this.model.get('img')
		}));
	},

	template: function (data) {
		return `${data.img}`;
	},

	handleClick: function () {
		this.onClick(this.model);
	}

});