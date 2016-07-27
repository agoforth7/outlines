var Backbone = require('backbone');

var LibraryView = require('./LibraryView');

module.exports = Backbone.View.extend({

    className: 'canvas',

    events: {
        'click .save': 'onSaveClick',
        'keyup h2': 'onTitleKeyup',
        'click .reset': 'onResetClick'
    },

    initialize: function (options) {
        this.page = options.page;
        this.library = options.library;
        this.libraryView = new LibraryView({
            collection: this.library,
            onItemClick: this.onLibraryItemClick.bind(this)
        });
    },

    render: function () {
        this.$el.html(this.template({
        	title: this.page.get('title')
        }));
        this.libraryView.render();
        this.$('.library-region').append(this.libraryView.$el);
    },

    template: function (data) {
        return `
        	<h2 contenteditable>${data.title}</h2>
            <div class="library-region"></div>
            <canvas class="canvas"></canvas>
            <button class="reset">Reset</button>
        	<button class="save">Save</button>
        `;
    },

    onSaveClick: function () {
    	this.page.save();
    },

    onTitleKeyup: function () {
        var titleText = this.$('h2').text();

        this.page.set('title', titleText);
    },

    onResetClick: function () {
        this.page.set('objects', []);
    },

    onLibraryItemClick: function (lineartModel) {
        console.log(lineartModel);
        // TODO: Something like this.
        // var objects = this.page.get('objects');
        // objects.push({
        //     id: lineartModel.get('id'),
        //     x: 0,
        //     y: 0
        // });
    }

});