var Backbone = require('backbone');

var LibraryView = require('./LibraryView');
var CanvasView = require('./CanvasView-original');
var LayerView = require('./LayerView');

module.exports = Backbone.View.extend({

    className: 'editor',

    events: {
        'click .save': 'onSaveClick',
        'keyup h2': 'onTitleKeyup',
        'click .return-button': 'onReturnClick',
        'click .reset': 'onResetClick',
        'click .print': 'onPrintClick',
        'mouseup .canvas-region': 'onCanvasMouseup',
        'click .mosaic-mode': 'onMosaicModeClick',
        'click .simple-mode': 'onSimpleModeClick'
    },

    initialize: function (options) {
        this.onCanvasSelect = this.onCanvasSelect.bind(this);
        this.onCanvasMove = this.onCanvasMove.bind(this);

        this.page = options.page;
        this.library = options.library;

        this.libraryView = new LibraryView({
            collection: this.library,
            onItemClick: this.onLibraryItemClick.bind(this)
        });
        
        this.canvasView = new CanvasView({
            page: this.page,
            library: this.library
        });
        
        // this.layers = options.layers;
        
        // this.layerView = new LayerView({
        //     model: this.layers
        // });

        this.listenTo(this.canvasView, 'select', this.onCanvasSelect);
        this.listenTo(this.canvasView, 'move', this.onCanvasMove);
        this.listenTo(this.canvasView, 'up', this.onCanvasUp);
    },

    render: function () {
        var _this = this;
        this.$el.html(this.template({
        	title: this.page.get('title')
        }));
        this.libraryView.render();
        this.$('.library-region').append(this.libraryView.$el);
        // this.layerView.render();
        // this.$('.layers-region').append(this.layerView.$el);
        this.canvasView.render();
        this.$('.canvas-region').append(this.canvasView.$el);
        this.canvasView.start();
    },

    template: function (data) {
        return `
        	<h2 contenteditable>${data.title}</h2>
            <button class="return-button">Return to Dashboard</button>
            <div class="editor cf">
                <div class="library-region"></div>
                <div class="canvas-region"></div>
                <div class="button-container">
                    <button class="save">Save</button>
                    <button class="reset">Reset</button>
                    <button class="print">Print</button>
                    <button class="simple-mode">Simple</button>
                    <button class="mosaic-mode">Mosaic</button>
                </div>
            </div>
        `;
    },

    onSaveClick: function () {
        var _this = this;

        // Update the date to now...
        this.page.set('date', new Date().getTime());
    	this.page.save(null, {
            success: function () {
                Backbone.history.navigate('canvas/' + _this.page.get('id'));
            }
        });
        // TODO: generate the date the page was saved
    },

    onTitleKeyup: function () {
        var titleText = this.$('h2').text();

        this.page.set('title', titleText);
    },

    onReturnClick: function () {
        Backbone.history.navigate('#home', { trigger: true });
    },

    onResetClick: function () {
        this.page.set('objects', []);
    },

    onPrintClick: function () {
        var win = window.open();
        win.document.write(`
            <style>
                body { margin: 0; }
            </style>
            <img style="height: 100%" src="${this.canvasView.el.toDataURL()}">
        `);
        win.print();
        win.location.reload();
    },

    onLibraryItemClick: function (lineartModel) {
        // TODO: Something like this.
        var objects = this.page.get('objects');
        objects.push({
            lineartId: lineartModel.get('id'),
            x: 0,
            y: 0
        });
    },

    onCanvasSelect: function (object, offsetX, offsetY) {
        this.dragging = object;
        this.draggingOffsetX = offsetX;
        this.draggingOffsetY = offsetY;
    },

    onCanvasMove: function (x, y) {
        if (!this.dragging) {
            return;
        }

        this.dragging.x = x - this.draggingOffsetX;
        this.dragging.y = y - this.draggingOffsetY;
    },

    onCanvasUp: function (x, y) {
        this.dragging = null;
    },

    onMosaicModeClick: function () {
        this.page.set('mode', 'mosaic');
        this.canvasView.clearImages();
    },

    onSimpleModeClick: function () {
        this.page.set('mode', 'simple');
        this.canvasView.clearImages();
    },

    remove: function () {
        this.canvasView.remove();
        Backbone.View.prototype.remove.call(this);
    }

});