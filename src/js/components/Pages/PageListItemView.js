// Renders info about a single PageModel.

var Backbone = require('backbone');

module.exports = Backbone.View.extend({

	events: {

		'click': 'onClick'

	},

    initialize: function () {
        this.listenTo(this.model, 'change sync', this.render);
    },

    render: function () {
		this.$el.html(this.model.get('title'));
    },

    onClick: function () {
		Backbone.history.navigate('canvas/' + this.model.get('id'), { trigger: true });
    }

});