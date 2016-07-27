var $ = require('jquery');
var Backbone = require('backbone');

var app = require('./components/App/appController');
var AppRouter = require('./components/App/AppRouter');

var router = new AppRouter();

app.appView.render();

$(document.body).append(app.appView.$el);

Backbone.history.start();