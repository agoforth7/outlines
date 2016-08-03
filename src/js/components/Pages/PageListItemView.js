// Renders info about a single PageModel.
var moment = require('moment');
var Backbone = require('backbone');

module.exports = Backbone.View.extend({

    className: 'page-item',

	events: {

		'click .page-thumb': 'onClick',
        'click .item-delete-button': 'onDeleteClick'

	},

    initialize: function () {
        this.listenTo(this.model, 'change sync', this.render);
    },

    render: function () {
        var date = moment(this.model.get('date')).format('M/D/YYYY');

		this.$el.html(this.model.get('title'));
        this.$el.html(this.template({
            date: date
        }));
    },

    template: function (data) {
        return `
            <div class="page-thumb">
                <h3 class="page-title">` + this.model.get('title') + `</div>
            </div>
            <time>${data.date}</time>
            <button class="item-delete-button">Delete</button>
        `;
    },

    onClick: function () {
		Backbone.history.navigate('canvas/' + this.model.get('id'), { trigger: true });
    },

    onDeleteClick: function () {
        this.model.destroy();
    }

});