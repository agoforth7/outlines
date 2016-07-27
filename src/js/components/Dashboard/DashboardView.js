var Backbone = require('backbone');

var PageListView = require('../Pages/PageListView');

module.exports = Backbone.View.extend({

    initialize: function (options) {
        this.user = options.user;
        this.pages = options.pages;
        this.pageListView = new PageListView({ collection: this.pages });
        this.listenTo(this.user, 'change', this.render);
    },

    render: function () {
        this.$el.html(this.template(this.user.toJSON()));
        this.pageListView.render();
        this.$('.page-list-region').append(this.pageListView.$el);
    },

    template: function (data) {
        return `
            <h3>Welcome, ${data.username}.</h3>
            <a href="#/logout">Logout</a>
            <div class="page-list-region"></div>
        `;
    }

});