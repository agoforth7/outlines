var Backbone = require('backbone');

var LineartModel = require('./LineartModel');

var LineartCollection = Backbone.Collection.extend({

	model: LineartModel,

	url: '/lineart'

});

module.exports = LineartCollection;