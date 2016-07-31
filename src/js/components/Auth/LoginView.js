var Backbone = require('backbone');

var auth = require('./authController');

module.exports = Backbone.View.extend({

    className: 'login-container',

    events: {
        'click .login-button': 'onLoginClick',
        'click .signup-button': 'onSignupClick',
        'click .submit-button': 'onSubmitClick',
        'keyup #password': 'onKeyup'
    },

    render: function () {
        this.mode = 'login';
        this.$el.html(this.template());
    },

    template: function () {
        return `
            <img class="main-logo" src="assets/images/Logo.svg">
            <p class="intro">Helvetica salvia sustainable pork belly. Humblebrag sartorial street art, retro chambray kitsch blog deep v food truck fanny pack bespoke mumblecore. Shabby chic paleo chillwave selfies salvia helvetica VHS, raw denim keytar. Typewriter whatever tumblr, craft beer paleo before they sold out pop-up street art chia tote bag knausgaard. Franzen raw denim viral mixtape.</p>
            <div class="button-box">
                <button class="login-button">Login</button>
                <button class="signup-button">Sign Up</button>
            </div>
            <div class="message"></div>
            <div class="form-container">
                <label for="username"></label>
                <input id="username" type="text" name="username" placeholder="Username">
                <label for="password"></label>
                <input id="password" type="password" name="password" placeholder="Password">
                <button class="submit-button">Submit</button>
            </div>
        `;
    },

    onLoginClick: function () {
        this.mode = 'login';
        this.updateButtons();
        this.showForm();
    },

    onSignupClick: function () {
        this.mode = 'register';
        this.updateButtons();
        this.showForm();
    },

    showForm: function () {
        this.$el.find('input').val('');
        this.$el.find('.form-container').addClass('active');
    },

    onSubmitClick: function () {
        this.trigger(this.mode, {
            username: this.$('#username').val(),
            password: this.$('#password').val()
        });
        this.$el.find('.form-container').removeClass('active');
    },

    updateButtons: function () {
        // use this.mode to toggle a class on buttons
        var logButton = this.$el.find('.login-button');
        var signButton = this.$el.find('.signup-button');

        if (this.mode === 'login') {
            signButton.removeClass('button-select');
            logButton.addClass('button-select');
        } else {
            logButton.removeClass('button-select');
            signButton.addClass('button-select');
        }
    },

    showMessage: function (message) {
        var el = this.$el.find('.message');
        el.addClass('visible');
        el.text(message);
    },

    onKeyup: function (e) {
        if (e.keyCode === 13) {
            this.onSubmitClick();
        }
    }

    // onLoginClick: function () {
        // this.trigger('submit', {
        //     username: this.$('#username').val(),
        //     password: this.$('#password').val()
        // });
    // }

});