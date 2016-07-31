var $ = require('jquery');
var Backbone = require('backbone');

var app = require('../App/appController');
var LoginView = require('./LoginView');
var UserModel = require('./UserModel');

module.exports = {

    userModel: new UserModel(),

    check: function (success) {
        var _this = this;

        this.userModel.check(success, function error() {
            Backbone.history.navigate('login', { trigger: true });
        });
    },

    login: function (credentials) {
        $.ajax('/auth/login', {
            method: 'POST',
            data: credentials,
            success: function () {
                Backbone.history.navigate('home', { trigger: true });
            },
            error: function () {
                throw new Error('There was an error logging in.');
            }
        });
    },

    logout: function () {
        $.ajax('/auth/login', {
            method: 'DELETE',
            success: function () {
                Backbone.history.navigate('login', { trigger: true });
            },
            error: function () {
                throw new Error('There was an error logging out.');
            }
        });
    },

    register: function (credentials, success, error) {
        var model = new UserModel(credentials);

        model.save(null, {
            success: success,
            error: error
        });
    },

    showLogin: function () {
        var _this = this;
        var loginView = new LoginView();

        app.showPage(loginView);

        loginView.on('login', function (credentials) {
            _this.login(credentials);
        });

        loginView.on('register', function (credentials) {
            _this.register(credentials, function () {
                loginView.showMessage('Registered succesfully! Log in with your new username and password.');
                Backbone.history.navigate('login', { trigger: true });
            }, function () {
                loginView.showMessage('Registration failed!'); 
            });
        });
    }

};