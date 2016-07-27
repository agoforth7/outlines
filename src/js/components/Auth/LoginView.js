var Backbone = require('backbone');

var auth = require('./authController');

module.exports = Backbone.View.extend({

    className: 'login-container',

    events: {
        'click .login-button': 'onLoginClick'
    },

    render: function () {
        this.$el.html(this.template());
    },

    template: function () {
        console.log('Getting anything?');
        return `
            <img class="main-logo" src="assets/images/Logo.svg">
            <p class="intro">Helvetica salvia sustainable pork belly. Humblebrag sartorial street art, retro chambray kitsch blog deep v food truck fanny pack bespoke mumblecore. Shabby chic paleo chillwave selfies salvia helvetica VHS, raw denim keytar. Typewriter whatever tumblr, craft beer paleo before they sold out pop-up street art chia tote bag knausgaard. Franzen raw denim viral mixtape.</p>
            <div class="button-box">
                <button class="login-signup">Login</button>
                <button class="login-signup"><a href="#/register">Sign Up</a></button>
            </div>
            <div class="form-container">
                <label for="username"></label>
                <input id="username" type="text" name="username" placeholder="Username">
                <label for="password"></label>
                <input id="password" type="text" name="password" placeholder="Password">
                <button class="submit-button">Submit</button>
            </div>
        `;
    },

    onLoginClick: function () {
        this.trigger('submit', {
            username: this.$('#username').val(),
            password: this.$('#password').val()
        });
    }

});