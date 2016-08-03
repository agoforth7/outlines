var Backbone = require('backbone');

var PageListView = require('../Pages/PageListView');

module.exports = Backbone.View.extend({

    events: {
        'click .new-button': 'onNewClick'
    },

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
            <img class="logo-sub" src="assets/images/Logo-sub.svg">
            <button class="logout-button">
                <a href="#/logout">Logout</a>
            </button>
            <div class="gallery-intro">
                <h3>Welcome, ${data.username}.</h3>
                <p>Here’s your gallery! Revisit one of your past pages, or begin a new one!</p>
            </div>
            <button class="new-button">New Page</button>
            <div class="page-list-region clearfix"></div>
        `;
    },

    onNewClick: function () {
        Backbone.history.navigate('canvas', { trigger: true });
    }
});