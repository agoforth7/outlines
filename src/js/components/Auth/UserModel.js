var Backbone = require('backbone');

module.exports = Backbone.Model.extend({

    urlRoot: '/users',

    defaults: {
        username: ''
    },

    check: function (success, error) {
        this.fetch({
            url: '/auth/check',
            success: success,
            error: error
        });
    }

});